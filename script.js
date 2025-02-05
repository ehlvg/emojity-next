// Theme Selector

if (localStorage.getItem("selectedTheme")) {
  const selectedTheme = localStorage.getItem("selectedTheme");
  document.querySelector("#theme").value = selectedTheme;
  if (selectedTheme === "orange") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-orange-400)"
    );
  } else if (selectedTheme === "blue") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-blue-600)"
    );
  } else if (selectedTheme === "green") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-green-600)"
    );
  } else if (selectedTheme === "purple") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-purple-600)"
    );
  } else if (selectedTheme === "yellow") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-amber-400)"
    );
  } else if (selectedTheme === "red") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-red-500)"
    );
  } else if (selectedTheme == "default") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-gray-800)"
    );
  }
}

document.getElementById("theme").addEventListener("change", function () {
  const themeValue = document.querySelector("#theme").value;
  if (themeValue === "orange") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-orange-400)"
    );
  } else if (themeValue === "blue") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-blue-600)"
    );
  } else if (themeValue === "green") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-green-600)"
    );
  } else if (themeValue === "purple") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-purple-600)"
    );
  } else if (themeValue === "yellow") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-amber-400)"
    );
  } else if (themeValue === "red") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-red-500)"
    );
  } else if (themeValue == "default") {
    document.documentElement.style.setProperty(
      "--chosen-accent",
      "var(--color-gray-800)"
    );
  }

  localStorage.setItem("selectedTheme", themeValue);
});

document
  .querySelector("emoji-picker")
  .addEventListener("emoji-click", (event) => {
    console.log(event.detail.emoji.unicode);
  });

const button = document.querySelector("button");
const tooltip = document.querySelector(".tooltip");
Popper.createPopper(button, tooltip);

document.querySelector("button").onclick = () => {
  tooltip.classList.toggle("shown");
};

// Saved Colors

// Get DOM elements
const colorPicker = document.getElementById("color-picker");
const saveBtn = document.getElementById("save-btn");
const colorList = document.getElementById("color-list");

// Initialize saved colors from localStorage or empty array
let savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];

// Function to save colors to localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("savedColors", JSON.stringify(savedColors));
};

// Function to create color preview element
const createColorPreview = (color) => {
  const colorPreview = document.createElement("li");
  colorPreview.className =
    "w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform";
  colorPreview.style.backgroundColor = color;

  // Add click event to set color picker value and update avatar
  colorPreview.addEventListener("click", (e) => {
    if (e.altKey) {
      // Remove color when Alt+Click
      removeColor(color);
    } else {
      colorPicker.value = color;
      // Update current state and avatar
      currentState.backgroundColor = color;
      updateAvatar();
    }
  });

  return colorPreview;
};

// Load saved colors on page load
const loadSavedColors = () => {
  colorList.innerHTML = ""; // Clear existing colors
  savedColors.forEach((color) => {
    colorList.appendChild(createColorPreview(color));
  });
};

// Add click event listener to save button
saveBtn.addEventListener("click", () => {
  const selectedColor = colorPicker.value;

  // Check if color is already saved
  if (!savedColors.includes(selectedColor)) {
    savedColors.push(selectedColor);

    // Save to localStorage
    saveToLocalStorage();

    // Add to color list
    colorList.appendChild(createColorPreview(selectedColor));
  }
});

// Load saved colors when page loads
loadSavedColors();

// Previewing avatar

// Initialize Two.js for preview
const previewContainer = document.querySelector(".preview");
const two = new Two({
  type: Two.Types.canvas,
  width: 300,
  height: 300,
}).appendTo(previewContainer);

// State management
let currentState = {
  backgroundColor: "#efefef",
  emoji: "🍊",
  size: 300, // Preview size
  exportSize: 1024, // High quality export size
  contentSize: 100,
  contentType: "emoji", // 'emoji' or 'image'
  imageUrl: null,
  hasShadow: false,
};

// Add new DOM elements
const uploadButton = document.getElementById("upload-button");
const imageUpload = document.getElementById("image-upload");
const sizeSlider = document.getElementById("size-slider");
const sizeValue = document.getElementById("size-value");
const shadowToggle = document.getElementById("shadow-toggle");

