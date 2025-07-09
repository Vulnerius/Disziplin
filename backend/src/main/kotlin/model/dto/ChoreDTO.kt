package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateChoreDTO(val title: String, val weekday: Int)

@Serializable
data class ChoreResponseDTO(val id: Int, val title: String, val weekday: Int)
