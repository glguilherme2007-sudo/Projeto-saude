const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

if (!usuarioLogado){
    window.location.href = "../login.html";
}



const consultasIniciais = [

    {
        id: 1,
        especialidade: "Cardiologia",
        medico: "Dr. Carlos Mendes • CRM 12345",
        data: "2026-11-18",
        horario: "14:30",
        local: "Unidade Centro — Sala 204",
        status: "pendente"
    },

    {
        id: 2,
        especialidade: "Oftalmologia",
        medico: "Dra. Helena Costa • CRM 67890",
        data: "2026-11-25",
        horario: "09:00",
        local: "Clínica Boa Vista — 1º Andar",
        status: "confirmada"
    },

    {
        id: 3,
        especialidade: "Dermatologia",
        medico: "Dr. Paulo Mendes • CRM 45678",
        data: "2026-12-02",
        horario: "10:00",
        local: "Unidade Centro — Sala 105",
        status: "confirmada"
    },

    {
        id: 4,
        especialidade: "Clínica Geral",
        medico: "Dra. Ana Souza • CRM 34567",
        data: "2026-11-10",
        horario: "08:30",
        local: "Clínica Central",
        status: "realizada"
    },

    {
        id: 5,
        especialidade: "Nutrição",
        medico: "Dra. Maria Lima • CRN 12345",
        data: "2026-11-05",
        horario: "11:00",
        local: "Unidade Norte",
        status: "realizada"
    },

    {
        id: 6,
        especialidade: "Ortopedia",
        medico: "Dr. João Silva • CRM 98765",
        data: "2026-11-20",
        horario: "15:00",
        local: "Clínica Boa Vista",
        status: "cancelada"
    }

];


// Verifica se já existem consultas salvas

let consultas = JSON.parse(
    localStorage.getItem("consultas")
);


// Se não existirem, utiliza os dados iniciais

if (consultas === null) {

    consultas = consultasIniciais;

    localStorage.setItem(
        "consultas",
        JSON.stringify(consultas)
    );

}


/* =====================================
   2. ELEMENTOS DO HTML
===================================== */

const listaConsulta = document.getElementById("listaConsulta");

const modeloConsulta = document.getElementById("modeloConsulta");

const abas = document.querySelectorAll(".aba");

const nomeHeader = document.getElementById("nomeHeader");

const nomeSaudacao =document.getElementById("nomeSaudacao");

/* =====================================
   3. SALVAR CONSULTAS
===================================== */

function salvarConsultas() {

    localStorage.setItem(
        "consultas",
        JSON.stringify(consultas)
    );

}


/* =====================================
   4. FORMATAR DATA
===================================== */

function formatarData(data) {

    const dataFormatada = new Date(data + "T00:00:00");

    return dataFormatada.toLocaleDateString("pt-BR");

}


/* =====================================
   5. CRIAR OS CARDS
===================================== */

