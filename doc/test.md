## GET api/test/login(id)

Аутентифицировать как пользователя

__Параметры__
 
```id=1``` идентификатор пользователя 

__Ответ__

|Заголовок   |Значение                              |Описание
|------------|--------------------------------------|--------
|set-cookie  |PHPSESSID=435h3jk5h35lh4k2jbl43kh53kj | Куки пользователя


## GET api/test/setupDB

Сбросить базу данных на начальное состояние

__Ответ__
```json
{
  "response": "output from console"
}
```

## GET test/createUser

Создать пользователя в БД. Только для тестового окружения для тестовых целей.

__Параметры__
 
```ids=210700286,7777777``` идентификаторы пользователей (необязательный). 

__Ответ__
```json
{
    "response": [{
        "id": 210700286,
        "uid": 12454352,
        "lastName": "Stirling",
        "firstName": "Lindsey",
        "patronymic": "asdf",
        "nickname": "Boroda",
        "birthyear": "1900",
        "location": {"lat":14.3125, "lng": 54.3245},
        "photo": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "smallPhoto": "https://sun1-19.u...EGxg5NXns.jpg?ava=1",
        "status": 1, 
        "witnessChatInviteLink": "vk.com/join........",
        "passport": "0726",
        "locale": "ru",
        "role": 1,
        "witness_id": 1234,
        "foremanRequest_id": 5678,
        "foreman_id": null,

        "ten": "undefined"
    },
    {
        "id": "7777777",
        "...": ""
    }]
 }
 ```
