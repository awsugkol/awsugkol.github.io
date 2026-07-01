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

  // 4. Leaderboard Logic (Unencrypted)
  (function () {
    let currentTab = 'active';
    let searchQuery = '';
    let visibleCount = 15;
    let isSpreadsheetLoaded = false;
    const container = document.getElementById("leaderboard-cards-container");

    function initSearch() {
      const searchInput = document.getElementById("volunteer-search");
      if (!searchInput) return;

      searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        visibleCount = 15; // Reset pagination count on search
        updateLeaderboardFilter();
      });
    }

    function initLeaderboardCards() {
      if (!container) return;

      // Use event delegation for copy button click
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
      });
    }

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

      let volunteers = window.VOLUNTEERS_REGISTRY || [];
      const linkedinMap = {};

      volunteers.forEach(v => {
        if (v.linkedin) {
          linkedinMap[v.name.toLowerCase().trim().replace(/\s+/g, ' ')] = v.linkedin;
        }
      });

      // Render initial volunteer cards
      renderInitialCards();

      // Load Google Sheet points data
      loadSheetData();

      function renderInitialCards() {
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
          item.className = "volunteer-card";
          item.setAttribute("data-name", v.name);
          item.setAttribute("data-points", "0");
          item.setAttribute("data-role", v.role || "Active Volunteer");

          item.innerHTML = `
            <div class="card-header">
              <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
              <div class="card-title-area">
                <span class="leaderboard-name">${v.name}
                  ${v.name === "Soumyadeep Mandal" ? `<img src="../assets/images/ug-leader.png" alt="Leader" title="AWS UG Kolkata Leader" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; margin-left: 4px;" />` : ''}
                </span>
                <span class="volunteer-code-container">
                  <span class="volunteer-code">${code}</span>
                  <button class="copy-code-btn" data-code="${code}" title="Copy Code"><i class="fa-regular fa-copy"></i></button>
                </span>
              </div>
            </div>
            <div class="leaderboard-badges-container"></div>
            <div class="card-footer">
              <div class="points-display">
                <span class="points-label">Total Points</span>
                <span class="total-points-badge" title="Total Contribution Points">0 Points</span>
              </div>
              ${v.linkedin ? `<a href="${v.linkedin}" target="_blank" class="leaderboard-linkedin-btn"><i class="fa-brands fa-linkedin"></i> Connect</a>` : ''}
            </div>
          `;
          container.appendChild(item);
          updateVolunteerBadges(item, v.role || "Active Volunteer", 0);
        });
        updateLeaderboardFilter();
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
            if (c === '\r' && next === '\n') i++;
            lines.push(row);
            row = [''];
          } else {
            row[row.length - 1] += c;
          }
        }
        if (row.length > 1 || row[0] !== '') lines.push(row);
        return lines;
      }

      function loadSheetData() {
        const configEl = document.getElementById("sheet-config");
        const sheetURL = configEl ? configEl.getAttribute("data-url") : null;
        if (!sheetURL) {
          console.error("Sheet configuration not found.");
          document.querySelectorAll(".leaderboard-loading").forEach(el => {
            el.textContent = "Error loading points data.";
          });
          return;
        }

        fetch(sheetURL)
          .then(r => r.text())
          .then(text => {
            const rows = parseCSV(text);
            const sheetData = {};
            let current = null;

            rows.forEach(r => {
              const name = r[0] ? r[0].trim() : '';
              const period = r[1] ? r[1].trim() : '';
              if (name && name !== 'Volunteers Name' && name !== 'Points Leaderboard') {
                const key = name.toLowerCase().trim().replace(/\s+/g, ' ');
                sheetData[key] = { name, months: [], total: 0 };
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

          // Remove loading placeholder now that data has loaded
          const placeholder = document.getElementById("leaderboard-loading-placeholder");
          if (placeholder) placeholder.remove();

          // Now, update each volunteer element in the DOM
          const items = Array.from(container.querySelectorAll(".volunteer-card"));
          const existingNames = new Set();

          items.forEach(item => {
            const vName = item.getAttribute("data-name");
            const normName = vName.toLowerCase().trim().replace(/\s+/g, ' ');
            const vRole = item.getAttribute("data-role") || "Active Volunteer";
            existingNames.add(normName);
            const data = sheetData[normName];
            const badge = item.querySelector(".total-points-badge");

            if (data) {
              item.setAttribute("data-points", data.total);
              if (badge) badge.textContent = `${data.total} Points`;
              updateVolunteerBadges(item, vRole, data.total);
            } else {
              item.setAttribute("data-points", "0");
              if (badge) badge.textContent = `0 Points`;
              updateVolunteerBadges(item, vRole, 0);
            }
          });

          // Add any volunteers from Google Sheet that are not in the hardcoded list
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
              newItem.className = "volunteer-card";
              newItem.setAttribute("data-name", name);
              newItem.setAttribute("data-points", data.total);
              newItem.setAttribute("data-role", "Active Volunteer");

              const code = getVolunteerCode(name, count - 1);

              newItem.innerHTML = `
                <div class="card-header">
                  <div class="leaderboard-avatar avatar-grad-${gradIndex}">${initials}</div>
                  <div class="card-title-area">
                    <span class="leaderboard-name">${name}</span>
                    <span class="volunteer-code-container">
                      <span class="volunteer-code">${code}</span>
                      <button class="copy-code-btn" data-code="${code}" title="Copy Code"><i class="fa-regular fa-copy"></i></button>
                    </span>
                  </div>
                </div>
                <div class="leaderboard-badges-container"></div>
                <div class="card-footer">
                  <div class="points-display">
                    <span class="points-label">Total Points</span>
                    <span class="total-points-badge" title="Total Contribution Points">${data.total} Points</span>
                  </div>
                  ${sheetLinkedin ? `<a href="${sheetLinkedin}" target="_blank" class="leaderboard-linkedin-btn"><i class="fa-brands fa-linkedin"></i> Connect</a>` : ''}
                </div>
              `;
              container.appendChild(newItem);
              updateVolunteerBadges(newItem, "Active Volunteer", data.total);
            }
          });

          const allItems = Array.from(container.querySelectorAll(".volunteer-card"));
          allItems.sort((a, b) => {
            const pointsA = parseInt(a.getAttribute("data-points"), 10) || 0;
            const pointsB = parseInt(b.getAttribute("data-points"), 10) || 0;
            return pointsB - pointsA;
          });
          allItems.forEach(item => container.appendChild(item));
          updateLeaderboardFilter();

          // Update hero active volunteer count from actual sheet data
          const activeCount = allItems.filter(item => (parseInt(item.getAttribute("data-points"), 10) || 0) > 0).length;
          const statTotalEl = document.getElementById("stat-total");
          if (statTotalEl) {
            statTotalEl.textContent = activeCount > 0 ? String(activeCount) : '—';
          }

          // Hide tier tabs that have no matching volunteers
          const tierChecks = {
            '500+': p => p >= 500,
            '400+': p => p >= 400 && p < 500,
            '300+': p => p >= 300 && p < 400,
            '200+': p => p >= 200 && p < 300,
            '100+': p => p >= 100 && p < 200,
          };
          const tabsContainer = document.getElementById("leaderboard-tabs");
          if (tabsContainer) {
            Object.entries(tierChecks).forEach(([tab, check]) => {
              const hasVolunteers = allItems.some(item => check(parseInt(item.getAttribute("data-points"), 10) || 0));
              const btn = tabsContainer.querySelector(`.tab-btn[data-tab="${tab}"]`);
              if (btn) btn.style.display = hasVolunteers ? "" : "none";
            });
          }
        })
        .catch(err => {
          console.error("Error loading sheet data:", err);
          document.querySelectorAll(".leaderboard-loading").forEach(el => {
            el.textContent = "Error loading points data. Please refresh or try again later.";
          });
        });
    }

    function updateLeaderboardFilter() {
      const items = document.querySelectorAll("#leaderboard-cards-container .volunteer-card");
      const loadMoreContainer = document.getElementById("load-more-container");

      let eligibleCount = 0;

      items.forEach((item) => {
        const points = parseInt(item.getAttribute("data-points"), 10) || 0;
        const nameText = item.querySelector(".leaderboard-name").textContent.toLowerCase();

        // 1. Check search filter
        const matchesSearch = nameText.includes(searchQuery);

        // 2. Check tab filter
        let matchesTab = false;
        if (!isSpreadsheetLoaded) {
          // While loading, hide all cards — the loading placeholder handles UX
          matchesTab = false;
        } else if (searchQuery.length > 0) {
          // When searching, show all volunteers regardless of tab/active status
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

      // 3. Show/hide Load More button
      if (loadMoreContainer) {
        if (eligibleCount > visibleCount) {
          loadMoreContainer.style.display = "flex";
        } else {
          loadMoreContainer.style.display = "none";
        }
      }
    }

    function initTiersAndPagination() {
      // 1. Tab buttons click event
      const tabsContainer = document.getElementById("leaderboard-tabs");
      if (tabsContainer) {
        tabsContainer.addEventListener("click", (e) => {
          const btn = e.target.closest(".tab-btn");
          if (!btn) return;

          // Remove active class from all buttons and add to the clicked one
          tabsContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          currentTab = btn.getAttribute("data-tab");
          visibleCount = 15; // Reset pagination count on tab change
          updateLeaderboardFilter();
        });
      }

      // 2. Load More button click event
      const loadMoreBtn = document.getElementById("load-more-btn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          visibleCount += 15; // Load next 15 items
          updateLeaderboardFilter();
        });
      }
    }

    // Initialize features
    initSearch();
    initLeaderboardCards();
    initTiersAndPagination();
  })();
});
