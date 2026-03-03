export interface ScoreRecord {
  id: string;
  subject: string;
  points: number;
  correctAnswers: number;
  totalExercises: number;
  completedAt: string;
}

const SCOREBOARD_KEY = "aprender_brincando_scoreboard_v1";

export function getScoreboard(): ScoreRecord[] {
  const raw = localStorage.getItem(SCOREBOARD_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ScoreRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addScoreRecord(record: Omit<ScoreRecord, "id" | "completedAt">): ScoreRecord {
  const next: ScoreRecord = {
    ...record,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };

  const current = getScoreboard();
  const updated = [next, ...current];
  localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(updated));
  return next;
}

export function clearScoreboard() {
  localStorage.removeItem(SCOREBOARD_KEY);
}
