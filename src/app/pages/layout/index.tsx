import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../lib/utils";
import type { ThemeColor } from '../../../components/theme/';

interface HeaderLayoutProps {
  title: string;
  themeColor: ThemeColor;

}


const themeHeaderStyles: Record<ThemeColor, string> = {
  math: "bg-math text-math-foreground",
  portuguese: "bg-portuguese text-portuguese-foreground",
  geo: "bg-geo text-geo-foreground",
  english: "bg-english text-english-foreground",
  arts: "bg-arts text-arts-foreground",
  science: "bg-science text-science-foreground",
};



export default function Header({
  title,
  themeColor,


}: HeaderLayoutProps) {

  const navigate = useNavigate();

  return (
    <div className="px-2 pt-2 sm:px-0 sm:pt-0">
      <header className={cn(
        "px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-md",
        "w-full min-h-12 sm:min-h-14 rounded-2xl sm:rounded-none",
        themeHeaderStyles[themeColor]
      )}>
        <button
          onClick={() => {
            navigate("/home");
          }}
          className="p-1 sm:p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="font-display text-sm sm:text-base md:text-xl flex-1">{title}</h1>

      </header>
    </div>
  )
}
