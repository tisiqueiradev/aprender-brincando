import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { Toaster } from "../components/ui/toaster";


import Home from "./pages/Home";
import Math from "./pages/Math"
import Portuguese from "./pages/Portuguese";
import English from "./pages/English";
import Geo from "./pages/Geo";
import Science from "./pages/Science";
import Arts from "./pages/Arts";
import Resgister from "./pages/auth/pages/Register";
import Login from "./pages/auth/pages/Login";


function App() {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portuguese" element={<Portuguese />} />
          <Route path="/math" element={<Math />} />
          <Route path="/english" element={<English />} />
          <Route path="/geo" element={<Geo />} />
          <Route path="/science" element={<Science />} />
          <Route path="/arts" element={<Arts />} />
          <Route path="/register" element={<Resgister />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )

}

export default App
