const maxCustomers = 50;
const interestRate = 0.25;
const weeks = 10;
let customers = JSON.parse(localStorage.getItem('customers')) || [];

function saveToLocalStorage() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function addCustomer() {
    const name = document.getElementById('name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (customers.length >= maxCustomers) {
        alert("Customer limit reached.");
        return;
    }

    if (!name || isNaN(amount) || !date) {
        alert("Please fill in all fields.");
        return;
    }

    const emiAmount = (amount + (amount * interestRate)) / weeks;
    const customer = {
        name,
        amount,
        date,
        emiAmount,
        payments: Array(weeks).fill(false)
    };

    customers.push(customer);
    saveToLocalStorage();
    updateCustomerTable();
}

function togglePayment(customerIndex, weekIndex) {
    customers[customerIndex].payments[weekIndex] = !customers[customerIndex].payments[weekIndex];
    saveToLocalStorage();
    updateCustomerTable();
}

function updateCustomerTable() {
    const container = document.getElementById('customerTable');
    container.innerHTML = '';

    if (customers.length === 0) {
        container.innerHTML = '<p>No customers added.</p>';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Amount', 'Date', 'EMI Amount', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Status'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    customers.forEach((customer, customerIndex) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = customer.name;
        row.appendChild(nameCell);

        const amountCell = document.createElement('td');
        amountCell.textContent = customer.amount.toFixed(2);
        row.appendChild(amountCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = customer.date;
        row.appendChild(dateCell);

        const emiAmountCell = document.createElement('td');
        emiAmountCell.textContent = customer.emiAmount.toFixed(2);
        row.appendChild(emiAmountCell);

        for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
            const paymentCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = customer.payments[weekIndex];
            checkbox.onclick = () => togglePayment(customerIndex, weekIndex);
            paymentCell.appendChild(checkbox);
            row.appendChild(paymentCell);
        }

        const statusCell = document.createElement('td');
        if (customer.payments.every(p => p)) {
            statusCell.textContent = 'EMI Cleared';
        } else {
            statusCell.textContent = 'EMI Ongoing';
        }
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
}

document.addEventListener('DOMContentLoaded', updateCustomerTable);
