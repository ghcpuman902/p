'use client'

import { useState } from 'react'

// Create a type-safe mapping of line heights
const LINE_HEIGHT_TRANSFORMS = {
    2: 'translate-y-[-2lh]',
    4: 'translate-y-[-4lh]',
    6: 'translate-y-[-6lh]',
    8: 'translate-y-[-8lh]',
    10: 'translate-y-[-10lh]',
    12: 'translate-y-[-12lh]',
    14: 'translate-y-[-14lh]',
} as const;

type ValidLineHeights = keyof typeof LINE_HEIGHT_TRANSFORMS;

function getTranslateClass(stageCount: number): string {
    const lines = (stageCount * 2) as ValidLineHeights;
    return LINE_HEIGHT_TRANSFORMS[lines] || LINE_HEIGHT_TRANSFORMS[12];
}

function EnhancedWrapper({ content, debug, showOverflow }: {
    content: {
        stages: {
            text: string,
            color?: string
        }[]
    }
    debug?: boolean
    showOverflow?: boolean
}) {
    const reversedStages = [...content.stages].reverse().slice(0, content.stages.length - 1);

    return (
        <div className={`${showOverflow ? 'overflow-visible h-auto' : 'overflow-hidden h-[1lh]'} relative`}>
            <div className={showOverflow ? '' : getTranslateClass(reversedStages.length)}>
                {reversedStages.map((stage, index) => (
                    <div
                        key={`trigger-${index}`}
                        className={`flex flex-wrap`}
                    >
                        <div className={`w-0 h-[1lh] overflow-visible`}>
                            <div className="w-1 h-full bg-yellow-500"/>
                        </div>
                        <div className="whitespace-nowrap">
                            {stage.text}
                        </div>
                    </div>
                ))}

                {content.stages.map((stage, index) => (
                    <div
                        key={`content-${index}`}
                        className={`flex flex-wrap`}
                    >
                        <div className={`whitespace-nowrap text-white ${debug ? `bg-${stage.color}` : ''}`}>
                            {stage.text}
                        </div>
                    </div>
                ))}
            </div>
            {showOverflow && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-[1lh] translate-y-[12lh] shadow-[0_0_300px_300px_rgba(0,0,0,0.5)]">
                    </div>
                </div>
            )}
        </div>
    )
}

export default function Demo() {
    const [showOverflow, setShowOverflow] = useState(false)

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center h-svh">
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={showOverflow}
                    onChange={(e) => setShowOverflow(e.target.checked)}
                />
                Show Behind the Scenes
            </label>

            <div className="w-full max-w-[800px]">
                <div className="resize-x overflow-x-auto overflow-y-visible bg-gray-50 border border-gray-400 p-4 rounded-lg min-w-[10px]">
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
                        debug={true}
                        showOverflow={showOverflow}
                    />
                </div>
            </div>

            {/* Tailwind color classes helper */}
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