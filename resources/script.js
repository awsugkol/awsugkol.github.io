document.addEventListener("DOMContentLoaded", () => {
  const accordionItems = document.querySelectorAll(".resource-accordion-item");

  accordionItems.forEach(item => {
    const header = item.querySelector(".resource-accordion-header");
    const content = item.querySelector(".resource-accordion-content");

    if (header && content) {
      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Toggle current accordion
        if (isOpen) {
          item.classList.remove("active");
          content.style.maxHeight = null;
        } else {
          item.classList.add("active");
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  });

  // Evaluate visibility of resource card blocks dynamically
  function evaluateResourceVisibility() {
    document.querySelectorAll(".resource-content-inner").forEach(container => {
      const cardBlocks = container.querySelectorAll(".resource-card-block");
      let visibleCount = 0;

      cardBlocks.forEach(block => {
        // Check if block has explicit data-has-content attribute or actual links/media inside
        const hasExplicitFlag = block.getAttribute("data-has-content") === "true";
        const hasLinkOrMedia = block.querySelector("a, iframe, img, video, embed, object") !== null;
        
        // Check if block contains any child that is NOT just a placeholder or H4 title
        const customContent = Array.from(block.children).some(child => {
          return !child.classList.contains("resource-placeholder") && child.tagName !== "H4";
        });

        if (hasExplicitFlag || hasLinkOrMedia || customContent) {
          block.style.display = "";
          visibleCount++;
        } else {
          block.style.display = "none";
        }
      });

      // Handle empty state notice if no resource block has active content
      let noticeEl = container.querySelector(".empty-resources-notice");
      if (visibleCount === 0) {
        if (!noticeEl) {
          noticeEl = document.createElement("div");
          noticeEl.className = "empty-resources-notice";
          noticeEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Resources for this meetup session will be uploaded soon. Stay tuned!';
          container.appendChild(noticeEl);
        }
        noticeEl.style.display = "flex";
      } else if (noticeEl) {
        noticeEl.style.display = "none";
      }
    });
  }

  evaluateResourceVisibility();

  // Automatically open the first accordion by default if present
  if (accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector(".resource-accordion-content");
    if (firstItem && firstContent) {
      firstItem.classList.add("active");
      firstContent.style.maxHeight = firstContent.scrollHeight + "px";
    }
  }

  // Scroll to top button logic
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (scrollToTopBtn) {
    scrollToTopBtn.removeAttribute("style");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 150) {
        scrollToTopBtn.classList.add("visible");
        scrollToTopBtn.classList.add("show");
      } else {
        scrollToTopBtn.classList.remove("visible");
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
});
