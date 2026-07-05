// Cart persistence + operations, backed by localStorage.
// Cart item shape: { productId, variantLabel, unitPrice, qty }
const Cart = (() => {
  const STORAGE_KEY = "cashewhouse_cart";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: { items } }));
  }

  function getItems() {
    return load();
  }

  function addItem(productId, variantLabel, unitPrice, qty = 1) {
    const items = load();
    const existing = items.find(
      (i) => i.productId === productId && i.variantLabel === variantLabel
    );
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ productId, variantLabel, unitPrice, qty });
    }
    save(items);
  }

  function updateQty(productId, variantLabel, qty) {
    let items = load();
    if (qty <= 0) {
      items = items.filter(
        (i) => !(i.productId === productId && i.variantLabel === variantLabel)
      );
    } else {
      const existing = items.find(
        (i) => i.productId === productId && i.variantLabel === variantLabel
      );
      if (existing) existing.qty = qty;
    }
    save(items);
  }

  function removeItem(productId, variantLabel) {
    updateQty(productId, variantLabel, 0);
  }

  function clear() {
    save([]);
  }

  function getCount() {
    return load().reduce((sum, i) => sum + i.qty, 0);
  }

  function getTotal() {
    return load().reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  }

  return { getItems, addItem, updateQty, removeItem, clear, getCount, getTotal };
})();
