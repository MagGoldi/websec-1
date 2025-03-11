let history = [];

function showError(input, message) {
    input.classList.add('error');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('visible');
    }
    
    // Автоматически убираем ошибку через 3 секунды
    setTimeout(() => {
        clearError(input);
    }, 3000);
}

function clearError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.classList.remove('visible');
    }
}

function validateInput(input) {
    const value = input.value.trim();
    
    if (value === '') {
        showError(input, 'Поле не может быть пустым');
        return false;
    }
    
    if (!/^-?\d*\.?\d+$/.test(value)) {
        showError(input, 'Введите корректное число');
        return false;
    }
    
    clearError(input);
    return true;
}

// Добавляем валидацию при вводе
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.inputField');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                validateInput(input);
            } else {
                clearError(input);
            }
        });
    });
});

function formatResult(v1, op, v2, result) {
    const operators = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    };
    return `${v1} ${operators[op]} ${v2} = ${result}`;
}

function onButtonClick(event) {
    const number1Input = document.getElementById('number1');
    const number2Input = document.getElementById('number2');
    const op = document.getElementById('operation').value;
    
    clearError(number1Input);
    clearError(number2Input);
    
    const isValid1 = validateInput(number1Input);
    const isValid2 = validateInput(number2Input);
    
    if (!isValid1 || !isValid2) return;
    
    const v1 = parseFloat(number1Input.value);
    const v2 = parseFloat(number2Input.value);
    
    let result = null;
    
    switch (op) {
        case '+':
            result = v1 + v2;
            break;
        case '-':
            result = v1 - v2;
            break;
        case '*':
            result = v1 * v2;
            break;
        case '/':
            if (Math.abs(v2) < Number.EPSILON) {
                showError(number2Input, 'Деление на ноль невозможно');
                return;
            }
            result = v1 / v2;
            break;
    }
    
    const resultInfo = formatResult(v1, op, v2, result);
    
    // Добавляем новый результат в историю
    history.unshift(resultInfo);
    if (history.length > 5) history.pop(); // Храним только последние 5 операций
    
    // Отображаем текущий результат
    const resultField = document.getElementById('results');
    resultField.value = resultInfo;
    
    // Обновляем историю
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.slice(1).map(item => 
        `<div class="history-item">${item}</div>`
    ).join('');
    
    // Очищаем поля ввода
    number1Input.value = '';
    number2Input.value = '';
}