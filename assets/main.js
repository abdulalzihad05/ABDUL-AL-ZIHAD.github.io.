(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navlinks");
  const closeMenu = () => { nav?.classList.remove("open"); toggle?.setAttribute("aria-expanded", "false"); };
  toggle?.setAttribute("aria-label", "Toggle navigation");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav?.classList.contains("open")) { closeMenu(); toggle?.focus(); } });
  document.addEventListener("click", e => { if (!e.target.closest(".nav")) closeMenu(); });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const topbar = document.querySelector(".topbar");
  const onScroll = () => topbar?.classList.toggle("scrolled", window.scrollY > 16);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (!("IntersectionObserver" in window)) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches) {
    const items = document.querySelectorAll(".hero-copy, .portrait-wrap, .section-title, .about-grid, .timeline article, .info-card, .research-feature, .skill-box, .empty-state, .cv-inner, .contact-list");
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); reveal.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    items.forEach(el => {
      el.classList.add("reveal");
      if (el.classList.contains("info-card")) el.style.setProperty("--reveal-delay", (Array.from(el.parentElement.children).indexOf(el) % 4) * 65 + "ms");
      reveal.observe(el);
    });
    document.documentElement.classList.add("motion-ready");
    reducedMotion.addEventListener("change", e => {
      if (e.matches) { document.documentElement.classList.remove("motion-ready"); reveal.disconnect(); }
    });
  }
  const links = Array.from(nav?.querySelectorAll('a[href^="#"]') || []);
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const visible = new Map();
  const active = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target.id, entry.isIntersecting));
    const current = sections.find(section => visible.get(section.id));
    links.forEach(link => {
      if (current && link.getAttribute("href") === "#" + current.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-80px 0px -35% 0px", threshold: 0 });
  sections.forEach(section => active.observe(section));
})();