'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { SharedDrawer } from './SharedDrawer'

const enGBChronologyData = [
    {
        id: '1853',
        title: '1853',
        content: [
            {
                id: '1853-03-30',
                title: '30 March',
                content: 'Vincent Willem van Gogh is born in Zundert, the Netherlands.'
            }
        ]
    },
    {
        id: '1869-1875',
        title: '1869-1875',
        content: "Van Gogh works for the art dealers Goupil & Cie at The Hague, London, and Paris. His brother Theo (1857-1891) works for the same company from 1873."
    },
    {
        id: '1876-1879',
        title: '1876-1879',
        content: "Van Gogh takes a teaching post in England, where he also becomes a Christian lay preacher. He works as an evangelical preacher in the Borinage, a coal-mining region in Belgium."
    },
    {
        id: '1880-1885',
        title: '1880-1885',
        content: "Theo begins to provide financial support. Van Gogh decides to become an artist and spends a brief time at the Royal Academy of Fine Arts, Brussels, but over the next years, he works chiefly on his own. He lives in The Hague for two years, where he receives painting lessons, and at the end of 1885 he moves to Antwerp. Throughout this time, in a repeating pattern, Van Gogh is forced home to live with his parents due to a lack of funds."
    },
    {
        id: '1886',
        title: '1886',
        content: [
            {
                id: '1886-02',
                title: 'End of February',
                content: "Van Gogh moves to Paris to live with Theo, who is now an art dealer. He remains in Paris for the next two years."
            },
            {
                id: '1886-03',
                title: 'Early March-early June',
                content: "Van Gogh attends the studio of the painter Fernand Cormon (1845-1924). He becomes friends with the artists Emile Bernard (1868-1941), Louis Anquetin (1868-1932), and Henri de Toulouse-Lautrec (1864-1901), among others."
            },
            {
                id: '1886-autumn',
                title: 'Autumn',
                content: "Van Gogh exhibits works at a small number of informal venues, including the shop of the color merchant Pére Tanguy (1825-1894)."
            }
        ]
    },
    {
        id: '1887',
        title: '1887',
        content: [
            {
                id: '1887-02',
                title: 'About February-March',
                content: "He organizes an exhibition of Japanese prints from his own collection at the Montmartre café Le Tambourin."
            },
            {
                id: '1887-05',
                title: 'May',
                content: "Van Gogh meets and works with Paul Signac (1863-1935) in the suburbs of Paris."
            },
            {
                id: '1887-11',
                title: 'November-December',
                content: "He organizes an exhibition at a restaurant on the Boulevard de Clichy including works by Bernard, Anquetin, Toulouse-Lautrec, and himself. He meets the painters Georges Seurat (1859-1891) and Paul Gauguin (1848-1903)."
            }
        ]
    },
    {
        id: '1888',
        title: '1888',
        content: [
            {
                id: '1888-02-20',
                title: '20 February',
                content: "Van Gogh arrives in Arles and starts working right away. Throughout his time in the South of France, he sends his work to Theo."
            },
            {
                id: '1888-05-01',
                title: '1 May',
                content: "Van Gogh rents the Yellow House and uses it as a studio during the summer while lodging elsewhere in the town. He creates the drawings from Montmajour and views of the public garden in Arles."
            },
            {
                id: '1888-09-17',
                title: '17 September',
                content: "He moves into the Yellow House where he aims to create an artist's home."
            },
            {
                id: '1888-10-23',
                title: '23 October-23 December',
                content: "Paul Gauguin lives and works with Van Gogh at the Yellow House."
            },
            {
                id: '1888-12-23',
                title: '23 December',
                content: "Van Gogh has his first mental breakdown, cuts off his left ear, and is admitted to the hospital in Arles the next day."
            }
        ]
    },
    {
        id: '1889',
        title: '1889',
        content: [
            {
                id: '1889-01-07',
                title: '7 January',
                content: "Van Gogh leaves the hospital and resumes work."
            },
            {
                id: '1889-02',
                title: 'February',
                content: "He experiences repeated crises and hospitalizations."
            },
            {
                id: '1889-03',
                title: 'March and April',
                content: "Residing at the hospital in Arles, Van Gogh is assigned a room where he continues to work."
            },
            {
                id: '1889-03-23',
                title: '23-24 March',
                content: "The painter Paul Signac pays Van Gogh a visit."
            },
            {
                id: '1889-05-08',
                title: '8 May',
                content: "Van Gogh admits himself to the mental health hospital in Saint-Rémy-de-Provence."
            },
            {
                id: '1889-autumn',
                title: 'Autumn',
                content: "Van Gogh resumes correspondence with his friends Paul Gauguin and Emile Bernard. Theo sends two of Van Gogh's works to the Salon des Indépendants exhibition in Paris."
            }
        ]
    },
    {
        id: '1890',
        title: '1890',
        content: [
            {
                id: '1890-02',
                title: 'February',
                content: "Van Gogh shows six paintings at the annual avant-garde exhibition of Les XX in Brussels."
            },
            {
                id: '1890-03',
                title: 'March/April',
                content: "He exhibits ten paintings at the Salon des Indépendants in Paris."
            },
            {
                id: '1890-05-16',
                title: '16 May',
                content: "Van Gogh leaves Saint-Rémy and, after a stop in Paris, arrives in Auvers-sur-Oise, northwest of the city, on 20 May. He immediately takes up work, creating an impressive body of paintings, drawings, and prints."
            },
            {
                id: '1890-07-27',
                title: '27 July',
                content: "Van Gogh shoots himself in the chest and dies from his wounds two days later."
            }
        ]
    }
]

