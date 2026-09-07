const datosPagina = document.body.dataset;
let puntaje = Number(datosPagina.puntaje || 0);
let tiempoRestante = 20;
let respuestaEnviada = false;
let animacionActual = 'confetti';
let intervaloChimpa = null;

document.querySelectorAll('button').forEach(boton => {
    boton.addEventListener('mousemove', evento => {
        const rectangulo = boton.getBoundingClientRect();
        const centroX = rectangulo.left + rectangulo.width / 2;
        const centroY = rectangulo.top + rectangulo.height / 2;
        const angulo = Math.atan2(
            evento.clientY - centroY,
            evento.clientX - centroX
        ) * (180 / Math.PI) + 90;

        boton.style.setProperty('--x', angulo + 'deg');
    });

    boton.addEventListener('mouseleave', () => {
        boton.style.setProperty('--x', '45deg');
    });
});

const temporizador = document.getElementById('temporizador');
let intervaloTiempo = null;

if (temporizador) {
    intervaloTiempo = setInterval(() => {
    tiempoRestante -= 1;
    temporizador.textContent = 'Tiempo: ' + tiempoRestante + ' s';

    if (tiempoRestante <= 5) {
        temporizador.classList.add('urgente');
    }

    if (tiempoRestante <= 0) {
        clearInterval(intervaloTiempo);
        respuestaEnviada = true;
        document.getElementById('input-respuesta').value = '';
        document.getElementById('form-respuesta').submit();
    }
    }, 1000);
}

function moverLibre(elemento) {
    let x = Math.random() * (window.innerWidth - 120);
    let y = Math.random() * (window.innerHeight - 120);
    let dx = 3;
    let dy = 2;

    function animar() {
        x += dx;
        y += dy;

        if (x <= 0 || x >= window.innerWidth - 120) {
            dx *= -1;
            elemento.style.transform = dx > 0 ? 'scaleX(1)' : 'scaleX(-1)';
        }

        if (y <= 0 || y >= window.innerHeight - 120) {
            dy *= -1;
        }

        elemento.style.left = x + 'px';
        elemento.style.top = y + 'px';
        requestAnimationFrame(animar);
    }

    animar();
}

function iniciarFondo(tipo) {
    const fondo = document.getElementById('fondo-animacion');
    if (!fondo) return;
    fondo.innerHTML = '';

    if (intervaloChimpa) {
        clearInterval(intervaloChimpa);
        intervaloChimpa = null;
    }

    if (tipo === 'confetti') {
        const emojis = ['🟡', '🔴', '🟢', '🔵', '🟠', '🟣'];

        for (let i = 0; i < 15; i += 1) {
            const pieza = document.createElement('div');
            pieza.classList.add('confetti-bg');
            pieza.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            pieza.style.left = Math.random() * 100 + 'vw';
            pieza.style.animationDuration = Math.random() * 4 + 3 + 's';
            pieza.style.animationDelay = Math.random() * 4 + 's';
            fondo.appendChild(pieza);
        }
    } else if (tipo === 'amongus') {
        const amongus = document.createElement('img');
        amongus.src = datosPagina.amongusSrc;
        amongus.classList.add('amongus-gif');
        fondo.appendChild(amongus);
        moverLibre(amongus);
    } else if (tipo === 'chimpa') {
        const chimpa = document.createElement('div');
        chimpa.style.position = 'absolute';
        chimpa.style.fontSize = '45px';
        chimpa.textContent = '🐒';
        fondo.appendChild(chimpa);
        moverLibre(chimpa);

        intervaloChimpa = setInterval(() => {
            const banana = document.createElement('div');
            banana.classList.add('banana');
            banana.textContent = '🍌';
            banana.style.left = Math.random() * 100 + 'vw';
            banana.style.top = Math.random() * 80 + 'vh';
            banana.style.animationDuration = Math.random() * 2 + 2 + 's';
            fondo.appendChild(banana);
            setTimeout(() => banana.remove(), 5000);
        }, 600);
    }
}

function abrirTienda() {
    actualizarBotones();
    document.getElementById('tienda-modal').style.display = 'flex';
}

