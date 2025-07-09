export default function DatePicker({ selectedDate, onChange }: {
    selectedDate: Date;
    onChange: (date: Date) => void;
}) {
    return (
        <input
            type="date"
            className="border rounded p-2"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => onChange(new Date(e.target.value))}
        />
    );
}
