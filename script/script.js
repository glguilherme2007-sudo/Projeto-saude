const TOTAL_STEPS = 4
let currentStep = 1

const agendamento = {
    paciente: null,
    especialidade: null,
    modo: null,
    data: null,
    horario: null

};

const stepper = document.getElementById('stepper');
const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');
const erro = document.getElementById('erro');

const campoDoPasso = {1: 'paciente', 2: 'especialidade', 3: 'modo'};

document.querySelectorAll('.option').forEach(card => { 
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
    } else{
        finalizarAgendamento();
    }

});

btnVoltar.addEventListener('click', () =>{
    if(currentStep > 1) irParaPasso(currentStep - 1)
});

function irParaPasso(n) {
    currentStep = n;
    esconderErro();

    document.querySelectorAll('.panel').forEach(p =>{
        p.hidden = Number(p.dataset.step) !== n;
    });

    stepper.style.setProperty('--progress', ((n - 1) * 25 +12.5) + '%');
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

function validarPasso(n) {
    if (n <= 3 && !agendamento[campoDoPasso[n]]) {
        mostrarErro('Selecione uma opção pra continuar.');
        return false;
    }

    if (n === 4) {
        const data = document.getElementById('data-consulta').value;
        const hora = document.getElementById('hora-consulta').value;

        if (!data || !hora) {
            mostrarErro('por favor, selecione uma data e um horário para continuar.')
            return false;
        }
        agendamento.data = data;
        agendamento.horario = hora;
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
    console.log('Agendamento concluido!', agendamento);
    alert('Consulta agendada com sucesso!')
}

irParaPasso(1);



