import { beforeEach, describe, expect, it } from "vitest";
import { addScoreRecord, clearScoreboard, getScoreboard } from "./scoreboard";

describe("scoreboard", () => {
  beforeEach(() => {
    clearScoreboard();
  });

  it("adiciona registro no placar", () => {
    addScoreRecord({
      subject: "Matemática",
      points: 4,
      correctAnswers: 4,
      totalExercises: 10,
    });

    const records = getScoreboard();

    expect(records).toHaveLength(1);
    expect(records[0].subject).toBe("Matemática");
    expect(records[0].points).toBe(4);
  });

  it("retorna registros mais novos primeiro", () => {
    addScoreRecord({
      subject: "Primeiro",
      points: 1,
      correctAnswers: 1,
      totalExercises: 2,
    });

    addScoreRecord({
      subject: "Segundo",
      points: 2,
      correctAnswers: 2,
      totalExercises: 2,
    });

    const records = getScoreboard();

    expect(records[0].subject).toBe("Segundo");
    expect(records[1].subject).toBe("Primeiro");
  });
});
