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
  // Chunks are one program split across files. Fetch and run them as a single
  // script so function bodies that span files stay valid.
  function fail(file, err) {
    console.error("Failed to load", file, err);
  }
  function inject(source) {
    var s = document.createElement("script");
    s.textContent = source;
    document.body.appendChild(s);
  }
  function next(i, parts) {
    if (i >= files.length) {
      inject(parts.join("\n"));
      return;
    }
    fetch(files[i]).then(function (res) {
      if (!res.ok) throw new Error(res.status + " " + res.statusText);
      return res.text();
    }).then(function (text) {
      parts.push(text);
      next(i + 1, parts);
    }).catch(function (err) {
      fail(files[i], err);
    });
  }
  next(0, []);
})();
