export default function Component() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-3xl space-y-8 text-black">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="font-serif text-6xl font-bold tracking-tight sm:text-7xl">Smith&apos;s</h1>
            <p className="font-serif text-lg uppercase tracking-widest sm:text-xl">擅長頂級海鮮料理</p>
          </div>
  
          {/* Set Menu Section */}
          <div className="border border-black p-6 sm:p-8 mb-8">
            <h2 className="text-center font-serif text-2xl uppercase tracking-widest sm:text-3xl mb-6">
              精選套餐 <br />
              <span className="text-lg sm:text-xl">SET MENU</span>
            </h2>
  
            {/* Lunch and Dinner Section */}
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16 mb-8">
              <div className="text-center">
                <h3 className="font-serif text-xl uppercase tracking-widest sm:text-2xl">
                  午餐 <br />
                  <span className="text-lg sm:text-xl">LUNCH</span>
                </h3>
                <p className="font-sans text-base sm:text-lg">週一至週五 Mon–Fri</p>
                <p className="font-sans text-base sm:text-lg">二道式 2 Courses £37</p>
                <p className="font-sans text-base sm:text-lg">三道式 3 Courses £42</p>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl uppercase tracking-widest sm:text-2xl">
                  晚餐 <br />
                  <span className="text-lg sm:text-xl">DINNER</span>
                </h3>
                <p className="font-sans text-base sm:text-lg">週一至週四 Mon–Thu</p>
                <p className="font-sans text-base sm:text-lg">二道式 2 Courses £42</p>
                <p className="font-sans text-base sm:text-lg">三道式 3 Courses £47</p>
              </div>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Starters Section */}
            <div className="space-y-4">
              <h2 className="text-center font-serif text-2xl uppercase tracking-widest sm:text-3xl mb-6">
                前菜 <br />
                <span className="text-lg sm:text-xl">Starters</span>
              </h2>
              <ul className="space-y-4 font-sans">
                <li>
                  <div className="text-base sm:text-lg">夏季青豌豆與花園香草湯佐法式鮮奶油</div>
                  <p className="text-sm text-gray-600">Summer Pea & Garden Herb Soup with Crème Fraiche</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">大西洋鮮蝦雞尾酒佐瑪莉玫瑰醬汁 (含麩質 G)</div>
                  <p className="text-sm text-gray-600">Atlantic Prawn Cocktail with Marie Rose Dressing (G)</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">日式麵包酥炸康瓦爾魚條佐煙燻墨西哥辣椒美乃滋 (含麩質 G)</div>
                  <p className="text-sm text-gray-600">Panko Cornish Fish Goujons with Smoked Chipotle Mayonnaise (G)</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">嫩菠菜紅藜麥酪梨沙拉佐烤奶油南瓜及醃漬朝鮮薊</div>
                  <p className="text-sm text-gray-600">
                    Baby Spinach, Red Quinoa & Avocado Salad with Roasted Butternut Squash and Marinated Artichokes
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">設得蘭青口貝佐檸檬草、檸檬葉、紅辣椒椰奶湯汁</div>
                  <p className="text-sm text-gray-600">
                    Shetland Mussels Cooked in Lemon Grass, Lime Leaf, Red Chilli & Coconut Broth
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">炙烤康瓦爾鯖魚菲力佐茴香、紅洋蔥、夏季蘿蔔與鮮橙沙拉</div>
                  <p className="text-sm text-gray-600">
                    Grilled Cornish Mackerel Fillet with Fennel, Red Onion, Summer Radish & Orange Salad
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">
                    虎蝦天婦羅佐亞洲風味沙拉，醬油、蜜桃梅子及蜂蜜醬汁 (含麩質 G)
                  </div>
                  <p className="text-sm text-gray-600">
                    Tiger Prawn Tempura, Asian Salad, Soy, Plum & Honey Dressing (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">
                    輕烤牛菲力義式生牛肉片佐帕瑪森乳酪、嫩葉沙拉、酸豆、紅洋蔥、小黃瓜與松露油 (含麩質 G)
                  </div>
                  <p className="text-sm text-gray-600">
                    Seared Beef Fillet Carpaccio, Parmesan Shavings, Baby Leaf, Capers, Red Onions, Gherkin & Truffle Oil
                    (G)
                  </p>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Main Course Section */}
            <div className="space-y-4">
              <h2 className="text-center font-serif text-2xl uppercase tracking-widest sm:text-3xl mb-6">
                主菜 <br />
                <span className="text-lg sm:text-xl">Main Courses</span>
              </h2>
              <ul className="space-y-4 font-sans">
                <li>
                  <div className="text-base sm:text-lg">Smith招牌酥炸大西洋鱈魚菲力 (含麩質G、堅果N)</div>
                  <p className="text-sm text-gray-600">Smith’s Battered Atlantic Cod Fillet (G, N)</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">香煎康瓦爾比目魚菲力佐清炒海蘆筍及檸檬奶油醬 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Pan Fried Cornish Plaice Fillet with Sautéed Samphire & Lemon Butter Sauce (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">炭烤根西島鰩魚佐煙燻西班牙辣味香腸及墨西哥辣椒奶油醬</div>
                  <p className="text-sm text-gray-600">Grilled Guernsey Skate, Smoked Chorizo & Chipotle Butter</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">
                    香烤康瓦爾海鱸魚菲力佐薑絲、辣椒、蔥絲及柑橘山葵醬汁 (含麩質G)
                  </div>
                  <p className="text-sm text-gray-600">
                    Grilled Cornish Sea Bass Fillets, Ginger, Chilli, Spring Onion, Citrus & Wasabi Dressing (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">炭烤卡津風味鮭魚菲力佐墨西哥辣椒、紅椒及櫻桃番茄莎莎醬</div>
                  <p className="text-sm text-gray-600">
                    Grilled Cajun Spiced Salmon Fillet, Fiery Jalapeño, Red Pepper & Cherry Tomato Salsa
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">酥皮焗黑線鱈魚與虎蝦，搭菠菜及白酒奶油醬 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Open Haddock & Tiger Prawn En Croute, Spinach, Cream & White Wine Sauce (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">碳烤小牛T骨排佐野生蘑菇醬與英式豆瓣菜</div>
                  <p className="text-sm text-gray-600">
                    Chargrilled Veal T Bone, Wild Mushroom Sauce & English Watercress
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">炭烤嫩牛肝佐煙燻培根、鼠尾草洋蔥豬肉餡與紅酒醬汁 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Grilled Calves Liver, Smoked Bacon, Sage & Onion Pork Stuffing, Red Wine Jus (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">炭烤蘇格蘭頂級西冷牛排10oz佐胡椒奶油醬 (£4 附加費)(含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Chargrilled Prime 10oz Scottish Sirloin Steak & Peppercorn Sauce (£4 supplement) (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">花椰菜天婦羅佐咖哩風味小扁豆與青醬 (含麩質G)</div>
                  <p className="text-sm text-gray-600">Tempura Cauliflower Florets, Curried Lentils & Salsa Verde (G)</p>
                </li>
              </ul>
              <p className="font-sans text-base sm:text-lg mt-6">
                (以上主菜均可搭配：Smith炸薯條、香草奶油嫩馬鈴薯、當季蔬菜、清蒸白飯或綜合沙拉)
              </p>
              <p className="font-sans text-sm text-gray-600">
                (Main courses served with Smith’s Chips, Baby Buttered Herb Potatoes, Seasonal Vegetables, Steamed Rice or
                Mixed Salad)
              </p>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Dessert Section */}
            <div className="space-y-4">
              <h2 className="text-center font-serif text-2xl uppercase tracking-widest sm:text-3xl mb-6">
                甜點 <br />
                <span className="text-lg sm:text-xl">Desserts</span>
              </h2>
              <ul className="space-y-4 font-sans">
                <li>
                  <div className="text-base sm:text-lg">Roules農場英式草莓佐香緹奶油與奶油酥餅 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Roules Farm English Strawberries, Chantilly Cream, Shortbread Biscuit (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">
                    熔岩巧克力蛋糕佐香草冰淇淋、焦糖開心果及巧克力醬 (含麩質G、堅果N)
                  </div>
                  <p className="text-sm text-gray-600">
                    Melting Chocolate Cake, Vanilla Ice Cream, Caramelised Pistachios, Chocolate Sauce (G,N)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">蒸椰子與覆盆子果醬布丁佐香草卡士達醬 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    Steamed Coconut & Raspberry Jam Sponge Pudding, Vanilla Custard (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">約克郡新季粉紅大黃與薑味奶酥焗布丁佐香草卡士達醬 (含麩質G)</div>
                  <p className="text-sm text-gray-600">
                    New Season Yorkshire Pink Rhubarb & Ginger Crumble, Vanilla Custard (G)
                  </p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">卡魯瓦咖啡摩卡法式焦糖布蕾佐奶油酥餅 (含麩質G)</div>
                  <p className="text-sm text-gray-600">Kahlua Mocha Crème Brûlée & Shortbread Biscuit (G)</p>
                </li>
                <li>
                  <div className="text-base sm:text-lg">起司拼盤搭葡萄、酸甜果醬、西洋芹及餅乾 (含麩質G、堅果N)</div>
                  <p className="text-sm text-gray-600">Cheese Selection, Grapes, Chutney, Celery & Biscuits (G,N)</p>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Separator */}
          <div className="my-8 h-px bg-black" />
  
          {/* À La Carte Highlights Section */}
          <div className="border border-black p-6 sm:p-8 mb-8">
            <h2 className="text-center font-serif text-2xl uppercase tracking-widest sm:text-3xl mb-6">
              單點餐點 <br />
              <span className="text-lg sm:text-xl">À La Carte Highlights</span>
            </h2>
  
            {/* Pre-starters */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                餐前小食 <br />
                <span className="text-lg sm:text-xl">Pre-starters</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">威爾斯大蛤佐麥芽醋</div>
                    <p className="text-sm text-gray-600">Large Welsh Cockles with Malt Vinegar</p>
                  </div>
                  <span className="text-base sm:text-lg">6.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾鱈魚可樂餅佐甜辣椒醬 (G)</div>
                    <p className="text-sm text-gray-600">Cornish Cod Croquettes, Sweet Chilli Sauce (G)</p>
                  </div>
                  <span className="text-base sm:text-lg">6.5</span>
                </li>
              </ul>
            </div>
  
            {/* Today's Specials */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                今日推薦 <br />
                <span className="text-lg sm:text-xl">Today’s Specials</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾焗檸檬鰈魚菲力菠菜蝦餡佐檸檬奶油醬 (G)</div>
                    <p className="text-sm text-gray-600">
                      Baked Cornish Lemon Sole, Spinach & Prawns, Lemon Butter Sauce (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">38</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">整隻本地奶油龍蝦700g佐蒜香香草奶油</div>
                    <p className="text-sm text-gray-600">Whole Native Lobster 700g, Garlic & Herbs Butter</p>
                  </div>
                  <span className="text-base sm:text-lg">58</span>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Cold Selection */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                冷盤精選 <br />
                <span className="text-lg sm:text-xl">Cold Selection</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      Carlingford岩生蠔六顆佐紅酒紅蔥醋汁（食用生蠔可能增加食源性疾病風險，尤其搭配酒精或特定健康狀況）
                    </div>
                    <p className="text-sm text-gray-600">
                      Carlingford Rock Oysters x6, Red Wine Shallot Vinaigrette (Consuming raw oysters may increase your
                      risk of foodborne illness, especially with alcohol or certain medical conditions)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">22</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">Smith經典鮮蝦雞尾酒 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">Smith Classic Prawn Cocktail (G)</p>
                  </div>
                  <span className="text-base sm:text-lg">13</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      黑胡椒嫩牛菲力義式生牛肉片，搭帕瑪森乳酪、嫩葉沙拉、冬季黑松露油、小酸黃瓜、紅洋蔥與酸豆 (含麩質 G)
                    </div>
                    <p className="text-sm text-gray-600">
                      Black Pepper Beef Fillet Carpaccio, Parmesan, Baby Leaf, Winter Black Truffle Oil, Gherkins, Red
                      Onions & Capers (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">18</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      煙燻醃漬魚拼盤佐辣根奶油（橡木煙燻鯖魚、醃漬鯡魚捲、蘇格蘭煙燻鮭魚、甜味醃漬鯡魚）
                    </div>
                    <p className="text-sm text-gray-600">
                      Smoked & Cured Fish Platter, Horseradish Cream (Oak Smoked Mackerel, Rollmop Herring, Scottish
                      Smoked Salmon, Sweet Cured Herring)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">16</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾整隻去殼螃蟹佐紅蔥醋汁及法式鮮奶油 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">
                      Whole Cornish Dressed Crab, Shallot Vinaigrette & Crème Fraiche (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">19.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      頂級黃鰭鮪魚與Loch Duart鮭魚刺身，搭醃薑、蘿蔔絲、芝麻海藻沙拉、醬油與山葵
                    </div>
                    <p className="text-sm text-gray-600">
                      Premium Yellowfin Tuna & Loch Duart Salmon Sashimi, Pickled Ginger, Daikon, Sesame Seaweed Salad,
                      Soy & Wasabi
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">22.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾蟹肉、鮮蝦與酪梨塔 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">Cornish Crab, Prawn & Avocado Tart (G)</p>
                  </div>
                  <span className="text-base sm:text-lg">17.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">甜醃北極鯡魚菲力佐細香蔥馬鈴薯沙拉與英式豆瓣菜</div>
                    <p className="text-sm text-gray-600">
                      Sweet Cured Arctic Herring Fillets, Chive Potato Salad & English Watercress
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">13.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">John Ross橡木煙燻鮭魚佐醃小黃瓜、紅洋蔥、小酸豆與柑橘醬汁</div>
                    <p className="text-sm text-gray-600">
                      John Ross Oak Smoked Salmon, Pickled Cucumber, Red Onion, Capers & Citrus Dressing
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">16.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">野生海鱸魚酸橘生魚片佐青檸汁、墨西哥辣椒、酥脆紅蔥與香菜油</div>
                    <p className="text-sm text-gray-600">
                      Wild Sea Bass Ceviche, Lime, Jalapeño, Crispy Shallots & Coriander Oil
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">17.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">黃鰭鮪魚Tataki佐酪梨泥、脆紅蔥、醬油與柚子醬汁 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">
                      Yellowfin Tuna Tataki, Avocado Purée, Crispy Shallots, Soy & Yuzu Dressing (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">19.5</span>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Hot Selection */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                熱盤精選 <br />
                <span className="text-lg sm:text-xl">Hot Selection</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">蘇格蘭巨型脆皮炸小龍蝦佐Smith塔塔醬 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">
                      Scottish Giant Crispy Fried Langoustines, Smith’s Tartare Sauce (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">18.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">Smith招牌魚貝濃湯佐青醬</div>
                    <p className="text-sm text-gray-600">Smith’s Signature Fish & Shellfish Soup, Pesto</p>
                  </div>
                  <span className="text-base sm:text-lg">12</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">香煎虎蝦佐蒜香番茄辣醬</div>
                    <p className="text-sm text-gray-600">Pan Fried Tiger Prawns, Garlic, Chilli & Tomato Sauce</p>
                  </div>
                  <span className="text-base sm:text-lg">17.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">新季英國蘆筍佐嫩煮蛋與荷蘭醬</div>
                    <p className="text-sm text-gray-600">New Season English Asparagus, Poached Egg & Hollandaise</p>
                  </div>
                  <span className="text-base sm:text-lg">15.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">設得蘭青口貝佐白葡萄酒、蒜香、紅蔥與鮮奶油</div>
                    <p className="text-sm text-gray-600">Shetland Mussels, White Wine, Garlic, Shallots & Cream</p>
                  </div>
                  <span className="text-base sm:text-lg">16.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾脆皮日式酥炸魷魚圈佐蒜香美乃滋 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">Crispy Fried Cornish Calamari Rings, Garlic Mayonnaise (G)</p>
                  </div>
                  <span className="text-base sm:text-lg">15.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">軟殼蟹與虎蝦天婦羅二重奏佐東方沙拉與梅子醬 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">
                      Soft Shell Crab & Tiger Prawn Tempura Duo, Oriental Salad & Plum Sauce (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">19.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      炭烤設得蘭干貝佐薑絲、辣椒、蔥絲、醬油與山葵醬汁 (含麩質 G)
                    </div>
                    <p className="text-sm text-gray-600">
                      Chargrilled Shetland Scallops, Ginger, Chilli, Spring Onion, Soy & Wasabi Dressing (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">20.5</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">味噌醬汁烤黑鱈魚搭甜菜根、海蘆筍、柚子、芝麻與紅辣椒醬汁</div>
                    <p className="text-sm text-gray-600">
                      Miso Glazed Black Cod, Beetroot, Samphire, Yuzu, Sesame & Red Chilli Dressing
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">22</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      溫熱山羊起司球佐英國甜菜根、青蘋果、塊根芹、麥蘆卡蜂蜜與香醋醬汁 (含麩質 G)
                    </div>
                    <p className="text-sm text-gray-600">
                      Warm Goats Cheese Bon Bons, English Beetroot, Green Apple, Celeriac, Manuka Honey & Balsamic
                      Dressing (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">13.5</span>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Main Course Selection */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                主菜精選 <br />
                <span className="text-lg sm:text-xl">Main Course Selection</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      焗挪威大比目魚佐塔塔帕瑪森起司脆皮，夏布利白酒奶油醬 (含麩質 G)
                    </div>
                    <p className="text-sm text-gray-600">
                      Baked Norwegian Halibut, Tartare Parmesan Crust, Chablis Butter Sauce (G)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">45</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      康瓦爾鱈魚菲力Arnold Bennett風，煙燻黑線鱈魚與帕瑪森奶油焗烤
                    </div>
                    <p className="text-sm text-gray-600">
                      Cornish Cod Fillet Arnold Bennett, Smoked Haddock & Parmesan Cream Gratin
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">29</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">炭烤康瓦爾鮟鱇魚與虎蝦佐椰香咖哩瑪薩拉醬與印度香米飯</div>
                    <p className="text-sm text-gray-600">
                      Chargrilled Cornish Monkfish & Tiger Prawns, Coconut Curry Masala & Basmati Rice
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">42</span>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Premium Fish Dishes */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                頂級鮮魚料理 <br />
                <span className="text-lg sm:text-xl">Premium Fish Dishes</span>
              </h3>
              <p className="font-sans text-base sm:text-lg mb-2">以下鮮魚可自選料理方式：</p>
              <p className="font-sans text-sm text-gray-600 mb-4">The following fish can be cooked to your liking:</p>
              <p className="font-sans text-base sm:text-lg mb-6">
                原味碳烤、Meunière式奶油淺煎、佐海鮮奶油或焦化奶油酸豆、或酥炸 (含麩質、堅果，以花生油製作)
              </p>
              <p className="font-sans text-sm text-gray-600 mb-6">
                Plain Chargrilled, Meunière, with Seafood Butter or Burnt Butter & Capers, or Battered (G, N, cooked in
                peanut oil)
              </p>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">大西洋鱈魚菲力</div>
                    <p className="text-sm text-gray-600">Atlantic Cod Fillet</p>
                  </div>
                  <span className="text-base sm:text-lg">27</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾鮟鱇魚菲力</div>
                    <p className="text-sm text-gray-600">Cornish Monkfish Fillet</p>
                  </div>
                  <span className="text-base sm:text-lg">42</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">野生康瓦爾海鱸魚菲力</div>
                    <p className="text-sm text-gray-600">Wild Cornish Sea Bass Fillet</p>
                  </div>
                  <span className="text-base sm:text-lg">38</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">康瓦爾比目魚菲力</div>
                    <p className="text-sm text-gray-600">Cornish Plaice Fillet</p>
                  </div>
                  <span className="text-base sm:text-lg">25</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">根西島釣捕鰩魚</div>
                    <p className="text-sm text-gray-600">Guernsey Line Caught Skate</p>
                  </div>
                  <span className="text-base sm:text-lg">33</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">挪威大比目魚菲力</div>
                    <p className="text-sm text-gray-600">Norwegian Halibut Fillet</p>
                  </div>
                  <span className="text-base sm:text-lg">43</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">Brixham多佛鰈魚 (700g，帶骨或去骨)</div>
                    <p className="text-sm text-gray-600">Brixham Dover Sole (700g, on or off the bone)</p>
                  </div>
                  <span className="text-base sm:text-lg">58</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">炭烤蘇格蘭鮭魚菲力佐荷蘭醬</div>
                    <p className="text-sm text-gray-600">Chargrilled Scottish Salmon Fillet, Hollandaise</p>
                  </div>
                  <span className="text-base sm:text-lg">30</span>
                </li>
              </ul>
            </div>
  
            {/* Separator */}
            <div className="my-8 h-px bg-black" />
  
            {/* Premium Lobster, Crustaceans & Shellfish */}
            <div className="space-y-4 mb-8">
              <h3 className="text-center font-serif text-xl uppercase tracking-widest sm:text-2xl mb-4">
                頂級龍蝦、甲殼類與貝類料理 <br />
                <span className="text-lg sm:text-xl">Premium Lobster, Crustaceans & Shellfish</span>
              </h3>
              <ul className="space-y-4 font-sans">
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">整隻本地奶油龍蝦 (700g) 佐蒜香香草奶油</div>
                    <p className="text-sm text-gray-600">Whole Native Lobster (700g), Garlic & Herbs Butter</p>
                  </div>
                  <span className="text-base sm:text-lg">58</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">巨型虎蝦佐番茄、辣椒、大蒜與白酒醬汁</div>
                    <p className="text-sm text-gray-600">Giant Tiger Prawns, Tomato, Chilli, Garlic & White Wine Sauce</p>
                  </div>
                  <span className="text-base sm:text-lg">46</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">
                      烤綜合貝類拼盤（半隻龍蝦、虎蝦、蘇格蘭干貝、烤番茄與蒜香奶油）
                    </div>
                    <p className="text-sm text-gray-600">
                      Roasted Mixed Shellfish Platter (Half Lobster, Tiger Prawns, Scottish Scallops, Roasted Tomatoes &
                      Garlic Butter)
                    </p>
                  </div>
                  <span className="text-base sm:text-lg">58</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">整隻本地龍蝦焗起司醬 (Thermidor) (700g，含麩質 G)</div>
                    <p className="text-sm text-gray-600">Whole Native Lobster Thermidor (700g, G)</p>
                  </div>
                  <span className="text-base sm:text-lg">58</span>
                </li>
                <li className="flex justify-between items-baseline">
                  <div>
                    <div className="text-base sm:text-lg">設得蘭干貝Meunière奶油煎 (含麩質 G)</div>
                    <p className="text-sm text-gray-600">Shetland Scallops Meunière (G)</p>
                  </div>
                  <span className="text-base sm:text-lg">42</span>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Footer Notes */}
          <div className="mt-8 space-y-2 text-center text-sm font-sans sm:text-base">
            <p>
              ⚠ 如有特殊飲食需求或過敏請告知服務人員。 <br />
              <span className="text-xs text-gray-600">
                ⚠ For our guests with dietary requirements or food allergies please ask your server who will advise of the
                ingredients used within this menu.
              </span>
            </p>
            <p>
              ⚠ 以上價格含稅，加收12.5%服務費。 <br />
              <span className="text-xs text-gray-600">
                ⚠ All prices include VAT at the current rate. An optional 12.5% service charge will be added to your bill.
              </span>
            </p>
            <p>
              (G) 含麩質 | <span className="text-xs text-gray-600">Gluten</span>
            </p>
            <p>
              (N) 含堅果 | <span className="text-xs text-gray-600">Nuts</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
  