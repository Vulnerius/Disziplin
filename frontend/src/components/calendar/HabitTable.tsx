import React, {useEffect, useState} from "react";
import {type Habit, type HabitLog} from "../sections/HabitSection.tsx";

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

    const [completedDatesByHabit, setCompletedDatesByHabit] = useState<Map<number, string[]>>(new Map());

    useEffect(() => {
        habits.forEach(habit => {
            fetch(`http://backend-app-service:8080/api/habits/${habit.id}/logs/completed`)
                .then(res => res.json())
                .then(data => {
                    setCompletedDatesByHabit(prev => {
                        const newMap = new Map(prev);
                        newMap.set(habit.id, data.map((d: HabitLog) => d.date));
                        return newMap;
                    });
                })
                .catch(err => console.error("Streak-Fehler:", err));
        });
    }, [habits]);

    function calculateStreak(completedDates: string[], today: string): number {
        const dateSet = new Set(completedDates);
        let streak = 0;
        let current = new Date(today);

        while (true) {
            const dateStr = current.toISOString().split("T")[0];
            if (dateSet.has(dateStr)) {
                streak++;
                current.setDate(current.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }
    return (
        <table className="table-auto border-collapse w-full">
            <thead>
            <tr>
                {habits.map((h) => (
                    <th key={h.id} className="border p-2 text-center">
                        {h.title}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            <tr key={date}>
                {habits.map((habit) => {
                    const completed = getCompleted(habit.id, date);
                    const streak = calculateStreak(completedDatesByHabit.get(habit.id) ?? [], date);

                    return (
                        <td key={habit.id} className="border p-2 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={() => onToggle(habit.id, date)}
                                />
                                {streak > 0 && (
                                    <span className="text-orange-500 text-sm">
                                         {streak}  🔥
                                    </span>
                                )}
                            </div>
                        </td>
                    );
                })}
            </tr>
            </tbody>
        </table>
    );
};
