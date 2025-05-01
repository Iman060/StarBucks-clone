let basketArr = JSON.parse(localStorage.getItem("basket")) || [];

const prCase = document.getElementById("prCase");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");

function renderBasket() {
  if (basketArr.length === 0) {
    prCase.innerHTML = `<div class="text-center text-xl text-gray-500 py-20">Your basket is empty.</div>`;
    subtotalEl.textContent = "$0.00";
    taxEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
    return;
  }

  let html = "";
  let subtotal = 0;

  basketArr.forEach((item, index) => {
    // Assign random price if not already set
    if (!item.price) {
      item.price = (Math.random() * 5 + 3).toFixed(2); // $3.00–$8.00
    }

    subtotal += parseFloat(item.price);

    html += `
      <div class="flex gap-4 items-center bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <img src="${item.assets?.masterImage?.uri || item.imageURL || ''}" alt="${item.name}" class="w-20 h-20 object-cover rounded-full" />
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900">${item.name}</h3>
          <p class="text-gray-500 text-sm">${item.size || 'Grande'}</p>
          <p class="text-green-700 font-semibold mt-1">$${item.price}</p>
        </div>
        <div class="flex flex-col gap-2">
          <button onclick="duplicateItem(${index})" class="text-green-600 hover:text-green-800">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  const tax = (Math.random() * (0.42 - 0.10) + 0.10).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);

  prCase.innerHTML = html;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax}`;
  totalEl.textContent = `$${total}`;
}

function removeItem(index) {
  basketArr.splice(index, 1);
  localStorage.setItem("basket", JSON.stringify(basketArr));
  renderBasket();
}

function duplicateItem(index) {
  const item = { ...basketArr[index] };
  basketArr.push(item);
  localStorage.setItem("basket", JSON.stringify(basketArr));
  renderBasket();
}

// Initial load
renderBasket();
