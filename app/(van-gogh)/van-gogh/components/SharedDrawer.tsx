'use client'

import { useState, useEffect, useId } from 'react'
import { Drawer } from 'vaul'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { LucideIcon } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { cn } from '@/lib/utils'

interface SharedDrawerProps {
    title: string
    pageTitle?: string
    icon: LucideIcon
    children: React.ReactNode
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    description?: string
}

const snapPoints = ['340px', 1]

export function SharedDrawer({ title, pageTitle = title, icon: Icon, children, isOpen, onOpenChange, description }: SharedDrawerProps) {
    const descriptionId = useId()
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0])
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 448)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])



    if (!isMobile) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        className={cn(
                            "ring-1 ring-foreground/5 bg-background/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75 h-8 flex items-center justify-center gap-1",
                            title ? "rounded-full px-2" : "rounded-full p-0"
                        )}
                        size={title ? "default" : "icon"}
                        aria-label={title}
                    >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                        {title && <span>{title}</span>}
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className={cn(
                        "sm:max-w-4xl h-[80vh] flex flex-col [--radius:1.5rem]",
                        "ring-1 ring-foreground/5 bg-background/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75"
                    )}
                    aria-describedby={description ? descriptionId : undefined}
                >
                    <DialogHeader className="flex-none m-0">
                        {pageTitle ? (
                            <DialogTitle className={cn(
                                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl m-0"
                            )}>
                                {pageTitle}
                            </DialogTitle>
                        ) : (
                            <VisuallyHidden asChild>
                                <DialogTitle>{title}</DialogTitle>
                            </VisuallyHidden>
                        )}
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
                <Button
                    className={cn(
                        "ring-1 ring-foreground/5 bg-background/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75 h-8 flex items-center justify-center gap-1",
                        title ? "rounded-full px-2" : "rounded-full p-0"
                    )}
                    size={title ? "default" : "icon"}
                    aria-label={title}
                >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    {title && <span>{title}</span>}
                </Button>
            </Drawer.Trigger>
            <Drawer.Overlay className="fixed inset-0 bg-background/50 z-40" />
            <Drawer.Portal>
                <Drawer.Content
                    className={cn(
                        "fixed flex flex-col ring-1 ring-foreground/5 bg-background/80 backdrop-blur-lg backdrop-saturate-150 backdrop-brightness-75",
                        "border-b-none rounded-t-3xl bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] drawer-content z-50"
                    )}
                    aria-describedby={description ? descriptionId : undefined}
                >
                    <Drawer.Title className={cn(
                        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 px-4 pt-5 pb-2",
                        "bg-transparent rounded-t-3xl"
                    )}>
                        {pageTitle}
                    </Drawer.Title>
                    {description && (
                        <div id={descriptionId} className="sr-only">
                            {description}
                        </div>
                    )}
                    <div className={cn('flex-1', {
                        'overflow-y-auto': snap === 1,
                        'overflow-hidden': snap !== 1,
                    })}>
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
} 