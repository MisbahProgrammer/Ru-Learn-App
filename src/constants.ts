export const SCENARIOS = [
  {
    id: 'taxi',
    title: '🚕 Booking a Taxi',
    description: 'Practice ordering a taxi from the airport to your hotel.',
    icon: 'Car',
    culturalTip: 'In Russia, it is best to use apps like Yandex Go rather than calling a taxi on the street.',
    openingMessage: {
      russian: 'Здравствуйте! Такси заказывали? Куда едем?',
      phonetic: 'Zdra-STVOOY-teh! Tak-SEE za-KA-zih-va-li? Ku-DA YEH-dem?',
      english: 'Hello! Did you order a taxi? Where are we going?',
      suggestion: 'Try: Я хочу поехать в... (I want to go to...)'
    },
    hiddenInitPrompt: `The international student customer has just entered your cab. Start the conversation right now by introducing yourself as Maxim, greeting them warmly, and asking where they are going. Produce your opening taxi greeting in Russian with the translation in brackets.`,
    systemInstruction: `You are Maxim (Максим), a professional Moscow taxi driver picking up an international student from Sheremetyevo Airport (SVO).

LANGUAGE RULES — MOST IMPORTANT:
- ALWAYS reply in Russian (Cyrillic)
- After EVERY sentence add English translation in brackets on same line
- Format: 
  Привет! (Hello!)
  Куда едем? (Where are we going?)
- User can write in English or Russian
- You always reply Russian + English translation
- NEVER reply in English only

CHARACTER:
- Friendly, patient Moscow taxi driver
- You know all Moscow universities and areas
- You deal with international students daily
- Name is Maxim

PRICING:
- Airport to any Moscow university: 800-1200 rubles
- Depends on exact location and traffic
- Always give price range when asked
- Always give travel time estimate
- User will negotiate — allow max 10-15% discount
- Never go below 800 rubles

NEGOTIATION:
If user asks for lower price:
Для студента могу сделать 850 рублей.
(For a student I can do 850 rubles.)
Это мой минимум. (This is my minimum.)

RESPONSE RULES:
- Maximum 3-4 sentences per reply
- ALWAYS complete your sentences — never cut off
- ALWAYS give price when destination mentioned
- NEVER say just 2-3 words like "А, ВШЭ"
- NEVER say "Отлично" without full response
- Every reply must be helpful and complete

FOR ANY UNIVERSITY USER MENTIONS:
Confirm you know it + give area + give price + time
Example for HSE:
ВШЭ находится в центре Москвы.
(HSE is located in central Moscow.)
От аэропорта около 900 рублей и 40 минут.
(From airport around 900 rubles and 40 minutes.)
Едем? (Shall we go?)

FOR UNKNOWN UNIVERSITY:
Знаю этот университет.
(I know this university.)
Скажите точный адрес.
(Tell me the exact address.)
Примерно 800-1200 рублей от аэропорта.
(Approximately 800-1200 rubles from airport.)

NEVER DO:
- Never give 1-2 word replies
- Never ignore price question
- Never go off topic
- Never break character
- Never cut sentence in middle

SCENARIO END:
When user says goodbye or arrived:
Пожалуйста, удачи в России!
(You are welcome, good luck in Russia!)
[SCENARIO_COMPLETE]`
  },
  {
    id: 'airport',
    title: '✈️ Airport Arrival',
    description: 'Clear customs and immigration at Moscow Sheremetyevo Airport.',
    icon: 'Plane',
    culturalTip: 'Always keep your migration card printed and inside your passport, you receive it at border control.',
    openingMessage: {
      russian: 'Добро пожаловать в Шереметьево! Паспорт и визу, пожалуйста.',
      phonetic: 'Dab-RO pa-ZHA-la-vat v She-re-MET-ye-va!',
      english: 'Welcome to Sheremetyevo! Passport and visa please.',
      suggestion: 'Try: Вот мой паспорт (Here is my passport)'
    },
    hiddenInitPrompt: `The international student just approached your passport control desk. Start the scenario. Ask for their passport and visa. Reply in Russian with English translation in brackets.`,
    systemInstruction: `You are a passport control officer at Sheremetyevo Airport in Moscow.

The passenger is an international student arriving in Russia for the very first time on a government scholarship.

YOUR CHARACTER:
- Professional, official, serious, yet helpful and encouraging to new students.
- You speak Russian but understand English.

LANGUAGE RULES — VERY IMPORTANT:
- You ALWAYS reply in Russian (Cyrillic script)
- Every message you send MUST have English translation in brackets after each sentence
- Format example:
  Здравствуйте. Ваш паспорт и виза, пожалуйста.
  (Hello. Your passport and visa, please.)
- User can reply in English OR Russian
- If user replies in English, you still reply in Russian with English translation
- Never reply in English only — always Russian first

STRICT RULES — NEVER BREAK:
1. NEVER discuss politics, news, or world events
2. NEVER act as general AI assistant
3. ALWAYS include English translation in every message
4. ALWAYS stay as a passport control officer
5. Keep replies SHORT — maximum 4 sentences
6. If asked something off topic, redirect back to passport check:
   Интересный вопрос! Но мне нужно проверить ваши документы.
   (Interesting question! But I need to check your documents.)
7. NEVER break character for any reason
8. Keep temperature low to stay focused and consistent

FLOW STAGES:
Stage 1: Ask for passport and visa.
Stage 2: Ask for purpose of visit (it should be university/scholarship study).
Stage 3: Ask duration of stay or university name (HSE, RUDN, etc).
Stage 4: Stamp passport and welcome them to Russia.
Stage 5: Wish good luck with studies and say goodbye.

SCENARIO COMPLETE:
When Stage 5 is complete (after you stamp and welcome them, e.g., "Welcome to Russia!" / "Добро пожаловать в Россию!"):
Provide a warm professional farewell with English translation in brackets.
Then add [SCENARIO_COMPLETE] at the very end.`
  },
  {
    id: 'dormitory',
    title: '🏢 Dormitory Check-In',
    description: 'Manage campus student dormitory check-in with the security or receptionist.',
    icon: 'Hotel',
    culturalTip: 'Always have your passport, visa, and health certificate ready for dormitory check-in.',
    openingMessage: {
      russian: 'Здравствуйте! Вы забронировали номер? Ваша фамилия?',
      phonetic: 'Zdra-STVOOY-teh! Vih za-bra-NEE-ra-va-li NO-mer?',
      english: 'Hello! Do you have a reservation? Your last name?',
      suggestion: 'Try: Да, моя фамилия... (Yes, my name is...)'
    },
    hiddenInitPrompt: `The international student just walked up to the dormitory check-in desk. Start the scenario. Greet the student dynamically and ask for their last name/reservation. Reply in Russian with English translation in brackets.`,
    systemInstruction: `You are a public university dormitory administrator (комендант общежития) in Moscow.

The student is an international student arriving at the dormitory for the first time in Russia on a government scholarship.

YOUR CHARACTER:
- Friendly, energetic, organized, administrative but reassuring.
- You speak Russian but understand English.

LANGUAGE RULES — VERY IMPORTANT:
- You ALWAYS reply in Russian (Cyrillic script)
- Every message you send MUST have English translation in brackets after each sentence
- Format example:
  Здравствуйте! Как ваша фамилия?
  (Hello! What is your last name?)
- User can reply in English OR Russian
- If user replies in English, you still reply in Russian with English translation
- Never reply in English only — always Russian first

STRICT RULES — NEVER BREAK:
1. NEVER discuss politics, news, or world events
2. NEVER act as general AI assistant
3. ALWAYS include English translation in every message
4. ALWAYS stay as the dormitory administrator
5. Keep replies SHORT — maximum 4 sentences
6. If asked something off topic, redirect back to check-in:
   Интересный вопрос! Но нам нужно оформить ваше заселение.
   (Interesting question! But we need to register your check-in.)
7. NEVER break character for any reason
8. Keep temperature low to stay focused and consistent

FLOW STAGES:
Stage 1: Ask for their last name and reservation / booking.
Stage 2: Ask for passports, visa, and university registration papers.
Stage 3: Give them their room number and room keys.
Stage 4: Explain basic rules of the dorm (quiet hours after 23:00, no outdoor shoes in room, visitor policy).
Stage 5: Welcome them and wish them luck with their first semester of studies.

SCENARIO COMPLETE:
When Stage 5 is complete (keys given, welcomed to dorm):
Provide a warm Russian farewell with English translation in brackets.
Then add [SCENARIO_COMPLETE] at the very end.`
  },
  {
    id: 'restaurant',
    title: '🍴 Restaurant Dining',
    description: 'Order authentic Borsch or Pelmeni at a local Russian restaurant.',
    icon: 'Utensils',
    culturalTip: 'Tipping is around 10% in Russia, and you can tip through digital QR codes on the receipt.',
    openingMessage: {
      russian: 'Добрый день! Столик на одного? Вот меню.',
      phonetic: 'DOB-riy den! STO-lik na ad-na-VO?',
      english: 'Good afternoon! Table for one? Here is the menu.',
      suggestion: 'Try: Что вы рекомендуете? (What do you recommend?)'
    },
    hiddenInitPrompt: `The international student customer just walked in and sat down at a table. Start the scenario. Greet the customer professionally, confirm table for one, and offer them the menu. Reply in Russian with English translation in brackets.`,
    systemInstruction: `You are a waiter (официант) at a local Russian restaurant in Moscow.

The customer is an international student wanting to taste authentic Russian food (like Borsch, Pelmeni, or Bliny).

YOUR CHARACTER:
- Polite, professional, helpful, service-oriented, friendly.
- You speak Russian but understand English.

LANGUAGE RULES — VERY IMPORTANT:
- You ALWAYS reply in Russian (Cyrillic script)
- Every message you send MUST have English translation in brackets after each sentence
- Format example:
  Добрый день! Вот меню, пожалуйста.
  (Good afternoon! Here is the menu, please.)
- User can reply in English OR Russian
- If user replies in English, you still reply in Russian with English translation
- Never reply in English only — always Russian first

STRICT RULES — NEVER BREAK:
1. NEVER discuss politics, news, or world events
2. NEVER act as general AI assistant
3. ALWAYS include English translation in every message
4. ALWAYS stay as the restaurant waiter
5. Keep replies SHORT — maximum 4 sentences
6. If asked something off topic, redirect back to ordering:
   Интересный вопрос! Но давайте я приму ваш заказ.
   (Interesting question! But let me take your order.)
7. NEVER break character for any reason
8. Keep temperature low to stay focused and consistent

FLOW STAGES:
Stage 1: Greet and confirm table for one, offer them the menu.
Stage 2: Recommend authentic Russian dishes (Borsch, Pelmeni, Bliny, compote or tea). Ask for their order.
Stage 3: Virtually serve the ordered food and ask how they like it.
Stage 4: Bring the bill, explain that tipping (~10%) can be done digitally or cash.
Stage 5: Process payment, thank them warmly, wish a nice day, and say goodbye.

SCENARIO COMPLETE:
When checkout and final farewell is done:
Provide a friendly Russian restaurant farewell with English translation in brackets.
Then add [SCENARIO_COMPLETE] at the very end.`
  }
];

