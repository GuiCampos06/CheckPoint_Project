function alternarMenu(event) {
   
    if (event) event.stopPropagation();

    var menu = document.getElementById("menuUsuario");

    menu.classList.toggle("mostrar");
}

function atualizarSemaforo(valor) {
    // 1. Pega as luzes
    const luzVermelha = document.getElementById("luz-vermelha");
    const luzAmarela = document.getElementById("luz-amarela");
    const luzVerde = document.getElementById("luz-verde");
    
    // 2. Pega o elemento de texto
    const textoMsg = document.getElementById("texto-status");

    // 3. Reseta as luzes (apaga tudo)
    luzVermelha.classList.remove("aceso");
    luzAmarela.classList.remove("aceso");
    luzVerde.classList.remove("aceso");

    // 4. Lógica Principal (Luz + Texto + Cor do Texto)
    if (valor < 80) {
        // VERDE
        luzVerde.classList.add("aceso");
        textoMsg.innerText = "Tudo tranquilo! Gastos baixos.";
        textoMsg.className = "msg-verde"; // Troca a cor para verde

    } else if (valor >= 80 && valor < 100) {
        // AMARELO
        luzAmarela.classList.add("aceso");
        textoMsg.innerText = "Atenção! Você está chegando no limite.";
        textoMsg.className = "msg-amarela"; // Troca a cor para amarelo

    } else {
        // VERMELHO
        luzVermelha.classList.add("aceso");
        textoMsg.innerText = "Cuidado! Orçamento estourado!";
        textoMsg.className = "msg-vermelha"; // Troca a cor para vermelho
    }
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

function formatarMoeda(elemento) {
    
    let valor = elemento.value;
    
    valor = valor.replace(/\D/g, "");
    
    valor = (valor / 100).toFixed(2) + "";
   
    valor = valor.replace(".", ",");
    
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");

    elemento.value = "R$ " + valor;
    
    if(valor == "NaN" || valor == "") {
        elemento.value = "";
    }
}

function abrirModal(event) {
    if(event) event.preventDefault();
    const modal = document.getElementById("meuModal");
    modal.classList.add("mostrar-modal");
}

function apenasFecharModal() {
    const modal = document.getElementById("meuModal");
    modal.classList.remove("mostrar-modal");
}

function finalizarRealmente() {
    const modal = document.getElementById("meuModal");
    modal.classList.remove("mostrar-modal");
    
    alert("Rolê criado com sucesso!");
    window.location.href = "menu_inicial.html";
}

function voltarSuave(event, linkDestino) {
    if (event) event.preventDefault();
    document.body.classList.add("saindo");
    setTimeout(function() {
        window.location.href = linkDestino;
    }, 400);
}


function abrirModalSaldo(event) {
    if(event) event.preventDefault();
    const modal = document.getElementById("modalSaldo");
    modal.classList.add("mostrar-modal");
    document.getElementById("input-novo-saldo").value = "";
}

function fecharModalSaldo() {
    const modal = document.getElementById("modalSaldo");
    modal.classList.remove("mostrar-modal");
}

function salvarNovoSaldo() {
       
    const inputValor = document.getElementById("input-novo-saldo").value;
    if (inputValor === "") {
        alert("Por favor, digite um valor.");
        return;
    }
    const textoSaldoPrincipal = document.getElementById("textoSaldo");
    textoSaldoPrincipal.innerText = inputValor;
    fecharModalSaldo();
}


function formatarMoeda(elemento) {
    let valor = elemento.value;
    valor = valor.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
    elemento.value = "R$ " + valor;
}