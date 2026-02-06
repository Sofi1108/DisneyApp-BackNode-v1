document.addEventListener("DOMContentLoaded", () => {
  const btnOrden = document.getElementById("btn-ordenar-año");
  const textoOrden = document.getElementById("texto-orden");
  const iconoFlecha = document.getElementById("icono-flecha");

  if (btnOrden) {
    btnOrden.addEventListener("click", () => {
      const ordenActual = btnOrden.getAttribute("data-orden");
      const nuevoOrden = ordenActual === "desc" ? "asc" : "desc";

      btnOrden.setAttribute("data-orden", nuevoOrden);

      if (nuevoOrden === "desc") {
        textoOrden.textContent = "Más recientes";
        iconoFlecha.textContent = "arrow_downward";
      } else {
        textoOrden.textContent = "Más antiguos";
        iconoFlecha.textContent = "arrow_upward";
      }

      // Llamada segura a la función global de app.js
      if (typeof window.LoadMovies === "function") {
        const cat =
          typeof window.getCategoriaActual === "function"
            ? window.getCategoriaActual()
            : null;
        window.LoadMovies(cat, nuevoOrden);
      }
    });
  }
});
