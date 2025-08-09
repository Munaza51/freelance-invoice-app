export const CLIENTS_KEY = 'freelance_clients';
export const INVOICES_KEY = 'freelance_invoices';

export function getClients(){
  const raw = localStorage.getItem(CLIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}
export function saveClients(clients){
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function getInvoices(){
  const raw = localStorage.getItem(INVOICES_KEY);
  return raw ? JSON.parse(raw) : [];
}
export function saveInvoices(invoices){
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}
