# Banker App

Приложение для игры в монополию или любую другую настолку, где нужна внутренняя валюта, но не хочется париться с бумажными купюрами. Создаем комнату, задаем стартовый баланс, подключаемся через QR-код и проводим транзакции в рамках одной комнаты.

![App screenshot](https://github.com/artyom-ivanov/banker/blob/master/screenshot.png?raw=true)

- Создатель комнаты ("банкир") может проводить любые транзакции.
- Подключившиеся игроки могут переводить свои деньги любому игроку или в банк ("перевести" и "потратить").

### TODO

- [x] Авторизация
- [x] Заполнение профиля
- [x] Выбор аватарки
- [x] Создание комнаты
- [x] Генерация кода для подключения
- [x] Подключение к комнате
- [x] Аппрув подключения создателем комнаты
- [x] Транзакции под ролью банкира
- [ ] Транзакции между пользователями
- [ ] История транзакций
- [ ] Запрос средств у другого пользователя/банка
