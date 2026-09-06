AbortController
// Obtener el elemento del tablero
const tablero = document.getElementById('tablero');
// Crear las piezas del rompecabezas
for (let i = 0; i < 9; i++) {
    const pieza = document.createElement('div');
    pieza.classList.add('pieza');
    tablero.appendChild(pieza);
}
tablero.addEventListener('click', function(event) {
    if (event.target.classList.contains('pieza')) {
        event.target.style.filter = 'blur(0)';
    }}, { once: true });
    


