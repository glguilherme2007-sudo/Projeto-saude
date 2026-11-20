document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const body = document.body;
    const header = document.querySelector("header");

    // --- CONTROLE DE FONTE (A+ / A-) E DARK MODE ---
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

    // --- SCROLL DO HEADER ---
    window.addEventListener("scroll", () => {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 40);
        }
    });

    // --- MODAL DE SERVIÇOS ---
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