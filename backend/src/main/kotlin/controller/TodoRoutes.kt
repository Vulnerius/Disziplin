package dev.vulnerius.controller

import dev.vulnerius.model.Todos
import dev.vulnerius.model.dto.TodoDTO
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import java.time.LocalDate

fun Route.todoRoutes() {
    route("/todos") {

        get("/{date}") {
            val dateParam = call.parameters["date"] ?: return@get call.respond(HttpStatusCode.BadRequest)
            val date = LocalDate.parse(dateParam)

            val todos = transaction {
                Todos.selectAll()
                    .where { Todos.date eq date }
                    .orderBy(Todos.position to SortOrder.ASC)
                    .map {
                        TodoDTO(
                            id = it[Todos.id].value,
                            date = it[Todos.date].toString(),
                            title = it[Todos.title],
                            completed = it[Todos.completed],
                            position = it[Todos.position]
                        )
                    }
            }

            call.respond(todos)
        }

        post {
            val dto = call.receive<TodoDTO>()
            val id = transaction {
                Todos.insertAndGetId {
                    it[date] = LocalDate.parse(dto.date)
                    it[title] = dto.title
                    it[completed] = dto.completed
                    it[position] = dto.position
                }.value
            }

            call.respond(dto.copy(id = id))
        }

        put("/{id}") {
            val id = call.parameters["id"]?.toIntOrNull() ?: return@put call.respond(HttpStatusCode.BadRequest)

            val dto = call.receive<TodoDTO>()
            transaction {
                Todos.update({ Todos.id eq id }) {
                    it[title] = dto.title
                    it[completed] = dto.completed
                    it[position] = dto.position
                }
            }

            call.respond(dto.copy(id = id))
        }
    }
}