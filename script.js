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

    // Usamos un proxy público gratuito para evadir el bloqueo de CORS 
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    // Realizamos la llamada HTTP real utilizando fetch 
    fetch(encodeURIComponent(url))
        .then(response => {
            // response.ok es verdadero si el servidor respondió con un código de éxito (200 al 299)
            if (response.ok) {
                mostrarResultado("¡Éxito! La página existe y respondió correctamente.", "exito");
                
                // Requisito optativo: abrir en nueva pestaña [cite: 24, 44]
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1500);
            } else {
                // Si el servidor responde pero con códigos de error (ej. 404 Not Found, 500 Error) 
                mostrarResultado(`Error del servidor: El sitio web respondió con un problema de red.`, "error");
            }
        })
        .catch(error => {
            // Gestionar casos donde el dominio no existe en absoluto o no hay internet [cite: 43, 84]
            console.error("Error de red detallado:", error);
            mostrarResultado("Error de conexión: El dominio no existe o el servidor no respondió.", "error");
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