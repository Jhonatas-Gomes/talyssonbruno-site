// ===== LÓGICA DOS NÚMEROS E FÓRMULAS CAINDO NO FUNDO =====

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('falling-bg');
    
    // Fórmulas e strings contábeis/financeiras
    const formulas = [
        "12.345 + 6.789 = 19.134", "87 × 43 = 3.741", "1.234 × 56 = 69.104", 
        "9.876 ÷ 12 = 823", "45 + 67 + 89 = 201", "123 × 45 = 5.535", 
        "678 ÷ 3 = 226", "987 + 654 = 1.641", "321 × 7 = 2.247", 
        "4.567 ÷ 11 = 415,18", "78 + 56 = 134", "234 × 12 = 2.808", 
        "8.765 ÷ 5 = 1.753", "999 + 888 = 1.887", "456 × 3 = 1.368", 
        "7.890 ÷ 6 = 1.315", "1.111 + 2.222 = 3.333", "3.333 × 3 = 9.999",
        "DRE", "LUCRO = R - D", "ROI", "IRPJ", "CSLL", "PIS/COFINS", "Ativo = Passivo + PL"
    ];

    const totalElements = 35; // Quantidade de elementos caindo simultaneamente

    for (let i = 0; i < totalElements; i++) {
        createFallingNumber(true);
    }

    function createFallingNumber(init = false) {
        if (!container) return;
        
        const span = document.createElement('span');
        span.classList.add('number');
        span.textContent = formulas[Math.floor(Math.random() * formulas.length)];
        
        // Posição horizontal aleatória (0% a 92% para evitar barra de rolagem lateral)
        span.style.left = Math.random() * 92 + '%';
        
        // Tamanhos variados para efeito de profundidade (1rem a 2.5rem)
        span.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        
        // Velocidade de queda aleatória (entre 12s e 28s)
        const duration = Math.random() * 16 + 12;
        span.style.animationDuration = duration + 's';
        
        // Delay inicial espalhado caso esteja carregando a página agora
        if (init) {
            span.style.animationDelay = '-' + (Math.random() * duration) + 's';
        }

        container.appendChild(span);

        // Remove o elemento após terminar a animação e cria outro
        setTimeout(() => {
            span.remove();
            createFallingNumber(false);
        }, duration * 1000);
    }
});


