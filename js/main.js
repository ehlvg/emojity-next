import { initThemeManager } from "./themeManager.js";
import { ColorManager } from "./colorManager.js";
import { AvatarManager } from "./avatarManager.js";
import { ExportManager } from "./exportManager.js";
import { EmojiPickerManager } from "./emojiPicker.js";

document.addEventListener("DOMContentLoaded", () => {
  initThemeManager();

  const avatarManager = new AvatarManager();

  const colorManager = new ColorManager((color) => {
    avatarManager.updateBackgroundColor(color);
  });

  const exportManager = new ExportManager(avatarManager);
  const emojiPicker = new EmojiPickerManager(avatarManager);
});
