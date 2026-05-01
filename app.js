const tg = window.Telegram.WebApp;
tg.expand();

// Настройка цветов шапки Telegram под наш стиль
tg.setHeaderColor('#0a0d14');
tg.setBackgroundColor('#0a0d14');

const products = [
    { id: 1, name: "PRIVATE ( НАВСЕГДА )", priceUSD: 8.55, priceRUB: 640, stock: 5, cssClass: "" },
    { id: 2, name: "GEMINI AI PRO (ПОДПИСКА 12 МЕС)", priceUSD: 2.65, priceRUB: 198, stock: 5, cssClass: "gemini" },
    { id: 3, name: "Rust | 0 часов | Steam", priceUSD: 4.60, priceRUB: 350, stock: 0, cssClass: "" }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    document.getElementById("items-count").innerText = `${products.length} товаров доступно`;

    products.forEach(p => {
        const isOutOfStock = p.stock === 0;
        
        // Рендерим кнопку (синяя В корзину или серая Нет)
        const btnHtml = isOutOfStock 
            ? `<button class="btn-primary btn-small btn-disabled" disabled><i class='bx bx-cart'></i> Нет</button>`
            : `<button class="btn-primary btn-small" onclick="addToCart(${p.id})"><i class='bx bx-cart'></i> В корзину</button>`;

        // Рендерим текст наличия
        const stockHtml = isOutOfStock
            ? `<span class="stock-count" style="color: #ff453a;">Нет в наличии</span>`
            : `<span class="stock-count">Осталось ${p.stock}</span>`;

        container.innerHTML += `
            <div class="product-card">
                <div class="product-image ${p.cssClass}"></div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-meta">
                        <span class="delivery-type"><i class='bx bx-bolt-circle'></i> Мгновенная доставка</span>
                        ${stockHtml}
                    </div>
                    <div class="product-bottom">
                        <div class="price-block">
                            <span class="price-main">$${p.priceUSD.toFixed(2)}</span>
                            <span class="price-rub">≈ ${p.priceRUB} ₽</span>
                        </div>
                        ${btnHtml}
                    </div>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    tg.HapticFeedback.impactOccurred('medium');
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById("cart-badge");
    const cartEmpty = document.getElementById("cart-empty");
    const cartContent = document.getElementById("cart-content");

    // Обновляем бейдж на иконке корзины
    if (cart.length > 0) {
        badge.innerText = cart.length;
        badge.style.display = "flex";
        cartEmpty.style.display = "none";
        cartContent.style.display = "block";
    } else {
        badge.style.display = "none";
        cartEmpty.style.display = "flex";
        cartContent.style.display = "none";
    }
    
    // Отрисовка товаров в корзине
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    
    let totalRUB = 0;
    cart.forEach((item, index) => {
        totalRUB += item.priceRUB;
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4 style="margin-bottom: 5px;">${item.name}</h4>
                    <span style="color: var(--primary-blue); font-size: 12px;"><i class='bx bx-bolt-circle'></i> Мгновенно</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; margin-bottom: 5px;">$${item.priceUSD.toFixed(2)}</div>
                    <div style="font-size: 12px; color: var(--text-gray);">≈ ${item.priceRUB} ₽</div>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-total-price").innerText = totalRUB + " ₽";
}

// Логика переключения нижнего меню
function switchTab(tabId) {
    tg.HapticFeedback.selectionChanged();
    
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // Убираем подсветку со всех иконок меню
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    // Показываем нужную вкладку (в данном примере готовы только Каталог и Корзина)
    if (tabId === 'catalog' || tabId === 'cart') {
        document.getElementById(`page-${tabId}`).classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    } else {
        // Заглушка для Главной и Профиля
        tg.showAlert('Раздел в разработке');
        document.getElementById('page-catalog').classList.add('active');
        document.getElementById('tab-catalog').classList.add('active');
    }
}

function checkout() {
    let total = cart.reduce((sum, item) => sum + item.priceRUB, 0);
    let itemsNames = cart.map(item => item.name).join(", ");
    let dataString = `order|${itemsNames}|${total}`;
    
    tg.sendData(dataString);
}

renderProducts();
updateCartUI();