// ===== SCRIPT DA CALCULADORA =====
(function() {
    // Garante a execução somente após o carregamento da página
    window.addEventListener('load', () => {
        const expressionEl = document.getElementById('expression');
        const resultEl = document.getElementById('result');
        
        if (!expressionEl || !resultEl) return;

        let currentInput = '0';
        let previousInput = '';
        let operator = null;
        let shouldResetDisplay = false;

        function updateDisplay() {
            let displayValue = currentInput;
            if (displayValue === 'Error') {
                resultEl.textContent = 'Error';
                resultEl.className = 'result error';
                expressionEl.textContent = '0';
                return;
            }

            if (!isNaN(parseFloat(displayValue)) && isFinite(displayValue)) {
                const parts = displayValue.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                displayValue = parts.join(',');
            }

            resultEl.textContent = displayValue;
            resultEl.className = 'result';

            let expr = '';
            if (previousInput && operator) {
                const prevParts = previousInput.split('.');
                prevParts[0] = prevParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                const prevFormatted = prevParts.join(',');
                expr = prevFormatted + ' ' + operator + ' ';
            }
            expr += resultEl.textContent;
            expressionEl.textContent = expr || '0';
        }

        function inputNumber(value) {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }
            if (value === '.' && currentInput.includes('.')) return;
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            if (currentInput.replace('-', '').replace('.', '').length > 15) {
                currentInput = currentInput.slice(0, 15);
            }
            updateDisplay();
        }

        function handleOperator(op) {
            const current = parseFloat(currentInput);
            if (isNaN(current)) return;

            if (operator && !shouldResetDisplay) {
                const result = calculateResult(parseFloat(previousInput), current, operator);
                currentInput = String(result);
                previousInput = '';
                operator = null;
                shouldResetDisplay = true;
                updateDisplay();
            }

            previousInput = currentInput;
            operator = op;
            shouldResetDisplay = true;
            updateDisplay();
        }

        function calculateResult(a, b, op) {
            let result;
            switch (op) {
                case '+': result = a + b; break;
                case '−': result = a - b; break;
                case '×': result = a * b; break;
                case '÷': 
                    if (b === 0) return 'Error';
                    result = a / b; 
                    break;
                default: return b;
            }
            if (typeof result === 'number' && !Number.isInteger(result)) {
                result = parseFloat(result.toPrecision(12));
            }
            return result;
        }

        function calculate() {
            if (!operator || !previousInput) {
                if (currentInput === 'Error') {
                    currentInput = '0';
                    updateDisplay();
                }
                return;
            }
            const prev = parseFloat(previousInput);
            const curr = parseFloat(currentInput);
            if (isNaN(prev) || isNaN(curr)) return;
            const result = calculateResult(prev, curr, operator);
            currentInput = String(result);
            previousInput = '';
            operator = null;
            shouldResetDisplay = true;
            updateDisplay();
        }

        function clearAll() {
            currentInput = '0';
            previousInput = '';
            operator = null;
            shouldResetDisplay = false;
            updateDisplay();
        }

        function toggleSign() {
            if (currentInput === 'Error') return;
            currentInput = String(parseFloat(currentInput) * -1);
            updateDisplay();
        }

        function percent() {
            if (currentInput === 'Error') return;
            currentInput = String(parseFloat(currentInput) / 100);
            updateDisplay();
        }

        document.querySelectorAll('.calc-key').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.dataset.value;

                switch (action) {
                    case 'number': inputNumber(value); break;
                    case 'operator': handleOperator(value); break;
                    case 'calculate': calculate(); break;
                    case 'clear': clearAll(); break;
                    case 'toggle-sign': toggleSign(); break;
                    case 'percent': percent(); break;
                }
            });
        });

        updateDisplay();
    });
})();


// =========================================================================
// 🤖 LÓGICA DO CHAT E INTEGRAÇÃO COM O BACKEND
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // IMPORTANTE: Ajuste os IDs abaixo conforme o seu HTML!
    const chatInput = document.getElementById('chat-input') || document.querySelector('.chat-input input');
    const chatBtn = document.getElementById('chat-send-btn') || document.querySelector('.chat-input button');
    const chatBox = document.getElementById('chat-messages') || document.querySelector('.chat-messages');

    if (!chatInput || !chatBtn || !chatBox) {
        console.warn('⚠️ Elementos do chat não foram encontrados no HTML. Verifique os IDs/Classes.');
        return;
    }

    // Função para adicionar balões de mensagem na tela
    function adicionarMensagem(texto, remetente) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', remetente === 'user' ? 'user-message' : 'bot-message');
        
        // Garante que quebras de linha sejam respeitadas no chat
        msgDiv.style.whiteSpace = 'pre-wrap';
        msgDiv.textContent = texto;

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Rola automaticamente para o fim
    }

    // Função que faz a chamada para o servidor Node.js
    async function enviarMensagem() {
        const textoUsuario = chatInput.value.trim();
        if (!textoUsuario) return;

        // 1. Exibe a mensagem do usuário na tela
        adicionarMensagem(textoUsuario, 'user');
        chatInput.value = '';

        try {
            // 2. Envia para o Backend Express
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'user', content: textoUsuario }
                    ]
                })
            });

            const data = await response.json();

            // 3. Exibe a resposta do servidor/IA na tela
            if (data && data.reply) {
                adicionarMensagem(data.reply, 'bot');
            } else {
                adicionarMensagem('Ocorreu um erro ao processar sua resposta.', 'bot');
            }

        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
            adicionarMensagem('Não foi possível conectar ao servidor local (localhost:3000).', 'bot');
        }
    }

    // Evento ao clicar no botão de enviar
    chatBtn.addEventListener('click', enviarMensagem);

    // Evento ao pressionar "Enter" no campo de texto
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });
});
