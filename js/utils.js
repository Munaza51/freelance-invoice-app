export function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

export function formatCurrency(value){
  // Uses user's locale, default to USD styling
  const v = Number(value) || 0;
  return new Intl.NumberFormat(undefined, {style:'currency', currency:'USD', maximumFractionDigits:2}).format(v);
}

export function formatDate(iso){
  if(!iso) return '';
  const d = new Date(iso);
  if(isNaN(d)) return iso;
  return d.toLocaleDateString();
}
