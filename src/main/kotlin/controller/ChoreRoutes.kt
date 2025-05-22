package dev.vulnerius.controller

import dev.vulnerius.model.*
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

fun Route.choreRoutes() {

    route("/chores") {

        get {
            val chores = transaction {
                Chores.selectAll().map {
                    ChoreResponseDTO(
                        id = it[Chores.id].value,
                        title = it[Chores.title],
                        weekday = it[Chores.weekday]
                    )
                }
            }
            call.respond(chores)
        }

        get("/{date}") {
            val dateParam = call.parameters["date"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val date = LocalDate.parse(dateParam)
            val weekday = date.dayOfWeek.value

            val logs = transaction {
                ChoreLogs.innerJoin(Chores)
                    .select ( ChoreLogs.date eq date )
                    .map {
                        ChoreLogResponseDTO(
                            choreId = it[ChoreLogs.chore].value,
                            completed = it[ChoreLogs.completed]
                        )
                    }
            }
            call.respond(logs)
        }

        post {
            val dto = call.receive<CreateChoreDTO>()
            val id = transaction {
                Chores.insertAndGetId {
                    it[title] = dto.title
                    it[weekday] = dto.weekday
                    it[createdAt] = LocalDate.now()
                }.value
            }
            call.respond(HttpStatusCode.Created, ChoreResponseDTO(id, dto.title, dto.weekday))
        }

        post("/log") {
            val dto = call.receive<ChoreLogDTO>()
            val date = LocalDate.parse(dto.date)

            transaction {
                ChoreLogs.insertIgnore {
                    it[chore] = EntityID(dto.choreId, Chores)
                    it[ChoreLogs.date] = date
                    it[completed] = dto.completed
                }
            }
            call.respond(HttpStatusCode.OK, mapOf("status" to "saved"))
        }
    }
}