function cerrarTienda() {
    document.getElementById('tienda-modal').style.display = 'none';
}

function comprar(tipo) {
    animacionActual = tipo;
    document.getElementById('puntaje-display').textContent = '⭐ ' + puntaje + ' pts';
    document.querySelectorAll('.item').forEach(item => item.classList.remove('activo'));
    document.getElementById('item-' + tipo).classList.add('activo');
    actualizarBotones();
    cerrarTienda();
    iniciarFondo(tipo);
}

function actualizarBotones() {
    const amongus = document.getElementById('btn-amongus');
    const chimpa = document.getElementById('btn-chimpa');
    if (amongus) amongus.disabled = false;
    if (chimpa) chimpa.disabled = false;
}

const barraProgreso = document.getElementById('barra-progreso');
const indicePregunta = barraProgreso ? Number(barraProgreso.dataset.indice) : 0;
const totalPreguntas = barraProgreso ? Number(barraProgreso.dataset.total) : 1;
let progresoActual = (indicePregunta / totalPreguntas) * 100;

function mostrarProgreso() {
    if (barraProgreso) {
        barraProgreso.style.width = progresoActual + '%';
    }
}

function aumentarBarra() {
    progresoActual = Math.min(((indicePregunta + 1) / totalPreguntas) * 100, 100);
    mostrarProgreso();
}

function verificar(opcion, correcta, boton) {
    if (!temporizador || !barraProgreso) return;
    if (respuestaEnviada) return;

    respuestaEnviada = true;
    clearInterval(intervaloTiempo);
    document.querySelectorAll('#opciones button').forEach(opcionBoton => {
        opcionBoton.disabled = true;
    });

    if (opcion === correcta) {
        boton.style.backgroundColor = '#58cc02';
        document.getElementById('caja-correcto').style.display = 'block';
        puntaje += 10;
        document.getElementById('puntaje-display').textContent = '⭐ ' + puntaje + ' pts';
    } else {
        boton.style.backgroundColor = '#ff4b4b';
        document.getElementById('respuesta-correcta').textContent = correcta;
        document.getElementById('caja-incorrecto').style.display = 'block';
    }

    aumentarBarra();
    document.getElementById('input-respuesta').value = opcion;
    document.getElementById('btn-siguiente').style.display = 'inline-block';
}

//fondos
mostrarProgreso();

const imagenes = (datosPagina.fondos || '')
    .split('|')
    .map(imagen => imagen.trim())
    .filter(Boolean);

if (imagenes.length > 0) {
    let indiceFondo = Math.floor(Math.random() * imagenes.length);

    function cambiarFondo() {
        document.body.style.setProperty(
            '--imagen-fondo',
            `url("${imagenes[indiceFondo]}")`
        );
        document.body.classList.remove('cambio-fondo');
        void document.body.offsetWidth;
        document.body.classList.add('cambio-fondo');
        if (imagenes.length > 1) {
            let nuevoIndice;

            do {
                nuevoIndice = Math.floor(Math.random() * imagenes.length);
            } while (nuevoIndice === indiceFondo);

            indiceFondo = nuevoIndice;
        }
    }

    cambiarFondo();
    if (imagenes.length > 1) setInterval(cambiarFondo, 8000);
}

// Rompecabezas con imagenes de static/gifs.
const tableroRompecabezas = document.getElementById('board');