// Добавляем глобальные переменные для обновляемого превью
let loadedImg = null;
let imageSprite = null;

// Handle file upload
uploadButton.addEventListener("click", () => imageUpload.click());

imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        loadedImg = img;
        // При переключении сбрасываем ранее созданный спрайт
        if (imageSprite) {
          emojiGroup.remove(imageSprite);
          imageSprite = null;
        }
        currentState.imageUrl = event.target.result;
        currentState.contentType = "image";
        currentState.emoji = null;
        // Сброс размера в 100%
        currentState.contentSize = 100;
        sizeSlider.value = 100;
        sizeValue.textContent = "100";
        updateAvatar();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle size slider
sizeSlider.addEventListener("input", (e) => {
  currentState.contentSize = e.target.value;
  sizeValue.textContent = e.target.value;
  updateAvatar();
});

// Handle shadow toggle
shadowToggle.addEventListener("change", (e) => {
  currentState.hasShadow = e.target.checked;
  updateAvatar();
});

// Function to remove color
const removeColor = (color) => {
  savedColors = savedColors.filter((c) => c !== color);
  saveToLocalStorage();
  loadSavedColors();
};

// Create background and emoji group
const background = two.makeRectangle(
  two.width / 2,
  two.height / 2,
  two.width,
  two.height
);
const emojiGroup = two.makeGroup();

// Function to update the preview
const updateAvatar = () => {
  background.fill = currentState.backgroundColor;
  background.noStroke();

  // Очищаем группу контента
  while (emojiGroup.children.length > 0) {
    emojiGroup.remove(emojiGroup.children[0]);
  }

  const scale = parseFloat(currentState.contentSize) / 100;

  if (currentState.contentType === "emoji" && currentState.emoji) {
    // Всегда создаем новый элемент для emoji
    const baseSize = two.width * 0.4;
    const emojiText = two.makeText(
      currentState.emoji,
      two.width / 2,
      two.height / 2
    );
    emojiText.size = baseSize * scale;
    // Применяем тень и переустанавливаем размер на случай влияния фильтра
    if (currentState.hasShadow) {
      emojiText.style = "filter: drop-shadow(3px 3px 2px rgba(0,0,0,0.3))";
      emojiText.size = baseSize * scale;
    }
    emojiGroup.add(emojiText);
    two.update();
  } else if (currentState.contentType === "image" && loadedImg) {
    // Если спрайт уже существует, просто обновляем его размеры
    const aspectRatio = loadedImg.width / loadedImg.height;
    const baseSize = two.width * 0.8;
    let width, height;
    if (aspectRatio > 1) {
      width = baseSize * scale;
      height = (baseSize / aspectRatio) * scale;
    } else {
      height = baseSize * scale;
      width = baseSize * aspectRatio * scale;
    }
    if (imageSprite) {
      imageSprite.width = width;
      imageSprite.height = height;
    } else {
      const texture = new Two.Texture(loadedImg);
      imageSprite = two.makeSprite(texture, two.width / 2, two.height / 2);
      imageSprite.width = width;
      imageSprite.height = height;
    }
    if (currentState.hasShadow) {
      imageSprite.style = "filter: drop-shadow(3px 3px 2px rgba(0,0,0,0.3))";
    } else {
      imageSprite.style = null;
    }
    emojiGroup.add(imageSprite);
    two.update();
  }
};

