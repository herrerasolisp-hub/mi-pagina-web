// 1. Seleccionamos los elementos de la interfaz [cite: 19, 20, 23]
const urlInput = document.getElementById('urlInput');
const verifyBtn = document.getElementById('verifyBtn');
const resultArea = document.getElementById('resultArea');

verifyBtn.addEventListener('click', () => {
    let url = urlInput.value.trim();

    if (!url) {
        mostrarResultado("Por favor, ingresa una URL.", "error");
        return;
    }

    // Autocompletar el protocolo si falta
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
    }

    mostrarResultado("Conectando con el servidor remoto...", "espera");

    // Usamos el proxy público gratuito para evadir el bloqueo de CORS 
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    // Realizamos la llamada HTTP real uniendo el proxy con la URL del usuario
    fetch(proxyUrl + encodeURIComponent(url))
        .then(response => {
            // Si el código de red falla por completo (ej. 404 directo del proxy)
            if (!response.ok) {
                throw new Error("Error en el servidor proxy");
            }
            return response.text(); // Leemos el contenido real que nos devuelve el proxy
        })
        .then(texto => {
            /* ¡El truco clave! Si la página externa no existe o falla, 
               cors-anywhere incluye frases de error en su respuesta. 
               Verificamos si el texto contiene mensajes de fallo comunes:
            */
            if (texto.includes("Missing required request header") ||
                texto.includes("error") ||
                texto.includes("not found") ||
                texto.includes("Cannot GET")) {

                mostrarResultado("Error: La página no existe o el servidor remoto no respondió.", "error");
            } else {
                // Si no hay rastro de errores en el texto, el sitio es real y válido
                mostrarResultado("¡Éxito! La página existe y respondió correctamente.", "exito");

                // Requisito optativo: abrir en nueva pestaña
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1500);
            }
        })
        .catch(error => {
            // Gestionar casos donde el dominio no existe en absoluto o no hay internet
            console.error("Error de red detallado:", error);
            mostrarResultado("Error de conexión: El dominio no existe o está fuera de línea.", "error");
        });
});
// Función auxiliar para actualizar la retroalimentación visual [cite: 25, 88]
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