if (tableroRompecabezas) {
    const seleccionarRompecabezas = document.getElementById('seleccionar-rompecabezas');
    const imagenGuia = document.getElementById('imagen-guia');
    const botonMezclar = document.getElementById('mezclar');
    const carpetaRompecabezas = '/static/gifs/';
    const urlImagen = nombre => carpetaRompecabezas + encodeURIComponent(nombre).replace(/%2F/g, '/');

    const rompecabezas = {
        calle: {
            guia: 'calle completa.jpeg',
            filas: 3,
            piezas: Array.from({ length: 9 }, (_, indice) => `1.${indice + 1}.jpeg`)
        },
        wuste: {
            guia: 'wuste completo.jpeg',
            filas: 5,
            piezas: Array.from({ length: 25 }, (_, indice) => `2.${indice + 1}.jpeg`)
        },
        sombrero: {
            guia: 'sombrero completo.jpeg',
            filas: 4,
            piezas: Array.from({ length: 16 }, (_, indice) => `3.${indice + 1}.jpeg`)
        }
    };

    let rompecabezasActual = rompecabezas.sombrero;
    let estado = [];
    let movimientosRompecabezas = 0;

    function vecinosRompecabezas(indice) {
        const fila = Math.floor(indice / rompecabezasActual.filas);
        const columna = indice % rompecabezasActual.filas;
        const vecinos = [];

        if (fila > 0) vecinos.push(indice - rompecabezasActual.filas);
        if (fila < rompecabezasActual.filas - 1) vecinos.push(indice + rompecabezasActual.filas);
        if (columna > 0) vecinos.push(indice - 1);
        if (columna < rompecabezasActual.filas - 1) vecinos.push(indice + 1);
        return vecinos;
    }

    function mostrarRompecabezas() {
        const total = rompecabezasActual.filas ** 2;
        tableroRompecabezas.style.setProperty('--filas-rompecabezas', rompecabezasActual.filas);
        tableroRompecabezas.innerHTML = '';
        document.getElementById('turns').textContent = movimientosRompecabezas;

        estado.forEach((pieza, indice) => {
            const elemento = document.createElement('div');
            elemento.className = 'pieza-rompecabezas';
            elemento.dataset.indice = indice;

            if (pieza === total - 1) {
                elemento.classList.add('vacia');
            } else if (rompecabezasActual.piezas) {
                const imagen = document.createElement('img');
                imagen.src = urlImagen(rompecabezasActual.piezas[pieza]);
                imagen.alt = 'Pieza del rompecabezas';
                elemento.appendChild(imagen);
            } else {
                const fila = Math.floor(pieza / rompecabezasActual.filas);
                const columna = pieza % rompecabezasActual.filas;
                elemento.style.backgroundImage = `url("${urlImagen(rompecabezasActual.guia)}")`;
                elemento.style.backgroundPosition = `${columna * 100 / (rompecabezasActual.filas - 1)}% ${fila * 100 / (rompecabezasActual.filas - 1)}%`;
            }

            if (!elemento.classList.contains('vacia')) {
                elemento.addEventListener('click', moverRompecabezas);
            }
            tableroRompecabezas.appendChild(elemento);
        });
    }

    function mezclarRompecabezas() {
        const total = rompecabezasActual.filas ** 2;
        estado = Array.from({ length: total }, (_, indice) => indice);
        let vacio = total - 1;

        for (let veces = 0; veces < 120; veces += 1) {
            const opciones = vecinosRompecabezas(vacio);
            const elegido = opciones[Math.floor(Math.random() * opciones.length)];
            [estado[vacio], estado[elegido]] = [estado[elegido], estado[vacio]];
            vacio = elegido;
        }

        movimientosRompecabezas = 0;
        mostrarRompecabezas();
    }

    function moverRompecabezas(evento) {
        const elegido = Number(evento.currentTarget.dataset.indice);
        const vacio = estado.indexOf(rompecabezasActual.filas ** 2 - 1);
        if (!vecinosRompecabezas(vacio).includes(elegido)) return;

        [estado[vacio], estado[elegido]] = [estado[elegido], estado[vacio]];
        movimientosRompecabezas += 1;
        mostrarRompecabezas();
    }

    function cargarRompecabezas(nombre) {
        rompecabezasActual = rompecabezas[nombre];
        imagenGuia.src = urlImagen(rompecabezasActual.guia);
        mezclarRompecabezas();
    }

    seleccionarRompecabezas.addEventListener('change', evento => {
        cargarRompecabezas(evento.target.value);
    });
    botonMezclar.addEventListener('click', mezclarRompecabezas);
    cargarRompecabezas('calle');
}

// Sopa de letras sobre Colombia.
const tableroSopa = document.getElementById('sopa-tablero');

