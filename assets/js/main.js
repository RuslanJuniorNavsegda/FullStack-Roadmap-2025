// Theme toggler
const themeToggle = document.getElementById("theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Check for saved theme preference or use the system preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.setAttribute("data-theme", "dark");
  themeToggle.checked = true;
} else if (currentTheme === "light") {
  document.body.setAttribute("data-theme", "light");
  themeToggle.checked = false;
} else if (prefersDarkScheme.matches) {
  document.body.setAttribute("data-theme", "dark");
  themeToggle.checked = true;
  localStorage.setItem("theme", "dark");
}

// Toggle theme when checkbox is clicked
themeToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});

// Mobile navigation toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const nav = document.querySelector(".nav");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", function () {
    const isExpanded = nav.classList.contains("active");
    nav.classList.toggle("active");
    this.setAttribute("aria-expanded", !isExpanded);

    // If menu is now open, add event listener to close when clicking outside
    if (!isExpanded) {
      setTimeout(() => {
        document.addEventListener("click", closeMenuOnClickOutside);
      }, 10);
    } else {
      document.removeEventListener("click", closeMenuOnClickOutside);
    }
  });
}

// Close menu when clicking outside
function closeMenuOnClickOutside(e) {
  if (
    nav.classList.contains("active") &&
    !nav.contains(e.target) &&
    !mobileMenuToggle.contains(e.target)
  ) {
    nav.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", closeMenuOnClickOutside);
  }
}

// Close menu when pressing ESC key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && nav.classList.contains("active")) {
    nav.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", closeMenuOnClickOutside);
  }
});

// Initialize roadmap items - collapsed by default
function initRoadmapItems() {
  // Select all roadmap items and timeline days
  const roadmapItems = document.querySelectorAll(".roadmap-item");
  const timelineDays = document.querySelectorAll(".timeline-day");

  // Handle roadmap items
  roadmapItems.forEach((item, index) => {
    const header = item.querySelector("h3");

    // Only expand the first item in each section by default
    const isFirstInSection =
      !item.previousElementSibling ||
      item.previousElementSibling.tagName !== "DIV" ||
      !item.previousElementSibling.classList.contains("roadmap-item");

    if (isFirstInSection) {
      item.classList.add("expanded");
    }

    header.addEventListener("click", () => {
      item.classList.toggle("expanded");
    });
  });

  // Handle timeline days
  timelineDays.forEach((day) => {
    const header = day.querySelector(".day-header");

    header.addEventListener("click", () => {
      day.classList.toggle("expanded");
    });
  });
}

// Active navigation based on scroll
function setupScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  function onScroll() {
    let currentSection = "";
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentSection}`) {
        item.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); // Call once to set initial state
}

// Add smooth scrolling for navigation links
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll(".nav-item");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Close mobile menu if open
      if (nav.classList.contains("active")) {
        nav.classList.remove("active");
      }

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}

// Add ripple effect to buttons
function addRippleEffect() {
  const buttons = document.querySelectorAll(
    ".btn, .reset-button, .print-button"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        width: 5px;
        height: 5px;
        top: ${y}px;
        left: ${x}px;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
      `;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add the ripple animation
  if (!document.querySelector("#rippleAnimation")) {
    const style = document.createElement("style");
    style.id = "rippleAnimation";
    style.textContent = `
      @keyframes rippleEffect {
        to {
          transform: scale(30);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Lazy loading images for better performance
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }
}

// Update progress bar to be more compact
function initializeProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");
  const weekBars = document.querySelectorAll(".week-bar-fill");

  progressBars.forEach((bar) => {
    const percent = bar.getAttribute("data-percent") || "0";
    setTimeout(() => {
      bar.style.width = `${percent}%`;
    }, 300);
  });

  weekBars.forEach((bar) => {
    const percent = bar.getAttribute("data-percent") || "0";
    setTimeout(() => {
      bar.style.width = `${percent}%`;
    }, 500);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initRoadmapItems();
  setupScrollSpy();
  setupSmoothScroll();
  addRippleEffect();
  lazyLoadImages();
  initializeProgressBars();

  // Print roadmap functionality
  const printButton = document.querySelector(".print-button");
  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }
});
