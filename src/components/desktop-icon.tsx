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
        "flex flex-col items-center justify-start gap-1 p-2 rounded-md",
        "w-24 h-24 text-center text-white/90 transition-colors",
        "hover:bg-white/10 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-ring/50"
      )}
    >
      <div className="w-16 h-16 flex items-center justify-center">{icon}</div>
      <span className="text-sm select-none bg-background/50 px-1 py-0.5 rounded-sm">{name}</span>
    </button>
  );
}
