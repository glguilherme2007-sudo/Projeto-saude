document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;
    const header = document.querySelector("header");

    /* =====================================
       1. ACESSIBILIDADE (FONTE E TEMA)
    ===================================== */
    const btnAumentar = document.getElementById("btn-aumentar");
    const btnDiminuir = document.getElementById("btn-diminuir");
    const btnTema = document.getElementById("btn-tema");

    const FONTE_PADRAO = 16;
    const FONTE_MIN = 14;
    const FONTE_MAX = 22;
    const PASSO = 2;

    let tamanhoAtual = parseInt(localStorage.getItem("idadePlus_fonte"), 10) || FONTE_PADRAO;
    html.style.fontSize = `${tamanhoAtual}px`;

    if (localStorage.getItem("idadePlus_tema") === "dark") {
        body.classList.add("dark-mode");
    }

    if (btnAumentar) {
        btnAumentar.addEventListener("click", () => {
            if (tamanhoAtual < FONTE_MAX) {
                tamanhoAtual += PASSO;
                html.style.fontSize = `${tamanhoAtual}px`;
                localStorage.setItem("idadePlus_fonte", tamanhoAtual);
            }
        });
    }

    if (btnDiminuir) {
        btnDiminuir.addEventListener("click", () => {
            if (tamanhoAtual > FONTE_MIN) {
                tamanhoAtual -= PASSO;
                html.style.fontSize = `${tamanhoAtual}px`;
                localStorage.setItem("idadePlus_fonte", tamanhoAtual);
            }
        });
    }

    if (btnTema) {
        btnTema.addEventListener("click", () => {
            body.classList.toggle("dark-mode");
            localStorage.setItem("idadePlus_tema", body.classList.contains("dark-mode") ? "dark" : "light");
        });
    }

    /* =====================================
       2. NAVEGAÇÃO PARA "VER MINHAS CONSULTAS"
    ===================================== */
    const btnMinhasConsultas = document.getElementById("btn-minhas-consultas");
    const ROTA_DASHBOARD_CONSULTAS = "Área do Cliente zip/dashboard.html";
    const ROTA_LOGIN = "../pagina-login/login.html";

    function usuarioEstaLogado() {
        const sessaoRaw = localStorage.getItem("idadePlus_usuario") || localStorage.getItem("usuarioLogado");
        if (!sessaoRaw) return false;

        try {
            const sessao = JSON.parse(sessaoRaw);
            return Boolean(sessao === true || sessao?.logado || sessao?.email || sessao?.cpf);
        } catch {
            return sessaoRaw === "true" || sessaoRaw.trim().length > 0;
        }
    }

    function irParaMinhasConsultas() {
        if (usuarioEstaLogado()) {
            localStorage.removeItem("idadePlus_redirect");
            window.location.href = ROTA_DASHBOARD_CONSULTAS;
        } else {
            localStorage.setItem("idadePlus_redirect", "consultas");
            window.location.href = ROTA_LOGIN;
        }
    }

    if (btnMinhasConsultas) {
        btnMinhasConsultas.addEventListener("click", (e) => {
            e.preventDefault();
            irParaMinhasConsultas();
        });
    }

    /* =====================================
       3. MENU MOBILE (#burguer + nav#itens)
    ===================================== */
    const btnBurguer = document.getElementById("burguer");
    const navItens = document.getElementById("itens");

    function fecharMenuMobile() {
        if (navItens) {
            navItens.classList.remove("aberto", "ativo");
        }
        if (btnBurguer) {
            btnBurguer.classList.remove("aberto", "ativo");
            btnBurguer.setAttribute("aria-expanded", "false");
        }
    }

    if (navItens && !document.getElementById("btn-minhas-consultas-menu")) {
        const linkMinhasConsultasMenu = document.createElement("a");
        linkMinhasConsultasMenu.href = "#";
        linkMinhasConsultasMenu.id = "btn-minhas-consultas-menu";
        linkMinhasConsultasMenu.className = "link-nav link-nav-consultas";
        linkMinhasConsultasMenu.textContent = "Ver minhas consultas";

        linkMinhasConsultasMenu.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            fecharMenuMobile();
            irParaMinhasConsultas();
        });

        navItens.appendChild(linkMinhasConsultasMenu);
    }

    if (btnBurguer && navItens) {
        btnBurguer.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const estaAberto = navItens.classList.toggle("aberto");
            navItens.classList.toggle("ativo", estaAberto);
            btnBurguer.classList.toggle("aberto", estaAberto);
            btnBurguer.setAttribute("aria-expanded", String(estaAberto));
        });

        navItens.querySelectorAll("a").forEach((link) => {
            if (link.id === "btn-minhas-consultas-menu") return;
            link.addEventListener("click", () => {
                fecharMenuMobile();
            });
        });

        document.addEventListener("click", (e) => {
            if (!navItens.contains(e.target) && !btnBurguer.contains(e.target)) {
                fecharMenuMobile();
            }
        });
    }

    /* =====================================
       4. HEADER AO ROLAR A PÁGINA
    ===================================== */
    window.addEventListener("scroll", () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }
    });

    /* =====================================
       5. MODAL DE SERVIÇOS
    ===================================== */
    const modal = document.getElementById("modal-servico");
    const modalX = document.getElementById("modal-x");
    const modalFechar = document.getElementById("modal-fechar");
    const modalIcone = document.getElementById("modal-icone");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalTexto = document.getElementById("modal-texto");

    function abrirModal(card) {
        if (!modal) return;
        modalIcone.textContent = card.dataset.icone || "medical_services";
        modalTitulo.textContent = card.dataset.titulo || "";
        modalTexto.textContent = card.dataset.texto || "";
        modal.classList.add("ativo");
    }

    function fecharModal() {
        if (!modal) return;
        modal.classList.remove("ativo");
    }

    document.querySelectorAll("#cardc .card").forEach((card) => {
        card.addEventListener("click", () => abrirModal(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                abrirModal(card);
            }
        });
    });

    if (modalX) modalX.addEventListener("click", fecharModal);
    if (modalFechar) modalFechar.addEventListener("click", fecharModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) fecharModal();
        });
    }
});