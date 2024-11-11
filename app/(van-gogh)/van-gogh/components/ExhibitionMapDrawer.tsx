'use client'

import { Map } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { ExhibitionPlan } from "./ExhibitionPlan"

export function ExhibitionMapDrawer({ lang = 'en-GB' }: { lang: 'en-GB' | 'zh-TW' }) {
    return (
        <SharedDrawer title="Exhibition Plan" icon={Map}>
            <div className="p-4 pt-4 flex-1">
                <ExhibitionPlan lang={lang} />
            </div>
        </SharedDrawer>
    )
} 