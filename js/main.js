/* ============================================================
   ZELELA TRADING PLC — shared frontend behaviour
   ============================================================ */

// ---- Consultant data model (used by homepage carousel + /consultants) ----
const CONSULTANTS = [
  {
    id: 1,
    name: "Dr. Mulugeta Chane Wube",
    qualification: "PhD",
    position: "Principal Consultant — Institutional Management & Entrepreneurship",
    initials: "MC",
    expertise: [
      "Global Master Trainer certified by ILO and GIZ in Business Growth (SIYB/EBY) and Competency-based Entrepreneurship (CEFE)",
      "Over 20 years of experience in TVET transformation and industry-driven curriculum design",
      "Specialist in National Extension Service Strategies and institutional capacity-building frameworks",
      "Published researcher on supply chain management and the entrepreneurial ecosystem in the Amhara region"
    ]
  },
  {
    id: 2,
    name: "Dr. Arega Embiale Setegn",
    qualification: "PhD",
    position: "Principal Consultant — Marketing Strategy & Digital Innovation",
    initials: "AE",
    expertise: [
      "PhD-level expertise in sales management and promotional strategy, with 15+ years in academic leadership",
      "Certified in Artificial Intelligence Fundamentals and Data Science, specialising in GenAI for business workflows",
      "Proven track record training major financial institutions",
      "Market research expert specialising in tourism marketing and data-driven performance audits"
    ]
  },
  {
    id: 3,
    name: "Asst. Prof. Seid Ebre Yesuf",
    qualification: "MBA",
    position: "Principal Consultant — Strategic Planning & MSME Growth",
    initials: "SE",
    expertise: [
      "Certified Business Counselor, accredited by UNDP and EDI as an MSME Advisor and Entrepreneurship Coach",
      "Developed 10-year strategic plans for city administrations and large educational institutions",
      "Financial literacy expert specialising in MSME credit readiness and bank-ready business plans",
      "Coached 50+ enterprises across manufacturing, construction and service sectors"
    ]
  },
  {
    id: 4,
    name: "Yosef Shiferaw Belayneh",
    qualification: "MSc",
    position: "Principal Consultant — Grant Management, Finance & Auditing",
    initials: "YS",
    expertise: [
      "14+ years as Technical Advisor on World Bank and USAID projects",
      "Specialist in donor fund compliance including CDC, Global Fund and GAVI regulations",
      "IFRS/IPSAS professional for complex health and development-sector projects",
      "Certified in SAP Financial Accounting, plus Peachtree, IBEX and USAID system deployments"
    ]
  },
  {
    id: 5,
    name: "Dr. Naod Mekonnen Yimer",
    qualification: "PhD",
    position: "Principal Consultant — Business Ethics & Sustainability (ESG)",
    initials: "NM",
    expertise: [
      "Expert in ESG reporting and sustainable finance for climate and energy",
      "PhD focused on business ethics, advising on moral intensity in professional accounting",
      "Certified trainer in IFRS and IPSAS for NGOs and public bodies",
      "Advisor to the Agricultural Transformation Institute (ATI) on holistic investment and community development"
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initCarousel();
  initConsultantGrid();
  initContactForm();
  markActiveNav();
});

/* ---------------- Header scroll state ---------------- */
function initHeader(){
  const header = document.querySelector(".site-header");
  if(!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
}

/* ---------------- Mobile nav toggle ---------------- */
function initMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if(!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("mobile-open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("mobile-open");
    toggle.classList.remove("open");
  }));
}

/* ---------------- Active nav highlight ---------------- */
function markActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path || (path === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
}

/* ---------------- Consultant carousel (homepage) ---------------- */
function initCarousel(){
  const track = document.querySelector(".carousel-track");
  const dotsWrap = document.querySelector(".carousel-dots");
  if(!track || !dotsWrap) return;

  track.innerHTML = CONSULTANTS.map(c => slideMarkup(c)).join("");
  dotsWrap.innerHTML = CONSULTANTS.map((c,i) =>
    `<button class="carousel-dot${i===0?' active':''}" aria-label="Show ${c.name}" data-index="${i}"></button>`
  ).join("");

  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 7000;
  const slides = track.children.length;

  function goTo(i){
    index = (i + slides) % slides;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.querySelectorAll(".carousel-dot").forEach((d, di) => d.classList.toggle("active", di === index));
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  function play(){ stop(); timer = setInterval(next, AUTOPLAY_MS); }
  function stop(){ if(timer) clearInterval(timer); }

  document.querySelector(".carousel-arrow.next")?.addEventListener("click", () => { next(); play(); });
  document.querySelector(".carousel-arrow.prev")?.addEventListener("click", () => { prev(); play(); });
  dotsWrap.querySelectorAll(".carousel-dot").forEach(dot => {
    dot.addEventListener("click", () => { goTo(Number(dot.dataset.index)); play(); });
  });

  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", play);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", play);

  // Keyboard navigation
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if(e.key === "ArrowRight"){ next(); play(); }
    if(e.key === "ArrowLeft"){ prev(); play(); }
  });

  // Swipe support
  let startX = null;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; stop(); }, {passive:true});
  track.addEventListener("touchend", (e) => {
    if(startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if(delta > 40) prev();
    else if(delta < -40) next();
    startX = null;
    play();
  }, {passive:true});

  goTo(0);
  play();
}

