export interface LessonWord {
  russian: string;
  phonetic: string;
  english: string;
}

export interface LessonSentence {
  russian: string;
  phonetic: string;
  english: string;
  context: string;
}

export interface DailyLessonData {
  dayNumber: number;
  title: string;
  alphabetSection: {
    letters: string[];
    audioHint: string;
  };
  vocabularySection: {
    words: LessonWord[];
  };
  sentenceSection: {
    sentences: LessonSentence[];
  };
  totalMinutes: number;
}

export const dailyLessons: DailyLessonData[] = [
  {
    dayNumber: 1,
    title: "Sheremetyevo Airport Arrival & Passport Control",
    alphabetSection: {
      letters: ["А", "О", "У", "Э"],
      audioHint: "Basic Russian vowels: А [ah], О [oh], У [oo], Э [eh]"
    },
    vocabularySection: {
      words: [
        { russian: "Паспорт", phonetic: "pahs-pahrt", english: "Passport" },
        { russian: "Аэропорт", phonetic: "ah-eh-rah-pohrt", english: "Airport" },
        { russian: "Багаж", phonetic: "bah-gahzh", english: "Baggage" },
        { russian: "Выход", phonetic: "vih-haht", english: "Exit" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где мой багаж?",
          phonetic: "Gde moy bah-gahzh?",
          english: "Where is my baggage?",
          context: "Asking the airport staff after landing."
        },
        {
          russian: "Вот мой паспорт.",
          phonetic: "Vot moy pahs-pahrt.",
          english: "Here is my passport.",
          context: "Showing your passport to the customs officer."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 2,
    title: "Ordering a Yandex Taxi to HSE/RUDN University",
    alphabetSection: {
      letters: ["Т", "Д", "Н", "М"],
      audioHint: "Consonants similar to English: Т [t], Д [d], Н [n], М [m]"
    },
    vocabularySection: {
      words: [
        { russian: "Такси", phonetic: "tahk-see", english: "Taxi" },
        { russian: "Машина", phonetic: "mah-shee-nah", english: "Car" },
        { russian: "Адрес", phonetic: "ah-dryes", english: "Address" },
        { russian: "Дом", phonetic: "dom", english: "House / Building" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где такси?",
          phonetic: "Gde tahk-see?",
          english: "Where is the taxi?",
          context: "Looking for your ride outside the terminal."
        },
        {
          russian: "Нам нужен этот адрес.",
          phonetic: "Nam noo-zhen eh-tat ah-dryes.",
          english: "We need this address.",
          context: "Telling the driver the location of your residence."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 3,
    title: "Checking in at the University Dormitory",
    alphabetSection: {
      letters: ["И", "Ы", "Ь"],
      audioHint: "Vowels and system marks: И [ee], Ы [hard ee-y], Ь [softening sign]"
    },
    vocabularySection: {
      words: [
        { russian: "Общежитие", phonetic: "ahp-shcheh-zhee-tyeh", english: "Dormitory / Hostel" },
        { russian: "Комната", phonetic: "kom-nah-tah", english: "Room" },
        { russian: "Ключ", phonetic: "klyooch", english: "Key" },
        { russian: "Пропуск", phonetic: "proh-poosk", english: "Entry pass / ID card" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Вот мой пропуск.",
          phonetic: "Vot moy proh-poosk.",
          english: "Here is my entry pass.",
          context: "Showing your ID pass to the security guard."
        },
        {
          russian: "Какая моя комната?",
          phonetic: "Kah-kah-yah mah-yah kom-nah-tah?",
          english: "Which one is my room?",
          context: "Asking the desk Administrator on arrival."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 4,
    title: "Meeting Your Dorm Roommate",
    alphabetSection: {
      letters: ["Б", "П", "В", "Ф"],
      audioHint: "Voiced and voiceless counterpart pairs: Б [b] / П [p], В [v] / Ф [f]"
    },
    vocabularySection: {
      words: [
        { russian: "Привет", phonetic: "pree-vyet", english: "Hi / Hello" },
        { russian: "Друг", phonetic: "drook", english: "Friend" },
        { russian: "Сосед", phonetic: "sah-syet", english: "Neighbour / Roommate" },
        { russian: "Студент", phonetic: "stoo-dyent", english: "Student" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Привет! Меня зовут Алекс.",
          phonetic: "Pree-vyet! Mee-nyah zah-voot Ah-lyeks.",
          english: "Hi! My name is Alex.",
          context: "Introducing yourself to your new roommate."
        },
        {
          russian: "Я тоже студент.",
          phonetic: "Ya toh-zheh stoo-dyent.",
          english: "I am also a student.",
          context: "Connecting over a common lifestyle."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 5,
    title: "Buying Groceries at Pyaterochka Supermarket",
    alphabetSection: {
      letters: ["Г", "К", "Х"],
      audioHint: "Throat sounds: Г [g], К [k], Х [h - soft friction sound]"
    },
    vocabularySection: {
      words: [
        { russian: "Вода", phonetic: "vah-dah", english: "Water" },
        { russian: "Хлеб", phonetic: "hlyep", english: "Bread" },
        { russian: "Молоко", phonetic: "mah-lah-ko", english: "Milk" },
        { russian: "Пакет", phonetic: "pah-kyet", english: "Plastic bag" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Пакет нужен, спасибо.",
          phonetic: "Pah-kyet noo-zhen, spah-see-bah.",
          english: "A plastic bag is needed, thank you.",
          context: "Replying to the cashier's standard question."
        },
        {
          russian: "Где здесь молоко?",
          phonetic: "Gde zdyes' mah-lah-ko?",
          english: "Where is the milk here?",
          context: "Asking a store assistant in Pyaterochka."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 6,
    title: "Navigating the Moscow Metro",
    alphabetSection: {
      letters: ["З", "С", "Ц"],
      audioHint: "Sibilants: З [z], С [s], Ц [ts as in 'cats']"
    },
    vocabularySection: {
      words: [
        { russian: "Метро", phonetic: "mye-tro", english: "Metro" },
        { russian: "Станция", phonetic: "stahn-tsee-yah", english: "Station" },
        { russian: "Поезд", phonetic: "poh-yezd", english: "Train" },
        { russian: "Карта", phonetic: "kahr-tah", english: "Card / Map" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Какая это станция?",
          phonetic: "Kah-kah-yah eh-tah stahn-tsee-yah?",
          english: "Which station is this?",
          context: "Asking when looking out of the train window."
        },
        {
          russian: "Мне нужна Тройка.",
          phonetic: "Mnye noozh-nah Troy-kah.",
          english: "I need a Troika card.",
          context: "Buying a transit card from the counter ticket clerk."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 7,
    title: "Asking Directions on the Street",
    alphabetSection: {
      letters: ["Ж", "Ш", "Щ"],
      audioHint: "Hushing sounds: Ж [zh as in 'pleasure'], Ш [hard sh], Щ [soft double sh]"
    },
    vocabularySection: {
      words: [
        { russian: "Улица", phonetic: "oo-lee-tsah", english: "Street" },
        { russian: "Где", phonetic: "gde", english: "Where" },
        { russian: "Прямо", phonetic: "pryah-mah", english: "Straight ahead" },
        { russian: "Центр", phonetic: "tsenthr", english: "Center / Downtown" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Извините, где метро?",
          phonetic: "Eez-vee-nee-tyeh, gde mye-tro?",
          english: "Excuse me, where is the metro?",
          context: "Approaching a civilian for directions."
        },
        {
          russian: "Идите прямо.",
          phonetic: "Ee-dee-tyeh pryah-mah.",
          english: "Go straight ahead.",
          context: "Receiving helpful directions."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 8,
    title: "Finding the Right University Classroom",
    alphabetSection: {
      letters: ["Ч", "Л", "Р"],
      audioHint: "Consonants: Ч [ch], Л [l], Р [rolled Russian r]"
    },
    vocabularySection: {
      words: [
        { russian: "Университет", phonetic: "oo-nee-vyehr-see-tyet", english: "University" },
        { russian: "Пара", phonetic: "pah-rah", english: "Double-class/Lecture (90 min)" },
        { russian: "Этаж", phonetic: "eh-tahzh", english: "Floor / Level" },
        { russian: "Кабинет", phonetic: "kah-bee-nyet", english: "Office / Classroom" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где кабинет номер три?",
          phonetic: "Gde kah-see-nyet noh-myer tree?",
          english: "Where is classroom number three?",
          context: "Looking for your study hall on the first morning."
        },
        {
          russian: "Это второй этаж.",
          phonetic: "Eh-tah vthah-roy eh-tahzh.",
          english: "This is the second floor.",
          context: "A helpful guide answering your query."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 9,
    title: "Getting Student SIM Card / Mobile Internet",
    alphabetSection: {
      letters: ["Е", "Ё", "Ю", "Я"],
      audioHint: "Yotated vowels: Е [ye], Ё [yo], Ю [yoo], Я [yah]"
    },
    vocabularySection: {
      words: [
        { russian: "Связь", phonetic: "svyahz'", english: "Connection / Cellular signal" },
        { russian: "Интернет", phonetic: "een-tyer-nyet", english: "Internet" },
        { russian: "Тариф", phonetic: "tah-reef", english: "Billing plan" },
        { russian: "Симка", phonetic: "seem-kah", english: "SIM card" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Мне нужна сим-карта.",
          phonetic: "Mnye noozh-nah seem-kahr-tah.",
          english: "I need a SIM card.",
          context: "At a Megafon or MTS mobile shop."
        },
        {
          russian: "Какой здесь тариф?",
          phonetic: "Kah-koy zdyes' tah-reef?",
          english: "What billing plan is this?",
          context: "Securing student discounts on data allowance."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 10,
    title: "Ordering Coffee & Breakfast",
    alphabetSection: {
      letters: ["Й", "Ч", "Я"],
      audioHint: "Semi-vowels and vowels: Й [short yotated i], Ч [ch], Я [yah]"
    },
    vocabularySection: {
      words: [
        { russian: "Кофе", phonetic: "koh-fyeh", english: "Coffee" },
        { russian: "Капучино", phonetic: "kah-poo-chee-nah", english: "Cappuccino" },
        { russian: "Блины", phonetic: "blee-nih", english: "Pancakes" },
        { russian: "Сахар", phonetic: "sah-hahr", english: "Sugar" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Кофе без сахара, пожалуйста.",
          phonetic: "Koh-fyeh byez sah-hah-rah, pah-zhah-looy-stah.",
          english: "Coffee without sugar, please.",
          context: "Giving your customized drinks order."
        },
        {
          russian: "Можно блины?",
          phonetic: "Mozh-nah blee-nih?",
          english: "May I have pancakes?",
          context: "Ordering traditional Russian breakfast pancakes."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 11,
    title: "Exchanging Foreign Currency and Sberbank Card Basics",
    alphabetSection: {
      letters: ["Б", "К", "Р"],
      audioHint: "Financial letters: Б [b], К [k], Р [r]"
    },
    vocabularySection: {
      words: [
        { russian: "Банк", phonetic: "bahnk", english: "Bank" },
        { russian: "Рубль", phonetic: "roobl'", english: "Ruble" },
        { russian: "Карта", phonetic: "kahr-tah", english: "Bank Card" },
        { russian: "Курс", phonetic: "koors", english: "Exchange rate" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где здесь банкомат?",
          phonetic: "Gde zdyes' bahn-kah-maht?",
          english: "Where is the ATM here?",
          context: "In search of cash withdrawal machines."
        },
        {
          russian: "Можно платить картой?",
          phonetic: "Mozh-nah plah-teet' kahr-toy?",
          english: "Is it possible to pay with a card?",
          context: "Asking if cashless transactions are possible."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 12,
    title: "Speaking with the Dean's Office (Деканат)",
    alphabetSection: {
      letters: ["Д", "Е", "К"],
      audioHint: "Administrative letters: Д [d], Е [ye], К [k]"
    },
    vocabularySection: {
      words: [
        { russian: "Деканат", phonetic: "dye-kah-naht", english: "Dean's office" },
        { russian: "Виза", phonetic: "vee-zah", english: "Visa" },
        { russian: "Регистрация", phonetic: "rye-gees-trah-tsee-yah", english: "Registration Document" },
        { russian: "Справка", phonetic: "sprahf-kah", english: "Certificate / Official note" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Мне нужна регистрация.",
          phonetic: "Mnye noozh-nah rye-gees-trah-tsee-yah.",
          english: "I need my registration.",
          context: "Dealing with mandatory international student documents."
        },
        {
          russian: "Где декан?",
          phonetic: "Gde dye-kahn?",
          english: "Where is the Dean?",
          context: "Inquiring about administrative attendance."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 13,
    title: "Ordering Russian Food at Teremok Cafe",
    alphabetSection: {
      letters: ["Т", "Е", "Р"],
      audioHint: "Hospitality terms: Т [t], Е [ye], Р [r]"
    },
    vocabularySection: {
      words: [
        { russian: "Суп", phonetic: "soop", english: "Soup" },
        { russian: "Борщ", phonetic: "bohrshch", english: "Borscht soup" },
        { russian: "Сметана", phonetic: "smye-tah-nah", english: "Sour cream" },
        { russian: "Чай", phonetic: "chay", english: "Tea" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Один борщ со сметаной, пожалуйста.",
          phonetic: "Ah-deen bohrshch sah smye-tah-noy, pah-zhah-looy-stah.",
          english: "One borscht with sour cream, please.",
          context: "Placing your custom soup order."
        },
        {
          russian: "Сколько это стоит?",
          phonetic: "Skol'-kah eh-tah stoh-eet?",
          english: "How much does this cost?",
          context: "Enquiring about your receipt total."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 14,
    title: "Connecting to Dorm Wi-Fi & Internet Rules",
    alphabetSection: {
      letters: ["С", "Е", "Т"],
      audioHint: "Network letters: С [s], Е [ye], Т [t]"
    },
    vocabularySection: {
      words: [
        { russian: "Сеть", phonetic: "syet'", english: "Network" },
        { russian: "Пароль", phonetic: "pah-rol'", english: "Password" },
        { russian: "Логин", phonetic: "loh-geen", english: "Login / Username" },
        { russian: "Сайт", phonetic: "sayt", english: "Website" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Какой пароль от вай-фая?",
          phonetic: "Kah-koy pah-rol' aht-vay-fah-yah?",
          english: "What is the Wi-Fi password?",
          context: "Connecting your devices in public common areas."
        },
        {
          russian: "Интернет не работает.",
          phonetic: "Een-tyer-nyet nye rah-boh-tah-yet.",
          english: "The internet is not working.",
          context: "Complaining to technical administration."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 15,
    title: "Midpoint Survival Check-in & Essential Review",
    alphabetSection: {
      letters: ["А", "О", "У", "Э", "И", "Ы", "Е", "Ё", "Ю", "Я"],
      audioHint: "Complete vowel integration and vocalic rhythm"
    },
    vocabularySection: {
      words: [
        { russian: "Хорошо", phonetic: "hah-rah-shoh", english: "Good / OK" },
        { russian: "Спасибо", phonetic: "spah-see-bah", english: "Thank you" },
        { russian: "Пожалуйста", phonetic: "pah-zhah-looy-stah", english: "Please / You're welcome" },
        { russian: "Извините", phonetic: "eez-vee-nee-tyeh", english: "Excuse me / Sorry" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Я плохо говорю по-русски.",
          phonetic: "Ya plo-hah gah-vah-ryoo pah-roos-kee.",
          english: "I speak Russian poorly.",
          context: "Managing expectations with local speakers gracefully."
        },
        {
          russian: "Вы говорите по-английски?",
          phonetic: "Vih gah-vah-ree-tyeh pah-ahn-glees-kee?",
          english: "Do you speak English?",
          context: "Seeking translations on complex matters."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 16,
    title: "Pharmacy (Аптека) & Ordering Basic Medicine",
    alphabetSection: {
      letters: ["А", "П", "Т"],
      audioHint: "Medical vowels/consonants: А [ah], П [p], Т [t]"
    },
    vocabularySection: {
      words: [
        { russian: "Аптека", phonetic: "ahp-tye-kah", english: "Pharmacy" },
        { russian: "Лекарство", phonetic: "lye-kahr-stvah", english: "Medicine" },
        { russian: "Грипп", phonetic: "greep", english: "Influenza / Flu" },
        { russian: "Градусник", phonetic: "grah-doos-neek", english: "Thermometer" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "У меня болит голова.",
          phonetic: "Oo mye-nyah bah-leet gah-lah-vah.",
          english: "My head hurts / I have a headache.",
          context: "Explaining symptoms to the pharmacist."
        },
        {
          russian: "Мне нужна таблетка.",
          phonetic: "Mnye noozh-nah tah-blyet-kah.",
          english: "I need a pill.",
          context: "Requesting over-the-counter pain relievers."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 17,
    title: "Visiting a Local Shopping Mall (ТРЦ)",
    alphabetSection: {
      letters: ["Ц", "Е", "Н"],
      audioHint: "Urban life: Ц [ts], Е [ye], Н [n]"
    },
    vocabularySection: {
      words: [
        { russian: "Одежда", phonetic: "ah-dyezh-dah", english: "Clothing" },
        { russian: "Размер", phonetic: "rahz-myer", english: "Size" },
        { russian: "Цена", phonetic: "tseh-nah", english: "Price" },
        { russian: "Примерочная", phonetic: "pree-mye-rahch-nah-yah", english: "Fitting room" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где примерочная?",
          phonetic: "Gde pree-mye-rahch-nah-yah?",
          english: "Where is the fitting room?",
          context: "Asking retail staff. Essential for winter coat shopping."
        },
        {
          russian: "Какой это размер?",
          phonetic: "Kah-koy eh-tah rahz-myer?",
          english: "What size is this?",
          context: "Determining local sizing metrics."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 18,
    title: "Using Laundry in Dorm (Прачечная)",
    alphabetSection: {
      letters: ["Л", "С", "Т"],
      audioHint: "Domestic sounds: Л [l], С [s], Т [t]"
    },
    vocabularySection: {
      words: [
        { russian: "Стирка", phonetic: "steer-kah", english: "Washing / Laundry" },
        { russian: "Порошок", phonetic: "pah-rah-shohk", english: "Washing powder" },
        { russian: "Машина", phonetic: "mah-shee-nah", english: "Machine" },
        { russian: "Сушка", phonetic: "soosh-kah", english: "Drying" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где здесь стиральный порошок?",
          phonetic: "Gde zdyes' stee-ral'-nihy pah-rah-shohk?",
          english: "Where is the laundry detergent here?",
          context: "Locating cleaning supplies."
        },
        {
          russian: "Машина свободна?",
          phonetic: "Mah-shee-nah svah-bohd-nah?",
          english: "Is the machine free?",
          context: "Asking fellow students in the communal laundry room."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 19,
    title: "Taking the Suburban Train (Электричка) to Moscow Suburbs",
    alphabetSection: {
      letters: ["Э", "Л", "К"],
      audioHint: "Travel items: Э [eh], Л [l], К [k]"
    },
    vocabularySection: {
      words: [
        { russian: "Билет", phonetic: "bee-lyet", english: "Ticket" },
        { russian: "Платформа", phonetic: "plaht-fohr-mah", english: "Platform" },
        { russian: "Касса", phonetic: "kahs-sah", english: "Ticket desk" },
        { russian: "Электричка", phonetic: "eh-lyek-treech-kah", english: "Suburban commuter train" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Один билет до Москвы, пожалуйста.",
          phonetic: "Ah-deen bee-lyet dah mahsk-vih, pah-zhah-looy-stah.",
          english: "One ticket to Moscow, please.",
          context: "Buying suburban transport ticket."
        },
        {
          russian: "Откуда едет поезд?",
          phonetic: "Aht-koo-dah yeh-dyet poh-yezd?",
          english: "Where does the train leave from?",
          context: "Enquiring about departure platforms."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 20,
    title: "At the University Library & Textbook Rental",
    alphabetSection: {
      letters: ["К", "Н", "Г"],
      audioHint: "Literary: К [k], Н [n], Г [g]"
    },
    vocabularySection: {
      words: [
        { russian: "Книга", phonetic: "knee-gah", english: "Book" },
        { russian: "Учебник", phonetic: "oo-chyeb-neek", english: "Textbook" },
        { russian: "Словарь", phonetic: "slah-vahr'", english: "Dictionary" },
        { russian: "Библиотека", phonetic: "beeb-lee-ah-tye-kah", english: "Library" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Мне нужен этот учебник.",
          phonetic: "Mnye noo-zhen eh-tat oo-chyeb-neek.",
          english: "I need this textbook.",
          context: "Requesting course material from librarian."
        },
        {
          russian: "Где здесь тихая зона?",
          phonetic: "Gde zdyes' tee-hah-yah zoh-nah?",
          english: "Where is the quiet zone here?",
          context: "Searching for study areas."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 21,
    title: "Handling Post and Packages (Почта России / СДЭК)",
    alphabetSection: {
      letters: ["П", "Ч", "Т"],
      audioHint: "Postal: П [p], Ч [ch], Т [t]"
    },
    vocabularySection: {
      words: [
        { russian: "Посылка", phonetic: "pah-sihl-kah", english: "Parcel / Package" },
        { russian: "Почта", phonetic: "pohch-tah", english: "Post / Mail" },
        { russian: "Письмо", phonetic: "pees'-moh", english: "Letter" },
        { russian: "Номер", phonetic: "noh-myer", english: "Number" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Вот трек-номер посылки.",
          phonetic: "Vot trek-noh-myer pah-sihl-kee.",
          english: "Here is the parcel tracking number.",
          context: "Collecting delivery from Sberlogistics or CDEK pickup point."
        },
        {
          russian: "Мне нужно отправить письмо.",
          phonetic: "Mnye noozh-nah aht-prah-veet' pees'-moh.",
          english: "I need to send a letter.",
          context: "Speaking with post office clerk."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 22,
    title: "Ordering Online via Ozon or Wildberries",
    alphabetSection: {
      letters: ["З", "А", "К"],
      audioHint: "Ordering: З [z], А [ah], К [k]"
    },
    vocabularySection: {
      words: [
        { russian: "Заказ", phonetic: "zah-kahs", english: "Order" },
        { russian: "Пункт", phonetic: "poonkt", english: "Pick-up point" },
        { russian: "Доставка", phonetic: "dah-stahf-kah", english: "Delivery" },
        { russian: "Товар", phonetic: "tah-vahr", english: "Item / Goods" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где пункт выдачи Озон?",
          phonetic: "Gde poonkt vih-dah-chee Ozon?",
          english: "Where is the Ozon pick-up point?",
          context: "Asking coordinates to get your online shopping."
        },
        {
          russian: "Вот код заказа.",
          phonetic: "Vot kod zah-kah-zah.",
          english: "Here is the order code.",
          context: "Presenting barcode or digits to collect items."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 23,
    title: "Registering for Campus Gym & Active Lifestyle",
    alphabetSection: {
      letters: ["С", "П", "Р"],
      audioHint: "Athletic: С [s], П [p], Р [r]"
    },
    vocabularySection: {
      words: [
        { russian: "Спортзал", phonetic: "spohrt-zhal", english: "Gym / Sports hall" },
        { russian: "Бассейн", phonetic: "bahs-syeyn", english: "Swimming pool" },
        { russian: "Форма", phonetic: "fohr-mah", english: "Uniform / Athletic wear" },
        { russian: "Тренер", phonetic: "trye-nyer", english: "Coach / Instructor" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Я хочу записаться в спортзал.",
          phonetic: "Ya hah-choo zah-pee-saht'-syah f-spohrt-zhal.",
          english: "I want to sign up for the gym.",
          context: "Applying for campus recreational access on Sretensky Boulevard or Obrucheva."
        },
        {
          russian: "Где бассейн?",
          phonetic: "Gde bahs-syeyn?",
          english: "Where is the swimming pool?",
          context: "Finding aquatic building locations."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 24,
    title: "Speaking with Classroom Technical Assistants",
    alphabetSection: {
      letters: ["Т", "Е", "Х"],
      audioHint: "Technology sounds: Т [t], Е [ye], Х [h]"
    },
    vocabularySection: {
      words: [
        { russian: "Проектор", phonetic: "prah-yek-tar", english: "Projector" },
        { russian: "Ноутбук", phonetic: "noh-oot-book", english: "Laptop" },
        { russian: "Экран", phonetic: "eh-krahn", english: "Screen" },
        { russian: "Звук", phonetic: "zvook", english: "Sound / Audio" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Проектор не работает.",
          phonetic: "Prah-yek-tar nye rah-boh-tah-yet.",
          english: "The projector does not work.",
          context: "Telling the technician before giving a class presentation."
        },
        {
          russian: "Как включить звук?",
          phonetic: "Kahk vklyoo-cheet' zvook?",
          english: "How to turn on the sound?",
          context: "Configuring classroom multimedia."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 25,
    title: "Haircut (Парикмахерская) & Grooming",
    alphabetSection: {
      letters: ["П", "Р", "К"],
      audioHint: "Personal care: П [p], Р [r], К [k]"
    },
    vocabularySection: {
      words: [
        { russian: "Стрижка", phonetic: "streezh-kah", english: "Haircut" },
        { russian: "Мастер", phonetic: "mah-styer", english: "Stylist / Specialist" },
        { russian: "Волосы", phonetic: "voh-lah-sih", english: "Hair" },
        { russian: "Коротко", phonetic: "koh-raht-kah", english: "Short" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Сделайте, пожалуйста, коротко.",
          phonetic: "Sdye-lay-tyeh, pah-zhah-looy-stah, koh-raht-kah.",
          english: "Make it short, please.",
          context: "Giving directions to the hair stylist."
        },
        {
          russian: "Мне нужна только стрижка.",
          phonetic: "Mnye noozh-nah tol'-kah streezh-kah.",
          english: "I only need a haircut.",
          context: "Selecting service elements in budget salons."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 26,
    title: "Navigating Sapsan (Сапсан) Train to Saint Petersburg",
    alphabetSection: {
      letters: ["С", "П", "С"],
      audioHint: "Express trains: С [s], П [p], С [s]"
    },
    vocabularySection: {
      words: [
        { russian: "Вокзал", phonetic: "vahg-zhal", english: "Main train terminal" },
        { russian: "Вагон", phonetic: "vah-gohn", english: "Train carriage" },
        { russian: "Место", phonetic: "mye-stah", english: "Seat number" },
        { russian: "Сапсан", phonetic: "sahp-sahn", english: "High-speed rail" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Где Ленинградский вокзал?",
          phonetic: "Gde Lye-neen-grahts-keey vahg-zhal?",
          english: "Where is Leningradsky train terminal?",
          context: "Confirming transport nodes in Moscow to travel north."
        },
        {
          russian: "Какой у вас вагон?",
          phonetic: "Kah-koy oo vahs vah-gohn?",
          english: "Which carriage count is yours?",
          context: "Matching boarding codes with platform staff."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 27,
    title: "Emergencies & Police Assistance (Полиция / 112)",
    alphabetSection: {
      letters: ["П", "Л", "Ц"],
      audioHint: "Emergency keys: П [p], Л [l], Ц [ts]"
    },
    vocabularySection: {
      words: [
        { russian: "Помощь", phonetic: "poh-moshch", english: "Help" },
        { russian: "Полиция", phonetic: "pah-lee-tsee-yah", english: "Police" },
        { russian: "Больница", phonetic: "bahl'-nee-tsah", english: "Hospital" },
        { russian: "Потерял", phonetic: "pah-tye-ryal", english: "Lost (masculine)" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Помогите! Я потерял паспорт.",
          phonetic: "Pah-mah-gee-tyeh! Ya pah-tye-ryal pahs-pahrt.",
          english: "Help! I lost my passport.",
          context: "Urgent report to embassy or transit officer."
        },
        {
          russian: "Где полиция?",
          phonetic: "Gde pah-lee-tsee-yah?",
          english: "Where is the police station?",
          context: "Locating city safety marshals."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 28,
    title: "Registering Your Student Card (Студенческий)",
    alphabetSection: {
      letters: ["С", "Т", "Д"],
      audioHint: "University credentials: С [s], Т [t], Д [d]"
    },
    vocabularySection: {
      words: [
        { russian: "Студенческий", phonetic: "stoo-dyen-chees-keey", english: "Student ID card" },
        { russian: "Пропуск", phonetic: "proh-poosk", english: "Campus security pass" },
        { russian: "Читательский", phonetic: "chee-tah-tyel'-skeey", english: "Library card" },
        { russian: "Кафедра", phonetic: "kah-fye-drah", english: "Academic department desk" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Вот мой студенческий билет.",
          phonetic: "Vot moy stoo-dyen-chees-keey bee-lyet.",
          english: "Here is my student card.",
          context: "Claiming library books or student tickets in museums."
        },
        {
          russian: "Мне нужно продлить пропуск.",
          phonetic: "Mnye noozh-nah prahd-leet' proh-poosk.",
          english: "I need to extend my campus pass expiration.",
          context: "Dealing with administration during semester registration."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 29,
    title: "Speaking to the Guard at the Dormitory Entrance",
    alphabetSection: {
      letters: ["В", "Х", "Д"],
      audioHint: "Security: В [v], Х [h], Д [d]"
    },
    vocabularySection: {
      words: [
        { russian: "Вахтер", phonetic: "vahh-tyor", english: "Dorm manager / Concierge" },
        { russian: "Охрана", phonetic: "ah-hrah-nah", english: "Security guard" },
        { russian: "Вход", phonetic: "fhoht", english: "Entrance" },
        { russian: "Номер", phonetic: "noh-myer", english: "Room number" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Я живу в комнате четыреста шесть.",
          phonetic: "Ya zhee-voo f kom-nah-tyeh chee-tih-ryes-tah shest'.",
          english: "I live in room four hundred and six.",
          context: "Stating your dorm coordinates on entry control check."
        },
        {
          russian: "Доброе утро, хорошего дня!",
          phonetic: "Doh-braye oo-trah, hah-roh-shee-vah dnyah!",
          english: "Good morning, have a nice day!",
          context: "Building friendly bonds with dorm security."
        }
      ]
    },
    totalMinutes: 15
  },
  {
    dayNumber: 30,
    title: "Traditional Russian Tea Party & Congratulations",
    alphabetSection: {
      letters: ["Ч", "А", "Й"],
      audioHint: "Festive: Ч [ch], А [ah], Й [short y]"
    },
    vocabularySection: {
      words: [
        { russian: "Праздник", phonetic: "prahz-neek", english: "Celebration / Festival" },
        { russian: "Чайник", phonetic: "chay-neek", english: "Teacup kettle" },
        { russian: "Конфеты", phonetic: "kahn-fye-tih", english: "Sweets / Candies" },
        { russian: "Успех", phonetic: "oos-pyeh", english: "Success" }
      ]
    },
    sentenceSection: {
      sentences: [
        {
          russian: "Поздравляю с успехом!",
          phonetic: "Pahz-drah-vlyah-yoo s oos-pyeh-ham!",
          english: "Congratulations on your success!",
          context: "Celebrating completion of your first 30 days of Russian study."
        },
        {
          russian: "Давайте пить чай!",
          phonetic: "Dah-vay-tyeh peet' chay!",
          english: "Let's drink some tea!",
          context: "Inviting friends to join the celebratory table style."
        }
      ]
    },
    totalMinutes: 15
  }
];
