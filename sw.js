self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("skynet").then(cache =>
            cache.addAll([
                "./",
                "./index.html",
                "./app.html",
                "./css/style.css",
                "./js/auth.js",
                "./js/robots.js",
                "./manifest.json"
            ])
        )
    );
});