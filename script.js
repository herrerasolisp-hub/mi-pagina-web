const urlInput = document.getElementById('urlInput');
const verifyBtn = document.getElementById('verifyBtn');
const resultArea = document.getElementById('resultArea');

verifyBtn.addEventListener('click', () => {
    let url = urlInput.value.trim();
    if (!url) {
        mostrarResultado("Por favor, ingresa una URL.", "error");
        return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' +url;
        urlInput.value = url;    
    }
    mostrarResultado("Verificando el formato y la existencia de la URL...", "espera");
    const expresionURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    setTimeout(() => {
        if (expresionURL.test(url)) {
            mostrarResultado("¡Éxito! La URL es válida y existe. Abriendo una nueva pestaña...", "exito");

            setTimeout(() => {
                window.open(url, '_blank');
            }, 1200);
            
            
        } else {
            mostrarResultado("Error: La URL no tiene formato válido o el dominio no existe.", "error");

        }
    }, 800);
});        
    
        
function mostrarResultado(mensaje, tipo) {
    resultArea.textContent = mensaje;
              
    resultArea.style.backgroundColor = "transparent";
    resultArea.style.border = "none";
            
    if (tipo === "exito") {
        resultArea.style.color = "#155724";
        resultArea.style.backgroundColor = "#d4edda";
        resultArea.style.border = "1px solid #c3e6cb";
    } else if (tipo === "espera") {
        resultArea.style.color = "#856404";
        resultArea.style.backgroundColor = "#fff3cd";
        resultArea.style.border = "1px solid #ffeeba";
    }    
                
            
}

