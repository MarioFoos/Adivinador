// Definición de los estados de la secuencia
const shortTransition = {
    duracion: 500,
    imagen: "robot1.gif",
    texto: "Procesando..."
};
const finalTransition = {
    duracion: 1500,
    imagen: "robot1.gif",
    texto: "Procesando..."
};

let num1, num2;
let estados;
let initRand = false;

function genRandoms()
{
    num1 = Math.floor(Math.random()*5) + 3; // 3 a 7
    num2 = Math.floor(Math.random()*3) + 2; // 2 a 4

    estados = [
    {
        id: 1,
        titulo: "Piensa en un número",
        descripcion: "Ten a mano una calculadora para los siguientes pasos",
        imagen: "robot0.png",
    },
    {
        id: 2,
        transicion: shortTransition
    },
    {
        id: 3,
        titulo: "Sumale " + (3*num1),
        descripcion: "Guarda el resultado, lo seguiremos usando",
        imagen: "robot0.png",
    },
    {
        id: 4,
        transicion: shortTransition
    },
    {
        id: 5,
        titulo: "Multiplicalo por 3",
        descripcion: "Multiplica por 3 el resultado anterior y guarda el número",
        imagen: "robot0.png",
    },
    {
        id: 6,
        transicion: shortTransition
    },
    {
        id: 7,
        titulo: "Resta 6",
        descripcion: "Restale 6 al resultado anterior y guarda el número",
        imagen: "robot0.png",
    },
    {
        id: 8,
        transicion: shortTransition
    },
    {
        id: 9,
        titulo: "Divide por 3",
        descripcion: "Divide por 3 el resultado anterior y guarda el número",
        imagen: "robot0.png",
    },
    {
        id: 10,
        transicion: shortTransition
    },
    {
        id: 11,
        titulo: "Resta " + (2*num1 - num2),
        descripcion: "Por último, resta lo indicado al resutaldo anterior",
        imagen: "robot0.png",
    },
    {
        id: 12,
        transicion: shortTransition
    },
    {
        id: 13,
        titulo: "¿Qué resultado obtuviste al final?",
        descripcion: "Ingresa el resultado: ",
        imagen: "robot0.png",
    },
    {
        id: 14,
        transicion: finalTransition
    }];    
    initRand = true;
    console.log("a: " + num1 + ". b: " + num2);
}

function getEstados()
{
    if(!initRand)
    {
        genRandoms();
    }
    return estados;
}

function getNum1()
{
    if(!initRand)
    {
        genRandoms();
    }
    return num1;
}

function getNum2()
{
    if(!initRand)
    {
        genRandoms();
    }
    return num2;
}

function getLastOp()
{
    return 2*getNum1() - getNum2();
}

// Resultado final
const resultadoFinal = {
    titulo: "¡Fin del análisis!",
    descripcion: "¡El numero que elegiste es!",
    imagen: "robot2.png"
};

// Variables globales
let estadoActual = 0;
const totalEstados = getEstados().length;
let timeoutTransicion = null;
let enTransicion = false;

// Elementos del DOM
const currentImage = document.getElementById('current-image');
const currentTitle = document.getElementById('current-title');
const currentDescription = document.getElementById('current-description');
const progressFill = document.getElementById('progress-fill');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const content = document.querySelector('.content');
const finalResult = document.getElementById('final-result');
const resultImage = document.getElementById('result-image');
const backToSequence = document.getElementById('back-to-sequence');
const inputContainer = document.getElementById('input-container');
const inputNumber = document.getElementById('input-number');

// Función para mostrar estado de transición
function mostrarTransicion(transicion) {
    enTransicion = true;

    // Guardar el estado actual antes de la transición
    const estadoPrevio = getEstados()[estadoActual];

    // Cambiar a la interfaz de transición
    currentImage.src = transicion.imagen;
    currentImage.alt = "Transición";
    currentTitle.textContent = transicion.texto;
    currentDescription.textContent = "";

    // Deshabilitar botones durante la transición
    nextBtn.disabled = true;
    restartBtn.disabled = true;

    // Configurar timeout para avanzar automáticamente
    timeoutTransicion = setTimeout(() => {
        enTransicion = false;
        estadoActual++;

        // Rehabilitar botones
        nextBtn.disabled = false;
        restartBtn.disabled = false;

        if (estadoActual < totalEstados) {
            actualizarInterfaz();
        } else {
            mostrarResultadoFinal();
        }
    }, transicion.duracion + Math.random() * 200);
}

