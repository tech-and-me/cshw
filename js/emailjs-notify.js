// Customer email confirmation via EmailJS — sent alongside (not instead of)
// the Formspree order notification in checkout.js. Isolated here so either
// can be swapped/removed independently.
const EmailNotify = (() => {
  const SERVICE_ID = "service_majz40r";
  const TEMPLATE_ID = "template_bt6ryr8";
  const PUBLIC_KEY = "DcCP-ry3D3xl7zC8K";

  // Generic placeholder until real product photos are used in the template.
  const PLACEHOLDER_IMAGE_URL = "https://placehold.co/120x120/eeece6/2b2b28?text=Cashews";

  emailjs.init({ publicKey: PUBLIC_KEY });

  function generateOrderId() {
    return `CH-${Date.now()}`;
  }

  function buildTemplateParams(cartItems, products, shipping, grandTotal) {
    const orders = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const name = product ? `${product.name} (${item.variantLabel})` : item.productId;
      return {
        name,
        units: item.qty,
        price: item.unitPrice.toFixed(2),
        image_url: PLACEHOLDER_IMAGE_URL
      };
    });

    return {
      order_id: generateOrderId(),
      orders,
      cost: {
        shipping: "0.00",
        tax: "0.00",
        total: grandTotal.toFixed(2)
      },
      email: shipping.email,
      to_email: shipping.email
    };
  }

  function sendConfirmation(cartItems, products, shipping, grandTotal) {
    const templateParams = buildTemplateParams(cartItems, products, shipping, grandTotal);
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  }

  return { sendConfirmation };
})();
