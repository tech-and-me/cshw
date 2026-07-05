// Product catalog for The Cashew House.
// Swap `image` paths for real photos later — no other code needs to change.
const PRODUCTS = [
  {
    id: "raw-cashews",
    name: "Raw Cashews",
    description: "Naturally mild and creamy, perfect for snacking or cooking.",
    image: "https://images.unsplash.com/photo-1723466998040-78d7e2ef6d72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "250g", price: 9.90 },
      { label: "500g", price: 17.50 },
      { label: "1kg", price: 32.00 }
    ]
  },
  {
    id: "roasted-salted-cashews",
    name: "Roasted & Salted Cashews",
    description: "Oven-roasted to a golden crunch with a touch of sea salt.",
    image: "https://plus.unsplash.com/premium_photo-1726768985970-dde12087d972?q=80&w=1123&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "250g", price: 10.90 },
      { label: "500g", price: 19.50 },
      { label: "1kg", price: 35.00 }
    ]
  },
  {
    id: "honey-roasted-cashews",
    name: "Honey Roasted Cashews",
    description: "Sweet, sticky, and irresistibly crunchy.",
    image: "https://images.unsplash.com/photo-1571076425089-164b93bc4936?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "250g", price: 12.90 },
      { label: "500g", price: 22.50 }
    ]
  },
  {
    id: "chili-lime-cashews",
    name: "Chili Lime Cashews",
    description: "A bold, zesty kick for spice lovers.",
    image: "https://images.unsplash.com/photo-1509912760195-4f6cfd8cce2c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "250g", price: 12.90 },
      { label: "500g", price: 22.50 }
    ]
  },
  {
    id: "dark-chocolate-cashews",
    name: "Dark Chocolate Coated Cashews",
    description: "Rich dark chocolate wrapped around a buttery cashew.",
    image: "https://images.unsplash.com/photo-1629908366426-80d33a2e2412?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "200g", price: 14.90 },
      { label: "400g", price: 26.00 }
    ]
  },
  {
    id: "premium-gift-tin",
    name: "Premium Whole Cashews (Gift Tin)",
    description: "Our finest whole cashews, beautifully packaged — perfect for gifting.",
    image: "https://images.unsplash.com/photo-1729514256038-c489695f4d79?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: [
      { label: "300g tin", price: 24.90 }
    ]
  }
];
