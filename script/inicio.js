
const menu = document.getElementById('itens');

function mudoutamanho() {
    if (window.innerWidth >= 768) {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
}

function clickmenu() {
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const modal = document.getElementById('modal-servico');
const mIcone = document.getElementById('modal-icone');
const mTitulo = document.getElementById('modal-titulo');
const mTexto = document.getElementById('modal-texto');

function abrirModal(card) {
    mIcone.textContent = card.dataset.icone;
    mTitulo.textContent = card.dataset.titulo;
    mTexto.textContent = card.dataset.texto;
    modal.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    modal.classList.remove('ativo');
    document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => abrirModal(card));
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            abrirModal(card);
        }
    });
});

document.getElementById('modal-x').addEventListener('click', fecharModal);
document.getElementById('modal-fechar').addEventListener('click', fecharModal);

modal.addEventListener('click', e => {
    if (e.target === modal) fecharModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
});



