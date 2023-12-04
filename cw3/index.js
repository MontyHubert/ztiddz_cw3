
const express = require("express");
var path = require('path');

const app = express();

// Funkcja do autoryzacji klienta
function authentication(req, res, next) {
    var authheader = req.headers.authorization; // Pobranie nagłówka autoryzacji

    console.log(req.headers); // Wyświetlenie wszystkich nagłówków

    // Sprawdzenie, czy nagłówek jest obecny
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }

    // Dekodowanie nagłówka z base64
    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    // Sprawdzenie, czy użytkownik i hasło są puste
    if (user == '' && pass == '') {
        // Jeśli użytkownik jest autoryzowany, przechodzi do kolejnej warstwy
        next();
    } else {
        // Jeśli niepoprawne dane autoryzacyjne, zwraca błąd
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
}

// Pierwszym krokiem jest autoryzacja klienta przy użyciu funkcji 'authentication'
app.use(authentication);

// Ustawienie zasobów statycznych z katalogu 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Konfiguracja serwera na porcie 3000
app.listen((3000), () => {
    console.log("Server is Running");
})