function renderizarConsultas(statusAtual = "proximas") {

    // Limpa a lista antes de criar os cards

    listaConsulta.innerHTML = "";


    // Filtra as consultas conforme a aba selecionada

    let consultasFiltradas = consultas.filter(function(consulta) {

        if (statusAtual === "proximas") {

            return consulta.status === "pendente" ||
                consulta.status === "confirmada";

        }

        if (statusAtual === "realizadas") {

            return consulta.status === "realizada";

        }

        if (statusAtual === "canceladas") {

            return consulta.status === "cancelada";

        }

    });


    // Percorre as consultas encontradas

    consultasFiltradas.forEach(function(consulta) {

        // Clona o modelo HTML

        const clone = modeloConsulta.content.cloneNode(true);


        // Localiza o card criado

        const card = clone.querySelector(".cartaoConsulta");


        // Adiciona o ID da consulta ao card

        card.dataset.id = consulta.id;


        // Preenche as informações

        card.querySelector('[data-field="tipoMedico"]').textContent =
            consulta.especialidade;

        card.querySelector('[data-field="medico"]').textContent =
            consulta.medico;

        card.querySelector('[data-field="data"]').textContent =
            formatarData(consulta.data);

        card.querySelector('[data-field="horario"]').textContent =
            consulta.horario;

        card.querySelector('[data-field="local"]').textContent =
            "📍 " + consulta.local;


        // Define o texto do status

        const statusTexto = card.querySelector(".statusTexto");

        const nomesStatus = {

            pendente: "Aguardando confirmação",

            confirmada: "Confirmada",

            realizada: "Realizada",

            cancelada: "Cancelada"

        };

        statusTexto.textContent = nomesStatus[consulta.status];


        // Adiciona a classe correspondente ao status

        card.classList.add(consulta.status);

        statusTexto.classList.add(consulta.status);


        // Localiza os botões

        const botaoConfirmar = card.querySelector('[data-action="confirmar"]');

        const botaoRemarcar = card.querySelector('[data-action="remarcar"]');

        const botaoCancelar = card.querySelector('[data-action="cancelar"]');


        // Controla quais botões serão exibidos

        if (consulta.status !== "pendente") {

            botaoConfirmar.style.display = "none";

        }

        if (consulta.status === "realizada" ||
            consulta.status === "cancelada") {

            botaoRemarcar.style.display = "none";

            botaoCancelar.style.display = "none";

        }


        // Adiciona o card à página

        listaConsulta.appendChild(clone);

    });

}


/* =====================================
   6. ATUALIZAR ESTATÍSTICAS
===================================== */

function atualizarEstatisticas() {

    const agendadas = consultas.filter(function(consulta) {

        return consulta.status === "pendente" ||
        consulta.status === "confirmada";

    }).length;


    const aguardando = consultas.filter(function(consulta) {

        return consulta.status === "pendente";

    }).length;


    const realizadas = consultas.filter(function(consulta) {

        return consulta.status === "realizada";

    }).length;


    const canceladas = consultas.filter(function(consulta) {

        return consulta.status === "cancelada";

    }).length;


    // Atualiza os números do resumo

    document.getElementById("totalAgendadas").textContent = agendadas;

    document.getElementById("totalAguardando").textContent = aguardando;

    document.getElementById("totalRealizadas").textContent = realizadas;


    // Atualiza os números das abas

    document.getElementById("contadorProximas").textContent = agendadas;

    document.getElementById("contadorRealizadas").textContent = realizadas;

    document.getElementById("contadorCanceladas").textContent = canceladas;

}


/* =====================================
   7. PRÓXIMA CONSULTA
===================================== */

let idProximaConsulta = null;


function atualizarProximaConsulta() {

    // Localiza as consultas futuras não canceladas ou realizadas

    const proximas = consultas.filter(function(consulta) {

        return consulta.status === "pendente" ||
        consulta.status === "confirmada";

    });


    // Ordena pela data e horário

    proximas.sort(function(a, b) {

        return (a.data + a.horario).localeCompare(
            b.data + b.horario
        );

    });


    const proxima = proximas[0];


    // Se não existir próxima consulta

    if (!proxima) {

        idProximaConsulta = null;

        document.getElementById("proximaEspecialidade").textContent =
        "Nenhuma consulta agendada";

        document.getElementById("proximoMedico").textContent = "";

        document.getElementById("proximaData").textContent = "";

        document.getElementById("proximoLocal").textContent = "";

        document.getElementById("aguardandoConfirmacao").textContent =
        "Você não possui consultas futuras";

        document.getElementById("confirmarPresenca").style.display = "none";

        document.getElementById("detalhesProxima").style.display = "none";

        return;

    }


    // Guarda o ID da próxima consulta

    idProximaConsulta = proxima.id;


    // Atualiza as informações na página

    document.getElementById("proximaEspecialidade").textContent =
    proxima.especialidade;

    document.getElementById("proximoMedico").textContent =
    proxima.medico;

    document.getElementById("proximaData").textContent =
    formatarData(proxima.data) + " • " + proxima.horario;

    document.getElementById("proximoLocal").textContent =
    proxima.local;


    // Atualiza o status

    document.getElementById("aguardandoConfirmacao").textContent =
    proxima.status === "pendente" ? "Aguardando sua confirmação": "Presença confirmada";


    // Mostra ou esconde o botão de confirmação

    document.getElementById("confirmarPresenca").style.display =
    proxima.status === "pendente" ? "inline-block" : "none";

    document.getElementById("detalhesProxima").style.display =
    "inline-block";

}


