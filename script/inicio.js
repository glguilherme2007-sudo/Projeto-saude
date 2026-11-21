(function () {
    function obterElementosMenu() {
        return {
            btnBurguer: document.getElementById("burguer"),
            navItens: document.getElementById("itens")
        };
    }

    function fecharMenuMobile() {
        const { btnBurguer, navItens } = obterElementosMenu();
        if (navItens) {
            navItens.classList.remove("aberto", "ativo");
            navItens.style.display = "";
        }
        if (btnBurguer) {
            btnBurguer.classList.remove("aberto", "ativo");
            btnBurguer.setAttribute("aria-expanded", "false");
        }
    }

    function atualizarVisibilidadeConsultaMobile(irParaMinhasConsultas) {
        const { navItens } = obterElementosMenu();
        if (!navItens) return;

        const itemMobileExistente = document.getElementById("btn-minhas-consultas-menu");
        const ehMobile = window.innerWidth <= 1000;

        if (ehMobile && !itemMobileExistente) {
            const linkMinhasConsultasMenu = document.createElement("a");
            linkMinhasConsultasMenu.href = "#";
            linkMinhasConsultasMenu.id = "btn-minhas-consultas-menu";
            linkMinhasConsultasMenu.className = "link-nav link-nav-consultas";
            linkMinhasConsultasMenu.textContent = "Minhas consultas";

            linkMinhasConsultasMenu.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                fecharMenuMobile();
                if (typeof irParaMinhasConsultas === "function") {
                    irParaMinhasConsultas();
                } else {
                    window.location.href = "Área do Cliente zip/dashboard.html";
                }
            });

            navItens.appendChild(linkMinhasConsultasMenu);
        } else if (!ehMobile && itemMobileExistente) {
            itemMobileExistente.remove();
        }
    }

    window.clickmenu = function (e) {
        if (e && typeof e.preventDefault === "function") {
            e.preventDefault();
        }
        if (e && typeof e.stopPropagation === "function") {
            e.stopPropagation();
        }

        const { btnBurguer, navItens } = obterElementosMenu();
        if (!navItens) return;

        atualizarVisibilidadeConsultaMobile(window.__idadePlusIrParaConsultas);
        const estaAberto = !navItens.classList.contains("aberto");

        navItens.classList.toggle("aberto", estaAberto);
        navItens.classList.toggle("ativo", estaAberto);
        navItens.style.display = estaAberto ? "flex" : "";

        if (btnBurguer) {
            btnBurguer.classList.toggle("aberto", estaAberto);
            btnBurguer.setAttribute("aria-expanded", String(estaAberto));
        }
    };

    window.mudoutamanho = function () {
        if (window.innerWidth > 1000) {
            fecharMenuMobile();
        }
        atualizarVisibilidadeConsultaMobile(window.__idadePlusIrParaConsultas);
    };

    document.addEventListener("DOMContentLoaded", () => {
        const html = document.documentElement;
        const body = document.body;
        const header = document.querySelector("header");

       
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

        window.__idadePlusIrParaConsultas = irParaMinhasConsultas;

        if (btnMinhasConsultas) {
            btnMinhasConsultas.addEventListener("click", (e) => {
                e.preventDefault();
                irParaMinhasConsultas();
            });
        }

       
        const { btnBurguer, navItens } = obterElementosMenu();
        atualizarVisibilidadeConsultaMobile(irParaMinhasConsultas);

        if (navItens) {
            navItens.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", () => {
                    if (link.id !== "btn-minhas-consultas-menu") {
                        fecharMenuMobile();
                    }
                });
            });
        }

        document.addEventListener("click", (e) => {
            if (!navItens || !btnBurguer) return;
            const clicouDentro = navItens.contains(e.target);
            const clicouNoBotao = btnBurguer.contains(e.target);
            if (!clicouDentro && !clicouNoBotao && navItens.classList.contains("aberto")) {
                fecharMenuMobile();
            }
        });

        window.addEventListener("scroll", () => {
            if (header) {
                header.classList.toggle("scrolled", window.scrollY > 40);
            }
        });

       
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

    window.addEventListener("resize", window.mudoutamanho);
})();