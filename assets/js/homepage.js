document.addEventListener("DOMContentLoaded", () => {
  // 0. Announcement Modal Logic
  const modal = document.getElementById("announcement-modal");
  const closeBtn = document.getElementById("close-modal-btn");
  if (modal) {
    // Apply modal styles
    const modalStyle = document.createElement("style");
    modalStyle.textContent = `
      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000000;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      .modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      .modal-content {
        position: relative;
        overflow: hidden;
        background: var(--color-bg-secondary, #1a1145);
        border: 1px solid rgba(196, 181, 253, 0.3);
        border-radius: 20px;
        padding: 2.5rem 2rem;
        max-width: 480px;
        width: 100%;
        text-align: center;
        box-shadow: 0 25px 60px rgba(71, 33, 209, 0.3);
        transform: translateY(20px) scale(0.95);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .modal-overlay.active .modal-content {
        transform: translateY(0) scale(1);
      }
      .modal-glow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(71, 33, 209, 0.15) 0%, transparent 60%);
        pointer-events: none;
        z-index: 0;
      }
      .modal-header {
        position: relative;
        z-index: 1;
        margin-bottom: 1rem;
      }
      .modal-icon {
        font-size: 3rem;
        margin-bottom: 0.75rem;
      }
      .modal-header h2 {
        font-size: 1.6rem;
        font-family: var(--font-heading);
        color: #ffffff;
        margin: 0;
      }
      .modal-body {
        position: relative;
        z-index: 1;
        margin-bottom: 1.5rem;
      }
      .modal-body p {
        color: var(--color-text-secondary);
        font-size: 1rem;
        line-height: 1.6;
        margin-bottom: 0.75rem;
      }
      .modal-body .highlight-text {
        color: var(--color-aws-orange, #ff9900);
        font-weight: 700;
      }
      .modal-footer {
        position: relative;
        z-index: 1;
      }
      .modal-footer .btn {
        background: linear-gradient(135deg, #4721d1, #3f20c5);
        color: #ffffff;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(71, 33, 209, 0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .modal-footer .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(71, 33, 209, 0.5);
      }
      body.light-theme .modal-overlay {
        background: rgba(255, 255, 255, 0.85);
      }
      body.light-theme .modal-content {
        background: #ffffff;
        border-color: rgba(71, 33, 209, 0.2);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
      }
      body.light-theme .modal-header h2 {
        color: #0f172a;
      }
      body.light-theme .modal-body p {
        color: #475569;
      }
    `;
    document.head.appendChild(modalStyle);

    // Always show modal on page load (with slight delay for smooth entrance)
    setTimeout(() => modal.classList.add("active"), 600);

    // Close modal and trigger celebration
    function closeModal() {
      modal.classList.remove("active");
      setTimeout(() => {
        if (!modal.classList.contains("active")) {
          modal.style.display = "none";
        }
      }, 350);
    }

    // Confetti celebration animation (canvas-based)
    function launchConfetti() {
      const canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;";
      document.body.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ["#ff9900", "#4721d1", "#c4b5fd", "#22c55e", "#e51937", "#ffffff", "#3f20c5"];
      const particles = [];
      const particleCount = 150;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vy: Math.random() * 3 + 2,
          vx: Math.random() * 2 - 1,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 6 - 3,
          opacity: 1
        });
      }

      let frame = 0;
      const maxFrames = 180; // ~3 seconds at 60fps

      function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (frame > maxFrames - 60) {
          const fadeProgress = (frame - (maxFrames - 60)) / 60;
          particles.forEach(p => { p.opacity = 1 - fadeProgress; });
        }

        particles.forEach(p => {
          p.y += p.vy;
          p.x += p.vx;
          p.rotation += p.rotationSpeed;
          p.vy += 0.05;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });

        if (frame < maxFrames) {
          requestAnimationFrame(animate);
        } else {
          canvas.remove();
        }
      }
      requestAnimationFrame(animate);
    }

    // Close on button click — trigger confetti
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeModal();
        setTimeout(launchConfetti, 300);
      });
    }
    // Close on overlay click — no confetti
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  // 1. Dynamically render About Preview on Homepage
  const aboutContainer = document.getElementById("homepage-about-preview");
  if (aboutContainer) {
    aboutContainer.innerHTML = `
      <div class="container">
        <div class="section-header reveal active">
          <h2>Who We Are</h2>
          <div class="hr-line"></div>
        </div>
        <div class="about-grid">
          <div class="about-text reveal active">
            <p>The <strong>AWS User Group Kolkata (AWSUGKOL)</strong> is an independent, community-led group based in the "City of Joy", India. We are united by our passion for Amazon Web Services and Cloud Architecture.</p>
            <p>Our focus spans <strong>Cloud Computing, Serverless, GenAI (Amazon Bedrock), and Enterprise Scalability</strong>. We bridge the gap between learning and production deployment.</p>
            <div style="margin-top: 1.5rem;">
              <a href="./about/" class="btn btn-primary">Learn More About Us <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i></a>
            </div>
          </div>
          <div class="about-stats reveal active">
            <div class="stat-card">
              <i class="fa-brands fa-meetup" style="font-size: 2.5rem; color: #e51937; margin-bottom: 0.5rem;"></i>
              <h3 class="counter" data-target="3000">3000+</h3>
              <p>Meetup Members</p>
            </div>
            <div class="stat-card">
              <i class="fa-brands fa-linkedin" style="font-size: 2.5rem; color: #0077b5; margin-bottom: 0.5rem;"></i>
              <h3 class="counter" data-target="2000">2000+</h3>
              <p>LinkedIn Followers</p>
            </div>
            <div class="stat-card">
              <i class="fa-solid fa-calendar-check" style="font-size: 2.5rem; color: var(--color-aws-orange); margin-bottom: 0.5rem;"></i>
              <h3 class="counter" data-target="80">80+</h3>
              <p>Events Hosted</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Dynamically render Organizers Preview on Homepage
  const organizersContainer = document.getElementById("homepage-organizers-preview");
  if (organizersContainer) {
    organizersContainer.innerHTML = `
      <div class="container">
        <div class="section-header reveal active">
          <h2>Community Leadership</h2>
          <div class="hr-line"></div>
        </div>
        <div class="organizers-grid" style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;">
          <div class="organizer-card reveal active"
            style="background: var(--color-bg-secondary); border: 1px solid var(--color-aws-orange); border-radius: 16px; padding: 2.25rem 2rem; text-align: center; max-width: 380px; width: 100%; box-shadow: 0 10px 30px rgba(71, 33, 209, 0.12);">
            <div class="avatar-wrapper" style="position: relative; width: 120px; height: 120px; margin: 0 auto 1.5rem;">
              <div class="organizer-avatar"
                style="width: 100%; height: 100%; border-radius: 50%; background: var(--color-glass); display: flex; align-items: center; justify-content: center; font-size: 3rem; border: 2px solid var(--color-aws-orange); overflow: hidden;">
                <img src="https://avatars.githubusercontent.com/u/49950107" alt="Soumyadeep Mandal" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div class="leader-badge" title="AWS UG Kolkata Leader"
                style="position: absolute; bottom: 0; right: 0; width: 34px; height: 34px; background: var(--color-bg-secondary); border: 2px solid var(--color-aws-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25); z-index: 2;">
                <img src="./assets/images/ug-leader.png" alt="Leader" style="width: 20px; height: 20px; object-fit: contain;" />
              </div>
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.4rem; font-family: var(--font-heading);">Soumyadeep Mandal</h3>
            <p style="color: var(--color-aws-orange); font-weight: 700; margin-bottom: 0.5rem; font-size: 0.98rem;">Community Leader & Organizer</p>
            <p style="color: var(--color-text-secondary); font-size: 0.82rem; margin-bottom: 0.9rem; opacity: 0.8;">Kolkata, West Bengal, India · Hybrid · 7+ years</p>
            <p style="color: var(--color-text-secondary); font-size: 0.93rem; line-height: 1.6; text-align: left;">Spearheaded end-to-end planning and execution of <strong>80+ technical events</strong>. Scaled the community to <strong>3,000+ Meetup members</strong> and <strong>2,000+ LinkedIn followers</strong>. Curates industry experts and AWS Evangelists for technical presentations. Collaborates with AWS and global vendors for sponsorships and resources.</p>
            <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
              <a href="https://go.omniaigs.com/r/EN1OVr" target="_blank"
                style="display: flex; align-items: center; gap: 0.4rem; color: var(--color-text-primary); text-decoration: none; font-weight: 500; font-size: 0.88rem; padding: 0.45rem 0.9rem; background: rgba(255, 153, 0, 0.18); border: 1px solid rgba(255, 153, 0, 0.45); border-radius: 8px;" title="AWS Builder Profile"><i class="fa-brands fa-aws" style="color: #ff9900; font-size: 1.1rem;"></i> AWS Builder</a>
              <a href="https://go.omniaigs.com/r/KF-3ZV" target="_blank"
                style="display: flex; align-items: center; gap: 0.4rem; color: var(--color-text-primary); text-decoration: none; font-weight: 500; font-size: 0.88rem; padding: 0.45rem 0.9rem; background: rgba(128, 128, 128, 0.1); border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 8px;"><i class="fa-brands fa-x-twitter"></i> X</a>
              <a href="https://go.omniaigs.com/r/jGyS1u" target="_blank"
                style="display: flex; align-items: center; gap: 0.4rem; color: var(--color-text-primary); text-decoration: none; font-weight: 500; font-size: 0.88rem; padding: 0.45rem 0.9rem; background: rgba(0, 119, 181, 0.15); border: 1px solid rgba(0, 119, 181, 0.4); border-radius: 8px;"><i class="fa-brands fa-linkedin" style="color: #0077b5;"></i> LinkedIn</a>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
          <a href="./organizers/" class="btn btn-secondary">Meet All Organizers & Team <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i></a>
        </div>
      </div>
    `;
  }

  // 3. Top 10 Volunteers Leaderboard (Auto-fetched from registry + Google Sheets)
  const topVolGrid = document.getElementById("top-volunteers-grid");
  if (topVolGrid) {
    const SHEET_CSV_URL = "https://community.omniaigs.com/awsugkol/files/volunteer_points_leaderboard_2026.csv";
    const REGISTRY_URL = "./volunteers/registry.json";

    // CSV parser helper
    function parseCSVLines(t) {
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

    Promise.all([
      fetch(REGISTRY_URL).then(r => r.json()),
      fetch(SHEET_CSV_URL).then(r => r.text())
    ])
      .then(([registry, csvText]) => {
        // Build awsBuilder/role maps from registry
        const awsBuilderMap = {};
        const roleMap = {};
        registry.forEach(v => {
          const key = v.name.toLowerCase().trim().replace(/\s+/g, ' ');
          if (v.awsBuilder) awsBuilderMap[key] = v.awsBuilder;
          if (v.role) roleMap[key] = v.role;
        });

        // Parse CSV to extract points per volunteer
        const sheetData = {};
        let current = null;
        const lines = parseCSVLines(csvText);

        lines.forEach(r => {
          const name = r[0] ? r[0].trim() : '';
          const period = r[1] ? r[1].trim() : '';
          if (name && name !== 'Volunteers Name' && name !== 'Points Leaderboard') {
            const key = name.toLowerCase().trim().replace(/\s+/g, ' ');
            sheetData[key] = { name, total: 0 };
            current = sheetData[key];
          } else if (!name && period && current) {
            for (let col = 2; col < 14; col++) {
              const val = r[col] ? parseInt(r[col].trim(), 10) || 0 : 0;
              current.total += val;
            }
          }
        });

        // Merge registry names with sheet points
        const merged = [];
        const seen = new Set();

        registry.forEach(v => {
          const key = v.name.toLowerCase().trim().replace(/\s+/g, ' ');
          const points = sheetData[key] ? sheetData[key].total : 0;
          seen.add(key);
          if (points > 0) {
            merged.push({ name: v.name, role: v.role || "Active Volunteer", awsBuilder: v.awsBuilder || '', points });
          }
        });

        // Add sheet-only volunteers not in registry
        Object.keys(sheetData).forEach(key => {
          if (!seen.has(key) && sheetData[key].total > 0) {
            merged.push({ name: sheetData[key].name, role: roleMap[key] || "Active Volunteer", awsBuilder: awsBuilderMap[key] || '', points: sheetData[key].total });
          }
        });

        // Sort by points descending, take top 10
        merged.sort((a, b) => b.points - a.points);
        const top10 = merged.slice(0, 10);

        // Render cards
        topVolGrid.innerHTML = '';
        top10.forEach((vol, i) => {
          const rank = i + 1;
          const initials = vol.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
          const gradClass = `grad-${(i % 6) + 1}`;
          const rankClass = rank <= 3 ? ` rank-${rank}` : '';

          const card = document.createElement("div");
          card.className = "top-vol-card";
          card.innerHTML = `
            <div class="top-vol-rank${rankClass}">${rank}</div>
            <div class="top-vol-avatar ${gradClass}">${initials}</div>
            <div class="top-vol-info">
              <div class="top-vol-name">${vol.name}</div>
              <div class="top-vol-role">${vol.role}</div>
            </div>
            <div class="top-vol-points">${vol.points}</div>
            ${vol.awsBuilder ? `<a href="${vol.awsBuilder}" target="_blank" class="top-vol-aws-builder" aria-label="AWS Builder profile of ${vol.name}"><i class="fa-brands fa-aws"></i> Builder</a>` : ''}
          `;
          topVolGrid.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Error loading top volunteers:", err);
        topVolGrid.innerHTML = '<p style="text-align:center;color:var(--color-text-secondary);padding:2rem;">Unable to load volunteer data. Please try again later.</p>';
      });
  }
});
