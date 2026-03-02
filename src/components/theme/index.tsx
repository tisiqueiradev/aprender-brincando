export const themeStyles = {
  math: "w-52 sm:w-56 text-base sm:text-lg bg-math text-math-foreground p-6 sm:p-8 rounded-2xl hover:bg-math/90",
  portuguese: "w-52 sm:w-56 text-base sm:text-lg bg-portuguese text-portuguese-foreground p-6 sm:p-8 rounded-2xl hover:bg-portuguese/90",
  geo: "w-52 sm:w-56 text-base sm:text-lg bg-geo text-geo-foreground p-6 sm:p-8 rounded-2xl hover:bg-geo/90",
  english: "w-52 sm:w-56 text-base sm:text-lg bg-english text-english-foreground p-6 sm:p-8 rounded-2xl hover:bg-english/90",
  arts: "w-52 sm:w-56 text-base sm:text-lg bg-arts text-arts-foreground p-6 sm:p-8 rounded-2xl hover:bg-arts/90",
  science: "w-52 sm:w-56 text-base sm:text-lg bg-science text-science-foreground p-6 sm:p-8 rounded-2xl hover:bg-science/90"
}

export const themeColor = [
  "math", "portuguese", "geo", "english", "arts", "science"
] as const;

export type ThemeColor = typeof themeColor[number];
