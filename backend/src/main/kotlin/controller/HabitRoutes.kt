package dev.vulnerius.controller

import dev.vulnerius.model.HabitLogs
import dev.vulnerius.model.Habits
import dev.vulnerius.model.dto.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

fun Route.habitRoutes() {

    route("/habits") {

        get {
            val habits = transaction {
                Habits.selectAll().map {
                    HabitResponseDTO(
                        id = it[Habits.id].value,
                        title = it[Habits.title]
                    )
                }
            }
            if (habits.isEmpty()) {
                return@get call.respond(HttpStatusCode.NoContent, emptyList<HabitResponseDTO>())
            }
            call.respond(HttpStatusCode.OK, habits)
        }

        post {
            val dto = call.receive<CreateHabitDTO>()
            val id = transaction {
                Habits.insertAndGetId {
                    it[title] = dto.title
                    it[createdAt] = LocalDate.now()
                }.value
            }
            call.respond(HttpStatusCode.Created, HabitResponseDTO(id, dto.title))
        }

        get("/{id}/logs/completed") {
            val habitId = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest, "Invalid habitId")
            val logs = transaction {
                HabitLogs.selectAll().where {
                    (HabitLogs.habit eq habitId) and (HabitLogs.completed eq true)
                }.map {
                    HabitLogResponseDTO(
                        habitId = it[HabitLogs.habit].value,
                        date = it[HabitLogs.date].toString(),
                        completed = true
                    )
                }.sortedByDescending { it.date } // optional: vom neuesten zum ältesten
            }

            call.respond(logs)
        }

        get("/{date}") {
            val dateParam =
                call.parameters["date"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Missing date")
            val date = LocalDate.parse(dateParam)

            val logs = transaction {
                HabitLogs
                    .selectAll()
                    .where(HabitLogs.date eq date).map {
                        HabitLogResponseDTO(
                            habitId = it[HabitLogs.habit].value,
                            date = it[HabitLogs.date].toString(),
                            completed = it[HabitLogs.completed]
                        )
                    }
            }
            call.respond(logs)
        }

        delete("/{habitId}") {
            val habitId = call.parameters["habitId"]?.toIntOrNull()
                ?: return@delete call.respond(HttpStatusCode.BadRequest, "Invalid habitId")

            transaction {
                HabitLogs.deleteWhere { habit eq habitId }
                Habits.deleteWhere { Habits.id eq habitId }
            }

            call.respond(HttpStatusCode.NoContent)
        }

        post("/log") {
            val dto = call.receive<HabitLogDTO>()
            val date = LocalDate.parse(dto.date)

            transaction {
                val existing = HabitLogs.selectAll().where {
                    (HabitLogs.habit eq dto.habitId) and (HabitLogs.date eq date)
                }.singleOrNull()

                if (existing != null) {
                    return@transaction HabitLogs.update({
                        (HabitLogs.habit eq dto.habitId) and (HabitLogs.date eq date)
                    }) {
                        it[completed] = dto.completed
                    }
                } else {
                    // insert new Log
                    return@transaction HabitLogs.insertAndGetId {
                        it[habit] = EntityID(dto.habitId, Habits)
                        it[HabitLogs.date] = date
                        it[completed] = dto.completed
                    }
                }
            }

            call.respond(
                HabitLogResponseDTO(
                    habitId = dto.habitId,
                    date = dto.date,
                    completed = dto.completed
                )
            )
        }
    }
}
