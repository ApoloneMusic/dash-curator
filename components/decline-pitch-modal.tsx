"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface DeclinePitchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackName: string
  artistName: string
  onDecline: (feedback: DeclineFeedback) => void
}

export interface DeclineFeedback {
  mainReason: string
  recordingQuality: number
  productionQuality: number
  originality: number
  comments?: string
}

const declineReasons = [
  "Not right for this playlist's vibe or genre",
  "Recording quality too low",
  "Weak or missing hook",
  "Poor vocal performance or delivery",
  "Mix/master not competitive",
  "Arrangement/structure issues",
  "Sounds too similar to other submissions",
  "Lacks emotional impact or energy",
  "Tempo/energy doesn't match playlist flow",
  "Lyrics don't fit playlist audience",
  "Already full with similar tracks",
  "Other (optional comment below)",
]

export function DeclinePitchModal({ open, onOpenChange, trackName, artistName, onDecline }: DeclinePitchModalProps) {
  // Form state
  const [mainReason, setMainReason] = useState<string>("")
  const [recordingQuality, setRecordingQuality] = useState<number>(5)
  const [productionQuality, setProductionQuality] = useState<number>(5)
  const [originality, setOriginality] = useState<number>(5)
  const [comments, setComments] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Validation state
  const [errors, setErrors] = useState<{
    mainReason?: boolean
    recordingQuality?: boolean
    productionQuality?: boolean
    originality?: boolean
  }>({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setMainReason("")
      setRecordingQuality(5)
      setProductionQuality(5)
      setOriginality(5)
      setComments("")
      setErrors({})
      setIsSubmitting(false)
    }
  }, [open])

  // Get emoji based on rating
  const getRatingEmoji = (rating: number) => {
    if (rating <= 2) return "😖"
    if (rating <= 4) return "😕"
    if (rating <= 6) return "😐"
    if (rating <= 8) return "🙂"
    return "😀"
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      mainReason: !mainReason,
      recordingQuality: false,
      productionQuality: false,
      originality: false,
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onDecline({
      mainReason,
      recordingQuality,
      productionQuality,
      originality,
      comments,
    })

    setIsSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Decline Pitch</DialogTitle>
          <DialogDescription>
            Provide feedback for &quot;{trackName}&quot; by {artistName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="main-reason" className={cn(errors.mainReason && "text-destructive")}>
              Main Reason for Decline <span className="text-destructive">*</span>
            </Label>
            <Select value={mainReason} onValueChange={setMainReason}>
              <SelectTrigger
                id="main-reason"
                className={cn(errors.mainReason && "border-destructive ring-destructive")}
              >
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {declineReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.mainReason && <p className="text-sm text-destructive">Please select a reason for declining</p>}
          </div>

          {/* Recording Quality Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="recording-quality" className={cn(errors.recordingQuality && "text-destructive")}>
                Recording Quality <span className="text-destructive">*</span>
              </Label>
              <span className="text-2xl" aria-hidden="true">
                {getRatingEmoji(recordingQuality)}
              </span>
            </div>
            <div className="px-1">
              <Slider
                id="recording-quality"
                min={0}
                max={10}
                step={1}
                value={[recordingQuality]}
                onValueChange={(value) => setRecordingQuality(value[0])}
                className={cn(errors.recordingQuality && "border-destructive")}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Poor</span>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
            </div>
          </div>

          {/* Production Quality Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="production-quality" className={cn(errors.productionQuality && "text-destructive")}>
                Production Quality <span className="text-destructive">*</span>
              </Label>
              <span className="text-2xl" aria-hidden="true">
                {getRatingEmoji(productionQuality)}
              </span>
            </div>
            <div className="px-1">
              <Slider
                id="production-quality"
                min={0}
                max={10}
                step={1}
                value={[productionQuality]}
                onValueChange={(value) => setProductionQuality(value[0])}
                className={cn(errors.productionQuality && "border-destructive")}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Poor</span>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
            </div>
          </div>

          {/* Originality/Uniqueness Rating */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="originality" className={cn(errors.originality && "text-destructive")}>
                Originality/Uniqueness <span className="text-destructive">*</span>
              </Label>
              <span className="text-2xl" aria-hidden="true">
                {getRatingEmoji(originality)}
              </span>
            </div>
            <div className="px-1">
              <Slider
                id="originality"
                min={0}
                max={10}
                step={1}
                value={[originality]}
                onValueChange={(value) => setOriginality(value[0])}
                className={cn(errors.originality && "border-destructive")}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Generic</span>
                <span className="text-xs text-muted-foreground">Unique</span>
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any additional feedback for the artist..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-destructive hover:bg-destructive/90" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Declining...
              </>
            ) : (
              "Decline Pitch"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
