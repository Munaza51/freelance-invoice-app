import { getInvoices, saveInvoices, getClients } from './data.js';
import { generateId, formatCurrency, formatDate } from './utils.js';

// Note: formatCurrency & formatDate come from utils — imported above using named imports

document.addEventListener('DOMContentLoaded', initInvoices);

function initInvoices(){
  const form = document.getElementById('invoice-form');
  const clientSelect = document.getElementById('invoice-client');
  const titleInput = document.getElementById('invoice-title');
  const descInput = document.getElementById('invoice-desc');
  const amountInput = document.getElementById('invoice-amount');
  const dateInput = document.getElementById('invoice-date');
  const tbody = document.getElementById('invoices-list');

  populateClients();
  render();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const clientId = clientSelect.value;
    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value || new Date().toISOString().slice(0,10);

    if(!clientId || !title || !amount || isNaN(amount)){
      alert('Please fill required fields (client, title, amount).');
      return;
    }

    const invoices = getInvoices();
    invoices.push({ id: generateId(), clientId, title, description: descInput.value.trim(), amount: Number(amount.toFixed(2)), date, paid:false });
    saveInvoices(invoices);
    form.reset();
    render();
  });

  function populateClients(){
    const clients = getClients();
    if(!clientSelect) return;
    if(clients.length === 0){
      clientSelect.innerHTML = '<option value="">-- No clients available --</option>';
      return;
    }
    clientSelect.innerHTML = '<option value="">-- Select client --</option>' + clients.map(c => `<option value="${c.id}">${c.name} ${c.company ? `(${c.company})` : ''}</option>`).join('');
  }

  function render(){
    const invoices = getInvoices();
    if(invoices.length === 0){
      tbody.innerHTML = '<tr><td colspan="7">No invoices yet.</td></tr>';
      return;
    }
    const clients = getClients();
    tbody.innerHTML = invoices.map(inv => {
      const client = clients.find(c => c.id === inv.clientId) || { name: 'Unknown' };
      return `
        <tr>
          <td>${inv.id}</td>
          <td>${client.name}</td>
          <td>${inv.title}</td>
          <td>${formatCurrency(inv.amount)}</td>
          <td>${formatDate(inv.date)}</td>
          <td>${inv.paid ? 'Paid' : 'Unpaid'}</td>
          <td>
            <button class="toggle-paid" data-id="${inv.id}">${inv.paid ? 'Mark Unpaid' : 'Mark Paid'}</button>
            <button class="delete" data-id="${inv.id}">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('button.toggle-paid').forEach(b => b.addEventListener('click', togglePaid));
    tbody.querySelectorAll('button.delete').forEach(b => b.addEventListener('click', onDelete));
  }

  function togglePaid(e){
    const id = e.target.dataset.id;
    const invoices = getInvoices();
    const idx = invoices.findIndex(i => i.id === id);
    if(idx === -1) return;
    invoices[idx].paid = !invoices[idx].paid;
    saveInvoices(invoices);
    render();
  }

  function onDelete(e){
    const id = e.target.dataset.id;
    if(!confirm('Delete invoice?')) return;
    const remaining = getInvoices().filter(i => i.id !== id);
    saveInvoices(remaining);
    render();
  }
}
