/**
 * Unit Tests for ColossoCalc
 * Run with: node tests/test.js
 */

const assert = require('assert');

// Constants (matching script.js)
const ML_PER_CUP = 200;
const MAX_WEIGHT = 300;
const MIN_WEIGHT = 0.1;

// Test functions (copied from script.js for testing)
function mlToCups(ml) {
    const cups = ml / ML_PER_CUP;
    return Math.ceil(cups * 2) / 2;
}

function formatCups(cups) {
    const wholeCups = Math.floor(cups);
    const hasHalf = cups % 1 === 0.5;
    
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

function formatResult(dosage) {
    const cups = mlToCups(dosage);
    const cupsText = formatCups(cups);
    
    const dosageStr = dosage.toFixed(1).replace(/\.0$/, '');
    const mlText = `${dosageStr} ml`;
    
    return {
        cupsText: `${cupsText} de caldo de osso por dia`,
        mlText: mlText
    };
}

function calculateDosage(weight) {
    const dosage = (weight / 10) * 30;
    return Math.round(dosage * 10) / 10;
}

function validateInput(weight) {
    if (weight === '' || weight === null || weight === undefined) {
        return {
            isValid: false,
            error: 'Por favor, informe seu peso.'
        };
    }

    const weightNum = parseFloat(weight);

    if (isNaN(weightNum)) {
        return {
            isValid: false,
            error: 'Por favor, informe um número válido.'
        };
    }

    if (weightNum <= 0) {
        return {
            isValid: false,
            error: 'O peso deve ser maior que zero.'
        };
    }

    if (weightNum < MIN_WEIGHT) {
        return {
            isValid: false,
            error: `O peso mínimo é ${MIN_WEIGHT} kg.`
        };
    }

    if (weightNum > MAX_WEIGHT) {
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

// Test runner
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    testsRun++;
    try {
        fn();
        testsPassed++;
        console.log(`✅ ${name}`);
    } catch (error) {
        testsFailed++;
        console.error(`❌ ${name}`);
        console.error(`   ${error.message}`);
        if (error.stack) {
            console.error(`   ${error.stack.split('\n')[1]}`);
        }
    }
}

// Test Suite: mlToCups
console.log('\n=== Testing mlToCups ===\n');

test('mlToCups: 30ml should round to 0.5 cups', () => {
    assert.strictEqual(mlToCups(30), 0.5);
});

test('mlToCups: 100ml should round to 0.5 cups (rounds up)', () => {
    assert.strictEqual(mlToCups(100), 0.5);
});

test('mlToCups: 150ml should round to 1 cup', () => {
    assert.strictEqual(mlToCups(150), 1);
});

test('mlToCups: 200ml should be exactly 1 cup', () => {
    assert.strictEqual(mlToCups(200), 1);
});

test('mlToCups: 250ml should round to 1.5 cups', () => {
    assert.strictEqual(mlToCups(250), 1.5);
});

test('mlToCups: 300ml should be exactly 1.5 cups', () => {
    assert.strictEqual(mlToCups(300), 1.5);
});

test('mlToCups: 350ml should round to 2 cups', () => {
    assert.strictEqual(mlToCups(350), 2);
});

test('mlToCups: 400ml should be exactly 2 cups', () => {
    assert.strictEqual(mlToCups(400), 2);
});

test('mlToCups: 450ml should round to 2.5 cups', () => {
    assert.strictEqual(mlToCups(450), 2.5);
});

test('mlToCups: Very small values (< 100ml) should round to at least 0.5 cups', () => {
    assert.strictEqual(mlToCups(1), 0.5);
    assert.strictEqual(mlToCups(50), 0.5);
    assert.strictEqual(mlToCups(99), 0.5);
});

test('mlToCups: Edge case - exactly 0.5 cup boundary (100ml)', () => {
    assert.strictEqual(mlToCups(100), 0.5);
});

test('mlToCups: Edge case - just above 0.5 cup boundary (101ml)', () => {
    // 101ml / 200 = 0.505, rounds up to 1 cup
    assert.strictEqual(mlToCups(101), 1);
});

test('mlToCups: Edge case - just below 1 cup boundary (199ml)', () => {
    assert.strictEqual(mlToCups(199), 1);
});

// Test Suite: formatCups
console.log('\n=== Testing formatCups ===\n');

test('formatCups: 0.5 should return "meia xícara"', () => {
    assert.strictEqual(formatCups(0.5), 'meia xícara');
});

test('formatCups: 1.0 should return "uma xícara"', () => {
    assert.strictEqual(formatCups(1.0), 'uma xícara');
});

test('formatCups: 1.5 should return "uma xícara e meia"', () => {
    assert.strictEqual(formatCups(1.5), 'uma xícara e meia');
});

test('formatCups: 2.0 should return "duas xícaras"', () => {
    assert.strictEqual(formatCups(2.0), 'duas xícaras');
});

test('formatCups: 2.5 should return "duas xícaras e meia"', () => {
    assert.strictEqual(formatCups(2.5), 'duas xícaras e meia');
});

test('formatCups: 3.0 should return "três xícaras"', () => {
    assert.strictEqual(formatCups(3.0), 'três xícaras');
});

test('formatCups: 3.5 should return "três xícaras e meia"', () => {
    assert.strictEqual(formatCups(3.5), 'três xícaras e meia');
});

test('formatCups: Numbers 4-10 should use written form', () => {
    assert.strictEqual(formatCups(4.0), 'quatro xícaras');
    assert.strictEqual(formatCups(5.0), 'cinco xícaras');
    assert.strictEqual(formatCups(6.0), 'seis xícaras');
    assert.strictEqual(formatCups(7.0), 'sete xícaras');
    assert.strictEqual(formatCups(8.0), 'oito xícaras');
    assert.strictEqual(formatCups(9.0), 'nove xícaras');
    assert.strictEqual(formatCups(10.0), 'dez xícaras');
});

test('formatCups: Numbers > 10 should use numeric form', () => {
    assert.strictEqual(formatCups(11.0), '11 xícaras');
    assert.strictEqual(formatCups(15.0), '15 xícaras');
    assert.strictEqual(formatCups(20.5), '20 xícaras e meia');
});

test('formatCups: Floating point precision - 0.5 should be detected correctly', () => {
    // Test that 0.5 modulo 1 equals 0.5 (not affected by floating point errors)
    const cups = 1.5;
    assert.strictEqual(cups % 1, 0.5);
    assert.strictEqual(formatCups(cups), 'uma xícara e meia');
});

test('formatCups: Floating point precision - 2.5 should be detected correctly', () => {
    const cups = 2.5;
    assert.strictEqual(cups % 1, 0.5);
    assert.strictEqual(formatCups(cups), 'duas xícaras e meia');
});

// Test Suite: formatResult
console.log('\n=== Testing formatResult ===\n');

test('formatResult: Should return object with cupsText and mlText', () => {
    const result = formatResult(300);
    assert.strictEqual(typeof result, 'object');
    assert('cupsText' in result);
    assert('mlText' in result);
});

test('formatResult: 300ml should format correctly', () => {
    const result = formatResult(300);
    assert.strictEqual(result.cupsText, 'uma xícara e meia de caldo de osso por dia');
    assert.strictEqual(result.mlText, '300 ml');
});

test('formatResult: 200ml should format correctly', () => {
    const result = formatResult(200);
    assert.strictEqual(result.cupsText, 'uma xícara de caldo de osso por dia');
    assert.strictEqual(result.mlText, '200 ml');
});

test('formatResult: 250ml should format correctly', () => {
    const result = formatResult(250);
    assert.strictEqual(result.cupsText, 'uma xícara e meia de caldo de osso por dia');
    assert.strictEqual(result.mlText, '250 ml');
});

test('formatResult: Decimal ml values should format correctly', () => {
    const result = formatResult(210.5);
    assert.strictEqual(result.mlText, '210.5 ml');
});

test('formatResult: Whole number ml should not show .0', () => {
    const result = formatResult(200);
    assert.strictEqual(result.mlText, '200 ml');
    assert(!result.mlText.includes('.0'));
});

test('formatResult: Small values should round up correctly', () => {
    const result = formatResult(50);
    assert.strictEqual(result.cupsText, 'meia xícara de caldo de osso por dia');
    assert.strictEqual(result.mlText, '50 ml');
});

// Test Suite: calculateDosage
console.log('\n=== Testing calculateDosage ===\n');

test('calculateDosage: 70kg should calculate to 210ml', () => {
    assert.strictEqual(calculateDosage(70), 210);
});

test('calculateDosage: 50kg should calculate to 150ml', () => {
    assert.strictEqual(calculateDosage(50), 150);
});

test('calculateDosage: 100kg should calculate to 300ml', () => {
    assert.strictEqual(calculateDosage(100), 300);
});

test('calculateDosage: Decimal weights should round to 1 decimal place', () => {
    assert.strictEqual(calculateDosage(70.5), 211.5);
    assert.strictEqual(calculateDosage(70.33), 211);
});

test('calculateDosage: Small weights should calculate correctly', () => {
    assert.strictEqual(calculateDosage(0.1), 0.3);
    assert.strictEqual(calculateDosage(1), 3);
});

// Test Suite: validateInput
console.log('\n=== Testing validateInput ===\n');

test('validateInput: Empty string should return invalid', () => {
    const result = validateInput('');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.error, 'Por favor, informe seu peso.');
});

test('validateInput: null should return invalid', () => {
    const result = validateInput(null);
    assert.strictEqual(result.isValid, false);
});

test('validateInput: undefined should return invalid', () => {
    const result = validateInput(undefined);
    assert.strictEqual(result.isValid, false);
});

test('validateInput: Non-numeric string should return invalid', () => {
    const result = validateInput('abc');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.error, 'Por favor, informe um número válido.');
});