/* =====================================
   8. ATUALIZAR TODA A INTERFACE
===================================== */

function atualizarUsuario(){
        if(!usuarioLogado) return;

        if(nomeHeader){
            nomeHeader.textContent = usuarioLogado.nome;
        }

        if(nomeSaudacao){
            nomeSaudacao.textContent = usuarioLogado.nome;
        }
}

function atualizarInterface(statusAtual = "proximas") {
    
    salvarConsultas();

    atualizarUsuario();

    renderizarConsultas(statusAtual);

    atualizarEstatisticas();

    atualizarProximaConsulta();
}


/* =====================================
   9. NAVEGAÇÃO DAS ABAS
===================================== */

let abaAtual = "proximas";


abas.forEach(function(aba) {

    aba.addEventListener("click", function() {

        // Remove a classe ativa de todas as abas

        abas.forEach(function(item) {

        item.classList.remove("ativa");

        });


        // Adiciona a classe ativa na aba clicada

        aba.classList.add("ativa");


        // Identifica a categoria selecionada

        abaAtual = aba.dataset.status;


        // Mostra as consultas correspondentes

        renderizarConsultas(abaAtual);

    });

});


/* =====================================
   10. AÇÕES DOS CARDS
===================================== */

listaConsulta.addEventListener("click", async function(event) {

    // Verifica se o clique foi em um botão de ação

    const botao = event.target.closest("button[data-action]");

    if (!botao) return;


    // Localiza o card do botão clicado

    const card = botao.closest(".cartaoConsulta");

    const id = Number(card.dataset.id);


    // Localiza a consulta correspondente

    const consulta = consultas.find(function(item) {

        return item.id === id;

    });


    if (!consulta) return;


    // Identifica qual botão foi clicado

    const acao = botao.dataset.action;


    // CONFIRMAR

    if (acao === "confirmar") {

        if (await modalConfirmar("Deseja confirmar sua presença?")) {

            consulta.status = "confirmada";

            await modalAlerta("Presença confirmada com sucesso!");

            atualizarInterface(abaAtual);

        }

    }


    // DETALHES

    else if (acao === "detalhes") {

        await modalAlerta(

            "Especialidade: " + consulta.especialidade +
            "\nMédico: " + consulta.medico +
            "\nData: " + formatarData(consulta.data) +
            "\nHorário: " + consulta.horario +
            "\nLocal: " + consulta.local

        );

    }


    // REMARCAR

    else if (acao === "remarcar") {

        const novaData = await modalPrompt(
            "Informe a nova data (AAAA-MM-DD):",
            consulta.data
        );


        if (novaData === null) return;


        if (!/^\d{4}-\d{2}-\d{2}$/.test(novaData)) {

            await modalAlerta("Formato de data inválido!");

            return;

        }


        const novoHorario = await modalPrompt(
            "Informe o novo horário (HH:MM):",
            consulta.horario
        );


        if (novoHorario === null) return;


        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(novoHorario)) {

            await modalAlerta("Horário inválido!");

            return;

        }


        consulta.data = novaData;

        consulta.horario = novoHorario;


        await modalAlerta("Consulta remarcada com sucesso!");


        atualizarInterface(abaAtual);

    }


    // CANCELAR

    else if (acao === "cancelar") {

        if (await modalConfirmar("Deseja realmente cancelar esta consulta?")) {

            consulta.status = "cancelada";

            await modalAlerta("Consulta cancelada com sucesso!");

            atualizarInterface(abaAtual);

        }

    }

});