export const CITY_IMAGES = [
  {
    name: 'Moscow',
    url: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&q=80&w=1000',
    description: 'St. Basil\'s Cathedral, Red Square'
  },
  {
    name: 'Saint Petersburg',
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=1000',
    description: 'Church of the Savior on Spilled Blood'
  },
  {
    name: 'Kazan',
    url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=1000',
    description: 'Kazan Kremlin'
  }
];

export const ALPHABET = [
  { letter: 'А', sound: 'a', example: 'Анна', transcription: 'Anna' },
  { letter: 'Б', sound: 'b', example: 'Борис', transcription: 'Boris' },
  { letter: 'В', sound: 'v', example: 'Виктор', transcription: 'Viktor' },
  { letter: 'Г', sound: 'g', example: 'Город', transcription: 'Gorod' },
  { letter: 'Д', sound: 'd', example: 'Да', transcription: 'Da' },
  { letter: 'Е', sound: 'ye', example: 'Елена', transcription: 'Yelena' },
  { letter: 'Ё', sound: 'yo', example: 'Ёлка', transcription: 'Yolka' },
  { letter: 'Ж', sound: 'zh', example: 'Жизнь', transcription: 'Zhizn' },
  { letter: 'З', sound: 'z', example: 'Зебра', transcription: 'Zebra' },
  { letter: 'И', sound: 'i', example: 'Иван', transcription: 'Ivan' },
  { letter: 'Й', sound: 'j', example: 'Йога', transcription: 'Yoga' },
  { letter: 'К', sound: 'k', example: 'Кот', transcription: 'Kot' },
  { letter: 'Л', sound: 'l', example: 'Лампа', transcription: 'Lampa' },
  { letter: 'М', sound: 'm', example: 'Мама', transcription: 'Mama' },
  { letter: 'Н', sound: 'n', example: 'Нет', transcription: 'Net' },
  { letter: 'О', sound: 'o', example: 'Окно', transcription: 'Okno' },
  { letter: 'П', sound: 'p', example: 'Папа', transcription: 'Papa' },
  { letter: 'Р', sound: 'r', example: 'Россия', transcription: 'Rossiya' },
  { letter: 'С', sound: 's', example: 'СССР', transcription: 'SSSR' },
  { letter: 'Т', sound: 't', example: 'Торт', transcription: 'Tort' },
  { letter: 'У', sound: 'u', example: 'Утро', transcription: 'Utro' },
  { letter: 'Ф', sound: 'f', example: 'Флаг', transcription: 'Flag' },
  { letter: 'Х', sound: 'kh', example: 'Хлеб', transcription: 'Khleb' },
  { letter: 'Ц', sound: 'ts', example: 'Царь', transcription: 'Tsar' },
  { letter: 'Ч', sound: 'ch', example: 'Чай', transcription: 'Chay' },
  { letter: 'Ш', sound: 'sh', example: 'Школа', transcription: 'Shkola' },
  { letter: 'Щ', sound: 'shch', example: 'Щи', transcription: 'Shchi' },
  { letter: 'Ъ', sound: 'hard sign', example: 'Объект', transcription: 'Ob\'yekt' },
  { letter: 'Ы', sound: 'y', example: 'Мы', transcription: 'My' },
  { letter: 'Ь', sound: 'soft sign', example: 'День', transcription: 'Den\'' },
  { letter: 'Э', sound: 'e', example: 'Эхо', transcription: 'Ekho' },
  { letter: 'Ю', sound: 'yu', example: 'Юмор', transcription: 'Yumor' },
  { letter: 'Я', sound: 'ya', example: 'Яблоко', transcription: 'Yabloko' }
];

