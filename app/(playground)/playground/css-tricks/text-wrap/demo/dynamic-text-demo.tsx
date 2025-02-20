'use client'

import React, { useState, forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

// Consolidate color palette into a more organized structure
const colorPalette = [
    'red-700', 'red-600', 'red-500',
    'rose-600', 'rose-500',
    'pink-600', 'pink-500',
    'fuchsia-600', 'fuchsia-500',
    'purple-600', 'purple-500',
    'indigo-600', 'indigo-500',
    'blue-600', 'blue-500'
] as const

// Add proper type definitions
type Stage = {
    text: string
    color?: string
}

type DynamicTextProps = {
    content: {
        stages: Stage[]
    }
    enableAutoSortForMonoFont?: boolean
    className?: string
    showDebug?: boolean
}

type Formatter = Intl.NumberFormat | { format: (n: number) => string }

function generateDateFormats(date: Date, locale: string) {
    const dateFormats = [
        { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', era: 'long' },
        { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' },
        { year: 'numeric', month: 'short', day: 'numeric' },
        { month: 'short', day: 'numeric', weekday: 'short' },
        { month: 'short', day: 'numeric' },
        { day: '2-digit' }
    ] as const

    return dateFormats.map(format => {
        const formatter = new Intl.DateTimeFormat(locale, format)
        return formatter.format(date)
    })
}

function generateTimeFormats(date: Date, locale: string) {
    const timeFormats = [
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'long', timeZoneName: 'long' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'long', timeZoneName: 'short' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'narrow', timeZoneName: 'short' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false },
        { hour: 'numeric', minute: 'numeric', hour12: true },
        { hour: 'numeric', minute: 'numeric', hour12: false },
        { hour: 'numeric', hour12: true },
    ] as const

    return timeFormats.map(format => {
        const formatter = new Intl.DateTimeFormat(locale, format)
        return formatter.format(date)
    })
}

function generateCurrencyFormats(amount: number, locale: string) {
    //match popular currency to locale, default else to GBP
    const currencyLocaleMap = {
        'en-GB': 'GBP',
        'en-US': 'USD',
        'de-DE': 'EUR',
        'fr-FR': 'EUR',
        'es-ES': 'EUR',
        'it-IT': 'EUR',
        'pt-PT': 'EUR',
        'nl-NL': 'EUR',
        'cn-CN': 'CNY',
        'tw-TW': 'TWD',
        'hk-HK': 'HKD',
        'ja-JP': 'JPY',
        'kr-KR': 'KRW',
        'ru-RU': 'RUB',
        'sa-SA': 'SAR',
        'se-SE': 'SEK',
        'ch-CH': 'CHF',
        'au-AU': 'AUD',
        'nz-NZ': 'NZD',
        'ca-CA': 'CAD',
    }
    const currency = currencyLocaleMap[locale as keyof typeof currencyLocaleMap] || 'GBP'
    const formatters: Formatter[] = [
        new Intl.NumberFormat(locale, { style: 'currency', currency: currency, currencyDisplay: 'name' }),
        new Intl.NumberFormat(locale, { style: 'currency', currency: currency, currencyDisplay: 'code' }),
        new Intl.NumberFormat(locale, { style: 'currency', currency: currency, currencyDisplay: 'code', maximumFractionDigits: 0 }),
        new Intl.NumberFormat(locale, { style: 'currency', currency: currency, currencyDisplay: 'symbol', maximumFractionDigits: 0 }),
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol',
            notation: 'compact',
            maximumFractionDigits: 1
        }),
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol',
            notation: 'compact',
            maximumFractionDigits: 0
        })
    ]

    return formatters.map(formatter =>
        formatter instanceof Intl.NumberFormat ? formatter.format(amount) : formatter.format(amount)
    )
}

function generateCountryFormats() {
    return [
        { text: "🇬🇧" },
        { text: "UK" },
        { text: "The UK" },
        { text: "UK of GB & NI" },
        { text: "United Kingdom" },
        { text: "United Kingdom (UK)" },
        { text: "United Kingdom of GB & NI" },
        { text: "United Kingdom of GB and NI" },
        { text: "The United Kingdom of GB & NI" },
        { text: "The United Kingdom of Great Britain and NI" },
        { text: "The United Kingdom of Great Britain and NI (UK)" },
        { text: "The United Kingdom of Great Britain and Northern Ireland" },
        { text: "The United Kingdom of Great Britain and Northern Ireland (UK)" }
    ]
}

// Simplify the DynamicText component by extracting the sorting logic
const sortStages = (stages: Stage[], enableAutoSortForMonoFont: boolean) => {
    if (!enableAutoSortForMonoFont) return stages
    return [...stages].sort((a, b) => b.text.length - a.text.length)
}

