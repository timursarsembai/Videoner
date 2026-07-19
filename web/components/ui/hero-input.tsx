import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface HeroInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onValueChange?: (value: string) => void;
}

const HeroInput = React.forwardRef<HTMLInputElement, HeroInputProps>(
  ({ className, onValueChange, type, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-xl border-2 border-foreground/10 bg-background/50 px-6 py-2 pr-12 text-lg backdrop-blur transition-all placeholder:text-foreground/40",
            "hover:border-foreground/20",
            "focus:border-primary/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-primary/10",
            className
          )}
          ref={ref}
          onChange={(e) => onValueChange?.(e.target.value)}
          {...props}
        />

        {props.value ? (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors group-hover:text-foreground/60 cursor-pointer"
            onClick={() => onValueChange?.("")}
          >
            <X className="h-6 w-6" />
          </div>
        ) : (
          icon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors group-hover:text-foreground/60">
              {icon}
            </div>
          )
        )}
      </div>
    );
  }
);

HeroInput.displayName = "HeroInput";

export { HeroInput };
