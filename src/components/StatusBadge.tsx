import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'VERIFIED' | 'SUSPECT' | 'NOT_FOUND' | 'PENDING' | 'APPROVED' | 'REJECTED';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    VERIFIED: "bg-success text-success-foreground",
    SUSPECT: "bg-warning text-warning-foreground", 
    NOT_FOUND: "bg-muted-gray text-white",
    PENDING: "bg-warn-amber text-white",
    APPROVED: "bg-success text-success-foreground",
    REJECTED: "bg-destructive text-destructive-foreground"
  };

  const labels = {
    VERIFIED: "Verified",
    SUSPECT: "Suspicious", 
    NOT_FOUND: "Not Found",
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors",
        variants[status],
        className
      )}
      aria-label={`Status: ${labels[status]}`}
    >
      {labels[status]}
    </span>
  );
}