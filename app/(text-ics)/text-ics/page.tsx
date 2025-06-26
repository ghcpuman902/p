"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddEventDialog } from "./components/add-event-dialog"
import { processText } from "./actions"
import { useEffect } from "react"

// Define the CalendarEvent type
interface CalendarEvent {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  description?: string;
  isAllDay: boolean;
  _partial?: boolean;
}

// Platform types for prioritization
type Platform = 'apple' | 'google' | 'microsoft' | 'unknown'

// Client-side platform detection
const detectClientPlatform = (): Platform => {
  if (typeof navigator === 'undefined') return 'unknown'
  
  const userAgent = navigator.userAgent.toLowerCase()
  
  // Check for Apple devices
  if (
    /iphone|ipad|ipod|macintosh|mac os x/.test(userAgent) && 
    !/chrome|chromium/.test(userAgent)
  ) {
    return 'apple'
  }
  
  // Check for Google Chrome
  if (/chrome|chromium/.test(userAgent) && !/edg|edge|msie|trident/.test(userAgent)) {
    return 'google'
  }
  
  // Check for Microsoft browsers/devices
  if (/edg|edge|msie|trident|windows phone|windows nt/.test(userAgent)) {
    return 'microsoft'
  }
  
  // Default case
  return 'unknown'
}

export default function CalendarExtractor() {
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    events?: CalendarEvent[];
    _partial?: boolean;
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userPlatform, setUserPlatform] = useState<Platform>('unknown')

  useEffect(() => {
    // Detect platform on client side
    setUserPlatform(detectClientPlatform())
  }, [])

  const handleProcess = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)
    setResult(null)
    setError(null)

    try {
      const stream = await processText(inputText)
      const reader = stream.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setResult(value)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Event Extractor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text containing calendar events (e.g., 'Meeting with John tomorrow at 3pm in the conference room')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleProcess} disabled={isProcessing || !inputText.trim()} className="w-full">
            {isProcessing ? "Processing..." : "Extract Events"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Card className="mt-6 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Extracted Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {result.events?.map((event: CalendarEvent, index: number) => {
                // Only render complete events
                const isComplete =
                  !result._partial &&
                  event.title &&
                  event.startDateTime &&
                  event.endDateTime &&
                  typeof event.isAllDay === "boolean"

                return (
                  <div key={event.id || index} className="border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">
                        {event.title || <span className="text-muted-foreground italic">Generating title...</span>}
                      </h3>
                      {isComplete && <AddEventDialog event={event} userPlatform={userPlatform} />}
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="font-medium">Start:</span>
                        <span>
                          {event.startDateTime || <span className="text-muted-foreground italic">Generating...</span>}
                        </span>
                      </div>

                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="font-medium">End:</span>
                        <span>
                          {event.endDateTime || <span className="text-muted-foreground italic">Generating...</span>}
                        </span>
                      </div>

                      {(event.location !== undefined || (result.events && result.events[index]?._partial)) && (
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                          <span className="font-medium">Location:</span>
                          <span>
                            {event.location || <span className="text-muted-foreground italic">Generating...</span>}
                          </span>
                        </div>
                      )}

                      {(event.description !== undefined || (result.events && result.events[index]?._partial)) && (
                        <div className="grid grid-cols-[100px_1fr] gap-2">
                          <span className="font-medium">Description:</span>
                          <span>
                            {event.description || <span className="text-muted-foreground italic">Generating...</span>}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <span className="font-medium">All Day:</span>
                        <span>
                          {event.isAllDay !== undefined ? (
                            event.isAllDay ? (
                              "Yes"
                            ) : (
                              "No"
                            )
                          ) : (
                            <span className="text-muted-foreground italic">Generating...</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {result._partial && !result.events?.length && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Analyzing text...</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

