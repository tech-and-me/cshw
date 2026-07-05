// Renders products + cart view and wires up navigation. Depends on
// products.js (PRODUCTS), cart.js (Cart), checkout.js (Checkout).

function formatMoney(n) {
  return `$${n.toFixed(2)}`;
}

function findProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId);
}

/* ---------- View switching ---------- */

function showView(viewId) {
  document.querySelectorAll(".view").forEach((el) => {
    el.classList.toggle("view--active", el.id === viewId);
  });
  window.scrollTo(0, 0);
  if (viewId === "view-cart") renderCartView();
}

/* ---------- Product grid ---------- */

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = PRODUCTS.map((product, pIndex) => {
    const options = product.variants
      .map((v, i) => `<option value="${i}">${v.label} - ${formatMoney(v.price)}</option>`)
      .join("");
    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card__image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-card__body">
          <h3>${product.name}</h3>
          <p class="product-card__desc">${product.description}</p>
          <div class="product-card__controls">
            <select class="product-card__variant" data-product-index="${pIndex}" aria-label="Size for ${product.name}">
              ${options}
            </select>
            <button class="btn btn--primary product-card__add" data-product-index="${pIndex}">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".product-card__add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pIndex = Number(btn.dataset.productIndex);
      const card = btn.closest(".product-card");
      const select = card.querySelector(".product-card__variant");
      const variantIndex = Number(select.value);
      const product = PRODUCTS[pIndex];
      const variant = product.variants[variantIndex];
      Cart.addItem(product.id, variant.label, variant.price, 1);
      flashAdded(btn);
    });
  });
}

function flashAdded(btn) {
  const original = btn.textContent;
  btn.textContent = "Added ✓";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 900);
}

/* ---------- Cart badge ---------- */

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  const count = Cart.getCount();
  badge.textContent = count;
  badge.classList.toggle("cart-badge--hidden", count === 0);
}

/* ---------- Cart view ---------- */

function renderCartView() {
  const items = Cart.getItems();
  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty");
  const summary = document.getElementById("cart-summary");
  const shippingSection = document.getElementById("shipping-section");

  if (items.length === 0) {
    container.innerHTML = "";
    emptyMsg.classList.remove("hidden");
    summary.classList.add("hidden");
    shippingSection.classList.add("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");
  summary.classList.remove("hidden");
  shippingSection.classList.remove("hidden");

  container.innerHTML = items
    .map((item) => {
      const product = findProduct(item.productId);
      const lineTotal = item.unitPrice * item.qty;
      return `
        <div class="cart-row" data-product-id="${item.productId}" data-variant="${item.variantLabel}">
          <img class="cart-row__image" src="${product ? product.image : ""}" alt="${product ? product.name : ""}" />
          <div class="cart-row__info">
            <div class="cart-row__name">${product ? product.name : item.productId}</div>
            <div class="cart-row__variant">${item.variantLabel} · ${formatMoney(item.unitPrice)} each</div>
          </div>
          <div class="cart-row__qty">
            <button class="qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="increase" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-row__total">${formatMoney(lineTotal)}</div>
          <button class="cart-row__remove" data-action="remove" aria-label="Remove item">✕</button>
        </div>
      `;
    })
    .join("");

  document.getElementById("cart-grand-total").textContent = formatMoney(Cart.getTotal());

  container.querySelectorAll(".cart-row").forEach((row) => {
    const productId = row.dataset.productId;
    const variant = row.dataset.variant;
    const current = items.find((i) => i.productId === productId && i.variantLabel === variant);

    row.querySelector('[data-action="increase"]').addEventListener("click", () => {
      Cart.updateQty(productId, variant, current.qty + 1);
    });
    row.querySelector('[data-action="decrease"]').addEventListener("click", () => {
      Cart.updateQty(productId, variant, current.qty - 1);
    });
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      Cart.removeItem(productId, variant);
    });
  });
}

/* ---------- Shipping form / order submission ---------- */

function setupShippingForm() {
  const form = document.getElementById("shipping-form");
  const statusEl = document.getElementById("order-status");
  const confirmationEl = document.getElementById("order-confirmation");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const items = Cart.getItems();
    if (items.length === 0) return;

    const shipping = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      city: form.city.value.trim(),
      postcode: form.postcode.value.trim()
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Placing order...";
    statusEl.textContent = "";
    statusEl.classList.remove("form-status--error");

    const grandTotal = Cart.getTotal();

    const [orderResult, emailResult] = await Promise.allSettled([
      Checkout.submitOrder(items, PRODUCTS, shipping),
      EmailNotify.sendConfirmation(items, PRODUCTS, shipping, grandTotal)
    ]);

    if (orderResult.status === "rejected") {
      console.error("Formspree order submission failed:", orderResult.reason);
    }
    if (emailResult.status === "rejected") {
      console.error("EmailJS confirmation email failed:", emailResult.reason);
    }

    if (orderResult.status === "rejected") {
      // Order was not captured at all — let the customer retry.
      statusEl.textContent = "Something went wrong submitting your order. Please try again.";
      statusEl.classList.add("form-status--error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order";
      return;
    }

    // Order was captured; clear the cart regardless of email outcome so the
    // customer isn't prompted to resubmit (which would duplicate the order).
    Cart.clear();
    form.reset();
    form.classList.add("hidden");
    document.getElementById("cart-items").classList.add("hidden");
    document.getElementById("cart-summary").classList.add("hidden");
    confirmationEl.classList.remove("hidden");

    if (emailResult.status === "fulfilled") {
      confirmationEl.textContent = "Thanks! Your order has been received, we'll confirm shortly.";
    } else {
      confirmationEl.textContent = "Thanks! Your order has been received. We couldn't send a confirmation email, but we'll be in touch shortly.";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Place Order";
  });
}

/* ---------- Nav wiring ---------- */

function setupNav() {
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showView(el.dataset.nav);
      const anchor = el.getAttribute("href");
      if (anchor && anchor.length > 1 && anchor.startsWith("#")) {
        const target = document.querySelector(anchor);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartBadge();
  setupNav();
  setupShippingForm();
  showView("view-home");
});

document.addEventListener("cart:changed", () => {
  updateCartBadge();
  if (document.getElementById("view-cart").classList.contains("view--active")) {
    renderCartView();
  }
});
