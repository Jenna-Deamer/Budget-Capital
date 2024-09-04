import "./App.css";

//views
import LandingPage from "./components/LandingPage";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

//libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div>
            <main>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            </main>
        </div>
    );
}

export default App;
