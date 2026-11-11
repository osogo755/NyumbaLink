// Product data — this would come from the owner's dashboard/database later.
// Photos are reused across a few items per category (real per-item photography
// isn't feasible to source by hand here) — the color-matched background and
// distinct name/price still make each item feel individual for now.
const USD_RATE = 129; // KES per 1 USD — placeholder fixed rate

function it(name, img, priceKES, originalKES, bg) {
  return { name, img, priceKES, originalKES, bg };
}

function grad(c1, c2) {
  return `radial-gradient(circle at 30% 30%, ${c1} 0%, ${c2} 75%)`;
}

// Reused photo pool
const IMG = {
  teeBrown: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700&h=900&fit=crop',
  teeWhite: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=700&h=900&fit=crop',
  hoodieDark: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&h=900&fit=crop',
  hoodieLight: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=700&h=900&fit=crop',
  sweatshirt: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&h=900&fit=crop',
  shoeLight: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&h=900&fit=crop',
  shoeDark: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&h=900&fit=crop',
  tie: 'https://images.unsplash.com/photo-1591729652476-e7f587578d9c?w=700&h=900&fit=crop',
  jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&h=900&fit=crop',
  trousers: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&h=900&fit=crop',
  boxers: 'assets-boxers.svg',
  vest: 'https://images.unsplash.com/photo-1469332183683-f2bce6607452?w=700&h=900&fit=crop',
  belt: 'https://images.unsplash.com/photo-1752386246982-3dbb244eb5b3?w=700&h=900&fit=crop',
  cap: 'https://images.unsplash.com/photo-1519079754742-f83afaef6d35?w=700&h=900&fit=crop',
  socks: 'https://images.unsplash.com/photo-1484071096222-7936a931e094?w=700&h=900&fit=crop'
};

