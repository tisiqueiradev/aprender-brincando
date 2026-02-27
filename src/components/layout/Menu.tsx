import { Link } from "react-router-dom";
import { themeStyles } from "../theme"

interface MenuProps {
  label: string;
  themeColor: "math" | "portuguese" | "geo" | "english" | "arts" | "science"
  to: "/math" | "/portuguese" | "/english" | "/geo" | "/science" | "/arts"
}

export default function Menu({ label, themeColor, to }: MenuProps) {

  const theme = themeStyles;

  return (
    <Link to={to} >
      <button className={theme[themeColor]} >{label}</button>
    </Link>

  )
}
