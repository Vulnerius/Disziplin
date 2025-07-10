import {useEffect, useState} from "react";
import {HabitTable} from "../calendar/HabitTable.tsx";
import {Link} from "react-router-dom";
import {API_BASE_URL} from "../../api/config.tsx";

export interface HabitLog {
    habitId: number;
    title: string;
    date: string;
    completed: boolean;
}

export interface Habit {
    id: number;
    title: string;
}

export default function HabitSection({date}: { date: Date }) {
    const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);

    const dateStr = date.toISOString().split("T")[0];

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/habits`)
            .then(res => res.json())
            .then(data => setHabits(data.map((h: { id: number; title: string; }) => ({
                id: h.id,
                title: h.title
            }))))
            .catch(err => console.error("Fehler beim Laden der Habits:", err));
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/habits/${dateStr}`)
            .then(res => res.json())
            .then(data => setHabitLogs(data))
            .catch(err => console.error("Fehler beim Laden der Habits:", err));
    }, [dateStr]);


    const toggleHabit = (habit: HabitLog) => {
        const updated = !habit.completed;

        const payload = {
            habitId: habit.habitId,
            date: dateStr,
            completed: updated
        }
        fetch(`${API_BASE_URL}/api/habits/log`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setHabitLogs(prev =>
                    prev.map(h =>
                        h.habitId === habit.habitId && h.date === data.date ? {...h, completed: updated} : h
                    )
                );
            })
            .catch(err => alert("Fehler beim Aktualisieren: " + err.message));
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">
                <Link to="/habits" className="hover:underline text-blue-600">
                    🧘 Habits
                </Link>
            </h2>
            <div>
                <HabitTable habits={habits} logs={habitLogs} date={dateStr} onToggle={(habitId, date) => {
                    let habitLog = habitLogs.find(h => h.habitId === habitId && h.date === date);

                    if (!habitLog) {
                        // 🆕 Neuer Log-Eintrag, falls keiner existiert
                        habitLog = {
                            habitId,
                            title: habits.find(h => h.id === habitId)?.title || "Unbekannter Habit",
                            date,
                            completed: false // erstmal false, wird in toggleHabit auf true gesetzt
                        };
                    }

                    if (habitLog) toggleHabit(habitLog)
                    else console.warn("habitLog couldn't be found")
                }}
                />
            </div>
        </section>
    )
        ;
}
