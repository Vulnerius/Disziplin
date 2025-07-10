import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import HabitManager from "./components/views/HabitManager.tsx";
import {IndexView} from "./components/views/IndexView.tsx";
import ChoreManager from "./components/views/ChoreManager.tsx";
import {API_BASE_URL} from "./api/config.tsx";

function App() {

    console.log(API_BASE_URL)

    return (
        <main className="min-h-screen bg-cyan-500 text-white p-4">
            <Router>
                <Routes>
                    <Route path="/" element={<IndexView/>}/>
                    <Route path="/habits" element={<HabitManager/>}/>
                    <Route path="/chores" element={<ChoreManager/>}/>
                </Routes>
            </Router>
        </main>
    );
}

export default App
