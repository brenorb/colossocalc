// Constantes
const MAX_WEIGHT = 300;
const MIN_WEIGHT = 0.1;

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
 * Formata o resultado para exibição
 * @param {number} dosage - Dosagem em ml
 * @returns {string} Texto formatado
 */
function formatResult(dosage) {
    // Converte para string e remove zeros desnecessários
    const dosageStr = dosage.toFixed(1).replace(/\.0$/, '');
    return `${dosageStr} ml de caldo de osso por dia`;
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

    if (errorMessage) {
        // Exibe erro
        resultText.textContent = errorMessage;
        resultText.classList.add('error');
    } else if (warningMessage && dosage !== null) {
        // Exibe resultado com aviso
        const result = formatResult(dosage);
        resultText.textContent = ''; // Limpa conteúdo anterior
        
        // Cria elemento de texto para o resultado
        const resultSpan = document.createElement('span');
        resultSpan.textContent = result;
        resultText.appendChild(resultSpan);
        
        // Adiciona quebra de linha
        resultText.appendChild(document.createElement('br'));
        
        // Cria elemento de aviso
        const warningSmall = document.createElement('small');
        warningSmall.textContent = warningMessage;
        warningSmall.style.color = 'var(--text-light)';
        warningSmall.style.fontSize = '0.875rem';
        warningSmall.style.fontWeight = 'normal';
        resultText.appendChild(warningSmall);
        
        resultText.classList.add('highlight');
    } else if (dosage !== null) {
        // Exibe resultado normal
        resultText.textContent = formatResult(dosage);
        resultText.classList.add('success', 'highlight');
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

