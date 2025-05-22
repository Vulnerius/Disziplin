package dev.vulnerius.controller

import dev.vulnerius.model.Journals
import dev.vulnerius.model.Todos
import dev.vulnerius.model.dto.JournalEntryDTO
import dev.vulnerius.model.dto.JournalResponseDTO
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertIgnore
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

fun Route.journalRoutes() {

    route("/journal") {

        get("/{date}") {
            val dateParam = call.parameters["date"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val date = LocalDate.parse(dateParam)

            val entry = transaction {
                Journals.select(Journals.date eq date)
                    .firstOrNull()
            }

            if (entry == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                val todos = transaction {
                    Todos.select ( Todos.date eq date )
                        .orderBy(Todos.position)
                        .map { it[Journals.content] }
                }

                call.respond(
                    JournalResponseDTO(
                        date = date.toString(),
                        notes = entry[Journals.content],
                        topTodos = todos
                    )
                )
            }
        }

        post {
            val dto = call.receive<JournalEntryDTO>()
            val date = LocalDate.parse(dto.date)

            transaction {
                Journals.insertIgnore {
                    it[Journals.date] = date
                    it[content] = dto.notes
                }

                Todos.deleteWhere { Todos.date eq date }

                dto.topTodos.take(3).forEachIndexed { i, todo ->
                    Todos.insert {
                        it[Todos.date] = date
                        it[position] = i
                        it[title] = todo
                    }
                }
            }

            call.respond(HttpStatusCode.Created, mapOf("status" to "saved"))
        }
    }
}
