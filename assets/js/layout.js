document.addEventListener("DOMContentLoaded", () => {
  const isVolunteersPage = window.location.pathname.indexOf('/volunteers') !== -1 || window.location.href.indexOf('/volunteers/') !== -1;
  const basePath = isVolunteersPage ? '../' : './';
  const volunteersPath = isVolunteersPage ? './index.html' : './volunteers/';
  const hashPrefix = isVolunteersPage ? '../' : '';
  const vaultPath = isVolunteersPage ? './vault.html' : './volunteers/vault.html';

  // Initialize theme class immediately
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.remove("dark-theme", "light-theme");
  document.body.classList.add(`${currentTheme}-theme`);

  // Apply visual styling overrides to navbar links to ensure plenty of breathing room
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    @media (min-width: 769px) {
      .nav-links {
        gap: 1.25rem !important;
      }
      .nav-links a {
        font-size: 0.9rem !important;
      }
    }
  `;
  document.head.appendChild(styleEl);

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
          .replace(/\{\{HASH_PREFIX\}\}/g, hashPrefix)
          .replace(/\{\{VOLUNTEERS_PATH\}\}/g, volunteersPath)
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
