export const themeStyles = {
  math: "w-56 bg-math text-math-foreground p-8 rounded-2xl  hover:bg-math/90 ",
  portuguese: "w-56 bg-portuguese text-portuguese-foreground p-8 rounded-2xl hover:bg-portuguese/90",
  geo: "w-56 bg-geo text-geo-foreground p-8 rounded-2xl hover:bg-geo/90",
  english: "w-56 bg-english  text-english-foreground p-8 rounded-2xl hover:bg-english/90",
  arts: "w-56 bg-arts text-arts-foreground p-8 rounded-2xl hover:bg-arts/90",
  science: "w-56 bg-science text-science-foreground p-8 rounded-2xl hover:bg-science/90"
}

export const themeColor = [
  "math", "portuguese", "geo", "english", "arts", "science"
] as const;

export type ThemeColor = typeof themeColor[number];
