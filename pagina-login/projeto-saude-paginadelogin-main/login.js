const campoCpf = document.getElementById('cpf');
const campoSenha = document.getElementById('senha');
const formulario = document.getElementById('formLogin');
const mensagem = document.getElementById('mensagem');
const botaoVerSenha = document.getElementById('btnVerSenha');

function marcarErro(campo, idErro, mensagem) {
  campo.classList.add('campo-erro');
  campo.setAttribute('aria-invalid', 'true');
  document.getElementById(idErro).textContent = mensagem;
}

function limparErro(campo, idErro) {
  campo.classList.remove('campo-erro');
  campo.setAttribute('aria-invalid', 'false');
  document.getElementById(idErro).textContent = '';
}

function validarFormulario() {
  limparErro(campoCpf, 'erroCpf');
  limparErro(campoSenha, 'erroSenha');

  let valido = true;
  const cpf = campoCpf.value.replace(/\D/g, '');
  const senha = campoSenha.value;

  if (cpf === '') {
    marcarErro(campoCpf, 'erroCpf', 'Preencha o CPF.');
    valido = false;
  } else if (cpf.length !== 11) {
    marcarErro(campoCpf, 'erroCpf', 'O CPF deve ter 11 números.');
    valido = false;
  } else if (!cpfEhValido(cpf)) {
    marcarErro(campoCpf, 'erroCpf', 'Digite um CPF válido.');
    valido = false;
  }

  if (senha === '') {
    marcarErro(campoSenha, 'erroSenha', 'Preencha a senha.');
    valido = false;
  } else if (!/^[A-Za-z]{8}$/.test(senha)) {
    marcarErro(campoSenha, 'erroSenha', 'A senha tem exatamente 8 letras.');
    valido = false;
  }

  return valido;
}

function formatarCpf(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 11);
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

function normalizarCpf(cpf) {
  return cpf.replace(/\D/g, '');
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = 'mensagem ' + tipo;
}

let tamanhoFonte = 100;
const botaoContraste = document.getElementById('btnContraste');

function carregarPreferencias() {
  try {
    const fonteSalva = localStorage.getItem('tamanhoFonte');
    const contrasteSalvo = localStorage.getItem('contrasteAzul');

    if (fonteSalva !== null) {
      const fonteConvertida = Number(fonteSalva);

      if (Number.isInteger(fonteConvertida) && fonteConvertida >= 80 &&
          fonteConvertida <= 140 && fonteConvertida % 10 === 0) {
        tamanhoFonte = fonteConvertida;
      } else {
        mostrarMensagem('O tamanho de fonte salvo é inválido. Usando o tamanho padrão.', 'erro');
      }
    }

    if (contrasteSalvo === 'true') {
      document.body.classList.add('contraste-azul');
    } else if (contrasteSalvo !== null && contrasteSalvo !== 'false') {
      mostrarMensagem('A preferência de contraste salva é inválida.', 'erro');
    }

    document.documentElement.style.fontSize = tamanhoFonte + '%';
    botaoContraste.setAttribute(
      'aria-pressed',
      String(document.body.classList.contains('contraste-azul'))
    );
  } catch (erro) {
    mostrarMensagem('Não foi possível carregar as preferências salvas neste navegador.', 'erro');
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
    mostrarMensagem('Não foi possível salvar as preferências neste navegador.', 'erro');
  }
}

carregarPreferencias();

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  mostrarMensagem('', '');

  if (!validarFormulario()) {
    mostrarMensagem('Corrija os campos indicados.', 'erro');
    return;
  }

  let cadastro;

  try {
    const dadosSalvos = localStorage.getItem('usuarioCadastrado');

    if (dadosSalvos === null) {
      mostrarMensagem('Nenhum usuário cadastrado. Faça seu cadastro primeiro.', 'erro');
      return;
    }

    cadastro = JSON.parse(dadosSalvos);
  } catch (erro) {
    mostrarMensagem('Não foi possível acessar os dados salvos neste navegador.', 'erro');
    return;
  }

  if (cadastro === null || typeof cadastro !== 'object' ||
      typeof cadastro.cpf !== 'string' || typeof cadastro.senha !== 'string') {
    mostrarMensagem('Os dados do usuário salvos são inválidos. Faça o cadastro novamente.', 'erro');
    return;
  }

  const cpf = normalizarCpf(campoCpf.value);

  if (normalizarCpf(cadastro.cpf) !== cpf || cadastro.senha !== campoSenha.value) {
    mostrarMensagem('CPF ou senha incorretos.', 'erro');
    return;
  }

  const usuariosSalvos = JSON.parse(localStorage.getItem('chaveCadastro')) || [];

  const usuarioEncontrado = usuariosSalvos.find(usuario =>
    usuario.cpf === campoCpf.value

  );

  if (!usuarioEncontrado){
    mostrarMensagem('CPF não encontrado ou dados incorretos.', 'erro');
    return;
  }

  try {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
    window.location.href = 'agendar.html';
  } catch (erro) {
    mostrarMensagem('Não foi possível salvar seu acesso neste navegador.', 'erro');
    return;
  }

});

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
