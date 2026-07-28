document.addEventListener("DOMContentLoaded", () => {
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
    if (!passwordInput || !window.VAULT_ENCRYPTED_CONTENT) return;
    const password = passwordInput.value;
    if (!password) {
      errorMsg.textContent = "Please enter a password.";
      return;
    }

    errorMsg.textContent = "Decrypting...";
    
    // Slight delay to allow UI to render "Decrypting..."
    setTimeout(async () => {
      const decryptedHTML = await decrypt(window.VAULT_ENCRYPTED_CONTENT, password);
      
      if (decryptedHTML && decryptedHTML.includes("points-section")) {
        // Save to sessionStorage so they don't have to re-enter
        sessionStorage.setItem("volunteers-vault-token", password);
        
        // Replace main element innerHTML with decrypted HTML
        mainEl.innerHTML = decryptedHTML;

        // Initialize detailed leaderboard in vault if present
        if (document.getElementById("leaderboard-accordion-container")) {
          initVaultLeaderboard();
        }
      } else {
        errorMsg.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
      }
    }, 50);
  }

  function initVaultLeaderboard() {
    let currentTab = 'active';
    let searchQuery = '';
    let visibleCount = 15;
    let isSpreadsheetLoaded = false;

    const container = document.getElementById("leaderboard-accordion-container");
    if (!container) return;

    function initSearch() {
      const searchInput = document.getElementById("volunteer-search");
      if (!searchInput) return;

      searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        visibleCount = 15; // Reset pagination count on search
        updateLeaderboardFilter();
      });
    }

    function initLeaderboardAccordion() {
      // Use event delegation for accordion click toggling
      container.addEventListener("click", (e) => {
        // 1. Check if the user clicks the copy button
        const copyBtn = e.target.closest(".copy-code-btn");
        if (copyBtn) {
          const code = copyBtn.getAttribute("data-code");
          navigator.clipboard.writeText(code).then(() => {
            const icon = copyBtn.querySelector("i");
            if (icon) {
              icon.className = "fa-solid fa-check";
              icon.style.color = "#34d399";
              setTimeout(() => {
                icon.className = "fa-regular fa-copy";
                icon.style.color = "";
              }, 1500);
            }
          }).catch(err => {
            console.error("Failed to copy text: ", err);
          });
          return;
        }

        const header = e.target.closest(".accordion-header");
        if (!header) return;

        // Do not toggle if the user clicks the LinkedIn button or copy button
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
    }

    let volunteers = window.VOLUNTEERS_REGISTRY || [];
    const linkedinMap = {};

    volunteers.forEach(v => {
      if (v.linkedin) {
        linkedinMap[v.name.toLowerCase().trim().replace(/\s+/g, ' ')] = v.linkedin;
      }
    });

    const volunteerCodesMap = {
      "soumyadeep mandal": "SM0126",
      "suprotim datta": "SD0226",
      "ritam jash": "RJ0326",
      "sorabuddin mallick": "SM0426",
      "arpan sarkar": "AS3526",
      "sujal shaw": "SS3626",
      "rahaman jamilur": "RJ0526",
      "pralay bajkhan": "PB0626",
      "saptadeep banerjee": "SB3326",
      "soumoydip halder": "SH3726",
      "sabarna ghosh": "SG3826",
      "deb mukherjee": "DM0826",
      "avik ghosh": "AG3926",
      "pritam kumar mani": "PM0926",
      "mithilesh pandit": "MP1026",
      "musaraf mulla": "MM4026",
      "adeola akinlade": "AA4126",
      "ananya banerjee": "AB1126",
      "soumya mukherjee": "SM4226",
      "sudipto das": "SD4326",
      "chandika sarkar": "CS1226",
      "purnendu naskar": "PN3226",
      "kaushik natua": "KN4426",
      "sandipan karmakar": "SK4526",
      "gourab dey": "GD4626",
      "chitradeep das": "CD4726",
      "sandip mandal": "SM4826",
      "mohammad shahzeb alam": "MA3126",
      "abhijeet yadav": "AY4926",
      "parth pariwandh": "PP1426",
      "kaustav chakraborty": "KC5026",
      "sayak mukherjee": "SM5126",
      "rohit kumar nayak": "RN5226",
      "prasanjeet debnath": "PD1526",
      "adrija mukherjee": "AM5326",
      "soumya maity": "SM5426",
      "srijan paul": "SP1626",
      "debajit pal": "DP5526",
      "soumen  bhunia": "SB5626",
      "aniruddha laha": "AL5726",
      "puja kumari": "PK5826",
      "ankit kumar singh": "AS5926",
      "anurag roy": "AR6026",
      "isanur sardar": "IS6126",
      "chandan kumar raj": "CR1726",
      "prianshu mukherjee": "PM6226",
      "swarnadeep kundu": "SK6326",
      "sounak kumar mondal": "SM1826",
      "harsha nandi": "HN6426",
      "arbind kr. mahato": "AM6526",
      "suvadip banerjee": "SB6626",
      "rudranil sarkar": "RS6726",
      "himanish chatterjee": "HC1926",
      "aaditya gupta": "AG2026",
      "syed mohammad ali jafri": "SJ2126",
      "arijit mondal": "AM2226",
      "antara majumdar": "AM6926",
      "prajes das": "PD7026",
      "sayantan karmakar": "SK2926",
      "soumyo sinha": "SS2326",
      "arin podder": "AP7126",
      "sayantan dey": "SD7226",
      "sourav saha": "SS7326",
      "susmita guha": "SG7426",
      "suman chakraborty": "SC7526",
      "manish bera": "MB3026",
      "pritam verma": "PV7626",
      "palash panigrahi": "PP7726",
      "tanmoy das": "TD7826",
      "debayan ghosh": "DG7926",
      "sowdarjya kolay": "SK2426",
      "md yousuf mallik": "MM2526",
      "diptiman singha": "DS2626",
      "rudranil mallick": "RM8026",
      "aakash sengupta": "AS8126",
      "dhruba dey": "DD2726",
      "debjyoti choudhury": "DC8226",
      "hritik singh": "HS8326",
      "arkoprobho pal": "AP2826",
      "saikat dey": "SD8426",
      "suman kanrar": "SK8526",
      "pranjal jha": "PJ8626",
      "samapti saha": "SS8726",
      "barsha mishra": "BM1326",
      "priyanka kumari gond": "PG0726",
      "alipto choudhury": "AC8826",
      "trisha paul": "TP8926",
      "abhranil dutta": "AD9026",
      "alok malakar": "AM9126",
      "minerva mandal": "MM9226"
    };

    function getVolunteerCode(name, index) {
      const normName = name.toLowerCase().replace(/\s+/g, ' ').trim();
      if (volunteerCodesMap[normName]) {
        return volunteerCodesMap[normName];
      }
      const parts = name.trim().split(/\s+/);
      const firstInitial = parts[0] ? parts[0][0].toUpperCase() : '';
      const lastInitial = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : firstInitial;
      const seq = String(93 + (index - 34)).padStart(2, '0');
      return `${firstInitial}${lastInitial}${seq}26`;
    }

    renderInitialAccordion();

    function updateVolunteerBadges(item, role, points) {
      const badgesContainer = item.querySelector(".leaderboard-badges-container");
      if (!badgesContainer) return;

      badgesContainer.innerHTML = "";

      // 1. Custom Role Badge (if role is not "Active Volunteer")
      const displayRole = role || "Active Volunteer";
      if (displayRole !== "Active Volunteer") {
        const roleBadge = document.createElement("span");
        roleBadge.className = "vol-badge badge-role";
        roleBadge.title = `Role: ${displayRole}`;
        const leaderImg = document.createElement("img");
        leaderImg.src = "../assets/images/ug-leader.png";
        leaderImg.alt = "";
        leaderImg.style.cssText = "width:14px;height:14px;object-fit:contain;margin-right:4px;vertical-align:middle;";
        roleBadge.appendChild(leaderImg);
        roleBadge.appendChild(document.createTextNode(displayRole));
        badgesContainer.appendChild(roleBadge);
      }

      // 2. Active / Inactive Badge
      if (points > 0) {
        const activeBadge = document.createElement("span");
        activeBadge.className = "vol-badge badge-active-vol";
        activeBadge.title = "Status: Active Volunteer";
        const volImg = document.createElement("img");
        volImg.src = "../assets/images/ug-volunteer.png";
        volImg.alt = "";
        volImg.style.cssText = "width:14px;height:14px;object-fit:contain;margin-right:4px;vertical-align:middle;";
        activeBadge.appendChild(volImg);
        activeBadge.appendChild(document.createTextNode("Active Volunteer"));
        badgesContainer.appendChild(activeBadge);
      } else {
        const inactiveBadge = document.createElement("span");
        inactiveBadge.className = "vol-badge badge-inactive";
        inactiveBadge.title = "Status: Inactive Volunteer";
        inactiveBadge.textContent = "Inactive";
        badgesContainer.appendChild(inactiveBadge);
      }

      // 3. Always show LinkedIn button if present
      const linkedinBtn = item.querySelector(".leaderboard-linkedin-btn");
      if (linkedinBtn) {
        linkedinBtn.style.display = "";
      }

      // 4. Point Tier Badges (Dynamic points evaluation)
      if (points >= 100) {
        const b100 = document.createElement("span");
        b100.className = "vol-badge badge-100";
        b100.textContent = "100+";
        b100.title = "Milestone: 100+ Contribution Points";
        badgesContainer.appendChild(b100);
      }
      if (points >= 200) {
        const b200 = document.createElement("span");
        b200.className = "vol-badge badge-200";
        b200.textContent = "200+";
        b200.title = "Milestone: 200+ Contribution Points";
        badgesContainer.appendChild(b200);
      }
      if (points >= 300) {
        const b300 = document.createElement("span");
        b300.className = "vol-badge badge-300";
        b300.textContent = "300+";
        b300.title = "Milestone: 300+ Contribution Points";
        badgesContainer.appendChild(b300);
      }
      if (points >= 400) {
        const b400 = document.createElement("span");
        b400.className = "vol-badge badge-400";
        b400.textContent = "400+";
        b400.title = "Milestone: 400+ Contribution Points";
        badgesContainer.appendChild(b400);
      }
      if (points >= 500) {
        const b500 = document.createElement("span");
        b500.className = "vol-badge badge-500";
        b500.textContent = "500+";
        b500.title = "Milestone: 500+ Contribution Points";
        badgesContainer.appendChild(b500);
      }
    }

    function renderInitialAccordion() {
      container.innerHTML = "";

      // Show a single loading placeholder while sheet data loads
      const loadingPlaceholder = document.createElement("div");
      loadingPlaceholder.className = "leaderboard-loading";
      loadingPlaceholder.id = "leaderboard-loading-placeholder";
      loadingPlaceholder.textContent = "Loading volunteer profiles and points data...";
      container.appendChild(loadingPlaceholder);

      volunteers.forEach((v, index) => {
        const initials = v.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
        const gradIndex = (index % 6) + 1;
        const code = getVolunteerCode(v.name, index);

        const item = document.createElement("div");
        item.className = "accordion-item";
        item.setAttribute("data-name", v.name);
        item.setAttribute("data-points", "0");
        item.setAttribute("data-role", v.role || "Active Volunteer");

        item.innerHTML = `
          <div class="accordion-header">
            <div class="accordion-header-left">
              <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
              <div class="leaderboard-info">
                <span class="leaderboard-name">${v.name} 
                  ${v.name === "Soumyadeep Mandal" ? `<img src="../assets/images/ug-leader.png" alt="Leader" title="AWS UG Kolkata Leader" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; margin-left: 4px;" />` : ''}
                  <span class="volunteer-code-container">
                    <span class="volunteer-code">${code}</span>
                    <button class="copy-code-btn" data-code="${code}" title="Copy Code"><i class="fa-regular fa-copy"></i></button>
                  </span>
                </span>
                <div class="leaderboard-badges-container"></div>
              </div>
            </div>
            <div class="accordion-header-right">
              ${v.linkedin ? `<a href="${v.linkedin}" target="_blank" class="leaderboard-linkedin-btn"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
              <span class="total-points-badge" title="Total Contribution Points">0 Points</span>
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
        updateVolunteerBadges(item, v.role || "Active Volunteer", 0);
      });

      loadSheetData();
    }

    // Helper function to parse CSV
    function parseCSV(t) {
      const lines = [];
      let row = [''];
      let inQuotes = false;
      for (let i = 0; i < t.length; i++) {
        const c = t[i];
        const next = t[i + 1];
        if (c === '"') {
          if (inQuotes && next === '"') { row[row.length - 1] += '"'; i++; }
          else { inQuotes = !inQuotes; }
        } else if (c === ',' && !inQuotes) {
          row.push('');
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
          if (c === '\r' && next === '\n') { i++; }
          lines.push(row);
          row = [''];
        } else {
          row[row.length - 1] += c;
        }
      }
      if (row.length > 1 || row[0] !== '') { lines.push(row); }
      return lines;
    }

    function loadSheetData() {
      const sheetConfig = document.getElementById("sheet-config");
      if (sheetConfig) {
        const url = sheetConfig.getAttribute("data-url");
        fetch(url)
          .then(res => res.text())
          .then(csvText => {
            const rows = parseCSV(csvText);
            const sheetData = {};
            let current = null;
            rows.forEach(r => {
              const name = r[0] ? r[0].trim() : '';
              const period = r[1] ? r[1].trim() : '';
              if (name && name !== 'Volunteers Name' && name !== 'Points Leaderboard') {
                const key = name.toLowerCase().trim().replace(/\s+/g, ' ');
                sheetData[key] = { name, total: 0, months: [] };
                current = sheetData[key];
              } else if (!name && period && current) {
                const monthData = { period, points: [], total: 0 };
                for (let col = 2; col < 14; col++) {
                  const val = r[col] ? parseInt(r[col].trim(), 10) || 0 : 0;
                  monthData.points.push(val);
                  monthData.total += val;
                }
                current.total += monthData.total;
                current.months.push(monthData);
              }
            });
            isSpreadsheetLoaded = true;

            const placeholder = document.getElementById("leaderboard-loading-placeholder");
            if (placeholder) placeholder.remove();

            const items = Array.from(container.querySelectorAll(".accordion-item"));
            const existingNames = new Set();

            items.forEach(item => {
              const vName = item.getAttribute("data-name");
              const normName = vName.toLowerCase().trim().replace(/\s+/g, ' ');
              const vRole = item.getAttribute("data-role") || "Active Volunteer";
              existingNames.add(normName);
              const data = sheetData[normName];
              const badge = item.querySelector(".total-points-badge");
              const panelContent = item.querySelector(".accordion-panel-content");

              if (data) {
                item.setAttribute("data-points", data.total);
                if (badge) badge.textContent = `${data.total} Points`;
                updateVolunteerBadges(item, vRole, data.total);

                let tableHTML = `
                  <div class="table-wrapper">
                    <table class="leaderboard-table">
                      <thead>
                        <tr>
                          <th class="col-month">Month (2026)</th>
                          <th>Add New Members</th>
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
                      <td data-label="Add New Members">${m.points[0]}</td>
                      <td data-label="Social media - Like">${m.points[1]}</td>
                      <td data-label="Social media - Comment">${m.points[2]}</td>
                      <td data-label="Social media - Share/Repost/Thoughts">${m.points[3]}</td>
                      <td data-label="Meetup.com Review">${m.points[4]}</td>
                      <td data-label="Attendance">${m.points[5]}</td>
                      <td data-label="Meetup RSVP">${m.points[6]}</td>
                      <td data-label="Be a speaker">${m.points[7]}</td>
                      <td data-label="Secure venue">${m.points[8]}</td>
                      <td data-label="Organize in college">${m.points[9]}</td>
                      <td data-label="Secure sponsor">${m.points[10]}</td>
                      <td data-label="New attendee">${m.points[11]}</td>
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
                updateVolunteerBadges(item, vRole, 0);
                if (panelContent) panelContent.innerHTML = `<div style="text-align: center; color: var(--color-text-secondary); font-style: italic; padding: 1rem;">No points recorded yet.</div>`;
              }
            });

            let count = items.length;
            Object.keys(sheetData).forEach(key => {
              if (!existingNames.has(key)) {
                count++;
                const data = sheetData[key];
                const name = data.name;
                const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
                const gradIndex = (count % 6) + 1;
                const sheetLinkedin = linkedinMap[key] || '';

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
                          <th>Add New Members</th>
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
                      <td data-label="Add New Members">${m.points[0]}</td>
                      <td data-label="Social media - Like">${m.points[1]}</td>
                      <td data-label="Social media - Comment">${m.points[2]}</td>
                      <td data-label="Social media - Share/Repost/Thoughts">${m.points[3]}</td>
                      <td data-label="Meetup.com Review">${m.points[4]}</td>
                      <td data-label="Attendance">${m.points[5]}</td>
                      <td data-label="Meetup RSVP">${m.points[6]}</td>
                      <td data-label="Be a speaker">${m.points[7]}</td>
                      <td data-label="Secure venue">${m.points[8]}</td>
                      <td data-label="Organize in college">${m.points[9]}</td>
                      <td data-label="Secure sponsor">${m.points[10]}</td>
                      <td data-label="New attendee">${m.points[11]}</td>
                      <td data-label="Total" class="cell-total">${m.total}</td>
                    </tr>
                  `;
                });
                tableHTML += `
                      </tbody>
                    </table>
                  </div>
                `;

                const code = getVolunteerCode(name, count - 1);
                newItem.setAttribute("data-role", "Active Volunteer");
                newItem.innerHTML = `
                  <div class="accordion-header">
                    <div class="accordion-header-left">
                      <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
                      <div class="leaderboard-info">
                        <span class="leaderboard-name">${name} 
                          <span class="volunteer-code-container">
                            <span class="volunteer-code">${code}</span>
                            <button class="copy-code-btn" data-code="${code}" title="Copy Code"><i class="fa-regular fa-copy"></i></button>
                          </span>
                        </span>
                        <div class="leaderboard-badges-container"></div>
                      </div>
                    </div>
                    <div class="accordion-header-right">
                      ${sheetLinkedin ? `<a href="${sheetLinkedin}" target="_blank" class="leaderboard-linkedin-btn"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>` : ''}
                      <span class="total-points-badge" title="Total Contribution Points">${data.total} Points</span>
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
                updateVolunteerBadges(newItem, "Active Volunteer", data.total);
              }
            });

            const allItems = Array.from(container.querySelectorAll(".accordion-item"));
            allItems.sort((a, b) => {
              const pointsA = parseInt(a.getAttribute("data-points"), 10) || 0;
              const pointsB = parseInt(b.getAttribute("data-points"), 10) || 0;
              return pointsB - pointsA;
            });
            allItems.forEach(item => container.appendChild(item));
            updateLeaderboardFilter();


          })
          .catch(err => {
            console.error("Error loading sheet data:", err);
            document.querySelectorAll(".leaderboard-loading").forEach(el => {
              el.textContent = "Error loading points data. Please refresh or try again later.";
            });
          });
      }
    }

    function updateLeaderboardFilter() {
      const items = document.querySelectorAll("#leaderboard-accordion-container .accordion-item");
      const loadMoreContainer = document.getElementById("load-more-container");

      let eligibleCount = 0;

      items.forEach((item) => {
        const points = parseInt(item.getAttribute("data-points"), 10) || 0;
        const nameText = item.querySelector(".leaderboard-name").textContent.toLowerCase();
        const codeEl = item.querySelector(".volunteer-code");
        const codeText = codeEl ? codeEl.textContent.toLowerCase() : '';

        const matchesSearch = nameText.includes(searchQuery) || codeText.includes(searchQuery);

        let matchesTab = false;
        if (!isSpreadsheetLoaded) {
          matchesTab = false;
        } else if (searchQuery.length > 0) {
          matchesTab = true;
        } else {
          if (currentTab === 'active') {
            matchesTab = points > 0;
          } else if (currentTab === '500+') {
            matchesTab = points >= 500;
          } else if (currentTab === '400+') {
            matchesTab = points >= 400 && points < 500;
          } else if (currentTab === '300+') {
            matchesTab = points >= 300 && points < 400;
          } else if (currentTab === '200+') {
            matchesTab = points >= 200 && points < 300;
          } else if (currentTab === '100+') {
            matchesTab = points >= 100 && points < 200;
          } else if (currentTab === 'inactive') {
            matchesTab = points <= 0;
          }
        }

        if (matchesSearch && matchesTab) {
          eligibleCount++;
          if (eligibleCount <= visibleCount) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        } else {
          item.style.display = "none";
        }
      });

      if (loadMoreContainer) {
        if (eligibleCount > visibleCount) {
          loadMoreContainer.style.display = "flex";
        } else {
          loadMoreContainer.style.display = "none";
        }
      }
    }

    function initTiersAndPagination() {
      const tabsContainer = document.getElementById("leaderboard-tabs");
      if (tabsContainer) {
        tabsContainer.addEventListener("click", (e) => {
          const btn = e.target.closest(".tab-btn");
          if (!btn) return;

          tabsContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          currentTab = btn.getAttribute("data-tab");
          visibleCount = 15;
          updateLeaderboardFilter();
        });
      }

      const loadMoreBtn = document.getElementById("load-more-btn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          visibleCount += 15;
          updateLeaderboardFilter();
        });
      }
    }

    initSearch();
    initLeaderboardAccordion();
    initTiersAndPagination();
  }

  if (unlockBtn && passwordInput) {
    unlockBtn.addEventListener("click", handleUnlock);
    passwordInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleUnlock();
      }
    });

    // Check if password was already entered in this session
    const savedPassword = sessionStorage.getItem("volunteers-vault-token");
    if (savedPassword) {
      passwordInput.value = savedPassword;
      handleUnlock();
    }
  }
});
