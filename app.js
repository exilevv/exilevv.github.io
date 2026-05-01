const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем Web App на весь экран

// Каталог твоих товаров (ID, Название, Цена в рублях, Наличие)
const products = [
    { id: 1, name: "PRIVATE (НАВСЕГДА)", price: 640, stock: 5 },
    { id: 2, name: "Gemini AI Pro (12 мес)", price: 198, stock: 10 },
    { id: 3, name: "Telegram Views (10k)", price: 150, stock: 999 },
    { id: 4, name: "Rust | 0 часов | Steam", price: 350, stock: 0 } // Нет в наличии
];

let cart = [];

// Рендер каталога
function renderProducts() {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(p => {
        const isOutOfStock = p.stock === 0;
        const btnHtml = isOutOfStock 
            ? `<button class="out-of-stock-btn" disabled>Нет в наличии</button>`
            : `<button class="add-btn" onclick="addToCart(${p.id})">В корзину</button>`;

        container.innerHTML += `
            <div class="product-card">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="product-price">${p.price} ₽</div>
                </div>
                ${btnHtml}
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    tg.HapticFeedback.impactOccurred('light'); // Вибрация при нажатии
}

function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.length;
    
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.price} ₽</span>
            </div>
        `;
    });

    document.getElementById("cart-total-price").innerText = total + " ₽";
}

function toggleCart() {
    document.getElementById("catalog").classList.toggle("active");
    document.getElementById("cart").classList.toggle("active");
}

// Отправка данных боту и закрытие WebApp
function checkout() {
    if (cart.length === 0) {
        tg.showAlert("Корзина пуста!");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    let itemsNames = cart.map(item => item.name).join(", ");

    // Формируем строку: "order|Названия|Сумма"
    let dataString = `order|${itemsNames}|${total}`;
    
    tg.sendData(dataString); // Отправляем в Python скрипт
}

// Запускаем при загрузке
renderProducts();