document.addEventListener("DOMContentLoaded", () => {

  /* Ano no rodapé */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header muda de aparência ao rolar */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  /* Capa (cover) — some suavemente ao rolar a tela */
  const cover = document.getElementById("siteCover");
  if (cover) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const threshold = 8; // px de rolagem para começar a sumir
    let hideTimeout;

    const updateCover = () => {
      const shouldFade = window.scrollY > threshold;
      cover.classList.toggle("is-fading", shouldFade);

      clearTimeout(hideTimeout);
      if (shouldFade) {
        hideTimeout = setTimeout(() => cover.classList.add("is-hidden"), reduceMotion ? 0 : 650);
      } else {
        cover.classList.remove("is-hidden");
      }
    };

    updateCover();
    window.addEventListener("scroll", updateCover, { passive: true });

    /* Efeito "flare" — partículas douradas + glow pulsante */
    const canvas = document.getElementById("coverCanvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
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
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const initParticles = () => {
        const count = Math.min(Math.round((width * height) / 15000), 130);
        particles = Array.from({ length: count }, makeParticle);
      };

      const draw = () => {
        ctx.clearRect(0, 0, width, height);

        const glowX = width / 2;
        const glowY = height * 0.4;
        const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.55);
        glow.addColorStop(0, "rgba(242, 200, 50, 0.22)");
        glow.addColorStop(0.5, "rgba(2, 16, 86, 0.10)");
        glow.addColorStop(1, "rgba(0, 0, 38, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

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

        if (!reduceMotion) frame = requestAnimationFrame(draw);
      };

      resize();
      initParticles();
      draw();

      window.addEventListener("resize", () => {
        resize();
        initParticles();
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(frame);
        } else if (!reduceMotion) {
          frame = requestAnimationFrame(draw);
        }
      });
    }
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