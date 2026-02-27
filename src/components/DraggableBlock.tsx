import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

interface DraggableBlockProps {
  id: string;
  children: React.ReactNode;
  status?: "idle" | "correct" | "wrong";
  disabled?: boolean;
}

const DraggableBlock = ({ id, children, status = "idle", disabled = false }: DraggableBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "px-5 py-3 rounded-lg font-display text-xl md:text-2xl font-bold cursor-grab active:cursor-grabbing select-none transition-all duration-200",
        "bg-card shadow-lg border-2 hover:shadow-xl",
        isDragging && "opacity-70 scale-105 shadow-2xl z-50",
        status === "idle" && "border-border text-foreground",
        status === "correct" && "border-success bg-success/10 text-success animate-pop",
        status === "wrong" && "border-destructive bg-destructive/10 text-destructive animate-shake",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </div>
  );
};

export default DraggableBlock;