export const VOCABULARY = [
  {
    category: 'Fruits (Фрукты)',
    items: [
      { ru: 'Яблоко', en: 'Apple', pr: 'Yabloko' },
      { ru: 'Банан', en: 'Banana', pr: 'Banan' },
      { ru: 'Апельсин', en: 'Orange', pr: 'Apel\'sin' },
      { ru: 'Виноград', en: 'Grapes', pr: 'Vinograd' },
      { ru: 'Клубника', en: 'Strawberry', pr: 'Klubnika' }
    ]
  },
  {
    category: 'Vegetables (Овощи)',
    items: [
      { ru: 'Картофель', en: 'Potato', pr: 'Kartofel\'' },
      { ru: 'Морковь', en: 'Carrot', pr: 'Morkov\'' },
      { ru: 'Огурец', en: 'Cucumber', pr: 'Ogurets' },
      { ru: 'Помидор', en: 'Tomato', pr: 'Pomidor' },
      { ru: 'Лук', en: 'Onion', pr: 'Luk' }
    ]
  },
  {
    category: 'Transport (Транспорт)',
    items: [
      { ru: 'Велосипед', en: 'Bicycle', pr: 'vi-li-sa-pyét' },
      { ru: 'Метро', en: 'Metro / Subway', pr: 'mi-tró' },
      { ru: 'Мотоцикл', en: 'Motorcycle', pr: 'ma-ta-tsí-kl' },
      { ru: 'Поезд', en: 'Train', pr: 'pó-yezd' },
      { ru: 'Трамвай', en: 'Tram', pr: 'tram-váy' },
      { ru: 'Троллейбус', en: 'Trolleybus', pr: 'tra-lyéy-bus' },
      { ru: 'Электричка', en: 'Suburban train', pr: 'elek-trích-ka' },
      { ru: 'Маршрутка', en: 'Minibus', pr: 'mar-shrút-ka' },
      { ru: 'Самокат', en: 'Scooter', pr: 'sa-ma-kát' },
      { ru: 'Такси', en: 'Taxi', pr: 'tak-sí' },
      { ru: 'Автобус', en: 'Bus', pr: 'Avtobus' },
      { ru: 'Самолёт', en: 'Airplane', pr: 'Samolyot' }
    ]
  },
  {
    category: 'Directions (Направления)',
    items: [
      { ru: 'Налево', en: 'To the left', pr: 'Nalevo' },
      { ru: 'Направо', en: 'To the right', pr: 'Napravo' },
      { ru: 'Прямо', en: 'Straight', pr: 'Pryamo' },
      { ru: 'Здесь', en: 'Here', pr: 'Zdes\'' },
      { ru: 'Там', en: 'There', pr: 'Tam' }
    ]
  },
  {
    category: 'Counting (Числа)',
    items: [
      { ru: 'Один', en: 'One', pr: 'Odin' },
      { ru: 'Два', en: 'Two', pr: 'Dva' },
      { ru: 'Три', en: 'Three', pr: 'Tri' },
      { ru: 'Четыре', en: 'Four', pr: 'Chetyre' },
      { ru: 'Пять', en: 'Five', pr: 'Pyat\'' }
    ]
  },
  {
    category: 'Student Items (Предметы студента)',
    items: [
      { ru: 'Книга', en: 'Book', pr: 'Kniga' },
      { ru: 'Ручка', en: 'Pen', pr: 'Ruchka' },
      { ru: 'Тетрадь', en: 'Notebook', pr: 'Tetrad\'' },
      { ru: 'Словарь', en: 'Dictionary', pr: 'Slovar\'' },
      { ru: 'Рюкзак', en: 'Backpack', pr: 'Ryukzak' }
    ]
  },
  {
    category: 'Cooking Essentials (Кухонные принадлежности)',
    items: [
      { ru: 'Нож', en: 'Knife', pr: 'Nozh' },
      { ru: 'Ложка', en: 'Spoon', pr: 'Lozhka' },
      { ru: 'Вилка', en: 'Fork', pr: 'Vilka' },
      { ru: 'Тарелка', en: 'Plate', pr: 'Tarelka' },
      { ru: 'Кастрюля', en: 'Pot', pr: 'Kastryulya' }
    ]
  },
  {
    category: 'Places (Места)',
    items: [
      { ru: 'Вокзал', en: 'Railway station', pr: 'Vak-zal' },
      { ru: 'Музей', en: 'Museum', pr: 'Mu-zey' },
      { ru: 'Аэропорт', en: 'Airport', pr: 'A-ya-ra-port' },
      { ru: 'Завод', en: 'Factory', pr: 'Za-vot' },
      { ru: 'Поликлиника', en: 'Clinic', pr: 'Pa-li-kli-ni-ka' },
      { ru: 'Посольство', en: 'Embassy', pr: 'Pa-sol-stva' },
      { ru: 'Аудитория', en: 'Lecture room', pr: 'Au-di-to-ri-ya' },
      { ru: 'Офис', en: 'Office', pr: 'O-fis' },
      { ru: 'Банк', en: 'Bank', pr: 'Bank' },
      { ru: 'Аптека', en: 'Pharmacy', pr: 'Ap-tye-ka' },
      { ru: 'Школа', en: 'School', pr: 'Shko-la' },
      { ru: 'Почта', en: 'Post office', pr: 'Poch-ta' },
      { ru: 'Церковь', en: 'Church', pr: 'Tser-kaf' },
      { ru: 'Рынок', en: 'Market', pr: 'rý-nak' },
      { ru: 'Санаторий', en: 'Sanatorium / Resort', pr: 'Sa-na-to-riy' },
      { ru: 'Деревня', en: 'Village', pr: 'di-rév-nya' },
      { ru: 'Цирк', en: 'Circus', pr: 'tsirk' },
      { ru: 'Кафе', en: 'Café', pr: 'ka-fé' }
    ]
  },
  {
    category: 'People & professions (Люди и профессии)',
    items: [
      { ru: 'Пациент', en: 'Patient', pr: 'Pa-tsi-yent' },
      { ru: 'Врач', en: 'Doctor', pr: 'Vrach' },
      { ru: 'Медсестра', en: 'Nurse', pr: 'Myed-sis-tra' },
      { ru: 'Менеджер', en: 'Manager', pr: 'Mye-ne-dzher' },
      { ru: 'Студент', en: 'Student', pr: 'Stu-dyent' },
      { ru: 'Космонавт', en: 'Astronaut', pr: 'Kas-ma-naft' },
      { ru: 'Спортсмен', en: 'Athlete', pr: 'Spart-smen' },
      { ru: 'Певец', en: 'Singer (male)', pr: 'Pye-vyets' },
      { ru: 'Певица', en: 'Singer (female)', pr: 'Pye-vi-tsa' },
      { ru: 'Композитор', en: 'Composer', pr: 'Kam-pa-zi-tar' },
      { ru: 'Музыкант', en: 'Musician', pr: 'Mu-zi-kant' },
      { ru: 'Журналист', en: 'Journalist', pr: 'Zhur-na-list' },
      { ru: 'Водитель', en: 'Driver', pr: 'Va-di-tyel' },
      { ru: 'Таксист', en: 'Taxi driver', pr: 'Tak-sist' },
      { ru: 'Шофёр', en: 'Chauffeur', pr: 'Sha-fyor' },
      { ru: 'Экскурсовод', en: 'Tour Guide', pr: 'Eks-kur-sa-vot' }
    ]
  },
  {
    category: 'Essential Verbs (Глаголы)',
    items: [
      { ru: 'Идти', en: 'To go (on foot)', pr: 'id-tí' },
      { ru: 'Ехать', en: 'To go (by transport)', pr: 'yé-khat' },
      { ru: 'Опаздывать', en: 'To be late', pr: 'A-paz-di-vat' },
      { ru: 'Спешить', en: 'To hurry', pr: 'Spi-shit' },
      { ru: 'Учить', en: 'To study', pr: 'U-chit' },
      { ru: 'Читать', en: 'To read', pr: 'Chi-tat' },
      { ru: 'Переводить', en: 'To translate', pr: 'Pi-ri-va-dit' },
      { ru: 'Слушать', en: 'To listen', pr: 'Slu-shat' },
      { ru: 'Писать', en: 'To write', pr: 'Pi-sat' },
      { ru: 'Уметь', en: 'To be able / can', pr: 'U-myet' },
      { ru: 'Знать', en: 'To know', pr: 'Znat' },
      { ru: 'Брать', en: 'To take', pr: 'Brat' },
      { ru: 'Взять', en: 'To take (completed)', pr: 'Vzyat' },
      { ru: 'Искать', en: 'To search / find', pr: 'Is-kat' },
      { ru: 'Найти', en: 'To find (completed)', pr: 'Nay-ti' },
      { ru: 'Отдыхать', en: 'To rest', pr: 'At-da-khat' },
      { ru: 'Покупать', en: 'To buy', pr: 'Pa-ku-pat' },
      { ru: 'Купить', en: 'To buy (completed)', pr: 'Ku-pit' },
      { ru: 'Спрашивать', en: 'To ask', pr: 'Spra-shi-vat' },
      { ru: 'Спросить', en: 'To ask (completed)', pr: 'Spra-sit' },
      { ru: 'Просить', en: 'To request / ask for', pr: 'Pra-sit' },
      { ru: 'Попросить', en: 'To request (completed)', pr: 'Pa-pra-sit' },
      { ru: 'Отвечать', en: 'To answer', pr: 'At-vye-chat' },
      { ru: 'Ответить', en: 'To answer (completed)', pr: 'At-vye-tit' },
      { ru: 'Гулять', en: 'To walk', pr: 'Gu-lyat' },
      { ru: 'Погулять', en: 'To walk (completed)', pr: 'Pa-gu-lyat' },
      { ru: 'Приносить', en: 'To bring', pr: 'Pri-na-sit' },
      { ru: 'Принести', en: 'To bring (completed)', pr: 'Pri-ni-sti' },
      { ru: 'Готовить', en: 'To cook', pr: 'Ga-to-vit' },
      { ru: 'Приготовить', en: 'To cook (completed)', pr: 'Pri-ga-to-vit' },
      { ru: 'Рисовать', en: 'To draw', pr: 'Ri-sa-vat' },
      { ru: 'Нарисовать', en: 'To draw (completed)', pr: 'Na-ri-sa-vat' },
      { ru: 'Планировать', en: 'To plan', pr: 'Pla-ni-ra-vat' },
      { ru: 'Танцевать', en: 'To dance', pr: 'Tan-tse-vat' },
      { ru: 'Путешествовать', en: 'To travel', pr: 'Pu-tye-shest-va-vat' },
      { ru: 'Фотографировать', en: 'To photograph', pr: 'Fa-ta-gra-fi-ravat' },
      { ru: 'Убирать', en: 'To clean', pr: 'U-bi-rat' },
      { ru: 'Убрать', en: 'To clean (completed)', pr: 'Ub-rat' },
      { ru: 'Приглашать', en: 'To invite', pr: 'Pri-gla-shat' },
      { ru: 'Изменять', en: 'To change', pr: 'Iz-mi-nyat' },
      { ru: 'Вставать', en: 'To get up', pr: 'Fsta-vat' },
      { ru: 'Плавать', en: 'To swim', pr: 'Pla-vat' },
      { ru: 'Завтракать', en: 'To have breakfast', pr: 'Zav-tra-kat' },
      { ru: 'Начинать', en: 'To begin', pr: 'Na-chi-nat' },
      { ru: 'Выступать', en: 'To perform', pr: 'Vus-tu-pat' },
      { ru: 'Петь', en: 'To sing', pr: 'Pyet' },
      { ru: 'Узнать', en: 'To find out', pr: 'Uz-nat' }
    ]
  },
  {
    category: 'Dining & Foods (Еда и Ресторан)',
    items: [
      { ru: 'Атмосфера', en: 'Atmosphere', pr: 'At-mas-fye-ra' },
      { ru: 'Деловая встреча', en: 'Business meeting', pr: 'Di-la-va-ya fstre-cha' },
      { ru: 'Меню', en: 'Menu', pr: 'Mi-nyu' },
      { ru: 'Салат', en: 'Salad', pr: 'Sa-lat' },
      { ru: 'Десерт', en: 'Dessert', pr: 'Di-syert' },
      { ru: 'Счёт', en: 'Bill / check', pr: 'Shyot' },
      { ru: 'Курица', en: 'Chicken', pr: 'Ku-ri-tsa' },
      { ru: 'Мясо', en: 'Meat', pr: 'Mya-so' },
      { ru: 'Стейк', en: 'Steak', pr: 'Steyk' },
      { ru: 'Шаурма', en: 'Shawarma', pr: 'Sha-ur-ma' },
      { ru: 'Шашлык', en: 'Kebab', pr: 'Sha-shlyk' },
      { ru: 'Борщ', en: 'Borscht', pr: 'Borsh' },
      { ru: 'Блины', en: 'Pancakes', pr: 'Bli-ny' },
      { ru: 'Еда', en: 'Meal / Food', pr: 'Ye-da' },
      { ru: 'Вода', en: 'Water', pr: 'Va-da' },
      { ru: 'Чашка', en: 'Cup', pr: 'Chash-ka' }
    ]
  },
  {
    category: 'Everyday Words (Повседневные слова)',
    items: [
      { ru: 'Стих', en: 'Poem / verse', pr: 'Steekh' },
      { ru: 'Свободное время', en: 'Free time', pr: 'Sva-bod-na-ye vrye-mya' },
      { ru: 'Алфавит', en: 'Alphabet', pr: 'Al-fa-vit' },
      { ru: 'Бассейн', en: 'Pool', pr: 'Bas-seyn' },
      { ru: 'Лекарство', en: 'Medicine', pr: 'Lye-kar-stva' },
      { ru: 'Путёвка', en: 'Trip voucher', pr: 'Pu-tyof-ka' },
      { ru: 'Администратор', en: 'Administrator', pr: 'Ad-mi-nis-tra-tar' },
      { ru: 'Ремонт', en: 'Repair', pr: 'ri-mónt' },
      { ru: 'Праздник', en: 'Celebration / holiday', pr: 'práz-dnik' },
      { ru: 'Дождь', en: 'Rain', pr: 'dosht' },
      { ru: 'Снег', en: 'Snow', pr: 'snyek' },
      { ru: 'Массажный кабинет', en: 'Massage room', pr: 'Ma-sazh-niy ka-bi-nyet' },
      { ru: 'Правда', en: 'Truth', pr: 'Prav-da' },
      { ru: 'Тренировка', en: 'Training', pr: 'Tre-ni-rof-ka' },
      { ru: 'Спектакль', en: 'Performance', pr: 'Spek-takal' },
      { ru: 'Экзамен', en: 'Exam', pr: 'Ek-za-men' },
      { ru: 'Урок', en: 'Lesson', pr: 'U-rok' },
      { ru: 'Выставка', en: 'Exhibition', pr: 'Vy-staf-ka' },
      { ru: 'Хоккей', en: 'Hockey', pr: 'Kha-key' },
      { ru: 'Искусство', en: 'Art', pr: 'Is-kus-stva' },
      { ru: 'Духи', en: 'Perfume', pr: 'Du-khi' },
      { ru: 'Парфюм', en: 'Perfume', pr: 'Par-fyum' },
      { ru: 'Памятник', en: 'Monument', pr: 'Pa-myit-nik' },
      { ru: 'Журнал', en: 'Magazine', pr: 'Zhur-nal' },
      { ru: 'Статья', en: 'Article', pr: 'Sta-tya' },
      { ru: 'Страница', en: 'Page', pr: 'Stra-ni-tsa' },
      { ru: 'Киоск', en: 'Kiosk', pr: 'Ki-osk' },
      { ru: 'Природа', en: 'Nature', pr: 'Pri-ro-da' },
      { ru: 'Выходной', en: 'Day off / weekend', pr: 'Vy-khad-noy' },
      { ru: 'Расписание', en: 'Schedule', pr: 'Ras-pi-sa-ni-ye' },
      { ru: 'Погода', en: 'Weather', pr: 'Pa-go-da' },
      { ru: 'Одежда', en: 'Clothes', pr: 'A-dyezh-da' },
      { ru: 'Отзыв', en: 'Review / comment', pr: 'At-zyv' },
      { ru: 'Гимнастика', en: 'Gymnastics', pr: 'Gim-nas-ti-ka' },
      { ru: 'Вещь', en: 'Thing', pr: 'Vyesh' },
      { ru: 'Голова', en: 'Head', pr: 'Ga-la-va' },
      { ru: 'Дерево', en: 'Tree', pr: 'Dye-ree-va' },
      { ru: 'Красота', en: 'Beauty', pr: 'Kra-sa-ta' },
      { ru: 'Спасибо', en: 'Thank you', pr: 'Spa-see-ba' },
      { ru: 'Небо', en: 'Sky', pr: 'Nye-ba' },
      { ru: 'Рыба', en: 'Fish', pr: 'Ry-ba' },
      { ru: 'Ночь', en: 'Night', pr: 'Noch' },
      { ru: 'День', en: 'Day', pr: 'Dyen' },
      { ru: 'Утро', en: 'Morning', pr: 'Ut-ra' },
      { ru: 'Вечер', en: 'Evening', pr: 'Vye-chyer' },
      { ru: 'Неделя', en: 'Week', pr: 'Nee-dye-lya' }
    ]
  },
  {
    category: 'Numbers 21-100 (Числа 21-100)',
    items: [
      { ru: 'Двадцать', en: '20', pr: 'Dva-tsat' },
      { ru: 'Тридцать', en: '30', pr: 'Trid-tsat' },
      { ru: 'Сорок', en: '40', pr: 'So-rak' },
      { ru: 'Пятьдесят', en: '50', pr: 'Pyit-di-syat' },
      { ru: 'Шестьдесят', en: '60', pr: 'Shest-di-syat' },
      { ru: 'Семьдесят', en: '70', pr: 'Syem-di-syat' },
      { ru: 'Восемьдесят', en: '80', pr: 'Vo-syem-di-syat' },
      { ru: 'Девяносто', en: '90', pr: 'Di-vya-nos-ta' },
      { ru: 'Сто', en: '100', pr: 'Sto' }
    ]
  },
  {
    category: 'Adjectives & Colors (Прилагательные и цвета)',
    items: [
      { ru: 'Серьёзный', en: 'Serious', pr: 'Sir-yoz-niy' },
      { ru: 'Лёгкий', en: 'Easy / light', pr: 'Lyog-kiy' },
      { ru: 'Талантливый', en: 'Talented', pr: 'Ta-lant-li-viy' },
      { ru: 'Старший', en: 'Older', pr: 'Star-shiy' },
      { ru: 'Младший', en: 'Younger', pr: 'Mlad-shiy' },
      { ru: 'Российский', en: 'Russian', pr: 'Ras-siy-skiy' },
      { ru: 'Белый', en: 'White', pr: 'Bye-liy' },
      { ru: 'Чёрный', en: 'Black', pr: 'Chyor-niy' },
      { ru: 'Красный', en: 'Red', pr: 'Kras-niy' },
      { ru: 'Синий', en: 'Dark blue', pr: 'Si-niy' },
      { ru: 'Голубой', en: 'Light blue', pr: 'Ga-lu-boy' },
      { ru: 'Зелёный', en: 'Green', pr: 'Zi-lyo-niy' },
      { ru: 'Жёлтый', en: 'Yellow', pr: 'Zhol-tiy' },
      { ru: 'Серый', en: 'Grey', pr: 'Sye-riy' },
      { ru: 'Оранжевый', en: 'Orange', pr: 'A-ran-zhe-viy' },
      { ru: 'Сильный', en: 'Strong', pr: 'Sil-niy' },
      { ru: 'Глупый', en: 'Stupid', pr: 'Glu-piy' },
      { ru: 'Молодой', en: 'Young', pr: 'Ma-la-doy' },
      { ru: 'Любимый', en: 'Favorite', pr: 'Lu-bi-miy' },
      { ru: 'Другой', en: 'Another', pr: 'Dru-goy' },
      { ru: 'Следующий', en: 'Next', pr: 'Slye-du-yu-shiy' }
    ]
  },
  {
    category: 'Expressions & Questions (Выражения и вопросы)',
    items: [
      { ru: 'Сначала', en: 'First', pr: 'Sna-cha-la' },
      { ru: 'Когда', en: 'When', pr: 'Kag-da' },
      { ru: 'Если', en: 'If', pr: 'Yes-li' },
      { ru: 'Например', en: 'For example', pr: 'Na-pri-myer' },
      { ru: 'Обязательно', en: 'Surely', pr: 'A-bya-za-tyil-na' },
      { ru: 'Куда', en: 'Where to', pr: 'Ku-da' },
      { ru: 'Где', en: 'Where', pr: 'Gdye' },
      { ru: 'Сюда', en: 'Here', pr: 'Su-da' },
      { ru: 'Туда', en: 'There', pr: 'Tu-da' },
      { ru: 'Домой', en: 'Home / homeward', pr: 'Da-moy' },
      { ru: 'Завтра', en: 'Tomorrow', pr: 'Zaf-tra' },
      { ru: 'Рано', en: 'Early', pr: 'Ra-na' },
      { ru: 'Поздно', en: 'Late', pr: 'Poz-dna' },
      { ru: 'Быстро', en: 'Quickly', pr: 'Bys-tra' },
      { ru: 'Медленно', en: 'Slowly', pr: 'Myed-lin-na' },
      { ru: 'Рядом', en: 'Nearby', pr: 'Rya-dam' },
      { ru: 'Близко', en: 'Near', pr: 'Bliz-ka' },
      { ru: 'Далеко', en: 'Far', pr: 'Da-li-ko' },
      { ru: 'Недалеко', en: 'Not far', pr: 'ni-da-li-kó' },
      { ru: 'Пешком', en: 'On foot', pr: 'pi-shkóm' },
      { ru: 'На чём?', en: 'By what transport?', pr: 'na chyóm' },
      { ru: 'Вчера', en: 'Yesterday', pr: 'fche-rá' },
      { ru: 'Сегодня', en: 'Today', pr: 'si-vód-nya' },
      { ru: 'Везде', en: 'Everywhere', pr: 'Viz-dye' },
      { ru: 'Только', en: 'Only', pr: 'Tol-ka' },
      { ru: 'Ерунда', en: 'Nonsense', pr: 'Yi-run-da' },
      { ru: 'Можно', en: 'Can / allowed', pr: 'Mozh-na' },
      { ru: 'Нужно', en: 'Need to', pr: 'Nuzh-na / Na-da' },
      { ru: 'Нельзя', en: 'Not allowed', pr: 'Nel-zya' },
      { ru: 'Приятно познакомиться', en: 'Nice to meet you', pr: 'Pri-yat-na paz-na-ko-mit-sa' },
      { ru: 'Очень приятно', en: 'Very nice', pr: 'O-chen pri-yat-na' }
    ]
  }
];

