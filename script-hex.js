// Função para alternar entre as abas
function switchTab(tabName) {
    // Desativa todas as abas
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Ativa a aba selecionada
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Função para decodificar texto hexadecimal
function decodeHex() {
    let input = document.getElementById("decode-input").value;
    let outputElement = document.getElementById("decode-output");
    let errorElement = document.getElementById("decode-error");
    let preservedChars = document.getElementById("decode-preserved").value;
    
    errorElement.textContent = ""; // Limpa erros anteriores
    
    try {
        // Criar um mapa para armazenar os caracteres preservados e suas posições
        let preservedMap = new Map();
        let placeholders = new Map();
        let placeholderIndex = 0;
        
        // Se houver caracteres a preservar
        if (preservedChars) {
            // Para cada padrão hexadecimal que corresponde a um caractere preservado
            for (let char of preservedChars) {
                let hexPattern = `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`;
                let placeholder = `__PRESERVED_${placeholderIndex}__`;
                
                // Armazena o padrão hex e o placeholder correspondente
                placeholders.set(hexPattern, placeholder);
                
                // Substitui o padrão hex pelo placeholder
                let regex = new RegExp(hexPattern.replace(/\\/g, '\\\\'), 'g');
                input = input.replace(regex, placeholder);
                
                placeholderIndex++;
            }
        }
        
        // Decodifica normalmente, ignorando os placeholders
        let decoded = input.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => 
            String.fromCharCode(parseInt(hex, 16))
        );
        
        // Restaura os caracteres preservados
        if (preservedChars) {
            for (let [hexPattern, placeholder] of placeholders) {
                // Converte o padrão hex original em seu caractere
                let originalChar = String.fromCharCode(
                    parseInt(hexPattern.substring(2), 16)
                );
                
                // Substitui o placeholder pelo caractere original
                let regex = new RegExp(placeholder, 'g');
                decoded = decoded.replace(regex, hexPattern);
            }
        }
        
        outputElement.textContent = decoded;
    } catch (error) {
        errorElement.textContent = "Erro ao decodificar! Verifique a entrada. " + error.message;
        outputElement.textContent = "";
    }
}

// Função para codificar texto em hexadecimal
function encodeToHex() {
    let input = document.getElementById("encode-input").value;
    let outputElement = document.getElementById("encode-output");
    let errorElement = document.getElementById("encode-error");
    let preservedChars = document.getElementById("encode-preserved").value;
    
    errorElement.textContent = ""; // Limpa erros anteriores
    
    try {
        // Criar um conjunto dos caracteres a serem preservados
        let preserveSet = new Set(preservedChars.split(''));
        
        // Codifica cada caractere, exceto os preservados
        let encoded = '';
        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            // Se o caractere estiver na lista de preservados, mantém ele como está
            if (preserveSet.has(char)) {
                encoded += char;
            } else {
                // Caso contrário, converte para hexadecimal
                encoded += "\\x" + char.charCodeAt(0).toString(16).padStart(2, '0');
            }
        }
        
        outputElement.textContent = encoded;
    } catch (error) {
        errorElement.textContent = "Erro ao codificar! Verifique a entrada. " + error.message;
        outputElement.textContent = "";
    }
}

// Função para limpar campos de entrada
function clearInput(inputId) {
    document.getElementById(inputId).value = "";
    
    // Limpa também o output correspondente
    if (inputId === "decode-input") {
        document.getElementById("decode-output").textContent = "";
        document.getElementById("decode-error").textContent = "";
    } else {
        document.getElementById("encode-output").textContent = "";
        document.getElementById("encode-error").textContent = "";
    }
}

// Função para copiar o resultado para a área de transferência
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    
    if (!text) return; // Se não houver texto, não faz nada
    
    // Cria um elemento temporário para copiar o texto
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast();
    } catch (err) {
        console.error('Falha ao copiar texto:', err);
    }
    
    document.body.removeChild(textarea);
}

// Função para mostrar a notificação de texto copiado
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}