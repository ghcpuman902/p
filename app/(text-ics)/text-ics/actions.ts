"use server"

import { streamObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

const calendarEventSchema = z.object({
  id: z.string().default(() => uuidv4()),
  title: z.string().describe("The title or summary of the event"),
  startDateTime: z.string().describe("The start date and time of the event in ISO format"),
  endDateTime: z.string().describe("The end date and time of the event in ISO format"),
  location: z.string().optional().describe("The location of the event"),
  description: z.string().optional().describe("A description of the event"),
  isAllDay: z.boolean().default(false).describe("Whether the event is an all-day event"),
})

const eventsSchema = z.object({
  events: z.array(calendarEventSchema).describe("Array of calendar events extracted from the text"),
})

export async function processText(text: string) {
  const prompt = `
Extract all calendar events from the following text. Make reasonable assumptions about missing details. Try to match the format of the title across the events if they are relevant.
For each event, extract:
- Title/summary
- Start date and time (assume current year if not specified)
- End date and time (default to 1 hour after start if not specified)
- Location (if mentioned)
- Description (any additional details)
- Whether it's an all-day event

IMPORTANT: If there are multiple events in the text, make sure to identify and extract EACH ONE separately.

Text to analyze:
${text}
`

  const { partialObjectStream } = streamObject({
    model: openai("gpt-4o-mini"),
    schema: eventsSchema,
    prompt,
  })

  // Convert the async iterator to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of partialObjectStream) {
          controller.enqueue(chunk)
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return stream
}

