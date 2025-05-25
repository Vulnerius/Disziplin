package dev.vulnerius.controller

import dev.vulnerius.model.Journals
import dev.vulnerius.model.dto.JournalEntryDTO
import dev.vulnerius.model.dto.JournalResponseDTO
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

fun Route.journalRoutes() {

    route("/journal") {

        get("/{date}") {
            val dateParam = call.parameters["date"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val date = LocalDate.parse(dateParam)

            val entry = transaction {
                Journals.selectAll().where(Journals.date eq date)
                    .firstOrNull()
            }

            if (entry == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                call.respond(
                    JournalResponseDTO(
                        id = entry[Journals.id].value,
                        date = date.toString(),
                        notes = entry[Journals.content],
                    )
                )
            }
        }

        post {
            val dto = call.receive<JournalEntryDTO>()
            val date = LocalDate.parse(dto.date)

            val id = transaction {
                Journals.insertAndGetId {
                    it[Journals.date] = date
                    it[content] = dto.notes
                }
            }

            call.respond(
                JournalResponseDTO(
                    id = id.value,
                    date = date.toString(),
                    notes = dto.notes,
                )
            )
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull()
                ?: return@put call.respond(HttpStatusCode.BadRequest, "Invalid id")
            val dto = call.receive<JournalEntryDTO>()

            println("$id : $dto")

            transaction {
                Journals.update({ Journals.id eq id }) {
                    it[content] = dto.notes
                }
            }

            call.respond(
                JournalResponseDTO(
                    id = id,
                    date = dto.date,
                    notes = dto.notes,
                )
            )
        }
    }
}
