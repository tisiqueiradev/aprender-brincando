import ExerciseLayout from "../../../components/layout/ExerciseLayout";
import { useRef, useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { playSuccessSound, playErrorSound } from "../../../lib/souds";
import { speak, stopNarration } from "../../../lib/narrator";
import DraggableBlock from "../../../components/DraggableBlock";
import DropZone from "../../../components/DropZone";
import PrintExercisesPdf from "../../../components/PrintExercisesPdf";
import { getCorrectAnswer, shuffleArray, type Exercise } from ".././math.utils";
import { addScoreRecord } from "../../../lib/scoreboard";

const exercises: Exercise[] = [
  { sequence: [1, 2, 3, 4, -1], fase: 1, missingIndex: 4, options: [6, 9, 5, 10] },
  { sequence: [2, 3, 4, 5, -1], fase: 1, missingIndex: 4, options: [6, 7, 5, 8] },
  { sequence: [1, -1, 3, 4], fase: 1, missingIndex: 1, options: [5, 2, 0] },
  { sequence: [10, 11, 12, 13, -1], fase: 1, missingIndex: 4, options: [14, 19, 5, 10] },
  { sequence: [10, 20, 30, -1], fase: 1, missingIndex: 3, options: [30, 40, 25, 18] },
  { sequence: [100, 101, 102, 103, -1], fase: 1, missingIndex: 4, options: [114, 104, 105, 10] },
  { sequence: [100, 200, -1], fase: 1, missingIndex: 2, options: [300, 250, 400] },
  { sequence: [50, 60, 70, -1], fase: 1, missingIndex: 3, options: [90, 80, 75] },
  { sequence: [5, 10, 15, -1], fase: 1, missingIndex: 3, options: [25, 20, 18] },
  { sequence: [2, 4, -1, 8], fase: 1, missingIndex: 2, options: [5, 6, 7] },
  { sequence: [2, -1, 6, 8], fase: 1, missingIndex: 1, options: [4, 6, 7] },
  { sequence: [8, 10, 12, -1], fase: 1, missingIndex: 3, options: [4, 6, 7] },
];

export default function MathSequenceNumber() {
  const [shuffledExercises, setShuffledExercises] = useState(() =>
    shuffleArray(exercises)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedValue, setDroppedValue] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [answered, setAnswered] = useState(false);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dndContextKey, setDndContextKey] = useState(0);
  const dragBoundsRef = useRef<HTMLDivElement | null>(null);
  const hasCancelledByBoundsRef = useRef(false);
  const scoreSavedRef = useRef(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 1 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 0, tolerance: 2 },
    })
  );

  const exercise = shuffledExercises[currentIndex];
  const isComplete = currentIndex >= shuffledExercises.length;
  const isGameOver = lives <= 0;


  useEffect(() => {
    if (isComplete || isGameOver) return;
    const seq = exercise.sequence;
    const parts = seq.map((n) =>
      n === -1 ? "qual é o próximo número?" : String(n)
    );
    speak(`Complete a sequência de números: ${parts.join(", ")}`);

    return () => {
      stopNarration();
    };
  }, [currentIndex, isComplete, isGameOver, exercise]);

  useEffect(() => {
    if ((!isComplete && !isGameOver) || scoreSavedRef.current) return;

    addScoreRecord({
      subject: "Matemática - Sequência Numérica",
      points: score,
      correctAnswers: score,
      totalExercises: shuffledExercises.length,
    });
    scoreSavedRef.current = true;
  }, [isComplete, isGameOver, score, shuffledExercises.length]);

  const handleDragEnd = (event: DragEndEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveDragId(null);
    if (answered || !event.over) return;

    const value = Number(event.active.id);
    const correct = getCorrectAnswer(exercise);

    setDroppedValue(value);
    setAnswered(true);

    if (value === correct) {
      setStatus("correct");
      setScore((prev) => prev + 1);
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

  const handleDragStart = (_event: DragStartEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveDragId(String(_event.active.id));
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (hasCancelledByBoundsRef.current) return;

    const bounds = dragBoundsRef.current?.getBoundingClientRect();
    const activeRect = event.active.rect.current.translated;
    if (!bounds || !activeRect) return;

    const isOutsideBounds =
      activeRect.top < bounds.top ||
      activeRect.left < bounds.left ||
      activeRect.right > bounds.right ||
      activeRect.bottom > bounds.bottom;

    if (isOutsideBounds) {
      hasCancelledByBoundsRef.current = true;
      setActiveDragId(null);
      setDndContextKey((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setDroppedValue(null);
    setStatus("idle");
    setAnswered(false);
  };

  const handleReset = () => {
    setShuffledExercises(shuffleArray(exercises));
    setCurrentIndex(0);
    setDroppedValue(null);
    setStatus("idle");
    setAnswered(false);
    setLives(5);
    setScore(0);
    scoreSavedRef.current = false;
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
        finalScore={score}
      >
        <div />
      </ExerciseLayout>
    );
  }

  return (
    <ExerciseLayout
      title="Sequência númerica"
      themeColor="math"
      currentExercise={currentIndex + 1}
      totalExercises={shuffledExercises.length}
      lives={lives}
      onNext={status === "correct" ? handleNext : undefined}
      onReset={handleReset}
    >
      <div className="w-full max-w-xl mx-auto px-1">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center text-math mb-2">
          Complete a sequência!
        </h2>

        <p className="text-center text-sm sm:text-base text-muted-foreground font-body mb-6 sm:mb-8">
          Arraste o número correto para o espaço vazio
        </p>

      </div>
      <DndContext
        key={dndContextKey}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          hasCancelledByBoundsRef.current = false;
          setActiveDragId(null);
        }}
      >
        <div
          ref={dragBoundsRef}
          className="w-full max-w-3xl mx-auto border-2 border-text-math rounded-xl px-3 py-4 sm:px-4 sm:py-5 touch-none overscroll-contain select-none"
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className="border-border p-4 sm:p-6 md:p-8  flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap mb-8 sm:mb-10">
            {exercise.sequence.map((num, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                {i > 0 && (
                  <span className="text-muted-foreground font-display text-lg sm:text-xl">
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
                  <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-math/10 border-2 border-math/30 font-display text-lg sm:text-xl md:text-2xl font-bold text-math">
                    {num}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pb-2">
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

        <PrintExercisesPdf
          exercises={exercises}
          className="w-full max-w-3xl mx-auto mt-3 flex justify-start"
        />

        <DragOverlay>
          {activeDragId ? (
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-display text-lg sm:text-xl md:text-2xl font-bold bg-card shadow-2xl border-2 border-border opacity-95">
              {activeDragId}
            </div>
          ) : null}
        </DragOverlay>

      </DndContext>
    </ExerciseLayout>
  );
}
