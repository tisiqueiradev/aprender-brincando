import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { Toaster } from "../components/ui/toaster";


import Math from "./pages/Math"
import Portuguese from "./pages/Portuguese";
import English from "./pages/English";
import Geo from "./pages/Geo";
import Science from "./pages/Science";
import Arts from "./pages/Arts";
import Resgister from "./pages/auth/pages/Register";
import Login from "./pages/auth/pages/Login";
import Home from './pages/Home';
import ForgotPassword from "./pages/auth/pages/ForgotPassword";


function App() {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/portuguese" element={<Portuguese />} />
          <Route path="/math" element={<Math />} />
          <Route path="/english" element={<English />} />
          <Route path="/geo" element={<Geo />} />
          <Route path="/science" element={<Science />} />
          <Route path="/arts" element={<Arts />} />
          <Route path="/register" element={<Resgister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App
