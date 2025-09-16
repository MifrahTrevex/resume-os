import { useDraggableIcon } from "@/hooks/use-draggable-icon";
import { cn } from "@/lib/utils";
import { useRef, type MouseEvent } from "react";

interface DesktopIconProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
  onContextMenu?: (event: MouseEvent) => void;
}

export default function DesktopIcon({ icon, name, onClick, onContextMenu }: DesktopIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const { position, wasDragged } = useDraggableIcon(iconRef);

  const handleClick = () => {
      if (!wasDragged()) {
        onClick();
      }
  };

  return (
    <button
      ref={iconRef}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      style={{
        position: 'relative', // Changed to relative for grid layout
        touchAction: 'none',
      }}
      className={cn(
        "flex flex-col items-center justify-start gap-1 p-2 rounded-md",
        "w-24 h-24 text-center text-white/90 transition-colors",
        "hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ring/50"
      )}
    >
      <div className="w-16 h-16 flex items-center justify-center pointer-events-none">{icon}</div>
      <span className="text-sm select-none pointer-events-none bg-transparent">{name}</span>
    </button>
  );
}
