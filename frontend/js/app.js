function alternarMenu(event) {
   
    if (event) event.stopPropagation();

    var menu = document.getElementById("menuUsuario");
    
  
    menu.classList.toggle("mostrar");
}


window.onclick = function(event) {
    var menu = document.getElementById("menuUsuario");
    
    if (!event.target.closest('.area-usuario')) {
       
        if (menu.classList.contains('mostrar')) {
            menu.classList.remove('mostrar');
        }
    }
}


var porcentagemGasta = 50;

function simularGasto(event) {
    
    if (event) event.stopPropagation();

    
    var aumento = Math.floor(Math.random() * 20) + 10;
    porcentagemGasta += aumento;

    
    if (porcentagemGasta > 120) {
        porcentagemGasta = 20;
        alert("Gastos resetados para simulação!");
    }

    
    var textoSaldo = document.getElementById("textoSaldo");
    textoSaldo.innerText = "R$ -" + (porcentagemGasta * 10) + ",00";

    
    mudarImagemSemaforo(porcentagemGasta);
}
