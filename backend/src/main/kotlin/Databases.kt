package dev.vulnerius

import dev.vulnerius.model.*
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

fun Application.configureDatabases() {
    val database = Database.connect(
        url = "jdbc:postgresql://postgres-db-service:5432/habitsdb",
        driver = "org.postgresql.Driver",
        user = "appuser",
        password = "secret"
    )

    transaction {
        SchemaUtils.create(
            Habits, HabitLogs,
            Chores, ChoreLogs,
            Journals, Todos
        )
    }
}
