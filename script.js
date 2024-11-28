// script.js

// Funções para exibir modais
function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

function showErrorModal() {
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

function showWarningModal() {
    const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));
    warningModal.show();
}

// Selecionar elementos do DOM
const form = document.getElementById('finance-form');
const transactionHistory = document.getElementById('transaction-history');
const totalDisplay = document.getElementById('total');

// Variáveis para armazenar o total e a transação sendo editada
let total = 0;
let editingRow = null; // Linha que está sendo editada

// Função para atualizar o total
function updateTotal() {
    totalDisplay.textContent = `R$ ${total.toFixed(2)}`;
}

// Evento de submissão do formulário
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    // Capturar valores do formulário
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!description || isNaN(amount)) {
        showErrorModal(); // Exibir o modal de erro se houver dados faltando
        return;
    }

    // Se estamos editando, atualizar a linha existente
    if (editingRow) {
        const oldType = editingRow.getAttribute('data-type');
        const oldAmount = parseFloat(editingRow.getAttribute('data-amount'));

        // Subtrair o valor anterior e adicionar o novo
        total -= (oldType === 'income' ? oldAmount : -oldAmount);
        total += (type === 'income' ? amount : -amount);

        // Atualizar os dados na linha
        editingRow.innerHTML = ` 
            <td class="${type === 'income' ? 'text-success' : 'text-danger'}">
                ${type === 'income' ? 'Lucro' : 'Gasto'}
            </td>
            <td>${description}</td>
            <td>R$ ${amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editTransaction(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTransaction(this)">Excluir</button>
            </td>
        `;
        editingRow.setAttribute('data-type', type);
        editingRow.setAttribute('data-amount', amount);

        editingRow = null; // Resetar a linha de edição
    } else {
        // Caso contrário, adicionar nova transação
        total += type === 'income' ? amount : -amount;

        // Criar uma nova linha de transação
        const row = document.createElement('tr');
        row.setAttribute('data-type', type);
        row.setAttribute('data-amount', amount);
        row.innerHTML = `
            <td class="${type === 'income' ? 'text-success' : 'text-danger'}">
                ${type === 'income' ? 'Lucro' : 'Gasto'}
            </td>
            <td>${description}</td>
            <td>R$ ${amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editTransaction(this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTransaction(this)">Excluir</button>
            </td>
        `;
        transactionHistory.appendChild(row);

        showSuccessModal(); // Exibir o modal de sucesso após adicionar a transação
    }

    // Atualizar o display do total
    updateTotal();

    // Limpar formulário
    form.reset();
});

// Função para editar a transação
function editTransaction(button) {
    const row = button.closest('tr');
    const type = row.getAttribute('data-type');
    const description = row.cells[1].textContent;
    const amount = parseFloat(row.getAttribute('data-amount'));

    // Preencher o formulário com os dados da transação
    document.getElementById('type').value = type;
    document.getElementById('description').value = description;
    document.getElementById('amount').value = amount;

    // Marcar a linha como a que está sendo editada
    editingRow = row;
}

// Função para confirmar a exclusão e exibir modal de confirmação
function deleteTransaction(button) {
    const row = button.closest('tr');
    const type = row.getAttribute('data-type');
    const amount = parseFloat(row.getAttribute('data-amount'));

    // Exibir modal de aviso antes de excluir
    const warningModal = new bootstrap.Modal(document.getElementById('warningModal'));
    warningModal.show();

    // Aguardar confirmação para excluir
    document.getElementById('confirmDelete').onclick = function () {
        // Atualizar o total antes de excluir
        total -= (type === 'income' ? amount : -amount);

        // Remover a linha da tabela
        row.remove();

        // Atualizar o display do total
        updateTotal();
        warningModal.hide();
    };
}