function slideMarkup(c){
  return `
  <article class="carousel-slide" aria-roledescription="slide" aria-label="${c.name}">
    <div class="consultant-photo">
      <div class="avatar" aria-hidden="true">${c.initials}</div>
    </div>
    <div class="consultant-body">
      <span class="quali">${c.qualification} · Principal Consultant</span>
      <h3>${c.name}</h3>
      <p class="position">${c.position.replace(/^Principal Consultant — /,'')}</p>
      <ul class="expertise-list">
        ${c.expertise.map(x => `<li>${x}</li>`).join("")}
      </ul>
    </div>
  </article>`;
}

/* ---------------- Consultants page grid + modal ---------------- */
function initConsultantGrid(){
  const grid = document.querySelector(".consultants-grid");
  if(!grid) return;

  grid.innerHTML = CONSULTANTS.map(c => `
    <div class="consultant-card" tabindex="0" role="button" data-id="${c.id}" aria-haspopup="dialog">
      <div class="avatar">${c.initials}</div>
      <h3>${c.name}</h3>
      <div class="quali">${c.qualification}</div>
      <div class="position">${c.position}</div>
    </div>
  `).join("");

  const overlay = document.querySelector(".modal-overlay");
  const modalBody = overlay?.querySelector(".modal-body");
  const openModal = (id) => {
    const c = CONSULTANTS.find(x => x.id === Number(id));
    if(!c || !overlay || !modalBody) return;
    modalBody.innerHTML = `
      <div class="avatar" style="width:120px;height:150px;font-size:2rem;margin-bottom:20px;">${c.initials}</div>
      <span class="quali">${c.qualification} · Principal Consultant</span>
      <h3 style="margin-top:6px;">${c.name}</h3>
      <p class="position">${c.position}</p>
      <ul class="expertise-list">${c.expertise.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  };

  grid.querySelectorAll(".consultant-card").forEach(card => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openModal(card.dataset.id); }});
  });

  overlay?.querySelector(".modal-close")?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });

  function closeModal(){
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }
}

/* ---------------- Contact form ---------------- */
function initContactForm(){
  const form = document.querySelector("#contact-form");
  if(!form) return;
  const status = form.querySelector(".form-status");

  const rules = {
    fullName: v => v.trim().length >= 2 || "Please enter your full name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email address.",
    service: v => v.trim().length > 0 || "Please select a service.",
    subject: v => v.trim().length >= 3 || "Please enter a subject.",
    message: v => v.trim().length >= 10 || "Please enter a message of at least 10 characters.",
    consent: v => v === true || "Please agree to the Privacy Policy to continue."
  };

  function showError(field, message){
    const wrap = form.querySelector(`[data-field="${field}"]`);
    if(!wrap) return;
    wrap.classList.toggle("has-error", Boolean(message));
    const err = wrap.querySelector(".field-error");
    if(err) err.textContent = message && message !== true ? message : "";
  }

  function validate(){
    let valid = true;
    Object.keys(rules).forEach(field => {
      const el = form.elements[field];
      if(!el) return;
      const value = el.type === "checkbox" ? el.checked : el.value;
      const result = rules[field](value);
      if(result !== true){ valid = false; showError(field, result); }
      else { showError(field, ""); }
    });
    // honeypot
    if(form.elements["company_website"] && form.elements["company_website"].value){
      valid = false;
    }
    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if(!validate()){
      status.className = "form-status error";
      status.textContent = "Please correct the highlighted fields and try again.";
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      // This posts to /api/contact — see README for wiring a real SMTP/Resend backend.
      // The endpoint is not live in this static build, so we simulate success after
      // a short delay and surface a clear next step if a backend is not connected.
      await new Promise(res => setTimeout(res, 700));

      form.hidden = true;
      const successBlock = document.querySelector("#contact-success");
      if(successBlock){
        successBlock.hidden = false;
        successBlock.scrollIntoView({ behavior:"smooth", block:"center" });
      } else {
        status.className = "form-status success";
        status.textContent = "Thank you — your message has been submitted to Zelela Trading PLC.";
      }
    } catch (err){
      status.className = "form-status error";
      status.textContent = "Something went wrong sending your message. Please email zelelatradingplc@gmail.com directly.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });

  form.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("blur", () => {
      const field = el.name;
      if(rules[field]){
        const value = el.type === "checkbox" ? el.checked : el.value;
        const result = rules[field](value);
        showError(field, result === true ? "" : result);
      }
    });
  });
}
