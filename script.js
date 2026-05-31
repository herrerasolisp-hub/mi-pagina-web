// 1. Seleccionamos los elementos de la interfaz
const urlInput = document.getElementById('urlInput');
const verifyBtn = document.getElementById('verifyBtn');
const resultArea = document.getElementById('resultArea');

verifyBtn.addEventListener('click', () => {
    let url = urlInput.value.trim();

    // Validación inicial: ¿El campo está vacío?
    if (!url) {
        mostrarResultado("Por favor, ingresa una URL.", "error");
        return; 
    }

    // Autocompletar el protocolo si el usuario lo olvida (indispensable para GitHub Pages)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url; 
    }

    mostrarResultado("Verificando disponibilidad de la página...", "espera");

    /* 2. VALIDACIÓN NATIVA COMPLETA (Sin Proxy)
       Utilizamos el constructor nativo 'new URL()' del navegador. 
       Si la estructura de la dirección es falsa o imposible, el navegador arrojará un error de inmediato.
    */
    try {
        const urlValidada = new URL(url);
        
        // Intentamos un fetch directo en modo 'no-cors'
        // Esto envía una petición limpia a la red para ver si el servidor responde, sin que CORS bloquee la app
        fetch(urlValidada, { mode: 'no-cors' })
            .then(() => {
                // Si la red procesa la petición (incluso si la página restringe CORS), significa que el servidor existe y está activo
                mostrarResultado("¡Éxito! La página existe y respondió correctamente.", "exito");
                
                // Abrir la URL en una nueva pestaña (Requisito optativo)
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1500);
            })
            .catch(error => {
                // Si el internet no encuentra el servidor (ej. el dominio no existe) cae aquí
                console.error("Error de existencia:", error);
                mostrarResultado("Error: El dominio no existe o el servidor está fuera de línea.", "error");
            });

    } catch (e) {
        // Si 'new URL()' detecta que la escritura es inválida (ej: "https://...hola")
        mostrarResultado("Error: La URL no tiene un formato válido.", "error");
    }
});

// Función auxiliar para actualizar la retroalimentación visual (colores y bordes)
function mostrarResultado(mensaje, tipo) {
    resultArea.textContent = mensaje;
    resultArea.style.backgroundColor = "transparent";
    resultArea.style.border = "none";

    if (tipo === "exito") {
        resultArea.style.color = "#155724";
        resultArea.style.backgroundColor = "#d4edda";
        resultArea.style.border = "1px solid #c3e6cb";
    } else if (tipo === "error") {
        resultArea.style.color = "#721c24";
        resultArea.style.backgroundColor = "#f8d7da";
        resultArea.style.border = "1px solid #f5c6cb";
    } else if (tipo === "espera") {
        resultArea.style.color = "#856404";
        resultArea.style.backgroundColor = "#fff3cd";
        resultArea.style.border = "1px solid #ffeeba";
    }
}