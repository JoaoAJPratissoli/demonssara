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