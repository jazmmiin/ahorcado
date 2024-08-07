// script.js
// Palabras aleatorias para el juego, pueden agregarse todas las que se deseen.
const palabras = ["javascript", 
    "html", 
    "css", 
    "programacion", 
    "desarrollador", 
    "tecnologia", 
    "computadora", 
    "internet", 
    "software", 
    "hardware", 
    "casa",
    "perro",
    "gato",
    "coche",
    "bicicleta",
    "computadora",
    "telefono",
    "libro",
    "mesa",
    "silla",
    "papel",
    "abecedario",
    "anfibio",
    "arcoiris",
    "avion",
    "pelota",
    "cama",
    "piano",
    "billetera",
    "cuchillo",
    "peluche",
    "unicornio",
    "tigre",
    "oso",
    "leon",
    "persona",
    "piano",
    "pareja",
    "pelicula",
    "esmeralda",
    "caña",
    "caja",
];

let palabra;
let letrasAdivinadas = [];
let letrasIncorrectas = [];
let intentos = 6;
let puntuacion = 0;

const partesAhorcado = ["cabeza", "cuerpo", "brazoIzquierdo", "brazoDerecho", "piernaIzquierda", "piernaDerecha"];
let nombreJugador = new URLSearchParams(window.location.search).get('nombreJugador');

// Escoger una palabra aleatoria
function escogerPalabra() {
    const indice = Math.floor(Math.random() * palabras.length);
    palabra = palabras[indice];
}

document.addEventListener('DOMContentLoaded', () => {
    escogerPalabra();
    document.getElementById('intentosRestantes').innerText = intentos;
    actualizarContenedorPalabra();
});

function adivinar() { // funcion para procesar la letra ingresada por el jugador, actualizar el estado del juego y verificar si el jugador ha ganado o perdido.
    const letraAdivinada = document.getElementById('letraAdivinada').value.toLowerCase();
    document.getElementById('letraAdivinada').value = '';

    if (letraAdivinada && !letrasAdivinadas.includes(letraAdivinada) && !letrasIncorrectas.includes(letraAdivinada)) {
        if (palabra.includes(letraAdivinada)) {
            letrasAdivinadas.push(letraAdivinada);
            actualizarContenedorPalabra();
            verificarVictoria();
        } else {
            letrasIncorrectas.push(letraAdivinada);
            intentos--;
            document.getElementById('intentosRestantes').innerText = intentos;
            actualizarAhorcado();
            actualizarLetrasIncorrectas();
            verificarDerrota();
        }
    }
}

function actualizarContenedorPalabra() {
    const contenedorPalabra = document.getElementById('contenedorPalabra');
    contenedorPalabra.innerHTML = palabra.split('').map(letra => letrasAdivinadas.includes(letra) ? letra : '_').join(' ');
}

function actualizarAhorcado() { //funcion para ir marcando y disminuyendo nuestros intentos/vidas/oportunidades.
    const parte = partesAhorcado[6 - intentos];
    document.getElementById(parte).style.display = 'block';
}

function actualizarLetrasIncorrectas() {
    const listaLetrasIncorrectas = document.getElementById('listaLetrasIncorrectas');
    listaLetrasIncorrectas.innerHTML = letrasIncorrectas.map(letra => `<li>${letra}</li>`).join('');
}
function guardarPuntuacion(nombre, puntuacion, tiempo) { //funcion para guardar nuestra puntuacion en la base de datos (me ayude con la ia pq no sabia como hacerlo sinceramente)
    fetch('http://localhost:3000/guardar-puntuacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, puntuacion, tiempo })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error al guardar la puntuación:', error);
    });
}

function verificarVictoria() { //alert por si el jugador gana + su puntuacion.
    if (palabra.split('').every(letra => letrasAdivinadas.includes(letra))) {
        puntuacion = Math.floor((100 / palabra.length) * (palabra.length - letrasIncorrectas.length));
        alert(`¡Felicidades, ${nombreJugador}! Has ganado. Tu puntuación es: ${puntuacion}`);
        reiniciarJuego();
    }
}

function verificarDerrota() { //alert por si el jugador pierde + la palabra correcta.
    if (intentos === 0) {
        alert(`¡Perdiste, ${nombreJugador}! La palabra era: ${palabra}`);
        reiniciarJuego();
    }
}

function reiniciarJuego() { //funcion para reiniciar el juego y el ahorcado desde 0.
    letrasAdivinadas = [];
    letrasIncorrectas = [];
    intentos = 6;
    document.querySelectorAll('.parteAhorcado').forEach(part => part.style.display = 'none');
    document.getElementById('intentosRestantes').innerText = intentos;
    escogerPalabra();
    actualizarContenedorPalabra();
    actualizarLetrasIncorrectas();
}