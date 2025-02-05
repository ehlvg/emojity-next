const themeColors = {
  orange: "var(--color-orange-400)",
  blue: "var(--color-blue-600)",
  green: "var(--color-green-600)",
  purple: "var(--color-purple-600)",
  yellow: "var(--color-amber-400)",
  red: "var(--color-red-500)",
  default: "var(--color-gray-800)",
};

export function initThemeManager() {
  if (localStorage.getItem("selectedTheme")) {
    const selectedTheme = localStorage.getItem("selectedTheme");
    document.querySelector("#theme").value = selectedTheme;
    setThemeColor(selectedTheme);
  }

  document.getElementById("theme").addEventListener("change", function () {
    const themeValue = document.querySelector("#theme").value;
    setThemeColor(themeValue);
    localStorage.setItem("selectedTheme", themeValue);
  });
}

function setThemeColor(theme) {
  document.documentElement.style.setProperty(
    "--chosen-accent",
    themeColors[theme]
  );
}
