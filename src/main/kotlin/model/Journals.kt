package dev.vulnerius.model

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.javatime.date

object Journals : IntIdTable() {
    val date = date("date").uniqueIndex()
    val content = text("content")
}
