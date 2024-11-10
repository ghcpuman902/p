'use client'

import { useState } from 'react'
import { Drawer } from 'vaul'
import { clsx } from 'clsx'
import { Map } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ExhibitionPlan } from "./ExhibitionPlan"

const snapPoints = ['340px', 1]

export function ExhibitionMapDrawer() {
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

    return (
        <Drawer.Root snapPoints={snapPoints} activeSnapPoint={snap} setActiveSnapPoint={setSnap} modal={true}>
            <Drawer.Trigger asChild>
                <Button size="icon" className="rounded-full h-12 w-12">
                    <Map className="h-6 w-6" />
                </Button>
            </Drawer.Trigger>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Portal>
                <Drawer.Content
                    className="fixed flex flex-col bg-white dark:bg-zinc-950 border border-gray-400 dark:border-zinc-600 border-b-none rounded-t-[20px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] drawer-content"
                >
                    <div className={clsx('flex flex-col max-w-md mx-auto w-full p-4 pt-5', {
                        'overflow-y-auto': snap === 1,
                        'overflow-hidden': snap !== 1,
                    })}>
                        <Drawer.Title className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Exhibition Plan</Drawer.Title>
                        <div className="p-4">
                            <ExhibitionPlan language="english" />
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
} 