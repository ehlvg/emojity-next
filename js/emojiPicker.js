export class EmojiPickerManager {
  constructor(avatarManager) {
    this.avatarManager = avatarManager;
    this.emojiButton = document.querySelector("#emoji-button");
    this.emojiPicker = document.querySelector("emoji-picker");
    this.tooltip = document.querySelector(".tooltip");

    this.init();
  }

  init() {
    this.setupPopper();
    this.setupEventListeners();
  }

  setupPopper() {
    Popper.createPopper(this.emojiButton, this.tooltip);
  }

  setupEventListeners() {
    this.emojiPicker.addEventListener("emoji-click", (event) => {
      this.handleEmojiSelect(event);
    });

    this.emojiButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.togglePicker();
    });

    document.addEventListener("click", (event) => {
      this.handleOutsideClick(event);
    });

    this.emojiPicker.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  handleEmojiSelect(event) {
    const emoji = event.detail.emoji.unicode;
    this.avatarManager.setEmoji(emoji);
    this.hidePicker();
  }

  togglePicker() {
    if (this.tooltip.style.display === "none" || !this.tooltip.style.display) {
      this.showPicker();
    } else {
      this.hidePicker();
    }
  }

  showPicker() {
    this.tooltip.style.display = "block";
  }

  hidePicker() {
    this.tooltip.style.display = "none";
  }

  handleOutsideClick(event) {
    if (
      !this.emojiPicker.contains(event.target) &&
      !this.emojiButton.contains(event.target) &&
      this.tooltip.style.display !== "none"
    ) {
      this.hidePicker();
    }
  }
}
