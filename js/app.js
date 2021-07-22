// Variables y selectores
const formulario   = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante    = Number(presupuesto);
        this.gastos      = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // extraer valor
        const { presupuesto, restante} = cantidad;

        // agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    };

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje =  document.createElement('div');
        divMensaje.textContent = mensaje;
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success')
        }
        
        // insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Eliminar el HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    agregarGastoListado(gastos) {

        // limpiar HTML
        limpiarHTML();

        // iterar sobre los gastos
        gastos.forEach( gasto => {

            const {cantidad, nombre, id } = gasto;

            // Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            // Agregar el HTML del gasto 
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            // Boton para remover el gasto 
            const btnBorrar = document.createElement('button');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
        
    }

    agregarRestante (restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // comprobar 25%
        if ((presupuesto/4) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto/2) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    }
}

// instanciar 
let presupuesto;
const ui = new UI();

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto');
    console.log(presupuestoUsuario);

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value); 

    // Validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return; 
    }

    // generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now()};

    // Anade un nuveo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de correcto
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const { gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    ui.agregarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reiniciar el formulario
    formulario.reset();
    
}

// limpiar HTML del listado

function limpiarHTML() {
    while (gastoListado.firstChild) {
        gastoListado.removeChild(gastoListado.firstChild);
    }
}

// Eliminar gasto 

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.agregarRestante(restante)
    ui.comprobarPresupuesto(presupuesto);
}