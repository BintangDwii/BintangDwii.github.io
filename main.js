// main.js

const v1 = document.getElementById("video1");
const v2 = document.getElementById("video2");
const toggleBtn = document.getElementById("toggleFormBtn");
const bookingCard = document.getElementById("bookingCard");
const heroTitle = document.getElementById("heroTitle");

// Fade-in video pertama saat siap
if (v1) {
  v1.addEventListener("canplay", () => {
    v1.classList.remove("opacity-0");
  });
}

// Auto switch ke video2 setelah 5 detik
if (v1 && v2) {
  setTimeout(() => {
    v1.classList.add("opacity-0");
    v2.classList.remove("opacity-0");
    v2.classList.add("opacity-100");
  }, 5000);
}

// Toggle form booking + animasi slide
if (toggleBtn && bookingCard && heroTitle) {
  toggleBtn.addEventListener("click", () => {
    if (bookingCard.classList.contains("hidden")) {
      bookingCard.classList.remove("hidden");
      bookingCard.classList.remove("animate-slideUp");
      bookingCard.classList.add("animate-slideDown");
      heroTitle.classList.add("mb-20", "transition-all", "duration-700", "ease-in-out");
      bookingCard.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      bookingCard.classList.remove("animate-slideDown");
      bookingCard.classList.add("animate-slideUp");
      heroTitle.classList.remove("mb-20");
      bookingCard.addEventListener("animationend", () => {
        bookingCard.classList.add("hidden");
        bookingCard.classList.remove("animate-slideUp");
      }, { once: true });
    }
  });
}


/********************* DOM UTILS *********************/
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/********************* STATE *********************/
const uiState = {
  isMobileNavOpen: false,
};

/********************* HEADER / NAV *********************/
function setupHeader() {
  const mobileBtn = $('#mobileMenuBtn');
  const mobileNav = $('#mobileNav');
  const toTopBtn = $('#toTop');
  const headerEl = $('#header');
  const themeToggle = $('#themeToggle');

  if (!mobileBtn || !mobileNav || !toTopBtn || !headerEl) return;

  // Mobile menu toggle
  mobileBtn.addEventListener('click', () => {
    uiState.isMobileNavOpen = !uiState.isMobileNavOpen;
    mobileNav.classList.toggle('hidden', !uiState.isMobileNavOpen);
    mobileBtn.setAttribute('aria-expanded', String(uiState.isMobileNavOpen));
  });

  // Close mobile menu when link clicked
  $$('#mobileNav a').forEach((link) => {
    link.addEventListener('click', () => {
      uiState.isMobileNavOpen = false;
      mobileNav.classList.add('hidden');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Show back-to-top button on scroll
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 300;
    toTopBtn.classList.toggle('hidden', !scrolled);
    headerEl.classList.toggle('shadow-soft', scrolled);
  });

  // Back-to-top
  toTopBtn.addEventListener('click', () => 
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('prefers-dark', isDark ? '1' : '0');
    });
    const saved = localStorage.getItem('prefers-dark');
    if (saved === '1') document.documentElement.classList.add('dark');
  }
}

/********************* HERO VIDEO *********************/
function setupHeroVideo() {
  const v1 = document.getElementById("video1");
  const v2 = document.getElementById("video2");
  if (v1) {
    v1.addEventListener("canplay", () => {
      v1.classList.remove("opacity-0");
    });
  }
  if (v1 && v2) {
    setTimeout(() => {
      v1.classList.add("opacity-0");
      v2.classList.remove("opacity-0");
      v2.classList.add("opacity-100");
    }, 5000);
  }
}

/********************* HERO BUTTON + FORM *********************/
function setupHeroBooking() {
  const toggleBtn = $('#toggleFormBtn');
  const bookingCard = $('#bookingCard');
  const heroTitle = $('#heroTitle');

  if (!toggleBtn || !bookingCard || !heroTitle) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = bookingCard.classList.contains("hidden");
    if (isHidden) {
      bookingCard.classList.remove("hidden");
      bookingCard.classList.add("animate-slideDown");
      heroTitle.classList.add("mb-20", "transition-all", "duration-700", "ease-in-out");
      bookingCard.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      bookingCard.classList.remove("animate-slideDown");
      bookingCard.classList.add("animate-slideUp");
      bookingCard.addEventListener("animationend", () => {
        bookingCard.classList.add("hidden");
        bookingCard.classList.remove("animate-slideUp");
        heroTitle.classList.remove("mb-20");
      }, { once: true });
    }
  });
}

/********************* BOOKING ENGINE *********************/
function parseDateSafe(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function calcNights(checkin, checkout) {
  const inDate = parseDateSafe(checkin);
  const outDate = parseDateSafe(checkout);
  if (!inDate || !outDate) return 0;
  const ms = outDate - inDate;
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}

function setupBookingEngine() {
  const form = $('#bookingForm');
  const help = $('#bookingHelp');
  if (!form || !help) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const nights = calcNights(data.checkin, data.checkout);

    if (nights <= 0) {
      alert('Please ensure check-out date is after check-in date.');
      return;
    }

    help.textContent = `Found availability in ${data.location} for ${nights} night(s), ${data.rooms} room(s), ${data.guests} guest(s).`;
    openUpsell(`Your stay in ${data.location} • ${nights} night(s)`);
  });

  $$('[data-upsell]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const context = btn.dataset.room || btn.dataset.offer || 'Your selection';
      openUpsell(context);
    });
  });
}

/********************* LIGHTBOX *********************/
function setupLightbox() {
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const closeBtn = $('#lightboxClose');

  if (!lightbox || !lightboxImg || !closeBtn) return;

  $$('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-large');
      if (!src) return;
      lightboxImg.src = src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
    });
  });

  function close() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImg.src = '';
  }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/********************* UPSELL MODAL *********************/
function setupUpsell() {
  const modal = $('#upsell');
  const ctx = $('#upsellContext');
  const form = $('#upsellForm');
  const closeBtn = $('#upsellClose');
  const cancelBtn = $('#upsellCancel');

  if (!modal || !ctx || !form || !closeBtn || !cancelBtn) return;

  window.openUpsell = (contextText) => {
    ctx.textContent = `Recommended add-ons for: ${contextText}`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    form.reset();
  }

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/********************* NEWSLETTER *********************/
function setupNewsletter() {
  const form = $('#newsletterForm');
  const email = $('#newsletterEmail');
  const msg = $('#newsletterMsg');
  if (!form || !email || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = email.value.trim();
    const ok = /.+@.+\..+/.test(value);
    if (!ok) {
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'mt-2 text-sm text-red-600';
      return;
    }
    msg.textContent = 'Thank you! Please check your inbox to confirm.';
    msg.className = 'mt-2 text-sm text-green-600';
    form.reset();
  });
}

/********************* INIT *********************/
document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupHeroVideo();
  setupHeroBooking();
  setupBookingEngine();
  setupLightbox();
  setupUpsell();
  setupNewsletter();
});
