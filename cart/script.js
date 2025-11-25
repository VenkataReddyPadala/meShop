let users = JSON.parse(localStorage.getItem("users") || "[]");
let currentUser =
  JSON.parse(localStorage.getItem("currentUser") || "null") || {};

if (!Array.isArray(currentUser.cart)) currentUser.cart = [];

let cart = currentUser.cart;

function saveUserCart() {
  currentUser.cart = cart;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  const userIndex = users.findIndex((u) => u.email === currentUser.email);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], cart };
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function renderCart() {
  const items = document.querySelector(".items");

  if (!cart || cart.length === 0) {
    items.innerHTML = `<section>Cart is Empty.</section>`;
    return;
  }

  let output = "";

  cart.forEach((product) => {
    output += `
      <div class="item" data-id="${product.id}">
        <img src="${product.image}" alt="Item" />
        <div class="info">
          <div class="row">
            <div class="price">$${product.price}</div>
            ${
              product.sizes
                ? `<div class="sized">${product.sizes.join(",")}</div>`
                : ""
            }
          </div>
          <p style="margin-top:10px">${product.title}</p>
          <div class="colors">
            Colors:
            <div class="row">
              ${product.colors
                .map(
                  (color) =>
                    `<div class="circle" style="background-color: ${color}"></div>`
                )
                .join("")}
            </div>
          </div>
          <div class="row">
            Rating: ${product.rating.rate}⭐ (${product.rating.count}) ratings
          </div>
        </div>

        <div class="quantity">
          <button class="decrement" data-id="${product.id}">
            ${product.quantity > 1 ? "➖" : "🗑️"}
          </button>
          <p class="qty-value">${product.quantity}</p>
          <button class="increment" data-id="${product.id}">➕</button>
        </div>
      </div>
    `;
  });

  items.innerHTML = output;
}

document.querySelector(".items").addEventListener("click", (e) => {
  const decBtn = e.target.closest(".decrement");
  const incBtn = e.target.closest(".increment");

  if (decBtn) {
    const id = decBtn.dataset.id;
    decrementQuantity(id);
  }

  if (incBtn) {
    const id = incBtn.dataset.id;
    incrementQuantity(id);
  }
});

function updateItemUI(id) {
  const itemEle = document.querySelector(`.item[data-id="${id}"]`);
  if (!itemEle) return;

  const product = cart.find((p) => p.id == id);
  const qtyEle = itemEle.querySelector(".qty-value");
  const decBtn = itemEle.querySelector(".decrement");

  if (!product) {
    itemEle.remove();
    handleEmptyCartUI();
    return;
  }

  qtyEle.textContent = product.quantity;
  decBtn.textContent = product.quantity > 1 ? "➖" : "🗑️";
}

function removeItemUI(id) {
  const itemEle = document.querySelector(`.item[data-id="${id}"]`);
  if (itemEle) itemEle.remove();
  handleEmptyCartUI();
}

function handleEmptyCartUI() {
  const items = document.querySelector(".items");
  if (!items.querySelector(".item")) {
    items.innerHTML = `<section>Cart is Empty.</section>`;
  }
}

function decrementQuantity(id) {
  const index = cart.findIndex((p) => p.id == id);
  if (index === -1) return;

  const product = cart[index];

  if (product.quantity > 1) {
    product.quantity--;
  } else {
    cart.splice(index, 1);
  }

  saveUserCart();

  if (cart[index]) {
    updateItemUI(id);
  } else {
    removeItemUI(id);
  }

  updateCheckout();
}

function incrementQuantity(id) {
  const product = cart.find((p) => p.id == id);
  if (!product) return;

  product.quantity++;
  saveUserCart();
  updateItemUI(id);
  updateCheckout();
}

renderCart();
updateCheckout();

function updateCheckout() {
  const checkoutEle = document.querySelector(".checkout");
  if (!checkoutEle) return;

  if (cart.length > 0) {
    checkoutEle.style.display = "block";
    renderCheckout();
  } else {
    checkoutEle.style.display = "none";
    checkoutEle.innerHTML = "";
  }
}

function renderCheckout() {
  const checkoutEle = document.querySelector(".checkout");

  checkoutEle.innerHTML = `
      <p class="checkout-title">Checkout List</p>
      <ul class="product-list"></ul>
      <div class="checkout-summary"></div>
    `;

  const list = checkoutEle.querySelector(".product-list");
  let output = "";

  cart.forEach((product) => {
    output += `
        <li>
          <span class="product-title">
            ${product.quantity} x ${product.title}
          </span>
          <span class="price">
            $${(product.quantity * product.price).toFixed(2)}
          </span>
        </li>
      `;
  });

  list.innerHTML = output;
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const summary = checkoutEle.querySelector(".checkout-summary");
  summary.innerHTML = `
      <p class="total-line">
        Total: <span class="total-amount">$${total.toFixed(2)}</span>
      </p>
      <button class="checkout-btn">Proceed to Checkout</button>
    `;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".checkout-btn");
  if (!btn) return;
  handleCheckout();
});

function handleCheckout() {
  if (!cart || cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const amountInPaise = Math.round(total * 100);

  const options = {
    key: "rzp_test_PV1oQ0oMtgXOsq",
    amount: amountInPaise,
    currency: "INR",
    name: "MeShop Checkout",
    description: "This is your order",
    theme: { color: "#000" },
    image:
      "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
    handler: function () {
      cart.length = 0;
      saveUserCart();
      renderCart();
      updateCheckout();
      alert("Payment successful! Order placed.");
    },
  };

  const rzpy1 = new Razorpay(options);

  rzpy1.on("payment.failed", function () {
    alert("Payment failed. Your cart is unchanged.");
  });

  rzpy1.open();
}
