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