/* MOBILE MENU */
function toggleMenu() {
    const nav = document.getElementById("navMenu");
    const overlay = document.getElementById("menuOverlay");

    if (!nav || !overlay) return;

    nav.classList.toggle("open");
    overlay.classList.toggle("active");
}

document.addEventListener("click", (e) => {
    const nav = document.getElementById("navMenu");
    const overlay = document.getElementById("menuOverlay");
    const menuBtn = document.querySelector(".menu-btn");

    if (!nav || !overlay || !menuBtn) return;

    const clickedInsideNav = nav.contains(e.target) || menuBtn.contains(e.target);

    if (!clickedInsideNav && nav.classList.contains("open")) {
        nav.classList.remove("open");
        overlay.classList.remove("active");
    }
});

/* DARK MODE */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("sipSavvyTheme", "dark");
    } else {
        localStorage.setItem("sipSavvyTheme", "light");
    }
}

/* INITIALIZE ON LOAD */
document.addEventListener("DOMContentLoaded", () => {
    /* Load saved theme */
    const savedTheme = localStorage.getItem("sipSavvyTheme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    /* VIDEO FADE-IN */
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
        heroVideo.addEventListener("loadeddata", () => {
            heroVideo.classList.add("loaded");
        });
    }

    /* Booking modal logic (only on booking page) */
    const submitBtn = document.getElementById("submitBooking");
    const bookingForm = document.getElementById("bookingForm");
    const modal = document.getElementById("bookingSuccessModal");
    const closeModal = document.getElementById("closeSuccessModal");

    if (submitBtn && bookingForm && modal) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
            bookingForm.reset();
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    /* Initialize animations */
    if (typeof initSipSavvyAnimations === "function") {
        initSipSavvyAnimations();
    }
});
