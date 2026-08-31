document.addEventListener("DOMContentLoaded", () => {

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ano no rodapé */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header muda de aparência ao rolar */
  const header = document.querySelector(".site-header");
  const onHeaderScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onHeaderScroll();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });

  /* Menu mobile */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  const closeMobileNav = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.classList.toggle("is-open", !isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* Fecha o menu mobile ao aumentar a tela */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMobileNav();
  });

  /* ===================== Paralaxe do conteúdo do banner ===================== */
  const heroContent = document.querySelector(".hero-content");
  const heroSection = document.querySelector(".hero");

  if (heroContent && heroSection && !reduceMotion) {
    let ticking = false;

    const updateHeroParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        heroContent.style.transform = `translate3d(0, ${progress * 60}px, 0)`;
        heroContent.style.opacity = String(1 - progress * 0.85);
      }
      ticking = false;
    };

    const requestHeroParallax = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    };

    updateHeroParallax();
    window.addEventListener("scroll", requestHeroParallax, { passive: true });
    window.addEventListener("resize", requestHeroParallax);
  }

  /* ===================== Fundo estrelado do banner (glow + partículas) ===================== */
  const heroCanvas = document.getElementById("heroBgCanvas");

  if (heroCanvas) {
    const ctx = heroCanvas.getContext("2d");
    let width, height, dpr, particles, frame;

    const makeParticle = () => ({
      x: Math.random() * width,
      y: height + Math.random() * height * 0.3,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.32 + 0.08,
      drift: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = heroCanvas.clientWidth;
      height = heroCanvas.clientHeight;
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const count = Math.min(Math.round((width * height) / 15000), 130);
      particles = Array.from({ length: count }, makeParticle);
    };

    const drawStatic = () => {
      // quadro único para quem prefere menos movimento
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(247, 218, 89, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.twinkle += 0.02;
        if (p.y < -10) Object.assign(p, makeParticle(), { y: height + 10 });

        const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.beginPath();
        ctx.fillStyle = `rgba(247, 218, 89, ${twinkleAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    resize();
    initParticles();

    if (reduceMotion) {
      drawStatic();
    } else {
      draw();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
        } else {
          frame = requestAnimationFrame(draw);
        }
      });
    }

    window.addEventListener("resize", () => {
      resize();
      initParticles();
      if (reduceMotion) drawStatic();
    });
  }

  /* ===================== Revelação de seções ao rolar ===================== */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      // pequeno atraso escalonado para os cards de serviço
      let serviceIndex = 0;
      revealEls.forEach((el) => {
        if (el.classList.contains("service-card")) {
          el.style.setProperty("--reveal-index", serviceIndex++);
        }
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );

      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ===================== Navegação: link ativo conforme a seção ===================== */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* Formulário de contato (demonstração — sem backend configurado) */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = "Preencha os campos obrigatórios antes de enviar.";
        return;
      }

      const nome = form.nome.value.trim();
      status.textContent = `Obrigada, ${nome.split(" ")[0]}. Sua mensagem foi preparada — conecte este formulário a um serviço de envio (ex.: e-mail ou Formspree) para concluir o envio.`;
      form.reset();
    });
  }

});
