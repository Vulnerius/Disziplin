import HabitSection from "../sections/HabitSection";
import JournalSection from "../sections/JournalSection.tsx";
import TodoSection from "../sections/TodoSection.tsx";
import ChoreSection from "../sections/ChoreSection.tsx";


export default function DayView({date}: { date: Date }) {
    return (
        <div className="space-y-6">
            <TodoSection date={date}/>
            <ChoreSection date={date}/>
            <HabitSection date={date}/>
            <JournalSection date={date}/>
        </div>
    );
}
