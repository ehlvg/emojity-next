export class ColorManager {
  constructor(updateAvatarCallback) {
    this.colorPicker = document.getElementById("color-picker");
    this.saveBtn = document.getElementById("save-btn");
    this.colorList = document.getElementById("color-list");
    this.savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];
    this.updateAvatar = updateAvatarCallback;

    this.init();
  }

  init() {
    this.loadSavedColors();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.saveBtn.addEventListener("click", () => this.saveColor());
    this.colorPicker.addEventListener("input", (e) => {
      this.updateAvatar(e.target.value);
    });
  }

  saveColor() {
    const selectedColor = this.colorPicker.value;
    if (!this.savedColors.includes(selectedColor)) {
      this.savedColors.push(selectedColor);
      this.saveToLocalStorage();
      this.colorList.appendChild(this.createColorPreview(selectedColor));
    }
  }

  loadSavedColors() {
    this.colorList.innerHTML = "";
    this.savedColors.forEach((color) => {
      this.colorList.appendChild(this.createColorPreview(color));
    });
  }

  saveToLocalStorage() {
    localStorage.setItem("savedColors", JSON.stringify(this.savedColors));
  }

  removeColor(color) {
    this.savedColors = this.savedColors.filter((c) => c !== color);
    this.saveToLocalStorage();
    this.loadSavedColors();
  }

  createColorPreview(color) {
    const colorPreview = document.createElement("li");
    colorPreview.className =
      "w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform";
    colorPreview.style.backgroundColor = color;

    colorPreview.addEventListener("click", (e) => {
      if (e.altKey) {
        this.removeColor(color);
      } else {
        this.colorPicker.value = color;
        this.updateAvatar(color);
      }
    });

    return colorPreview;
  }
}
