const TOTAL_STEPS = 4
let currentStep = 1

const agendamento = {
    paciente: null,
    especialidade: null,
    modo: null,
    medico: null,
    horario: null
};

const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
console.log(usuarioLogado);

const divUser =  document.getElementById('user');

function pegarInicais(nomeCompleto){
    if(!nomeCompleto || typeof nomeCompleto !== 'string') return 'U';

    const partes = nomeCompleto.trim().split(/\s+/);

    if(partes.length >=2){
        const primeira = partes[0].charAt(0);
        const ultima = partes[partes.length - 1].charAt(0);
        return (primeira + ultima).toUpperCase();
    }

    return partes[0].slice(0, 2).toUpperCase();
}

if(usuarioLogado && divUser) {  
    const inicial = usuarioLogado.nome ? usuarioLogado.nome.charAt(0). toUpperCase() : 'U';

    divUser.innerHTML = `
    <div class="avatar-bolinha">${inicial}</div>
    <span class="nome-usuario">${usuarioLogado.nome}</span>
    <button type"button" id="btnSair">Sair</button>
  `;
}

const dadosMedicos = {
    "Cardiologia": [
     {
        nome: "Dr. Carlos Eduardo",
        crm: "CRM/RJ 123456",
        horarios: ["08:30 - Segunda-feira","09:00 - Quinta-feira", "10:30 - Quinta-feira", "14:00 - Sexta-feira"]
     },  
     {
        nome: "Dra. Ana Beatriz",
        crm: "CRM/RJ 654321",
        horarios: ["08:00 - Segunda-feira","11:00 - Segunda-feira", "11:00 - Terça-feira", "15:30 - Quarta-feira"],
     } 
  ],
  "Geriatria": [
    {
        nome: "Dr. Roberto Silva",
        crm: "CRM/RJ 987654",
        horarios: ["08:30 - Segunda-feira","10:30 - Segunda-feira", "10:00 - Quarta-feira", "13:30 - Sexta-feira"],
    },
    {
        nome: "Dra. Helena Monteiro",
        crm: "CRM/RJ 985643",
        foto: "img/medicos/camila.avif",
        horarios: ["08:30 - Segunda-feira", "10:00 - Terça-feira","13:30 - Quarta-feira", "14:30 - Sexta-feira"],
    }
  ],
  "Clinico Geral": [
     {
        nome: "Dr. Roberto Silva",
        crm: "CRM/RJ 987654",
    
        horarios: ["08:30 - Segunda-feira","10:30 - Segunda-feira", "10:00 - Quarta-feira", "13:30 - Sexta-feira"],
    },
    {
        nome: "Dra. Helena Monteiro",
        crm: "CRM/RJ 985643",
        horarios: ["08:30 - Segunda-feira", "10:00 - Terça-feira","13:30 - Quarta-feira", "14:30 - Sexta-feira"],
    }
  ],
  "Fisioterapia": [
     {
        nome: "Dr. Lucas Martins",
        crm: "CREFITO 445566",
        horarios: ["09:00 - Terça-feira", "11:00 - Quinta-feira","13:00 - Sexta-feira", "16:00 - Sexta-feira"]
     },
     {
        nome: "Dr. Vinicius Jesus",
        crm: "CREFITO 467667",
        horarios: ["08:30 - Segunda-feira","09:00 - Terça-feira", "11:00 - Quarta-feira", "16:00 - Quinta-feira"]
     }   
  ]
};

function normalizar(texto) {
    return(texto || '')
       .normalize('NFD') 
       .replace(/[\u0300-\u036f]/g, '')
       .trim()
       .toLowerCase();
}

function buscarMedico(especialidade) {
    const chave = Object.keys(dadosMedicos)
        .find(k => normalizar(k) === normalizar(especialidade));
    return chave ? dadosMedicos[chave] : []; 
}

const stepper = document.getElementById('stepper');
const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');
const erro = document.getElementById('erro');

const campoDoPasso = {1: 'paciente', 2: 'especialidade', 3: 'modo'};


document.querySelectorAll('.panel:not(#step-4) .option').forEach(card => { 
    card.addEventListener('click', () => {
        const panel = card.closest('.panel');
        const passo = Number(panel.dataset.step);
        
        panel.querySelectorAll('.option').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        agendamento[campoDoPasso[passo]] = card.dataset.value;
        esconderErro();
   });
});

btnAvancar.addEventListener('click', () => {
    if(!validarPasso(currentStep)) return;

    if(currentStep < TOTAL_STEPS) {
        irParaPasso(currentStep + 1);
    } else {
        finalizarAgendamento();
    }
});

btnVoltar.addEventListener('click', () => {
    if(currentStep > 1) irParaPasso(currentStep - 1);
});

