/**
 * Sidra — AI/ML Engineer Portfolio
 * script.js · vanilla JavaScript, no dependencies
 * ---------------------------------------------------------------
 *  1. Helpers
 *  2. Theme toggle (dark / light, remembered per visitor)
 *  3. Mobile navigation
 *  4. Smooth scrolling for in-page links
 *  5. Header state, scroll progress, back-to-top
 *  6. Scroll spy (active nav link)
 *  7. Typing effect
 *  8. Scroll reveal animations
 *  9. Animated stat counters
 * 10. Project filtering
 * 11. "Demo coming soon" links & copy-to-clipboard
 * 12. Contact form (validation + Netlify Forms + mailto fallback)
 * 13. Hero neural-network canvas
 * 14. Developer profile card (syntax highlighting)
 * 15. Image viewer (lightbox), project galleries & certificate images
 * 16. Footer year
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------
   * 1. HELPERS
   * ---------------------------------------------------------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reducedMotionQuery.matches;
  const supportsIO = 'IntersectionObserver' in window;

  // localStorage can throw (private mode, blocked storage) — never let that break the page.
  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    },
  };

  const toastEl = $('#toast');
  let toastTimer;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3000);
  }

  /* ------------------------------------------------------------
   * 2. THEME TOGGLE
   * The saved theme is applied in <head> before paint; this wires
   * up the button and keeps labels / meta theme-color in sync.
   * ---------------------------------------------------------- */
  const THEME_KEY = 'sidra-theme';
  const themeToggle = $('#theme-toggle');
  const metaThemeColor = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    }
    if (metaThemeColor) metaThemeColor.setAttribute('content', isDark ? '#070b16' : '#f6f8fc');
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storage.set(THEME_KEY, next);
    });
  }

  /* ------------------------------------------------------------
   * 3. MOBILE NAVIGATION
   * ---------------------------------------------------------- */
  const header = $('#site-header');
  const navToggle = $('#nav-toggle');
  const navMenu = $('#nav-menu');
  const navLinks = $$('.nav-link');
  const desktopQuery = window.matchMedia('(min-width: 960px)');

  function setMenu(open) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  const isMenuOpen = () => navMenu && navMenu.classList.contains('is-open');

  if (navToggle) {
    navToggle.addEventListener('click', () => setMenu(!isMenuOpen()));
  }

  // Close on Escape, on outside click, and when resizing up to desktop.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) {
      setMenu(false);
      navToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (isMenuOpen() && !header.contains(event.target)) setMenu(false);
  });
  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  /* ------------------------------------------------------------
   * 4. SMOOTH SCROLLING
   * CSS `scroll-behavior` + `scroll-padding-top` handle the offset
   * for the fixed header; JS adds menu closing, focus management
   * and clean URL updates.
   * ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      setMenu(false);

      const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
      if (hash === '#home') {
        window.scrollTo({ top: 0, behavior });
      } else {
        target.scrollIntoView({ behavior, block: 'start' });
      }

      // Move keyboard focus to the section for screen-reader / keyboard users.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (history.pushState) history.pushState(null, '', hash);
    });
  });

  /* ------------------------------------------------------------
   * 5. HEADER STATE, SCROLL PROGRESS, BACK-TO-TOP
   * ---------------------------------------------------------- */
  const progressBar = $('#scroll-progress-bar');
  const backToTop = $('#back-to-top');
  let scrollTicking = false;

  function updateOnScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  updateOnScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------
   * 6. SCROLL SPY — highlight the nav link of the section in view
   * ---------------------------------------------------------- */
  if (supportsIO && navLinks.length) {
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    // A thin band across the middle of the viewport decides the active section.
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => spy.observe(section));
  }

  /* ------------------------------------------------------------
   * 7. TYPING EFFECT — roles come from data-roles on #typed-text
   * ---------------------------------------------------------- */
  function initTyping() {
    const el = $('#typed-text');
    if (!el) return;

    let roles = ['AI/ML Engineer', 'LLM & RAG Specialist', 'MLOps Enthusiast'];
    try {
      const parsed = JSON.parse(el.dataset.roles || '[]');
      if (Array.isArray(parsed) && parsed.length) roles = parsed;
    } catch (e) { /* keep defaults */ }

    if (prefersReducedMotion()) {
      el.textContent = roles[0];
      return;
    }

    const TYPE_MS = 70;
    const DELETE_MS = 38;
    const HOLD_MS = 1900;
    const NEXT_MS = 380;
    let roleIndex = 0;
    let charIndex = roles[0].length;   // first role is already rendered in the HTML
    let deleting = true;

    const tick = () => {
      const word = roles[roleIndex];

      if (deleting) {
        charIndex -= 1;
        el.textContent = word.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, NEXT_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
        return;
      }

      charIndex += 1;
      el.textContent = word.slice(0, charIndex);
      if (charIndex >= word.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
        return;
      }
      setTimeout(tick, TYPE_MS + Math.random() * 45);
    };

    setTimeout(tick, HOLD_MS);
  }
  initTyping();

  /* ------------------------------------------------------------
   * 8. SCROLL REVEAL
   * Elements entering together are staggered slightly.
   * ---------------------------------------------------------- */
  const revealEls = $$('.reveal');

  if (supportsIO && !prefersReducedMotion()) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          entry.target.style.animationDelay = `${Math.min(index, 5) * 90}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------
   * 9. ANIMATED STAT COUNTERS
   * The final values are in the HTML (good for SEO / no-JS);
   * we count up to them when they scroll into view.
   * ---------------------------------------------------------- */
  const counters = $$('[data-count]');
  const formatNumber = (n) => n.toLocaleString('en-US');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);   // easeOutCubic
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (supportsIO && !prefersReducedMotion() && counters.length) {
    counters.forEach((el) => { el.textContent = `0${el.dataset.suffix || ''}`; });
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------
   * 10. PROJECT FILTERING
   * Cards declare categories via data-category="genai ml mlops".
   * ---------------------------------------------------------- */
  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  const filterStatus = $('#filter-status');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((b) => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      let shown = 0;
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const match = filter === 'all' || categories.includes(filter);
        card.classList.toggle('is-hidden', !match);

        if (match) {
          // Restart the pop-in animation for a smooth re-layout.
          card.classList.add('is-visible');
          card.classList.remove('is-filtering-in');
          void card.offsetWidth; // force reflow
          card.style.animationDelay = `${shown * 70}ms`;
          card.classList.add('is-filtering-in');
          shown += 1;
        }
      });

      if (filterStatus) {
        filterStatus.textContent = `Showing ${shown} of ${projectCards.length} projects`;
      }
    });
  });

  /* ------------------------------------------------------------
   * 11. DEMO LINKS & COPY TO CLIPBOARD
   * ---------------------------------------------------------- */
  $$('[data-demo-pending]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(link.dataset.pendingMessage || 'Live demo coming soon — the source code is on GitHub.');
    });
  });

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Fallback for non-secure contexts (e.g. opening the file locally)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    if (!ok) throw new Error('Copy failed');
  }

  $$('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      const label = button.dataset.copyLabel || 'Text';
      try {
        await copyText(text);
        showToast(`${label} copied to clipboard`);
      } catch (e) {
        showToast(text);
      }
    });
  });

  /* ------------------------------------------------------------
   * 12. CONTACT FORM
   * - Client-side validation with inline, accessible errors
   * - Submits to Netlify Forms via fetch (no page reload)
   * - Falls back to the visitor's email app when Netlify isn't available
   * ---------------------------------------------------------- */
  const form = $('#contact-form');

  if (form) {
    const statusEl = $('#form-status');
    const submitBtn = form.querySelector('[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;
    const fallbackEmail = form.dataset.fallbackEmail;

    const validators = {
      name: (v) => v.trim().length >= 2 || 'Please enter your name.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
      message: (v) => v.trim().length >= 10 || 'Please write at least 10 characters.',
    };

    const setStatus = (message, type) => {
      statusEl.textContent = message;
      statusEl.classList.toggle('is-success', type === 'success');
      statusEl.classList.toggle('is-error', type === 'error');
    };

    const setLoading = (loading) => {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (submitLabel) submitLabel.textContent = loading ? 'Sending…' : 'Send Message';
    };

    function validateField(input) {
      const rule = validators[input.name];
      if (!rule) return true;
      const result = rule(input.value);
      const ok = result === true;
      const field = input.closest('.form-field');
      const errorEl = field ? field.querySelector('.field-error') : null;
      if (field) field.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (errorEl) errorEl.textContent = ok ? '' : result;
      return ok;
    }

    function openMailFallback(data) {
      if (!fallbackEmail) return;
      const name = data.get('name') || '';
      const subject = data.get('subject') || `Portfolio inquiry from ${name}`;
      const body = `${data.get('message') || ''}\n\n— ${name} (${data.get('email') || ''})`;
      window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Validate on blur; re-validate live once a field has shown an error.
    $$('input, textarea', form).forEach((input) => {
      if (!validators[input.name]) return;
      input.addEventListener('blur', () => { if (input.value) validateField(input); });
      input.addEventListener('input', () => {
        const field = input.closest('.form-field');
        if (field && field.classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const inputs = Object.keys(validators).map((name) => form.elements[name]).filter(Boolean);
      const results = inputs.map(validateField);   // validate every field, not just the first
      if (results.includes(false)) {
        setStatus('Please fix the highlighted fields.', 'error');
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      if (data.get('bot-field')) return;   // honeypot tripped — silently ignore

      // Opened straight from disk: Netlify isn't there, so use email instead.
      if (window.location.protocol === 'file:') {
        setStatus('Opening your email app…', 'success');
        openMailFallback(data);
        return;
      }

      setLoading(true);
      setStatus('', null);

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString(),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        form.reset();
        $$('.form-field', form).forEach((field) => field.classList.remove('has-error'));
        setStatus("Thank you! Your message has been sent — I'll get back to you soon.", 'success');
      } catch (error) {
        setStatus('The form could not be sent, so your email app will open instead.', 'error');
        openMailFallback(data);
      } finally {
        setLoading(false);
      }
    });
  }

  /* ------------------------------------------------------------
   * 13. HERO NEURAL-NETWORK CANVAS
   * Drifting nodes connected by faint edges, reacting to the cursor.
   * Pauses when off-screen or in a background tab; renders a single
   * static frame for reduced-motion users.
   * ---------------------------------------------------------- */
  function initNeuralCanvas() {
    const canvas = $('#hero-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const hero = $('#home');

    let width = 0;
    let height = 0;
    let nodes = [];
    let rafId = null;
    let running = false;
    let inView = true;
    let colorA = '34, 211, 238';
    let colorB = '52, 211, 153';
    const pointer = { x: 0, y: 0, active: false };

    const readColors = () => {
      const styles = getComputedStyle(root);
      colorA = styles.getPropertyValue('--accent-rgb').trim() || colorA;
      colorB = styles.getPropertyValue('--accent-2-rgb').trim() || colorB;
    };

    const createNodes = () => {
      const count = Math.round(Math.min(90, Math.max(28, (width * height) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.9,
        alt: Math.random() < 0.3,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const widthChanged = Math.abs(rect.width - width) > 1;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Only rebuild the network when the width changes (avoids resets
      // when mobile browser toolbars show/hide and only height changes).
      if (widthChanged || !nodes.length) createNodes();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const linkDist = width < 640 ? 105 : 140;
      const linkDist2 = linkDist * linkDist;

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.32;
            ctx.strokeStyle = `rgba(${colorA}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.strokeStyle = `rgba(${colorB}, ${((1 - dist / 180) * 0.55).toFixed(3)})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx.fillStyle = `rgba(${node.alt ? colorB : colorA}, 0.85)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const update = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }
    };

    const loop = () => {
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || prefersReducedMotion() || document.hidden || !inView) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    readColors();
    resize();
    draw();
    start();

    // Pause when the hero is off-screen.
    if (supportsIO) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start(); else stop();
      }).observe(canvas);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (!running) draw();
      }, 150);
    });

    // Re-colour the network when the theme changes.
    document.addEventListener('themechange', () => {
      readColors();
      if (!running) draw();
    });

    // Cursor interaction (mouse / pen only).
    if (hero && window.matchMedia('(pointer: fine)').matches) {
      hero.addEventListener('pointermove', (event) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
      });
      hero.addEventListener('pointerleave', () => { pointer.active = false; });
    }
  }
  initNeuralCanvas();

  /* ------------------------------------------------------------
   * 14. DEVELOPER PROFILE CARD
   * A tiny TypeScript/JSON highlighter: the code stays plain text in
   * index.html (easy to edit, readable without JS) and is turned into
   * numbered, colour-coded lines here.
   * ---------------------------------------------------------- */
  function initProfileCode() {
    const codeEl = $('#profile-code');
    if (!codeEl) return;
    const pre = codeEl.closest('pre');

    const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Order matters: strings first, so nothing inside quotes gets re-coloured.
    const TOKEN = new RegExp([
      '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')',             // 1 string
      '\\b(const|let|var|export|default|return|true|false|null)\\b', // 2 keyword
      '([A-Za-z_$][\\w$]*)(?=\\s*:)',                                 // 3 property key
      '([A-Za-z_$][\\w$]*)',                                          // 4 identifier
      '(\\d+(?:\\.\\d+)?)',                                           // 5 number
      '(=>|[=|+])',                                                   // 6 operator
      '([{}[\\](),;:.])',                                             // 7 punctuation
    ].join('|'), 'g');
    const CLASSES = ['s', 'k', 'p', 'v', 'n', 'o', 'u'];

    const highlightLine = (text) => {
      let html = '';
      let last = 0;
      for (const match of text.matchAll(TOKEN)) {
        html += escapeHtml(text.slice(last, match.index));
        const group = match.slice(1).findIndex((g) => g !== undefined);
        html += `<span class="tk-${CLASSES[group]}">${escapeHtml(match[0])}</span>`;
        last = match.index + match[0].length;
      }
      return html + escapeHtml(text.slice(last));
    };

    const lines = codeEl.textContent.replace(/^\n+|\s+$/g, '').split('\n');

    codeEl.innerHTML = lines.map((line, n) => {
      const indent = line.match(/^ */)[0].length;
      const body = highlightLine(line.slice(indent)) || '​';
      return `<span class="cl" style="--i:${indent};--n:${n}">${body}</span>`;
    }).join('');

    // Blinking caret at the end of the last line.
    const lastLine = codeEl.lastElementChild;
    if (lastLine) lastLine.insertAdjacentHTML('beforeend', '<span class="code-cursor" aria-hidden="true"></span>');
    if (pre) pre.classList.add('is-highlighted');

    // Keep the status bar's "Ln, Col" in sync with the content.
    const pos = $('#code-pos');
    if (pos) pos.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
  }
  initProfileCode();

  /* ------------------------------------------------------------
   * 15. IMAGE VIEWER (LIGHTBOX), PROJECT GALLERIES & CERTIFICATES
   * Built on the native <dialog> element: it traps focus, closes on
   * Escape and returns focus to the button that opened it.
   * Extras: ←/→ keys, swipe, thumbnails, neighbour preloading.
   * ---------------------------------------------------------- */
  const lightbox = (() => {
    const dialog = $('#lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return null;

    const img = $('#lightbox-img');
    const caption = $('#lightbox-caption');
    const title = $('#lightbox-title');
    const count = $('#lightbox-count');
    const thumbs = $('#lightbox-thumbs');
    const stage = $('.lightbox-stage', dialog);
    let items = [];
    let index = 0;

    img.addEventListener('load', () => img.classList.remove('is-loading'));

    function render() {
      const item = items[index];
      if (img.getAttribute('src') !== item.src) img.classList.add('is-loading');
      img.src = item.src;
      img.alt = item.caption || title.textContent;

      // Caption: a main line plus an optional lighter "meta" line (e.g. issuer · date).
      caption.textContent = '';
      [['lightbox-caption-title', item.caption], ['lightbox-caption-meta', item.meta]].forEach(([cls, text]) => {
        if (!text) return;
        const line = document.createElement('span');
        line.className = cls;
        line.textContent = text;
        caption.append(line);
      });
      caption.hidden = !item.caption && !item.meta;
      count.textContent = `${index + 1} / ${items.length}`;

      Array.from(thumbs.children).forEach((thumb, i) => {
        thumb.setAttribute('aria-current', String(i === index));
        if (i === index) thumb.scrollIntoView({ block: 'nearest', inline: 'center' });
      });

      // Preload neighbours so next/previous feel instant.
      [index - 1, index + 1].forEach((i) => {
        const next = items[(i + items.length) % items.length];
        if (next) new Image().src = next.src;
      });
    }

    function go(step) {
      if (items.length < 2) return;
      index = (index + step + items.length) % items.length;
      render();
    }

    function buildThumbs() {
      thumbs.textContent = '';
      if (items.length < 2) return;
      items.forEach((item, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'lightbox-thumb';
        button.setAttribute('aria-label', `Show image ${i + 1} of ${items.length}`);
        const thumbImg = document.createElement('img');
        thumbImg.src = item.thumb || item.src;
        thumbImg.alt = '';
        thumbImg.loading = 'lazy';
        button.append(thumbImg);
        button.addEventListener('click', () => { index = i; render(); });
        thumbs.append(button);
      });
    }

    function open(list, start = 0, heading = '') {
      if (!list.length) return;
      items = list;
      index = Math.min(Math.max(start, 0), list.length - 1);
      title.textContent = heading;
      dialog.classList.toggle('is-single', items.length < 2);
      buildThumbs();
      dialog.showModal();
      document.body.classList.add('lightbox-open');
      render();
    }

    $('.lightbox-prev', dialog).addEventListener('click', () => go(-1));
    $('.lightbox-next', dialog).addEventListener('click', () => go(1));
    $$('[data-lightbox-close]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()));

    dialog.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
    });

    // Click on the empty area around the image closes the viewer.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog || event.target === stage || event.target.classList.contains('lightbox-inner')) {
        dialog.close();
      }
    });

    // Swipe left / right on touch screens.
    let startX = null;
    let startY = null;
    stage.addEventListener('pointerdown', (event) => { startX = event.clientX; startY = event.clientY; });
    stage.addEventListener('pointerup', (event) => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    });

    return { open };
  })();

  // Cloudinary: when an image URL points at res.cloudinary.com, insert a transformation so the
  // browser gets a resized, auto-format (WebP/AVIF) and auto-quality version. Other URLs pass through.
  const CLD_THUMB = 'c_fill,g_north,w_720,h_360,q_auto,f_auto';
  const CLD_FULL = 'c_limit,w_1800,q_auto,f_auto';
  const cloudinary = (url, transform) => (
    /res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)
      ? url.replace(/(\/image\/upload\/)/, `$1${transform}/`)
      : url
  );

  // Project screenshot galleries: <a data-gallery-open="name"> + <ul class="gallery-data" data-gallery="name">
  $$('[data-gallery-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const list = document.querySelector(`.gallery-data[data-gallery="${trigger.dataset.galleryOpen}"]`);
      if (!lightbox || !list) return;   // no JS viewer: the link opens the first image instead
      event.preventDefault();
      const items = $$('li', list).map((li) => ({
        src: cloudinary(li.dataset.src, CLD_FULL),
        thumb: li.dataset.thumb || cloudinary(li.dataset.src, 'c_fill,w_160,h_180,q_auto,f_auto'),
        caption: li.dataset.caption,
      }));
      lightbox.open(items, parseInt(trigger.dataset.galleryIndex || '0', 10), list.dataset.title || '');
    });
  });

  // Certificate images: cards with data-cert-img get a thumbnail once the image loads.
  function initCertificateImages() {
    const viewAll = $('#cert-view-all');
    const textOf = (card, selector) => {
      const el = $(selector, card);
      return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    };
    const certItems = () => $$('.cert-card.has-image').map((card) => ({
      card,
      src: cloudinary(card.dataset.certImg.trim(), CLD_FULL),
      thumb: cloudinary(card.dataset.certImg.trim(), 'c_fill,g_north,w_160,h_180,q_auto,f_auto'),
      caption: textOf(card, '.cert-title'),
      meta: [textOf(card, '.cert-issuer'), textOf(card, '.cert-date')].filter(Boolean).join(' · '),
    }));

    // "Show credential" links from data-cert-url.
    $$('.cert-card[data-cert-url]').forEach((card) => {
      const url = (card.dataset.certUrl || '').trim();
      if (!/^https?:\/\//i.test(url)) return;
      const link = document.createElement('a');
      link.className = 'cert-verify';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const label = (card.dataset.certLabel || '').trim() || 'Show credential';
      link.textContent = label;
      link.setAttribute('aria-label', `${label}: ${textOf(card, '.cert-title')} (opens in a new tab)`);
      link.insertAdjacentHTML('beforeend', ' <svg class="icon" aria-hidden="true"><use href="#i-external" /></svg>');
      card.append(link);
    });

    $$('.cert-card[data-cert-img]').forEach((card) => {
      const raw = (card.dataset.certImg || '').trim();
      if (!raw) return;
      const src = cloudinary(raw, CLD_THUMB);

      const probe = new Image();
      probe.onload = () => {
        const link = document.createElement('a');
        link.className = 'cert-media';
        link.href = cloudinary(raw, CLD_FULL);
        link.setAttribute('aria-label', `View certificate: ${textOf(card, '.cert-title')}`);
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = '';
        // Thumbnails show the whole certificate. For very tall images (e.g. a verification page),
        // data-cert-pos="center 15%" switches to a cropped view of that part instead.
        if (card.dataset.certPos) {
          thumb.style.objectFit = 'cover';
          thumb.style.objectPosition = card.dataset.certPos;
        }
        thumb.loading = 'lazy';
        thumb.decoding = 'async';
        link.append(thumb);
        link.insertAdjacentHTML('beforeend',
          '<span class="cert-zoom" aria-hidden="true"><svg class="icon"><use href="#i-zoom" /></svg></span>');
        card.prepend(link);
        card.classList.add('has-image');

        link.addEventListener('click', (event) => {
          if (!lightbox) return;
          event.preventDefault();
          const all = certItems();
          lightbox.open(all, all.findIndex((item) => item.card === card), 'Certificates');
        });
        if (viewAll) viewAll.hidden = false;
      };
      probe.src = src;
    });

    if (viewAll) {
      viewAll.addEventListener('click', () => {
        if (lightbox) lightbox.open(certItems(), 0, 'Certificates');
      });
    }
  }
  initCertificateImages();

  /* ------------------------------------------------------------
   * 16. FOOTER YEAR
   * ---------------------------------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
