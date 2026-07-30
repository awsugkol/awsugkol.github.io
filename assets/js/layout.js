document.addEventListener("DOMContentLoaded", () => {
  const isVolunteersPage = window.location.pathname.indexOf('/volunteers') !== -1 || window.location.href.indexOf('/volunteers/') !== -1;
  const isResourcesPage = window.location.pathname.indexOf('/resources') !== -1 || window.location.href.indexOf('/resources/') !== -1;
  const isAboutPage = window.location.pathname.indexOf('/about') !== -1 || window.location.href.indexOf('/about/') !== -1;
  const isEventsPage = window.location.pathname.indexOf('/events') !== -1 || window.location.href.indexOf('/events/') !== -1;
  const isOrganizersPage = window.location.pathname.indexOf('/organizers') !== -1 || window.location.href.indexOf('/organizers/') !== -1;

  const isSubPage = isVolunteersPage || isResourcesPage || isAboutPage || isEventsPage || isOrganizersPage;

  const basePath = isSubPage ? '../' : './';
  const homePath = isSubPage ? '../' : './';
  const aboutPath = isAboutPage ? './index.html' : (isSubPage ? '../about/' : './about/');
  const organizersPath = isOrganizersPage ? './index.html' : (isSubPage ? '../organizers/' : './organizers/');
  const eventsPath = isEventsPage ? './index.html' : (isSubPage ? '../events/' : './events/');
  const volunteersPath = isVolunteersPage ? './index.html' : (isSubPage ? '../volunteers/' : './volunteers/');
  const resourcesPath = isResourcesPage ? './index.html' : (isSubPage ? '../resources/' : './resources/');
  const hashPrefix = isSubPage ? '../' : '';
  const vaultPath = isVolunteersPage ? './vault.html' : (isSubPage ? '../volunteers/vault.html' : './volunteers/vault.html');

  // Initialize theme class immediately
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.remove("dark-theme", "light-theme");
  document.body.classList.add(`${currentTheme}-theme`);

  // Apply visual styling overrides to navbar links to ensure single line desktop layout
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .nav-container {
      max-width: 1280px !important;
    }
    @media (min-width: 769px) {
      .nav-links {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 0.85rem !important;
      }
      .nav-links a {
        font-size: 0.85rem !important;
        white-space: nowrap !important;
      }
      .nav-links .btn {
        padding: 0.45rem 0.85rem !important;
        font-size: 0.82rem !important;
        white-space: nowrap !important;
      }
      .logo span {
        white-space: nowrap !important;
      }
    }
    @media (min-width: 1150px) {
      .nav-links {
        gap: 1.15rem !important;
      }
      .nav-links a {
        font-size: 0.9rem !important;
      }
      .nav-links .btn {
        padding: 0.5rem 1rem !important;
        font-size: 0.88rem !important;
      }
    }

    /* Global Solid White h1 & Solid Purple Highlight (No Gradients) */
    h1, .hero h1, .resources-hero h1, .volunteers-hero-title, .innovative-hero h1, .page-hero h1 {
      color: #ffffff !important;
      background: none !important;
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    .purple-text, .gradient-text, .volunteers-hero-accent {
      color: #c4b5fd !important;
      background: none !important;
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      -webkit-text-fill-color: #c4b5fd !important;
      font-weight: inherit;
    }


    /* Hide old hero-background element to prevent pitch-black radial block on mobile */
    .hero-background {
      display: none !important;
    }

    /* Guarantee Visibility & Force Animation Fallback for Hero Elements */
    .animate-up, .animate-fade {
      opacity: 1 !important;
      transform: none !important;
    }
    .hero-content, .resources-hero-content, .volunteers-hero-content {
      position: relative !important;
      z-index: 10 !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    /* Unified Innovative Hero Styling Across All Pages (Desktop & Mobile) */
    .hero, .resources-hero, .volunteers-hero, .page-hero, .innovative-hero {
      min-height: auto !important;
      height: auto !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      position: relative !important;
      overflow: hidden !important;
      padding: 120px 1.5rem 3.5rem !important;
      background: radial-gradient(circle at 50% 20%, rgba(71, 33, 209, 0.25) 0%, rgba(10, 6, 30, 0.95) 70%) !important;
      text-align: center !important;
    }

    .hero-grid-overlay, .resources-hero-bg, .volunteers-hero-bg {
      position: absolute !important;
      inset: 0 !important;
      background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px) !important;
      background-size: 50px 50px !important;
      pointer-events: none !important;
      mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%) !important;
      -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%) !important;
    }

    .hero-badge-pill, .resources-hero-badge, .volunteers-hero-badge {
      display: inline-flex !important;
      align-items: center !important;
      gap: 0.6rem !important;
      padding: 0.45rem 1.2rem !important;
      border-radius: 30px !important;
      background: rgba(196, 181, 253, 0.12) !important;
      border: 1px solid rgba(196, 181, 253, 0.35) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      color: #c4b5fd !important;
      font-size: 0.88rem !important;
      font-weight: 600 !important;
      margin-bottom: 1.5rem !important;
      box-shadow: 0 4px 20px rgba(71, 33, 209, 0.2) !important;
    }

    .pulse-dot {
      width: 8px !important;
      height: 8px !important;
      background-color: #22c55e !important;
      border-radius: 50% !important;
      box-shadow: 0 0 10px #22c55e !important;
      display: inline-block !important;
      animation: pulse-glow 2s infinite ease-in-out !important;
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .hero h1, .resources-hero h1, .volunteers-hero-title, .page-hero h1, .innovative-hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem) !important;
      font-family: var(--font-heading) !important;
      font-weight: 800 !important;
      line-height: 1.15 !important;
      max-width: 900px !important;
      margin: 0 auto 1.25rem !important;
      text-align: center !important;
      color: #ffffff !important;
    }

    .hero p, .resources-hero p, .volunteers-hero-subtitle, .page-hero p, .innovative-hero p {
      font-size: clamp(1rem, 1.8vw, 1.2rem) !important;
      color: var(--color-text-secondary) !important;
      max-width: 680px !important;
      margin: 0 auto 1.5rem !important;
      text-align: center !important;
      line-height: 1.6 !important;
    }

    /* Light Theme Hero & Global Overrides (Preserves Desktop Radial Gradient & Grid) */
    body.light-theme .hero,
    body.light-theme .resources-hero,
    body.light-theme .volunteers-hero,
    body.light-theme .page-hero,
    body.light-theme .innovative-hero {
      background: radial-gradient(circle at 50% 20%, rgba(71, 33, 209, 0.08) 0%, #f8fafc 70%) !important;
    }

    body.light-theme .hero-grid-overlay,
    body.light-theme .resources-hero-bg,
    body.light-theme .volunteers-hero-bg {
      background-image: linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px) !important;
    }

    body.light-theme .hero-badge-pill,
    body.light-theme .resources-hero-badge,
    body.light-theme .volunteers-hero-badge {
      background: rgba(71, 33, 209, 0.08) !important;
      border-color: rgba(71, 33, 209, 0.25) !important;
      color: #4721d1 !important;
    }

    /* Comprehensive Light Mode Card & Section Overrides (No Dark Overlays/Gradients) */
    body.light-theme {
      background-color: #f8fafc !important;
      color: #0f172a !important;
    }
    body.light-theme h1,
    body.light-theme .hero h1,
    body.light-theme .resources-hero h1,
    body.light-theme .volunteers-hero-title,
    body.light-theme .innovative-hero h1,
    body.light-theme .page-hero h1 {
      color: #0f172a !important;
      background: none !important;
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      -webkit-text-fill-color: #0f172a !important;
    }
    body.light-theme h2,
    body.light-theme h3,
    body.light-theme h4 {
      color: #0f172a !important;
    }
    body.light-theme p,
    body.light-theme .resources-hero p,
    body.light-theme .volunteers-hero-subtitle,
    body.light-theme .innovative-hero p,
    body.light-theme .page-hero p {
      color: #475569 !important;
    }
    body.light-theme .purple-text,
    body.light-theme .gradient-text,
    body.light-theme .volunteers-hero-accent {
      color: #4721d1 !important;
      background: none !important;
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      -webkit-text-fill-color: #4721d1 !important;
    }

    /* Light Mode Card Backdrops (Stripped of Dark Gradients & Blurs) */
    body.light-theme .stat-card,
    body.light-theme .event-card,
    body.light-theme .organizer-card,
    body.light-theme .hero-feature-card,
    body.light-theme .resource-card-block,
    body.light-theme .resource-accordion-item,
    body.light-theme .resource-file-card,
    body.light-theme .sheet-wrapper,
    body.light-theme .leaderboard-wrapper,
    body.light-theme .accordion-item,
    body.light-theme .volunteer-card,
    body.light-theme .volunteers-banner,
    body.light-theme .cta-container,
    body.light-theme .password-card,
    body.light-theme .password-container {
      background: #ffffff !important;
      background-image: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
    }

    body.light-theme .cta-section {
      background: #f8fafc !important;
      border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
    }
    body.light-theme .event-thumbnail-container {
      background: #f1f5f9 !important;
    }
    body.light-theme .event-host {
      background: rgba(0, 0, 0, 0.04) !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      color: #475569 !important;
    }
    body.light-theme .event-host a {
      color: #0f172a !important;
    }
    body.light-theme .password-form input[type="password"] {
      background: #ffffff !important;
      border-color: rgba(0, 0, 0, 0.15) !important;
      color: #0f172a !important;
    }
    body.light-theme .event-info h3,
    body.light-theme .stat-card h3,
    body.light-theme .organizer-card h3,
    body.light-theme .hero-feature-text h4,
    body.light-theme .resource-accordion-title,
    body.light-theme .leaderboard-name,
    body.light-theme .volunteer-name,
    body.light-theme .password-header h1,
    body.light-theme .volunteers-banner h2,
    body.light-theme .cta-container h2 {
      color: #0f172a !important;
    }
    body.light-theme .event-info p,
    body.light-theme .stat-card p,
    body.light-theme .organizer-card p,
    body.light-theme .hero-feature-text p,
    body.light-theme .resource-placeholder,
    body.light-theme .password-header p,
    body.light-theme .volunteers-banner p,
    body.light-theme .cta-container p {
      color: #475569 !important;
    }
    body.light-theme .stat-card h3 {
      color: #4721d1 !important;
    }
    body.light-theme .leaderboard-table th {
      color: #0f172a !important;
      border-bottom-color: rgba(0, 0, 0, 0.1) !important;
    }
    body.light-theme .leaderboard-table td {
      color: #334155 !important;
      border-bottom-color: rgba(0, 0, 0, 0.06) !important;
    }
    body.light-theme .accordion-panel {
      background: rgba(0, 0, 0, 0.02) !important;
    }
    body.light-theme .volunteer-code {
      color: #4721d1 !important;
      background: rgba(71, 33, 209, 0.08) !important;
      border-color: rgba(71, 33, 209, 0.2) !important;
    }
    body.light-theme .total-points-badge {
      background: linear-gradient(135deg, rgba(71, 33, 209, 0.1) 0%, rgba(63, 32, 197, 0.1) 100%) !important;
      border-color: rgba(71, 33, 209, 0.25) !important;
      color: #4721d1 !important;
    }
    body.light-theme .hero-btn-secondary {
      background: rgba(0, 0, 0, 0.04) !important;
      border-color: rgba(0, 0, 0, 0.12) !important;
      color: #0f172a !important;
    }
    body.light-theme .hero-feature-icon {
      background: rgba(71, 33, 209, 0.08) !important;
      border-color: rgba(71, 33, 209, 0.2) !important;
      color: #4721d1 !important;
    }
    body.light-theme .search-wrapper input {
      background: #ffffff !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      color: #0f172a !important;
    }
    body.light-theme .resource-file-card {
      background: #ffffff !important;
      backdrop-filter: none !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
    }
    body.light-theme .resource-file-details strong {
      color: #0f172a !important;
    }
    body.light-theme .resource-file-details span {
      color: #475569 !important;
    }
    body.light-theme .resource-date-badge {
      color: #4721d1 !important;
      background: rgba(71, 33, 209, 0.08) !important;
      border-color: rgba(71, 33, 209, 0.25) !important;
    }
    body.light-theme .resource-tag {
      color: #475569 !important;
      background: rgba(0, 0, 0, 0.04) !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
    }
    body.light-theme .resource-people-bar .resource-person {
      color: #475569 !important;
      background: rgba(0, 0, 0, 0.04) !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
    }
    body.light-theme .resource-people-bar .resource-person strong {
      color: #0f172a !important;
    }
    body.light-theme .resource-accordion-header {
      background: #ffffff !important;
      border-color: rgba(0, 0, 0, 0.08) !important;
    }
    body.light-theme .tab-btn {
      background: #ffffff !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      color: #475569 !important;
    }
    body.light-theme .tab-btn.active {
      background: rgba(71, 33, 209, 0.1) !important;
      border-color: #4721d1 !important;
      color: #4721d1 !important;
    }
    body.light-theme .load-more-btn {
      border-color: #4721d1 !important;
      color: #4721d1 !important;
    }

    /* Floating Scroll to Top Button (Global Fixed Overlay) */
    #scroll-to-top, .scroll-to-top {
      position: fixed !important;
      bottom: 2rem !important;
      right: 2rem !important;
      width: 48px !important;
      height: 48px !important;
      border-radius: 50% !important;
      background: #4721d1 !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 6px 20px rgba(71, 33, 209, 0.5) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 1.2rem !important;
      cursor: pointer !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transform: translateY(15px) !important;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
      z-index: 999999 !important;
    }
    #scroll-to-top.visible, #scroll-to-top.show, .scroll-to-top.visible, .scroll-to-top.show {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transform: translateY(0) !important;
      display: flex !important;
    }
    .scroll-to-top:hover {
      background: var(--color-aws-orange-dark, #3f20c5) !important;
      transform: translateY(-3px) scale(1.05) !important;
      box-shadow: 0 8px 25px rgba(71, 33, 209, 0.6) !important;
    }
    body.light-theme .scroll-to-top {
      background: #4721d1 !important;
      color: #ffffff !important;
      border: none !important;
      box-shadow: 0 6px 20px rgba(71, 33, 209, 0.3) !important;
    }

    /* Mobile UI & Responsive Overrides */
    @media (max-width: 768px) {
      .hero, .resources-hero, .volunteers-hero, .page-hero, .innovative-hero {
        min-height: 260px !important;
        height: auto !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 150px 1.25rem 3rem !important;
        background: radial-gradient(circle at 50% 20%, rgba(71, 33, 209, 0.35) 0%, rgba(10, 6, 30, 0.98) 70%) !important;
        position: relative !important;
        z-index: 1 !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .hero h1, .resources-hero h1, .volunteers-hero-title, .page-hero h1, .innovative-hero h1 {
        font-size: clamp(1.9rem, 7.5vw, 2.6rem) !important;
        margin-bottom: 0.85rem !important;
        line-height: 1.2 !important;
      }

      .hero p, .resources-hero p, .volunteers-hero-subtitle, .page-hero p, .innovative-hero p {
        font-size: 0.95rem !important;
        line-height: 1.55 !important;
        margin-bottom: 1.25rem !important;
        padding: 0 0.25rem !important;
      }

      .hero-badge-pill, .resources-hero-badge, .volunteers-hero-badge {
        padding: 0.35rem 0.85rem !important;
        font-size: 0.78rem !important;
        margin-bottom: 1rem !important;
        gap: 0.45rem !important;
        max-width: 100% !important;
        white-space: normal !important;
        text-align: center !important;
        justify-content: center !important;
        line-height: 1.35 !important;
      }

      .hero-buttons {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 320px !important;
        margin: 0 auto !important;
        gap: 0.75rem !important;
      }

      .hero-buttons .btn {
        width: 100% !important;
        text-align: center !important;
        justify-content: center !important;
        padding: 0.75rem 1.25rem !important;
      }

      .volunteers-hero-stats {
        gap: 1rem !important;
        margin-top: 1rem !important;
      }

      .hero-stat-number {
        font-size: 1.5rem !important;
      }

      .hero-stat-label {
        font-size: 0.72rem !important;
      }

      .section {
        padding: 2.25rem 1rem !important;
      }

      .cta-section {
        padding: 2.25rem 1rem !important;
      }

      .cta-container {
        padding: 1.75rem 1.15rem !important;
        border-radius: 14px !important;
      }

      .cta-container h2 {
        font-size: 1.65rem !important;
      }

      .cta-container p {
        font-size: 0.95rem !important;
        margin-bottom: 1.25rem !important;
      }

      .volunteers-banner {
        padding: 1.5rem 1.15rem !important;
        border-radius: 14px !important;
      }

      .volunteers-banner h2 {
        font-size: 1.6rem !important;
      }

      .table-wrapper {
        padding: 0.65rem 0.75rem !important;
        border-radius: 12px !important;
      }

      #scroll-to-top, .scroll-to-top {
        bottom: 1.5rem !important;
        right: 1.25rem !important;
        width: 44px !important;
        height: 44px !important;
        font-size: 1.05rem !important;
      }
    }

    @media (max-width: 480px) {
      .hero, .resources-hero, .volunteers-hero, .page-hero, .innovative-hero {
        padding: 145px 1rem 2.5rem !important;
      }

      .hero h1, .resources-hero h1, .volunteers-hero-title, .page-hero h1, .innovative-hero h1 {
        font-size: 1.75rem !important;
      }

      .hero-badge-pill, .resources-hero-badge, .volunteers-hero-badge {
        font-size: 0.74rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // Scroll to Top Floating Button Logic
  let scrollToTopBtn = document.getElementById("scroll-to-top");
  if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.id = "scroll-to-top";
    scrollToTopBtn.className = "scroll-to-top";
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
    scrollToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);
  } else {
    scrollToTopBtn.removeAttribute("style");
  }

  const handleScroll = () => {
    if (!scrollToTopBtn) return;
    scrollToTopBtn.removeAttribute("style");
    if (window.scrollY > 100) {
      scrollToTopBtn.classList.add("visible");
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("visible");
      scrollToTopBtn.classList.remove("show");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 1. Fetch and render Header Navbar
  const navbar = document.getElementById("navbar");
  if (navbar) {
    fetch(`${basePath}components/header.html`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
        return res.text();
      })
      .then(html => {
        let rendered = html
          .replace(/\{\{BASE_PATH\}\}/g, basePath)
          .replace(/\{\{HOME_PATH\}\}/g, homePath)
          .replace(/\{\{HASH_PREFIX\}\}/g, hashPrefix)
          .replace(/\{\{ABOUT_PATH\}\}/g, aboutPath)
          .replace(/\{\{ORGANIZERS_PATH\}\}/g, organizersPath)
          .replace(/\{\{EVENTS_PATH\}\}/g, eventsPath)
          .replace(/\{\{VOLUNTEERS_PATH\}\}/g, volunteersPath)
          .replace(/\{\{RESOURCES_PATH\}\}/g, resourcesPath)
          .replace(/\{\{VAULT_PATH\}\}/g, vaultPath);

        navbar.innerHTML = rendered;
        setupHeaderLogic(navbar);
      })
      .catch(err => {
        console.warn("Could not load header dynamically. Serving fallback navbar logic.", err);
      });
  }

  // 2. Fetch and render Footer
  const footer = document.querySelector("footer");
  if (footer) {
    fetch(`${basePath}components/footer.html`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch footer: ${res.status}`);
        return res.text();
      })
      .then(html => {
        let rendered = html
          .replace(/\{\{BASE_PATH\}\}/g, basePath)
          .replace(/\{\{HASH_PREFIX\}\}/g, hashPrefix)
          .replace(/\{\{VOLUNTEERS_PATH\}\}/g, volunteersPath)
          .replace(/\{\{RESOURCES_PATH\}\}/g, resourcesPath)
          .replace(/\{\{VAULT_PATH\}\}/g, vaultPath);

        footer.innerHTML = rendered;
      })
      .catch(err => {
        console.warn("Could not load footer dynamically. Serving fallback footer logic.", err);
      });
  }

  function setupHeaderLogic(navbarContainer) {
    const mobileMenuBtn = navbarContainer.querySelector(".mobile-menu-btn");
    const navLinks = navbarContainer.querySelector(".nav-links");
    const themeToggleBtn = navbarContainer.querySelector("#theme-toggle-btn");
    const themeToggleIcon = navbarContainer.querySelector("#theme-toggle-icon");

    // Initialize correct icon class on startup
    if (themeToggleIcon) {
      const activeTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
      themeToggleIcon.className = activeTheme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener("click", () => {
        if (navLinks.style.display === "flex") {
          navLinks.style.display = "none";
          mobileMenuBtn.classList.remove("active");
        } else {
          navLinks.style.display = "flex";
          navLinks.style.flexDirection = "column";
          navLinks.style.position = "absolute";
          navLinks.style.top = "100%";
          navLinks.style.left = "0";
          navLinks.style.width = "100%";
          navLinks.style.background = "var(--color-bg-secondary)";
          navLinks.style.padding = "1.5rem";
          navLinks.style.borderBottom = "1px solid var(--color-glass-border)";
          mobileMenuBtn.classList.add("active");
        }
      });
      
      // Close mobile menu on link click
      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            navLinks.style.display = "none";
            mobileMenuBtn.classList.remove("active");
          }
        });
      });
    }

    // Theme Toggle Click Handler
    if (themeToggleBtn && themeToggleIcon) {
      themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        if (isDark) {
          document.body.classList.remove("dark-theme");
          document.body.classList.add("light-theme");
          localStorage.setItem("theme", "light");
          themeToggleIcon.className = "fa-solid fa-moon";
        } else {
          document.body.classList.remove("light-theme");
          document.body.classList.add("dark-theme");
          localStorage.setItem("theme", "dark");
          themeToggleIcon.className = "fa-solid fa-sun";
        }
      });
    }

    // Navbar Scroll Effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbarContainer.classList.add("scrolled");
      } else {
        navbarContainer.classList.remove("scrolled");
      }
    });
  }
});
