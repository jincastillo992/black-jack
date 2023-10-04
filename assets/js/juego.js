/*
 * C = CLUBS
 * D = DIAMONDS
 * H = HEARTS
 * S = SPADES
 */

const moduloBlackJack = (() => {
    'use strict';

    let deck = [],
        puntosJugadores = [];
    const tipos = ['C', 'D', 'H', 'S'],
        especiales = ['A', 'J', 'Q', 'K'];

    //Referencias al HTML
    const btnNuevoJuego = document.querySelector('#btnNuevoJuego'),
        btnPedir = document.querySelector('#btnPedirCarta'),
        btnDetener = document.querySelector('#btnDetener'),
        puntosHTML = document.querySelectorAll('small'),
        divCartasJugadores = document.querySelectorAll('.divCartas');

    //Inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach((elem) => (elem.innerText = 0));
        divCartasJugadores.forEach((elem) => (elem.innerHTML = ''));
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    };

    //esta funcion crea una nueva baraja
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }

        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck); // mezcla la baraja (uso de underscore.js)
    };

    // Esta funcion permite tomar una carta. Si no hay más carta, entrega un error
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No existen más cartas';
        }
        return deck.pop();
    };

    //Esta funcion devuelve el valor de la carta obtenida
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        // prettier-ignore
        return (isNaN(valor))?
            (valor === 'A')? 11 : 10
            : valor * 1;
    };

    //Turno: 0 = primer jugador y el ultimo será la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    };

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    };

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                alert('Nadie gana :(((');
            } else if (puntosMinimos > 21) {
                alert('Computadora gana');
            } else if (puntosComputadora > 21) {
                alert('Jugador gana!!!');
            } else {
                alert('Computadora gana');
            }
        }, 10);
    };

    //Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            //prettier-ignore
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
            if (puntosMinimos > 21) {
                break;
            }
        } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);
        determinarGanador();
    };

    //Eventos
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);
        if (puntosJugador > 21) {
            console.warn('Has perdido');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('Has sacado 21!!!');
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevoJuego.addEventListener('click', () => {
        inicializarJuego();
    });
    return {
        nuevoJuego: inicializarJuego,
    };
})();
