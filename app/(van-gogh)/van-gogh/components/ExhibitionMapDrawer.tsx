'use client'

import { Map } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { ExhibitionPlan } from "./ExhibitionPlan"
import { type Locale, getTranslation } from '@/lib/localization'

interface ExhibitionMapDrawerProps {
    lang: Locale
}

export function ExhibitionMapDrawer({ lang }: ExhibitionMapDrawerProps) {
    return (
        <SharedDrawer 
            title={getTranslation(lang, "exhibitionPlan")} 
            icon={Map}
        >
            <div className="p-4 pt-4 flex-1">
                <ExhibitionPlan lang={lang} />
            </div>
        </SharedDrawer>
    )
} 