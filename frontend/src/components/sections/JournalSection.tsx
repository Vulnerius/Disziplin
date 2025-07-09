import { useEffect, useState } from "react";

interface JournalEntry {
    id: number;
    date: string;
    notes: string;
}

export default function JournalSection({ date }: { date: Date }) {
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const dateStr = date.toISOString().split("T")[0];

    // Lädt den Journal-Eintrag für das Datum, falls vorhanden
    useEffect(() => {
        setLoading(true);
        fetch(`http://backend-app-service:8080/api/journal/${dateStr}`)
            .then(res => {
                if (res.status === 204) return null; // Kein Eintrag
                return res.json();
            })
            .then(data => {
                if (data) {
                    setEntry(data);
                    setInputValue(data.notes);
                } else {
                    setEntry(null);
                    setInputValue("");
                }
            })
            .catch(err => console.error("Fehler beim Laden des Journals:", err))
            .finally(() => setLoading(false));
    }, [dateStr]);

    const saveEntry = () => {
        if (inputValue.trim() === "") return;

        const payload = {
            date: dateStr,
            notes: inputValue.trim(),
        };

        const method = entry ? "PUT" : "POST";
        const url = entry
            ? `http://backend-app-service:8080/api/journal/${entry.id}`
            : "http://backend-app-service:8080/api/journal";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(res => {
                if (!res.ok) throw new Error("Fehler beim Speichern");
                alert("Journal saved")
                return res.json();
            })
            .then(data => {
                setEntry(data);
            })
            .catch(err => console.error(err.message));
    };

    if (loading) return <p>Lädt...</p>;

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">📔 Journal</h2>
            <textarea
                className="w-full border p-2 rounded resize-y"
                placeholder="Deine Gedanken und Gefühle zum Tag hier eintragen..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                rows={5}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={saveEntry}
            >
                {entry ? "Aktualisieren" : "Speichern"}
            </button>
        </section>
    );
}
