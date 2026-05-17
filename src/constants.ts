export const SCENARIOS = [
  {
    id: 'taxi',
    title: 'Booking a Taxi',
    description: 'Practice ordering a taxi from the airport to your hotel.',
    icon: 'Car',
    culturalTip: 'In Russia, it is best to use apps like Yandex Go rather than calling a taxi on the street.',
    initialMessage: 'Hi! I need a taxi to the Radisson Hotel.',
    initialMessageRu: 'Здравствуйте! Мне нужно такси до гостиницы Рэдиссон.'
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    description: 'Learn how to find your way around Moscow and St. Petersburg.',
    icon: 'MapPin',
    culturalTip: 'Russians are very helpful with directions, but they might seem direct or serious at first.',
    initialMessage: 'Excuse me, where is the Red Square?',
    initialMessageRu: 'Извините, где Красная площадь?'
  },
  {
    id: 'food',
    title: 'Ordering Food',
    description: 'Try ordering some delicious Borsch or Pelmeni at a local restaurant.',
    icon: 'Utensils',
    culturalTip: 'Tipping is usually around 10% in most Russian restaurants.',
    initialMessage: 'Can I have the menu, please?',
    initialMessageRu: 'Можно меню, пожалуйста?'
  },
  {
    id: 'hotel',
    title: 'Checking into a Hotel',
    description: 'Manage your arrival and check-in process smoothly.',
    icon: 'Hotel',
    culturalTip: 'Always have your passport and visa ready for registration at the hotel.',
    initialMessage: 'I have a reservation for Misbah.',
    initialMessageRu: 'У меня забронирован номер на имя Мисбах.'
  },
  {
    id: 'emergency',
    title: 'Emergency Situations',
    description: 'Important phrases for when things dont go as planned.',
    icon: 'AlertCircle',
    culturalTip: 'The emergency number in Russia is 112.',
    initialMessage: 'Help! I lost my passport.',
    initialMessageRu: 'Помогите! Я потерял свой паспорт.'
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
