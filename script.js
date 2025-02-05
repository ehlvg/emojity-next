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
const previewContainer = document.querySelector(".preview");
const previewCanvas = document.createElement("canvas");
previewCanvas.width = 300;
previewCanvas.height = 300;
previewContainer.innerHTML = "";
previewContainer.appendChild(previewCanvas);
const ctx = previewCanvas.getContext("2d");

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

// Initialize loaded image
let loadedImg = null;

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
        currentState.imageUrl = event.target.result;
        currentState.contentType = "image";
        currentState.emoji = null;
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

// Function to update avatar
const updateAvatar = () => {
  // Background color
  ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  ctx.fillStyle = currentState.backgroundColor;
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

  const scale = parseFloat(currentState.contentSize) / 100;

  // Emoji mode
  if (currentState.contentType === "emoji" && currentState.emoji) {
    const baseSize = previewCanvas.width * 0.4;
    let computedSize = baseSize * scale;
    computedSize = Math.min(computedSize, previewCanvas.width);
    ctx.font = `${computedSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (currentState.hasShadow) {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = "transparent";
    }
    ctx.fillStyle = "#000";
    ctx.fillText(
      currentState.emoji,
      previewCanvas.width / 2,
      previewCanvas.height / 2
    );
  }
  // Image mode
  else if (currentState.contentType === "image" && loadedImg) {
    const aspectRatio = loadedImg.width / loadedImg.height;
    const baseSize = previewCanvas.width;
    let width, height;
    if (aspectRatio > 1) {
      width = baseSize * scale;
      height = width / aspectRatio;
    } else {
      height = baseSize * scale;
      width = height * aspectRatio;
    }
    if (width > previewCanvas.width) {
      width = previewCanvas.width;
      height = width / aspectRatio;
    }
    if (currentState.hasShadow) {
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = "transparent";
    }
    const drawX = (previewCanvas.width - width) / 2;
    const drawY = (previewCanvas.height - height) / 2;
    ctx.drawImage(loadedImg, drawX, drawY, width, height);
  }
};

// Function to create high-resolution export
const createExportCanvas = (size) => {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctxExport = exportCanvas.getContext("2d");

  ctxExport.fillStyle = currentState.backgroundColor;
  ctxExport.fillRect(0, 0, size, size);

  const scale = currentState.contentSize / 100;

  if (currentState.contentType === "emoji" && currentState.emoji) {
    ctxExport.font = `${size * 0.5 * scale}px Arial`;
    ctxExport.textAlign = "center";
    ctxExport.textBaseline = "middle";

    if (currentState.hasShadow) {
      ctxExport.shadowColor = "rgba(0,0,0,0.3)";
      ctxExport.shadowBlur = 4;
      ctxExport.shadowOffsetX = 3;
      ctxExport.shadowOffsetY = 3;
    }
    ctxExport.fillStyle = "#000";
    ctxExport.fillText(currentState.emoji, size / 2, size / 2);
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
        ctxExport.shadowColor = "rgba(0,0,0,0.3)";
        ctxExport.shadowBlur = 4;
        ctxExport.shadowOffsetX = 3;
        ctxExport.shadowOffsetY = 3;
      }

      ctxExport.drawImage(
        img,
        (size - drawWidth) / 2,
        (size - drawHeight) / 2,
        drawWidth,
        drawHeight
      );

      const dataUrl = exportCanvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = `avatar-${size}x${size}.png`;
      downloadLink.click();
    };
    img.src = currentState.imageUrl;
    return;
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
    loadedImg = null;
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
const emojiButton = document.querySelector("#emoji-button"); // open button
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
