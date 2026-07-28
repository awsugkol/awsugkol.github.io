document.addEventListener("DOMContentLoaded", () => {
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
            <p style="color: var(--color-aws-orange); font-weight: 700; margin-bottom: 0.9rem; font-size: 0.98rem;">AWS UG Kolkata Leader</p>
            <p style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.6;">Leading operations, web platforms, and community initiatives since 2018.</p>
            <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 0.75rem;">
              <a href="https://go.omniaigs.com/r/KF-3ZV" target="_blank"
                style="display: flex; align-items: center; gap: 0.4rem; color: #fff; text-decoration: none; font-weight: 500; font-size: 0.88rem; padding: 0.45rem 0.9rem; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px;"><i class="fa-brands fa-x-twitter"></i> X</a>
              <a href="https://go.omniaigs.com/r/jGyS1u" target="_blank"
                style="display: flex; align-items: center; gap: 0.4rem; color: #fff; text-decoration: none; font-weight: 500; font-size: 0.88rem; padding: 0.45rem 0.9rem; background: rgba(0, 119, 181, 0.2); border: 1px solid rgba(0, 119, 181, 0.5); border-radius: 8px;"><i class="fa-brands fa-linkedin" style="color: #0077b5;"></i> LinkedIn</a>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 1.5rem;">
          <a href="./organizers/" class="btn btn-secondary">Meet All Organizers & Team <i class="fa-solid fa-arrow-right" style="margin-left: 0.5rem;"></i></a>
        </div>
      </div>
    `;
  }
});
