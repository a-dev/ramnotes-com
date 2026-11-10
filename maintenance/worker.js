const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>ramnotes — back soon</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; font: 18px/1.5 system-ui, sans-serif; padding: 16px; }
</style>
</head>
<body>
<main>
<h1>Back soon</h1>
<p>ramnotes.com is temporarily offline for maintenance.</p>
</main>
</body>
</html>`;

export default {
  fetch() {
    return new Response(html, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "retry-after": "86400",
        "cache-control": "no-store",
      },
    });
  },
};
