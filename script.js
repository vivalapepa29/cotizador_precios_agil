document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const productName = document.getElementById("productName").value.toUpperCase();
  const priceInput = document.getElementById("price").value;
  const discountInput = document.getElementById("discount").value;
  const stock = document.querySelector('input[name="stock"]:checked');
  const unit = document.querySelector('input[name="unit"]:checked');

  // Preparar el resumen
  let summaryText = `• ${productName} ➡️ `;

  // Verificar si el nombre del producto contiene "ALTERNATIVA"
  if (productName.includes("ALTERNATIVA")) {
    summaryText = `• ${productName.replace("ALTERNATIVA", "💡ALTERNATIVA💡")} ➡️ `;
  }

  if (stock && stock.value === "no") {
    summaryText += `¡NO STOCK! ❌`;
    // Deshabilitar campos
    document.getElementById("price").disabled = true;
    document.getElementById("discount").disabled = true;
    document.querySelectorAll('input[name="unit"]').forEach((input) => (input.disabled = true));
  } else {
    const price = parseFloat(priceInput.replace(",", ".")) || 0; // Aceptar coma como separador decimal
    const discount = parseFloat(discountInput) || 0;
    const finalPrice = price - price * (discount / 100);
    summaryText += `<strong>${finalPrice.toFixed(2)}</strong> ${unit.value} ✅`;
  }

  // Mostrar el resumen
  const summaryContent = document.getElementById("summaryContent");
  summaryContent.innerHTML += `<div>${summaryText}</div>`;
  document.getElementById("summary").classList.remove("hidden");

  // Limpiar el formulario
  document.getElementById("productForm").reset();
  document.querySelectorAll('input[name="stock"]').forEach((input) => (input.checked = false));
  document.querySelectorAll('input[name="unit"]').forEach((input) => (input.checked = false));
  document.getElementById("productName").focus();
  // Habilitar campos nuevamente
  document.getElementById("price").disabled = false;
  document.getElementById("discount").disabled = false;
  document.querySelectorAll('input[name="unit"]').forEach((input) => (input.disabled = false));
});

// Función para seleccionar el radiobutton de unidad según el nombre del producto
document.getElementById("productName").addEventListener("input", function () {
  const productName = this.value.toLowerCase(); // Convertir a minúsculas para evitar problemas de mayúsculas/minúsculas

  // Palabras clave para €/m
  const metroKeywords = ["tubo", "tub", "pds", "perfrisa", "pasamanos", "pasamano", "iso", "conduccion", "cond", "presion"];
  
  // Palabras clave para €/kg
  const kiloKeywords = [
    "chapa", "viga", "angulo", "pletina", "simple t", "redondo", "cial", 
    "liso", "calibrado", "cuadrado", "mac", "presilla", "placa", "anclaje"
  ];
  
  // **Palabras clave para m²**
  const squareMeterKeywords = ["mallazo"]; // Aquí puedes añadir más palabras clave en el futuro

  // Comprobar si el nombre del producto contiene alguna palabra clave de €/m
  const isMetroProduct = metroKeywords.some(keyword => productName.includes(keyword));

  // Comprobar si el nombre del producto contiene alguna palabra clave de €/kg
  const isKiloProduct = kiloKeywords.some(keyword => productName.includes(keyword));
  
  // Comprobar si el nombre del producto contiene alguna palabra clave de m²
  const isSquareMeterProduct = squareMeterKeywords.some(keyword => productName.includes(keyword));

  if (isSquareMeterProduct) {
    document.querySelector('input[name="unit"][value="m²"]').checked = true;
  } else if (isMetroProduct) {
    document.querySelector('input[name="unit"][value="€/m"]').checked = true;
  } else if (isKiloProduct) {
    document.querySelector('input[name="unit"][value="€/kg"]').checked = true;
  }
});

document.getElementById("copyButton").addEventListener("click", function () {
  const summaryContent = document.getElementById("summaryContent").innerText;

  // Copiar al portapapeles
  navigator.clipboard
    .writeText(summaryContent)
    .then(() => {
      // Cambiar el texto del botón
      this.innerText = "¡Copiado!";
      setTimeout(() => {
        this.innerText = "Copiar";
      }, 2000); // Restablecer después de 2 segundos
    })
    .catch((err) => {
      console.error("Error al copiar: ", err);
    });
});

// Añadir evento para habilitar/deshabilitar campos según stock
document.querySelectorAll('input[name="stock"]').forEach((input) => {
  input.addEventListener("change", () => {
    const isNoStock = document.querySelector('input[name="stock"]:checked').value === "no";
    document.getElementById("price").disabled = isNoStock;
    document.getElementById("discount").disabled = isNoStock;
    document.querySelectorAll('input[name="unit"]').forEach((unitInput) => {
      unitInput.disabled = isNoStock;
    });
  });
});

document.getElementById("price").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Evitar el comportamiento predeterminado de Tab

    // Evaluar la expresión ingresada
    try {
      const expression = this.value; // Obtener la expresión del input
      const result = eval(expression.replace(",", ".")); // Evaluar y reemplazar coma por punto

      // Verificar que el resultado sea un número y actualizar el input con el resultado formateado
      if (!isNaN(result)) {
        this.value = result.toFixed(3); // Formatear a 3 decimales
      } else {
        alert("Entrada inválida, por favor introduce una expresión matemática válida.");
      }
    } catch (error) {
      console.error("Error al evaluar la expresión: ", error);
      alert("Entrada inválida, por favor introduce una expresión matemática válida.");
    }
  }
});
