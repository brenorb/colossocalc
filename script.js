// Constantes
const MAX_WEIGHT = 300;
const MIN_WEIGHT = 0.1;
const ML_PER_CUP = 200; // 1 xícara = 200ml

// Elementos DOM
const calculatorForm = document.getElementById('calculator-form');
const weightInput = document.getElementById('weight-input');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');

/**
 * Valida a entrada do usuário
 * @param {string|number} weight - Peso em kg
 * @returns {object} { isValid: boolean, error: string|null }
 */
function validateInput(weight) {
    // Verifica se a entrada está vazia
    if (weight === '' || weight === null || weight === undefined) {
        return {
            isValid: false,
            error: 'Por favor, informe seu peso.'
        };
    }

    // Converte para número
    const weightNum = parseFloat(weight);

    // Verifica se é um número válido
    if (isNaN(weightNum)) {
        return {
            isValid: false,
            error: 'Por favor, informe um número válido.'
        };
    }

    // Verifica se é maior que zero
    if (weightNum <= 0) {
        return {
            isValid: false,
            error: 'O peso deve ser maior que zero.'
        };
    }

    // Verifica se está abaixo do mínimo
    if (weightNum < MIN_WEIGHT) {
        return {
            isValid: false,
            error: `O peso mínimo é ${MIN_WEIGHT} kg.`
        };
    }

    // Verifica se está acima do máximo (opcional, apenas aviso)
    if (weightNum > MAX_WEIGHT) {
        // Permite calcular, mas pode mostrar aviso
        return {
            isValid: true,
            error: null,
            warning: `Peso acima de ${MAX_WEIGHT} kg. Verifique se o valor está correto.`
        };
    }

    return {
        isValid: true,
        error: null
    };
}

/**
 * Calcula a dosagem diária de caldo de osso
 * @param {number} weight - Peso em kg
 * @returns {number} Dosagem em ml (arredondada para 1 casa decimal)
 */
function calculateDosage(weight) {
    // Fórmula: (peso_kg / 10) × 30
    const dosage = (weight / 10) * 30;
    
    // Arredonda para 1 casa decimal
    return Math.round(dosage * 10) / 10;
}

/**
 * Converte mililitros para xícaras, arredondando para cima para múltiplos de 0.5
 * @param {number} ml - Quantidade em mililitros
 * @returns {number} Quantidade em xícaras (arredondada para cima para múltiplos de 0.5)
 */
function mlToCups(ml) {
    const cups = ml / ML_PER_CUP;
    // Arredonda para cima para o próximo múltiplo de 0.5
    return Math.ceil(cups * 2) / 2;
}

/**
 * Formata o número de xícaras em texto em português
 * @param {number} cups - Número de xícaras (deve ser múltiplo de 0.5)
 * @returns {string} Texto formatado em português
 */
function formatCups(cups) {
    const wholeCups = Math.floor(cups);
    const hasHalf = cups % 1 === 0.5;
    
    // Array com números por extenso
    const numbers = [
        'zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 
        'seis', 'sete', 'oito', 'nove', 'dez'
    ];
    
    let result = '';
    
    if (wholeCups === 0 && hasHalf) {
        return 'meia xícara';
    }
    
    if (wholeCups > 0) {
        if (wholeCups <= 10) {
            result = numbers[wholeCups];
        } else {
            result = wholeCups.toString();
        }
        result += wholeCups === 1 ? ' xícara' : ' xícaras';
    }
    
    if (hasHalf) {
        if (wholeCups > 0) {
            result += ' e meia';
        } else {
            result = 'meia xícara';
        }
    }
    
    return result;
}

/**
 * Formata o resultado para exibição com xícaras como formato principal e ml como secundário
 * @param {number} dosage - Dosagem em ml
 * @returns {object} { cupsText: string, mlText: string } - Textos formatados para xícaras e ml
 */
function formatResult(dosage) {
    // Converte ml para xícaras
    const cups = mlToCups(dosage);
    const cupsText = formatCups(cups);
    
    // Formata ml mantendo 1 casa decimal
    const dosageStr = dosage.toFixed(1).replace(/\.0$/, '');
    const mlText = `${dosageStr} ml`;
    
    return {
        cupsText: `${cupsText} de caldo de osso por dia`,
        mlText: mlText
    };
}

/**
 * Exibe o resultado no DOM
 * @param {number|null} dosage - Dosagem calculada ou null para erro
 * @param {string|null} errorMessage - Mensagem de erro (se houver)
 * @param {string|null} warningMessage - Mensagem de aviso (se houver)
 */
function displayResult(dosage, errorMessage = null, warningMessage = null) {
    // Remove classes anteriores
    resultText.classList.remove('success', 'error', 'highlight');
    resultContainer.classList.remove('hidden');
    
    // Limpa conteúdo anterior
    resultText.textContent = '';

    if (errorMessage) {
        // Exibe erro
        resultText.textContent = errorMessage;
        resultText.classList.add('error');
    } else if (dosage !== null) {
        // Formata resultado com xícaras e ml
        const formatted = formatResult(dosage);
        
        // Cria elemento principal com xícaras
        const cupsSpan = document.createElement('span');
        cupsSpan.textContent = formatted.cupsText;
        resultText.appendChild(cupsSpan);
        
        // Adiciona ml como texto secundário (display: block força quebra de linha)
        const mlSpan = document.createElement('span');
        mlSpan.className = 'result-secondary';
        mlSpan.textContent = `(${formatted.mlText})`;
        resultText.appendChild(mlSpan);
        
        // Adiciona aviso se houver
        if (warningMessage) {
            const warningSmall = document.createElement('small');
            warningSmall.className = 'result-warning';
            warningSmall.textContent = warningMessage;
            warningSmall.style.color = 'var(--text-light)';
            warningSmall.style.fontSize = '0.875rem';
            warningSmall.style.fontWeight = 'normal';
            warningSmall.style.display = 'block';
            warningSmall.style.marginTop = '0.5rem';
            resultText.appendChild(warningSmall);
            resultText.classList.add('highlight');
        } else {
            resultText.classList.add('success', 'highlight');
        }
    }
}

/**
 * Processa o cálculo quando o formulário é submetido
 * @param {Event} event - Evento do formulário
 */
function handleCalculate(event) {
    event.preventDefault();

    const weight = weightInput.value.trim();
    const validation = validateInput(weight);

    if (!validation.isValid) {
        displayResult(null, validation.error);
        return;
    }

    const weightNum = parseFloat(weight);
    const dosage = calculateDosage(weightNum);
    
    displayResult(dosage, null, validation.warning || null);
}

// Event listeners
calculatorForm.addEventListener('submit', handleCalculate);

// Inicialização: esconde o resultado inicialmente
resultContainer.classList.add('hidden');