const zhTWChronologyData = [
    {
        "id": "1853",
        "title": "1853",
        "content": [
            {
                "id": "1853-03-30",
                "title": "3月30日",
                "content": "文森特·梵谷出生於荷蘭的祖特芬。"
            }
        ]
    },
    {
        "id": "1869-1875",
        "title": "1869-1875",
        "content": "梵谷在海牙、倫敦和巴黎為古皮爾畫廊工作。他的弟弟提奧（1857生1891逝）自1873年開始也在同公司任職。"
    },
    {
        "id": "1876-1879",
        "title": "1876-1879",
        "content": "梵谷在英國擔任教師，並成為基督教的在俗講道士。他在比利時的波里納日煤礦區作為福音傳道士工作。"
    },
    {
        "id": "1880-1885",
        "title": "1880-1885",
        "content": "提奧開始提供經濟支持。梵谷決定成為藝術家，短暫就讀於布魯塞爾皇家藝術學院，但接下來幾年主要自學。他在海牙住了兩年，期間接受繪畫指導，1885年年底搬到安特衛普。在此期間，由於經濟拮据，他不得不多次返回父母家中。"
    },
    {
        "id": "1886",
        "title": "1886",
        "content": [
            {
                "id": "1886-02",
                "title": "2月底",
                "content": "梵谷搬到巴黎與提奧同住，提奧此時是一名藝術品經紀人。他在巴黎住了兩年。"
            },
            {
                "id": "1886-03",
                "title": "3月初至6月初",
                "content": "梵谷加入法爾南德·科爾蒙（1845-1924）的畫室。他結識了藝術家埃米爾·伯納德（1868-1941）、路易·安凱坦（1868-1932）和亨利·德·土魯斯-羅特列克（1864-1901）等。"
            },
            {
                "id": "1886-autumn",
                "title": "秋季",
                "content": "梵谷在幾處非正式的場所展出作品，包括顏料商父親坦格的店鋪（1825-1894）。"
            }
        ]
    },
    {
        "id": "1887",
        "title": "1887",
        "content": [
            {
                "id": "1887-02",
                "title": "大約2月至3月",
                "content": "他在蒙馬特的Le Tambourin咖啡館組織了一個展覽，展示他收藏的日本版畫。"
            },
            {
                "id": "1887-05",
                "title": "5月",
                "content": "梵谷在巴黎郊區與保羅·西涅克（1863-1935）相識並合作。"
            },
            {
                "id": "1887-11",
                "title": "11月至12月",
                "content": "他在克利希大道的一家餐廳舉辦展覽，包括伯納德、安凱坦、土魯斯-羅特列克和他的作品。他遇到了畫家喬治·修拉（1859-1891）和保羅·高更（1848-1903）。"
            }
        ]
    },
    {
        "id": "1888",
        "title": "1888",
        "content": [
            {
                "id": "1888-02-20",
                "title": "2月20日",
                "content": "梵谷抵達阿爾勒並立即投入創作。整段時間他不斷將作品寄給提奧。"
            },
            {
                "id": "1888-05-01",
                "title": "5月1日",
                "content": "梵谷租下黃屋，在夏季用作畫室，並於鎮上其他地方寄宿。他創作了來自蒙馬喬山的素描和阿爾勒公園的景觀。"
            },
            {
                "id": "1888-09-17",
                "title": "9月17日",
                "content": "他搬入黃屋，希望創建一個藝術家之家。"
            },
            {
                "id": "1888-10-23",
                "title": "10月23日至12月23日",
                "content": "保羅·高更在黃屋與梵谷共同生活及創作。"
            },
            {
                "id": "1888-12-23",
                "title": "12月23日",
                "content": "梵谷首次精神崩潰，割掉左耳，次日被送至阿爾勒的醫院。"
            }
        ]
    },
    {
        "id": "1889",
        "title": "1889",
        "content": [
            {
                "id": "1889-01-07",
                "title": "1月7日",
                "content": "梵谷出院並恢復創作。"
            },
            {
                "id": "1889-02",
                "title": "2月",
                "content": "他多次發作精神危機並進出院治療，持續經歷精神困擾。"
            },
            {
                "id": "1889-03",
                "title": "3月和4月",
                "content": "在阿爾勒的醫院住院期間，梵谷被分配了一個房間繼續創作。"
            },
            {
                "id": "1889-03-23",
                "title": "3月23-24日",
                "content": "畫家保羅·西涅克探訪了梵谷。"
            },
            {
                "id": "1889-05-08",
                "title": "5月8日",
                "content": "梵谷自願入住聖雷米的精神健康醫院以治療他的精神問題。"
            },
            {
                "id": "1889-autumn",
                "title": "秋季",
                "content": "梵谷恢復與友人保羅·高更和埃米爾·伯納德的通信。提奧將梵谷的兩幅作品送去參加巴黎“獨立沙龍”展覽。"
            }
        ]
    },
    {
        "id": "1890",
        "title": "1890",
        "content": [
            {
                "id": "1890-02",
                "title": "2月",
                "content": "梵谷在布魯塞爾年度前衛藝術展览“二十人畫展”中展示了六幅畫作。"
            },
            {
                "id": "1890-03",
                "title": "3月/4月",
                "content": "他在巴黎的“獨立沙龍”展出了十幅畫作。"
            },
            {
                "id": "1890-05-16",
                "title": "5月16日",
                "content": "梵谷離開聖雷米，短暫停留巴黎後，5月20日抵達奧維爾小鎮，並立即投入到創作中，創作出大量令人印象深刻的油畫、素描和版畫。"
            },
            {
                "id": "1890-07-27",
                "title": "7月27日",
                "content": "梵谷朝自己胸口開槍，兩天後傷重不治而去世，享年37歲。"
            }
        ]
    }
]

