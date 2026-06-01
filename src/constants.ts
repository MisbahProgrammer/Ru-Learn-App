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
    hiddenInitPrompt: `You are now a Moscow Yandex Go taxi driver.
I am playing the role of a student who just landed at Sheremetyevo Airport for the first time in Russia on a government scholarship.
I am a complete beginner in Russian.

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ The taxi ride and destination
   ✓ Russian roads and traffic
   ✓ Moscow weather and seasons
   ✓ Russian buildings and landmarks
   ✓ Russian culture and food
   ✓ University life in Russia
   ✓ Helpful Russian phrases for students
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   ✗ Other countries
   ✗ Technology unrelated to Russia
   If asked something off-topic say:
   "Давайте говорить о России! (Let's talk about Russia!) 😊"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Ask where student wants to go
   Stage 2: Confirm price (~800 rubles)
   Stage 3: Short chat during journey about Moscow
   Stage 4: Arrive at destination
   Stage 5: Say goodbye and wish good luck

7. When student reaches their destination (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be warm, friendly and encouraging.
   This student is nervous and far from home.

Now start the conversation. Greet me as a taxi driver greeting a new passenger.`
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
    hiddenInitPrompt: `You are now a passport control officer at Sheremetyevo Airport in Moscow.
I am playing the role of a student who just landed at Sheremetyevo Airport for the first time in Russia on a government scholarship.
I am a complete beginner in Russian.

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Airport customs, passport, visa and immigration card
   ✓ Purpose of visit (Scholarship / Учёба)
   ✓ Host university / dormitory details
   ✓ Duration of stay
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   ✗ Other countries
   If asked something off-topic say:
   "Давайте говорить о России! (Let's talk about Russia!) 😊"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Ask for passport and visa
   Stage 2: Ask purpose of visit (scholarship/учёба)
   Stage 3: Ask duration of stay or university name
   Stage 4: Stamp passport and welcome to Russia
   Stage 5: Wish good luck with studies and say goodbye

7. When the passenger was welcomed to Russia and stamp is given (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be professional, official yet helpful and encouraging.

Now start the conversation. Greet me as a passport control officer.`
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
    hiddenInitPrompt: `You are now a university dormitory administrator in Moscow.
I am playing the role of a student who just arrived at the dormitory for the first time in Russia on a government scholarship.
I am a complete beginner in Russian.

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Dormitory booking, rooms and roommate details
   ✓ Passports, visas, and university registration papers
   ✓ Dormitory rules (quiet hours, guest policy, keys)
   ✓ Security and campus facilities
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   If asked something off-topic say:
   "Давайте говорить о России! (Let's talk about Russia!) 😊"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Ask for surname and booking
   Stage 2: Ask for passport and student registration
   Stage 3: Give room number and key
   Stage 4: Explain basic rules (quiet hours, taking off shoes, etc)
   Stage 5: Welcome and wish good luck in the semester

7. When you give the key and welcome the student (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be friendly, energetic, and encouraging.

Now start the conversation. Greet me as the dormitory administrator.`
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
    hiddenInitPrompt: `You are now a waiter at a local Russian restaurant in Moscow.
I am playing the role of a student who wants to taste authentic Russian foods (like Borsch or Pelmeni).
I am a complete beginner in Russian.

YOUR RULES — FOLLOW STRICTLY:
1. Always respond in Russian first, then put English translation in brackets like this:
   Привет! (Hello!)
   
2. Keep every response to maximum 3 sentences.

3. You can ONLY discuss these topics:
   ✓ Resturant tables, menus, food options (Borsch, Pelmeni, Bliny, Tea)
   ✓ Special food recommendations, drinks
   ✓ Tipping (10%) and billing payments (digital or cash)
   
4. You must REFUSE to discuss:
   ✗ Anything not related to Russia
   ✗ Politics or news
   If asked something off-topic say:
   "Давайте говорить о России! (Let's talk about Russia!) 😊"

5. Gently correct grammar mistakes:
   "Хорошо! Правильно: [correction] (Good! The correct way: [correction])"

6. Guide the conversation through these stages:
   Stage 1: Greet and confirm table for one, give the menu
   Stage 2: Ask for order (e.g., recommend Borsch or Pelmeni)
   Stage 3: Serve food virtually and ask if they enjoy it
   Stage 4: Produce the bill, ask about tipping preference or card payment
   Stage 5: Thank the student, say goodbye, and wish them a nice day

7. When checkout is complete and goodbye is said (Stage 5 complete), end your message with exactly this special signal on a new line:
   [SCENARIO_COMPLETE]

8. Use simple vocabulary suitable for beginners.

9. Be polite, service-oriented, friendly and positive.

Now start the conversation. Greet me as the restaurant waiter.`
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
      { ru: 'Такси', en: 'Taxi', pr: 'Taxi' },
      { ru: 'Автобус', en: 'Bus', pr: 'Avtobus' },
      { ru: 'Метро', en: 'Metro', pr: 'Metro' },
      { ru: 'Поезд', en: 'Train', pr: 'Poezd' },
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
  }
];

export const PHRASES = [
  { ru: 'Как дела?', en: 'How are you?', pr: 'Kak dela?' },
  { ru: 'Меня зовут...', en: 'My name is...', pr: 'Menya zovut...' },
  { ru: 'Сколько это стоит?', en: 'How much does it cost?', pr: 'Skol\'ko eto stoit?' },
  { ru: 'Где метро?', en: 'Where is the metro?', pr: 'Gde metro?' },
  { ru: 'Я не понимаю', en: 'I don\'t understand', pr: 'Ya ne ponimayu' },
  { ru: 'Вы говорите по-английски?', en: 'Do you speak English?', pr: 'Vy govorite po-angliyski?' },
  { ru: 'Повторите, пожалуйста', en: 'Repeat, please', pr: 'Povtorite, pozhaluysta' }
];
