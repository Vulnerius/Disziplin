import {useEffect, useState} from "react";
import type {Habit} from "../sections/HabitSection.tsx";
import { API_BASE_URL } from '../../api/config.tsx';

export default function HabitManager() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitTitle, setNewHabitTitle] = useState("");

    // ✅ Alle Habits laden
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/habits`)
            .then(res => res.json())
            .then(setHabits)
            .catch(err => console.error("Fehler beim Laden der Habits:", err));
    }, []);

    // ➕ Neuen Habit hinzufügen
    const addHabit = () => {
        const title = newHabitTitle.trim();
        if (!title) return;

        fetch(`${API_BASE_URL}/api/habits`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title})
        })
            .then(res => res.json())
            .then(data => {
                setHabits(prev => [...prev, data]);
                setNewHabitTitle("");
            })
            .catch(err => alert("Fehler beim Hinzufügen: " + err.message));
    };

    // ❌ Habit löschen
    const deleteHabit = (habitId: number) => {
        if (!confirm("Habit wirklich löschen?")) return;

        fetch(`${API_BASE_URL}api/habits/${habitId}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    setHabits(prev => prev.filter(h => h.id !== habitId));
                } else {
                    alert("Fehler beim Löschen");
                }
            })
            .catch(err => alert("Fehler: " + err.message));
    };

    return (
        <section className="p-4">
            <h2 className="text-2xl font-semibold mb-4">🧘 Habits verwalten</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Neuer Habit..."
                    value={newHabitTitle}
                    onChange={e => setNewHabitTitle(e.target.value)}
                    className="border rounded px-3 py-1 w-full"
                />
                <button onClick={addHabit} className="bg-blue-600 text-white px-4 py-1 rounded">
                    Hinzufügen
                </button>
            </div>

            <ul>
                {habits.map(habit => (
                    <li key={habit.id} className="flex justify-between items-center py-2 border-b">
                        <span className="padding-2">{habit.title}</span>
                        <div className="rtl">
                            <button
                                onClick={() => deleteHabit(habit.id)}
                                className="text-red-500 hover:text-red-700 mx-auto"
                            >
                                Löschen
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
