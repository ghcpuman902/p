"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import {
  FaGoogle,
  FaApple,
  FaMicrosoft,
  FaCalendarAlt,
  FaDownload,
  FaCopy
} from "react-icons/fa"

interface CalendarEvent {
  title: string
  startDateTime: string
  endDateTime: string
  location?: string
  description?: string
  isAllDay: boolean
}

// Platform types for prioritization
type Platform = 'apple' | 'google' | 'microsoft' | 'unknown'

interface AddEventDialogProps {
  event: CalendarEvent
  userPlatform?: Platform
}

function isValidDate(dateStr: string) {
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime())
}

function isCompleteEvent(event: Partial<CalendarEvent>): event is CalendarEvent {
  return (
    typeof event.title === "string" &&
    typeof event.startDateTime === "string" &&
    typeof event.endDateTime === "string" &&
    isValidDate(event.startDateTime) &&
    isValidDate(event.endDateTime) &&
    typeof event.isAllDay === "boolean"
  )
}

function generateICalString(event: CalendarEvent) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (!isValidDate(dateStr)) {
      throw new Error("Invalid date format")
    }
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDate(event.startDateTime)}
DTEND:${formatDate(event.endDateTime)}
${event.location ? `LOCATION:${event.location}` : ""}
${event.description ? `DESCRIPTION:${event.description}` : ""}
END:VEVENT
END:VCALENDAR`
}

function generateGoogleCalendarUrl(event: CalendarEvent) {
  if (!isCompleteEvent(event)) {
    throw new Error("Incomplete event data")
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${new Date(event.startDateTime).toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(event.endDateTime).toISOString().replace(/[-:]/g, "").split(".")[0]
      }Z`,
    ...(event.location ? { location: event.location } : {}),
    ...(event.description ? { details: event.description } : {}),
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function generateOutlookUrl(event: CalendarEvent) {
  if (!isCompleteEvent(event)) {
    throw new Error("Incomplete event data")
  }

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(event.startDateTime).toISOString(),
    enddt: new Date(event.endDateTime).toISOString(),
    ...(event.location ? { location: event.location } : {}),
    ...(event.description ? { body: event.description } : {}),
  })

  return `https://outlook.live.com/calendar/0/${params.toString()}`
}

export function AddEventDialog({ event, userPlatform = 'unknown' }: AddEventDialogProps) {
  const [copied, setCopied] = useState(false)

  // Validate the event before processing
  if (!isCompleteEvent(event)) {
    return null
  }

  const icalString = generateICalString(event)
  const dataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icalString)}`

  const handleCopyIcal = async () => {
    try {
      await navigator.clipboard.writeText(icalString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = dataUri
    link.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Define calendar options with their actions
  const calendarOptions = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: <FaGoogle className="size-5" />,
      action: () => window.open(generateGoogleCalendarUrl(event), "_blank"),
      isPrimary: userPlatform === 'google'
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: <FaApple className="size-5" />,
      action: handleDownload,
      isPrimary: userPlatform === 'apple'
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: <FaMicrosoft className="size-5" />,
      action: () => window.open(generateOutlookUrl(event), "_blank"),
      isPrimary: userPlatform === 'microsoft'
    },
    {
      id: 'download',
      name: 'Download .ics File',
      icon: <FaDownload className="size-5" />,
      action: handleDownload,
      isPrimary: false
    },
    {
      id: 'copy',
      name: copied ? 'Copied!' : 'Copy iCal Format',
      icon: <FaCopy className="size-5" />,
      action: handleCopyIcal,
      isPrimary: false
    }
  ]

  // Get primary option based on user platform
  const primaryOption = calendarOptions.find(option => option.isPrimary) || calendarOptions[0]
  // Get secondary options (all except primary)
  const secondaryOptions = calendarOptions.filter(option => option !== primaryOption)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FaCalendarAlt className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>Choose how you would like to add this event to your calendar</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {/* Primary option (highlighted based on detected platform) */}
          <Button
            className="w-full justify-center text-2xl py-6 bg-primary hover:bg-primary/90 border-2 border-primary/20"
            onClick={primaryOption.action}
          >
            <div className="flex items-center [&_svg]:size-6">
              {primaryOption.icon}
              <span className="ml-3">{primaryOption.name}</span>
            </div>
          </Button>

          {/* Secondary options */}
          {secondaryOptions.map(option => (
            <Button
              key={option.id}
              variant="outline"
              className="justify-start"
              onClick={option.action}
            >
              <div className="mr-2">
                {option.icon}
              </div>
              {option.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

