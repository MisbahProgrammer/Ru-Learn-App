export interface UniversityInfo {
  name: string;
  abbreviation: string;
  description: string;
}

export interface CityBlog {
  id: string;
  name: string;
  russianName: string;
  category: 'Metropolis' | 'Cultural Capital' | 'Sports & Youth' | 'Resort Haven' | 'Pacific Hub' | 'Science & Tech';
  description: string;
  coverImage: string;
  galleryImages: string[];
  stats: {
    population: string;
    avgTempWinter: string;
    avgTempSummer: string;
    costOfLiving: 'Very High' | 'High' | 'Medium' | 'Low';
    bestFor: string;
  };
  overview: string;
  universities: UniversityInfo[];
  attractions: {
    title: string;
    description: string;
  }[];
  transport: {
    types: string[];
    guide: string;
    studentCost: string;
  };
  studentLife: {
    rentEstimate: string;
    mealEstimate: string;
    vibe: string;
  };
  scholarTip: string;
}

export const CITIES_GUIDE: CityBlog[] = [
  {
    id: 'moscow',
    name: 'Moscow',
    russianName: 'Москва',
    category: 'Metropolis',
    description: 'The political, economic, and educational heart of Russia, where ancient history meets futuristic skyscrapers.',
    coverImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1520106212299-d99c443e45f8?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1561542320-9a18cd340469?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1599824419139-9d933e4f62bf?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '13.1 Million',
      avgTempWinter: '-6°C to -10°C',
      avgTempSummer: '+20°C to +25°C',
      costOfLiving: 'Very High',
      bestFor: 'Business, Tech, Politics, Humanities & International Relations'
    },
    overview: 'As Europe’s largest metropolis, Moscow is a breathtaking, 24/7 city that never sleeps. For international students, it provides unparalleled career networking, top-tier research libraries, and a blend of historic monuments with modern, green city parks. Getting around is incredibly easy, and there is an endless list of exhibitions, food markets, and student clubs.',
    universities: [
      {
        name: 'Lomonosov Moscow State University',
        abbreviation: 'MSU / МГУ',
        description: 'Russia\'s oldest and highest-ranking university, housed in one of Moscow\'s majestic Stalinist "Seven Sisters" skyscrapers.'
      },
      {
        name: 'HSE University (Higher School of Economics)',
        abbreviation: 'HSE / ВШЭ',
        description: 'A modern, ultra-progressive hub with campuses across the city, leading in economics, data science, sociology, and humanities.'
      },
      {
        name: 'Peoples\' Friendship University of Russia',
        abbreviation: 'RUDN / РУДН',
        description: 'Highly diverse and international, RUDN is famous for hosting students from over 150 nations with specialized preparatory Russian programs.'
      }
    ],
    attractions: [
      {
        title: 'Red Square & St. Basil\'s Cathedral',
        description: 'The central square of Moscow, home to the Kremlin walls, Lenin\'s mausoleum, and the world-famous colorful onion domes of St. Basil\'s.'
      },
      {
        title: 'Gorky Park & Muzeon',
        description: 'A massive, sleek, riverfront park full of cycling paths, open-air cafes, art exhibitions, and hammocks for studying in the summer.'
      },
      {
        title: 'Moscow City (MIBC)',
        description: 'The futuristic financial district featuring iconic skyscrapers with observation decks offering panoramic views of the city.'
      }
    ],
    transport: {
      types: ['Metro', 'MCC (Ring Railway)', 'Bus', 'Tram', 'E-scooter'],
      guide: 'The Moscow Metro is a legendary masterpiece of architecture with marble stations and crystal chandeliers. Trains arrive every 90 seconds. To ride, get a "Troika" card.',
      studentCost: 'Only ~500 rubles ($5.50) per month for unlimited Metro, MCC, and Bus rides with a student social card!'
    },
    studentLife: {
      rentEstimate: '15,000 – 40,000 RUB/month (Shared Flat) or 1,500 – 4,000 RUB/month (University Dorm)',
      mealEstimate: '15,000 – 25,000 RUB/month',
      vibe: 'Fast-paced, high energy, cosmopolitan, ambitious, and highly connected.'
    },
    scholarTip: 'Download the "Yandex Go" app immediately for taxis and food delivery, and "Yandex Maps" to navigate Moscow\'s sprawling transport layout. Use your student card for 50% off entry at the Tretyakov Gallery and Bolshoi Theatre!'
  },
  {
    id: 'saint_petersburg',
    name: 'Saint Petersburg',
    russianName: 'Санкт-Петербург',
    category: 'Cultural Capital',
    description: 'The "Venice of the North," known for stunning canals, imperial palaces, and the magical White Nights of summer.',
    coverImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1555436169-20e93ea9a7ff?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1584611541300-d19717002940?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '5.6 Million',
      avgTempWinter: '-5°C to -8°C',
      avgTempSummer: '+18°C to +22°C',
      costOfLiving: 'High',
      bestFor: 'Arts, Literature, Architecture, European Culture, IT & Cybersecurity'
    },
    overview: 'Founded by Peter the Great as Russia\'s window to Europe, Saint Petersburg is a breathtaking living museum. It is the perfect city for writers, artists, developers, and history buffs. Majestic neo-classical architecture, cozy bookstores, independent cafes, and regular classical music concerts in historical castles define this highly intellectual student haven.',
    universities: [
      {
        name: 'Saint Petersburg State University',
        abbreviation: 'SPbU / СПбГУ',
        description: 'One of the nation\'s premier institutions with a long history of elite academics, located right on Vasilevsky Island.'
      },
      {
        name: 'ITMO University',
        abbreviation: 'ITMO / ИТМО',
        description: 'A global leader in computer science, robotics, and optics, holding multiple world programming championship titles.'
      },
      {
        name: 'Peter the Great St. Petersburg Polytechnic University',
        abbreviation: 'SPbPU / Политех',
        description: 'Renowned for industrial engineering, physics, and advanced materials sciences with a massive green campus.'
      }
    ],
    attractions: [
      {
        title: 'The State Hermitage Museum',
        description: 'The second-largest art museum in the world, housed inside the spectacular Winter Palace of the Russian Tsars.'
      },
      {
        title: 'Peterhof Palace & Gardens',
        description: 'The "Russian Versailles," famous for its gorgeous grand cascade fountains fueled purely by gravity, situated on the Baltic Sea.'
      },
      {
        title: 'Nevsky Prospekt & Canals',
        description: 'The city\'s vibrant main boulevard, perfect for canal boat rides, street musicians, and visiting historic churches.'
      }
    ],
    transport: {
      types: ['Metro', 'Bus', 'Tram', 'Canal Boats', 'Trolleybus'],
      guide: 'The metro is deep—Saint Petersburg has some of the deepest subway systems in the world (up to 86m underground!). Buy a "Podorozhnik" smartcard for cheap transport rates.',
      studentCost: 'Only ~450 rubles ($5.00) per month for unlimited student subway access.'
    },
    studentLife: {
      rentEstimate: '12,000 – 30,000 RUB/month (Shared Flat) or 1,200 – 3,500 RUB/month (University Dorm)',
      mealEstimate: '12,000 – 20,000 RUB/month',
      vibe: 'Romantic, artistic, highly cultured, intellectual, relaxed yet inspiring.'
    },
    scholarTip: 'During the "White Nights" (June to mid-July), the sun barely sets. Make sure to stay out at night to watch the giant Neva River bridges open up to let cargo ships pass. It is a magical student ritual, but remember to be on the correct side of the river before the bridges split, or you will be stranded until morning!'
  },
  {
    id: 'kazan',
    name: 'Kazan',
    russianName: 'Казань',
    category: 'Sports & Youth',
    description: 'The multicultural capital of Tatarstan, where Islamic minarets stand alongside Orthodox cathedral domes.',
    coverImage: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1616149562385-1d84e79478bb?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '1.3 Million',
      avgTempWinter: '-8°C to -12°C',
      avgTempSummer: '+19°C to +24°C',
      costOfLiving: 'Medium',
      bestFor: 'Linguistics, Medicine, Chemistry, Sports, Tatar-Turkic Culture'
    },
    overview: 'Kazan is officially crowned the "Third Capital of Russia" and is highly celebrated as a youthful, highly active sports and IT paradise. It is exceptionally safe, affordable, and rich in culinary and cultural diversity. Tatars and Russians have lived here in absolute harmony for centuries, making it one of the most welcoming regions for international students.',
    universities: [
      {
        name: 'Kazan Federal University',
        abbreviation: 'KFU / КФУ',
        description: 'One of the oldest universities in Russia, where Vladimir Lenin and Leo Tolstoy once studied, world-famous for organic chemistry and linguistics.'
      },
      {
        name: 'Kazan National Research Technical University',
        abbreviation: 'KNRTU-KAI / КАИ',
        description: 'A leading center for aviation, aerospace, telecommunications, and mechanical engineering sciences.'
      },
      {
        name: 'Innopolis University',
        abbreviation: 'Innopolis / Иннополис',
        description: 'Located in a nearby high-tech satellite city, this is a futuristic IT-only university taught entirely in English.'
      }
    ],
    attractions: [
      {
        title: 'Kazan Kremlin & Kul Sharif Mosque',
        description: 'A UNESCO World Heritage site, displaying the breathtaking Kul Sharif Mosque beside the historic Annunciation Cathedral.'
      },
      {
        title: 'Bauman Pedestrian Street',
        description: 'The heartbeat of the city, lined with Tatar souvenir shops, delicious bakeries, street performers, and cafes.'
      },
      {
        title: 'The Temple of All Religions',
        description: 'A colorful architectural landmark symbolizing the peaceful union of sixteen major world philosophies and faiths.'
      }
    ],
    transport: {
      types: ['Metro', 'Bus', 'Tram', 'Trolleybus'],
      guide: 'Kazan is highly compact. It has a beautiful, single-line metro system which makes travelling from dormitories to downtown extremely easy.',
      studentCost: 'About 300 - 350 RUB per month for a student transit card.'
    },
    studentLife: {
      rentEstimate: '8,000 – 18,000 RUB/month (Shared Flat) or 500 – 1,500 RUB/month (Universities usually offer excellent state-of-the-art Universiade Village dorms)',
      mealEstimate: '9,000 – 14,000 RUB/month',
      vibe: 'Extremely welcoming, multicultural, active, clean, sports-oriented.'
    },
    scholarTip: 'Do not miss trying Tatar national cuisine! Order "Echpochmak" (triangular meat and potato pastry), "Kystyby" (flatbread filled with mashed potatoes), and "Chak-Chak" (honey dessert). They are cheap, filling, and loved by all students.'
  },
  {
    id: 'sochi',
    name: 'Sochi',
    russianName: 'Сочи',
    category: 'Resort Haven',
    description: 'The "Russian Riviera," where you can ski down snow-covered peaks in the morning and swim in the warm Black Sea in the afternoon.',
    coverImage: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1564151432541-698e4d20ae47?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '450,000',
      avgTempWinter: '+6°C to +11°C (Subtropical Coast!)',
      avgTempSummer: '+25°C to +30°C',
      costOfLiving: 'High',
      bestFor: 'Ecology, Hospitality & Tourism, Climate Sciences, Oceanography, Sports Management'
    },
    overview: 'Sochi is Russia\'s premier subtropical paradise. Stretching 145km along the Black Sea coast and backed by the towering Caucasus Mountains, it hosted the 2014 Winter Olympics. If you love palm trees, warm ocean breezes, mountain hiking, skiing, and modern resort infrastructure, Sochi offers an incredibly unique student experience.',
    universities: [
      {
        name: 'Sochi State University',
        abbreviation: 'SSU / СГУ',
        description: 'A leading university in the Russian South, specializing in tourism, hospitality, environmental engineering, and physical therapy.'
      },
      {
        name: 'Russian International Olympic University',
        abbreviation: 'RIOU / РМОУ',
        description: 'The first university in the world dedicated to Olympic sports education, boasting state-of-the-art smart oceanfront campus facilities.'
      },
      {
        name: 'Sirius University of Science and Technology',
        abbreviation: 'Sirius / Сириус',
        description: 'An elite experimental university focused on genetic research, artificial intelligence, and cognitive sciences.'
      }
    ],
    attractions: [
      {
        title: 'Rosa Khutor Alpine Resort',
        description: 'A world-class ski resort in Krasnaya Polyana offering stunning cable car rides, alpine hiking, and winter snowboarding.'
      },
      {
        title: 'Olympic Park & Formula 1 Circuit',
        description: 'The epic central coastal park featuring Olympic stadium domes, a musical synchronized fountain show, and race tracks.'
      },
      {
        title: 'Sochi National Park & Arboretum (Dendrariy)',
        description: 'A sprawling subtropical botanical garden containing thousands of rare exotic plants, reachable via an elegant cable car.'
      }
    ],
    transport: {
      types: ['Bus', 'Lastochka (Express Train)', 'Shared Bicycle', 'Taxi'],
      guide: 'Since Sochi is very long and narrow, the "Lastochka" high-speed electric trains are the fastest way to travel from the beach up into the mountain ski resorts.',
      studentCost: '50% student discount on train tickets during academic semesters.'
    },
    studentLife: {
      rentEstimate: '15,000 – 25,000 RUB/month (Shared Flat) or 1,000 – 2,500 RUB/month (Dorm)',
      mealEstimate: '12,000 – 18,000 RUB/month',
      vibe: 'Active, healthy, relaxed, sunny, resort-style with outdoor adventures.'
    },
    scholarTip: 'Sochi has the mildest winter in Russia—palm trees stay green year-round and it almost never snows on the beach! It is a fantastic escape for students who prefer warmth, but still want easy access to the snowy Caucasus peaks.'
  },
  {
    id: 'vladivostok',
    name: 'Vladivostok',
    russianName: 'Владивосток',
    category: 'Pacific Hub',
    description: 'Russia\'s gateway to Asia, a ruggedly beautiful hilly port city overlooking the Sea of Japan.',
    coverImage: 'https://images.unsplash.com/photo-1579227111342-0199fe10e66b?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1608962714217-193496924840?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1511316695149-ae1e1276a00a?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1619864205510-fe1783ae59ea?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '610,000',
      avgTempWinter: '-10°C to -15°C (Sunny & Windy!)',
      avgTempSummer: '+18°C to +22°C (Foggy & Refreshing)',
      costOfLiving: 'Medium',
      bestFor: 'Marine Biology, Asian Studies, International Trade, Logistics, Robotics'
    },
    overview: 'Vladivostok is the terminal station of the legendary Trans-Siberian Railway. Positioned close to China, South Korea, and Japan, it is a maritime capital built on high, scenic hills resembling San Francisco. The spectacular marine-based Russky Island campus hosts thousands of international students in a highly modern, isolated educational city with its own beaches and parks.',
    universities: [
      {
        name: 'Far Eastern Federal University',
        abbreviation: 'FEFU / ДВФУ',
        description: 'A spectacular, sprawling oceanfront campus on Russky Island, built for international summits and offering elite oceanic, trade, and AI labs.'
      },
      {
        name: 'Maritime State University',
        abbreviation: 'MSU / МГУ им. Невельского',
        description: 'Specializes in training sea captains, naval officers, ocean engineers, and maritime logistics coordinators.'
      }
    ],
    attractions: [
      {
        title: 'Russky Island & Golden Bridge',
        description: 'The iconic cable-stayed bridge spanning the Golden Horn Bay, leading to beautiful rocky cliffs, hiking trails, and the FEFU campus.'
      },
      {
        title: 'Tokarevsky Lighthouse',
        description: 'One of the oldest lighthouses in the Far East, standing on a tiny spit of land where you can walk in the middle of the sea.'
      },
      {
        title: 'Primorsky Aquarium',
        description: 'A massive, dolphin-shaped research aquarium on Russky Island displaying thousands of unique Arctic and Pacific marine species.'
      }
    ],
    transport: {
      types: ['Bus', 'Ferry', 'Funicular Railway', 'Taxi'],
      guide: 'The city is famous for its cable cars and hilly roads. Buses are the main way to travel between the mainland downtown and Russky Island.',
      studentCost: 'Standard student bus pass costs ~350 RUB/month.'
    },
    studentLife: {
      rentEstimate: '10,000 – 20,000 RUB/month (Shared Flat) or 1,500 – 3,500 RUB/month (Super modern hotel-like rooms at the FEFU campus)',
      mealEstimate: '10,000 – 16,000 RUB/month (Seafood like Kamchatka crab is incredibly affordable!)',
      vibe: 'Maritime, panoramic, international, marine-focused, windy and adventurous.'
    },
    scholarTip: 'Be prepared for the Vladivostok wind! Winter here is extremely sunny but windy. If you live at the Russky Island campus, you are living on a true pacific island with wild foxes roaming the campus edges. Remember to pack a high-quality windproof jacket.'
  },
  {
    id: 'novosibirsk',
    name: 'Novosibirsk',
    russianName: 'Новосибирск',
    category: 'Science & Tech',
    description: 'The scientific capital of Siberia, famous for its grand opera house and Akademgorodok (Academic Town) nested in a pine forest.',
    coverImage: 'https://images.unsplash.com/photo-1547989453-11e67ffb3885?auto=format&fit=crop&q=70&w=800&fm=webp',
    galleryImages: [
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=60&w=500&fm=webp',
      'https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&q=60&w=500&fm=webp'
    ],
    stats: {
      population: '1.6 Million',
      avgTempWinter: '-15°C to -22°C (True Siberian Winter!)',
      avgTempSummer: '+20°C to +25°C',
      costOfLiving: 'Low',
      bestFor: 'Nuclear Physics, Biotechnology, Applied Mathematics, Chemistry, Opera & Classical Ballet'
    },
    overview: 'Novosibirsk is the third-most populous city in Russia and the undisputed administrative center of Siberia. It grew rapidly as a major transport junction on the Ob River. Its crown jewel is "Akademgorodok" (Academic Town), a world-famous scientific enclave built right in a dense Siberian pine forest, hosting over 30 academic research institutes and top-tier tech startups.',
    universities: [
      {
        name: 'Novosibirsk State University',
        abbreviation: 'NSU / НГУ',
        description: 'Nested inside the pine woods of Akademgorodok, NSU is an elite powerhouse for natural sciences, mathematics, and computing.'
      },
      {
        name: 'Novosibirsk State Technical University',
        abbreviation: 'NSTU / НГТУ',
        description: 'A major technical institute on the left bank of the Ob River, offering extensive engineering and technological training.'
      }
    ],
    attractions: [
      {
        title: 'Novosibirsk State Opera and Ballet Theatre',
        description: 'The largest theatre building in Russia, even larger than the Bolshoi in Moscow, famous for world-class classical performances.'
      },
      {
        title: 'Akademgorodok Forest Campus',
        description: 'A unique forest town where squirrels jump into student hands, and researchers walk under tall Siberian pines between state-of-the-art labs.'
      },
      {
        title: 'Novosibirsk Zoo (Shilo Zoo)',
        description: 'One of the most prestigious zoos in Russia, stretching across a giant natural pine forest and containing rare snow footprints.'
      }
    ],
    transport: {
      types: ['Metro', 'Bus', 'Siberian Electric Train', 'Tram'],
      guide: 'Novosibirsk has a highly efficient, two-line metro system. Crossing the giant Ob River on the Metro Bridge is an iconic daily student view.',
      studentCost: 'Student metro rides are subsidized and cost only ~200 - 300 RUB/month.'
    },
    studentLife: {
      rentEstimate: '8,000 – 15,000 RUB/month (Shared Flat) or 800 – 2,000 RUB/month (Forest-based dorms)',
      mealEstimate: '8,000 – 12,000 RUB/month',
      vibe: 'Brainy, scientific, calm, outdoor-oriented, deeply Siberian.'
    },
    scholarTip: 'Do not fear the Siberian winter! It is dry, sunny, and highly refreshing. Just make sure to learn the art of "layering" (thermals, fleece, down jacket, boots). The air in Akademgorodok is some of the cleanest and freshest in the world, and cross-country skiing is literally right outside your dormitory door!'
  }
];
