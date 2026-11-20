/* =========================================
   1. SELECIONAR ELEMENTOS DO HTML
========================================= */

const cpf = document.querySelector("#cpf");
const telefone = document.querySelector("#telefone");
const telefoneFixo = document.querySelector("#telefone-fixo");
const cep = document.querySelector("#cep");

const senha = document.querySelector("#senha");
const confirmeSenha = document.querySelector("#confirmesenha");

const formulario = document.querySelector("#formulario-cadastro");
const mensagem = document.querySelector("#mensagem");


/* =========================================
   2. MÁSCARA DE CPF
========================================= */

cpf.addEventListener("input", function () {
    // Mantém somente os números e limita a 11 dígitos.
    const numeros = cpf.value.replace(/\D/g, "").slice(0, 11);

    let valorFormatado = numeros;

    if (numeros.length > 9) {
        valorFormatado =
            numeros.slice(0, 3) + "." +
            numeros.slice(3, 6) + "." +
            numeros.slice(6, 9) + "-" +
            numeros.slice(9, 11);
    } else if (numeros.length > 6) {
        valorFormatado =
            numeros.slice(0, 3) + "." +
            numeros.slice(3, 6) + "." +
            numeros.slice(6);
    } else if (numeros.length > 3) {
        valorFormatado =
            numeros.slice(0, 3) + "." +
            numeros.slice(3);
    }

    cpf.value = valorFormatado;

    // Limpa eventual erro anterior para permitir nova validação.
    cpf.setCustomValidity("");
});


/* =========================================
   3. MÁSCARA DE TELEFONE
========================================= */

telefone.addEventListener("input", function () {
    // Mantém somente os números e limita a 11 dígitos.
    const numeros = telefone.value.replace(/\D/g, "").slice(0, 11);

    let valorFormatado = numeros;

    if (numeros.length > 2) {
        const ddd = numeros.slice(0, 2);
        const numero = numeros.slice(2);

        if (numeros.length > 10) {
            // Celular: (00) 00000-0000
            valorFormatado = "(" + ddd + ") " +
                numero.slice(0, 5);

            if (numero.length > 5) {
                valorFormatado += "-" + numero.slice(5);
            }
        } else {
            // Telefone fixo: (00) 0000-0000
            valorFormatado = "(" + ddd + ") " +
                numero.slice(0, 4);

            if (numero.length > 4) {
                valorFormatado += "-" + numero.slice(4);
            }
        }
    }

    telefone.value = valorFormatado;
});


/* =========================================
   4. MÁSCARA DE TELEFONE FIXO
========================================= */

telefoneFixo.addEventListener("input", function () {
    // Mantém somente números e limita a 10 dígitos (DDD + telefone).
    const numeros = telefoneFixo.value.replace(/\D/g, "").slice(0, 10);
    let valorFormatado = numeros;

    if (numeros.length > 2) {
        valorFormatado = "(" + numeros.slice(0, 2) + ") " +
            numeros.slice(2, 6);

        if (numeros.length > 6) {
            valorFormatado += "-" + numeros.slice(6);
        }
    }

    telefoneFixo.value = valorFormatado;
});


/* =========================================
   5. MÁSCARA DE CEP
========================================= */

cep.addEventListener("input", function () {
    // Mantém somente números e limita a 8 dígitos.
    const numeros = cep.value.replace(/\D/g, "").slice(0, 8);

    if (numeros.length > 5) {
        cep.value = numeros.slice(0, 5) + "-" + numeros.slice(5);
    } else {
        cep.value = numeros;
    }
});


/* =========================================
   6. FUNÇÃO PARA VALIDAR CPF
========================================= */

