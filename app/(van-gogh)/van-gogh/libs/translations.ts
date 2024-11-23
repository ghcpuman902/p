import { Locale } from "./localization";

export interface ChronologyContent {
    id: string;
    title: string;
    content: string | ChronologyContent[];
}

interface TranslationInterface {
    [key: string]: {
        [key in Locale]: string | string[] | ChronologyContent[];
    };
}

// Add helper to check if locale is Chinese
export function isChineseLocale(locale: Locale): boolean {
    return locale === "zh-TW" || locale === "zh-CN";
}

export const translations: TranslationInterface = {
    "chronologyData": {
        "en-GB": [
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
        ],
        "zh-TW": [
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
                "content": "提奧開始提供經濟支持。梵谷決定成為藝術家，短暫就讀於布魯塞爾皇家藝術學院，但接下來幾年主要自學。他在海牙住了兩年，期間接受畫指導，1885年年底搬到安特衛普。在此期間，由於經濟拮据，他不得不多次返回父母家中。"
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
                        "content": "梵谷抵達亞爾並立即投入創作。整段時間他不斷將作品寄給提奧。"
                    },
                    {
                        "id": "1888-05-01",
                        "title": "5月1日",
                        "content": "梵谷租下黃屋，在夏季用作畫室，並於鎮上其他地方寄宿。他創作了來自蒙馬喬山的素描和亞爾公園的景觀。"
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
                        "content": "梵谷首次精神崩潰，割掉左耳，次日被送至亞爾的醫院。"
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
                        "content": "在亞爾的醫院住院期間，梵谷被分配了一個房間繼續創作。"
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
        ],
        "zh-CN": [
            {
                "id": "1853",
                "title": "1853",
                "content": [
                    {
                        "id": "1853-03-30",
                        "title": "3月30日",
                        "content": "文森特·威廉·梵高出生于荷兰津德尔特。"
                    }
                ]
            },
            {
                "id": "1869-1875",
                "title": "1869-1875",
                "content": "梵高在海牙、伦敦和巴黎为古皮尔艺术品经销商公司工作。他的弟弟提奥（1857-1891）从1873年起在同一家公司工作。"
            },
            {
                "id": "1876-1879",
                "title": "1876-1879",
                "content": "梵高在英国担任教师职位，在那里他还成为了一名基督教平信徒传教士。他在比利时博里纳日（一个煤矿区）担任福音传教士。"
            },
            {
                "id": "1880-1885",
                "title": "1880-1885",
                "content": "提奥开始提供经济支持。梵高决定成为一名艺术家，并在布鲁塞尔皇家美术学院短暂学习，但在接下来的几年里，他主要依靠自学。他在海牙生活了两年，在那里接受了绘画课程，并在1885年底搬到安特卫普。在此期间，梵高由于资金短缺，反复被迫回家与父母同住。"
            },
            {
                "id": "1886",
                "title": "1886",
                "content": [
                    {
                        "id": "1886-02",
                        "title": "二月底",
                        "content": "梵高搬到巴黎与提奥同住，提奥现在是一名艺术品经销商。他在巴黎住了接下来的两年。"
                    },
                    {
                        "id": "1886-03",
                        "title": "3月初至6月初",
                        "content": "梵高进入费尔南·科尔蒙（1845-1924）的画室学习。他与埃米尔·伯纳德（1868-1941）、路易斯·安奎坦（1868-1932）和亨利·德·土鲁斯-劳特累克（1864-1901）等艺术家成为朋友。"
                    },
                    {
                        "id": "1886-autumn",
                        "title": "秋季",
                        "content": "梵高在少数非正式场所展出作品，包括颜料商佩雷·唐吉（1825-1894）的商店。"
                    }
                ]
            },
            {
                "id": "1887",
                "title": "1887",
                "content": [
                    {
                        "id": "1887-02",
                        "title": "约2月至3月",
                        "content": "他在蒙马特区的Le Tambourin咖啡馆举办了他自己收藏的日本版画展览。"
                    },
                    {
                        "id": "1887-05",
                        "title": "5月",
                        "content": "梵高在巴黎郊区遇到保罗·西涅克（1863-1935）并与他一起工作。"
                    },
                    {
                        "id": "1887-11",
                        "title": "11月至12月",
                        "content": "他在克利希大道的一家餐厅举办展览，展出伯纳德、安奎坦、土鲁斯-劳特累克和自己的作品。他遇到了画家乔治·修拉（1859-1891）和保罗·高更（1848-1903）。"
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
                        "content": "梵高抵达阿尔勒并立即开始工作。在法国南部期间，他将自己的作品寄给提奥。"
                    },
                    {
                        "id": "1888-05-01",
                        "title": "5月1日",
                        "content": "梵高租下了黄房子，并在夏天将其用作工作室，同时住在镇上的其他地方。他创作了来自蒙马若尔的素描和阿尔勒公共花园的景色。"
                    },
                    {
                        "id": "1888-09-17",
                        "title": "9月17日",
                        "content": "他搬进了黄房子，在那里他打算建立一个艺术家之家。"
                    },
                    {
                        "id": "1888-10-23",
                        "title": "10月23日至12月23日",
                        "content": "保罗·高更与梵高一起住在黄房子里并一起工作。"
                    },
                    {
                        "id": "1888-12-23",
                        "title": "12月23日",
                        "content": "梵高第一次精神崩溃，割掉了自己的左耳，并在第二天被送入阿尔勒的医院。"
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
                        "content": "梵高离开医院并恢复工作。"
                    },
                    {
                        "id": "1889-02",
                        "title": "2月",
                        "content": "他经历了反复的危机和住院治疗。"
                    },
                    {
                        "id": "1889-03",
                        "title": "3月和4月",
                        "content": "梵高住在阿尔勒的医院里，被分配了一个房间，在那里他继续工作。"
                    },
                    {
                        "id": "1889-03-23",
                        "title": "3月23日至24日",
                        "content": "画家保罗·西涅克拜访了梵高。"
                    },
                    {
                        "id": "1889-05-08",
                        "title": "5月8日",
                        "content": "梵高住进了圣雷米-德普罗旺斯的精神病院。"
                    },
                    {
                        "id": "1889-autumn",
                        "title": "秋季",
                        "content": "梵高恢复与他的朋友保罗·高更和埃米尔·伯纳德的通信。提奥将梵高的两幅作品送往巴黎独立沙龙展览。"
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
                        "content": "梵高在布鲁塞尔二十人画展的年度先锋派展览上展出了六幅画。"
                    },
                    {
                        "id": "1890-03",
                        "title": "3月/4月",
                        "content": "他在巴黎独立沙龙展出了十幅画。"
                    },
                    {
                        "id": "1890-05-16",
                        "title": "5月16日",
                        "content": "梵高离开圣雷米，在巴黎停留后，于5月20日抵达巴黎西北部的奥维尔-苏瓦兹。他立即投入工作，创作了大量的绘画、素描和版画。"
                    },
                    {
                        "id": "1890-07-27",
                        "title": "7月27日",
                        "content": "梵高用枪击中了自己的胸部，两天后死于枪伤。"
                    }
                ]
            }
        ],
    },
    "next": {
        "en-GB": "Next",
        "zh-TW": "下一個",
        "zh-CN": "下一个"
    },
    "playAudio": {
        "en-GB": "Play Audio",
        "zh-TW": "播放",
        "zh-CN": "播放"
    },
    "end": {
        "en-GB": "End",
        "zh-TW": "結語",
        "zh-CN": "结语"
    },
    "room": {
        "en-GB": "Room",
        "zh-TW": "展間",
        "zh-CN": "展厅"
    },
    "language": {
        "en-GB": "Language",
        "zh-TW": "語言",
        "zh-CN": "语言"
    },
    "exhibitionPlan": {
        "en-GB": "Map",
        "zh-TW": "地圖",
        "zh-CN": "地图"
    },
    "chronology": {
        "en-GB": "Timeline",
        "zh-TW": "時間軸",
        "zh-CN": "时间轴"
    },
    "chronologyTitle": {
        "en-GB": "Chronology",
        "zh-TW": "生平",
        "zh-CN": "生平"
    },
    "yearsOld": {
        "en-GB": "years old",
        "zh-TW": "歲",
        "zh-CN": "岁"
    },
    "chronologyFooter": {
        "en-GB": "For more information about Van Gogh's life, as well as all his letters, visit vangoghletters.org. All letter quotes in the exhibition are taken from this source.",
        "zh-TW": "更多有關梵谷生平及所有書信的資訊，請參考 vangoghletters.org. 展覽中所有書信引文均來自此來源。",
        "zh-CN": "更多关于梵高生平及所有书信的信息，请参考 vangoghletters.org. 展览中所有书信引文均来自此来源。"
    },
    "exhibitionPlanTitle": {
        "en-GB": "Exhibition plan",
        "zh-TW": "展覽平面圖",
        "zh-CN": "展览平面图"
    },
    "exit": {
        "en-GB": "Exit",
        "zh-TW": "出口",
        "zh-CN": "出口"
    },
    "shop": {
        "en-GB": "Shop",
        "zh-TW": "商店",
        "zh-CN": "商店"
    },
    "entrance": {
        "en-GB": "Entrance",
        "zh-TW": "入口",
        "zh-CN": "入口"
    },
    "exhibitionRoom1": {
        "en-GB": "Introduction",
        "zh-TW": "介紹",
        "zh-CN": "介绍"
    },
    "exhibitionRoom2": {
        "en-GB": "The Garden:\nPoetic Interpretations",
        "zh-TW": "花園：\n詩意的詮釋",
        "zh-CN": "花园：\n诗意的诠释"
    },
    "exhibitionRoom3": {
        "en-GB": "The Yellow House:\nAn Artist's Home",
        "zh-TW": "黃色小屋：\n藝術家之家",
        "zh-CN": "黄色小屋：\n艺术家之家"
    },
    "exhibitionRoom4": {
        "en-GB": "Montmajour: A Series",
        "zh-TW": "蒙馬茹：系列",
        "zh-CN": "蒙马茹：系列"
    },
    "exhibitionRoom5": {
        "en-GB": "Decoration",
        "zh-TW": "裝飾",
        "zh-CN": "装饰"
    },
    "exhibitionRoom6": {
        "en-GB": "Variations on a Theme",
        "zh-TW": "主題變奏",
        "zh-CN": "主题变奏"
    },
    "offlineMode": {
        "en-GB": "You are currently offline",
        "zh-TW": "您目前處於離線狀態",
        "zh-CN": "您当前处于离线状态"
    },
    "offlineAudioError": {
        "en-GB": "Audio is not available offline",
        "zh-TW": "離線狀態下無法播放音訊",
        "zh-CN": "离线状态下无法播放音频"
    },
    "pwaMode": {
        "en-GB": "Gallery Mode Active",
        "zh-TW": "展覽模式已啟用",
        "zh-CN": "展馆模式已启用"
    },
    "pwaAudioError": {
        "en-GB": "Audio guide not available. Please ensure content is downloaded.",
        "zh-TW": "音頻導覽不可用。請確保內容已下載。",
        "zh-CN": "音频导览不可用。请确保内容已下载。"
    },
    "imageLoadError": {
        "en-GB": "Image not available. Please ensure content is downloaded.",
        "zh-TW": "圖片不可用。請確保內容已下載。",
        "zh-CN": "图片不可用。请确保内容已下载。"
    },
    "languageName": {
        "en-GB": "English",
        "zh-TW": "繁體中文",
        "zh-CN": "简体中文"
    },
    "startDownload": {
        "en-GB": "Download Content",
        "zh-TW": "下載內容",
        "zh-CN": "下载内容"
    },
    "downloading": {
        "en-GB": "Downloading...",
        "zh-TW": "下載中...",
        "zh-CN": "下载中..."
    },
    "filesDownloaded": {
        "en-GB": "files downloaded",
        "zh-TW": "個檔案已下載",
        "zh-CN": "个文件已下载"
    },
    "downloadDescription": {
        "en-GB": "Download content for offline viewing. This includes all audio guides and high-resolution images.",
        "zh-TW": "下載內容以供離線瀏覽。包括所有語音導覽和高解析度圖片。",
        "zh-CN": "下载内容以供离线浏览。包括所有语音导览和高分辨率图片。"
    },
    "offlineImageUnavailable": {
        "en-GB": "Image unavailable offline",
        "zh-TW": "離線狀態下無法顯示圖片",
        "zh-CN": "离线状态下无法显示图片"
    },
    "offlineUncachedImage": {
        "en-GB": "This image has not been cached for offline viewing",
        "zh-TW": "此圖片尚未被快取以供離線瀏覽",
        "zh-CN": "此图片尚未被缓存以供离线浏览"
    },
    "offlineCachedImage": {
        "en-GB": "Image cached for offline viewing",
        "zh-TW": "圖片已快取以供離線瀏覽",
        "zh-CN": "图片已缓存以供离线浏览"
    },
    "getRandomNumber": {
        "en-GB": "Get Random Number",
        "zh-TW": "取得隨機數字",
        "zh-CN": "获取随机数字"
    },
    "randomNumber": {
        "en-GB": "Random Number",
        "zh-TW": "隨機數字",
        "zh-CN": "随机数字"
    }
    // Add more translations here
};
// Add a new type for chronology data
export const chronologyData: Record<Locale, ChronologyEntry[]> = {
    "en-GB": translations.chronologyData["en-GB"] as ChronologyEntry[],
    "zh-TW": translations.chronologyData["zh-TW"] as ChronologyEntry[],
    "zh-CN": translations.chronologyData["zh-CN"] as ChronologyEntry[] // You'll need to add this data
};

interface ChronologyEntry {
    id: string;
    title: string;
    content: string | {
        id: string;
        title: string;
        content: string;
    }[];
}