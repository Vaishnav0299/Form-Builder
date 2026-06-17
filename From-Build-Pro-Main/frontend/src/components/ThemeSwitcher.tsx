import { useTheme } from "../context/ThemeProvider";
import { useState, useEffect, useRef } from "react";
import { Lightbulb, LightbulbOff, Monitor } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      value: "light",
      label: "Light",
      icon: <Lightbulb size={18} className="text-amber-500 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <LightbulbOff size={18} className="text-slate-400" />,
    },
    {
      value: "system",
      label: "System",
      icon: <Monitor size={18} className="text-sky-500 dark:text-sky-400" />,
    },
  ];

  const currentOption = options.find((opt) => opt.value === theme) || options[2];

  // Helper to render current trigger icon with animations
  const renderTriggerIcon = () => {
    switch (theme) {
      case "light":
        return (
          <Lightbulb
            size={20}
            className="text-amber-500 fill-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] animate-pulse transition-all duration-300"
          />
        );
      case "dark":
        return (
          <LightbulbOff
            size={20}
            className="text-slate-400 hover:text-slate-300 transition-all duration-300"
          />
        );
      default:
        return (
          <Monitor
            size={20}
            className="text-slate-500 hover:text-slate-400 dark:text-slate-400 dark:hover:text-slate-300 transition-all duration-300"
          />
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        title={`Theme: ${currentOption.label}`}
        className="
          flex items-center justify-center w-12 h-12
          rounded-xl
          border border-border/80
          bg-card/50 backdrop-blur-md
          hover:bg-muted/85
          hover:border-primary/40
          shadow-sm hover:shadow-md
          transition-all duration-300
          hover:scale-105 active:scale-95
        "
      >
        <span className="transition-transform duration-300">
          {renderTriggerIcon()}
        </span>
      </button>

      {open && (
        <div className="
          absolute right-0 mt-2 w-40
          bg-card/90 backdrop-blur-lg
          border border-border/80
          rounded-xl
          shadow-xl
          z-50
          p-1
          animate-in fade-in slide-in-from-top-2 duration-200
        ">
          {options.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full
                  px-3 py-2.5
                  text-sm font-medium
                  rounded-lg
                  cursor-pointer
                  transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-sm" 
                    : "text-foreground hover:bg-muted/60"
                  }
                `}
              >
                <span className={isActive ? "scale-110 transition-transform duration-200" : ""}>
                  {opt.icon}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;