export const SCENARIOS = [
  {
    id: 'taxi',
    title: 'Booking a Taxi',
    description: 'Practice ordering a taxi from the airport to your hotel.',
    icon: 'Car',
    culturalTip: 'In Russia, it is best to use apps like Yandex Go rather than calling a taxi on the street.',
    initialMessage: "Hello! This is Yandex Go. Where would you like to go today?",
    initialMessageRu: 'Здравствуйте! Это Яндекс Go. Куда вы хотите поехать сегодня?'
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    description: 'Learn how to find your way around Moscow and St. Petersburg.',
    icon: 'MapPin',
    culturalTip: 'Russians are very helpful with directions, but they might seem direct or serious at first.',
    initialMessage: 'Hello! You look like you are looking for something. Can I help you with directions?',
    initialMessageRu: 'Здравствуйте! Похоже, вы что-то ищете. Вам помочь с дорогой?'
  },
  {
    id: 'food',
    title: 'Ordering Food',
    description: 'Try ordering some delicious Borsch or Pelmeni at a local restaurant.',
    icon: 'Utensils',
    culturalTip: 'Tipping is usually around 10% in most Russian restaurants.',
    initialMessage: 'Good evening! Welcome to our restaurant. Would you like to see the menu?',
    initialMessageRu: 'Добрый вечер! Добро пожаловать в наш ресторан. Желаете посмотреть меню?'
  },
  {
    id: 'hotel',
    title: 'Checking into a Hotel',
    description: 'Manage your arrival and check-in process smoothly.',
    icon: 'Hotel',
    culturalTip: 'Always have your passport and visa ready for registration at the hotel.',
    initialMessage: 'Hello! Welcome to our hotel. Do you have a reservation?',
    initialMessageRu: 'Здравствуйте! Добро пожаловать в наш отель. У вас есть бронирование?'
  },
  {
    id: 'emergency',
    title: 'Emergency Situations',
    description: 'Important phrases for when things dont go as planned.',
    icon: 'AlertCircle',
    culturalTip: 'The emergency number in Russia is 112.',
    initialMessage: 'Emergency service 112. What is your emergency?',
    initialMessageRu: 'Служба экстренной помощи 112. Что у вас случилось?'
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
    url: 'https://images.unsplash.com/photo-1590059522197-29bd5ea4728f?auto=format&fit=crop&q=80&w=1000',
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
