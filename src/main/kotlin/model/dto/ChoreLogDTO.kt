package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class ChoreLogDTO(val choreId: Int, val date: String, val completed: Boolean)

@Serializable
data class ChoreLogResponseDTO(val choreId: Int, val completed: Boolean)
