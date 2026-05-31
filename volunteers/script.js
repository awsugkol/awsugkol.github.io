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

        // Initialize volunteer search
        initSearch();

        // Initialize leaderboard accordion
        initLeaderboardAccordion();


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


  function initSearch() {
    const searchInput = document.getElementById("volunteer-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      const accordionItems = document.querySelectorAll("#leaderboard-accordion-container .accordion-item");
      accordionItems.forEach((item) => {
        const nameText = item.querySelector(".leaderboard-name").textContent.toLowerCase();
        const roleText = item.querySelector(".leaderboard-role") ? item.querySelector(".leaderboard-role").textContent.toLowerCase() : "";
        if (nameText.includes(query) || roleText.includes(query)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  function initLeaderboardAccordion() {
    const container = document.getElementById("leaderboard-accordion-container");
    if (!container) return;

    // Use event delegation for accordion click toggling
    container.addEventListener("click", (e) => {
      const header = e.target.closest(".accordion-header");
      if (!header) return;

      // Do not toggle if the user clicks the LinkedIn button
      if (e.target.closest(".leaderboard-linkedin-btn")) return;

      const item = header.parentElement;
      const panel = item.querySelector(".accordion-panel");
      const icon = header.querySelector(".accordion-icon");

      // Toggle active class on header
      header.classList.toggle("active");

      // Toggle panel display with slide animation
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        icon.style.transform = "rotate(0deg)";
      } else {
        // Close other panels first
        document.querySelectorAll("#leaderboard-accordion-container .accordion-item").forEach(otherItem => {
          if (otherItem !== item) {
            const otherPanel = otherItem.querySelector(".accordion-panel");
            const otherHeader = otherItem.querySelector(".accordion-header");
            const otherIcon = otherHeader.querySelector(".accordion-icon");
            if (otherPanel && otherPanel.style.maxHeight) {
              otherPanel.style.maxHeight = null;
              otherHeader.classList.remove("active");
              if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
            }
          }
        });

        panel.style.maxHeight = panel.scrollHeight + "px";
        icon.style.transform = "rotate(180deg)";
      }
    });

    // Render volunteers immediately from the static registry inside decrypted.html
    const registryEl = document.getElementById("volunteers-registry");
    let volunteers = [];
    if (registryEl) {
      try {
        volunteers = JSON.parse(registryEl.textContent);
      } catch (e) {
        console.error("Error parsing volunteers registry:", e);
      }
    }

    container.innerHTML = "";
    volunteers.forEach((v, index) => {
      const initials = v.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
      const gradIndex = (index % 6) + 1;

      const item = document.createElement("div");
      item.className = "accordion-item";
      item.setAttribute("data-name", v.name);
      item.setAttribute("data-points", "0");

      item.innerHTML = `
        <div class="accordion-header">
          <div class="accordion-header-left">
            <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
            <div class="leaderboard-info">
              <span class="leaderboard-name">${v.name}</span>
              <span class="leaderboard-role">${v.role || 'Active Volunteer'}</span>
            </div>
          </div>
          <div class="accordion-header-right">
            ${v.linkedin ? `<a href="${v.linkedin}" target="_blank" class="leaderboard-linkedin-btn"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
            <span class="total-points-badge">0 Points</span>
            <i class="fa-solid fa-chevron-down accordion-icon"></i>
          </div>
        </div>
        <div class="accordion-panel">
          <div class="accordion-panel-content">
            <div class="leaderboard-loading">Loading points data...</div>
          </div>
        </div>
      `;
      container.appendChild(item);
    });

    // Helper function to parse CSV
    function parseCSV(t) {
      const lines = [];
      let row = [''];
      let inQuotes = false;
      for (let i = 0; i < t.length; i++) {
        const c = t[i];
        const next = t[i+1];
        if (c === '"') {
          if (inQuotes && next === '"') { row[row.length-1] += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (c === ',' && !inQuotes) {
          row.push('');
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
          if (c === '\r' && next === '\n') i++;
          lines.push(row);
          row = [''];
        } else {
          row[row.length-1] += c;
        }
      }
      if (row.length > 1 || row[0] !== '') lines.push(row);
      return lines;
    }

    // Fetch the data from the Google Sheet
    fetch('https://docs.google.com/spreadsheets/d/1gLIhcPHxKFNZRebiqYQN8E0xRYiQb6EshF4xcTRWZzc/gviz/tq?tqx=out:csv')
      .then(r => r.text())
      .then(text => {
        const rows = parseCSV(text);
        const sheetData = {};
        let current = null;

        rows.forEach(r => {
          const name = r[0] ? r[0].trim() : '';
          const period = r[1] ? r[1].trim() : '';
          if (name && name !== 'Volunteers Name' && name !== 'Points Leaderboard') {
            sheetData[name] = { name, months: [], total: 0 };
            current = sheetData[name];
          } else if (!name && period && current) {
            const monthData = { period, points: [], total: 0 };
            for (let col = 2; col < 13; col++) {
              const val = r[col] ? parseInt(r[col].trim(), 10) || 0 : 0;
              monthData.points.push(val);
              monthData.total += val;
            }
            current.total += monthData.total;
            current.months.push(monthData);
          }
        });

        // Now, update each volunteer element in the DOM
        const items = Array.from(container.querySelectorAll(".accordion-item"));
        const existingNames = new Set();

        items.forEach(item => {
          const vName = item.getAttribute("data-name");
          existingNames.add(vName);
          const data = sheetData[vName];
          const badge = item.querySelector(".total-points-badge");
          const panelContent = item.querySelector(".accordion-panel-content");

          if (data) {
            item.setAttribute("data-points", data.total);
            if (badge) badge.textContent = `${data.total} Points`;
            
            // Build month table
            let tableHTML = `
              <div class="table-wrapper">
                <table class="leaderboard-table">
                  <thead>
                    <tr>
                      <th class="col-month">Month (2026)</th>
                      <th>Social media - Like</th>
                      <th>Social media - Comment</th>
                      <th>Social media - Share/Repost/Thoughts</th>
                      <th>Meetup.com Review</th>
                      <th>Attendance</th>
                      <th>Meetup RSVP</th>
                      <th>Be a speaker</th>
                      <th>Secure venue</th>
                      <th>Organize in college</th>
                      <th>Secure sponsor</th>
                      <th>New attendee</th>
                      <th class="col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
            data.months.forEach(m => {
              tableHTML += `
                <tr>
                  <td data-label="Month">${m.period}</td>
                  <td data-label="Social media - Like">${m.points[0]}</td>
                  <td data-label="Social media - Comment">${m.points[1]}</td>
                  <td data-label="Social media - Share/Repost/Thoughts">${m.points[2]}</td>
                  <td data-label="Meetup.com Review">${m.points[3]}</td>
                  <td data-label="Attendance">${m.points[4]}</td>
                  <td data-label="Meetup RSVP">${m.points[5]}</td>
                  <td data-label="Be a speaker">${m.points[6]}</td>
                  <td data-label="Secure venue">${m.points[7]}</td>
                  <td data-label="Organize in college">${m.points[8]}</td>
                  <td data-label="Secure sponsor">${m.points[9]}</td>
                  <td data-label="New attendee">${m.points[10]}</td>
                  <td data-label="Total" class="cell-total">${m.total}</td>
                </tr>
              `;
            });
            tableHTML += `
                  </tbody>
                </table>
              </div>
            `;
            if (panelContent) panelContent.innerHTML = tableHTML;
          } else {
            item.setAttribute("data-points", "0");
            if (badge) badge.textContent = `0 Points`;
            if (panelContent) panelContent.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary); font-style: italic; padding: 1rem;">No points recorded yet.</div>`;
          }
        });

        // Add any volunteers from Google Sheet that are not in the hardcoded list
        let count = items.length;
        Object.keys(sheetData).forEach(name => {
          if (!existingNames.has(name)) {
            count++;
            const data = sheetData[name];
            const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            const gradIndex = (count % 6) + 1;

            const newItem = document.createElement("div");
            newItem.className = "accordion-item";
            newItem.setAttribute("data-name", name);
            newItem.setAttribute("data-points", data.total);

            let tableHTML = `
              <div class="table-wrapper">
                <table class="leaderboard-table">
                  <thead>
                    <tr>
                      <th class="col-month">Month (2026)</th>
                      <th>Social media - Like</th>
                      <th>Social media - Comment</th>
                      <th>Social media - Share/Repost/Thoughts</th>
                      <th>Meetup.com Review</th>
                      <th>Attendance</th>
                      <th>Meetup RSVP</th>
                      <th>Be a speaker</th>
                      <th>Secure venue</th>
                      <th>Organize in college</th>
                      <th>Secure sponsor</th>
                      <th>New attendee</th>
                      <th class="col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
            `;
            data.months.forEach(m => {
              tableHTML += `
                <tr>
                  <td data-label="Month">${m.period}</td>
                  <td data-label="Social media - Like">${m.points[0]}</td>
                  <td data-label="Social media - Comment">${m.points[1]}</td>
                  <td data-label="Social media - Share/Repost/Thoughts">${m.points[2]}</td>
                  <td data-label="Meetup.com Review">${m.points[3]}</td>
                  <td data-label="Attendance">${m.points[4]}</td>
                  <td data-label="Meetup RSVP">${m.points[5]}</td>
                  <td data-label="Be a speaker">${m.points[6]}</td>
                  <td data-label="Secure venue">${m.points[7]}</td>
                  <td data-label="Organize in college">${m.points[8]}</td>
                  <td data-label="Secure sponsor">${m.points[9]}</td>
                  <td data-label="New attendee">${m.points[10]}</td>
                  <td data-label="Total" class="cell-total">${m.total}</td>
                </tr>
              `;
            });
            tableHTML += `
                  </tbody>
                </table>
              </div>
            `;

            newItem.innerHTML = `
              <div class="accordion-header">
                <div class="accordion-header-left">
                  <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
                  <div class="leaderboard-info">
                    <span class="leaderboard-name">${name}</span>
                    <span class="leaderboard-role">Active Volunteer</span>
                  </div>
                </div>
                <div class="accordion-header-right">
                  <span class="total-points-badge">${data.total} Points</span>
                  <i class="fa-solid fa-chevron-down accordion-icon"></i>
                </div>
              </div>
              <div class="accordion-panel">
                <div class="accordion-panel-content">
                  ${tableHTML}
                </div>
              </div>
            `;
            container.appendChild(newItem);
          }
        });

        // Finally, sort all accordion items dynamically by data-points (descending)
        const allItems = Array.from(container.querySelectorAll(".accordion-item"));
        allItems.sort((a, b) => {
          const pointsA = parseInt(a.getAttribute("data-points"), 10) || 0;
          const pointsB = parseInt(b.getAttribute("data-points"), 10) || 0;
          return pointsB - pointsA;
        });
        allItems.forEach(item => container.appendChild(item));
      })
      .catch(err => {
        console.error("Error loading sheet data:", err);
        document.querySelectorAll(".leaderboard-loading").forEach(el => {
          el.textContent = "Error loading points data. Please refresh or try again later.";
        });
      });
  }
});
