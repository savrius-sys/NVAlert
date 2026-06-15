# Chrome Web Store Listing — NVAlert

> Last Updated: 2026-06-15

## Store Listing

**Extension Name** [REQUIRED]
NVAlert - Відстеження посилок Нової Пошти

**Short Description** [REQUIRED]
Зручне відстеження посилок Нової Пошти прямо у браузері. Отримуйте сповіщення про зміну статусів без капч та авторизації.

**Detailed Description** [REQUIRED]
NVAlert — це неофіційне, швидке та зручне розширення для відстеження посилок Нової Пошти. Воно створене для того, щоб ви більше ніколи не пропускали прибуття ваших відправлень.

Ключові можливості:
- Автоматичне відстеження доданих ТТН.
- Накопичення історії переміщень кожної посилки у вигляді зручного візуального таймлайну.
- Системні сповіщення (Push) про кожну зміну статусу.
- Можливість підключення власного API-ключа для отримання розширеної інформації (точна адреса, сума до сплати, ПІБ).
- Багатомовність (українська та англійська).
- Локальне збереження даних — ваші ТТН зберігаються лише у вашому браузері.

Як користуватися:
1. Натисніть на значок розширення, щоб відкрити список посилок.
2. Введіть номер ТТН та натисніть "+".
3. Розширення автоматично перевірятиме статус посилок у фоновому режимі та надішле вам сповіщення, як тільки статус зміниться!

Примітка щодо конфіденційності:
NVAlert працює напряму з офіційним публічним API Нової Пошти. Ваші трек-номери та API-ключ зберігаються виключно локально у вашому браузері і нікуди не передаються, окрім серверів Нової Пошти для перевірки статусу.

Зворотній зв'язок:
Якщо у вас виникли питання чи пропозиції, будь ласка, залишайте їх на сторінці підтримки!

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Відстежує статуси посилок Нової Пошти та надсилає сповіщення про їх зміну.

**Primary Language** [REQUIRED]
Ukrainian


## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | 🟡 Needs update | `public/favicon.svg` треба конвертувати у PNG |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Not created | `screenshot-1.png` |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | `screenshot-2.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | `promo-440.png` |
| Marquee Promo Tile | 1400×560 | ⬜ Not created | `promo-1400.png` |

### Screenshot Notes
- **Screenshot 1**: Покажіть відкрите вікно розширення зі списком посилок та красивим таймлайном.
- **Screenshot 2**: Покажіть панель налаштувань (введення API ключа, зміна мови).


## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| alarms | permissions | Дозволяє розширенню періодично "прокидатися" у фоновому режимі (наприклад, кожні 30 хвилин), щоб зробити запит до API Нової Пошти і перевірити, чи змінився статус посилки. |
| storage | permissions | Використовується для локального збереження номерів доданих посилок (ТТН), історії їх переміщень, налаштувань інтервалу перевірки та користувацького API-ключа. Дані не покидають пристрій користувача. |
| notifications | permissions | Потрібен для того, щоб надсилати користувачу спливаюче сповіщення операційної системи у момент, коли статус посилки змінився (наприклад, посилка "Прибула у відділення"). |
| https://api.novaposhta.ua/* | host_permissions | Необхідно для здійснення мережевих POST-запитів до публічного API Нової Пошти з метою отримання актуальних статусів відправлень. Без цього доступу розширення не зможе отримувати дані з серверів. |


## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** Yes

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | Yes | Yes | Номери ТТН та API-ключ відправляються на сервери Нової Пошти (api.novaposhta.ua) виключно для отримання статусів. Дані не відправляються на жодні інші сторонні сервери або сервери розробника. | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes


## Privacy Policy

**Privacy Policy URL** [RECOMMENDED]
*(Створіть простий Google Документ або сторінку на GitHub Pages із текстом "This extension locally stores your Nova Poshta tracking numbers and API key. It only communicates with the official api.novaposhta.ua servers to track parcels. We do not collect, store remotely, or share your personal data with any third parties.")*


## Distribution

**Visibility**: Public
**Regions**: All regions (або тільки Україна, за бажанням)
**Pricing**: Free

## Developer Info

**Publisher Name** [REQUIRED]
*(Вкажіть своє ім'я або нікнейм)*

**Contact Email** [REQUIRED]
*(Ваш email)*

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-06-15 | Initial release with timeline history and background tracking | Draft |
