package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateHabitDTO(val title: String)

@Serializable
data class HabitResponseDTO(val id: Int, val title: String)