if (tableroSopa) {
    const tamanoSopa = 10;
    const palabrasSopa = [
        { palabra: 'COLOMBIA', inicio: [0, 0], direccion: [0, 1] },
        { palabra: 'CULTURA', inicio: [2, 1], direccion: [0, 1] },
        { palabra: 'HISTORIA', inicio: [4, 0], direccion: [0, 1] },
        { palabra: 'NATURALEZA', inicio: [6, 0], direccion: [0, 1] },
        { palabra: 'BOGOTA', inicio: [0, 9], direccion: [1, 0] },
        { palabra: 'CAFE', inicio: [1, 8], direccion: [1, 0] },
        { palabra: 'PAISA', inicio: [8, 5], direccion: [0, 1] },
        { palabra: 'CUMBIA', inicio: [9, 2], direccion: [-1, 1] }
    ];
    const letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    const encontrados = new Set();
    const seleccion = [];
    const cuadricula = Array.from({ length: tamanoSopa }, () => Array(tamanoSopa).fill(''));

    function ponerPalabras() {
        palabrasSopa.forEach(({ palabra, inicio, direccion }) => {
            [...palabra].forEach((letra, indice) => {
                const fila = inicio[0] + direccion[0] * indice;
                const columna = inicio[1] + direccion[1] * indice;
                cuadricula[fila][columna] = letra;
            });
        });

        cuadricula.forEach(fila => fila.forEach((letra, columna, filaActual) => {
            if (!letra) filaActual[columna] = letras[Math.floor(Math.random() * letras.length)];
        }));
    }

    function mostrarLista() {
        const lista = document.getElementById('palabras-sopa');
        lista.innerHTML = '';
        palabrasSopa.forEach(({ palabra }) => {
            const item = document.createElement('li');
            item.textContent = palabra;
            item.dataset.palabra = palabra;
            if (encontrados.has(palabra)) item.classList.add('encontrada');
            lista.appendChild(item);
        });
        document.getElementById('palabras-encontradas').textContent = encontrados.size;
    }

    function mostrarTableroSopa() {
        tableroSopa.innerHTML = '';
        cuadricula.forEach((fila, numeroFila) => {
            fila.forEach((letra, numeroColumna) => {
                const celda = document.createElement('button');
                celda.type = 'button';
                celda.className = 'letra-sopa';
                celda.textContent = letra;
                celda.dataset.fila = numeroFila;
                celda.dataset.columna = numeroColumna;
                if (seleccion.some(([f, c]) => f === numeroFila && c === numeroColumna)) {
                    celda.classList.add('seleccionada');
                }
                celda.addEventListener('click', seleccionarLetra);
                tableroSopa.appendChild(celda);
            });
        });
    }

    function seleccionarLetra(evento) {
        const celda = evento.currentTarget;
        const posicion = [Number(celda.dataset.fila), Number(celda.dataset.columna)];

        if (seleccion.length === 2) seleccion.length = 0;
        seleccion.push(posicion);
        mostrarTableroSopa();

        if (seleccion.length === 2) comprobarSeleccion();
    }

    function comprobarSeleccion() {
        const [inicio, final] = seleccion;
        const diferenciaFila = final[0] - inicio[0];
        const diferenciaColumna = final[1] - inicio[1];
        const pasoFila = Math.sign(diferenciaFila);
        const pasoColumna = Math.sign(diferenciaColumna);
        const longitud = Math.max(Math.abs(diferenciaFila), Math.abs(diferenciaColumna)) + 1;

        if (diferenciaFila !== 0 && diferenciaColumna !== 0 && Math.abs(diferenciaFila) !== Math.abs(diferenciaColumna)) {
            seleccion.length = 0;
            mostrarTableroSopa();
            return;
        }

        const palabraSeleccionada = Array.from({ length: longitud }, (_, indice) => (
            cuadricula[inicio[0] + pasoFila * indice][inicio[1] + pasoColumna * indice]
        )).join('');
        const palabraAlReves = palabraSeleccionada.split('').reverse().join('');
        const encontrada = palabrasSopa.find(({ palabra }) => (
            !encontrados.has(palabra) && (palabra === palabraSeleccionada || palabra === palabraAlReves)
        ));

        if (encontrada) {
            encontrados.add(encontrada.palabra);
            const celdas = Array.from(tableroSopa.children);
            for (let indice = 0; indice < longitud; indice += 1) {
                const fila = inicio[0] + pasoFila * indice;
                const columna = inicio[1] + pasoColumna * indice;
                celdas[fila * tamanoSopa + columna].classList.add('encontrada');
            }
            mostrarLista();
        }

        seleccion.length = 0;
        setTimeout(mostrarTableroSopa, encontrada ? 500 : 0);
    }

    function reiniciarSopa() {
        encontrados.clear();
        seleccion.length = 0;
        for (let fila = 0; fila < tamanoSopa; fila += 1) {
            cuadricula[fila].fill('');
        }
        ponerPalabras();
        mostrarLista();
        mostrarTableroSopa();
    }

    document.getElementById('reiniciar-sopa').addEventListener('click', reiniciarSopa);
    reiniciarSopa();
}

