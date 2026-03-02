import { describe, expect, it } from "vitest";
import { getCorrectAnswer, shuffleArray } from "./math.utils";

describe("math.utils", () => {
  it("calcula resposta correta para sequencia crescente", () => {
    const answer = getCorrectAnswer({
      sequence: [10, 20, 30, -1],
      missingIndex: 3,
      options: [30, 40, 25, 18],
    });

    expect(answer).toBe(40);
  });

  it("calcula resposta correta quando valor faltante esta no meio", () => {
    const answer = getCorrectAnswer({
      sequence: [2, 4, -1, 8],
      missingIndex: 2,
      options: [5, 6, 7],
    });

    expect(answer).toBe(6);
  });

  it("embaralha sem perder itens", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(original);
    expect(shuffled).not.toBe(original);
  });
});