// Function to create high-resolution export
const createExportCanvas = (size) => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext("2d");

  ctx.fillStyle = currentState.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  const scale = currentState.contentSize / 100;

  if (currentState.contentType === "emoji" && currentState.emoji) {
    ctx.font = `${size * 0.5 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (currentState.hasShadow) {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }

    ctx.fillText(currentState.emoji, size / 2, size / 2);
  } else if (currentState.contentType === "image" && currentState.imageUrl) {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const drawSize = Math.min(size, size) * scale;
      let drawWidth, drawHeight;

      if (aspectRatio > 1) {
        drawWidth = drawSize;
        drawHeight = drawSize / aspectRatio;
      } else {
        drawHeight = drawSize;
        drawWidth = drawSize * aspectRatio;
      }

      if (currentState.hasShadow) {
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
      }

      ctx.drawImage(
        img,
        (size - drawWidth) / 2,
        (size - drawHeight) / 2,
        drawWidth,
        drawHeight
      );

      // Update download link after image is drawn
      const dataUrl = exportCanvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `avatar-${size}x${size}.png`;
      downloadLink.click();
    };
    img.src = currentState.imageUrl;
    return; // Early return for async image processing
  }

  return exportCanvas;
};

// Listen for color changes
colorPicker.addEventListener("input", (e) => {
  currentState.backgroundColor = e.target.value;
  updateAvatar();
});

// Listen for emoji selection
document
  .querySelector("emoji-picker")
  .addEventListener("emoji-click", (event) => {
    currentState.contentType = "emoji";
    currentState.emoji = event.detail.emoji.unicode;
    // Если до этого был режим image, сбрасываем загруженное изображение и спрайт
    loadedImg = null;
    if (imageSprite) {
      emojiGroup.remove(imageSprite);
      imageSprite = null;
    }
    // Сброс размера в 100%
    currentState.contentSize = 100;
    sizeSlider.value = 100;
    sizeValue.textContent = "100";
    updateAvatar();
  });

// Create export button
const exportButton = document.createElement("button");
exportButton.textContent = "Export Avatar";
exportButton.className =
  "bg-[var(--chosen-accent)] text-white p-2 rounded-lg mt-4";
previewContainer.appendChild(exportButton);

// Create size selector
const sizeSelector = document.createElement("select");
sizeSelector.className = "mt-2 p-2 rounded-lg border border-gray-200";
const sizes = [
  { label: "Small (256x256)", value: 256 },
  { label: "Medium (512x512)", value: 512 },
  { label: "Large (1024x1024)", value: 1024 },
  { label: "Extra Large (2048x2048)", value: 2048 },
];

sizes.forEach((size) => {
  const option = document.createElement("option");
  option.value = size.value;
  option.textContent = size.label;
  if (size.value === currentState.exportSize) {
    option.selected = true;
  }
  sizeSelector.appendChild(option);
});

previewContainer.insertBefore(sizeSelector, exportButton);

// Export functionality
exportButton.addEventListener("click", () => {
  if (!currentState.emoji && !currentState.imageUrl) {
    alert("Please select an emoji or upload an image first!");
    return;
  }

  const selectedSize = parseInt(sizeSelector.value);
  const exportCanvas = createExportCanvas(selectedSize);

  if (currentState.contentType === "image") {
    // For images, we don't immediately trigger download due to async loading
    return;
  }

  // For emojis, we can download immediately
  const dataUrl = exportCanvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = dataUrl;
  downloadLink.download = `avatar-${selectedSize}x${selectedSize}.png`;
  downloadLink.click();
});

// Initial render
updateAvatar();

// Picker Bounds Checker

// DOM elements
const emojiButton = document.querySelector("#emoji-button"); // кнопка для открытия
const emojiPicker = document.querySelector("emoji-picker");

// Showing picker function
function showPicker() {
  tooltip.style.display = "block";
}

// Hiding picker function
function hidePicker() {
  tooltip.style.display = "none";
}

emojiButton.addEventListener("click", (event) => {
  event.stopPropagation(); // Preventing of the event

  // Toggle picker display
  if (tooltip.style.display === "none" || !tooltip.style.display) {
    showPicker();
  } else {
    hidePicker();
  }
});

// Click out of bounds
document.addEventListener("click", (event) => {
  // Check if click wasn't in the bounds of the picker and button
  if (
    !emojiPicker.contains(event.target) &&
    !emojiButton.contains(event.target) &&
    tooltip.style.display !== "none"
  ) {
    hidePicker();
  }
});

// Prevent closing when clicking on the picker
emojiPicker.addEventListener("click", (event) => {
  event.stopPropagation();
});
