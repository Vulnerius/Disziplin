package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class JournalEntryDTO(
    val date: String,
    val notes: String,
    val topTodos: List<String>
)

@Serializable
data class JournalResponseDTO(
    val date: String,
    val notes: String,
    val topTodos: List<String>
)
