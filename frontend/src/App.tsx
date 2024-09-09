import "./App.css";

//views
import LandingPage from "./components/LandingPage";
import Transactions from "./components/Transactions";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

//Shared
import NavBar from "./components/shared/NavBar";
import Footer from "./components/shared/Footer";

//libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div>
                <NavBar />
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
