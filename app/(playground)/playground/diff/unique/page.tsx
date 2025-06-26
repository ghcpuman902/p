import combined from "../combined.json";
import combinedAI from "../combined-ai.json";

const categoryMapping = {
    'acid': 'Acid',
    'cannes cinéma': 'Cannes Cinéma',
    'cannes classics - documentaries about cinema': 'Cannes Classics - Documentaries About Cinema',
    'cannes classics - restored prints': 'Cannes Classics - Restored Prints',
    'cannes classics - world cinéma project': 'Cannes Classics - World Cinéma Project',
    'cannes premiere': 'Cannes Premiere',
    'cinéma de la plage': 'Cinéma De La Plage',
    'cinéma de la plage - restored prints': 'Cinéma De La Plage - Restored Prints',
    'directors\' fortnight': 'Directors\' Fortnight',
    'in competition - feature films': 'In Competition - Feature Films',
    'out of competition': 'Out of Competition',
    'out of competition - midnight screenings': 'Out of Competition - Midnight Screenings',
    'semaine de la critique': 'Semaine de la Critique',
    'special screenings': 'Special Screenings',
    'un certain regard': 'Un Certain Regard',
    'undefined or empty': ''
};

const locationMapping = {
    'agnes varda theatre': 'Agnès Varda Theatre',
    'alexandre iii': 'Alexandre III',
    'arcades 1': 'Arcades 1',
    'arcades 2': 'Arcades 2',
    'bazin theatre': 'Bazin Theatre',
    'buñuel theatre': 'Buñuel Theatre',
    'cineum aurore': 'Cineum Aurore',
    'cineum imax': 'Cineum Imax',
    'cineum salle 3': 'Cineum Salle 3',
    'cineum screen x': 'Cineum Screen X',
    'debussy theatre': 'Debussy Theatre',
    'grand théâtre lumière': 'Grand Théâtre Lumière',
    'licorne': 'Licorne',
    'miramar': 'Miramar',
    'olympia 2': 'Olympia 2',
    'olympia 8': 'Olympia 8',
    'palais k': 'Palais K',
    'plage macé': 'Plage Macé',
    'presse conference room': 'Presse Conference Room',
    'raimu': 'Raimu',
    'studio 13': 'Studio 13',
    'théâtre croisette': 'Théâtre Croisette',
    'undefined or empty': ''
};

