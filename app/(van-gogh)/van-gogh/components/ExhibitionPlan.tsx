import React from 'react'

interface SVGMapProps {
  lang: 'en-GB' | 'zh-TW'
}

export function ExhibitionPlan({ lang = 'en-GB' }: SVGMapProps) {
  const texts = {
    'en-GB': {
      title: 'Exhibition plan',
      exit: 'Exit',
      shop: 'Shop',
      entrance: 'Entrance',
      rooms: {
        1: 'Introduction',
        2: 'The Garden:\nPoetic Interpretations',
        3: 'The Yellow House:\nAn Artist\'s Home',
        4: 'Montmajour: A Series',
        5: 'Decoration',
        6: 'Variations on a Theme'
      }
    },
    'zh-TW': {
      title: '展覽平面圖',
      exit: '出口',
      shop: '商店', 
      entrance: '入口',
      rooms: {
        1: '介紹',
        2: '花園：\n詩意的詮釋',
        3: '黃房子：\n藝術家之家',
        4: '蒙馬茹：系列',
        5: '裝飾',
        6: '主題變奏'
      }
    }
  }

  const currentText = texts[lang]
//   console.log(lang,currentText)

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      {/* SVG Map */}
      <div className="mb-12">
        <svg viewBox="0 0 516 255" className="w-full h-auto">
          <defs>
            <style>
              {`
              .map-wall { fill: none; stroke: hsl(var(--foreground)); stroke-width: 2; }
              .map-text { font-family: ui-sans-serif, system-ui, sans-serif; fill: hsl(var(--secondary)); }
              .map-number { font-size: 32px; font-weight: 300; }
              .map-label { font-size: 16px; }
              .map-arrow { fill: none; stroke: hsl(var(--secondary)); stroke-width: 2; }
              `}
            </style>
          </defs>

          {/* Room outlines */}
          <g className="map-wall">
            <polyline points="424.5 208.5 424.5 253.5 514.5 253.5 514.5 181.5 487.5 181.5" />
            <polyline points="64.5 109.5 64.5 82.5 1.5 82.5 1.5 190.5 145.5 190.5 145.5 172.5 172.5 172.5 172.5 226.5 424.5 226.5" />
            <polyline points="424.5 181.5 469.5 181.5 424.5 181.5" />
            <polyline points="424.5 190.5 424.5 100.5 316.5 100.5" />
            <polyline points="289.5 100.5 172.5 100.5 172.5 154.5 145.5 154.5 145.5 82.5 82.5 82.5" />
            <polyline points="262.5 154.5 262.5 1.5 343.5 1.5 343.5 154.5" />
            <line x1="262.5" y1="172.5" x2="262.5" y2="226.5" />
            <line x1="343.5" y1="172.5" x2="343.5" y2="226.5" />
            <line x1="64.5" y1="136.5" x2="145.5" y2="136.5" />
            <line x1="82.5" y1="100.5" x2="82.5" y2="136.5" />
            <line x1="64.5" y1="154.5" x2="64.5" y2="172.5" />
            <line x1="289.5" y1="19.5" x2="316.5" y2="19.5" />
          </g>

          {/* Room numbers */}
          <g className="map-text map-number">
            <text x="469.5" y="225.2" textAnchor="middle">1</text>
            <text x="384" y="171.2" textAnchor="middle">2</text>
            <text x="303" y="171.2" textAnchor="middle">3</text>
            <text x="303" y="58.7" textAnchor="middle">4</text>
            <text x="217.5" y="171.2" textAnchor="middle">5</text>
            <text x="105" y="172.5" textAnchor="middle">6</text>
          </g>

          {/* Labels and Arrows */}
          <g className="map-text map-label">
            <text x="73.5" y="46.5" textAnchor="middle">{currentText.exit}</text>
            <text x="114" y="111.95" textAnchor="middle">{currentText.shop}</text>
            <text x="478.5" y="136.5" textAnchor="middle">{currentText.entrance}</text>
          </g>

          {/* Arrows */}
          <g className="map-arrow">
            <polyline points="82.5 64.5 73.5 55.5 73.5 82.5 73.5 55.5 64.5 64.5" />
            <polyline points="469.5 163.5 478.5 172.5 478.5 145.5 478.5 172.5 487.5 163.5" />
          </g>
        </svg>
      </div>

      {/* Room Legend */}
      <div className="grid gap-4 max-w-2xl mx-auto">
        {Object.entries(currentText.rooms).map(([number, description]) => (
          <div key={number} className="grid grid-cols-[4em,1fr] gap-4">
            <div className="text-secondary font-light">Room {number}</div>
            <div className="text-foreground whitespace-pre-line">{description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}