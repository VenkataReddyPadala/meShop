let products = JSON.parse(localStorage.getItem("products") || "[]");
let hasError = false;

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
  } else {
    users.push(currentUser);
  }
  localStorage.setItem("users", JSON.stringify(users));
}

document.addEventListener("DOMContentLoaded", async () => {
  if (products.length === 0) {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error("Products fetching failed");
      }
      const data = await res.json();
      products = data;
      products = giveColorAndSizes(products);
      displayAllProducts(products);
      localStorage.setItem("products", JSON.stringify(products));
    } catch (err) {
      console.error(err.message);
      hasError = true;
      const productsEle = document.querySelector(".products");
      productsEle.textContent = err.message;
    }
  }
  if (!hasError) displayAllProducts(products);
  const filters = document.querySelectorAll(".filter");

  filters.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filters.forEach((f) => f.classList.remove("active"));

      const target = e.currentTarget;
      target.classList.add("active");

      const value = target.textContent.trim().toLowerCase();
      if (products.length !== 0) filterCategory(value);
    });
  });
});

function giveColorAndSizes(products) {
  const colors = ["red", "blue", "green", "black", "white"];
  const sizes = ["S", "M", "L", "XL"];

  return products.map((product) => {
    const numOfColors = Math.floor(Math.random() * colors.length) + 1;
    const numOfSizes = Math.floor(Math.random() * sizes.length) + 1;

    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const shuffledSizes = [...sizes].sort(() => Math.random() - 0.5);
    if (product.category !== "electronics") {
      return {
        ...product,
        colors: shuffledColors.slice(0, numOfColors),
        sizes: shuffledSizes.slice(0, numOfSizes),
      };
    } else
      return {
        ...product,
        colors: shuffledColors.slice(0, numOfColors),
      };
  });
}

function createTitle(value) {
  let title;

  if (value === "mens" || value === "womens") {
    value = value.slice(0, -1) + "'s";
    title = value + " clothing";
    title = titleCase(title);
  } else {
    title = titleCase(value);
  }
  return { title, value };
}
function filterCategory(category) {
  let { title, value } = createTitle(category);
  let filteredProducts;
  if (value === "all") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter((product) =>
      product.category.toLowerCase().startsWith(value)
    );
  }

  if (value !== "all") displayProductsByCategory(filteredProducts, title);
  else displayAllProducts(products);
}

function displayProductsByCategory(products, title, all = false) {
  const productsEle = document.querySelector(".products");
  let outputSection = document.createElement("section");

  if (!all) {
    productsEle.innerHTML = "";
  }
  const searchBox = document.querySelector("#searchBox");
  const searchValue = searchBox.value.toLowerCase().trim();
  if (searchValue !== "") {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
  }
  if (products.length === 0) {
    outputSection.innerHTML = `
    <h3>No Items Found.</h3>
  `;
    productsEle.appendChild(outputSection);
    return;
  } else {
    outputSection.innerHTML = `
    <h3>${titleCase(title)}</h3>
    <div class="items"></div>
  `;
  }

  const items = outputSection.querySelector(".items");
  let output = ``;
  products.forEach((product) => {
    output += `<div class="item">
              <img src=${product.image} alt="Item" />
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
                <div class="row">Rating: ${product.rating.rate}⭐ (${
      product.rating.count
    }) ratings</div>
              </div>
              ${
                !productInCart(product)
                  ? `<button class="addBtn" data-id="${product.id}">
                    Add to Cart
                  </button>`
                  : `<button class="addBtn">Added to Cart</button>`
              }
            </div>`;
  });
  items.innerHTML = "";
  items.innerHTML = output;
  productsEle.appendChild(outputSection);
  return outputSection;
}

function productInCart(product) {
  if (!Array.isArray(cart) || cart.length === 0) return false;
  return cart.some(
    (item) => item.id === product.id && (item.quantity || 1) > 0
  );
}

function displayAllProducts(products) {
  const productsEle = document.querySelector(".products");
  productsEle.innerHTML = "";

  const searchBox = document.querySelector("#searchBox");
  const searchValue = searchBox.value.toLowerCase().trim();
  if (searchValue !== "") {
    getAllSearchedProducts(products, searchValue);
    return;
  }

  const mensProducts = products.filter(
    (products) => products.category === "men's clothing"
  );
  const womensProducts = products.filter(
    (products) => products.category === "women's clothing"
  );
  const jeweleryProducts = products.filter(
    (products) => products.category === "jewelery"
  );
  const electronicsProducts = products.filter(
    (products) => products.category === "electronics"
  );
  const AllProducts = [
    mensProducts,
    womensProducts,
    jeweleryProducts,
    electronicsProducts,
  ].filter((arr) => arr.length > 0);
  if (AllProducts.length === 0) {
    productsEle.innerHTML = `
      <section>
        <h3>No Items Found.</h3>
      </section>
    `;
    return;
  }
  AllProducts.forEach((product) => {
    const outputSection = displayProductsByCategory(
      product,
      product[0]?.category,
      true
    );
    productsEle.append(outputSection);
  });
}

