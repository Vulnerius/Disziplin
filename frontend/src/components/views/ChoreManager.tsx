import React, {useEffect, useState} from "react";
import {API_BASE_URL} from "../../api/config.tsx";

type Chore = {
    id: number;
    title: string;
    weekday: number;
};

const weekdays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag"
];

export default function ChoreManager() {
    const [chores, setChores] = useState<Chore[]>([])
    const [title, setTitle] = useState("");
    const [weekday, setWeekday] = useState(1);
//someChange
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/chores`)
            .then(res => res.json())
            .then(data => setChores(data))
            .catch(err => console.error("Fehler beim Laden der Chores:", err));
    }, []);

    const deleteChore = (id: number) => {
        if (!confirm("Diesen Chore wirklich löschen?")) return;

        fetch(`${API_BASE_URL}/api/chores/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                setChores(prev => prev.filter(c => c.id !== id));
            })
            .catch(err => alert("Fehler beim Löschen: " + err.message));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = { title, weekday };

        const res = await fetch(`${API_BASE_URL}/api/chores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert("Aufgabe hinzugefügt 🎉");
            setTitle("");
            setWeekday(1);
        } else {
            alert("Fehler beim Hinzufügen");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white text-black p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Neue Haushaltsaufgabe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Titel</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="z.B. Staubsaugen"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Wochentag</label>
                    <select
                        value={weekday}
                        onChange={(e) => setWeekday(Number(e.target.value))}
                        className="w-full border p-2 rounded"
                    >
                        <option value={1}>Montag</option>
                        <option value={2}>Dienstag</option>
                        <option value={3}>Mittwoch</option>
                        <option value={4}>Donnerstag</option>
                        <option value={5}>Freitag</option>
                        <option value={6}>Samstag</option>
                        <option value={7}>Sonntag</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                >
                    Hinzufügen
                </button>
            </form>

            <div className="space-y-4">
                <h1 className="text-2xl font-bold mb-4">🧹 Haushaltsmanager</h1>

                {weekdays.map((dayName, index) => {
                    const dayChores = chores.filter(c => c.weekday === index+1);

                    return (
                        <div key={index}>
                            <h2 className="text-xl font-semibold mb-2">{dayName}</h2>
                            {dayChores.length === 0 ? (
                                <p className="text-gray-300">Keine Aufgaben</p>
                            ) : (
                                <ul className="space-y-1">
                                    {dayChores.map(chore => (
                                        <li key={chore.id} className="flex justify-between items-center bg-white text-black px-4 py-2 rounded">
                                            <span>{chore.title}</span>
                                            <button
                                                onClick={() => deleteChore(chore.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Löschen
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
