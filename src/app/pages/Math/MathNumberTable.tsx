import { useState, useEffect, useRef } from "react";
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
import ExerciseLayout from "../../../components/layout/ExerciseLayout";
import DraggableBlock from "../../../components/DraggableBlock";
import DropZone from "../../../components/DropZone";
import confetti from "canvas-confetti";
import { addScoreRecord } from "../../../lib/scoreboard";

const COLS = 10;

interface Round {
  label: string;
  numbers: number[];
  missing: Set<number>;
  reversed: boolean;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateRounds(): Round[] {
  const forward = Array.from({ length: 40 }, (_, i) => i + 1);
  const reverse = Array.from({ length: 40 }, (_, i) => 40 - i);

  return [
    {
      label: "1 a 40 →",
      numbers: forward,
      missing: new Set(pickRandom(forward, 8)),
      reversed: false,
    },
    {
      label: "40 a 1 ←",
      numbers: reverse,
      missing: new Set(pickRandom(reverse, 8)),
      reversed: true,
    },
    {
      label: "1 a 40 → (difícil)",
      numbers: forward,
      missing: new Set(pickRandom(forward, 10)),
      reversed: false,
    },
    {
      label: "40 a 1 ← (difícil)",
      numbers: reverse,
      missing: new Set(pickRandom(reverse, 10)),
      reversed: true,
    },
  ];
}

const fireConfetti = () => {
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
};

const NumberTable = () => {
  const [rounds] = useState(() => generateRounds());
  const [roundIndex, setRoundIndex] = useState(0);
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [shakeCell, setShakeCell] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completedRounds, setCompletedRounds] = useState(0);
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

  const round = rounds[roundIndex];
  const isGameOver = lives <= 0;
  const isComplete = completedRounds >= rounds.length;



  const [shuffledRemaining, setShuffledRemaining] = useState<number[]>([]);

  useEffect(() => {
    if (!round) return;
    const rem = [...round.missing].filter((n) => !placed[n]);
    setShuffledRemaining(rem.sort(() => Math.random() - 0.5));
  }, [round, Object.keys(placed).length]);

  // 🔹 Fim da rodada
  useEffect(() => {
    if (!round || isGameOver) return;

    const allPlaced = [...round.missing].every((n) => placed[n] === n);

    if (allPlaced && round.missing.size > 0) {
      fireConfetti();
      playSuccessSound();
      const direction = round.reversed ? "de trás para frente" : "em ordem";
      speak(`Parabéns! Você completou a sequência ${direction}!`);

      setTimeout(() => {
        setCompletedRounds((prev) => prev + 1);
        setRoundIndex((prev) => prev + 1);
        setPlaced({});
      }, 2000);
    }
  }, [placed, round, isGameOver]);

  // 🔹 Narração com cleanup
  useEffect(() => {
    if (isComplete || isGameOver || !round) return;

    const direction = round.reversed
      ? "de quarenta a um"
      : "de um a quarenta";

    speak(
      `Complete a tabela numérica ${direction}. Arraste os números para os espaços vazios!`
    );

    return () => {
      stopNarration();
    };
  }, [roundIndex, isComplete, isGameOver, round]);

  useEffect(() => {
    if (isComplete || isGameOver) {
      stopNarration();
    }
  }, [isComplete, isGameOver]);

  useEffect(() => {
    if ((!isComplete && !isGameOver) || scoreSavedRef.current) return;

    addScoreRecord({
      subject: "Matemática - Tabela Numérica",
      points: score,
      correctAnswers: score,
      totalExercises: rounds.reduce((total, item) => total + item.missing.size, 0),
    });
    scoreSavedRef.current = true;
  }, [isComplete, isGameOver, score, rounds]);

  const handleDragStart = (event: DragStartEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveId(String(event.active.id));
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
      setActiveId(null);
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
      setDndContextKey((prev) => prev + 1);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    hasCancelledByBoundsRef.current = false;
    setActiveId(null);

    if (!event.over || !round) return;

    const draggedNumber = Number(event.active.id);
    const targetCell = Number(
      String(event.over.id).replace("cell-", "")
    );

    if (
      draggedNumber === targetCell &&
      round.missing.has(targetCell)
    ) {
      setPlaced((prev) => ({
        ...prev,
        [targetCell]: draggedNumber,
      }));
      setScore((prev) => prev + 1);
      playSuccessSound();
      speak(String(draggedNumber));
    } else {
      playErrorSound();
      setLives((prev) => prev - 1);
      setShakeCell(targetCell);
      speak("Ops! Tente outro lugar!");
      setTimeout(() => setShakeCell(null), 600);
    }
  };

  const handleReset = () => {
    setRoundIndex(0);
    setPlaced({});
    setLives(5);
    setScore(0);
    setCompletedRounds(0);
    scoreSavedRef.current = false;
  };

  if (isComplete || isGameOver) {
    return (
      <ExerciseLayout
        title="Tabela Numérica"
        themeColor="math"
        currentExercise={
          isGameOver ? completedRounds + 1 : rounds.length
        }
        totalExercises={rounds.length}
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
      title="Tabela Numérica"
      themeColor="math"
      currentExercise={completedRounds + 1}
      totalExercises={rounds.length}
      lives={lives}
      onReset={handleReset}
    >
      <DndContext
        key={dndContextKey}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          hasCancelledByBoundsRef.current = false;
          setActiveId(null);
        }}
      >
        <div
          ref={dragBoundsRef}
          className="w-full max-w-2xl mx-auto touch-none overscroll-contain select-none border-2 border-math/50 rounded-xl px-3 py-4 sm:px-4 sm:py-5"
          onTouchMove={(e) => e.preventDefault()}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-1">
            Complete a tabela!
          </h2>

          <div
            className="grid gap-1.5 md:gap-2 mb-8"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            }}
          >
            {round.numbers.map((num) => {
              const isMissing = round.missing.has(num);
              const isPlaced = placed[num] === num;
              const isShaking = shakeCell === num;

              if (isMissing && !isPlaced) {
                return (
                  <DropZone
                    key={`cell-${num}`}
                    id={`cell-${num}`}
                    status={isShaking ? "wrong" : "idle"}
                    disableHoverScale
                    className="w-full !min-w-0 !min-h-[40px] md:!min-h-[48px] !px-0 !py-0 rounded-lg text-sm md:text-base animate-none"
                  >
                    <span className="text-muted-foreground/30 text-xs">
                      ?
                    </span>
                  </DropZone>
                );
              }

              return (
                <div
                  key={`cell-${num}`}
                  className={`flex items-center justify-center rounded-lg font-display text-sm md:text-base font-bold min-h-[40px] md:min-h-[48px] ${isPlaced
                    ? "bg-success/20 border-2 border-success text-success"
                    : "bg-math/10 border border-math/20 text-math"
                    }`}
                >
                  {num}
                </div>
              );
            })}
          </div>

          <div className="bg-card rounded-xl p-4 shadow-lg border border-border">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {shuffledRemaining.map((num) => (
                <DraggableBlock
                  key={num}
                  id={String(num)}
                  status="idle"
                >
                  {num}
                </DraggableBlock>
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="px-4 py-2 rounded-lg bg-math text-math-foreground font-display text-lg font-bold shadow-2xl">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </ExerciseLayout>
  );
};

export default NumberTable;
