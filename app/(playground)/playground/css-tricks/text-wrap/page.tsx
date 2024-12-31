'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

// Basic approach - just wraps and clips
function BasicWrapper({ content, debug }: {
    content: { phrases: string[] }
    debug?: boolean
}) {
    return (
        <div className="overflow-hidden h-[1lh]">
            <div className={`flex flex-wrap`}>
                {content.phrases.map((phrase, index) => (
                    <div key={index} className={`whitespace-nowrap mr-2 ${debug ? `bg-blue-${index % 9 + 1}00` : ''}`}>
                        {phrase}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Basic approach with line shifting
function BasicLineShiftWrapper({ content, debug }: {
    content: { phrases: string[] }
    debug?: boolean
}) {
    return (
        <div className="overflow-hidden h-[1lh]">
            {/* First line with force-wrap */}
            <div className={`flex flex-wrap ${debug ? 'bg-red-100' : ''}`}>
                <div className={`w-0 h-[1lh] ${debug ? 'border-x-2 border-yellow-500' : ''}`} />
                <div className="whitespace-nowrap mr-2">
                    {content.phrases[0]}
                </div>
            </div>
        </div>
    )
}

// Advanced - Shows abbreviated content when space is limited
function AdvancedWrapper({ content, debug, showOverflow }: {
    content: {
        abbreviation: string
        phrases: string[]
    }
    debug?: boolean
    showOverflow?: boolean
}) {
    return (
        <div className={`${showOverflow ? 'h-auto' : 'overflow-hidden h-[1lh]'} relative`}>
            <div className={`${showOverflow ? '' : 'translate-y-[-2lh]'}`}>
                {/* First line: Full phrase with force-wrap */}
                <div className={`flex flex-wrap ${debug ? 'bg-red-100' : ''}`}>
                    <div className={`w-0 h-[1lh] ${debug ? 'border-x-2 border-yellow-500' : ''}`} />
                    <div className="whitespace-nowrap mr-2">
                        {content.phrases[0]}
                    </div>
                </div>
                {/* Second line: Abbreviated version */}
                <div className={debug ? 'bg-green-100' : ''}>
                    {content.abbreviation}
                </div>
                {/* Third line: All phrases */}
                <div className={`flex flex-wrap ${debug ? 'bg-blue-100' : ''}`}>
                    <div className={`whitespace-nowrap mr-2 ${debug ? 'bg-blue-200' : ''}`}>
                        {content.phrases[0]}
                    </div>
                    <div className={`whitespace-nowrap mr-2 ${debug ? 'bg-blue-300' : ''}`}>
                        {content.phrases[1]}
                    </div>
                </div>
            </div>
            {debug && (
                <div className="absolute inset-0 pointer-events-none ">
                    <div className="w-full h-[1lh] translate-y-[2lh] border-2 border-dashed border-purple-500 pointer-events-none">
                    </div>
                </div>
            )}
        </div>
    )
}

// Create a type-safe mapping of line heights
const LINE_HEIGHT_TRANSFORMS = {
    1: 'translate-y-[-1lh]',
    3: 'translate-y-[-3lh]',
    5: 'translate-y-[-5lh]',
    7: 'translate-y-[-7lh]',
    9: 'translate-y-[-9lh]',
    11: 'translate-y-[-11lh]',
    13: 'translate-y-[-13lh]',
} as const;

type ValidLineHeights = keyof typeof LINE_HEIGHT_TRANSFORMS;

function getTranslateClass(stageCount: number): string {
    const lines = (stageCount * 2 - 1) as ValidLineHeights;
    return LINE_HEIGHT_TRANSFORMS[lines] || LINE_HEIGHT_TRANSFORMS[13]; // fallback to max
}

// Enhanced multi-stage wrapper that shows progressively shorter content
function EnhancedWrapper({ content, debug }: {
    content: {
        stages: {
            text: string,
            color?: string
        }[]
    }
    debug?: boolean
}) {
    const reversedStages = [...content.stages].reverse();

    return (
        <div className="overflow-hidden h-[1lh]">
            <div className={getTranslateClass(reversedStages.length)}>
                {/* First, render all longer versions to establish wrapping behavior */}
                {reversedStages.map((stage, index) => (
                    <div
                        key={`trigger-${index}`}
                        className={`flex flex-wrap ${debug ? `bg-gray-50` : ''}`}
                    >
                        <div className={`w-0 h-[1lh] ${debug ? 'border-x-2 border-yellow-500' : ''}`} />
                        <div className="whitespace-nowrap mr-2">
                            {stage.text}
                        </div>
                    </div>
                ))}

                {/* Then render the actual visible stages */}
                {content.stages.map((stage, index) => (
                    <div
                        key={`content-${index}`}
                        className={`flex flex-wrap`}
                    >
                        <div className={`whitespace-nowrap mr-2 text-white ${debug ? `bg-${stage.color}` : ''}`}>
                            {stage.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Home() {
    // const [debug, setDebug] = useState(true)
    const debug = true
    const [content, ] = useState({
        primary: {
            short: "AAPL",
            full: "Apple Inc (AAPL.O)"
        },
        secondary: "$175.32 (▲2.45, +1.42%)"
    })

    // Derive the display formats
    const displayContent = {
        abbreviation: content.primary.short,
        phrases: [
            content.primary.full,
            content.secondary
        ]
    }

    return (
        <div className="container mx-auto p-4 space-y-8 max-w-4xl">
            <section>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
                    CSS trick: use flex-wrap to dynamically render text depending on parent element width
                </h1>
                <div className="flex justify-center my-8">
                    <Button asChild size="lg">
                        <Link href="./text-wrap/demo">
                            View Live Demo
                        </Link>
                    </Button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            Container queries let us change content at specific width breakpoints, but they can&apos;t 
                            respond to the actual space needed by text. This leads to a common problem: content either
                            gets clipped before the breakpoint triggers, or changes too early when there&apos;s still room.
                        </p>
                        
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            Here&apos;s a CSS technique that uses natural text wrapping behavior to trigger content changes
                            exactly when needed.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                            The Core Mechanism
                        </h2>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                            The technique has three key parts:
                        </p>
                        <pre className="rounded-md bg-muted p-4">
                            <code>{`// 1. Force-wrap trigger
<div class="w-0 h-[1lh]" />  // Zero-width element

// 2. Content layers
<div class="overflow-hidden h-[1lh]">  // Clip to single line
    <div class="translate-y-[-1lh]">    // Show specific layer
        {content}
    </div>
</div>

// 3. Layer positioning
translate-y-[-1lh]  // First variant
translate-y-[-2lh]  // Second variant
translate-y-[-3lh]  // Third variant`}</code>
                        </pre>
                        <p className="text-sm leading-7 [&:not(:first-child)]:mt-6">
                            When the container becomes too narrow, the zero-width element forces text to wrap.
                            We use this wrapping to shift different content variants into view.
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Problem Demonstration
                    </h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        Standard text wrapping with overflow: hidden. Notice how content gets cut off mid-word:
                    </p>
                </div>
                <div className="not-prose">
                    <div className="resize-x overflow-x-auto rounded-lg border bg-muted/40 p-4 min-w-[120px] max-w-full md:max-w-[800px] touch-pan-x">
                        <BasicWrapper content={displayContent} debug={debug} />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Basic Implementation
                </h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Adding the zero-width trigger element. Watch how the text wraps at exactly the right moment:
                </p>
                <div className="resize-x overflow-x-auto bg-gray-50 p-4 rounded-lg min-w-[120px] max-w-[800px]">
                    <BasicLineShiftWrapper content={displayContent} debug={debug} />
                </div>
            </section>

            <section>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Multiple Content Variants
                </h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Using multiple layers to show different content based on available width:
                </p>
                <pre className="rounded-md bg-muted p-4 mb-4">
                    <code>{`// Layer 1: Full content
"Apple Inc (AAPL.O) $175.32 (▲2.45, +1.42%)"

// Layer 2: Abbreviated
"AAPL $175.32"

// Layer 3: Minimal
"AAPL"`}</code>
                </pre>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Normal View:</h3>
                        <div className="resize-x overflow-x-auto bg-gray-50 p-4 rounded-lg min-w-[120px] max-w-[800px]">
                            <AdvancedWrapper
                                content={displayContent}
                                debug={debug}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Behind the Scenes:</h3>
                        <div className="resize-x overflow-x-auto overflow-y-visible bg-gray-50 p-4 rounded-lg min-w-[120px] max-w-[800px]">
                            <AdvancedWrapper
                                content={displayContent}
                                debug={true}
                                showOverflow={true}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Practical Example
                </h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Try resizing to see how each variant appears exactly when needed:
                </p>
                <div className="resize-x overflow-x-auto bg-gray-50 p-4 rounded-lg min-w-[10px] max-w-[800px]">
                    <EnhancedWrapper
                        content={{
                            stages: [
                                { text: "💀", color: 'red-900' },
                                { text: "Hi! 👋", color: 'red-700' },
                                { text: "Cozy box! 📦", color: 'orange-500' },
                                { text: "Need more room! 🤏", color: 'yellow-500' },
                                { text: "Stretching out a bit... 🧘", color: 'green-500' },
                                { text: "Ahhh, now I can wiggle around in here! 💃", color: 'blue-500' },
                                { text: "Wow, this is like a whole dance floor! Time to party! 🎉", color: 'blue-800' }
                            ]
                        }}
                        debug={debug}
                    />
                </div>
            </section>

            <section>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Technical Implementation Details
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    The technique works by combining several CSS properties:
                </p>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li>A zero-width element (<code>w-0</code>) acts as our content-aware trigger</li>
                    <li><code>translate-y</code> positions the appropriate content variant</li>
                    <li><code>overflow-hidden</code> ensures clean transitions between states</li>
                    <li>Logical line heights (<code>lh</code>) maintain precise content alignment</li>
                </ul>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    This combination creates a reliable, content-aware solution that adapts perfectly to any container width
                    without relying on fixed breakpoints.
                </p>
            </section>
            {/* help tailwind colour load */}
            <div className="h-0 overflow-hidden">
                <div className="bg-red-900">??</div>
                <div className="bg-red-700">??</div>
                <div className="bg-orange-500">??</div>
                <div className="bg-yellow-500">??</div>
                <div className="bg-green-500">??</div>
                <div className="bg-blue-500">??</div>
                <div className="bg-blue-800">??</div>
            </div>
        </div>
    )
}


