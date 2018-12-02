***
***
API 'how to interact' guide
***
***



---------- new user create

- url           localhost:PORT/users
- method        POST
- body data     {
                    "name": NAME,
                    "email": EMAIL,
                    "streetAddress": STREET,
                    "user": USER,
                    "password": PASSWORD
                }
- required body data NAME, EMAIL, STREET, USER(length>6), PASSWORD(length>6)



---------- user data retrieve

- url                   localhost:PORT/users?user=USER
- method                GET
- query string data     USER
- header data           token



----------  user data update

- url                   localhost:PORT/users
- method                PUT
- body data             any of NAME, EMAIL, STREET, PASSWORD
- required body data    USER
- header data           token



---------- user data delete

- url                   localhost:PORT/users?user=USER
- method                DELETE
- query string data     USER
- header data           token




---------- new token create

- url           localhost:PORT/tokens
- method        POST
- body data     {
                    "user": USER,
                    "password": PASSWORD
                }
- required body data USER(length>6), PASSWORD(length>6)



---------- token retrieve

- url                   localhost:PORT/tokens?id=ID
- method                GET
- query string data     ID



----------  token update

- url                   localhost:PORT/tokens
- method                PUT
- body data             ID, EXTEND
- required body data    ID, EXTEND



---------- user data delete

- url                   localhost:PORT/tokens?id=ID
- method                DELETE
- query string data     ID



---------- menu retrieve

- url                   localhost:PORT/menu?user=USER
- method                GET
- query string data     USER
- header data           token


---------- new cart create

- url           localhost:PORT/cart
- method        POST
- body data     {
                    "items": ITEMS[],
                    "user": USER
                }
- required body data ITEMS(menu items' id), USER
- header data           token



---------- cart retrieve

- url                   localhost:PORT/cart?user=USER
- method                GET
- query string data     USER
- header data           token



----------  cart update

- url                   localhost:PORT/cart
- method                PUT
- body data             {
                            "items": ITEMS[],
                            "user": USER
                        }
- required body data    ITEMS, USER
- header data           token



---------- cart delete

- url                   localhost:PORT/cart?user=USER
- method                DELETE
- query string data     USER
- header data           token



---------- order create

- url                   localhost:PORT/cart
- method                POST
- body data             {
                            "user": USER
                        }
- required body data    USER
- header data           token