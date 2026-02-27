import ExerciseLayout from "../../components/layout/ExerciseLayout";
import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { playSuccessSound, playErrorSound } from "../../lib/souds";
import { speak } from "../../lib/narrator";
import DraggableBlock from "../../components/DraggableBlock";
import DropZone from "../../components/DropZone";

interface Exercise {
  sequence: number[];
  missingIndex: number;
  options: number[];
}

const exercises: Exercise[] = [
  { sequence: [10, 20, 30, -1], missingIndex: 3, options: [30, 40, 25, 18] },
  { sequence: [5, 10, 15, -1], missingIndex: 3, options: [25, 20, 18] },
  { sequence: [2, 4, -1, 8], missingIndex: 2, options: [5, 6, 7] },
  { sequence: [100, 200, -1], missingIndex: 2, options: [300, 250, 400] },
  { sequence: [1, -1, 3, 4], missingIndex: 1, options: [5, 2, 0] },
  { sequence: [50, 60, 70, -1], missingIndex: 3, options: [90, 80, 75] },
];

// 🔀 Função para embaralhar (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function MathExercise() {
  const [shuffledExercises, setShuffledExercises] = useState(() =>
    shuffleArray(exercises)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedValue, setDroppedValue] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [answered, setAnswered] = useState(false);
  const [lives, setLives] = useState(5);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  );

  const exercise = shuffledExercises[currentIndex];
  const isComplete = currentIndex >= shuffledExercises.length;
  const isGameOver = lives <= 0;

  // 🔊 Narrar pergunta
  useEffect(() => {
    if (isComplete || isGameOver) return;
    const seq = exercise.sequence;
    const parts = seq.map((n) =>
      n === -1 ? "qual é o próximo número?" : String(n)
    );
    speak(`Complete a sequência de números: ${parts.join(", ")}`);
  }, [currentIndex, isComplete, isGameOver, exercise]);

  const getCorrectAnswer = useCallback((ex: Exercise) => {
    const seq = ex.sequence;
    const idx = ex.missingIndex;

    // pegar dois valores conhecidos com índice
    const known = seq
      .map((value, index) => ({ value, index }))
      .filter((item) => item.value !== -1);

    const first = known[0];
    const second = known[1];

    // calcular passo real considerando distância entre índices
    const step = (second.value - first.value) / (second.index - first.index);

    return first.value + step * idx;
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    if (answered || !event.over) return;

    const value = Number(event.active.id);
    const correct = getCorrectAnswer(exercise);

    setDroppedValue(value);
    setAnswered(true);

    if (value === correct) {
      setStatus("correct");
      playSuccessSound();
      speak("Parabéns!");
    } else {
      setStatus("wrong");
      playErrorSound();
      setLives((prev) => prev - 1);
      speak("Opssss, você errou, vamos tentar de novo!");

      setTimeout(() => {
        setDroppedValue(null);
        setStatus("idle");
        setAnswered(false);
      }, 1200);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setDroppedValue(null);
    setStatus("idle");
    setAnswered(false);
  };

  const handleReset = () => {
    setShuffledExercises(shuffleArray(exercises)); // 🔀 embaralha novamente
    setCurrentIndex(0);
    setDroppedValue(null);
    setStatus("idle");
    setAnswered(false);
    setLives(5);
  };

  if (isComplete || isGameOver) {
    return (
      <ExerciseLayout
        title="Matemática"
        themeColor="math"
        currentExercise={
          isGameOver ? currentIndex + 1 : shuffledExercises.length
        }
        totalExercises={shuffledExercises.length}
        lives={lives}
        isComplete={isComplete && !isGameOver}
        isGameOver={isGameOver}
        onReset={handleReset}
      >
        <div />
      </ExerciseLayout>
    );
  }

  return (
    <ExerciseLayout
      title="Sequência Numérica"
      themeColor="math"
      currentExercise={currentIndex + 1}
      totalExercises={shuffledExercises.length}
      lives={lives}
      onNext={status === "correct" ? handleNext : undefined}
      onReset={handleReset}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="w-full max-w-lg mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
            Complete a sequência!
          </h2>

          <p className="text-center text-muted-foreground font-body mb-8">
            Arraste o número correto para o espaço vazio
          </p>

          <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap mb-10">
            {exercise.sequence.map((num, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                {i > 0 && (
                  <span className="text-muted-foreground font-display text-xl">
                    ,
                  </span>
                )}

                {num === -1 ? (
                  <DropZone id="drop-zone" status={status}>
                    {droppedValue !== null
                      ? String(droppedValue)
                      : undefined}
                  </DropZone>
                ) : (
                  <div className="px-5 py-3 rounded-lg bg-math/10 border-2 border-math/30 font-display text-xl md:text-2xl font-bold text-math">
                    {num}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            {exercise.options.map((opt) => {
              const isDropped = droppedValue === opt;
              if (isDropped && status === "correct") return null;

              return (
                <DraggableBlock
                  key={opt}
                  id={String(opt)}
                  status={isDropped ? status : "idle"}
                  disabled={answered && !isDropped}
                >
                  {opt}
                </DraggableBlock>
              );
            })}
          </div>
        </div>
      </DndContext>
    </ExerciseLayout>
  );
}
