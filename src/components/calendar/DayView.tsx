import HabitSection from "../sections/HabitSection";
import JournalSection from "../sections/JournalSection.tsx";


export default function DayView({ date }: { date: Date }) {
    return (
        <div className="space-y-6">
            <HabitSection date={date} />
            <JournalSection date={date} />
        </div>
    );
}
