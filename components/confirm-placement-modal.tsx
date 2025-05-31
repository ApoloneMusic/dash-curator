"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ConfirmPlacementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => Promise<void>;
  pitchId?: string;
  campaignId?: string;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmPlacementModal({
  open,
  onOpenChange,
  onConfirm,
  pitchId,
  campaignId,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  variant = "default",
}: ConfirmPlacementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // If onConfirm is provided, call it first (for backward compatibility)
      if (onConfirm) {
        await onConfirm();
        onOpenChange(false);
      }
      console.log("Action confirmed successfully");
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription 
            dangerouslySetInnerHTML={{ __html: description }}
            className="whitespace-pre-line"
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className={
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90"
                : ""
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