function titleCase(str) {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

const searchBox = document.querySelector("#searchBox");
searchBox.addEventListener("input", (e) => {
  const value = e.target.value.trim().toLowerCase();
  const activeTab = document.querySelector(".active").textContent.toLowerCase();
  const { title } = createTitle(activeTab);
  if (value === "") {
    filterCategory(activeTab);
  } else if (value !== "" && activeTab === "all") {
    getAllSearchedProducts(products, value);
  } else if (value !== "" && activeTab !== "all") {
    const searchedProducts = products
      .filter((product) => product.category === title.toLowerCase())
      .filter((product) => product.title.toLowerCase().includes(value));

    displayProductsByCategory(searchedProducts, title);
  }
});

function getAllSearchedProducts(products, filterValue) {
  const productsEle = document.querySelector(".products");
  productsEle.innerHTML = "";
  const mensProducts = products
    .filter((products) => products.category === "men's clothing")
    .filter((product) => product.title.toLowerCase().includes(filterValue));
  const womensProducts = products
    .filter((products) => products.category === "women's clothing")
    .filter((product) => product.title.toLowerCase().includes(filterValue));
  const jeweleryProducts = products
    .filter((products) => products.category === "jewelery")
    .filter((product) => product.title.toLowerCase().includes(filterValue));
  const electronicsProducts = products
    .filter((products) => products.category === "electronics")
    .filter((product) => product.title.toLowerCase().includes(filterValue));
  const AllProducts = [];
  if (mensProducts.length > 0) {
    AllProducts.push(mensProducts);
  }
  if (womensProducts.length > 0) {
    AllProducts.push(womensProducts);
  }
  if (jeweleryProducts.length > 0) {
    AllProducts.push(jeweleryProducts);
  }
  if (electronicsProducts.length > 0) {
    AllProducts.push(electronicsProducts);
  }

  if (AllProducts.length === 0) {
    displayProductsByCategory(AllProducts, "No Data Found");
  } else {
    AllProducts.forEach((product) => {
      const outputSection = displayProductsByCategory(
        product,
        product[0]?.category,
        true
      );
      productsEle.append(outputSection);
    });
  }
}

const PRICE_RANGES = [
  { id: "0-25", min: 0, max: 25 },
  { id: "25-50", min: 25, max: 50 },
  { id: "50-100", min: 50, max: 100 },
  { id: "100on", min: 100, max: Infinity },
];

const applyFilterBtn = document.querySelector("#applyFilter");

applyFilterBtn.addEventListener("click", () => {
  const filtersObj = {};
  const colors = [];
  const sizes = [];

  document.querySelectorAll("input[name='color']").forEach((ele) => {
    if (ele.checked) {
      colors.push(ele.id);
    }
  });

  document.querySelectorAll("input[name='size']").forEach((ele) => {
    if (ele.checked) {
      sizes.push(ele.id);
    }
  });

  const range = parseInt(document.querySelector("#range").value, 10);

  const pRangeIds = [];
  document.querySelectorAll("input[name='prange']").forEach((ele) => {
    if (ele.checked) {
      pRangeIds.push(ele.id);
    }
  });

  if (colors.length > 0) filtersObj.colors = colors;
  if (sizes.length > 0) filtersObj.sizes = sizes;
  if (!isNaN(range) && range > 0) filtersObj.rating = range;
  if (pRangeIds.length > 0) {
    filtersObj.priceRanges = PRICE_RANGES.filter((r) =>
      pRangeIds.includes(r.id)
    );
  }

  const activeTab =
    document
      .querySelector(".filter.active")
      ?.textContent.trim()
      .toLowerCase() || "all";

  const searchValue = document
    .querySelector("#searchBox")
    .value.trim()
    .toLowerCase();

  let baseList = [...products];

  if (activeTab !== "all") {
    const { title } = createTitle(activeTab);
    baseList = baseList.filter(
      (p) => p.category.toLowerCase() === title.toLowerCase()
    );
  }

  if (searchValue) {
    baseList = baseList.filter((p) =>
      p.title.toLowerCase().includes(searchValue)
    );
  }

  const filtered = baseList.filter((product) => {
    if (filtersObj.colors) {
      const hasAllColors = filtersObj.colors.every((c) =>
        product.colors?.includes(c)
      );
      if (!hasAllColors) return false;
    }

    if (filtersObj.sizes) {
      const hasAnySize = product.sizes?.some((s) =>
        filtersObj.sizes.includes(s)
      );
      if (!hasAnySize) return false;
    }

    if (filtersObj.rating) {
      if (product.rating?.rate < filtersObj.rating) return false;
    }
    if (filtersObj.priceRanges) {
      const price = product.price;
      const inAnyRange = filtersObj.priceRanges.some(
        (range) => price >= range.min && price < range.max
      );
      if (!inAnyRange) return false;
    }

    return true;
  });

  if (activeTab === "all") {
    displayAllProducts(filtered);
  } else {
    const { title } = createTitle(activeTab);
    displayProductsByCategory(filtered, title);
  }
});

const rangeInput = document.querySelector("#range");
const ratingValue = document.querySelector("#ratingValue");

rangeInput.addEventListener("input", () => {
  ratingValue.textContent = rangeInput.value;
});

document.querySelector(".products").addEventListener("click", (e) => {
  const btn = e.target.closest(".addBtn");
  if (!btn) return;

  const id = btn.dataset.id;
  const product = products.find((p) => p.id == id);
  if (!product) return;

  addToCart(product);
});

function addToCart(product) {
  const activeTab = document.querySelector(".active").textContent.toLowerCase();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveUserCart();
  filterCategory(activeTab);
}
