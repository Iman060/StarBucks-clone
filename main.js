let cachedMenuData = null;
let menuAlreadyShown = false;

async function showMenu() {
  if (menuAlreadyShown) return;
  menuAlreadyShown = true;

  const drinkUl = document.querySelector('#drinks > ul');
  const foodUl = document.querySelector('#food > ul');
  const atHomeCofeeUl = document.querySelector('#atHomeCofee > ul');

  const loadingImg = document.createElement('img');
  loadingImg.src = 'img/loading.gif'; 
  loadingImg.alt = 'Loading...';
  loadingImg.id = 'loading-spinner';
  loadingImg.style.cssText = 'display: block; margin: auto; width: 300px; height: 300px;';
  document.querySelector('.baseMenu___UpTAi').appendChild(loadingImg);

  try {
    const res = await fetch("https://starbucks-data-nine.vercel.app/menus");
    const data = await res.json();
    cachedMenuData = data;
    console.log(data);
    
    const drinksHTML = [];
    const foodHTML = [];
    const atHomeCoffeeHTML = [];

    data.slice(0, 3).forEach(category => {
      category.children.forEach(child => {
        const itemHTML = `
          <li onclick="loadSubCategory('${child.name.replace(/'/g, "\\'")}')" class="mb-4 w-full md:w-1/2 flex items-center gap-6 relative cursor-pointer">
            <div class="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
              <img src="${child.categoryImageURL || ''}" alt="${child.name}" class="w-full h-full object-cover object-center">
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">${child.name}</h3>
            </div>
            <a href="#" class="absolute inset-0">
              <span class="sr-only">${child.name}</span>
            </a>
          </li>
        `;
        if (category.name === 'Drinks') drinksHTML.push(itemHTML);
        else if (category.name === 'Food') foodHTML.push(itemHTML);
        else if (category.name === 'At Home Coffee') atHomeCoffeeHTML.push(itemHTML);
      });
    });

    drinkUl.innerHTML = drinksHTML.join("");
    foodUl.innerHTML = foodHTML.join("");
    atHomeCofeeUl.innerHTML = atHomeCoffeeHTML.join("");
  } catch (error) {
    console.error("Failed to load menu:", error);
  } finally {
    // Remove loading spinner
    loadingImg.remove();
  }
}

