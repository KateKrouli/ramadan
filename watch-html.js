const chokidar = require("chokidar");
const fs = require("fs");
const posthtml = require("posthtml");
const include = require("posthtml-include");

function buildHtml() {
  // Собираем index.html
  const htmlIndex = fs.readFileSync("src/index.html", "utf8");
  posthtml([include({ root: "./src/components" })])
    .process(htmlIndex)
    .then(result => {
      fs.writeFileSync("dist/index.html", result.html);
      console.log("✅ dist/index.html updated");
    })
    .catch(err => console.error(err));

  // Собираем search-page.html
  if (fs.existsSync("src/search-page.html")) {
    const htmlSearch = fs.readFileSync("src/search-page.html", "utf8");
    posthtml([include({ root: "./src/components" })])
      .process(htmlSearch)
      .then(result => {
        fs.writeFileSync("dist/search-page.html", result.html);
        console.log("✅ dist/search-page.html updated");
      })
      .catch(err => console.error(err));
  }
}

console.log("👀 Watching HTML files…");
chokidar.watch("src/**/*.html", { ignoreInitial: true })
  .on("all", (ev, path) => {
    console.log(`🔁 (${ev}) ${path}`);
    buildHtml();
  });