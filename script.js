/* =====================================================================
   DalyLuxe Lashes — script.js (vanilla JS, sin dependencias)
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     WHATSAPP  —  edita aquí el número del estudio (formato internacional)
  ------------------------------------------------------------------ */
  const whatsappNumber = "573022929597"; // 👈 EDITABLE: código de país + número, sin "+" ni espacios

  const waLink = (msg) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg || "Hola DalyLuxe Lashes 💕")}`;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const formatCOP = (n) => "$" + Number(n).toLocaleString("es-CO");

  document.body.classList.add("no-scroll");

  /* ==================================================================
     1. PRELOADER
  ================================================================== */
  const preloader = $("#preloader");

  function buildParticles() {
    const box = $("#preloaderParticles");
    if (!box || reduced) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
      const d = document.createElement("span");
      d.className = "pdot";
      const size = 3 + Math.random() * 7;
      d.style.width = d.style.height = size + "px";
      d.style.left = Math.random() * 100 + "%";
      d.style.bottom = "-10px";
      d.style.animationDuration = 2.6 + Math.random() * 2.6 + "s";
      d.style.animationDelay = Math.random() * 2.4 + "s";
      frag.appendChild(d);
    }
    box.appendChild(frag);
  }

  let preloaderDone = false;
  function finishPreloader() {
    if (!preloader || preloaderDone) return;
    preloaderDone = true;
    preloader.classList.add("is-done");
    document.body.classList.remove("no-scroll");
    revealHero();
    startHero();
    setTimeout(() => preloader && preloader.remove(), 950);
  }

  function runPreloader() {
    const fill = $("#preloaderFill");
    const pctEl = $("#preloaderPct");
    if (!preloader || !fill) {
      document.body.classList.remove("no-scroll");
      revealHero();
      startHero();
      return;
    }
    buildParticles();
    const dur = reduced ? 500 : 2300;
    let start = null;
    function step(t) {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      const pct = Math.round(eased * 100);
      fill.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct;
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(finishPreloader, reduced ? 80 : 280);
    }
    requestAnimationFrame(step);
  }

  /* ==================================================================
     2. WHATSAPP WIRING
  ================================================================== */
  function wireWhatsApp() {
    // simple anchors with a message
    $$("[data-wa]").forEach((el) => {
      if (el.tagName === "A") {
        el.href = waLink(el.dataset.wa);
        el.target = "_blank";
        el.rel = "noopener";
      } else {
        // clickable cards (featured)
        el.addEventListener("click", () => window.open(waLink(el.dataset.wa), "_blank", "noopener"));
      }
    });
    // service "Reservar" buttons
    $$(".scard__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".scard");
        const name = card ? card.dataset.name : "";
        window.open(
          waLink(`Hola DalyLuxe Lashes 💕, quiero agendar una cita para el servicio *${name}*.`),
          "_blank",
          "noopener"
        );
      });
    });
  }

  /* ==================================================================
     3. HEADER + MOBILE NAV
  ================================================================== */
  function initHeader() {
    const header = $("#header");
    const toggle = $("#navToggle");
    const nav = $("#nav");
    const close = $("#navClose");

    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const openNav = () => {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    };
    const closeNav = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };
    toggle && toggle.addEventListener("click", openNav);
    close && close.addEventListener("click", closeNav);
    $$(".nav__link, .nav__cta", nav).forEach((l) => l.addEventListener("click", closeNav));
  }

  /* ==================================================================
     4. HERO SLIDESHOW + PARALLAX
  ================================================================== */
  let heroTimer = null;
  let heroIndex = 0;
  function startHero() {
    const wrap = $("#heroSlides");
    const dotsBox = $("#heroDots");
    if (!wrap) return;
    const slides = $$(".hero__slide", wrap);
    if (slides.length < 2) return;

    // dots
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Imagen " + (i + 1));
      if (i === 0) b.classList.add("is-active");
      b.addEventListener("click", () => go(i, true));
      dotsBox && dotsBox.appendChild(b);
    });
    const dots = dotsBox ? $$("button", dotsBox) : [];

    function go(n, manual) {
      slides[heroIndex].classList.remove("is-active");
      dots[heroIndex] && dots[heroIndex].classList.remove("is-active");
      heroIndex = (n + slides.length) % slides.length;
      slides[heroIndex].classList.add("is-active");
      dots[heroIndex] && dots[heroIndex].classList.add("is-active");
      if (manual) restart();
    }
    function next() { go(heroIndex + 1); }
    function restart() { clearInterval(heroTimer); heroTimer = setInterval(next, 5200); }
    if (!reduced) restart();
    // Parallax removed by request: hero images no longer drift on scroll.
  }

  /* ==================================================================
     5. SCROLL REVEAL
  ================================================================== */
  let revealHero = function () {};
  function initReveal() {
    // stagger within each parent group
    $$(".reveal").forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const i = sibs.indexOf(el);
      el.style.setProperty("--d", Math.min(i, 6) * 0.08 + "s");
    });

    const heroReveals = $$(".hero .reveal");
    revealHero = function () {
      heroReveals.forEach((el, i) => setTimeout(() => el.classList.add("in"), i * 130));
    };

    const rest = $$(".reveal").filter((el) => !el.closest(".hero"));
    if (!("IntersectionObserver" in window)) {
      rest.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    rest.forEach((el) => io.observe(el));
  }

  /* ==================================================================
     6. SERVICE FILTERS
  ================================================================== */
  function initFilters() {
    const filters = $$(".filter");
    const cards = $$(".scard");
    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((f) => { f.classList.remove("is-active"); f.setAttribute("aria-selected", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        const cat = btn.dataset.filter;
        cards.forEach((card, i) => {
          const match = cat === "all" || card.dataset.category === cat;
          card.classList.toggle("hide", !match);
          if (match) {
            card.style.transitionDelay = Math.min(i, 8) * 0.03 + "s";
            card.classList.remove("in");
            // force reflow then re-add for a soft pop
            void card.offsetWidth;
            card.classList.add("in");
          }
        });
      });
    });
  }

  /* ==================================================================
     7. PRICE CALCULATOR
  ================================================================== */
  const COLOR_ADD = 10000;
  const RETIRO_ADD = 15000;
  function initCalc() {
    const select = $("#calcService");
    const totalEl = $("#calcTotal");
    const book = $("#calcBook");
    const colorChk = $("#calcColor");
    const retiroChk = $("#calcRetiro");
    const note = $("#calcRetoqueNote");
    const segBtns = $$("#calcType .seg__btn");
    if (!select || !totalEl) return;

    let type = "nuevo";

    // populate from service cards (single source of truth)
    $$(".scard").forEach((card) => {
      const opt = document.createElement("option");
      opt.value = card.dataset.name;
      opt.dataset.price = card.dataset.price;
      opt.dataset.retoque = card.dataset.retoque || "";
      opt.textContent = `${card.dataset.name} — ${formatCOP(card.dataset.price)}`;
      select.appendChild(opt);
    });

    function current() { return select.options[select.selectedIndex]; }

    function syncType() {
      const opt = current();
      const hasRetoque = opt && opt.dataset.retoque !== "";
      const retoqueBtn = segBtns.find((b) => b.dataset.type === "retoque");
      if (retoqueBtn) {
        retoqueBtn.disabled = !hasRetoque;
        retoqueBtn.style.opacity = hasRetoque ? "" : ".4";
        retoqueBtn.style.cursor = hasRetoque ? "" : "not-allowed";
      }
      if (!hasRetoque && type === "retoque") { type = "nuevo"; setSeg("nuevo"); }
      if (note) note.textContent = hasRetoque ? "" : "Este servicio no maneja retoque.";
    }

    function setSeg(t) {
      type = t;
      segBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.type === t));
    }

    function compute() {
      const opt = current();
      if (!opt) return;
      const price = Number(opt.dataset.price);
      const retoque = opt.dataset.retoque ? Number(opt.dataset.retoque) : null;
      let base = type === "retoque" && retoque ? retoque : price;
      let total = base;
      if (colorChk && colorChk.checked) total += COLOR_ADD;
      if (retiroChk && retiroChk.checked) total += RETIRO_ADD;
      totalEl.textContent = formatCOP(total);

      const tipo = type === "retoque" && retoque ? "Retoque" : "Aplicación nueva";
      const msg =
        `Hola DalyLuxe Lashes 💕, quiero agendar una cita:\n` +
        `• Servicio: ${opt.value} (${tipo})\n` +
        `• Adicional de color: ${colorChk && colorChk.checked ? "Sí" : "No"}\n` +
        `• Retiro de pestañas: ${retiroChk && retiroChk.checked ? "Sí" : "No"}\n` +
        `Total estimado: ${formatCOP(total)}`;
      if (book) { book.href = waLink(msg); book.target = "_blank"; book.rel = "noopener"; }
    }

    segBtns.forEach((b) =>
      b.addEventListener("click", () => { if (b.disabled) return; setSeg(b.dataset.type); compute(); })
    );
    select.addEventListener("change", () => { syncType(); compute(); });
    colorChk && colorChk.addEventListener("change", compute);
    retiroChk && retiroChk.addEventListener("change", compute);

    syncType();
    compute();
  }

  /* ==================================================================
     8. GALLERY LIGHTBOX
  ================================================================== */
  function initLightbox() {
    const box = $("#lightbox");
    const img = $("#lbImg");
    const cap = $("#lbCap");
    const items = $$(".gitem");
    if (!box || !items.length) return;

    const data = items.map((b) => ({ src: b.dataset.src, cap: b.dataset.cap || "" }));
    let idx = 0;

    function show(i) {
      idx = (i + data.length) % data.length;
      img.src = data[idx].src;
      img.alt = data[idx].cap;
      if (cap) cap.textContent = data[idx].cap;
    }
    function open(i) {
      show(i);
      box.classList.add("open");
      document.body.classList.add("no-scroll");
    }
    function close() {
      box.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }

    items.forEach((b, i) => b.addEventListener("click", () => open(i)));
    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", () => show(idx - 1));
    $("#lbNext").addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ==================================================================
     9. FLOATING WHATSAPP + MISC
  ================================================================== */
  function initMisc() {
    const wa = $("#waFloat");
    if (wa) {
      const onScroll = () => wa.classList.toggle("show", window.scrollY > 380);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ==================================================================
     INIT
  ================================================================== */
  wireWhatsApp();
  initHeader();
  initReveal();
  initFilters();
  initCalc();
  initLightbox();
  initMisc();
  runPreloader();

  // safety net: never let the preloader trap the page
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader && !preloader.classList.contains("is-done")) finishPreloader();
    }, 5000);
  });
})();
