function selectOption(element) {
    document.querySelectorAll('.optnc').forEach(card =>{
        card.classList.remove('selected');
    });

    element.classList.add('selected');
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
       if(indicator2) indicator1.classList.add('indic');
       
      document.getElementById('step-2').style.display = 'block';
    },400);
}

function selectedSpecialty(event, especialidade){
    const cards = document.querySelectorAll('#step-2 .optnc');
    cards.forEach(card => card.classList.remove('selected'));

    event.currentTarget.classList.add('selected');

    console.log("Especialidade escolhida:", especialidade);
}