test('validateInput: Zero should return invalid', () => {
    const result = validateInput('0');
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.error, 'O peso deve ser maior que zero.');
});

test('validateInput: Negative number should return invalid', () => {
    const result = validateInput('-10');
    assert.strictEqual(result.isValid, false);
});

test('validateInput: Below minimum should return invalid', () => {
    const result = validateInput('0.05');
    assert.strictEqual(result.isValid, false);
    assert(result.error.includes('mínimo'));
});

test('validateInput: Valid weight should return valid', () => {
    const result = validateInput('70');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.error, null);
});

test('validateInput: Weight above max should return valid with warning', () => {
    const result = validateInput('301');
    assert.strictEqual(result.isValid, true);
    assert(result.warning !== null);
    assert(result.warning.includes('300'));
});

test('validateInput: Weight at max boundary should return valid', () => {
    const result = validateInput('300');
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.warning, undefined);
});

test('validateInput: Decimal weight should parse correctly', () => {
    const result = validateInput('70.5');
    assert.strictEqual(result.isValid, true);
});

// Test Suite: Integration tests
console.log('\n=== Testing Integration ===\n');

test('Integration: Full flow from weight to formatted result', () => {
    const weight = 70;
    const dosage = calculateDosage(weight);
    const result = formatResult(dosage);
    
    assert.strictEqual(dosage, 210);
    assert.strictEqual(result.cupsText, 'uma xícara e meia de caldo de osso por dia');
    assert.strictEqual(result.mlText, '210 ml');
});

test('Integration: Small weight flow', () => {
    const weight = 10;
    const dosage = calculateDosage(weight);
    const result = formatResult(dosage);
    
    assert.strictEqual(dosage, 30);
    assert.strictEqual(result.cupsText, 'meia xícara de caldo de osso por dia');
    assert.strictEqual(result.mlText, '30 ml');
});

test('Integration: Large weight flow', () => {
    const weight = 100;
    const dosage = calculateDosage(weight);
    const result = formatResult(dosage);
    
    assert.strictEqual(dosage, 300);
    assert.strictEqual(result.cupsText, 'uma xícara e meia de caldo de osso por dia');
    assert.strictEqual(result.mlText, '300 ml');
});

// Summary
console.log('\n=== Test Summary ===\n');
console.log(`Tests run: ${testsRun}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
} else {
    console.log('\n❌ Some tests failed');
    process.exit(1);
}

