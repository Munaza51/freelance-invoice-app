import { getClients, getInvoices } from './data.js';
import { formatCurrency } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  loadRandomQuote();
});

function renderDashboard(){
  const clients = getClients();
  const invoices = getInvoices();

  const totalClients = clients.length;
  const totalInvoices = invoices.length;
  const totalValue = invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  const paidCount = invoices.filter(i => i.paid).length;
  const unpaidCount = totalInvoices - paidCount;

  const el = id => document.getElementById(id);
  el('total-clients').textContent = totalClients;
  el('total-invoices').textContent = totalInvoices;
  el('total-value').textContent = formatCurrency(totalValue);
  el('paid-count').textContent = paidCount;
  el('unpaid-count').textContent = unpaidCount;
}

async function loadRandomQuote(){
  const container = document.getElementById('quote-card');
  if(!container) return;
  try{
    const res = await fetch('./data/quotes.json');
    if(!res.ok) throw new Error('Could not fetch quotes.json');
    const data = await res.json();
    if(!Array.isArray(data) || data.length === 0){
      container.innerHTML = '<p>No quotes found in data/quotes.json</p>';
      return;
    }
    const q = data[Math.floor(Math.random()*data.length)];
    const author = q.author || 'Unknown';
    container.innerHTML = `<blockquote>"${q.text}"</blockquote><p>— ${author}</p>`;
  }catch(err){
    container.innerHTML = '<p>Could not load quote — check console.</p>';
    console.error(err);
  }
}