const PRODUCTS = {

  shirts: [
    it('Classic Brown Tee', IMG.teeBrown, 10000, 15000, grad('#6B5548', '#3A2E26')),
    it('Classic White Tee', IMG.teeWhite, 9500, 14000, grad('#F1EDE6', '#C9C2B3')),
    it('Charcoal Grey Tee', IMG.teeBrown, 9800, 14500, grad('#4A4A4A', '#232323')),
    it('Navy Blue Tee', IMG.teeWhite, 10200, 15200, grad('#2B3B57', '#141C29')),
    it('Olive Green Tee', IMG.teeBrown, 9700, 14200, grad('#5C6650', '#2E3327')),
    it('Maroon Tee', IMG.teeWhite, 9900, 14800, grad('#6E2A2A', '#351212')),
    it('Black Crewneck Tee', IMG.teeBrown, 10500, 15500, grad('#2A2A2A', '#0E0E0E')),
    it('Sky Blue Tee', IMG.teeWhite, 9600, 14000, grad('#5A83A8', '#2C4054')),
    it('Cream Linen Tee', IMG.teeBrown, 11000, 16000, grad('#E7DFC9', '#B7AC8C')),
    it('Mustard Yellow Tee', IMG.teeWhite, 9800, 14500, grad('#B08A2E', '#5C4715'))
  ],

  trousers: [
    it('Khaki Chinos', IMG.trousers, 3500, 5000, grad('#B8A47E', '#6E6046')),
    it('Charcoal Formal Trousers', IMG.jeans, 4200, 6200, grad('#3C3C3C', '#1A1A1A')),
    it('Navy Chinos', IMG.trousers, 3700, 5300, grad('#2B3B57', '#141C29')),
    it('Black Slim Trousers', IMG.jeans, 4000, 6000, grad('#242424', '#0D0D0D')),
    it('Beige Cargo Trousers', IMG.trousers, 3900, 5600, grad('#CBB78E', '#8C795A')),
    it('Olive Cargo Trousers', IMG.jeans, 3900, 5600, grad('#5C6650', '#2E3327')),
    it('Grey Wool Trousers', IMG.trousers, 4500, 6500, grad('#6B6B6B', '#333333')),
    it('Brown Corduroy Trousers', IMG.jeans, 4300, 6300, grad('#6B5548', '#3A2E26')),
    it('Stone Chinos', IMG.trousers, 3600, 5200, grad('#C9C2B3', '#948C78')),
    it('Dark Denim Trousers', IMG.jeans, 4100, 6100, grad('#2C3A54', '#131C29'))
  ],

  hoodies: [
    it('Charcoal Hoodie', IMG.hoodieDark, 14000, 18000, grad('#3D3D3D', '#151515')),
    it('Sand Hoodie', IMG.hoodieLight, 13500, 17000, grad('#CFC0A8', '#8F8064')),
    it('Navy Hoodie', IMG.hoodieDark, 14200, 18200, grad('#2B3B57', '#141C29')),
    it('Maroon Hoodie', IMG.hoodieLight, 13800, 17500, grad('#6E2A2A', '#351212')),
    it('Forest Green Hoodie', IMG.hoodieDark, 14000, 18000, grad('#334A34', '#182518')),
    it('Black Hoodie', IMG.hoodieLight, 14500, 18500, grad('#242424', '#0D0D0D'))
  ],

  sweatshirts: [
    it('Olive Crewneck', IMG.sweatshirt, 12000, 16000, grad('#5C6650', '#2E3327')),
    it('Grey Crewneck', IMG.sweatshirt, 11500, 15500, grad('#6B6B6B', '#333333')),
    it('Navy Crewneck', IMG.sweatshirt, 12200, 16200, grad('#2B3B57', '#141C29')),
    it('Black Crewneck', IMG.sweatshirt, 12500, 16500, grad('#242424', '#0D0D0D')),
    it('Cream Crewneck', IMG.sweatshirt, 12000, 16000, grad('#E7DFC9', '#B7AC8C'))
  ],

  shoes: [
    it('White Leather Sneakers', IMG.shoeLight, 6500, 9000, grad('#F1EDE6', '#C9C2B3')),
    it('Black Sneakers', IMG.shoeDark, 6800, 9500, grad('#242424', '#0D0D0D')),
    it('Brown Leather Loafers', IMG.shoeLight, 7500, 10500, grad('#6B5548', '#3A2E26')),
    it('Tan Boots', IMG.shoeDark, 8200, 11500, grad('#B8895E', '#6E4E33')),
    it('Navy Canvas Sneakers', IMG.shoeLight, 5800, 8000, grad('#2B3B57', '#141C29')),
    it('Grey Running Shoes', IMG.shoeDark, 6200, 8600, grad('#6B6B6B', '#333333'))
  ],

  ties: [
    it('Maroon Silk Tie', IMG.tie, 1800, 2600, grad('#6E2A2A', '#351212')),
    it('Navy Striped Tie', IMG.tie, 1700, 2400, grad('#2B3B57', '#141C29')),
    it('Black Formal Tie', IMG.tie, 1600, 2300, grad('#242424', '#0D0D0D')),
    it('Burgundy Paisley Tie', IMG.tie, 1900, 2700, grad('#5E2436', '#2B0F19')),
    it('Grey Textured Tie', IMG.tie, 1650, 2350, grad('#6B6B6B', '#333333')),
    it('Forest Green Tie', IMG.tie, 1750, 2500, grad('#334A34', '#182518'))
  ],

  jeans: [
    it('Indigo Slim Jeans', IMG.jeans, 4200, 6000, grad('#35486B', '#17233A')),
    it('Black Skinny Jeans', IMG.trousers, 4100, 5900, grad('#242424', '#0D0D0D')),
    it('Light Wash Jeans', IMG.jeans, 4000, 5700, grad('#7C93AC', '#43546A')),
    it('Dark Wash Jeans', IMG.trousers, 4300, 6100, grad('#1E2A3F', '#0D131F')),
    it('Grey Straight Jeans', IMG.jeans, 4100, 5900, grad('#6B6B6B', '#333333')),
    it('Stonewash Jeans', IMG.trousers, 4050, 5800, grad('#8C99A6', '#4C555E'))
  ],

  boxers: [
    it('Classic White Boxers', IMG.boxers, 900, 1300, grad('#F1EDE6', '#C9C2B3')),
    it('Navy Stripe Boxers', IMG.boxers, 950, 1350, grad('#2B3B57', '#141C29')),
    it('Black Boxers', IMG.boxers, 900, 1300, grad('#242424', '#0D0D0D')),
    it('Grey Marl Boxers', IMG.boxers, 900, 1300, grad('#6B6B6B', '#333333')),
    it('Printed Pack (3)', IMG.boxers, 2400, 3200, grad('#5C6650', '#2E3327'))
  ],

  vests: [
    it('White Cotton Vest', IMG.vest, 700, 1000, grad('#F1EDE6', '#C9C2B3')),
    it('Black Ribbed Vest', IMG.vest, 750, 1050, grad('#242424', '#0D0D0D')),
    it('Grey Basic Vest', IMG.vest, 700, 1000, grad('#6B6B6B', '#333333')),
    it('Navy Sport Vest', IMG.vest, 800, 1150, grad('#2B3B57', '#141C29')),
    it('Beige Linen Vest', IMG.vest, 900, 1300, grad('#CBB78E', '#8C795A'))
  ],

  belts: [
    it('Black Leather Belt', IMG.belt, 1500, 2200, grad('#242424', '#0D0D0D')),
    it('Brown Leather Belt', IMG.belt, 1500, 2200, grad('#6B5548', '#3A2E26')),
    it('Tan Woven Belt', IMG.belt, 1300, 1900, grad('#B8895E', '#6E4E33')),
    it('Reversible Belt (Black/Brown)', IMG.belt, 1900, 2700, grad('#3C332B', '#1A1512')),
    it('Canvas Web Belt', IMG.belt, 1100, 1600, grad('#5C6650', '#2E3327'))
  ],

  caps: [
    it('Black Snapback', IMG.cap, 1200, 1700, grad('#242424', '#0D0D0D')),
    it('Navy Fitted Cap', IMG.cap, 1300, 1900, grad('#2B3B57', '#141C29')),
    it('Khaki Bucket Hat', IMG.cap, 1100, 1600, grad('#B8A47E', '#6E6046')),
    it('White Trucker Cap', IMG.cap, 1150, 1650, grad('#F1EDE6', '#C9C2B3')),
    it('Grey Beanie', IMG.cap, 900, 1300, grad('#6B6B6B', '#333333'))
  ],

  socks: [
    it('Black Crew Pack (3)', IMG.socks, 800, 1150, grad('#242424', '#0D0D0D')),
    it('White Ankle Pack (3)', IMG.socks, 800, 1150, grad('#F1EDE6', '#C9C2B3')),
    it('Grey Wool Socks', IMG.socks, 650, 950, grad('#6B6B6B', '#333333')),
    it('Navy Argyle Socks', IMG.socks, 700, 1000, grad('#2B3B57', '#141C29')),
    it('Assorted Pattern Pack (5)', IMG.socks, 1400, 2000, grad('#5C6650', '#2E3327'))
  ]

};

