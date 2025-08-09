import { getClients, saveClients } from './data.js';
import { generateId } from './utils.js';

document.addEventListener('DOMContentLoaded', initClients);

function initClients(){
  const form = document.getElementById('client-form');
  const nameInput = document.getElementById('client-name');
  const emailInput = document.getElementById('client-email');
  const companyInput = document.getElementById('client-company');
  const notesInput = document.getElementById('client-notes');
  const tbody = document.getElementById('clients-list');

  render();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if(!name || !email){ alert('Name and email are required.'); return; }

    const editingId = form.dataset.editing;
    const clients = getClients();
    if(editingId){
      const idx = clients.findIndex(c => c.id === editingId);
      if(idx > -1){
        clients[idx] = { ...clients[idx], name, email, company: companyInput.value.trim(), notes: notesInput.value.trim() };
      }
      delete form.dataset.editing;
      form.querySelector('button[type="submit"]').textContent = 'Add Client';
    }else{
      clients.push({ id: generateId(), name, email, company: companyInput.value.trim(), notes: notesInput.value.trim() });
    }
    saveClients(clients);
    form.reset();
    render();
  });

  function render(){
    const clients = getClients();
    if(clients.length === 0){
      tbody.innerHTML = '<tr><td colspan="5">No clients yet. Add one above.</td></tr>';
      return;
    }
    tbody.innerHTML = clients.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.company || '-'}</td>
        <td>${c.notes || '-'}</td>
        <td>
          <button class="edit" data-id="${c.id}">Edit</button>
          <button class="delete" data-id="${c.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('button.edit').forEach(b => b.addEventListener('click', onEdit));
    tbody.querySelectorAll('button.delete').forEach(b => b.addEventListener('click', onDelete));
  }

  function onEdit(e){
    const id = e.target.dataset.id;
    const client = getClients().find(c => c.id === id);
    if(!client) return;
    nameInput.value = client.name;
    emailInput.value = client.email;
    companyInput.value = client.company || '';
    notesInput.value = client.notes || '';
    form.dataset.editing = client.id;
    form.querySelector('button[type="submit"]').textContent = 'Save Changes';
  }

  function onDelete(e){
    const id = e.target.dataset.id;
    if(!confirm('Delete client? This will NOT delete invoices already created for them.')) return;
    const newClients = getClients().filter(c => c.id !== id);
    saveClients(newClients);
    render();
  }
}
