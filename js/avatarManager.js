export class AvatarManager {
  constructor() {
    this.previewCanvas = document.createElement("canvas");
    this.previewContainer = document.querySelector(".preview");
    this.ctx = this.previewCanvas.getContext("2d");
    this.loadedImg = null;

    this.state = {
      backgroundColor: "#efefef",
      emoji: "🍊",
      size: 300,
      exportSize: 1024,
      contentSize: 100,
      contentType: "emoji",
      imageUrl: null,
      hasShadow: false,
    };

    this.init();
  }

  init() {
    this.setupCanvas();
    this.setupControls();
    this.render();
  }

  setupCanvas() {
    this.previewCanvas.width = 300;
    this.previewCanvas.height = 300;
    this.previewContainer.innerHTML = "";
    this.previewContainer.appendChild(this.previewCanvas);
  }

  setupControls() {
    this.uploadButton = document.getElementById("upload-button");
    this.imageUpload = document.getElementById("image-upload");
    this.sizeSlider = document.getElementById("size-slider");
    this.sizeValue = document.getElementById("size-value");
    this.shadowToggle = document.getElementById("shadow-toggle");

    this.uploadButton.addEventListener("click", () => this.imageUpload.click());
    this.imageUpload.addEventListener("change", (e) =>
      this.handleImageUpload(e)
    );
    this.sizeSlider.addEventListener("input", (e) => this.handleSizeChange(e));
    this.shadowToggle.addEventListener("change", (e) =>
      this.handleShadowToggle(e)
    );
  }

  handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          this.loadedImg = img;
          this.state.imageUrl = event.target.result;
          this.state.contentType = "image";
          this.state.emoji = null;
          this.resetSize();
          this.render();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handleSizeChange(e) {
    this.state.contentSize = e.target.value;
    this.sizeValue.textContent = e.target.value;
    this.render();
  }

  handleShadowToggle(e) {
    this.state.hasShadow = e.target.checked;
    this.render();
  }

  resetSize() {
    this.state.contentSize = 100;
    this.sizeSlider.value = 100;
    this.sizeValue.textContent = "100";
  }

  render() {
    // Очистка и фон
    this.ctx.clearRect(
      0,
      0,
      this.previewCanvas.width,
      this.previewCanvas.height
    );
    this.ctx.fillStyle = this.state.backgroundColor;
    this.ctx.fillRect(
      0,
      0,
      this.previewCanvas.width,
      this.previewCanvas.height
    );

    const scale = parseFloat(this.state.contentSize) / 100;

    if (this.state.contentType === "emoji" && this.state.emoji) {
      this.renderEmoji(scale);
    } else if (this.state.contentType === "image" && this.loadedImg) {
      this.renderImage(scale);
    }
  }

  renderEmoji(scale) {
    const baseSize = this.previewCanvas.width * 0.4;
    const computedSize = Math.min(baseSize * scale, this.previewCanvas.width);

    this.ctx.font = `${computedSize}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.applyShadow();

    this.ctx.fillStyle = "#000";
    this.ctx.fillText(
      this.state.emoji,
      this.previewCanvas.width / 2,
      this.previewCanvas.height / 2
    );
  }

  renderImage(scale) {
    const aspectRatio = this.loadedImg.width / this.loadedImg.height;
    const baseSize = this.previewCanvas.width;
    let width, height;

    if (aspectRatio > 1) {
      width = baseSize * scale;
      height = width / aspectRatio;
    } else {
      height = baseSize * scale;
      width = height * aspectRatio;
    }

    if (width > this.previewCanvas.width) {
      width = this.previewCanvas.width;
      height = width / aspectRatio;
    }

    this.applyShadow();

    const drawX = (this.previewCanvas.width - width) / 2;
    const drawY = (this.previewCanvas.height - height) / 2;
    this.ctx.drawImage(this.loadedImg, drawX, drawY, width, height);
  }

  applyShadow() {
    if (this.state.hasShadow) {
      this.ctx.shadowColor = "rgba(0,0,0,0.3)";
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetX = 3;
      this.ctx.shadowOffsetY = 3;
    } else {
      this.ctx.shadowColor = "transparent";
    }
  }

  setEmoji(emoji) {
    this.state.contentType = "emoji";
    this.state.emoji = emoji;
    this.loadedImg = null;
    this.resetSize();
    this.render();
  }

  updateBackgroundColor(color) {
    this.state.backgroundColor = color;
    this.render();
  }

  hasContent() {
    return this.state.emoji || this.state.imageUrl;
  }

  createExportCanvas(size) {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctxExport = exportCanvas.getContext("2d");

    ctxExport.fillStyle = this.state.backgroundColor;
    ctxExport.fillRect(0, 0, size, size);

    const scale = this.state.contentSize / 100;

    if (this.state.contentType === "emoji" && this.state.emoji) {
      ctxExport.font = `${size * 0.5 * scale}px Arial`;
      ctxExport.textAlign = "center";
      ctxExport.textBaseline = "middle";

      if (this.state.hasShadow) {
        ctxExport.shadowColor = "rgba(0,0,0,0.3)";
        ctxExport.shadowBlur = 4;
        ctxExport.shadowOffsetX = 3;
        ctxExport.shadowOffsetY = 3;
      }
      ctxExport.fillStyle = "#000";
      ctxExport.fillText(this.state.emoji, size / 2, size / 2);
      return exportCanvas;
    } else if (this.state.contentType === "image" && this.state.imageUrl) {
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

        if (this.state.hasShadow) {
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
      img.src = this.state.imageUrl;
      return;
    }
    return exportCanvas;
  }
}
