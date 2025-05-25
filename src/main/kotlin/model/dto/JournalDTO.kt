package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class JournalEntryDTO(
    val id: Int? = null,
    val date: String,
    val notes: String,
)

@Serializable
data class JournalResponseDTO(
    val id: Int,
    val date: String,
    val notes: String,
)
