import { useEffect, useRef, useState } from "react";
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
import DraggableBlock from "../../components/DraggableBlock";
import DropZone from "../../components/DropZone";
import ExerciseLayout from "../../components/layout/ExerciseLayout";
import { speak, stopNarration } from "../../lib/narrator";
import { playErrorSound, playSuccessSound } from "../../lib/souds";
import { addScoreRecord } from "../../lib/scoreboard";
import { shuffleArray } from "./math.utils";

interface PortugueseExercise {
  word: string;
  promptPrefix: string;
  answer: string;
  options: string[];
}

const exercises: PortugueseExercise[] = [
  { word: "casa", promptPrefix: "ca +", answer: "sa", options: ["so", "za", "sa"] },
  { word: "bola", promptPrefix: "bo +", answer: "la", options: ["ra", "la", "ta"] },
  { word: "pato", promptPrefix: "pa +", answer: "to", options: ["do", "to", "co"] },
  { word: "mesa", promptPrefix: "me +", answer: "sa", options: ["za", "sa", "na"] },
  { word: "mala", promptPrefix: "ma +", answer: "la", options: ["na", "la", "ta"] },
  { word: "foca", promptPrefix: "fo +", answer: "ca", options: ["ga", "ca", "da"] },
  { word: "gato", promptPrefix: "ga +", answer: "to", options: ["to", "do", "fo"] },
  { word: "dado", promptPrefix: "da +", answer: "do", options: ["bo", "go", "do"] },
  { word: "vela", promptPrefix: "ve +", answer: "la", options: ["la", "na", "ra"] },
  { word: "tatu", promptPrefix: "ta +", answer: "tu", options: ["ti", "tu", "to"] },
];

function extractOptionValue(id: string): string {
  const [, ...rest] = id.split("::");
  return rest.join("::");
}

export default function Portuguese() {
  const [shuffledExercises, setShuffledExercises] = useState(() => shuffleArray(exercises));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [droppedValue, setDroppedValue] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [answered, setAnswered] = useState(false);
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [activeDragValue, setActiveDragValue] = useState<string | null>(null);
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

    speak(
      `Complete a palavra ${exercise.word}. ${exercise.promptPrefix} qual sílaba completa a palavra?`
    );

    return () => {
      stopNarration();
    };
  }, [exercise, isComplete, isGameOver]);

  useEffect(() => {
    if ((!isComplete && !isGameOver) || scoreSavedRef.current) return;

    addScoreRecord({
      subject: "Português - Sílabas",
      points: score,
      correctAnswers: score,
      totalExercises: shuffledExercises.length,
    });

    scoreSavedRef.current = true;
  }, [isComplete, isGameOver, score, shuffledExercises.length]);

  const handleDragStart = (event: DragStartEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveDragValue(extractOptionValue(String(event.active.id)));
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
      setActiveDragValue(null);
      setDndContextKey((prev) => prev + 1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveDragValue(null);

    if (answered || !event.over) return;

    const value = extractOptionValue(String(event.active.id));

    setDroppedValue(value);
    setAnswered(true);

    if (value === exercise.answer) {
      setStatus("correct");
      setScore((prev) => prev + 1);
      playSuccessSound();
      speak("Muito bem! Você acertou.");
      return;
    }

    setStatus("wrong");
    setLives((prev) => prev - 1);
    playErrorSound();
    speak("Não foi dessa vez. Vamos tentar novamente.");

    setTimeout(() => {
      setDroppedValue(null);
      setStatus("idle");
      setAnswered(false);
    }, 1200);
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
        title="Português"
        themeColor="portuguese"
        currentExercise={isGameOver ? currentIndex + 1 : shuffledExercises.length}
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
      title="Sílabas"
      themeColor="portuguese"
      currentExercise={currentIndex + 1}
      totalExercises={shuffledExercises.length}
      lives={lives}
      onNext={status === "correct" ? handleNext : undefined}
      onReset={handleReset}
    >
      <div className="w-full max-w-xl mx-auto px-1">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
          Complete a palavra!
        </h2>

        <p className="text-center text-sm sm:text-base text-muted-foreground font-body mb-6 sm:mb-8">
          Arraste a sílaba correta para o espaço vazio
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
          setActiveDragValue(null);
        }}
      >
        <div
          ref={dragBoundsRef}
          className="w-full max-w-3xl mx-auto rounded-xl px-3 py-4 sm:px-4 sm:py-5 touch-none overscroll-contain select-none border-2 border-portuguese/50"
          onTouchMove={(e) => e.preventDefault()}
        >
          <div className="border-border p-4 sm:p-6 md:p-8 rounded-md border-4 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-wrap mb-8 sm:mb-10">
            <div className="text-center w-full mb-1">
              <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-portuguese">
                Palavra: {exercise.word}
              </span>
            </div>

            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-portuguese/10 border-2 border-portuguese/30 font-display text-lg sm:text-xl md:text-2xl font-bold text-portuguese">
              {exercise.promptPrefix}
            </div>

            <DropZone id="drop-zone" status={status}>
              {droppedValue ?? undefined}
            </DropZone>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap pb-2">
            {exercise.options.map((opt, index) => {
              const dragId = `${index}::${opt}`;
              const isDropped = droppedValue === opt;
              if (isDropped && status === "correct") return null;

              return (
                <DraggableBlock
                  key={dragId}
                  id={dragId}
                  status={isDropped ? status : "idle"}
                  disabled={answered && !isDropped}
                >
                  {opt}
                </DraggableBlock>
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeDragValue ? (
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-display text-lg sm:text-xl md:text-2xl font-bold bg-card shadow-2xl border-2 border-border opacity-95">
              {activeDragValue}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ExerciseLayout>
  );
}