// Función para actualizar la interfaz
function actualizarInterfaz() {
    if (enTransicion) return;

    const estado = getEstados()[estadoActual];

    // Verificar si este estado tiene transición automática
    if (estado.transicion && !enTransicion) {
        if (estadoActual === estado.id - 1) { // Verificar que aún estamos en el mismo estado
            mostrarTransicion(estado.transicion);
        }
    }
    else {
        // Actualizar contenido
        currentImage.src = estado.imagen;
        currentImage.alt = estado.titulo;
        currentTitle.textContent = estado.titulo;
        currentDescription.textContent = estado.descripcion;
        inputContainer.style.display = (estadoActual === totalEstados - 2) ? "block" : "none";

        // Actualizar progreso
        const progreso = ((estadoActual + 1) / totalEstados) * 100;
        progressFill.style.width = `${progreso}%`;

        // Actualizar botones
        nextBtn.disabled = enTransicion;
        restartBtn.disabled = enTransicion;

        if (estadoActual === totalEstados - 2) {
            nextBtn.textContent = 'Ver Resultado';
        } else {
            nextBtn.textContent = 'Siguiente';
        }
    }
}

// Función para ir al siguiente estado
function siguienteEstado() {
    if (enTransicion) return;
    if (estadoActual === totalEstados - 2 && !inputNumber.value.trim()) return;

    if (estadoActual < totalEstados - 1) {
        estadoActual++;
        actualizarInterfaz();
    } else {
        // Convertir a número entero
        mostrarResultadoFinal();
    }
}

// Función para ir al estado anterior
function estadoAnterior() {
    if (enTransicion) return;

    // Limpiar timeout de transición si existe
    if (timeoutTransicion) {
        clearTimeout(timeoutTransicion);
        timeoutTransicion = null;
        enTransicion = false;

        // Remover clases de animación
        currentImage.classList.remove('animating');
        currentTitle.classList.remove('animating');

        // Rehabilitar botones
        nextBtn.disabled = false;
        restartBtn.disabled = false;
    }

    if (estadoActual > 0) {
        estadoActual--;
        actualizarInterfaz();
    }
}

// Función para reiniciar la secuencia
function reiniciarSecuencia() {
    // Limpiar timeout de transición si existe
    if (timeoutTransicion) {
        clearTimeout(timeoutTransicion);
        timeoutTransicion = null;
    }

    enTransicion = false;
    estadoActual = 0;
    inputNumber.value = null;
    genRandoms();

    // Remover clases de animación
    currentImage.classList.remove('animating');
    currentTitle.classList.remove('animating');

    actualizarInterfaz();
    content.classList.remove('hidden');
    finalResult.classList.add('hidden');

    // Rehabilitar botones
    nextBtn.disabled = false;
    restartBtn.disabled = false;
}

// Función para mostrar el resultado final
function mostrarResultadoFinal() {
    content.classList.add('hidden');
    finalResult.classList.remove('hidden');

    const numero = parseInt(inputNumber.value.trim());
    resultadoFinal.descripcion = '¡El número en que pensaste es ' + (numero - (getNum1() + getNum2() - 2 )) + '!';

    // Configurar el resultado final
    const resultadoTitle = finalResult.querySelector('h2');
    const resultadoDescription = finalResult.querySelector('p');

    resultadoTitle.textContent = resultadoFinal.titulo;
    resultadoDescription.textContent = resultadoFinal.descripcion;
    resultImage.src = resultadoFinal.imagen;
    resultImage.alt = resultadoFinal.titulo;
}

// Event Listeners
nextBtn.addEventListener('click', siguienteEstado);
restartBtn.addEventListener('click', reiniciarSecuencia);
backToSequence.addEventListener('click', reiniciarSecuencia);

// Teclado: flechas para navegar
document.addEventListener('keydown', (e) => {
    if (enTransicion) return;

    if (e.key === 'ArrowLeft') {
        estadoAnterior();
    } else if (e.key === 'ArrowRight') {
        siguienteEstado();
    }
});

// Inicializar
actualizarInterfaz();