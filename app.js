/* ==========================================================================
   FoxAI Browser — app.js
   Framer Motion (standalone) spring animations, button press, accordion,
   reduced-motion respected. CDN fallback.
   ========================================================================== */

(() => {
  'use strict';

  // =========================================================================
  // REDUCED MOTION DETECTION
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceMotion = prefersReducedMotion;

  // Expose for CSS (already handled via @media, but useful for JS)
  document.documentElement.dataset.reducedMotion = reduceMotion ? 'true' : 'false';

  // =========================================================================
  // FRAMER MOTION LOAD (CDN fallback)
  // =========================================================================
  let Motion = null;
  let animate = null;

  async function loadFramerMotion() {
    if (typeof window.Motion !== 'undefined') {
      Motion = window.Motion;
      animate = Motion.animate;
      return true;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/framer-motion@11/dist/framer-motion.min.js';
      script.async = true;
      script.onload = () => {
        Motion = window.Motion;
        animate = Motion.animate;
        initAnimations();
      };
      script.onerror = () => {
        console.warn('[FoxAI] Framer Motion CDN failed, using CSS-only fallbacks');
        initAnimations();
      };
      document.head.appendChild(script);
      // Wait for load
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!Motion) throw new Error('Timeout');
      return true;
    } catch (e) {
      console.warn('[FoxAI] Framer Motion unavailable:', e.message);
      return false;
    }
  }

  // =========================================================================
  // ANIMATION HELPERS (Apple Design: damping 1.0, response ~0.35s)
  // =========================================================================
  const springConfig = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 1
  };

  const springConfigFast = {
    type: 'spring',
    stiffness: 500,
    damping: 35,
    mass: 0.8
  };

  function animateEl(element, keyframes, options = {}) {
    if (reduceMotion || !animate) {
      // Instant apply final state
      Object.assign(element.style, keyframes);
      return Promise.resolve();
    }
    return animate(element, keyframes, { ...springConfig, ...options }).finished;
  }

  // =========================================================================
  // PAGE LOAD: opacity 0→1 + translateY 20→0 on .page
  // =========================================================================
  function initPageLoad() {
    const page = document.querySelector('.page');
    if (!page) return;

    // Force reflow then add is-loaded
    requestAnimationFrame(() => {
      page.offsetHeight; // reflow
      page.classList.add('is-loaded');
    });
  }

  // =========================================================================
  // BUTTON PRESS: scale(0.97) on pointerdown, spring back
  // =========================================================================
  function initButtonPress() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
      let pressAnimation = null;

      const onPress = () => {
        if (reduceMotion) {
          btn.style.transform = 'scale(0.98)';
          return;
        }
        if (pressAnimation) pressAnimation.cancel();
        pressAnimation = animate(btn, { scale: 0.97 }, { ...springConfigFast, duration: 0.1 });
      };

      const onRelease = () => {
        if (reduceMotion) {
          btn.style.transform = '';
          return;
        }
        if (pressAnimation) pressAnimation.cancel();
        animate(btn, { scale: 1 }, springConfig);
      };

      // Pointer events for 1:1 tracking (Apple Design: direct manipulation)
      btn.addEventListener('pointerdown', onPress);
      btn.addEventListener('pointerup', onRelease);
      btn.addEventListener('pointerleave', onRelease);
      btn.addEventListener('pointercancel', onRelease);

      // Keyboard accessibility
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onPress();
        }
      });
      btn.addEventListener('keyup', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          onRelease();
        }
      });
    });
  }

  // =========================================================================
  // ACCORDION ENHANCEMENT: spring open/close (native <details> handles base)
  // =========================================================================
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(item => {
      const summary = item.querySelector('.accordion-summary');
      const content = item.querySelector('.accordion-content');

      if (!summary || !content) return;

      // Height auto animation via Framer Motion
      let heightAnimation = null;

      const toggle = () => {
        const isOpen = item.open;

        if (reduceMotion) return; // CSS handles instant

        if (isOpen) {
          // Animate height from 0 to auto
          content.style.height = 'auto';
          const autoHeight = content.offsetHeight;
          content.style.height = '0px';

          if (heightAnimation) heightAnimation.cancel();
          heightAnimation = animate(content, { height: [0, autoHeight] }, springConfig);
          heightAnimation.finished.then(() => {
            content.style.height = 'auto';
          });
        } else {
          // Animate height from current to 0
          const currentHeight = content.offsetHeight;
          content.style.height = `${currentHeight}px`;

          // Force reflow
          content.offsetHeight;

          if (heightAnimation) heightAnimation.cancel();
          heightAnimation = animate(content, { height: 0 }, springConfig);
          heightAnimation.finished.then(() => {
            content.style.height = '';
          });
        }
      };

      summary.addEventListener('click', (e) => {
        // Let native <details> handle open/close, we just animate
        // Prevent double-toggle
        e.preventDefault();
        item.open = !item.open;
        toggle();
      });

      // Keyboard support
      summary.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          item.open = !item.open;
          toggle();
        }
      });
    });
  }

  // =========================================================================
  // SCROLL REVEAL — DISABLED per spec (no stagger, no parallax)
  // Kept as no-op for future if spec changes
  // =========================================================================
  function initScrollReveal() {
    // Intentionally empty — no scroll-triggered animations per design brief
    // "NO: stagger, parallax, scroll-reveal, hover lift, breathing, ambient"
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  async function init() {
    // Page load animation (CSS-driven, no JS needed beyond class toggle)
    initPageLoad();

    // Button press animations
    initButtonPress();

    // Accordion enhancements
    initAccordions();

    // Scroll reveal (no-op)
    initScrollReveal();

    // Load Framer Motion for spring animations
    await loadFramerMotion();

    console.log('[FoxAI] Landing page initialized', { reduceMotion });
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();