export class ExportManager {
  constructor(avatarManager) {
    this.avatarManager = avatarManager;
    this.exportButton = this.createExportButton();
    this.sizeSelector = this.createSizeSelector();

    this.init();
  }

  init() {
    const previewContainer = document.querySelector(".preview");
    previewContainer.appendChild(this.sizeSelector);
    previewContainer.appendChild(this.exportButton);
    this.setupEventListeners();
  }

  createExportButton() {
    const button = document.createElement("button");
    button.textContent = "Export Avatar";
    button.className =
      "bg-[var(--chosen-accent)] text-white p-2 rounded-lg mt-4";
    return button;
  }

  createSizeSelector() {
    const selector = document.createElement("select");
    selector.className = "mt-2 p-2 rounded-lg border border-gray-200";

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
      if (size.value === this.avatarManager.state.exportSize) {
        option.selected = true;
      }
      selector.appendChild(option);
    });

    return selector;
  }

  setupEventListeners() {
    this.exportButton.addEventListener("click", () => this.handleExport());
  }

  handleExport() {
    if (!this.avatarManager.hasContent()) {
      alert("Please select an emoji or upload an image first!");
      return;
    }

    const selectedSize = parseInt(this.sizeSelector.value);
    const exportCanvas = this.avatarManager.createExportCanvas(selectedSize);

    if (this.avatarManager.state.contentType === "image") {
      return; // Async handling is done in AvatarManager
    }

    this.downloadCanvas(exportCanvas, selectedSize);
  }

  downloadCanvas(canvas, size) {
    const dataUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = `avatar-${size}x${size}.png`;
    downloadLink.click();
  }
}