function validarCPF(valor) {
    // Remove pontos, traços e outros caracteres.
    const numeros = valor.replace(/\D/g, "");

    // CPF precisa ter 11 dígitos.
    if (numeros.length !== 11) {
        return false;
    }

    // Rejeita sequências com todos os dígitos iguais.
    if (/^(\d)\1{10}$/.test(numeros)) {
        return false;
    }

    // Calcula o primeiro dígito verificador.
    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(numeros[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(numeros[9])) {
        return false;
    }

    // Calcula o segundo dígito verificador.
    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(numeros[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(numeros[10])) {
        return false;
    }

    return true;
}


/* =========================================
   7. CONFIRMAR SE AS SENHAS SÃO IGUAIS
========================================= */

function validarSenha() {
    // Se a confirmação estiver vazia, deixa o required agir.
    if (confirmeSenha.value === "") {
        confirmeSenha.setCustomValidity("");
        return;
    }

    if (senha.value !== confirmeSenha.value) {
        confirmeSenha.setCustomValidity("As senhas não são iguais!");
    } else {
        confirmeSenha.setCustomValidity("");
    }
}

// Revalida quando qualquer uma das senhas é alterada.
senha.addEventListener("input", validarSenha);
confirmeSenha.addEventListener("input", validarSenha);


/* =========================================
   8. MOSTRAR E OCULTAR SENHA
========================================= */

const botoesSenha = document.querySelectorAll(".mostrar-senha");

botoesSenha.forEach(function (botao) {
    botao.addEventListener("click", function () {
        // Descobre qual campo este botão controla.
        const campo = document.getElementById(botao.dataset.target);

        if (campo.type === "password") {
            campo.type = "text";
            botao.textContent = "Ocultar senha";
            botao.setAttribute("aria-pressed", "true");
        } else {
            campo.type = "password";
            botao.textContent = "Mostrar senha";
            botao.setAttribute("aria-pressed", "false");
        }
    });
});


/* =========================================
   9. VALIDAR O FORMULÁRIO NO ENVIO
========================================= */

formulario.addEventListener("submit", function (evento) {
    // Impede o envio enquanto fazemos as validações.
    evento.preventDefault();

    // Limpa mensagens antigas.
    mensagem.textContent = "";
    cpf.setCustomValidity("");

    // Confere se as senhas são iguais.
    validarSenha();

    // Confere se o CPF passou na validação matemática.
    if (!validarCPF(cpf.value)) {
        cpf.setCustomValidity("Digite um CPF válido.");
    }

    // Mostra os erros nativos do navegador, se existirem.
    if (!formulario.reportValidity()) {
        return;
    }

    // Salva este usuário junto com os cadastros anteriores.
    salvarCadastro();

    mensagem.textContent =
        "Cadastro salvo neste navegador com sucesso!";
    mensagem.style.color = "green";
});


/* =========================================
   10. LIMPAR MENSAGEM QUANDO O USUÁRIO EDITAR
========================================= */

formulario.addEventListener("input", function () {
    mensagem.textContent = "";
});





/* =========================================
   11. LOCALSTORAGE - SALVAR VÁRIOS USUÁRIOS
========================================= */

// Chave que identifica a lista de usuários no navegador.
const chaveCadastro = "usuariosCadastrados";

function salvarCadastro() {
    // Verifica qual gênero foi selecionado.
    const generoSelecionado =
        formulario.querySelector('input[name="genero"]:checked');

    // Organiza os dados não sensíveis deste usuário.
    const dadosCadastro = {
        nome: document.querySelector("#nome").value,
        nascimento: document.querySelector("#nascimento").value,
        email: document.querySelector("#email").value,
        telefone: telefone.value,
        telefoneFixo: telefoneFixo.value,
        cep: cep.value,
        endereco: document.querySelector("#rua").value,
        numero: document.querySelector("#numero").value,
        complemento: document.querySelector("#complemento").value,
        bairro: document.querySelector("#bairro").value,
        cidade: document.querySelector("#cidade").value,
        genero: generoSelecionado ? generoSelecionado.value : "",
        
        
        // Não armazenamos CPF, senha ou confirmação de senha.
        cpf: document.querySelector("#cpf").value,    
        senha: document.querySelector("#senha").value,
        confirmesenha: document.querySelector("#confirmesenha").value
        

        
    };

  // 1. Recupera a lista existente ou cria um array vazio
    const usuariosSalvos = JSON.parse(localStorage.getItem(chaveCadastro)) || [];

    // 2. Adiciona o novo usuário na lista
    usuariosSalvos.push(dadosCadastro);

    // 3. Salva a lista completa atualizada no localStorage
    localStorage.setItem(chaveCadastro, JSON.stringify(usuariosSalvos));

    // 4. Já salva esse novo usuário como o "usuário logado" atual (auto-login)
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosCadastro));

    window.location.href = '/pagina-login/login.html';
}

/* =========================================
   12. ACESSIBILIDADE - CONTROLE DE ZOOM
========================================= */

// Seleciona os botões do HTML.
const aumentarZoom = document.querySelector("#aumentarZoom");
const diminuirZoom = document.querySelector("#diminuirZoom");
const resetarZoom = document.querySelector("#resetarZoom");

// Seleciona o local da porcentagem.
const valorZoom = document.querySelector("#valorZoom");

// Zoom inicial.
let zoomAtual = 100;

// Limites do zoom.
const zoomMinimo = 80;
const zoomMaximo = 150;


// Atualiza o zoom da página.
function atualizarZoom() {

    document.documentElement.style.zoom = zoomAtual + "%";

    valorZoom.textContent = zoomAtual + "%";

}


// Aumentar o zoom.
aumentarZoom.addEventListener("click", function () {

    if (zoomAtual < zoomMaximo) {

        zoomAtual += 10;

        atualizarZoom();

    }

});


// Diminuir o zoom.
diminuirZoom.addEventListener("click", function () {

    if (zoomAtual > zoomMinimo) {

        zoomAtual -= 10;

        atualizarZoom();

    }

});


// Restaurar o tamanho original.
resetarZoom.addEventListener("click", function () {

    zoomAtual = 100;

    atualizarZoom();

});