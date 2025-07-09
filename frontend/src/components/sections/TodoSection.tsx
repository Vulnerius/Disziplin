import {useEffect, useState} from "react";

export interface Todo {
    id?: number;
    date: string;
    title: string;
    completed: boolean;
    position: number;
}

export default function TodoSection({date}: { date: Date }) {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:80";
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const dateStr = date.toISOString().split("T")[0];

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/todos/${dateStr}`)
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch(err => console.error("Fehler beim Laden der Todos:", err))
            .finally(() => setLoading(false));
    }, [dateStr]);

    const handleUpdate = (index: number, updated: Partial<Todo>) => {
        const todo = todos[index];
        const newTodo = {...todo, ...updated};

        if (!todo.id) {
            // Neu anlegen
            fetch(`${API_BASE_URL}/api/todos`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTodo)
            })
                .then(res => res.json())
                .then(created => {
                    const copy = [...todos];
                    copy[index] = created;
                    setTodos(copy);
                });
        } else {
            // Update
            fetch(`${API_BASE_URL}/api/todos/${todo.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newTodo)
            })
                .then(res => res.json())
                .then(updatedTodo => {
                    const copy = [...todos];
                    copy[index] = updatedTodo;
                    setTodos(copy);
                });
        }
    };

    const handleChange = (index: number, value: string) => {
        handleUpdate(index, {title: value});
    };

    const handleToggle = (index: number) => {
        handleUpdate(index, {completed: !todos[index].completed});
    };

    useEffect(() => {
        if (todos.length < 3) {
            const filled = Array.from({length: 3}, (_, i) => todos[i] || {
                date: dateStr,
                title: "",
                completed: false,
                position: i
            });
            setTodos(filled);
        }
    }, [todos, dateStr]);

    if (loading) return <p>Lädt Todos...</p>;

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">✅ Top 3 Todos</h2>
            <ul className="space-y-2 list-none">
                {todos.map((todo, i) => (
                    <li key={i} className="flex items-center gap-5">
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(i)}
                        />
                        <input
                            type="text"
                            value={todo.title}
                            onChange={(e) => handleChange(i, e.target.value)}
                            placeholder={`Aufgabe ${i + 1}`}
                            className="flex-1 border p-1 rounded"
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
