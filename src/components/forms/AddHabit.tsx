import { useState } from "react"

export function AddHabitForm() {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAddHabit = async () => {
    if (!title.trim()) return

    setLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ title }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text)
      }

      setTitle("")
      alert("Habit hinzugefügt ✅")
    } catch (err: any) {
      alert("Fehler beim Hinzufügen: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl max-w-md space-y-2">
      <input
        type="text"
        placeholder="Neues Habit"
        className="border p-2 rounded w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleAddHabit}
        disabled={loading}
      >
        {loading ? "Hinzufügen…" : "Hinzufügen"}
      </button>
    </div>
  )
}