/* =====================================
   MODAIS PERSONALIZADOS
===================================== */

function abrirModal(titulo, mensagem, tipo = "alerta", valorInicial = "") {

    const modal = document.getElementById("modalPersonalizado");

    const tituloModal = document.getElementById("modalTitulo");

    const mensagemModal = document.getElementById("modalMensagem");

    const campo = document.getElementById("modalCampo");

    const botaoCancelar = document.getElementById("modalCancelar");

    const botaoConfirmar = document.getElementById("modalConfirmar");

    const icone = document.getElementById("iconeModal");


    tituloModal.textContent = titulo;

    mensagemModal.textContent = mensagem;


    // Define a aparência conforme o tipo de modal

    if (tipo === "alerta") {

        icone.textContent = "!";

        botaoConfirmar.textContent = "Entendi";

    }

    if (tipo === "confirmar") {

        icone.textContent = "?";

        botaoConfirmar.textContent = "Sim";

    }

    if (tipo === "prompt") {

        icone.textContent = "✎";

        botaoConfirmar.textContent = "Salvar";

    }


    // Exibe o campo somente quando for necessário digitar

    campo.hidden = tipo !== "prompt";

    campo.value = valorInicial;

    botaoCancelar.hidden = tipo === "alerta";


    // Abre o modal e aguarda a resposta

    modal.showModal();


    return new Promise(function(resolve) {

        function finalizar(resultado) {

            modal.close();

            botaoConfirmar.removeEventListener("click", confirmar);

            botaoCancelar.removeEventListener("click", cancelar);

            modal.removeEventListener("cancel", fechar);

            resolve(resultado);

        }


        function confirmar() {

            if (tipo === "prompt") {

                finalizar(campo.value);

            } else {

                finalizar(true);

            }

        }


        function cancelar() {

            finalizar(tipo === "prompt" ? null : false);

        }


        function fechar(event) {

            event.preventDefault();

            finalizar(tipo === "prompt" ? null : false);

        }


        botaoConfirmar.addEventListener("click", confirmar);

        botaoCancelar.addEventListener("click", cancelar);

        modal.addEventListener("cancel", fechar);

        if (tipo === "prompt") {

            campo.focus();

        } else {

            botaoConfirmar.focus();

        }

    });

}


// Modal de aviso

function modalAlerta(mensagem) {

    return abrirModal("Aviso", mensagem, "alerta");

}


// Modal de confirmação

function modalConfirmar(mensagem) {

    return abrirModal("Confirme sua ação", mensagem, "confirmar");

}


// Modal para digitar informações

function modalPrompt(mensagem, valorInicial = "") {

    return abrirModal("Informe os dados", mensagem, "prompt", valorInicial);

}





/* =====================================
   11. AÇÕES DA PRÓXIMA CONSULTA
===================================== */

document.getElementById("confirmarPresenca").addEventListener("click", async function() {

    const consulta = consultas.find(function(item) {

        return item.id === idProximaConsulta;

    });


    if (consulta && await modalConfirmar("Deseja confirmar sua presença?")) {

        consulta.status = "confirmada";

        await modalAlerta("Presença confirmada com sucesso!");

        atualizarInterface(abaAtual);

    }

});


document.getElementById("detalhesProxima").addEventListener("click", async function() {

    const consulta = consultas.find(function(item) {

        return item.id === idProximaConsulta;

    });


    if (consulta) {

        await modalAlerta(

            "Especialidade: " + consulta.especialidade +
            "\nMédico: " + consulta.medico +
            "\nData: " + formatarData(consulta.data) +
            "\nHorário: " + consulta.horario +
            "\nLocal: " + consulta.local

        );

    }

});


/* =====================================
   12. INICIAR O PROJETO
===================================== */

atualizarInterface();

