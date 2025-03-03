# Moment 3, API till uppgiften i _Avancerad React-utveckling_
Den här README-filen har skapats för att redogöra för användningen av webbtjänsten/API:et.

I koden implementeras **CRUD**; create (POST), read (GET), update (PUT) och delete (DELETE).

Gällande varor kan dessa skapas, hämtas, uppdateras och raderas medan användare kan registreras och loggas in på skyddad resurs (admin-gränssnitt). Det finns även möjlighet att radera en användare.

## Användning av API - varor (items)


| **Metod** | **Endpoint** | **Beskrivning**                                                                                                                                   |
|:---------:|:------------:|---------------------------------------------------------------------------------------------------------------------------------------------------|
| GET       | /item        | Hämtar alla lagrade varor.                                                                                                        |
| POST      | /item        | Lagrar en ny vara. Kräver att ett objekt med två fält; name och price skickas med. Category och status är inte required har båda defaultvärden, "Ingen kategori" respektive "Ej i lager".                          |
| PUT       | /item/:id    | Uppdaterar en redan existerande vara med angivet ID. Kräver att ett objekt med två fält; name och price skickas med. |
| DELETE    | /item/:id    | Raderar en vara med angivet ID.                                                                                                                  |

## Användning av API - användare (users)


| **Metod** | **Endpoint** | **Beskrivning**                                                                                                                                   |
|:---------:|:------------:|---------------------------------------------------------------------------------------------------------------------------------------------------|
| POST      | /register        | Registrerar en ny användare. Kräver att ett objekt med två fält; username och password skickas med.                          |
| POST       | /login    | Loggar in en användare. Kräver att ett objekt med två fält; username och password skickas med. En JWT-token skapas i samband med inloggningen. |
| DELETE    | /delete/username    | Raderar en användare med angivet användarnamn. En kontroll görs om det är samma användare som gör förfrågan.  

## Användning av API - skyddad resurs (admin)

| **Endpoint** | **Beskrivning**                                                            |
|:------------:|:--------------------------------------------------------------------------:|
| /admin       | Skyddad resurs som endast kan nås via inloggning av registrerad användare. |

### Output - varor

Ett item-objekt returneras/skickas i JSON-format med följande struktur:
```
{
  "_id": "67c1a5ce340c471f474e40a1",
  "title": "Den försvunna diamanten",
  "category": "Spel",
  "status": "I lager"
}
```

### Output - användare

Ett user-objekt returneras/skickas i JSON-format med följande struktur där lösenordet är haschat med bcrypt.
```
{
  "username": "Jenny",
  "password": "$2b$10$mO2fqCW1lTxziX0LnUfUOOr6TETVAcmwO0KrNu7Te2hUtR9DsYNoS"
}
```

#### _Skapad av Jenny Lind, jeli2308_.