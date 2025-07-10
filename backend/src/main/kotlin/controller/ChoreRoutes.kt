package dev.vulnerius.controller

import dev.vulnerius.model.*
import dev.vulnerius.model.ChoreLogs.chore
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

            val result = transaction {
                val chores = Chores.selectAll().where {
                    Chores.weekday eq weekday
                }.map {
                    val choreId = it[Chores.id].value
                    val log = ChoreLogs.selectAll().where {
                        (ChoreLogs.chore eq choreId) and (ChoreLogs.date eq date)
                    }.singleOrNull()

                    ChoreResponseDateDTO(
                        ChoreResponseDTO(
                            id = choreId,
                            title = it[Chores.title],
                            weekday = it[Chores.weekday]
                        ),
                        ChoreLogResponseDTO(
                            choreId = choreId,
                            completed = log?.get(ChoreLogs.completed) ?: false
                            // someChange
                        )
                    )
                }
                chores
            }

            call.respond(result)
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
                val existing = ChoreLogs.selectAll().where {
                    (ChoreLogs.chore eq dto.choreId) and (ChoreLogs.date eq date)
                }.singleOrNull()

                if (existing != null) {
                    return@transaction ChoreLogs.update({
                        (ChoreLogs.chore eq dto.choreId) and (ChoreLogs.date eq date)
                    }) {
                        it[completed] = dto.completed
                    }
                } else {
                    return@transaction ChoreLogs.insertAndGetId {
                        it[chore] = EntityID(dto.choreId, Chores)
                        it[ChoreLogs.date] = date
                        it[completed] = dto.completed
                    }
                }
            }

            call.respond(
                ChoreLogResponseDTO(
                    choreId = dto.choreId,
                    completed = dto.completed
                )
            )
        }

        delete("/{id}") {
            val idParam = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, "ID fehlt")
            val id = idParam.toIntOrNull() ?: return@delete call.respond(HttpStatusCode.BadRequest, "Ungültige ID")

            transaction {
                ChoreLogs.deleteWhere { ChoreLogs.chore eq id }
                Chores.deleteWhere { Chores.id eq id }
            }

            call.respond(HttpStatusCode.NoContent)

        }
    }
}
