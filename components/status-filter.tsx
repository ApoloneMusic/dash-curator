"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type StatusOption = {
  value: string
  label: string
}

interface StatusFilterProps {
  selectedStatus: string
  onStatusChange: (status: string) => void
  statusOptions?: StatusOption[]
}

export function StatusFilter({ selectedStatus, onStatusChange, statusOptions }: StatusFilterProps) {
  // Default status options if none provided
  const defaultStatusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
  ]

  const options = statusOptions || defaultStatusOptions

  // Get the label for the selected status
  const getSelectedLabel = () => {
    const option = options.find((option) => option.value === selectedStatus)
    return option ? option.label : "All Status"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 w-[150px] justify-between">
          {getSelectedLabel()}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
              {selectedStatus === option.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