const directorMapping = {
    "ALAIN GUIRAUDIE": "Alain Guiraudie",
    "ALI ABBASI": "Ali Abbasi",
    "ANTHONY SCHATTEMAN": "Anthony Schatteman",
    "ANTOINE CHEVROLLIER": "Antoine Chevrollier",
    "ARIANE LABED": "Ariane Labed",
    "ARNAUD DESPLECHIN": "Arnaud Desplechin",
    "ARNAUD LARRIEU, JEAN-MARIE LARRIEU": "Arnaud Larrieu, Jean-Marie Larrieu",
    "BENOIT SABATIER, MARCIA ROMANO": "Benoit Sabatier, Marcia Romano",
    "BORIS LOJKINE": "Boris Lojkine",
    "CARLOS DIEGUES": "Carlos Diegues",
    "CAROLINE POGGI, JONATHAN VINEL": "Caroline Poggi, Jonathan Vinel",
    "CARSON LUND": "Carson Lund",
    "CHANTAL AKERMAN": "Chantal Akerman",
    "CHRISTOPHE HONORÉ": "Christophe Honoré",
    "CLAIRE SIMON": "Claire Simon",
    "CONSTANCE TSANG": "Constance Tsang",
    "CORALIE FARGEAT": "Coralie Fargeat",
    "CYRIL ARIS": "Cyril Aris",
    "CÉLINE SALLETTE": "Céline Sallette",
    "DANIEL AUTEUIL": "Daniel Auteuil",
    "DAVID CRONENBERG": "David Cronenberg",
    "EMMA BENESTAN": "Emma Benestan",
    "EMMANUEL BARNAULT": "Emmanuel Barnault",
    "EMMANUEL COURCOL": "Emmanuel Courcol",
    "ERYK ROCHA, GABRIELA CARNEIRO DA CUNHA": "Eryk Rocha, Gabriela Carneiro da Cunha",
    "FABIAN BIELINSKY": "Fabian Bielinsky",
    "FLORENCE PLATARETS": "Florence Platarets",
    "GAËL MOREL": "Gaël Morel",
    "GILLES LELLOUCHE": "Gilles Lellouche",
    "GINTS ZILBALODIS": "Gints Zilbalodis",
    "HALA ELKOUSSY": "Hala Elkoussy",
    "HELENE MILANO": "Helene Milano",
    "HIROSHI OKUYAMA": "Hiroshi Okuyama",
    "INDIA DONALDSON": "India Donaldson",
    "JACKIE CHAN": "Jackie Chan",
    "JACQUES DE BARONCELLI": "Jacques de Baroncelli",
    "JACQUES DEMY": "Jacques Demy",
    "JAWAD RHALIB": "Jawad Rhalib",
    "JEAN-CHRISTOPHE MEURISSE": "Jean-Christophe Meurisse",
    "JEAN-FRANÇOIS LAGUIONIE": "Jean-François Laguionie",
    "JESSICA PALUD": "Jessica Palud",
    "JONÁS TRUEBA": "Jonás Trueba",
    "JUAN SEBASTIÁN QUEBRADA": "Juan Sebastián Quebrada",
    "JUB CLERC": "Jub Clerc",
    "JULIEN COLONNA": "Julien Colonna",
    "KAKU ARAKAWA": "Kaku Arakawa",
    "KARAN KANDHARI": "Karan Kandhari",
    "KARIM AÏNOUZ": "Karim Aïnouz",
    "KEVIN COSTNER": "Kevin Costner",
    "KIRILL SEREBRENNIKOV": "Kirill Serebrennikov",
    "LAETITIA DOSCH": "Laetitia Dosch",
    "LINO BROCKA": "Lino Brocka",
    "MAHDI FLEIFEL": "Mahdi Fleifel",
    "MARCELO CAETANO": "Marcelo Caetano",
    "MARCO BELLOCCHIO": "Marco Bellocchio",
    "MICHEL HAZANAVICIUS": "Michel Hazanavicius",
    "MICKAEL GAMRASNI": "Mickael Gamrasni",
    "MIGUEL GOMES": "Miguel Gomes",
    "MO HARAWE": "Mo Harawe",
    "MOHAMMAD RASOULOF": "Mohammad Rasoulof",
    "OLIVER STONE, ROB WILSON": "Oliver Stone, Rob Wilson",
    "OUSMANE SEMBENE, THIERNO FATY SOW": "Ousmane Sembene, Thierno Faty Sow",
    "PAOLO SORRENTINO": "Paolo Sorrentino",
    "PAWO CHOYNING DORJI": "Pawo Choyning Dorji",
    "PAYAL KAPADIA": "Payal Kapadia",
    "PETER HO-SUN CHAN": "Peter Ho-Sun Chan",
    "RACHID BOUCHAREB": "Rachid Bouchareb",
    "RAOUL PECK": "Raoul Peck",
    "ROBERT BRESSON": "Robert Bresson",
    "RYAN J. SLOAN": "Ryan J. Sloan",
    "RYOO SEUNG-WAN": "Ryoo Seung-Wan",
    "SANDHYA SURI": "Sandhya Suri",
    "SEAN BAKER": "Sean Baker",
    "SHUCHI TALATI": "Shuchi Talati",
    "STEVEN SPIELBERG": "Steven Spielberg",
    "TAKIS CANDILIS": "Takis Candilis",
    "TAWFIK ALZAIDI": "Tawfik Alzaidi",
    "TONY GATLIF": "Tony Gatlif",
    "TRUONG MINH QUÝ": "Truong Minh Quý",
    "UNA GUNJAK": "Una Gunjak",
    "VINCENT PARONNAUD, ALEXIS DUCORD": "Vincent Paronnaud, Alexis Ducord",
    "WEI LIANG CHIANG, YOU QIAO YIN": "Wei Liang Chiang, You Qiao Yin",
    "WIM WENDERS": "Wim Wenders",
    "YANNICK KERGOAT": "Yannick Kergoat",
    "YOKO KUNO, NOBUHIRO YAMASHITA": "Yoko Kuno, Nobuhiro Yamashita",
    "ÁNGELES CRUZ": "Ángeles Cruz"
};

