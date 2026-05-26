(function () {
  try {
    const theme = localStorage.getItem("mercy-blade-theme") || "system";
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);

    if (
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (theme === "color") {
      document.body.classList.add("mb-theme-color");
    } else {
      document.body.classList.add("mb-theme-bw");
    }
  } catch (e) {}
})();
