import DatePicker from "../calendar/Datepicker.tsx";
import DayView from "../calendar/DayView.tsx";
import {useState} from "react";

export function IndexView() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <section>
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Daily Overview</h1>
                <DatePicker selectedDate={selectedDate} onChange={setSelectedDate}/>
            </header>
            <DayView date={selectedDate}/>
        </section>
    )
}