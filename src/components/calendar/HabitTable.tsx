import React from "react";
import type {Habit, HabitLog} from "../sections/HabitSection.tsx";

type Props = {
    habits: Habit[];
    logs: HabitLog[];
    date: string;
    onToggle: (habitId: number, date: string) => void;
};

export const HabitTable: React.FC<Props> = ({habits, logs, date, onToggle}) => {
    const getCompleted = (habitId: number, date: string) => {
        return logs.find((l) => l.habitId === habitId && l.date === date)?.completed ?? false;
    };

    return (
        <table className="table-auto border-collapse w-full">
            <thead>
            <tr>
                <th className="border p-2">Datum</th>
                {habits.map((h) => (
                    <th key={h.id} className="border p-2 text-center">
                        {h.title}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>

            <tr key={date}>
                <td className="border p-2">{date}</td>
                {habits.map((habit) => {
                    const completed = getCompleted(habit.id, date);
                    return (
                        <td key={habit.id} className="border p-2 text-center">
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={() => onToggle(habit.id, date)}
                            />
                        </td>
                    );
                })}
            </tr>

            </tbody>
        </table>
    );
};
