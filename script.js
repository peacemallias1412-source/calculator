const display = document.getElementById('display');

if (display) {
    function deleteLast() {
        if (display.value === 'Error') {
            display.value = '';
            return;
        }
        display.value = display.value.slice(0, -1) || '';
    }

    function appendValue(value) {
        if (display.value === 'Error') {
            display.value = '';
        }

        const lastChar = display.value.slice(-1);
        const isOperator = /[+\-*/%^]/.test(value);

        if (value === '.' && display.value.includes('.')) {
            const lastNumberPart = display.value.split(/[+\-*/%^]/).at(-1);
            if (lastNumberPart.includes('.')) {
                return;
            }
        }

        if (display.value === '0' && !isOperator && value !== '.') {
            display.value = value;
            return;
        }

        if (isOperator && /[+\-*/%^]/.test(lastChar)) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }

        display.value += value;
    }

    function clearDisplay() {
        display.value = '';
    }

    function calculateResult() {
        if (display.value === '') return;

        try {
            let expression = display.value.trim().replace(/\^/g, '**');
            expression = expression.replace(/%/g, '/100');

            if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
                throw new Error('Wrong input');
            }

            const result = new Function('return ' + expression)();

            if (!Number.isFinite(result)) {
                throw new Error('Math error');
            }

            display.value = String(parseFloat(result.toFixed(10)));
        } catch (error) {
            display.value = 'Error';
        }
    }

    document.addEventListener('keydown', function (event) {
        const key = event.key;

        if (/^[0-9]$/.test(key)) {
            appendValue(key);
        } else if (['+', '-', '*', '/', '.', '%', '^'].includes(key)) {
            appendValue(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculateResult();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Escape' || key === 'Delete') {
            clearDisplay();
        }
    });
}