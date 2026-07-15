/* ============================================================
   SIP SAVVY CINEMATIC MOTION ENGINE v3
   Lightweight • GPU‑Optimized • Luxury‑Grade
   ============================================================ */

/* ------------------------------------------------------------
   1. STAGGERED REVEAL ANIMATIONS
   ------------------------------------------------------------ */
const revealElements = document.querySelectorAll(".reveal, .fade-up, .fade-down");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add("visible");
            }, index * 120); // stagger timing
        }
    });
}, { threshold: 0.2 });

revealElements.forEach(el => revealObserver.observe(el));


/* ------------------------------------------------------------
   2. PARALLAX HERO MOTION
   ------------------------------------------------------------ */
const hero = document.querySelector(".services-hero, .packages-hero, .gallery-hero, .hero");

window.addEventListener("scroll", () => {
    if (!hero) return;
    const offset = window.scrollY * 0.25;
    hero.style.transform = `translateY(${offset}px)`;
});


/* ------------------------------------------------------------
   3. GOLD PARTICLE DRIFT (Behind Hero Text)
   ------------------------------------------------------------ */
function createParticle() {
    const particle = document.createElement("div");
    particle.classList.add("gold-particle");

    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 4 + Math.random() * 4 + "s";
    particle.style.opacity = 0.3 + Math.random() * 0.4;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 8000);
}

setInterval(createParticle, 600);


/* ------------------------------------------------------------
   4. MAGNETIC CURSOR EFFECT (Luxury‑Smooth)
   ------------------------------------------------------------ */
const magneticItems = document.querySelectorAll(".magnetic");

magneticItems.forEach(item => {
    item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        item.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform = "translate(0, 0)";
    });
});


/* ------------------------------------------------------------
   5. BUTTON SWEEP ANIMATION
   ------------------------------------------------------------ */
const sweepButtons = document.querySelectorAll(".btn-sweep");

sweepButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        btn.classList.add("sweep-active");
    });
    btn.addEventListener("mouseleave", () => {
        btn.classList.remove("sweep-active");
    });
});


/* ------------------------------------------------------------
   6. AMBIENT PARTICLE FIELD (Wine‑Tinted)
   ------------------------------------------------------------ */
const ambientContainer = document.querySelector(".ambient-container");

if (ambientContainer) {
    function spawnAmbientParticle() {
        const p = document.createElement("span");
        p.classList.add("ambient-particle");

        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration = 6 + Math.random() * 6 + "s";
        p.style.opacity = 0.1 + Math.random() * 0.3;

        ambientContainer.appendChild(p);

        setTimeout(() => p.remove(), 12000);
    }

    setInterval(spawnAmbientParticle, 500);
}


/* ------------------------------------------------------------
   7. PREFERS‑REDUCED‑MOTION SUPPORT
   ------------------------------------------------------------ */
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("*").forEach(el => {
        el.style.animation = "none";
        el.style.transition = "none";
    });
}

/* ------------------------------------------------------------
   8. PAGE TRANSITION FADE
   ------------------------------------------------------------ */
document.body.classList.add("page-enter");

const links = document.querySelectorAll("a:not([target='_blank'])");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) return;

        e.preventDefault();
        document.body.classList.add("page-exit");

        setTimeout(() => {
            window.location.href = href;
        }, 350);
    });
});

/* ------------------------------------------------------------
   9. SCROLL‑BASED WINE TINT
   ------------------------------------------------------------ */
const tintLayer = document.querySelector(".wine-tint");

if (tintLayer) {
    window.addEventListener("scroll", () => {
        const max = 600; 
        const intensity = Math.min(window.scrollY / max, 1);
        tintLayer.style.background = `rgba(60, 0, 10, ${0.2 + intensity * 0.4})`;
    });
}
/* ------------------------------------------------------------
   10. HERO VIDEO INTRO FADE
   ------------------------------------------------------------ */
const heroVideo = document.querySelector(".hero-video");

if (heroVideo) {
    heroVideo.style.opacity = 0;
    heroVideo.addEventListener("loadeddata", () => {
        setTimeout(() => {
            heroVideo.style.transition = "opacity 1.2s ease";
            heroVideo.style.opacity = 1;
        }, 300);
    });
}
