import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  score: number;
  className?: string;
}

export function ConfidenceMeter({ score, className }: ConfidenceMeterProps) {
  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "High Confidence";
    if (score >= 60) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">
          Confidence Score
        </span>
        <span className="text-sm font-semibold text-foreground">
          {score}%
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            getColorClass(score)
          )}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${getLabel(score)}: ${score}%`}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        {getLabel(score)}
      </p>
    </div>
  );
}