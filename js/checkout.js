// Checkout submission — isolated so this is the ONLY file to touch when
// swapping Formspree for a real Stripe Payment Link redirect later.
const Checkout = (() => {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgojdode";

  function formatCartAsText(cartItems, products) {
    const lines = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const name = product ? product.name : item.productId;
      const lineTotal = (item.unitPrice * item.qty).toFixed(2);
      return `- ${name} (${item.variantLabel}) x${item.qty} @ $${item.unitPrice.toFixed(2)} = $${lineTotal}`;
    });
    return lines.join("\n");
  }

  function buildOrderPayload(cartItems, products, shipping) {
    const total = cartItems.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
    return {
      order_summary: formatCartAsText(cartItems, products),
      grand_total: `$${total.toFixed(2)}`,
      customer_name: shipping.fullName,
      customer_email: shipping.email,
      customer_phone: shipping.phone,
      shipping_address: shipping.address,
      shipping_city: shipping.city,
      shipping_postcode: shipping.postcode,
      _replyto: shipping.email,
      _subject: "New Cashew House order"
    };
  }

  // Currently posts to Formspree. To switch to Stripe: replace the body of
  // this function with a redirect to your Stripe Payment Link (optionally
  // still submitting shipping details to Formspree or your own backend
  // first), and keep the same function signature so callers don't change.
  async function submitOrder(cartItems, products, shipping) {
    const payload = buildOrderPayload(cartItems, products, shipping);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("Order submission failed");
    }
    return response.json();
  }

  return { submitOrder, buildOrderPayload };
})();
