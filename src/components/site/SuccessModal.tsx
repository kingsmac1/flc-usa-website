import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PillButton } from "@/components/site/ui";

/**
 * Centered success popup shared by every form on the site. The checkmark
 * animates in via CSS (see the success-check-* utilities in styles.css) —
 * re-mounting the <svg> each time the dialog opens (key={open}) restarts it.
 */
export function SuccessModal({
  open,
  onOpenChange,
  title,
  message,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl text-center">
        <div className="mx-auto mt-2 grid size-20 place-items-center rounded-full bg-accent/10">
          <svg key={String(open)} viewBox="0 0 52 52" className="size-11 text-accent" fill="none" aria-hidden="true">
            <circle
              cx="26"
              cy="26"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              className="success-check-circle"
            />
            <path
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="success-check-mark"
            />
          </svg>
        </div>
        <DialogTitle className="mt-2 text-center font-display text-xl">{title}</DialogTitle>
        <DialogDescription className="text-center text-sm">{message}</DialogDescription>
        <PillButton type="button" className="mx-auto mt-2" onClick={() => onOpenChange(false)}>
          Done
        </PillButton>
      </DialogContent>
    </Dialog>
  );
}
