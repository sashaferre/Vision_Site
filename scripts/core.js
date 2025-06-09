document.addEventListener("DOMContentLoaded", () => {
    /* ===========================================================================
     2) HEADER / BOTTOM NAV TOGGLE
     =========================================================================== */
  const topHeader   = document.querySelector(".custom-header");
  const bottomNav   = document.getElementById("bottomNav");
  const logoSection = document.getElementById("projectLibrary");

  function onScrollToggleHeaders() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (!logoSection) return;

    // Compute a trigger point about 80px before #projectLibrary's top enters viewport:
    const triggerPoint = logoSection.getBoundingClientRect().top + window.scrollY - 20;

    if (scrollY >= triggerPoint) {
      // Hide top header, show bottom nav
      topHeader.classList.add("hide");
      document.body.classList.add("show-bottom-nav");
    } else {
      // Still on the first (canvas) screen
      topHeader.classList.remove("hide");
      document.body.classList.remove("show-bottom-nav");
    }
  }

  window.addEventListener("scroll", onScrollToggleHeaders);
  // Fire once on load in case the page was reloaded scrolled down:
  onScrollToggleHeaders();

  /* ===========================================================================
     3) MENU‐TOGGLE (OPEN / CLOSE OVERLAY)
     =========================================================================== */
  const menuToggle  = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuClose   = document.getElementById("menuClose");
  if (menuToggle && menuOverlay && menuClose) {
    menuToggle.addEventListener("click", () => {
      menuOverlay.classList.add("open");
    });
    menuClose.addEventListener("click", () => {
      menuOverlay.classList.remove("open");
    });
  }
  console.log("ℹ️ Menu toggle setup done.");
/* ===========================================================================
     11) SCROLL‐TO‐TOP (Up Arrow in bottom nav)
     =========================================================================== */
  const upButton = document.querySelector(".nav-up");
  if (upButton) {
    upButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
   const currentPath = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#bottomNav .nav-menu a')
      .forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

    });