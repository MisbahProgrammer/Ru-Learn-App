import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AudioButton } from '@/components/AudioButton';

interface RussianWord {
  russian: string;
  phonetic: string;
  english: string;
  example: string;
  exampleEnglish: string;
}

// Exactly 100 high-quality, practical Russian words for students going to Russian universities/cities.
const WORDS_LIST: RussianWord[] = [
  { russian: "Здравствуйте", phonetic: "Zdrahst-vooy-tyeh", english: "Hello (formal)", example: "Здравствуйте, профессор!", exampleEnglish: "Hello, professor!" },
  { russian: "Спасибо", phonetic: "Spah-see-bah", english: "Thank you", example: "Спасибо за помощь.", exampleEnglish: "Thank you for the help." },
  { russian: "Пожалуйста", phonetic: "Pah-zhah-looy-stah", english: "Please / You are welcome", example: "Дайте кофе, пожалуйста.", exampleEnglish: "Give me coffee, please." },
  { russian: "Университет", phonetic: "Oo-nee-vyehr-see-tyet", english: "University", example: "Где расположен наш университет?", exampleEnglish: "Where is our university located?" },
  { russian: "Студент", phonetic: "Stoo-dyent", english: "Student", example: "Я иностранный студент.", exampleEnglish: "I am an international student." },
  { russian: "Общежитие", phonetic: "Ahp-shcheh-zhee-tyeh", english: "Dormitory", example: "Моё общежитие близко.", exampleEnglish: "My dormitory is close." },
  { russian: "Комната", phonetic: "Kom-nah-tah", english: "Room", example: "Это моя комната.", exampleEnglish: "This is my room." },
  { russian: "Ключ", phonetic: "Klyooch", english: "Key", example: "Вот ваш ключ от комнаты.", exampleEnglish: "Here is your room key." },
  { russian: "Пропуск", phonetic: "Proh-poosk", english: "ID card / Permit Pass", example: "Предъявите ваш пропуск.", exampleEnglish: "Present your pass." },
  { russian: "Библиотека", phonetic: "Beeb-lee-ah-tye-kah", english: "Library", example: "Я иду заниматься в библиотеку.", exampleEnglish: "I'm going to study in the library." },
  { russian: "Пара", phonetic: "Pah-rah", english: "Lecture / Classroom session", example: "У нас сейчас первая пара.", exampleEnglish: "We have our first lecture right now." },
  { russian: "Профессор", phonetic: "Prah-fyehs-sar", english: "Professor", example: "Наш профессор очень добрый.", exampleEnglish: "Our professor is very kind." },
  { russian: "Кабинет", phonetic: "Kah-bee-nyet", english: "Office / Classroom Room", example: "Кабинет находится на третьем этаже.", exampleEnglish: "The classroom is on the third floor." },
  { russian: "Семестр", phonetic: "See-myes-tr", english: "Semester", example: "Это сложный семестр.", exampleEnglish: "This is a challenging semester." },
  { russian: "Экзамен", phonetic: "Ehk-zah-myen", english: "Exam", example: "Завтра у меня сложный экзамен.", exampleEnglish: "Tomorrow I have a difficult exam." },
  { russian: "Зачёт", phonetic: "Zah-chyot", english: "Pass / Credit mark", example: "Я получил зачёт по истории.", exampleEnglish: "I got a pass credit mark for history." },
  { russian: "Стипендия", phonetic: "Stee-pyen-dee-yah", english: "Scholarship Allowance", example: "Я получаю государственную стипендию.", exampleEnglish: "I receive a state scholarship allowance." },
  { russian: "Метро", phonetic: "Mye-tro", english: "Metro / Subway", example: "Метро работает до часу ночи.", exampleEnglish: "The metro operates till one in the morning." },
  { russian: "Автобус", phonetic: "Ahv-toh-boos", english: "Bus", example: "Где останавливается этот автобус?", exampleEnglish: "Where does this bus stop?" },
  { russian: "Такси", phonetic: "Tahk-see", english: "Taxi", example: "Я вызвал такси через приложение.", exampleEnglish: "I ordered a taxi via the app." },
  { russian: "Тройка", phonetic: "Troy-kah", english: "Troika travel card", example: "Мне нужно пополнить карту Тройка.", exampleEnglish: "I need to top up my Troika card." },
  { russian: "Магазин", phonetic: "Mah-gah-zeen", english: "Store / Shop", example: "Магазин закрыт на ремонт.", exampleEnglish: "The shop is closed for renovation." },
  { russian: "Аптека", phonetic: "Ahp-tye-kah", english: "Pharmacy", example: "Где ближайшая аптека?", exampleEnglish: "Where is the nearest pharmacy?" },
  { russian: "Банк", phonetic: "Bahnk", english: "Bank", example: "Я открыл счет в Сбербанке.", exampleEnglish: "I opened an account with Sberbank." },
  { russian: "Кафе", phonetic: "Kah-fyeh", english: "Cafe", example: "Давайте встретимся в кафе.", exampleEnglish: "Let's meet up in the cafe." },
  { russian: "Столовая", phonetic: "Stah-loh-vah-yah", english: "Canteen / Dining hall", example: "В студенческой столовой дешевая еда.", exampleEnglish: "There is cheap food in the student canteen." },
  { russian: "Борщ", phonetic: "Bohrshch", english: "Borscht soup", example: "Мне нравится горячий борщ.", exampleEnglish: "I like hot borscht soup." },
  { russian: "Блины", phonetic: "Blee-nih", english: "Russian Pancakes", example: "Блины со сметаной очень вкусные.", exampleEnglish: "Pancakes with sour cream are very tasty." },
  { russian: "Вода", phonetic: "Vah-dah", english: "Water", example: "Бутылка воды, пожалуйста.", exampleEnglish: "A bottle of water, please." },
  { russian: "Чай", phonetic: "Chay", english: "Tea", example: "Хотите черный или зеленый чай?", exampleEnglish: "Would you like black or green tea?" },
  { russian: "Хлеб", phonetic: "Hlyep", english: "Bread", example: "Купи свежий черный хлеб.", exampleEnglish: "Buy some fresh black rye bread." },
  { russian: "Молоко", phonetic: "Mah-lah-ko", english: "Milk", example: "Я пью кофе с молоком.", exampleEnglish: "I drink coffee with milk." },
  { russian: "Сахар", phonetic: "Sah-hahr", english: "Sugar", example: "Чай без сахара, пожалуйста.", exampleEnglish: "Tea without sugar, please." },
  { russian: "Сыр", phonetic: "Seer", english: "Cheese", example: "Я люблю российский сыр.", exampleEnglish: "I love Russian cheese." },
  { russian: "Колбаса", phonetic: "Kahl-bah-sah", english: "Sausage", example: "Бутерброд с колбасой на завтрак.", exampleEnglish: "A sandwich with sausage for breakfast." },
  { russian: "Яйцо", phonetic: "Yai-tso", english: "Egg", example: "Сварить яйцо на завтрак.", exampleEnglish: "Boil an egg for breakfast." },
  { russian: "Мясо", phonetic: "Myah-sah", english: "Meat", example: "Я не ем мясо.", exampleEnglish: "I do not eat meat." },
  { russian: "Рыба", phonetic: "Rih-bah", english: "Fish", example: "Вкусная запеченная рыба.", exampleEnglish: "Delicious baked fish." },
  { russian: "Овощи", phonetic: "Oh-vah-shchee", english: "Vegetables", example: "Свежие овощи на рынке.", exampleEnglish: "Fresh vegetables at the market." },
  { russian: "Фрукты", phonetic: "Frook-tih", english: "Fruits", example: "Я купил сочные фрукты.", exampleEnglish: "I bought juicy fruits." },
  { russian: "Яблоко", phonetic: "Yah-blah-kah", english: "Apple", example: "Зеленое яблоко очень кислое.", exampleEnglish: "The green apple is very sour." },
  { russian: "Банан", phonetic: "Bah-nahn", english: "Banana", example: "Купи связку бананов.", exampleEnglish: "Buy a bunch of bananas." },
  { russian: "Картошка", phonetic: "Kahr-tosh-kah", english: "Potato", example: "Жареная картошка с грибами.", exampleEnglish: "Fried potato with mushrooms." },
  { russian: "Суп", phonetic: "Soop", english: "Soup", example: "Куриный суп на обед.", exampleEnglish: "Chicken soup for lunch." },
  { russian: "Сок", phonetic: "Sok", english: "Juice", example: "Апельсиновый сок со льдом.", exampleEnglish: "Orange juice with ice." },
  { russian: "Пиво", phonetic: "Pee-vah", english: "Beer", example: "Холодное светлое пиво.", exampleEnglish: "Cold pale beer." },
  { russian: "Вино", phonetic: "Vee-no", english: "Wine", example: "Красное сухое вино.", exampleEnglish: "Dry red wine." },
  { russian: "Счет", phonetic: "Shchot", english: "Check / Receipt bill", example: "Принесите счет, пожалуйста.", exampleEnglish: "Please bring the bill." },
  { russian: "Сдача", phonetic: "Sdah-chah", english: "Change (money back)", example: "Возьмите сдачу.", exampleEnglish: "Take your change." },
  { russian: "Цена", phonetic: "Tseh-nah", english: "Price", example: "Цена очень высокая.", exampleEnglish: "The price is very high." },
  { russian: "Сколько", phonetic: "Skol'-kah", english: "How much / How many", example: "Сколько это стоит?", exampleEnglish: "How much does this cost?" },
  { russian: "Деньги", phonetic: "Dyen'-gee", english: "Money", example: "У меня закончились деньги.", exampleEnglish: "I ran out of money." },
  { russian: "Рубль", phonetic: "Roobl'", english: "Ruble", example: "Один доллар — сто рублей.", exampleEnglish: "One dollar is a hundred rubles." },
  { russian: "Копейка", phonetic: "Kah-pyey-kah", english: "Kopeck (cent equivalent)", example: "Копейка рубль бережет.", exampleEnglish: "A kopeck protects the ruble (superstition)." },
  { russian: "Касса", phonetic: "Kahs-sah", english: "Cashier desk", example: "Вторая касса свободна.", exampleEnglish: "The second register checkout is open." },
  { russian: "Пакет", phonetic: "Pah-kyet", english: "Plastic Bag", example: "Вам нужен пакет?", exampleEnglish: "Do you need a plastic bag?" },
  { russian: "Карта", phonetic: "Kahr-tah", english: "Map / Card", example: "Оплата картой или наличными?", exampleEnglish: "Payment by card or cash?" },
  { russian: "Наличные", phonetic: "Nah-leech-nih-yeh", english: "Cash", example: "У меня только наличные.", exampleEnglish: "I only have cash." },
  { russian: "Скидка", phonetic: "Skeet-kah", english: "Discount", example: "Для студентов есть скидка.", exampleEnglish: "There is a discount for students." },
  { russian: "Понедельник", phonetic: "Pah-nee-dyel'-neek", english: "Monday", example: "В понедельник начинается учеба.", exampleEnglish: "Classes start on Monday." },
  { russian: "Вторник", phonetic: "Fthor-neek", english: "Tuesday", example: "Во вторник у нас физкультура.", exampleEnglish: "We have sports class on Tuesday." },
  { russian: "Среда", phonetic: "Sree-dah", english: "Wednesday", example: "В среду лекция по литературе.", exampleEnglish: "Grammar lecture on Wednesday." },
  { russian: "Четверг", phonetic: "Chet-vyehrk", english: "Thursday", example: "Четверг — рыбный день.", exampleEnglish: "Thursday is traditional fish day." },
  { russian: "Пятница", phonetic: "Pyat-nee-tsah", english: "Friday", example: "Наконец-то пятница!", exampleEnglish: "Finally Friday!" },
  { russian: "Суббота", phonetic: "Soo-boh-tah", english: "Saturday", example: "В субботу я отдыхаю в парке.", exampleEnglish: "I rest in the park on Saturday." },
  { russian: "Воскресенье", phonetic: "Vahs-kree-syen'-yeh", english: "Sunday", example: "В воскресенье нет занятий.", exampleEnglish: "There are no classes on Sunday." },
  { russian: "Сегодня", phonetic: "See-vohd-nyah", english: "Today", example: "Сегодня хорошая погода.", exampleEnglish: "Today the weather is nice." },
  { russian: "Вчера", phonetic: "Fcheh-rah", english: "Yesterday", example: "Вчера был трудный день.", exampleEnglish: "Yesterday was a difficult day." },
  { russian: "Завтра", phonetic: "Zahf-trah", english: "Tomorrow", example: "До завтра!", exampleEnglish: "See you tomorrow!" },
  { russian: "Время", phonetic: "Vrye-myah", english: "Time", example: "Сколько сейчас времени?", exampleEnglish: "What time is it now?" },
  { russian: "Час", phonetic: "Chas", english: "Hour / One o'clock", example: "Увидимся через час.", exampleEnglish: "See you in an hour." },
  { russian: "Минута", phonetic: "Mee-noo-tah", english: "Minute", example: "Подождите одну минуту.", exampleEnglish: "Wait one minute, please." },
  { russian: "День", phonetic: "Dyen'", english: "Day", example: "Добрый день!", exampleEnglish: "Good afternoon!" },
  { russian: "Утро", phonetic: "Oo-trah", english: "Morning", example: "Доброе утро, друзья!", exampleEnglish: "Good morning, friends!" },
  { russian: "Вечер", phonetic: "Vyeh-cher", english: "Evening", example: "Добрый вечер!", exampleEnglish: "Good evening!" },
  { russian: "Ночь", phonetic: "Noch'", english: "Night", example: "Спокойной ночи.", exampleEnglish: "Good night." },
  { russian: "Погода", phonetic: "Pah-goh-dah", english: "Weather", example: "Какая сегодня погода?", exampleEnglish: "How is the weather today?" },
  { russian: "Холодно", phonetic: "Hoh-lahd-nah", english: "Cold", example: "Зимой в Москве очень холодно.", exampleEnglish: "It is very cold in Moscow in winter." },
  { russian: "Тепло", phonetic: "Tyee-ploh", english: "Warm", example: "Весной на улице тепло.", exampleEnglish: "It is warm outside in spring." },
  { russian: "Дождь", phonetic: "Dozht'", english: "Rain", example: "На улице идет дождь.", exampleEnglish: "It is raining outside." },
  { russian: "Снег", phonetic: "Snyek", english: "Snow", example: "Идет первый пушистый снег.", exampleEnglish: "The first fluffy snow is falling." },
  { russian: "Билет", phonetic: "Bee-lyet", english: "Ticket", example: "Вот ваш входной билет.", exampleEnglish: "Here is your admission ticket." },
  { russian: "Паспорт", phonetic: "Pahs-pahrt", english: "Passport", example: "Не забудьте паспорт дома.", exampleEnglish: "Do not forget your passport at home." },
  { russian: "Виза", phonetic: "Vee-zah", english: "Visa document", example: "Учебная виза готова.", exampleEnglish: "The study visa is ready." },
  { russian: "Аэропорт", phonetic: "Ah-eh-rah-pohrt", english: "Airport", example: "Самолет прилетает в аэропорт.", exampleEnglish: "The plane lands at the airport." },
  { russian: "Адрес", phonetic: "Ah-dryes", english: "Address", example: "Запишите адрес общежития.", exampleEnglish: "Write down the dormitory address." },
  { russian: "Улица", phonetic: "Oo-lee-tsah", english: "Street", example: "Она живет на улице Ленина.", exampleEnglish: "She lives on Lenin Street." },
  { russian: "Площадь", phonetic: "Ploh-shchaht'", english: "Square", example: "Красная площадь в центре Москвы.", exampleEnglish: "Red Square is in the center of Moscow." },
  { russian: "Центр", phonetic: "Tsehntr", english: "City Center", example: "Мы едем гулять в центр.", exampleEnglish: "We're going to the center to walk." },
  { russian: "Дом", phonetic: "Dom", english: "House / Building", example: "Этот дом старый.", exampleEnglish: "This building is old." },
  { russian: "Где", phonetic: "Gde", english: "Where", example: "Где здесь туалет?", exampleEnglish: "Where is the restroom here?" },
  { russian: "Куда", phonetic: "Koo-dah", english: "Whither / Where to", example: "Куда вы идете?", exampleEnglish: "Where are you going?" },
  { russian: "Откуда", phonetic: "Aht-koo-dah", english: "Where from", example: "Откуда вы приехали?", exampleEnglish: "Where are you from?" },
  { russian: "Прямо", phonetic: "Pryah-mah", english: "Straight on", example: "Идите тридцать метров прямо.", exampleEnglish: "Walk thirty meters straight on." },
  { russian: "Налево", phonetic: "Nah-lyee-vah", english: "To the left / Leftwards", example: "Поверните налево за углом.", exampleEnglish: "Turn left after the corner." },
  { russian: "Направо", phonetic: "Nah-prah-vah", english: "To the right / Rightwards", example: "Метро будет направо.", exampleEnglish: "The metro will be to the right." },
  { russian: "Конечно", phonetic: "Kah-nyesh-nah", english: "Of course", example: "Конечно, я помогу вам.", exampleEnglish: "Of course, I will help you." },
  { russian: "Хорошо", phonetic: "Hah-rah-shoh", english: "Good / Okay", example: "Всё будет хорошо.", exampleEnglish: "All will be fine." },
  { russian: "Понимаю", phonetic: "Pah-nee-mah-yoo", english: "I understand", example: "Я немного понимаю по-русски.", exampleEnglish: "I understand Russian a little." }
];

