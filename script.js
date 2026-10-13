function selectOption(elemet) {
    document.querySelectorAll('.optnc').forEach(card =>{
        card.classList.remove('selected');
    });

    elemet.classList.add('selected');
}