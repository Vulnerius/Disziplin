package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class HabitLogDTO(val habitId: Int, val date: String, val completed: Boolean)

@Serializable
data class HabitLogResponseDTO(val habitId: Int, val completed: Boolean, val date: String)
