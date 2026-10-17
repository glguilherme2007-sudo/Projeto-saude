function selectPerson(event, tipo) {
    const cards = document.querySelectorAll('#step-1 .optnc');
    cards.forEach(card => card.classList.remove('selected'));

    event.currentTarget.classList.add('selected');

    setTimeout(() => {
        document.getElementById('step-1').style.display = 'none';

        const indicator1 = document.querySelector('#indicator-1');
        const indicator2 = document.querySelector('#indicator-2');

        if(indicator1) indicator1.classList.remove('indic');
        if(indicator2) indicator2.classList.add('indic');

        document.getElementById('step-2').style.display = 'block';
    }, 400);
}
function selectPerson(event, tipo) {
    const cards = document.querySelectorAll('#step-1 .optnc');
    cards.forEach(card => card.classList.remove('selected'));

    event.currentTarget.classList.add('selected');

    setTimeout(() => {
        document.getElementById('step-1').style.display = 'none';

        const indicator1 = document.querySelector('#indicator-1');
        const indicator2 = document.querySelector('#indicator-2');

        if(indicator1) indicator1.classList.remove('indic');
        if(indicator2) indicator2.classList.add('indic');

        document.getElementById('step-2').style.display = 'block';
    }, 400);
}

function selectedSpecialty(event, especialidade) {
    const cards = document.querySelectorAll('#step-2 .optnc');
    cards.forEach(card => card.classList.remove('selected'));
    
    event.currentTarget.classList.add('selected');
    
    console.log("Especialidade escolhida:", especialidade);

    setTimeout(() => {
        
        document.getElementById('step-2').style.display = 'none';
        
        
        const indicator2 = document.querySelector('#indicator-2');
        const indicator3 = document.querySelector('#indicator-3');
        
        if(indicator2) indicator2.classList.remove('indic');
        if(indicator3) indicator3.classList.add('indic');
        
        
        document.getElementById('step-3').style.display = 'block';
    }, 400);
}

function selectMode(event, modo) {
    const cards = document.querySelectorAll('#step-3 .optnc');
    cards.forEach(card => card.classList.remove('selected'));
    
    event.currentTarget.classList.add('selected');
    
    console.log("Modo escolhido:", modo);

    setTimeout(() => {
        
        document.getElementById('step-3').style.display = 'none';
        
        
        const indicator3 = document.querySelector('#indicator-3');
        const indicator4 = document.querySelector('#indicator-4');
        
        if(indicator3) indicator3.classList.remove('indic');
        if(indicator4) indicator4.classList.add('indic');
        
       
        document.getElementById('step-4').style.display = 'block';
    }, 400);
}

function finalizarAgendamento(){
    const data = document.getElementById('data-consulta').value; 
    const hora = document.getElementById('hora-consulta').value; 

    if (!data || !hora){
        alert("Por favor, selecione uma data e um horario para continuar.");
        return;
    }

    const indicator3 = document.querySelector('#indicator-3');
    const indicator4 = document.querySelector('#indicator-4');

    if(indicator3) indicator3.classList.remove('indic');
    if(indicator4) indicator4.classList.add('indic');

    console.log("Agendamento concluido!")
    console.log("Data:, data")
    console.log("Horario:, hora")

    alert("Consulta agendada com sucesso!")
}
