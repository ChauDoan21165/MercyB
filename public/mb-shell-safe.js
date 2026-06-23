(function () {
  try {
    var route = window.location.pathname.indexOf("/ai-tutor") === 0 ? "ai-tutor" : "default";
    document.documentElement.setAttribute("data-mb-route", route);
  } catch (e) {
    try {
      document.documentElement.setAttribute("data-mb-route", "default");
    } catch (_) {}
  }

  try {
    window.setTimeout(function () {
      var el = document.getElementById("mb-static-hero");
      if (el) el.remove();
    }, 5000);
  } catch (_) {}
})();