let currentCat = 'shirts';
let currentIndex = 0;

const stage = document.getElementById('shopStage');
const productImage = document.getElementById('productImage');
const itemName = document.getElementById('itemName');
const priceKES = document.getElementById('priceKES');
const priceOldKES = document.getElementById('priceOldKES');
const priceUSD = document.getElementById('priceUSD');
const modalItemName = document.getElementById('modalItemName');
const modalAmount = document.getElementById('modalAmount');

function formatKES(n) {
  return 'KSh ' + n.toLocaleString();
}

function render() {
  const items = PRODUCTS[currentCat];

  if (!items || items.length === 0) {
    productImage.style.display = 'none';
    document.querySelector('.shop-price-panel').style.display = 'none';
    document.querySelector('.shop-product-shadow').style.display = 'none';
    stage.style.background = '#12100E';
    itemName.textContent = '';
    return;
  }

  productImage.style.display = 'block';
  document.querySelector('.shop-price-panel').style.display = 'block';
  document.querySelector('.shop-product-shadow').style.display = 'block';

  const item = items[currentIndex];
  productImage.style.opacity = 0;

  setTimeout(() => {
    productImage.src = item.img;
    productImage.alt = item.name;
    productImage.style.opacity = 1;
  }, 150);

  stage.style.background = item.bg;
  itemName.textContent = item.name + ' (' + (currentIndex + 1) + '/' + items.length + ')';
  priceKES.textContent = formatKES(item.priceKES);
  priceOldKES.textContent = formatKES(item.originalKES);
  priceUSD.textContent = '≈ $' + Math.round(item.priceKES / USD_RATE) + ' USD';
}

document.getElementById('prevBtn').addEventListener('click', () => {
  const items = PRODUCTS[currentCat];
  if (!items || items.length === 0) return;
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  render();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  const items = PRODUCTS[currentCat];
  if (!items || items.length === 0) return;
  currentIndex = (currentIndex + 1) % items.length;
  render();
});

document.querySelectorAll('.shop-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCat = tab.dataset.cat;
    currentIndex = 0;
    render();
  });
});

document.querySelectorAll('.size-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// Booking modal
const bookingModal = document.getElementById('bookingModal');
const stepPay = document.getElementById('stepPay');
const stepConfirm = document.getElementById('stepConfirm');

function openBooking() {
  const items = PRODUCTS[currentCat];
  if (!items || items.length === 0) return;
  const item = items[currentIndex];

  modalItemName.textContent = item.name;
  modalAmount.textContent = formatKES(Math.round(item.priceKES * 0.3));

  stepPay.classList.remove('hidden');
  stepConfirm.classList.add('hidden');
  bookingModal.classList.add('open');
}

function closeBooking() {
  bookingModal.classList.remove('open');
}

function confirmPayment() {
  stepPay.classList.add('hidden');
  stepConfirm.classList.remove('hidden');
}

bookingModal.addEventListener('click', (e) => {
  if (e.target === bookingModal) closeBooking();
});

// If arriving from a closed boutique's card, show a non-blocking notice —
// browsing and booking (for pickup once reopened) still work fully.
const params = new URLSearchParams(window.location.search);
if (params.get('status') === 'closed') {
  const banner = document.createElement('div');
  banner.className = 'closed-banner';
  banner.textContent = 'This boutique is currently closed — you can still browse and book items for pickup once it reopens.';
  document.querySelector('.shop-stage').insertAdjacentElement('beforebegin', banner);
}

render();
