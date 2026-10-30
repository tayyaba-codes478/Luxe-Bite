
/* =========================================
   LuxeBite - Luxury Restaurant Website
   JavaScript
========================================= */

/* ---------- 1. Menu Data ---------- */

const menuItems = [
  {
    id: 1,
    name: "Truffle Cream Pasta",
    category: "mains",
    price: 1850,
    rating: 4.9,
    description: "Creamy pasta with parmesan, mushrooms and truffle flavor.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Grilled Steak",
    category: "mains",
    price: 2400,
    rating: 4.9,
    description: "Tender grilled steak served with herbs and seasonal sides.",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Golden Chicken Bites",
    category: "starters",
    price: 950,
    rating: 4.8,
    description: "Crispy chicken bites with a signature creamy dip.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Classic Bruschetta",
    category: "starters",
    price: 850,
    rating: 4.7,
    description: "Toasted bread topped with tomatoes, basil and olive oil.",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    category: "desserts",
    price: 750,
    rating: 5.0,
    description: "Warm chocolate cake with a rich, soft chocolate center.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Berry Cheesecake",
    category: "desserts",
    price: 850,
    rating: 4.8,
    description: "Smooth cheesecake finished with a sweet berry topping.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7,
    name: "Iced Caramel Latte",
    category: "drinks",
    price: 650,
    rating: 4.8,
    description: "Chilled espresso with milk and a touch of caramel.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8,
    name: "Fresh Berry Cooler",
    category: "drinks",
    price: 550,
    rating: 4.7,
    description: "A refreshing blend of berries and citrus.",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85"
  }
]

/* ---------- 2. Select HTML Elements ---------- */

const menuGrid = document.getElementById("menuGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartClose = document.getElementById("cartClose");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTitleCount = document.getElementById("cartTitleCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const reservationForm = document.getElementById("reservationForm");
const bookingDate = document.getElementById("bookingDate");
const formMessage = document.getElementById("formMessage");

const currentYear = document.getElementById("currentYear");


/* ---------- 3. Currency Formatter ---------- */

function formatPrice(price) {
  return "Rs. " + Number(price).toLocaleString("en-PK");
}


/* ---------- 4. Render Menu ---------- */

function renderMenu(category = "all") {
  if (!menuGrid) return;

  menuGrid.innerHTML = "";

  const filteredItems = menuItems.filter(item => {
    return category === "all" || item.category === category;
  });

  filteredItems.forEach(item => {
    const card = document.createElement("article");
    card.className = "menu-card";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
      image.style.display = "none";
    });

    const content = document.createElement("div");
    content.className = "menu-card-content";

    const categoryLabel = document.createElement("span");
    categoryLabel.className = "menu-category";
    categoryLabel.textContent = item.category;

    const heading = document.createElement("h3");
    heading.textContent = item.name;

    const rating = document.createElement("span");
    rating.className = "menu-rating";
    rating.textContent = `★ ${item.rating}`;

    const description = document.createElement("p");
    description.textContent = item.description;

    const bottom = document.createElement("div");
    bottom.className = "menu-card-bottom";

    const price = document.createElement("strong");
    price.textContent = formatPrice(item.price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-to-cart";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(item.id));

    bottom.append(price, addButton);
    content.append(categoryLabel, heading, rating, description, bottom);
    card.append(image, content);

    menuGrid.appendChild(card);
  });
}


/* ---------- 5. Menu Category Filters ---------- */

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    const category = button.dataset.category || "all";
    renderMenu(category);
  });
});


/* ---------- 6. Cart Data ---------- */

// Each cart entry stores an item ID and quantity.
let cart = [];

function addToCart(itemId) {
  const existingItem = cart.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: itemId,
      quantity: 1
    });
  }

  renderCart();
  openCart();
}

function changeQuantity(itemId, amount) {
  const item = cart.find(cartItem => cartItem.id === itemId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== itemId);
  }

  renderCart();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  renderCart();
}


/* ---------- 7. Render Cart ---------- */

function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(cartItem => {
    const product = menuItems.find(item => item.id === cartItem.id);

    if (!product) return;

    totalItems += cartItem.quantity;
    totalPrice += product.price * cartItem.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("h4");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price * cartItem.quantity);

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.textContent = "−";
    minusButton.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    minusButton.addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = cartItem.quantity;

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.textContent = "+";
    plusButton.setAttribute("aria-label", `Increase ${product.name} quantity`);
    plusButton.addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-cart-item";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeFromCart(product.id);
    });

    quantityControls.append(minusButton, quantity, plusButton);
    details.append(name, price, quantityControls, removeButton);
    row.appendChild(details);

    cartItemsContainer.appendChild(row);
  });

  if (totalItems === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-cart";
    emptyMessage.textContent = "Your cart is empty. Add something delicious!";
    cartItemsContainer.appendChild(emptyMessage);
  }

  if (cartCount) cartCount.textContent = totalItems;
  if (cartTitleCount) cartTitleCount.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = formatPrice(totalPrice);

  if (checkoutButton) {
    checkoutButton.disabled = totalItems === 0;
  }
}


/* ---------- 8. Open and Close Cart ---------- */

function openCart() {
  document.body.classList.add("cart-open");

  if (cartPanel) cartPanel.setAttribute("aria-hidden", "false");
  if (cartBackdrop) cartBackdrop.setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");

  if (cartPanel) cartPanel.setAttribute("aria-hidden", "true");
  if (cartBackdrop) cartBackdrop.setAttribute("aria-hidden", "true");
}

if (cartButton) {
  cartButton.addEventListener("click", openCart);
}

if (cartClose) {
  cartClose.addEventListener("click", closeCart);
}

if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCart);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeMobileMenu();
  }
});


/* ---------- 9. Demo Checkout ---------- */

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    alert(
      "Thank you for choosing LuxeBite!\n\n" +
      "This is a demo order only. No real order or payment has been processed."
    );
  });
}


/* ---------- 10. Mobile Navigation ---------- */

function closeMobileMenu() {
  if (!menuToggle || !navLinks) return;

  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", event => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMobileMenu();
    }
  });
}


/* ---------- 11. Reservation Form ---------- */

if (bookingDate) {
  const today = new Date();
  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  bookingDate.min = localDate;
}

if (reservationForm) {
  reservationForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!reservationForm.checkValidity()) {
      reservationForm.reportValidity();
      return;
    }

    if (formMessage) {
      formMessage.textContent =
        "Thank you! Your demo reservation form has been submitted. " +
        "No actual booking has been sent to the restaurant.";

      formMessage.classList.add("success-message");
    } else {
      alert(
        "Thank you! This is a demo reservation. " +
        "No actual booking has been sent."
      );
    }

    reservationForm.reset();

    if (bookingDate) {
      bookingDate.min = localDate;
    }
  });
}


/* ---------- 12. Footer Year ---------- */

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* ---------- 13. Initial Setup ---------- */

renderMenu();
renderCart();

if (cartPanel) {
  cartPanel.setAttribute("aria-hidden", "true");
}

if (cartBackdrop) {
  cartBackdrop.setAttribute("aria-hidden", "true");
}

console.log("LuxeBite website is ready!");
