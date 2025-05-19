"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmPlacementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  title: string
  description: string
  confirmText: string
  cancelText?: string
  variant?: "default" | "destructive"
}

export function ConfirmPlacementModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  variant = "default",
}: ConfirmPlacementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      console.log("Confirming action...")
      await onConfirm()
      console.log("Action confirmed successfully")
    } catch (error) {
      console.error("Error during confirmation:", error)
    } finally {
      setIsSubmitting(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            className={variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
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
  )
}
