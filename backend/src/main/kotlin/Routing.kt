package dev.vulnerius

import dev.vulnerius.controller.choreRoutes
import dev.vulnerius.controller.habitRoutes
import dev.vulnerius.controller.journalRoutes
import dev.vulnerius.controller.todoRoutes
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.plugins.cors.routing.*

fun Application.configureRouting() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respondText(text = "500: $cause", status = HttpStatusCode.InternalServerError)
        }
    }

    install(ContentNegotiation) {
        json()
    }

    install(CORS) {
        allowHost("192.168.2.111:30080", schemes = listOf("http"))
        allowHost("192.168.2.111:30443", schemes = listOf("https"))
        allowHost("eevee:30080", schemes = listOf("http"))
        allowHost("eevee:30443", schemes = listOf("https"))

        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Accept)
    }

    routing {
        get("/") {
            call.respondText("Hello World!")
        }

        route("/api") {
            habitRoutes()
            choreRoutes()
            journalRoutes()
            todoRoutes()
        }
    }
}
