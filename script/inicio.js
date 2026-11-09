 let items = document.getElementById('itens');

    function mudoutamanho(){
        if(window.innerWidth >= 768){
            itens.style.display = 'block';
        } else{
            itens.style.display = 'none';
        }    
    }

    function clickmenu(){
        if(itens.style.display == 'block'){
            itens.style.display = 'none';
        } else{
            itens.style.display = 'block';
        }
    }

window.addEventListener('scroll', () =>{
    const header = document.querySelector('header');

    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else{
        header.classList.remove('scrolled');
    }
})