// Crucigrama educativo sobre Colombia.
const tableroCrucigrama = document.getElementById('crucigrama-tablero');

if (tableroCrucigrama) {
    const tamanoCrucigrama = 13;
    const palabrasCrucigrama = [
        { palabra: 'COLOMBIA', pista: 'País donde vivimos.', direccion: 'H' },
        { palabra: 'CAFE', pista: 'Bebida que se cultiva mucho en Colombia.', direccion: 'H' },
        { palabra: 'CUMBIA', pista: 'Baile y ritmo tradicional colombiano.', direccion: 'H' },
        { palabra: 'PAISA', pista: 'Persona o cultura típica de Antioquia.', direccion: 'H' },
        { palabra: 'ANDES', pista: 'Cordillera que atraviesa Colombia.', direccion: 'V' },
        { palabra: 'BOGOTA', pista: 'Capital de Colombia.', direccion: 'V' },
        { palabra: 'CONDOR', pista: 'Ave que aparece en el escudo nacional.', direccion: 'V' },
        { palabra: 'AMAZONAS', pista: 'Región colombiana con gran selva.', direccion: 'V' }
    ];
    let cuadriculaCrucigrama;

    function puedeColocar(palabra, fila, columna, direccion) {
        for (let indice = 0; indice < palabra.length; indice += 1) {
            const actualFila = fila + (direccion === 'V' ? indice : 0);
            const actualColumna = columna + (direccion === 'H' ? indice : 0);
            if (actualFila < 0 || actualFila >= tamanoCrucigrama || actualColumna < 0 || actualColumna >= tamanoCrucigrama) return false;
            const letraActual = cuadriculaCrucigrama[actualFila][actualColumna];
            if (letraActual && letraActual !== palabra[indice]) return false;
        }
        return true;
    }

    function colocarPalabra(entrada, fila, columna, direccion) {
        entrada.fila = fila;
        entrada.columna = columna;
        entrada.direccion = direccion;
        for (let indice = 0; indice < entrada.palabra.length; indice += 1) {
            const actualFila = fila + (direccion === 'V' ? indice : 0);
            const actualColumna = columna + (direccion === 'H' ? indice : 0);
            cuadriculaCrucigrama[actualFila][actualColumna] = entrada.palabra[indice];
        }
    }

    function prepararCrucigrama() {
        cuadriculaCrucigrama = Array.from(
            { length: tamanoCrucigrama },
            () => Array(tamanoCrucigrama).fill('')
        );

        const primera = palabrasCrucigrama[0];
        colocarPalabra(primera, 6, 2, 'H');

        palabrasCrucigrama.slice(1).forEach(entrada => {
            let colocada = false;

            for (let fila = 0; fila < tamanoCrucigrama && !colocada; fila += 1) {
                for (let columna = 0; columna < tamanoCrucigrama && !colocada; columna += 1) {
                    for (const direccion of ['H', 'V']) {
                        if (!puedeColocar(entrada.palabra, fila, columna, direccion)) continue;

                        const cruza = entrada.palabra.split('').some((letra, indice) => {
                            const actualFila = fila + (direccion === 'V' ? indice : 0);
                            const actualColumna = columna + (direccion === 'H' ? indice : 0);
                            return cuadriculaCrucigrama[actualFila][actualColumna] === letra;
                        });

                        if (cruza) {
                            colocarPalabra(entrada, fila, columna, direccion);
                            colocada = true;
                            break;
                        }
                    }
                }
            }
        });
    }

    function mostrarPistas() {
        const horizontales = document.getElementById('pistas-horizontales');
        const verticales = document.getElementById('pistas-verticales');
        horizontales.innerHTML = '';
        verticales.innerHTML = '';

        palabrasCrucigrama.forEach((entrada, indice) => {
            const pista = document.createElement('li');
            pista.textContent = `${indice + 1}. ${entrada.pista}`;
            pista.dataset.numero = indice + 1;
            (entrada.direccion === 'H' ? horizontales : verticales).appendChild(pista);
        });
    }

    function mostrarTableroCrucigrama() {
        tableroCrucigrama.innerHTML = '';
        tableroCrucigrama.style.setProperty('--tamano-crucigrama', tamanoCrucigrama);

        const numerosCasillas = new Map();
        palabrasCrucigrama.forEach((entrada, indice) => {
            const clave = `${entrada.fila}-${entrada.columna}`;
            if (!numerosCasillas.has(clave)) numerosCasillas.set(clave, indice + 1);
        });

        cuadriculaCrucigrama.forEach((fila, numeroFila) => {
            fila.forEach((letra, numeroColumna) => {
                const casilla = document.createElement('div');
                casilla.className = letra ? 'casilla-crucigrama' : 'bloque-crucigrama';

                if (letra) {
                    const numero = numerosCasillas.get(`${numeroFila}-${numeroColumna}`);
                    if (numero) {
                        const etiqueta = document.createElement('span');
                        etiqueta.className = 'numero-crucigrama';
                        etiqueta.textContent = numero;
                        casilla.appendChild(etiqueta);
                    }
                    const entrada = document.createElement('input');
                    entrada.maxLength = 1;
                    entrada.dataset.fila = numeroFila;
                    entrada.dataset.columna = numeroColumna;
                    entrada.setAttribute('aria-label', 'Letra del crucigrama');
                    entrada.addEventListener('input', evento => {
                        evento.target.value = evento.target.value.toUpperCase().replace(/[^A-ZÑ]/g, '');
                    });
                    casilla.appendChild(entrada);
                }
                tableroCrucigrama.appendChild(casilla);
            });
        });
    }

    function comprobarCrucigrama() {
        let aciertos = 0;
        palabrasCrucigrama.forEach(entrada => {
            let correcta = true;
            for (let indice = 0; indice < entrada.palabra.length; indice += 1) {
                const fila = entrada.fila + (entrada.direccion === 'V' ? indice : 0);
                const columna = entrada.columna + (entrada.direccion === 'H' ? indice : 0);
                const input = tableroCrucigrama.querySelector(`input[data-fila="${fila}"][data-columna="${columna}"]`);
                if (!input || input.value !== entrada.palabra[indice]) correcta = false;
                if (input) input.classList.toggle('correcta', input.value === entrada.palabra[indice]);
            }
            if (correcta) aciertos += 1;
        });

        document.getElementById('aciertos-crucigrama').textContent = aciertos;
        if (aciertos === palabrasCrucigrama.length) alert('¡Excelente! Completaste el crucigrama.');
    }

    function reiniciarCrucigrama() {
        prepararCrucigrama();
        mostrarPistas();
        mostrarTableroCrucigrama();
        document.getElementById('aciertos-crucigrama').textContent = '0';
    }

    document.getElementById('comprobar-crucigrama').addEventListener('click', comprobarCrucigrama);
    document.getElementById('reiniciar-crucigrama').addEventListener('click', reiniciarCrucigrama);
    reiniciarCrucigrama();
}