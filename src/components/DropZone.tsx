import { useDroppable } from "@dnd-kit/core";
import { cn } from "../lib/utils";

interface DropZoneProps {
  id: string;
  children?: React.ReactNode;
  status?: "idle" | "correct" | "wrong";
  label?: string;
}

const DropZone = ({
  id,
  children,
  status = "idle",
  label,
}: DropZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const isEmpty = !children;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Estrutura base
        "min-w-[90px] min-h-[64px] px-6 py-4",
        "rounded-xl border-2 border-dashed",
        "flex items-center justify-center",
        "font-display text-xl md:text-2xl font-bold",
        "transition-all duration-200 ease-out",
        "select-none",

        // Estado padrão
        status === "idle" &&
        "border-muted-foreground/40 bg-muted/40",

        // Quando está sendo arrastado por cima
        isOver &&
        status === "idle" &&
        "border-primary bg-primary/10 scale-110 shadow-md",

        // Acertou
        status === "correct" &&
        "border-success bg-success/10 text-success scale-105",

        // Errou
        status === "wrong" &&
        "border-destructive bg-destructive/10 text-destructive animate-shake",

        // Quando vazio
        isEmpty &&
        "text-muted-foreground/40 italic animate-pulse"
      )}
    >
      {children ??
        label ??
        (isOver ? "Solte aqui!" : "Arraste aqui")}
    </div>
  );
};

export default DropZone;
