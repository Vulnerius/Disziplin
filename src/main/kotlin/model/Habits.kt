package dev.vulnerius.model

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.date


object Habits : IntIdTable() {
    val title = varchar("title", 255)
    val createdAt = date("created_at")
}

object HabitLogs : IntIdTable() {
    val habit = reference("habit_id", Habits)
    val date = date("date")
    val completed = bool("completed").default(false)
}