export function WordOfTheDay() {
  // 1. Calculate the day of the year to cycle 100 words dynamically
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dayOfYear = getDayOfYear();
  const wordIndex = dayOfYear % WORDS_LIST.length;
  const word = WORDS_LIST[wordIndex];

  return (
    <Card className="border border-neutral-200 overflow-hidden bg-white rounded-3xl" id="word-of-the-day-card">
      <CardHeader className="pb-3 pt-5 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100/50 p-1.5 rounded-lg text-orange-600">
            <Sparkles className="w-4 h-4 fill-orange-50" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Word of the Day</p>
        </div>
        <div className="flex items-center gap-1">
          <AudioButton text={word.russian} size="md" label="Normal" />
          <AudioButton text={word.russian} slow={true} size="sm" label="Slow" />
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-5 pt-0 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
          <h3 className="text-2xl font-bold text-neutral-900 tracking-tight" id="widget-russian-word">
            {word.russian}
          </h3>
          <span className="text-xs font-mono text-orange-600 bg-orange-50/50 border border-orange-100/50 px-2 py-0.5 rounded-md self-start sm:self-center">
            [{word.phonetic}]
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-neutral-700">
            Meaning: <span className="font-light text-neutral-600">{word.english}</span>
          </p>
        </div>

        <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Practical Example</span>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-neutral-800">{word.example}</p>
            <div className="flex items-center gap-1">
              <AudioButton text={word.example} size="sm" />
              <AudioButton text={word.example} slow={true} size="sm" />
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 font-light">{word.exampleEnglish}</p>
        </div>
      </CardContent>
    </Card>
  );
}
