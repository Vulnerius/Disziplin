package dev.vulnerius.model

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.date

object Todos : IntIdTable() {
    val date = date("date")
    val title = varchar("title", 255)
    val completed = bool("completed").default(false)
    val position = integer("position") // 0, 1, 2 (für Top 3)
}
