
// 1. Seleccionamos los elementos del HTML que vamos a necesitar
const inputsFacturacion = document.querySelectorAll('input[name="facturacion"]');
const precios = document.querySelectorAll('.valor-precio');
const sufijos = document.querySelectorAll('.sufijo-precio');

// 2. Función para actualizar los precios y textos
function actualizarPrecios() {
    // Buscamos cuál opción está marcada (mensual o anual)
    const opcionSeleccionada = document.querySelector('input[name="facturacion"]:checked');

    // Si la opción es "anual", esta variable será verdadera (true)
    const esAnual = opcionSeleccionada.value === 'anual';

    // Recorremos todos los elementos de precio para cambiarlos
    precios.forEach((precio) => {
        if (esAnual) {
            // Si es anual, usamos el valor guardado en data-anual
            precio.textContent = precio.dataset.anual;
        } else {
            // Si no, usamos el valor de data-mensual
            precio.textContent = precio.dataset.mensual;
        }
    });

    // Recorremos los sufijos (el texto €/mes o €/año)
    sufijos.forEach((sufijo) => {
        if (esAnual) {
            sufijo.textContent = '€/año';
        } else {
            sufijo.textContent = '€/mes';
        }
    });
}

// 3. Escuchar cuando el usuario cambia la opción
inputsFacturacion.forEach((input) => {
    input.addEventListener('change', () => {
        actualizarPrecios();
    });
});

// 4. Ejecutar la función al cargar la página para que se vea correcto desde el inicio
actualizarPrecios();

// ESTA PARTE SE ENCARGA DE CUANDO ELIGES UN PLAN
// ------------------------------------------------------------------
const botonesPlan = document.querySelectorAll(".boton-plan");
const mensaje = document.getElementById("planSeleccionado");
botonesPlan.forEach((boton) => {
    boton.addEventListener("click", () => {
        // 1. ¿Qué plan hemos clickado?
        const nombrePlan = boton.dataset.plan;
        // 2. ¿Qué facturación hay seleccionada ahora mismo?
        const tipoFacturacion = document.querySelector('input[name="facturacion"]:checked').value;
        // 3. Mostramos un mensaje al usuario
        mensaje.textContent = `Has seleccionado el plan ${nombrePlan} con facturación ${tipoFacturacion}.`;
        // 4. Aquí es donde el sistema "registra" la elección.
        console.log("Elección registrada:", { plan: nombrePlan, facturacion: tipoFacturacion });
    });
});
