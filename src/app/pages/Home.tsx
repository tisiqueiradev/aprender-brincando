import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Menu from "../../components/layout/Menu";
import { supabase } from "../../lib/supabase";
import { CircleUserRoundIcon } from 'lucide-react'

export default function Home() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-[100dvh] py-24 px-4">

        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <Menu
            label="Português"
            themeColor="portuguese"
            to="/portuguese"
          />

          <Menu
            label="Matemática"
            themeColor="math"
            to="/math/index"
          />

          <Menu
            label="Inglês"
            themeColor="english"
            to="/english"

          />

          <Menu
            label="Geografia"
            themeColor="geo"
            to="/geo"
          />

          <Menu
            label="Ciência"
            themeColor="science"
            to="/science"

          />

          <Menu
            label="Artes"
            themeColor="arts"
            to="/arts"

          />




        </div>
      </div>

      <div ref={menuRef} className="fixed bottom-4 left-4 z-50">
        {isUserMenuOpen && (
          <div className="mb-2 w-44 rounded-xl border border-border bg-card shadow-lg p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-foreground hover:bg-muted"
            >
              Fazer logoff
            </button>
          </div>
        )}


        <CircleUserRoundIcon className="w-12 h-12 text-english" onClick={() => setIsUserMenuOpen((prev) => !prev)} />

      </div>
    </>
  )
}
