import HabitSection from "../sections/HabitSection";
import {AddHabitForm} from "../forms/AddHabit.tsx";


export default function DayView({ date }: { date: Date }) {
    return (
        <div className="space-y-6">
            <AddHabitForm />
            <HabitSection date={date} />
        </div>
    );
}
