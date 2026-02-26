interface MenuProps {
  label: string;
  themeColor: "math" | "portuguese" | "geo" | "english"


}

export default function Menu({ label, themeColor }: MenuProps) {

  const themeStyles = {
    math: "w-56 bg-math text-math-foreground p-8 rounded-2xl  hover:bg-math/90 ",
    portuguese: "w-56 bg-portuguese text-portuguese-foreground p-8 rounded-2xl hover:bg-portuguese/90",
    geo: "w-56 bg-green-500 p-8 rounded-2xl hover:bg-green-500/90",
    english: " w-56 bg-purple-500 p-8 rounded-2xl hover:bg-purple-500/90"
  }


  return (
    <button className={themeStyles[themeColor]} >{label}</button>
  )
}
