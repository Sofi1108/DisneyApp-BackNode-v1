const formulario = document.getElementById("formulario-login");
const inputCorreo = document.getElementById("correo");
const inputContrasena = document.getElementById("contrasena");
const errorCorreo = document.getElementById("error-correo");
const errorContrasena = document.getElementById("error-contrasena");
const mensaje = document.getElementById("mensaje-login");

const botonVer = document.getElementById("botonVerContrasena");

function limpiarErrores() {
    errorCorreo.textContent = "";
    errorContrasena.textContent = "";
    mensaje.textContent = "";
}

function validar() {
    let ok = true;
    limpiarErrores();

    const correo = inputCorreo.value.trim();
    const contrasena = inputContrasena.value;

    if (!correo) {
        errorCorreo.textContent = "Escribe tu correo.";
        ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
        errorCorreo.textContent = "El formato del correo no es válido.";
        ok = false;
    }

    if (!contrasena) {
        errorContrasena.textContent = "Escribe tu contraseña.";
        ok = false;
    } else if (contrasena.length < 6) {
        errorContrasena.textContent = "Mínimo 6 caracteres.";
        ok = false;
    }

    return ok;
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validar()) return;

    // Demo (sin backend): simula inicio de sesión correcto
    mensaje.textContent = "✅ Inicio de sesión simulado. (Aquí iría la validación real con API)";
});

botonVer.addEventListener("click", () => {
    const esPassword = inputContrasena.type === "password";
    inputContrasena.type = esPassword ? "text" : "password";
    botonVer.querySelector(".icono").textContent = esPassword ? "visibility_off" : "visibility";
});