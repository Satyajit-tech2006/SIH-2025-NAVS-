import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfidenceMeterProps {
  score: number;
  className?: string;
  animated?: boolean;
}

export function ConfidenceMeter({ score, className, animated = true }: ConfidenceMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);

  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const getGlowClass = (score: number) => {
    if (score >= 80) return "shadow-[0_0_20px_hsl(var(--success)/0.3)]";
    if (score >= 60) return "shadow-[0_0_20px_hsl(var(--warning)/0.3)]";
    return "shadow-[0_0_20px_hsl(var(--destructive)/0.3)]";
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "High Confidence";
    if (score >= 60) return "Medium Confidence";
    return "Low Confidence";
  };

  const shouldPulse = animatedScore < 50;

  return (
    <motion.div 
      className={cn("space-y-3", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">
          Confidence Score
        </span>
        <motion.span 
          className="text-lg font-bold text-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {animatedScore}%
        </motion.span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
          <motion.div 
            className={cn(
              "h-full rounded-full transition-colors duration-300",
              getColorClass(animatedScore),
              shouldPulse && "animate-pulse-success",
              animatedScore >= 90 && getGlowClass(animatedScore)
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, animatedScore))}%` }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.3
            }}
            role="progressbar"
            aria-valuenow={animatedScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${getLabel(animatedScore)}: ${animatedScore}%`}
          />
        </div>
        
        {/* Circular progress indicator */}
        <div className="absolute -right-1 top-1/2 -translate-y-1/2">
          <motion.div
            className={cn(
              "w-6 h-6 rounded-full border-4 border-white",
              getColorClass(animatedScore),
              "shadow-lg"
            )}
            initial={{ scale: 0, x: -20 }}
            animate={{ 
              scale: 1, 
              x: `${(animatedScore / 100) * 100 - 100}%`
            }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              delay: 0.5
            }}
          />
        </div>
      </div>
      
      <motion.p 
        className={cn(
          "text-sm font-medium",
          animatedScore >= 80 && "text-success",
          animatedScore >= 60 && animatedScore < 80 && "text-warning",
          animatedScore < 60 && "text-destructive"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {getLabel(animatedScore)}
      </motion.p>
    </motion.div>
  );
}