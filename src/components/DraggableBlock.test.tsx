import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DraggableBlock from "./DraggableBlock";

const useDraggableMock = vi.fn();

vi.mock("@dnd-kit/core", () => ({
  useDraggable: () => useDraggableMock(),
}));

describe("DraggableBlock", () => {
  it("renderiza conteudo com estilo base", () => {
    useDraggableMock.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      isDragging: false,
    });

    render(<DraggableBlock id="10">10</DraggableBlock>);

    const block = screen.getByText("10");
    expect(block).toBeInTheDocument();
    expect(block).toHaveClass("text-lg");
  });

  it("aplica estilos de acerto e desabilitado", () => {
    useDraggableMock.mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      isDragging: true,
    });

    render(
      <DraggableBlock id="20" status="correct" disabled>
        20
      </DraggableBlock>
    );

    const block = screen.getByText("20");
    expect(block).toHaveClass("text-success");
    expect(block).toHaveClass("opacity-50");
  });
});
