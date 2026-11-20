const campoCpf = document.getElementById('cpf');
const campoSenha = document.getElementById('senha');
const formulario = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');
const botaoVerSenha = document.getElementById('btnVerSenha');

const botaoVoltar = document.getElementById('btnVoltar');

botaoVoltar.addEventListener('click', function () {
  window.location.href = '../index.html';
});

function marcarErro(campo, idErro, textoErro) {
  campo.classList.add('campo-erro');
  campo.setAttribute('aria-invalid', 'true');
  document.getElementById(idErro).textContent = textoErro;
}

function limparErro(campo, idErro) {
  campo.classList.remove('campo-erro');
  campo.setAttribute('aria-invalid', 'false');
  document.getElementById(idErro).textContent = '';
}

function normalizarCpf(cpf) {
  return cpf.replace(/\D/g, '');
}

function formatarCpf(valor) {
  const numeros = normalizarCpf(valor).slice(0, 11);
  let cpfFormatado = numeros;

  if (numeros.length > 3) {
    cpfFormatado = cpfFormatado.slice(0, 3) + '.' + cpfFormatado.slice(3);
  }

  if (numeros.length > 6) {
    cpfFormatado = cpfFormatado.slice(0, 7) + '.' + cpfFormatado.slice(7);
  }

  if (numeros.length > 9) {
    cpfFormatado = cpfFormatado.slice(0, 11) + '-' + cpfFormatado.slice(11);
  }

  return cpfFormatado;
}

function cpfEhValido(cpf) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  const primeiroDigito = resto === 10 ? 0 : resto;
  if (primeiroDigito !== Number(cpf[9])) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;
  const segundoDigito = resto === 10 ? 0 : resto;

  return segundoDigito === Number(cpf[10]);
}

function validarFormulario() {
  limparErro(campoCpf, 'erroCpf');
  limparErro(campoSenha, 'erroSenha');

  let valido = true;
  const cpfNumeros = normalizarCpf(campoCpf.value);
  const senhaDigitada = campoSenha.value;

  if (cpfNumeros === '') {
    marcarErro(campoCpf, 'erroCpf', 'Preencha o CPF.');
    valido = false;
  } else if (cpfNumeros.length !== 11 || !cpfEhValido(cpfNumeros)) {
    marcarErro(campoCpf, 'erroCpf', 'Digite um CPF válido.');
    valido = false;
  }

  if (senhaDigitada === '') {
    marcarErro(campoSenha, 'erroSenha', 'Preencha a senha.');
    valido = false;
  }

  return valido;
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo ? 'mensagem ' + tipo : 'mensagem';
}

/* =========================================
   ACESSIBILIDADE (FONTE E CONTRASTE)
   ========================================= */
let tamanhoFonte = 100;
const botaoContraste = document.getElementById('btnContraste');

function carregarPreferencias() {
  try {
    const fonteSalva = localStorage.getItem('tamanhoFonte');
    const contrasteSalvo = localStorage.getItem('contrasteAzul');

    if (fonteSalva !== null) {
      const fonteConvertida = Number(fonteSalva);
      if (
        Number.isInteger(fonteConvertida) &&
        fonteConvertida >= 80 &&
        fonteConvertida <= 140 &&
        fonteConvertida % 10 === 0
      ) {
        tamanhoFonte = fonteConvertida;
      }
    }

    if (contrasteSalvo === 'true') {
      document.body.classList.add('contraste-azul');
    }

    document.documentElement.style.fontSize = tamanhoFonte + '%';
    if (botaoContraste) {
      botaoContraste.setAttribute(
        'aria-pressed',
        String(document.body.classList.contains('contraste-azul'))
      );
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível carregar as preferências salvas.', 'erro');
  }
}

function salvarPreferencias() {
  try {
    localStorage.setItem('tamanhoFonte', String(tamanhoFonte));
    localStorage.setItem(
      'contrasteAzul',
      String(document.body.classList.contains('contraste-azul'))
    );
  } catch (erro) {
    mostrarMensagem('Não foi possível salvar as preferências.', 'erro');
  }
}

carregarPreferencias();

/* =========================================
   ENVIO E VALIDAÇÃO DO LOGIN
   ========================================= */
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  mostrarMensagem('', '');

  if (!validarFormulario()) {
    mostrarMensagem('Corrija os campos indicados.', 'erro');
    return;
  }

  let usuariosCadastrados = [];

  try {
    usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados')) || [];
  } catch (erro) {
    mostrarMensagem('Erro ao ler os usuários salvos no navegador.', 'erro');
    return;
  }

  if (usuariosCadastrados.length === 0) {
    mostrarMensagem('Nenhum usuário cadastrado. Faça seu cadastro primeiro.', 'erro');
    return;
  }

  const cpfDigitadoNumeros = normalizarCpf(campoCpf.value);
  const senhaDigitada = campoSenha.value;

  const usuarioEncontrado = usuariosCadastrados.find(function (usuario) {
    return (
      normalizarCpf(usuario.cpf || '') === cpfDigitadoNumeros &&
      usuario.senha === senhaDigitada
    );
  });

  if (!usuarioEncontrado) {
    mostrarMensagem('CPF ou senha incorretos.', 'erro');
    return;
  }

  try {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

    const destinoRedirecionamento = localStorage.getItem('idadePlus_redirect');
    localStorage.removeItem('idadePlus_redirect');

    if (destinoRedirecionamento === 'consultas') {
      window.location.href = '../Área do Cliente zip/dashboard.html';
    } else {
      window.location.href = '../agendar.html';
    }
  } catch (erro) {
    mostrarMensagem('Não foi possível iniciar sua sessão.', 'erro');
  }
});

/* =========================================
   EVENTOS DOS CAMPOS E BOTÕES
   ========================================= */
campoCpf.addEventListener('input', function () {
  campoCpf.value = formatarCpf(campoCpf.value);
  limparErro(campoCpf, 'erroCpf');
  mostrarMensagem('', '');
});

campoSenha.addEventListener('input', function () {
  limparErro(campoSenha, 'erroSenha');
  mostrarMensagem('', '');
});

botaoVerSenha.addEventListener('click', function () {
  if (campoSenha.type === 'password') {
    campoSenha.type = 'text';
    this.textContent = 'Ocultar senha';
    this.setAttribute('aria-pressed', 'true');
  } else {
    campoSenha.type = 'password';
    this.textContent = 'Mostrar senha';
    this.setAttribute('aria-pressed', 'false');
  }
});

document.getElementById('btnFonteMais').addEventListener('click', function () {
  if (tamanhoFonte < 140) {
    tamanhoFonte += 10;
    document.documentElement.style.fontSize = tamanhoFonte + '%';
    salvarPreferencias();
  }
});

document.getElementById('btnFonteMenos').addEventListener('click', function () {
  if (tamanhoFonte > 80) {
    tamanhoFonte -= 10;
    document.documentElement.style.fontSize = tamanhoFonte + '%';
    salvarPreferencias();
  }
});

botaoContraste.addEventListener('click', function () {
  const ativado = document.body.classList.toggle('contraste-azul');
  botaoContraste.setAttribute('aria-pressed', String(ativado));
  salvarPreferencias();
});