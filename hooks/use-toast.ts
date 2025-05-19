"use client"

import type React from "react"

// Simplified version of the toast hook
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    console.log(`Toast: ${props.title} - ${props.description}`)

    // In a real implementation, this would show a toast UI component
    // For this demo, we'll just log to console

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== props))
    }, 5000)
  }

  return { toast, toasts }
}
