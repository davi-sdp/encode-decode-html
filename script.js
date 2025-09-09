// Elementos do DOM
const inputText = document.getElementById('inputText');
const encodingType = document.getElementById('encodingType');
const caesarShift = document.getElementById('caesarShift');
const caesarShiftGroup = document.getElementById('caesarShiftGroup');
const charsetType = document.getElementById('charsetType');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const outputResult = document.getElementById('outputResult');

// Mostrar/ocultar opções específicas
encodingType.addEventListener('change', function() {
    if (this.value === 'caesar') {
        caesarShiftGroup.style.display = 'block';
    } else {
        caesarShiftGroup.style.display = 'none';
    }
});

// Eventos de clique
encodeBtn.addEventListener('click', () => processText(true));
decodeBtn.addEventListener('click', () => processText(false));

// Função principal para processar o texto
function processText(encode) {
    const text = inputText.value;
    const encoding = encodingType.value;
    const charset = charsetType.value;
    
    if (!text) {
        outputResult.textContent = 'Por favor, insira um texto para processar.';
        return;
    }
    
    let result;
    
    switch (encoding) {
        case 'caesar':
            const shift = parseInt(caesarShift.value);
            result = caesar(text, shift, encode);
            break;
        case 'atbash':
            result = atbash(text);
            break;
        case 'base64':
            result = encode ? btoa(encodeURIComponent(text)) : decodeURIComponent(atob(text));
            break;
        case 'rot13':
            result = rot13(text);
            break;
        case 'binary':
            result = encode ? textToBinary(text) : binaryToText(text);
            break;
        case 'hex':
            result = encode ? textToHex(text) : hexToText(text);
            break;
        case 'url':
            result = encode ? encodeURIComponent(text) : decodeURIComponent(text);
            break;
        case 'morse':
            result = encode ? textToMorse(text) : morseToText(text);
            break;
        default:
            result = 'Tipo de codificação não suportado';
    }
    
    outputResult.textContent = result;
}

// Implementações de codificação e decodificação

// Cifra de César
function caesar(text, shift, encode) {
    if (!encode) {
        shift = 26 - (shift % 26);
    }
    
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        
        // Maiúsculas (A-Z)
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Minúsculas (a-z)
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

// Atbash
function atbash(text) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        
        // Maiúsculas (A-Z)
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(90 - (code - 65));
        }
        // Minúsculas (a-z)
        else if (code >= 97 && code <= 122) {
            return String.fromCharCode(122 - (code - 97));
        }
        return char;
    }).join('');
}

// ROT13
function rot13(text) {
    return caesar(text, 13, true);
}

// Texto para Binário
function textToBinary(text) {
    return text.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2);
        return '0'.repeat(8 - binary.length) + binary;
    }).join(' ');
}

// Binário para Texto
function binaryToText(binary) {
    try {
        return binary.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    } catch (e) {
        return 'Erro: Entrada binária inválida';
    }
}

// Texto para Hexadecimal
function textToHex(text) {
    return text.split('').map(char => {
        const hex = char.charCodeAt(0).toString(16);
        return ('0' + hex).slice(-2);
    }).join(' ');
}

// Hexadecimal para Texto
function hexToText(hex) {
    try {
        return hex.split(' ').map(h => {
            return String.fromCharCode(parseInt(h, 16));
        }).join('');
    } catch (e) {
        return 'Erro: Entrada hexadecimal inválida';
    }
}

// Texto para Código Morse
function textToMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
        ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
    };
    
    return text.toUpperCase().split('').map(char => {
        if (morseCode[char]) {
            return morseCode[char];
        } else if (char === ' ') {
            return '/';
        }
        return '';
    }).join(' ');
}

// Código Morse para Texto
function morseToText(morse) {
    const morseToChar = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
        '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
        '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
        '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
        '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/', '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':',
        '-.-.-.': ';', '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@'
    };
    
    return morse.split(' ').map(m => {
        if (m === '/') {
            return ' ';
        }
        return morseToChar[m] || '';
    }).join('');
}