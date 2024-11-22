'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'
import { chronologyData } from '@/lib/translations'
import { type Locale, getTranslation } from '@/lib/localization'

export function ChronologyDrawer({ lang }: { lang: Locale }) {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            {
                threshold: 0,
                rootMargin: '-100px 0px -50%',
                root: document.querySelector('.drawer-content')
            }
        )

        const onDrawerStateChange = (event: CustomEvent<boolean>) => {
            if (event.detail) {
                setTimeout(() => {
                    document.querySelectorAll('h2, h3').forEach((heading) => observer.observe(heading))
                }, 100)
            }
        }

        document.addEventListener('drawerStateChange', onDrawerStateChange as EventListener)

        return () => {
            observer.disconnect()
            document.removeEventListener('drawerStateChange', onDrawerStateChange as EventListener)
        }
    }, [])

    return (
        <SharedDrawer
            title={getTranslation(lang, 'chronologyTitle')}
            icon={Clock}
        >
            <div className="flex flex-col md:flex-row justify-between mx-auto h-full overflow-y-auto p-4 pt-4">
                <main className="w-full md:pr-4">
                    {chronologyData[lang].map((year, yearIdx) => (
                        <section key={year.id} className="mb-8">
                            <h2 id={year.id} className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                {year.title} <div className="text-muted-foreground text-sm">
                                    ({yearIdx !== 0 
                                        ? (year.title).split('-').map((yearText)=>(`${parseInt(yearText)-parseInt(chronologyData[lang][0].title)}`)).join('-') 
                                        : `0-${1868-1853}`}
                                    {getTranslation(lang, 'yearsOld')})
                                </div>
                            </h2>
                            {Array.isArray(year.content) ? (
                                year.content.map((event) => (
                                    <div key={event.id} className="mb-4">
                                        <h3 id={event.id} className="text-xl font-medium mb-2">
                                            {event.title} 
                                        </h3>
                                        <p>{event.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p>{year.content}</p>
                            )}
                        </section>
                    ))}
                    <p className="mt-8 mb-8 text-sm text-gray-600">
                        {getTranslation(lang, 'chronologyFooter')}
                    </p>
                </main>
                <nav className="hidden md:block w-1/3 md:sticky md:top-0 self-start">
                    <h2 className="scroll-m-20 text-2xl font-semibold mb-4 sr-only">Table of Contents</h2>
                    <ul className="space-y-2">
                        {chronologyData[lang].map((year) => (
                            <li key={year.id}>
                                <a
                                    href={`#${year.id}`}
                                    className={`block py-1 ${activeSection === year.id ||
                                        (Array.isArray(year.content) && year.content.some((event) => event.id === activeSection))
                                        ? 'text-blue-600 font-semibold'
                                        : 'text-gray-600 hover:text-blue-600'
                                        }`}
                                >
                                    {year.title}
                                </a>
                                {Array.isArray(year.content) && (
                                    <ul className="ml-4 space-y-1">
                                        {year.content.map((event) => (
                                            <li key={event.id}>
                                                <a
                                                    href={`#${event.id}`}
                                                    className={`block py-1 ${activeSection === event.id
                                                        ? 'text-blue-600 font-semibold'
                                                        : 'text-gray-600 hover:text-blue-600'
                                                        }`}
                                                >
                                                    {event.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </SharedDrawer>
    )
} 