const filmNameMapping = {
    "A SHORT NIGHT WITH GHIBLI": "A Short Night with Ghibli",
    "ALL WE IMAGINE AS LIGHT": "All We Imagine as Light",
    "AMAL": "Amal",
    "ANGELO, DANS LA FORÊT MYSTÉRIEUSE": "Angelo, dans la forêt mystérieuse",
    "ANIMALE": "Animale",
    "ANORA": "Anora",
    "APPRENDRE": "Apprendre",
    "ARMOUR OF GOD II: OPERATION CONDOR": "Armour of God II: Operation Condor",
    "BABY": "Baby",
    "BLUE SUN PALACE": "Blue Sun Palace",
    "BONA": "Bona",
    "BYE BYE BRASIL": "Bye Bye Brasil",
    "C. BLANCHETT, C. ERIVO & J.P. RASMUSSEN": "C. Blanchett, C. Erivo & J.P. Rasmussen",
    "CAMP DE THIAROYE": "Camp de Thiaroye",
    "CHÂTEAU ROUGE": "Château Rouge",
    "COURTS MÉTRAGES COMPETITION 1": "Courts Métrages Competition 1",
    "COURTS MÉTRAGES COMPETITION 2": "Courts Métrages Competition 2",
    "COURTS MÉTRAGES EN COMPÉTITION": "Courts Métrages en Compétition",
    "COURTS MÉTRAGES SÉANCE SPÉCIALE": "Courts Métrages Séance Spéciale",
    "CÉRÉMONIE DE CLÔTURE (CLOSING CEREMONY) UN CERTAIN REGARD": "Cérémonie de Clôture (Closing Ceremony) Un Certain Regard",
    "CÉRÉMONIE DE CLÔTURE 45MIN": "Cérémonie de clôture 45min",
    "CÉRÉMONIE DE CLÔTURE(CLOSING CEREMONY) PROJECTION PALME D'OR": "Cérémonie de clôture (Closing Ceremony) Projection Palme d'Or",
    "DANSER SUR UN VOLCAN": "Danser sur un volcan",
    "EAST OF NOON": "East of Noon",
    "EAT THE NIGHT": "Eat the Night",
    "EEPHUS": "Eephus",
    "EL OTRO HIJO": "El Otro Hijo",
    "EN FANFARE": "En fanfare",
    "EN FANFARE (THE MARCHING BAND)": "En fanfare (The Marching Band)",
    "ERNEST COLE, LOST AND FOUND (ERNEST COLE, PHOTOGRAPHE)": "Ernest Cole, Lost and Found (Ernest Cole, Photographe)",
    "EXCURSION": "Excursion",
    "EXILS": "Exils",
    "FLOW": "Flow",
    "FOTOGENICO": "Fotogenico",
    "GAZER": "Gazer",
    "GHOST CAT ANZU": "Ghost Cat Anzu",
    "GIRLS WILL BE GIRLS": "Girls Will Be Girls",
    "GOOD ONE": "Good One",
    "GRAND TOUR": "Grand Tour",
    "HAYAO MIYAZAKI AND THE HERON (HAYAO MIYAZAKI ET LE HERON)": "Hayao Miyazaki and the Heron (Hayao Miyazaki et le Heron)",
    "HISTOIRES D'AMÉRIQUE: FOOD, FAMILY AND PHILOSOPHY": "Histoires d'Amérique: Food, Family and Philosophy",
    "HOMMAGE PIERRE ANGÉNIEUX AU DIRECTEUR DE LA PHOTOGRAPHIE SAN...": "Hommage Pierre Angénieux au Directeur de la Photographie San...",
    "HORIZON: AN AMERICAN SAGA": "Horizon: An American Saga",
    "INDIGENES (DAYS OF GLORY)": "Indigenes (Days of Glory)",
    "INVITATION AU FESTIVAL INTERNATIONAL DU FILM DE MORELIA": "Invitation au Festival International du Film de Morelia",
    "JACQUES DEMY, LE ROSE ET LE NOIR": "Jacques Demy, le rose et le noir",
    "JACQUES ROZIER : D'UNE VAGUE A L'AUTRE (JACQUES ROZIER: FROM...": "Jacques Rozier : D'une vague à l'autre (Jacques Rozier: From...",
    "JULIE KEEPS QUIET": "Julie Keeps Quiet",
    "L'AMOUR OUF": "L'Amour Ouf (Beating Hearts)",
    "L'AMOUR OUF (BEATING HEARTS)": "L'Amour Ouf (Beating Hearts)",
    "L'ENFANT QUI MESURAIT LE MONDE": "L'Enfant qui mesurait le monde",
    "L'HISTOIRE DE SOULEYMANE": "L'Histoire de Souleymane",
    "LA PAMPA": "La Pampa",
    "LA PLUS PRÉCIEUSE DES MARCHANDISES": "The Most Precious of Cargoes (La Plus Précieuse Des Marchandises)",
    "LA PLUS PRÉCIEUSE DES MARCHANDISES (THE MOST PRECIOUS OF CAR...": "The Most Precious of Cargoes (La Plus Précieuse Des Marchandises)",
    "LA ROSE DE LA MER (THE ROSE OF THE SEA)": "La Rose de la Mer (The Rose of the Sea)",
    "LE COMTE DE MONTE-CRISTO": "Le Comte de Monte-Cristo",
    "LE FIL": "Le Fil",
    "LE MOINE ET LE FUSIL": "Le Moine et le Fusil",
    "LE PROCÈS DU CHIEN (DOG ON TRIAL)": "Le Procès du Chien (Dog on Trial)",
    "LE ROMAN DE JIM": "Le Roman de Jim",
    "LE ROYAUME": "Le Royaume",
    "LE SIÈCLE DE COSTA-GAVRAS / EPISODE 3 : LA VÉRITÉ EST RÉVOLU...": "Le Siècle de Costa-Gavras / Episode 3 : La Vérité est Révolu...",
    "LES FEMMES AU BLACON": "Les Femmes au Blacon",
    "LES PARAPLUIES DE CHERBOURG (THE UMBRELLAS OF CHERBOURG)": "Les Parapluies de Cherbourg (The Umbrellas of Cherbourg)",
    "LES PISTOLETS EN PLASTIQUE": "Les Pistolets en Plastique",
    "LEÇON DE MUSIQUE - SACEM - PHILIPPE ROMBI ET FRANÇOIS OZON": "Leçon de musique - Sacem - Philippe Rombi et François Ozon",
    "LIMONOV - THE BALLAD": "Limonov - The Ballad",
    "LULA": "Lula",
    "MARCELLO MIO": "Marcello Mio",
    "MARIA": "Being Maria",
    "MARIA (BEING MARIA)": "Being Maria",
    "MISÉRICORDE (MISERICORDIA)": "Miséricorde (Misericordia)",
    "MONGREL": "Mongrel",
    "MOTEL DESTINO": "Motel Destino",
    "MY SUNSHINE": "My Sunshine",
    "NASTY - MORE THAN JUST TENNIS": "Nasty - More Than Just Tennis",
    "NIKI": "Niki",
    "NORAH": "Norah",
    "NUEVE REINAS (LES NEUF REINES / NINE QUEENS)": "Nueve Reinas (Les Neuf Reines / Nine Queens)",
    "OLYMPIQUES ! LA FRANCE DES JEUX": "Olympiques ! La France des Jeux",
    "PALMARÈS LA CINEF": "Palmarès La Cinef",
    "PALME D'OR D'HONNEUR AU STUDIO GHIBLI": "Palme d'Or d'Honneur au Studio Ghibli",
    "PARIS, TEXAS": "Paris, Texas",
    "PARTHENOPE": "Parthenope",
    "PIGEN MED NÅLEN (THE GIRL WITH THE NEEDLE / LA JEUNE FEMME A...": "Pigen Med Nålen (The Girl With The Needle)",
    "PRIX DÉCOUVERTE LEITZ CINE DU COURT MÉTRAGE + GRAND PRIX": "Prix Découverte Leitz Cine du Court Métrage + Grand Prix",
    "PRIX FONDATION GAN À LA DIFFUSION": "Prix Fondation GAN à la Diffusion",
    "PRIX FONDATION LOUIS ROEDERER DE LA RÉVÉLATION": "Prix Fondation Louis Roederer de la Révélation",
    "PRIX FRENCH TOUCH DU JURY": "Prix French Touch du Jury",
    "PRIX SACD": "Prix SACD",
    "PRÉPARATION SACEM": "Préparation SACEM",
    "QUATRE NUITS D'UN RÊVEUR (FOUR NIGHTS OF A DREAMER)": "Quatre Nuits d'un Rêveur (Four Nights of a Dreamer)",
    "RENDEZ-VOUS AVEC/WITH GEORGE LUCAS": "Rendez-vous avec/with George Lucas",
    "RENDEZ-VOUS AVEC/WITH VALERIA GOLINO": "Rendez-vous avec/with Valeria Golino",
    "SANTOSH": "Santosh",
    "SBATTI IL MOSTRO IN PRIMA PAGINA (SLAP THE MONSTER ON PAGE O...": "Sbatti il Mostro in Prima Pagina (Slap the Monster on Page O...",
    "SEPTEMBER SAYS": "September Says",
    "SHE'S GOT NO NAME": "She's Got No Name",
    "SHORTS 1": "Shorts 1",
    "SHORTS 2": "Shorts 2",
    "SISTER MIDNIGHT": "Sister Midnight",
    "SLOCUM ET MOI": "Slocum et moi",
    "SPECTATEURS !": "Spectateurs !",
    "SWEET AS": "Sweet as",
    "SÉLECTION LA CINEF - PROGRAMME 1": "Sélection La Cinef - Programme 1",
    "SÉLECTION LA CINEF - PROGRAMME 2": "Sélection La Cinef - Programme 2",
    "SÉLECTION LA CINEF - PROGRAMME 3": "Sélection La Cinef - Programme 3",
    "SÉLECTION LA CINEF - PROGRAMME 4": "Sélection La Cinef - Programme 4",
    "TALENTS ADAMI CINEMA": "Talents Adami Cinéma",
    "TALENTS ADAMI CINÉMA": "Talents Adami Cinéma",
    "THE APPRENTICE": "The Apprentice",
    "THE FALLING SKY": "The Falling Sky",
    "THE OTHER WAY AROUND": "The Other Way Around",
    "THE SEED OF THE SACRED FIG (LES GRAINES DU FIGUIER SAUVAGE)": "The Seed of the Sacred Fig",
    "THE SEED OF THE SACRED FIG (VOSTEN)": "The Seed of the Sacred Fig (En Sub.)",
    "THE SEED OF THE SACRED FIG (VOSTFR)": "The Seed of the Sacred Fig (Fr Sub.)",
    "THE SHROUDS": "The Shrouds",
    "THE SHROUDS (LES LINCEULS)": "The Shrouds",
    "THE SUBSTANCE": "The Substance",
    "THE SUGARLAND EXPRESS": "The Sugarland Express",
    "THE VILLAGE NEXT OT PARADISE": "The Village Next to Paradise",
    "THE VILLAGE NEXT TO PARADISE": "The Village Next to Paradise",
    "TO A LAND UNKNOWN": "To a Land Unknown",
    "VALENTINA O LA SERENIDAD": "Valentina o la Serenidad",
    "VETERAN 2": "Veteran 2",
    "VIET AND NAM": "Viet and Nam",
    "VIVRE, MOURIR, RENAÎTRE (TO LIVE, TO DIE,TO LIVE AGAIN)": "Vivre, Mourir, Renaître (To Live, to Die, to Live Again)",
    "YOUNG HEARTS": "Young Hearts"
}

