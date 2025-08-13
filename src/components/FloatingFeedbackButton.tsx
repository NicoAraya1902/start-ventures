import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackDialog } from '@/components/FeedbackDialog';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingFeedbackButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <FeedbackDialog>
        <Button
          size="lg"
          className={cn(
            "h-14 shadow-lg hover:shadow-xl transition-all duration-300",
            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            "border-2 border-primary/20 hover:border-primary/30",
            "text-primary-foreground font-semibold",
            isExpanded ? "w-auto px-6" : "w-14 px-0"
          )}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          onClick={() => setIsExpanded(false)}
        >
          <MessageSquare className={cn(
            "h-6 w-6 transition-transform duration-300",
            isExpanded ? "mr-3" : ""
          )} />
          <span className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
          )}>
            ¿Reportar Error?
          </span>
        </Button>
      </FeedbackDialog>
    </div>
  );
}