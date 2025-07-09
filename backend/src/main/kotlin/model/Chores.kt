package dev.vulnerius.model

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.date

object Chores : IntIdTable() {
    val title = varchar("title", 255)
    val weekday = integer("weekday")
    val createdAt = date("created_at")
}

object ChoreLogs : IntIdTable() {
    val chore = reference("chore_id", Chores)
    val date = date("date")
    val completed = bool("completed").default(false)
}