const chronologyData = {
    "en-GB": { title: "Chronology", data: enGBChronologyData },
    "zh-TW": { title: "生平", data: zhTWChronologyData }
}

export function ChronologyDrawer({ lang }: { lang: "en-GB" | "zh-TW" }) {
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
            if (event.detail) { // if drawer is open
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
            title={chronologyData[lang].title}
            icon={Clock}
        >
            <div className="flex flex-col md:flex-row justify-between mx-auto h-full overflow-y-auto p-4 pt-4">
                <main className="w-full md:pr-4">
                    {chronologyData[lang].data.map((year, yearIdx) => (
                        <section key={year.id} className="mb-8">
                            <h2 id={year.id} className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                                {year.title} <div className="text-muted-foreground text-sm">({yearIdx !== 0 ? (year.title).split('-').map((yearText)=>(`${parseInt(yearText)-parseInt(chronologyData[lang].data[0].title)}`)).join('-') : `0-${1868-1853}`}{lang === 'zh-TW' ? '歲' : ' years old'})</div>
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
                    {lang === "zh-TW" ? (
                        <p className="mt-8 mb-8 text-sm text-gray-600">
                        {`更多有關梵谷生平及所有書信的資訊，請參考 `}
                    <a href="https://vangoghletters.org" className="text-blue-600 hover:underline">
                        vangoghletters.org
                        </a>
                        . 展覽中所有書信引文均來自此來源。
                        </p>
                    ): (
                        <p className="mt-8 mb-8 text-sm text-gray-600">
                        {`For more information about Van Gogh's life, as well as all his letters, visit `}
                    <a href="https://vangoghletters.org" className="text-blue-600 hover:underline">
                        vangoghletters.org
                    </a>
                    . All letter quotes in the exhibition are taken from this source.
                        </p>
                    )}
                </main>
                <nav className="hidden md:block w-1/3 md:sticky md:top-0 self-start" aria-label="Table of Contents">
                <h2 className="scroll-m-20 text-2xl font-semibold mb-4 sr-only">Table of Contents</h2>
                <ul className="space-y-2">
                    {chronologyData[lang].data.map((year) => (
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
        </SharedDrawer >
    )
} 