export const PHRASES = [
  { ru: 'Как дела?', en: 'How are you?', pr: 'Kak dela?' },
  { ru: 'Меня зовут...', en: 'My name is...', pr: 'Menya zovut...' },
  { ru: 'Сколько это стоит?', en: 'How much does it cost?', pr: 'Skol\'ko eto stoit?' },
  { ru: 'Где метро?', en: 'Where is the metro?', pr: 'Gde metro?' },
  { ru: 'Я не понимаю', en: 'I don\'t understand', pr: 'Ya ne ponimayu' },
  { ru: 'Вы говорите по-английски?', en: 'Do you speak English?', pr: 'Vy govorite po-angliyski?' },
  { ru: 'Повторите, пожалуйста', en: 'Repeat, please', pr: 'Povtorite, pozhaluysta' },
  // Lesson 28 Useful Phrases
  { ru: 'Я еду на велосипеде.', en: 'I am going by bicycle.', pr: 'Ya yedu na velosipede.' },
  { ru: 'Я люблю идти пешком.', en: 'I like to walk on foot.', pr: 'Ya lyublyu idti peshkom.' },
  { ru: 'Мы едем на метро.', en: 'We are going by metro.', pr: 'My yedem na metro.' },
  { ru: 'Сегодня идёт дождь.', en: 'It is raining today.', pr: 'Segodnya idyot dozhd\'.' },
  { ru: 'Вчера шёл дождь.', en: 'It rained yesterday.', pr: 'Vchera shol dozhd\'.' },
  { ru: 'Я еду в аэропорт на такси.', en: 'I am going to the airport by taxi.', pr: 'Ya yedu v aeroport na taksi.' },
  { ru: 'Мы едем в Санкт-Петербург на поезде.', en: 'We are going to Saint Petersburg by train.', pr: 'My yedem v Sankt-Peterburg na poyezde.' },

  // Lesson 27 Useful Phrases
  { ru: 'Я иду в университет.', en: 'I am going to the university.', pr: 'Ya idu v universitet.' },
  { ru: 'Я еду в аэропорт.', en: 'I am going to the airport.', pr: 'Ya yedu v aeroport.' },
  { ru: 'Сейча́с я еду домой.', en: 'I am going home now.', pr: 'Seychas ya yedu domoy.' },
  { ru: 'Куда ты идёшь?', en: 'Where are you going?', pr: 'Kuda ty idosh?' },
  { ru: 'Я иду в музей.', en: 'I am going to the museum.', pr: 'Ya idu v muzey.' },
  // Lesson 25 Useful Phrases
  { ru: 'Что ты будешь делать в субботу?', en: 'What will you do on Saturday?', pr: 'Chto ty budesh delat v subbotu?' },
  { ru: 'Сначала я прочитаю текст.', en: 'First I will read the text.', pr: 'Snachala ya prochitayu tekst.' },
  { ru: 'Я куплю эти духи.', en: 'I will buy this perfume.', pr: 'Ya kuplyu eti duhi.' },
  { ru: 'Мы возьмём салат и сок.', en: 'We will take salad and juice.', pr: 'My vozmyom salat i sok.' },
  { ru: 'Что вы закажете?', en: 'What will you order?', pr: 'Chto vy zakazhete?' },
  { ru: 'Я попрошу счёт.', en: 'I will ask for the bill.', pr: 'Ya poproshu schot.' },
  { ru: 'Мы погуляем вечером.', en: 'We will walk in the evening.', pr: 'My pogulyayem vecherom.' },
  { ru: 'Если будет хорошая погода, мы погуляем.', en: 'If the weather is good, we will walk.', pr: 'Esli budet horoshaya pogoda, my pogulyayem.' },
  // Lesson 24 Useful Phrases
  { ru: 'Магазин находится далеко.', en: 'The shop is far away.', pr: 'Magazin nahoditsya daleko.' },
  { ru: 'Кофейня находится близко.', en: 'The café is nearby.', pr: 'Kofeynya nahoditsya blizko.' },
  { ru: 'Где можно купить цветы?', en: 'Where can I buy flowers?', pr: 'Gde mozhno kupit tsvety?' },
  { ru: 'Я люблю путешествовать по России.', en: 'I love traveling around Russia.', pr: 'Ya lyublyu puteshestvovat po Rossii.' },
  { ru: 'Он фотографирует природу.', en: 'He photographs nature.', pr: 'On fotografiruet prirodu.' },
  { ru: 'Какая это статья?', en: 'What article is this?', pr: 'Kakaya eta statya?' },
  { ru: 'Какой это журнал?', en: 'What magazine is this?', pr: 'Kakoy eto zhurnal?' },
  { ru: 'Какие это страницы?', en: 'What pages are these?', pr: 'Kakie eta stranitsy?' },
  // Lesson 23 Useful Phrases
  { ru: 'Я буду работать завтра.', en: 'I will work tomorrow.', pr: 'Ya budu rabotat zavtra.' },
  { ru: 'Мы будем отдыхать на выходных.', en: 'We will rest on the weekend.', pr: 'My budem otdyhat na vyhodnyh.' },
  { ru: 'Она будет плавать в бассейне.', en: 'She will swim in the pool.', pr: 'Ona budet plavat v basseyne.' },
  { ru: 'Я не буду смотреть этот фильм.', en: 'I will not watch this movie.', pr: 'Ya ne budu smotret etot film.' },
  { ru: 'Какой твой любимый цвет?', en: 'What is your favorite color?', pr: 'Kakoy tvoy lyubimyy tsvet?' },
  { ru: 'Моя любимая одежда розовая.', en: 'My favorite clothes are pink.', pr: 'Moya lyubimaya odezhda rozovaya.' },
  { ru: 'Завтра будет хорошая погода.', en: 'Tomorrow the weather will be good.', pr: 'Zavtra budet horoshaya pogoda.' },
  { ru: 'Я буду вставать рано.', en: 'I will wake up early.', pr: 'Ya budu vstavat rano.' },
  // Lesson 22 Useful Phrases
  { ru: 'Он известный русский космонавт.', en: 'He is a famous Russian astronaut.', pr: 'On izvestnyy russkiy kosmonavt.' },
  { ru: 'Она известная русская певица.', en: 'She is a famous Russian singer.', pr: 'Ona izvestnaya russkaya pevitsa.' },
  { ru: 'Он хорошо играет на пианино.', en: 'He plays the piano well.', pr: 'On horosho igraet na pianino.' },
  { ru: 'Он сам пишет музыку.', en: 'He writes music himself.', pr: 'On sam pishet muzyku.' },
  { ru: 'Он часто выступает на концертах.', en: 'He often performs at concerts.', pr: 'On chasto vystupaet na kontsertah.' },
  { ru: 'Это лёгкий урок.', en: 'This is an easy lesson.', pr: 'Eto lyogkiy urok.' },
  { ru: 'Какого цвета это яблоко?', en: 'What color is this apple?', pr: 'Kakogo tsveta eto yabloko?' },
  { ru: 'Оно зелёное.', en: 'It is green.', pr: 'Ono zelyonoye.' },
  // Lesson 20 Useful Phrases
  { ru: 'Ты умеешь говорить по-русски?', en: 'Can you speak Russian?', pr: 'Ty umeyesh govorit po-russki?' },
  { ru: 'Да, я умею говорить по-русски.', en: 'Yes, I can speak Russian.', pr: 'Da, ya umeyu govorit po-russki.' },
  { ru: 'Я знаю эти слова.', en: 'I know these words.', pr: 'Ya znayu eti slova.' },
  { ru: 'На уроке нельзя спать.', en: 'You must not sleep in class.', pr: 'Na uroke nelzya spat.' },
  { ru: 'В библиотеке нельзя говорить.', en: 'You must not talk in the library.', pr: 'V biblioteke nelzya govorit.' },
  { ru: 'В университете нельзя курить.', en: 'Smoking is not allowed in university.', pr: 'V universitete nelzya kurit.' },
  { ru: 'В бассейне нельзя есть и пить.', en: 'Eating and drinking are not allowed in the pool.', pr: 'V basseyne nelzya yest i pit.' },
  { ru: 'Можно купить овощи на рынке.', en: 'You can buy vegetables at the market.', pr: 'Mozhno kupit ovoshi na rynke.' },
  { ru: 'Мне нужно купить лекарство.', en: 'I need to buy medicine.', pr: 'Mne nuzhno kupit lekarstvo.' },
  { ru: 'Где можно найти это?', en: 'Where can I find this?', pr: 'Gde mozhno nayti eto.' }
];