function loadSubCategory(subCategoryName) {
  if (!cachedMenuData) return;

  const mainContainer = document.querySelector('.baseMenu___UpTAi');

  // Remove  sections
  document.querySelectorAll('.dynamic-sub-section').forEach(el => el.remove());

  // Remove button if exists
  const oldBackBtn = document.getElementById('backToMenuBtn');
  if (!oldBackBtn) {
    const backButton = document.createElement('button');
    backButton.id = 'backToMenuBtn';
    backButton.innerText = "🔙 to Full Menu";
    backButton.className = "ml-4 mb-6 text-green-700 font-bold hover:underline";
    backButton.onclick = () => {
      restoreMainMenu();
    };
    mainContainer.appendChild(backButton);
  }

  // Remove main sections
  document.getElementById('drinks')?.remove();
  document.getElementById('food')?.remove();
  document.getElementById('atHomeCofee')?.remove();

  const allCategories = cachedMenuData;
  let sub = null;

  for (const category of allCategories) {
    const match = category.children.find(child => child.name === subCategoryName);
    if (match) {
      sub = match;
      break;
    }
  }
  
  if (sub.children && sub.children.length > 0) {
    sub.children.forEach(sectionItem => {
      const products = sectionItem.products || [];
  
      const section = document.createElement('section');
      section.classList.add('pb-4', 'lg:pb-6', 'dynamic-sub-section');
      section.innerHTML = `
        <h2 class="text-base pb-3 font-bold">${sectionItem.name}</h2>
        <hr class="border-t border-gray-300 pb-5" />
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          ${products.length > 0
            ? products.map(product => `
              <li class="mb-4 w-full flex items-center gap-6 relative cursor-pointer" onclick='addOrder(${JSON.stringify(product)})'>
                <div class="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img src="${product.imageURL || ''}" alt="${product.name}" class="w-full h-full object-cover object-center">
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
                </div>
                <a href="#" class="absolute inset-0">
                  <span class="sr-only">${product.name}</span>
                </a>
              </li>
            `).join('')
            : '<li class="text-gray-500">No products available.</li>'
          }
        </ul>
      `;
      mainContainer.appendChild(section);
    });
  } else if (sub.products && sub.products.length > 0) {
    const section = document.createElement('section');
    section.classList.add('pb-4', 'lg:pb-6', 'dynamic-sub-section');
    section.innerHTML = `
      <h2 class="text-base pb-3 font-bold">${sub.name}</h2>
      <hr class="border-t border-gray-300 pb-5" />
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        ${sub.products.map(product => `
          <li class="mb-4 w-full flex items-center gap-6 relative cursor-pointer" onclick='addOrder(${JSON.stringify(product)})'>
            <div class="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
              <img src="${product.imageURL || ''}" alt="${product.name}" class="w-full h-full object-cover object-center">
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">${product.name}</h3>
            </div>
            <a href="#" class="absolute inset-0">
              <span class="sr-only">${product.name}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    `;
    mainContainer.appendChild(section);
  } else {
    const section = document.createElement('section');
    section.classList.add('pb-4', 'lg:pb-6', 'dynamic-sub-section');
    section.innerHTML = `
      <h2 class="text-base pb-3 font-bold">${sub.name}</h2>
      <hr class="border-t border-gray-300 pb-5" />
      <p class="text-gray-500 px-4">No products available.</p>
    `;
    mainContainer.appendChild(section);
  }
  
  
  
}
showMenu();


function addOrder(product) {
  // Hide main menu
  const menu = document.querySelector('.baseMenu___UpTAi');
  const list = document.querySelector('.menuWithSideNav___izNx1');
  if (menu) {
    menu.classList.add('hidden');
    list.classList.add('!hidden');
  }

  // Remove previous panel
  document.querySelector('.productInfoPanel')?.remove();

  // Create container
  const panel = document.createElement('div');
  panel.className = 'productInfoPanel bg-white';

  panel.innerHTML = `
    <div class="mt-6 md:max-w-7xl mx-auto">
        <button onclick="goBackToMenu()" class="text-green-700 font-bold hover:underline">← Back to Menu</button>
      </div>
    <div class="bg-[#1e3932]">
      
    <div class="bg-[#1e3932] text-white p-8 flex flex-col lg:flex-row items-center gap-8 md:max-w-7xl mx-auto">
      <img src="${product.imageURL}" alt="${product.name}" class="w-48 h-48 object-contain">
      <div>
        <h1 class="text-3xl font-bold mb-2">${product.name}</h1>
        <p class="text-lg opacity-80">${product.calories || 20} calories</p>
      </div>
    </div>
    </div>
    <div class="p-6 md:max-w-7xl mx-auto">
      <h2 class="text-xl font-semibold mb-4">Size options</h2>
      <div class="flex gap-6 mb-6">
        <div class="text-center">
          <div class="text-sm">Short</div>
          <div class="text-xs text-gray-500">8 fl oz</div>
        </div>
        <div class="text-center">
          <div class="text-sm">Tall</div>
          <div class="text-xs text-gray-500">12 fl oz</div>
        </div>
        <div class="text-center border-2 border-green-600 rounded-full px-4 py-2">
          <div class="text-sm font-bold text-green-600">Grande</div>
          <div class="text-xs text-green-600">16 fl oz</div>
        </div>
        <div class="text-center">
          <div class="text-sm">Venti</div>
          <div class="text-xs text-gray-500">20 fl oz</div>
        </div>
      </div>

      <button class=" border-2 px-6 py-2 rounded-full font-semibold mb-6">
        ✨ Customize
      </button>

      <div class="flex justify-between items-center">
        <span class="text-gray-500 text-sm"><i class="fa-solid fa-location-dot"></i> Select a store to view availability</span>
        <button onclick='addProductToBasket(${JSON.stringify(product)})' class="bg-[#1e3932] text-white px-6 py-2 rounded-full font-semibold hover:bg-green-800 transition">
          Add to Order
        </button>

      </div>

      
    </div>
  `;

  document.querySelector('main').appendChild(panel);
}

function goBackToMenu() {
  document.querySelector('.productInfoPanel')?.remove();

  const menuWrapper = document.querySelector('.menuWithSideNav___izNx1');
  const menu = document.querySelector('.baseMenu___UpTAi');
  if (menuWrapper) {
    menuWrapper.classList.remove('!hidden');
    menu.classList.remove('hidden');
  }

  restoreMainMenu();
}

function addProductToBasket(product) {
  let basket = JSON.parse(localStorage.getItem("basket")) || [];

  if (!product.assets) {
    product.assets = { masterImage: { uri: product.imageURL || '' } };
  }

  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));

  alert(`✅ "${product.name}" has been added to your basket!`);
}

  
function openHamburger() {
  const sidebar = document.getElementById('sidebar');
  const hamburgerIcon = document.querySelector('.hamburger i');

  sidebar.classList.toggle('translate-x-full');

  if (sidebar.classList.contains('translate-x-full')) {
      hamburgerIcon.classList.remove('fa-xmark');
      hamburgerIcon.classList.add('fa-bars');
  } else {
      hamburgerIcon.classList.remove('fa-bars');
      hamburgerIcon.classList.add('fa-xmark');
  }
}

function restoreMainMenu() {
  document.querySelectorAll('.dynamic-sub-section').forEach(el => el.remove());

  document.getElementById('backToMenuBtn')?.remove();

  const mainContainer = document.querySelector('.baseMenu___UpTAi');

  // Drinks
  const drinks = document.createElement('section');
  drinks.id = 'drinks';
  drinks.innerHTML = `
    <h2 class="text-base pb-3 font-bold">Drinks</h2>
    <hr class="border-t border-gray-300 pb-5" />
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"></ul>
  `;
  mainContainer.appendChild(drinks);

  // Food
  const food = document.createElement('section');
  food.id = 'food';
  food.innerHTML = `
    <h2 class="text-base pb-3 font-bold">Food</h2>
    <hr class="border-t border-gray-300 pb-5" />
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"></ul>
  `;
  mainContainer.appendChild(food);

  // At Home Coffee
  const atHome = document.createElement('section');
  atHome.id = 'atHomeCofee';
  atHome.innerHTML = `
    <h2 class="text-base pb-3 font-bold">At Home Coffee</h2>
    <hr class="border-t border-gray-300 pb-5" />
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"></ul>
  `;
  mainContainer.appendChild(atHome);

  menuAlreadyShown = false;

  showMenu();
}

function toggleAccordion(id, iconId) {
  const expander = document.getElementById(id);
  const icon = document.getElementById(iconId);

  if (expander.classList.contains('h-0')) {
    expander.classList.remove('h-0');
    expander.classList.add('h-auto');
    icon.classList.add('rotate-180');
  } else {
    expander.classList.remove('h-auto');
    expander.classList.add('h-0');
    icon.classList.remove('rotate-180');
  }
}