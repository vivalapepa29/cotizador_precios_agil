document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const productName = document
    .getElementById("productName")
    .value.toUpperCase();
  const priceInput = document.getElementById("price").value;
  const discountInput = document.getElementById("discount").value;
  const stock = document.querySelector('input[name="stock"]:checked');
  const unit = document.querySelector('input[name="unit"]:checked');

  // Preparar el resumen
  let summaryText = `• ${productName} ➡️ `;

  // Verificar si el nombre del producto contiene "ALTERNATIVA", "alt" o "alter"
  if (/ALTERNATIVA|alt|alter/i.test(productName)) {
    summaryText = `• ${productName.replace(
      /ALTERNATIVA|alt|alter/gi,
      "💡ALTERNATIVA💡"
    )} ➡️ `;
  }

  if (stock && stock.value === "no") {
    summaryText += `¡NO STOCK! ❌`;

    // Deshabilitar campos
    document.getElementById("price").disabled = true;
    document.getElementById("discount").disabled = true;
    document
      .querySelectorAll('input[name="unit"]')
      .forEach((input) => (input.disabled = true));
  } else {
    const price = parseFloat(priceInput.replace(",", ".")) || 0; // Aceptar coma como separador decimal
    const discount = parseFloat(discountInput) || 0;
    const finalPrice = price - price * (discount / 100);
    summaryText += `<strong>${finalPrice.toFixed(3)}</strong> ${unit.value} ✅`;
  }

  // Mostrar el resumen
  const summaryContent = document.getElementById("summaryContent");
  const summaryItem = document.createElement("div");
  summaryItem.innerHTML = `${summaryText} <button type="button" class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onclick="removeSummaryItem(this)">Borrar</button>`;
  summaryContent.appendChild(summaryItem);
  document.getElementById("summary").classList.remove("hidden");

  // Limpiar el formulario
  document.getElementById("productForm").reset();
  document
    .querySelectorAll('input[name="stock"]')
    .forEach((input) => (input.checked = false));
  document
    .querySelectorAll('input[name="unit"]')
    .forEach((input) => (input.checked = false));
  document.getElementById("productName").focus();

  // Habilitar campos nuevamente
  document.getElementById("price").disabled = false;
  document.getElementById("discount").disabled = false;
  document
    .querySelectorAll('input[name="unit"]')
    .forEach((input) => (input.disabled = false));
});

// Función para eliminar un elemento del resumen
function removeSummaryItem(button) {
  button.parentElement.remove();
}

// Función para seleccionar el radiobutton de unidad según el nombre del producto
document.getElementById("productName").addEventListener("input", function () {
  const productName = this.value.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas

  // Palabras clave para €/m
  const metroKeywords = [
    "tubo",
    "tub",
    "pds",
    "perfrisa",
    "pasamanos",
    "pasamano",
    "iso",
    "conduccion",
    "cond",
    "presion",
  ];

  // Palabras clave para €/kg
  const kiloKeywords = [
    "chapa",
    "viga",
    "angulo",
    "pletina",
    "simple t",
    "redondo",
    "redondo calibrado",
    "comercial",
    "redondo comercial",
    "red comercial",
    "red cial",
    "calibrado",
    "cial",
    "liso",
    "calibrado",
    "cuadrado mac",
    "mac",
    "presilla",
    "placa",
    "anclaje",
    "ipe",
    "ipn",
    "heb",
    "hea",
    "upn",
  ];

  // **Palabras clave para m²**
  const squareMeterKeywords = ["mallazo"]; // Aquí puedes añadir más palabras clave en el futuro

  // Comprobar si el nombre del producto contiene alguna palabra clave de €/m
  const isMetroProduct = metroKeywords.some((keyword) =>
    productName.includes(keyword)
  );

  // Comprobar si el nombre del producto contiene alguna palabra clave de €/kg
  const isKiloProduct = kiloKeywords.some((keyword) =>
    productName.includes(keyword)
  );

  // Comprobar si el nombre del producto contiene alguna palabra clave de m²
  const isSquareMeterProduct = squareMeterKeywords.some((keyword) =>
    productName.includes(keyword)
  );

  // Seleccionar la unidad correspondiente
  if (isMetroProduct) {
    document.querySelector('input[name="unit"][value="€/m"]').checked = true;
  } else if (isKiloProduct) {
    document.querySelector('input[name="unit"][value="€/kg"]').checked = true;
  } else if (isSquareMeterProduct) {
    document.querySelector('input[name="unit"][value="m²"]').checked = true;
  }
});

// Función para copiar el resumen al portapapeles
document.getElementById("copyButton").addEventListener("click", function () {
  const summaryTextOnly = Array.from(
    document.querySelectorAll("#summaryContent div")
  )
    .map((div) => div.innerText.replace("Borrar", "").trim())
    .join("\n");
  navigator.clipboard.writeText(summaryTextOnly);

  // Cambiar el texto del botón
  const button = this;
  button.textContent = "¡Copiado!";
  setTimeout(() => {
    button.textContent = "Copiar";
  }, 2000);
});

// Función para enviar el resumen por WhatsApp
document
  .getElementById("whatsappCopyButton")
  .addEventListener("click", function () {
    const summaryTextOnly = Array.from(
      document.querySelectorAll("#summaryContent div")
    )
      .map((div) => div.innerText.replace("Borrar", "").trim())
      .join("\n");
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
      summaryTextOnly
    )}`;
    window.open(whatsappLink, "_blank");
  });

// Controlar el estado de los campos de Precio, Descuento y Unidad según el stock
document.querySelectorAll('input[name="stock"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (this.value === "no") {
      document.getElementById("price").disabled = true;
      document.getElementById("discount").disabled = true;
      document.querySelectorAll('input[name="unit"]').forEach((unit) => {
        unit.disabled = true;
      });
    } else {
      document.getElementById("price").disabled = false;
      document.getElementById("discount").disabled = false;
      document.querySelectorAll('input[name="unit"]').forEach((unit) => {
        unit.disabled = false;
      });
    }
  });
});
