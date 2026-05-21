document.addEventListener("DOMContentLoaded", () => {
  // 1. Navbar Scroll Effect
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
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
      }
    });
  }

  // 3. Scroll-To-Top Button
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("show");
      }
    });

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 4. Password Protection Decryption Logic
  const mainEl = document.getElementById("volunteers-main");
  const passwordInput = document.getElementById("page-password");
  const unlockBtn = document.getElementById("unlock-btn");
  const errorMsg = document.getElementById("error-message");

  function sha256_js(bytes) {
    function rotateRight(n, x) {
      return (x >>> n) | (x << (32 - n));
    }
    
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const l = bytes.length;
    const bitLen = l * 8;
    
    const totalLength = (((l + 8) >> 6) + 1) * 64;
    const w = new Uint32Array(totalLength / 4);
    
    for (let i = 0; i < l; i++) {
      w[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    }
    w[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
    
    w[w.length - 1] = bitLen & 0xffffffff;
    w[w.length - 2] = Math.floor(bitLen / 0x100000000);

    const chunkWords = new Uint32Array(64);
    for (let i = 0; i < w.length; i += 16) {
      let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

      for (let j = 0; j < 64; j++) {
        if (j < 16) {
          chunkWords[j] = w[i + j];
        } else {
          const s0 = rotateRight(7, chunkWords[j - 15]) ^ rotateRight(18, chunkWords[j - 15]) ^ (chunkWords[j - 15] >>> 3);
          const s1 = rotateRight(17, chunkWords[j - 2]) ^ rotateRight(19, chunkWords[j - 2]) ^ (chunkWords[j - 2] >>> 10);
          chunkWords[j] = (chunkWords[j - 16] + s0 + chunkWords[j - 7] + s1) | 0;
        }

        const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[j] + chunkWords[j]) | 0;
        const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      H[0] = (H[0] + a) | 0;
      H[1] = (H[1] + b) | 0;
      H[2] = (H[2] + c) | 0;
      H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0;
      H[5] = (H[5] + f) | 0;
      H[6] = (H[6] + g) | 0;
      H[7] = (H[7] + h) | 0;
    }

    const result = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      result[i * 4] = (H[i] >> 24) & 0xff;
      result[i * 4 + 1] = (H[i] >> 16) & 0xff;
      result[i * 4 + 2] = (H[i] >> 8) & 0xff;
      result[i * 4 + 3] = H[i] & 0xff;
    }
    return result.buffer;
  }

  async function sha256(buffer) {
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      return await crypto.subtle.digest("SHA-256", buffer);
    }
    return sha256_js(new Uint8Array(buffer));
  }

  async function decrypt(ciphertextBase64, password) {
    try {
      const binary = atob(ciphertextBase64);
      const ciphertext = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        ciphertext[i] = binary.charCodeAt(i);
      }

      const encoder = new TextEncoder();
      const passwordBytes = encoder.encode(password);
      const kBuffer = await sha256(passwordBytes);
      const k = new Uint8Array(kBuffer);

      const decrypted = new Uint8Array(ciphertext.length);
      const chunkSize = 32;
      
      for (let i = 0; i < ciphertext.length; i += chunkSize) {
        const counterVal = i / chunkSize;
        const counterBytes = new Uint8Array(4);
        counterBytes[0] = (counterVal >> 24) & 0xff;
        counterBytes[1] = (counterVal >> 16) & 0xff;
        counterBytes[2] = (counterVal >> 8) & 0xff;
        counterBytes[3] = counterVal & 0xff;

        const block = new Uint8Array(k.length + 4);
        block.set(k, 0);
        block.set(counterBytes, k.length);

        const keystreamBuffer = await sha256(block);
        const keystream = new Uint8Array(keystreamBuffer);

        const end = Math.min(i + chunkSize, ciphertext.length);
        for (let j = i; j < end; j++) {
          decrypted[j] = ciphertext[j] ^ keystream[j - i];
        }
      }

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function handleUnlock() {
    if (!passwordInput || !window.ENCRYPTED_CONTENT) return;
    const password = passwordInput.value;
    if (!password) {
      errorMsg.textContent = "Please enter a password.";
      return;
    }

    errorMsg.textContent = "Decrypting...";
    
    // Slight delay to allow UI to render "Decrypting..."
    setTimeout(async () => {
      const decryptedHTML = await decrypt(window.ENCRYPTED_CONTENT, password);
      
      if (decryptedHTML && decryptedHTML.includes("points-section")) {
        // Save to sessionStorage so they don't have to re-enter
        sessionStorage.setItem("volunteers-auth-token", password);
        
        // Replace main element innerHTML with decrypted HTML
        mainEl.innerHTML = decryptedHTML;

        // Initialize pagination after DOM injection
        initPagination();
      } else {
        errorMsg.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
      }
    }, 50);
  }

  if (unlockBtn && passwordInput) {
    unlockBtn.addEventListener("click", handleUnlock);
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleUnlock();
      }
    });

    // Check if password was already entered in this session
    const savedPassword = sessionStorage.getItem("volunteers-auth-token");
    if (savedPassword) {
      passwordInput.value = savedPassword;
      handleUnlock();
    }
  }

  // 5. Volunteers Pagination
  let rows = [];
  let paginationContainer = null;
  const itemsPerPage = 10;
  let currentPage = 1;
  let totalPages = 0;

  function initPagination() {
    rows = document.querySelectorAll(".volunteers-table tbody tr");
    paginationContainer = document.getElementById("volunteers-pagination");
    if (rows.length === 0) return;

    currentPage = 1;
    totalPages = Math.ceil(rows.length / itemsPerPage);
    showPage(1);
  }

  function showPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    rows.forEach((row, index) => {
      if (index >= start && index < end) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    renderPagination();
  }

  function renderPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn prev-btn";
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    if (currentPage === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.addEventListener("click", () => {
        showPage(currentPage - 1);
        scrollToVolunteersHeader();
      });
    }
    paginationContainer.appendChild(prevBtn);

    // Number Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = "pagination-btn page-num-btn" + (i === currentPage ? " active" : "");
      pageBtn.textContent = i;
      pageBtn.addEventListener("click", () => {
        showPage(i);
        scrollToVolunteersHeader();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn next-btn";
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    if (currentPage === totalPages) {
      nextBtn.disabled = true;
    } else {
      nextBtn.addEventListener("click", () => {
        showPage(currentPage + 1);
        scrollToVolunteersHeader();
      });
    }
    paginationContainer.appendChild(nextBtn);
  }

  function scrollToVolunteersHeader() {
    const volunteersSection = document.querySelector(".volunteers-section");
    if (volunteersSection) {
      const offset = 90;
      const elementPosition = volunteersSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }

  // Initialize pagination if the table is already rendered (e.g. decrypted via session storage on page load)
  initPagination();
});
