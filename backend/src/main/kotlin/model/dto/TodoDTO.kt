package dev.vulnerius.model.dto

import kotlinx.serialization.Serializable

@Serializable
data class TodoDTO(
    val id: Int? = null, val date: String, val title: String, val completed: Boolean, val position: Int
)
