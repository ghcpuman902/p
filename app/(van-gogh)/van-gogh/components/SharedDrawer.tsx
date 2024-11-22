'use client'

import { useState, useEffect, useId } from 'react'
import { Drawer } from 'vaul'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { clsx } from 'clsx'
import { Button } from "@/components/ui/button"
import { LucideIcon } from 'lucide-react'

interface SharedDrawerProps {
    title: string
    icon: LucideIcon
    children: React.ReactNode
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    description?: string
}

const snapPoints = ['340px', 1]

export function SharedDrawer({ title, icon: Icon, children, isOpen, onOpenChange, description }: SharedDrawerProps) {
    const descriptionId = useId()
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0])
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 448) // 28rem = 448px (28 * 16px)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!isMobile) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button className="rounded-full h-10 flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                        <span>{title}</span>
                    </Button>
                </DialogTrigger>
                <DialogContent 
                    className="sm:max-w-4xl h-[80vh] flex flex-col [--radius:1.5rem]"
                    aria-describedby={description ? descriptionId : undefined}
                >
                    <DialogHeader className="flex-none m-0">
                        <DialogTitle className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl m-0">
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                    {description && (
                        <div id={descriptionId} className="sr-only">
                            {description}
                        </div>
                    )}
                    <div className="flex-1 h-auto flex flex-col overflow-y-auto">
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer.Root 
            snapPoints={snapPoints} 
            activeSnapPoint={snap} 
            setActiveSnapPoint={setSnap}
            modal={true}
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <Drawer.Trigger asChild>
                <Button className="rounded-full h-10 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                    <span>{title}</span>
                </Button>
            </Drawer.Trigger>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Portal>
                <Drawer.Content className="fixed flex flex-col bg-white dark:bg-zinc-950 border border-gray-400 dark:border-zinc-600 border-b-none rounded-t-3xl bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] drawer-content">
                    <div className="flex flex-col max-w-md mx-auto w-full h-full">
                        <div className="px-4 pt-5 pb-2 bg-white dark:bg-zinc-950 shadow rounded-t-3xl">
                            <Drawer.Title className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                                {title}
                            </Drawer.Title>
                        </div>
                        <div className={clsx('flex-1', {
                            'overflow-y-auto': snap === 1,
                            'overflow-hidden': snap !== 1,
                        })}>
                            {children}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
} 