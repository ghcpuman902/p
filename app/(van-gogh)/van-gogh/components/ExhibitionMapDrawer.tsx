'use client'

import { Map } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { ExhibitionPlan } from "./ExhibitionPlan"
import { type Locale, getTranslation } from '@/app/(van-gogh)/van-gogh/libs/localization'

interface ExhibitionMapDrawerProps {
    currentLocale: Locale
}

export function ExhibitionMapDrawer({ currentLocale }: ExhibitionMapDrawerProps) {
    return (
        <SharedDrawer 
            title={getTranslation(currentLocale, "exhibitionPlan")} 
            icon={Map}
        >
            <div className="p-4 pt-4 flex-1">
                <ExhibitionPlan currentLocale={currentLocale} />
            </div>
        </SharedDrawer>
    )
} 