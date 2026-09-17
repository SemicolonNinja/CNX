(function loadEnumScripts() {
  var files = [
    "app-edu.js",
    "app-talent.js",
    "app-talent-02.js",
    "app-talent-03.js",
    "app-talent-04.js",
    "app-talent-05.js",
    "app-talent-06.js",
    "app-talent-07.js",
    "app-talent-08.js"
  ];
  function next(i) {
    if (i >= files.length) return;
    var s = document.createElement("script");
    s.src = files[i];
    s.onload = function () { next(i + 1); };
    s.onerror = function () { console.error("Failed to load", files[i]); };
    document.body.appendChild(s);
  }
  next(0);
})();