function irParaPasso(n) {
    currentStep = n;
    esconderErro();

    document.querySelectorAll('.panel').forEach(p => {
        p.hidden = Number(p.dataset.step) !== n;
    });

    if (n === 4) {
        carregarMedicos();
    }

    stepper.style.setProperty('--progress', ((n - 1) * 25 + 12.5) + '%');
    stepper.querySelectorAll('.step').forEach(s => {
        const num = Number(s.dataset.step);
        s.classList.toggle('active', num === n);
        s.classList.toggle('done', num < n);
        s.querySelector('.step-circle').innerHTML = num < n ? '<i class="fa-solid fa-check"></i>' : num;
    });

    btnVoltar.disabled = n === 1;
    btnAvancar.innerHTML = n === TOTAL_STEPS
        ? 'Confirmar agendamento <i class="fa-solid fa-check"></i>'
        : 'Avançar <i class="fa-solid fa-arrow-right"></i>';
}

function carregarMedicos() {
    const containerMedicos = document.getElementById('container-medico'); 
    const containerHorarios = document.getElementById('container-horarios');

    containerMedicos.innerHTML = '';
    containerHorarios.style.display = 'none';
    agendamento.medico = null;
    agendamento.horario = null;

    const especialidadeEscolhida = agendamento.especialidade;
    const medicos = buscarMedico(especialidadeEscolhida);

    if(medicos.length === 0){
        containerMedicos.innerHTML = '<p>Nenhum profissional encontrado para esta especialidade.</p>';
        return;
    }

    medicos.forEach(medico => {
        const card = document.createElement('button'); 
        card.type = 'button';
        card.classList.add('option');
        card.innerHTML = `
            <span class="check"><i class="fa-solid fa-check"></i></span>
            <span class="option-icon"><i class="fa-solid fa-user-doctor"></i></span>
            <span class="option-title">${medico.nome}</span>
            <span class="option-desc">${medico.crm}</span>
        `;

        card.addEventListener('click', () => {
            containerMedicos.querySelectorAll('.option').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            agendamento.medico = medico.nome;
            
            carregarHorarios(medico.horarios);
            esconderErro();
        });
        
        containerMedicos.appendChild(card);
    });
}

function carregarHorarios(horarios) {
    const containerHorarios = document.getElementById('container-horarios');
    const listaHorarios = document.getElementById('horarios-travados'); 
    
    listaHorarios.innerHTML = '';
    containerHorarios.style.display = 'block';
    agendamento.horario = null;

    horarios.forEach(horario => {
        const card = document.createElement('button'); 
        card.type = 'button';
        card.classList.add('option');
        card.innerHTML = `
            <span class="check"><i class="fa-solid fa-check"></i></span>
            <span class="option-icon"><i class="fa-regular fa-clock"></i></span>
            <span class="option-title">${horario}</span>
        `;

        card.addEventListener('click', () => {
            listaHorarios.querySelectorAll('.option').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            agendamento.horario = horario;
            esconderErro();
        });

        listaHorarios.appendChild(card);
    });
}

function validarPasso(n) {
    if (n <= 3 && !agendamento[campoDoPasso[n]]) {
        mostrarErro('Selecione uma opção pra continuar.');
        return false;
    }

    if (n === 4) {
        if (!agendamento.medico) {
            mostrarErro('Por favor, selecione um profissional.');
            return false;
        }
        if (!agendamento.horario) {
            mostrarErro('Por favor, selecione um horário travado.');
            return false;
        }
    }
    return true;
} 

function mostrarErro(msg) {
    erro.textContent = msg;
    erro.hidden = false;
}

function esconderErro() {
    erro.hidden = true;
}

function finalizarAgendamento() {
   const consultasSalvas = JSON.parse(localStorage.getItem("consultas")) || [];

   const listaEspecialidade = buscarMedico(agendamento.especialidade);
   const medicoObj = listaEspecialidade.find( m => m.nome === agendamento.medico);

   const medicoFormatado = medicoObj
    ? `${medicoObj.nome} • ${medicoObj.crm}`
    : agendamento.medico;

    const horaLimpa = (agendamento.horario || "").split("-")[0].trim();

    const dataPadrao = "2026-11-24";

    
    
    const novaConsulta = {
        id: Date.now(),
        especialidade: agendamento.especialidade,
        medico: medicoFormatado,
        data: dataPadrao,
        local: agendamento.modo ? `Atendimento ${agendamento.modo}` : "Unidade Idade+",
        status: "pendente"
    };

    consultasSalvas.push(novaConsulta);
    localStorage.setItem("consultas", JSON.stringify(consultasSalvas));

    alert("Consulta agendada com sucesso!")
    window.location.href = "Área do Cliente zip/dashboard.html";
}

irParaPasso(1);