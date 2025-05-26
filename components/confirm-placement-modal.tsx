"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
  onConfirm?: () => Promise<void>
  pitchId?: string
  campaignId?: string
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
  pitchId,
  campaignId,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  variant = "default",
}: ConfirmPlacementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      // If onConfirm is provided, call it first (for backward compatibility)
      if (onConfirm) {
        await onConfirm()
      }

      // Only proceed with the API actions if pitchId is provided
      if (pitchId) {
        // 1. Update Pitch Status to "placed"
        const pitchResponse = await fetch(`/api/pitches/${pitchId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "placed" }),
        })

        if (!pitchResponse.ok) {
          throw new Error(`Failed to update pitch status: ${pitchResponse.statusText}`)
        }

        // 2. Update Campaign Status and increment accepted_count
        if (campaignId) {
          const campaignResponse = await fetch(`/api/campaigns/${campaignId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "accepted",
              accepted_count_increment: 1,
            }),
          })

          if (!campaignResponse.ok) {
            throw new Error(`Failed to update campaign: ${campaignResponse.statusText}`)
          }
        }

        // 3. Update Curator Credits
        const curatorResponse = await fetch("/api/curators/me/credits", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credits_increment: 1,
            accepted_increment: 1,
          }),
        })

        if (!curatorResponse.ok) {
          throw new Error(`Failed to update curator credits: ${curatorResponse.statusText}`)
        }

        toast({
          title: "Placement confirmed",
          description: "The pitch has been successfully placed and your credits have been updated.",
        })
      }

      console.log("Action confirmed successfully")
    } catch (error) {
      console.error("Error during confirmation:", error)
      toast({
        title: "Error confirming placement",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
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
