import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { themeStyles } from "../theme";
import type { ThemeColor } from '../theme';


interface ExerciseLayoutProps {
  title: string;
  themeColor: ThemeColor;
  children: React.ReactNode;
  currentExercise: number;
  totalExercises: number;
  lives: number;
  onNext?: () => void;
  onReset?: () => void;
  isComplete?: boolean;
  isGameOver?: boolean;
}

const maxLives = 5;

export default function ExerciseLayout({
  title,
  themeColor,
  children,
  currentExercise,
  totalExercises,
  lives,
  onNext,
  onReset,
  isComplete,
  isGameOver

}: ExerciseLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className={cn(
        "px-4 py-3 flex items-center gap-3 shadow-md",
        themeStyles[themeColor], "w-full h-10"
      )}>
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display text-xl  flex-1">{title}</h1>
        {/* Lives */}
        <div className="flex items-center gap-0.5 mr-2">
          {Array.from({ length: maxLives }).map((_, i) => (
            <span key={i} className={cn("text-xl transition-all duration-300", i < lives ? "scale-100" : "scale-75 grayscale opacity-40")}>
              {i < lives ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
        <span className="font-body text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
          {currentExercise}/{totalExercises}
        </span>
      </header>

      {/* Progress bar */}
      <div className="my-2 w-full h-2 bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            themeColor === "math" && "bg-math",
            themeColor === "portuguese" && "bg-portuguese"
          )}
          style={{ width: `${(currentExercise / totalExercises) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        {isGameOver ? (
          <div className="text-center animate-bounce-in">
            <span className="text-7xl block mb-4">😢</span>
            <h2 className="font-display text-3xl font-bold text-destructive mb-2">Game Over!</h2>
            <p className="font-body text-lg text-muted-foreground mb-6">Você perdeu todas as vidas! Tente novamente!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onReset}
                className={cn(
                  "px-6 py-3 rounded-xl font-display font-bold text-lg transition-all hover:scale-105",
                  themeColor === "math" && "bg-math text-math-foreground",
                  themeColor === "portuguese" && "bg-portuguese text-portuguese-foreground"
                )}
              >
                Tentar novamente 💪
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl font-display font-bold text-lg bg-muted text-foreground transition-all hover:scale-105"
              >
                Início
              </button>
            </div>
          </div>
        ) : isComplete ? (
          <div className="text-center animate-bounce-in">
            <span className="text-7xl block mb-4">🎉</span>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Parabéns!</h2>
            <p className="font-body text-lg text-muted-foreground mb-2">Você completou todos os exercícios!</p>
            <p className="font-body text-md text-muted-foreground mb-6">
              Vidas restantes: {Array.from({ length: lives }).map((_, i) => <span key={i}>❤️</span>)}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onReset}
                className={cn(
                  "px-6 py-3 rounded-xl font-display font-bold text-lg transition-all hover:scale-105",
                  themeColor === "math" && "bg-math text-math-foreground",
                  themeColor === "portuguese" && "bg-portuguese text-portuguese-foreground"
                )}
              >
                Jogar novamente
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl font-display font-bold text-lg bg-muted text-foreground transition-all hover:scale-105"
              >
                Início
              </button>
            </div>
          </div>
        ) : (
          <>
            {children}
            {onNext && (
              <button
                onClick={onNext}
                className={cn(
                  "mt-4 px-8 py-3 rounded-xl font-display font-bold text-lg transition-all hover:scale-105 shadow-lg",
                  themeColor === "math" && "bg-math text-math-foreground",
                  themeColor === "portuguese" && "bg-portuguese text-portuguese-foreground"
                )}
              >
                Próximo →
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
