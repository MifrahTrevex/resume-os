import { cn } from "@/lib/utils";

interface DesktopIconProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

export default function DesktopIcon({ icon, name, onClick }: DesktopIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-2 rounded-lg",
        "w-24 h-24 text-center text-foreground transition-colors",
        "hover:bg-accent/20 focus:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring"
      )}
    >
      <div className="text-accent">{icon}</div>
      <span className="text-sm select-none">{name}</span>
    </button>
  );
}
