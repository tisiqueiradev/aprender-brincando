import { useDroppable } from "@dnd-kit/core";
import { cn } from "../lib/utils";

interface DropZoneProps {
  id: string;
  children?: React.ReactNode;
  status?: "idle" | "correct" | "wrong";
  label?: string;
}

const DropZone = ({ id, children, status = "idle", label }: DropZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-w-[80px] min-h-[56px] px-5 py-3 rounded-lg border-2 border-dashed flex items-center justify-center font-display text-xl md:text-2xl font-bold transition-all duration-200",
        status === "idle" && "border-muted-foreground/30 bg-muted/50",
        status === "correct" && "border-success bg-success/10 text-success",
        status === "wrong" && "border-destructive bg-destructive/10 text-destructive animate-shake",
        isOver && status === "idle" && "border-primary bg-primary/10 scale-105",
        !children && "text-muted-foreground/40"
      )}
    >
      {children || label || "?"}
    </div>
  );
};

export default DropZone;