const DynamicText = forwardRef<HTMLDivElement, DynamicTextProps>(
    ({ content, enableAutoSortForMonoFont = false, className = '', ...props }, ref) => {
        const sortedStages = sortStages(content.stages, enableAutoSortForMonoFont)
        const shouldReverse = sortedStages[0].text.length > sortedStages[sortedStages.length - 1].text.length

        const triggerStages = shouldReverse
            ? sortedStages.slice(0, -1)
            : [...sortedStages].reverse().slice(0, -1)

        const contentStages = shouldReverse
            ? [...sortedStages].reverse()
            : [...sortedStages]

        return (
            <div ref={ref} className={cn('overflow-hidden h-[1lh] relative', className)} {...props}>
                <div style={{ transform: `translateY(-${triggerStages.length * 2}lh)` }}>
                    {triggerStages.map((stage, index) => (
                        <div
                            key={`trigger-${index}`}
                            className={`flex flex-wrap`}
                        >
                            <div className={`w-0 h-[1lh] overflow-visible`}>
                                <div className="w-1 h-full bg-yellow-500" />
                            </div>
                            <div className="whitespace-nowrap" suppressHydrationWarning>
                                {stage.text}
                            </div>
                        </div>
                    ))}

                    {contentStages.map((stage, index) => (
                        <div
                            key={`content-${index}`}
                            className={`flex flex-wrap`}
                        >
                            <div className={`whitespace-nowrap`} suppressHydrationWarning>
                                {stage.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
)

DynamicText.displayName = 'DynamicText'

const DebugDynamicText = forwardRef<HTMLDivElement, {
    content: { stages: { text: string, color?: string }[] }
    enableAutoSortForMonoFont?: boolean
    className?: string
}>(({ content, enableAutoSortForMonoFont = false, className = '', ...props }, ref) => {
    const sortedStages = enableAutoSortForMonoFont
        ? [...content.stages].sort((a, b) => b.text.length - a.text.length)
        : content.stages;

    const firstItem = sortedStages[0];
    const lastItem = sortedStages[sortedStages.length - 1];
    const shouldReverse = firstItem.text.length > lastItem.text.length;

    const triggerStages = shouldReverse
        ? sortedStages.slice(0, -1)
        : [...sortedStages].reverse().slice(0, -1);

    const contentStages = shouldReverse
        ? [...sortedStages].reverse()
        : [...sortedStages];

    return (
        <div
            ref={ref}
            className={cn(
                'overflow-visible h-auto',
                'relative',
                className
            )}
            style={{
                transform: `translateY(-${triggerStages.length * 2}lh)`
            }}
            {...props}
        >
            <div>
                {triggerStages.map((stage, index) => (
                    <div
                        key={`trigger-${index}`}
                        className={`flex flex-wrap`}
                    >
                        <div className={`w-0 h-[1lh] overflow-visible`}>
                            <div className="w-1 h-full bg-yellow-500" />
                        </div>
                        <div className="whitespace-nowrap" suppressHydrationWarning>
                            {stage.text}
                        </div>
                    </div>
                ))}

                {contentStages.map((stage, index) => (
                    <div
                        key={`content-${index}`}
                        className={`flex flex-wrap`}
                    >
                        <div className={`whitespace-nowrap ring-2 ring-inset ring-${stage.color}`} suppressHydrationWarning>
                            {stage.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
})

DebugDynamicText.displayName = 'DebugDynamicText'

// Simplify the useIsMobile hook with a more concise implementation
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    return isMobile
}

const ResponsiveResizeWrapper = ({ children, showDebug, ...props }: { children: React.ReactNode, showDebug?: boolean }) => {
    const isMobile = useIsMobile()
    const [width, setWidth] = useState(100)

    const childrenWithProps = React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ showDebug?: boolean }>, { showDebug }) : child
    )

    if (isMobile) {
        return (
            <div className="relative max-w-full mb-10 mt-6" {...props}>
                <div className="flex">
                    <div style={{ width: `${width}%` }} className="rounded-sm shadow-sm border-2 sm:border mb-4">
                        {childrenWithProps}
                    </div>
                </div>
                <Slider
                    defaultValue={[width]} max={100} step={1}
                    value={[width]}
                    onValueChange={(value) => setWidth(value[0])}
                    className="w-full"
                    aria-label="Adjust panel width"
                    id="width"
                />
                <Label htmlFor="width">element width: {width}%</Label>
            </div>
        )
    }

    return (
        <div className="max-w-full resize-x overflow-x-auto rounded-sm shadow-sm border-2 sm:border mb-10 mt-6" {...props}>
            {childrenWithProps}
        </div>
    )
}

const DynamicTextWrapper = forwardRef<HTMLDivElement, {
    content: { stages: { text: string, color?: string }[] }
    enableAutoSortForMonoFont?: boolean
    className?: string
    showDebug?: boolean
}>(({ content, enableAutoSortForMonoFont = false, className = '', showDebug, ...props }, forwardedRef) => {
    const dynamicTextRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (!forwardedRef) return;
        if (typeof forwardedRef === 'function') {
            forwardedRef(dynamicTextRef.current);
        } else {
            forwardedRef.current = dynamicTextRef.current;
        }
    }, [forwardedRef]);

    const [rect, setRect] = useState<DOMRect | null>(null)
    const debugContainerRef = useRef<HTMLDivElement>(null)
    const [id] = useState(() => Math.random().toString(36).slice(2)) // Unique ID for each instance

    useEffect(() => {
        if (!dynamicTextRef.current) return

        const element = dynamicTextRef.current
        const updateRect = () => {
            const newRect = element.getBoundingClientRect()

            setRect(prev => {
                if (!prev) return newRect
                if (
                    prev.width !== newRect.width ||
                    prev.left !== newRect.left ||
                    prev.top !== newRect.top
                ) {
                    return new DOMRect(
                        newRect.left,
                        newRect.top,
                        newRect.width,
                        newRect.height
                    )
                }
                return prev
            })
        }

        const resizeObserver = new ResizeObserver(updateRect)
        resizeObserver.observe(element)

        // Watch for scroll and position changes
        window.addEventListener('scroll', updateRect, true)
        window.addEventListener('resize', updateRect)

        updateRect()

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('scroll', updateRect, true)
            window.removeEventListener('resize', updateRect)
        }
    }, [])

    return (
        <div className="relative" data-dynamic-text-id={id} {...props}>
            {showDebug && rect && (
                <div
                    ref={debugContainerRef}
                    className="pointer-events-none"
                    style={{
                        position: 'fixed',
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        zIndex: 50
                    }}
                >
                    <DebugDynamicText
                        content={content}
                        enableAutoSortForMonoFont={enableAutoSortForMonoFont}
                        className={cn("bg-transparent opacity-30", className)}
                    />
                </div>
            )}
            <DynamicText
                ref={dynamicTextRef}
                content={content}
                enableAutoSortForMonoFont={enableAutoSortForMonoFont}
                className={cn(className)}
            />
        </div>
    )
})

DynamicTextWrapper.displayName = 'DynamicTextWrapper'

const ResizablePanelContent = ({ showDebug, content, className }: { 
    showDebug?: boolean, 
    content: { stages: { text: string, color?: string }[] },
    className?: string 
}) => (
    <DynamicTextWrapper 
        content={content}
        className={className}
        showDebug={showDebug}
    />
)

function BillBoard({ children, showDebug, onToggleDebug }: { 
    children: React.ReactNode, 
    showDebug: boolean,
    onToggleDebug: (value: boolean) => void 
}) {
    return (
        <div className="w-full min-h-[calc(100vh-24rem)] flex justify-center items-center bg-neutral-50 dark:bg-neutral-900 shadow-inner rounded-lg mb-6 p-4 relative">
            {React.Children.map(children, child =>
                React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ showDebug?: boolean }>, { showDebug }) : child
            )}
            <label className="flex items-center gap-2 absolute bottom-2 right-2 border border-1 bg-background rounded-lg p-2 shadow-lg">
                <input
                    type="checkbox"
                    checked={showDebug}
                    onChange={(e) => onToggleDebug(e.target.checked)}
                />
                Show Behind the Scenes
            </label>
        </div>
    )
}

export default function DynamicTextDemo({ locale }: { locale: string }) {
    const [showDebugDemo, setShowDebugDemo] = useState(false)
    const [showDebugDateTime, setShowDebugDateTime] = useState(false)
    const [showDebugCountry, setShowDebugCountry] = useState(false)
    const [showDebugCurrency, setShowDebugCurrency] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const contents = {
        demo: {
            stages: [
                '↔️',
                'Resize',
                'Resize me',
                'Resize me!',
                '↔️ Resize me!',
                'I am dynamic! Resize me! ✨',
                'I adjust to space 📏 Resize me!',
                'I adjust dynamically 🔄 Resize me!',
                'I adjust to available space 😎 Resize me!',
                'I can adjust to available space 🎯 Resize me!',
                'I change depending on available space 🤹 Resize me!',
                'I adjust to available space dynamically 🔀 Resize me!',
                'I am dynamic and adjust to available space 🚀 Resize me!',
                'I am dynamic content that adjusts to available space 🌍 Resize me!',
                'Please try resizing me! 🙌 I am dynamic content that adjusts to available space.',
                'Hi there! 😊 Try resizing me—I am dynamic content that adjusts to available space.',
                'Good day, madam/sir! 🎩✨ Please try resizing me—I am dynamic content that adjusts to available space.'
            ].map((text, index) => ({
                text,
                color: colorPalette[index % colorPalette.length]
            }))
        },
        date: {
            stages: generateDateFormats(currentTime, locale).map((text, index) => ({
                text,
                color: colorPalette[index % colorPalette.length]
            }))
        },
        time: {
            stages: generateTimeFormats(currentTime, locale).map((text, index) => ({
                text,
                color: colorPalette[index % colorPalette.length]
            }))
        },
        country: {
            stages: generateCountryFormats().map((item, index) => ({
                ...item,
                color: colorPalette[index % colorPalette.length]
            }))
        },
        currency: {
            stages: generateCurrencyFormats(1234567, locale).map((text, index) => ({
                text,
                color: colorPalette[index % colorPalette.length]
            }))
        }
    }

    return (
        <div className="container mx-auto flex flex-col min-h-svh">
            <div className="w-full">
                <section>
                    <BillBoard showDebug={showDebugDemo} onToggleDebug={setShowDebugDemo}>
                        <ResponsiveResizeWrapper showDebug={showDebugDemo}>
                            <DynamicTextWrapper
                                content={contents.demo}
                                className="bg-background"
                            />
                        </ResponsiveResizeWrapper>
                    </BillBoard>
                </section>
                <section className="mb-10">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Other Examples</h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-prose">
                        The text wrap wrapper let browser dynamically adjust the content without any javascript!
                    </p>
                </section>
                {/* DateTime Section */}
                <section className="mb-10">
                    <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Date and Time Formats</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-prose">
                        Re-distribute the width with the handle in the middle to give more space for the date or the time.
                    </p>
                    <BillBoard showDebug={showDebugDateTime} onToggleDebug={setShowDebugDateTime}>
                        <ResponsiveResizeWrapper showDebug={showDebugDateTime}>
                            <ResizablePanelGroup direction="horizontal">
                                <ResizablePanel defaultSize={60}>
                                    <ResizablePanelContent 
                                        content={contents.date} 
                                        showDebug={showDebugDateTime}
                                    />
                                </ResizablePanel>
                                <ResizableHandle className="bg-secondary w-0.5" />
                                <ResizablePanel defaultSize={40}>
                                    <ResizablePanelContent 
                                        content={contents.time}
                                        className="tabular-nums"
                                        showDebug={showDebugDateTime}
                                    />
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResponsiveResizeWrapper>
                    </BillBoard>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-prose">Code used, note how Intl.DateTimeFormat is used to generate the date and time format of different length.</p>

                    <code className="relative rounded bg-muted py-1 px-4 overflow-x-auto font-mono text-sm font-semibold block mt-6">
                        <pre className="m-0 p-0 whitespace-pre">
                            {`
function generateTimeFormats(date: Date) {
    const timeFormats = [
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'long', timeZoneName: 'long' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'long', timeZoneName: 'short' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, dayPeriod: 'narrow', timeZoneName: 'short' },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
        { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false },
        { hour: 'numeric', minute: 'numeric', hour12: true },
        { hour: 'numeric', minute: 'numeric', hour12: false },
        { hour: 'numeric', hour12: true },
    ] as const

    return timeFormats.map(format => {
        const formatter = new Intl.DateTimeFormat('en-GB', format)
        return formatter.format(date)
    })
}

const timeContent = {
    stages: generateTimeFormats(currentTime).map((text, index) => ({
        text,
        color: colorPalette[index % colorPalette.length]
    }))
}

<DynamicText
    content={timeContent}
    className="tabular-nums"
/>
                            `}
                        </pre>
                    </code>
                </section>

                {/* Country Names Section */}
                <section className="mb-10">
                    <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Country Name Variations</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-prose">
                        Different ways to refer to the United Kingdom, from shortest to most formal naming conventions.
                    </p>
                    <BillBoard showDebug={showDebugCountry} onToggleDebug={setShowDebugCountry}>
                        <ResponsiveResizeWrapper showDebug={showDebugCountry}>
                            <DynamicTextWrapper content={contents.country} />
                        </ResponsiveResizeWrapper>
                    </BillBoard>
                </section>

                {/* Currency Section */}
                <section className="mb-10">
                    <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Currency Formats</h2>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-prose">
                        Various ways to format currency values, from full text representation to compact notations.
                    </p>
                    <BillBoard showDebug={showDebugCurrency} onToggleDebug={setShowDebugCurrency}>
                        <ResponsiveResizeWrapper showDebug={showDebugCurrency}>
                            <DynamicTextWrapper
                                content={contents.currency}
                                enableAutoSortForMonoFont={true}
                                className="font-mono"
                            />
                        </ResponsiveResizeWrapper>
                    </BillBoard>
                </section>
            </div>
        </div>
    )
}