interface EventItem {
    category?: string;
    location?: string;
    director?: string;
    filmTitle?: string;
    [key: string]: unknown;
}

const standardizeValueKeyLowercase = (value: string, mapping: Record<string, string>): string => {
    const lowercaseValue = value.toLowerCase();
    return mapping[lowercaseValue] || value;
};

const standardizeValueKeyUppercase = (value: string, mapping: Record<string, string>): string => {
    const uppercaseValue = value.toUpperCase();
    return mapping[uppercaseValue] || value;
};

const UniquePage = () => {
    // Extract unique values using Set
    const uniqueCategories = [...new Set(Object.values(combined)
        .flat()
        .map(item => item.category))]
        .filter(Boolean)
        .sort();

    const uniqueLocations = [...new Set(Object.values(combined)
        .flat()
        .map(item => item.location))]
        .filter(Boolean)
        .sort();

    const uniqueDirectors = [...new Set(Object.values(combined)
        .flat()
        .map(item => item.director))]
        .filter(Boolean)
        .filter((director: string) => director !== director.toUpperCase())
        .sort();

    const uniqueFilmNames = [...new Set(Object.values(combined)
        .flat()
        .map(item => item.filmTitle))]
        .filter(Boolean)
        .filter((filmName: string) => filmName !== filmName.toUpperCase())
        .sort();

    const convertedAIJson = Object.entries(combinedAI).map(([date, items]) => ({
        [date]: items.map(item => ({
            ...item,
            category: standardizeValueKeyLowercase(item.category || 'undefined or empty', categoryMapping),
            location: standardizeValueKeyLowercase(item.location || 'undefined or empty', locationMapping)
        }))
    }));

    const convertedOriginalJson = Object.entries(combined).map(([date, items]) => ({
        [date]: items.map(item => {
            const newItem: EventItem = { ...item };
            
            if (item.category) {
                newItem.category = standardizeValueKeyLowercase(item.category, categoryMapping);
            }
            if (item.location) {
                newItem.location = standardizeValueKeyLowercase(item.location, locationMapping);
            }
            if (item.director) {
                newItem.director = standardizeValueKeyUppercase(item.director, directorMapping);
            }
            if (item.filmTitle) {
                newItem.filmTitle = standardizeValueKeyUppercase(item.filmTitle, filmNameMapping);
            }
            
            return newItem;
        })
    }));

    return (
        <div className="p-8 space-y-8">


            <pre className="whitespace-pre-wrap font-mono text-sm hidden">
                <div className="mb-6 hidden">
                    <h2 className="text-lg font-semibold mb-2">Categories ({uniqueCategories.length}):</h2>
                    {uniqueCategories.map(category => (
                        <div key={category} className="pl-4">
                            {category}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Locations ({uniqueLocations.length}):</h2>
                    {uniqueLocations.map(location => (
                        <div key={location} className="pl-4">
                            {location}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Directors ({uniqueDirectors.length}):</h2>
                    {uniqueDirectors.map(director => (
                        <div key={director} className="pl-4">
                            {director}
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Film Names ({uniqueFilmNames.length}):</h2>
                    {uniqueFilmNames.map(filmName => (
                        <div key={filmName} className="pl-4">
                            {filmName}
                        </div>
                    ))}
                </div>
            </pre>

            <div className="whitespace-pre-wrap font-mono mt-8 hidden">
                <h2 className="text-lg font-semibold mb-2">Converted Original JSON:</h2>
                <pre className="whitespace-pre-wrap font-mono text-xs">
                    <code>
                        {JSON.stringify(convertedOriginalJson, null, 2)}
                    </code>
                </pre>
            </div>

            <div className="whitespace-pre-wrap font-mono mt-8 hidden">
                <h2 className="text-lg font-semibold mb-2">Converted AI JSON:</h2>
                <pre className="whitespace-pre-wrap font-mono text-xs">
                    <code>
                        {JSON.stringify(convertedAIJson, null, 2)}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default UniquePage;