import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:80";

type Chore = {
    id: number;
    title: string;
    weekday: number;
};

type ChoreLog = {
    choreId: number;
    completed: boolean;
};

type ChoreWithLog = {
    chore: Chore;
    logs: ChoreLog;
};

export default function ChoreSection({date}: { date: Date }) {
    const [chores, setChores] = useState<ChoreWithLog[]>([]);
    const dateStr = date.toISOString().split("T")[0];

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/chores/${dateStr}`)
            .then(res => res.json())
            .then(data => setChores(data))
            .catch(err => console.error("Fehler beim Laden der Chores:", err));
    }, [dateStr]);

    const toggleChore = (chore: Chore, completed: boolean) => {
        const nextCompleted = !completed;
        fetch(`${API_BASE_URL}/api/chores/log`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                choreId: chore.id,
                date: dateStr,
                completed: nextCompleted
            })
        })
            .then(() => {
                setChores(prev =>
                    prev.map(entry =>
                        entry.chore.id === chore.id
                            ? {...entry, log: {...entry.logs, completed: nextCompleted}}
                            : entry
                    )
                );
            })
            .catch(err => console.error("Fehler beim Aktualisieren:", err));
    };

    if (chores.length === 0) {
        return (<section>
            <h3 className="text-xl font-semibold mb-2">
                <Link to="/chores" className="text-white underline">
                    🏠 Heute keine Haushaltsaufgaben
                </Link>
            </h3>
        </section>)
    }

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">
                <Link to="/chores" className="text-white underline">
                    🏠 Haushaltsaufgaben
                </Link>
            </h2>

            <ul className="space-y-2">
                {chores.map(({chore, logs}) => (
                    <li key={chore.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={logs?.completed ?? false}
                            onChange={() => toggleChore(chore, logs?.completed ?? false)}
                        />
                        <span className={logs?.completed ? "line-through text-gray-500" : ""}>
                            {chore.title}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
