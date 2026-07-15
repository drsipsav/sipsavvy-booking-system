// Load header
fetch("/components/header.html")
    .then(res => res.text())
    .then(html => document.getElementById("header-placeholder").innerHTML = html);

// Load footer
fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => document.getElementById("footer-placeholder").innerHTML = html);
