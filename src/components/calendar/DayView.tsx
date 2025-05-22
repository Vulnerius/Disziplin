import HabitSection from "../sections/HabitSection";


export default function DayView({ date }: { date: Date }) {
    return (
        <div className="space-y-6">
            <HabitSection date={date} />
        </div>
    );
}
