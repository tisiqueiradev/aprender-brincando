import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DropZone from "./DropZone";

const useDroppableMock = vi.fn();

vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => useDroppableMock(),
}));

describe("DropZone", () => {
  it("mostra texto padrao quando vazio", () => {
    useDroppableMock.mockReturnValue({
      isOver: false,
      setNodeRef: vi.fn(),
    });

    render(<DropZone id="drop-zone" />);

    expect(screen.getByText("Arraste aqui")).toBeInTheDocument();
  });

  it("mostra dica de soltar quando item esta sobre a area", () => {
    useDroppableMock.mockReturnValue({
      isOver: true,
      setNodeRef: vi.fn(),
    });

    render(<DropZone id="drop-zone" />);

    expect(screen.getByText("Solte aqui!")).toBeInTheDocument();
  });
});
