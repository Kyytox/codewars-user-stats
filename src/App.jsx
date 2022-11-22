import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserStats from "./userStats";
import Home from "./home";
import "./App.css";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/stats" element={<UserStats />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
