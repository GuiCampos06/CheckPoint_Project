window.addEventListener('load', () => {
    const paginaAtual = window.location.pathname;
    
    if(paginaAtual.includes('menu_inicial') || paginaAtual.includes('criar_role')) {
        verificarSessao();
    }
});
window.onload = function () {
    const url = new URL(window.location.href);

    if (url.searchParams.get("sucesso") === "1") {
        alert("Perfil atualizado com sucesso!");
    }
    if (url.searchParams.get("sucesso") === "2") {
        alert("Saldo atualizado com sucesso!");
    }
};

function verificarSessao() {
    fetch('/users/sessao')
        .then(response => response.json())
        .then(data => {
            if (data.logado) {
                console.log("Usuário logado:", data.usuario.Nick);
                
                // Procura o lugar onde vai o nome e atualiza
                const elementoNome = document.getElementById('nome-usuario');
                if (elementoNome) {
                    elementoNome.innerText = data.usuario.Nick;
                }
                const elementoValor = document.getElementById('textoSaldo');
                if (elementoValor) {
                    elementoValor.innerText = ('R$ '+data.usuario.Valor);
                }
            } else {
                // Se não estiver logado, manda voltar pro login
                alert("Sessão expirada ou inválida. Faça login novamente.");
                window.location.href = 'index.html';
            }
        })
        .catch(err => console.error("Erro ao verificar sessão", err));
}
function alternarMenu(event) {
   
    if (event) event.stopPropagation();

    var menu = document.getElementById("menuUsuario");

    menu.classList.toggle("mostrar");
}

function atualizarSemaforo(valor) {
    const luzVermelha = document.getElementById("luz-vermelha");
    const luzAmarela = document.getElementById("luz-amarela");
    const luzVerde = document.getElementById("luz-verde");
    const textoMsg = document.getElementById("texto-status");
    luzVermelha.classList.remove("aceso");
    luzAmarela.classList.remove("aceso");
    luzVerde.classList.remove("aceso");

    if (valor < 80) {
     
        luzVerde.classList.add("aceso");
        textoMsg.innerText = "Tudo tranquilo! Gastos baixos.";
        textoMsg.className = "msg-verde"; 

    } else if (valor >= 80 && valor < 100) {
        
        luzAmarela.classList.add("aceso");
        textoMsg.innerText = "Atenção! Você está chegando no limite.";
        textoMsg.className = "msg-amarela"; 

    } else {
        
        luzVermelha.classList.add("aceso");
        textoMsg.innerText = "Cuidado! Orçamento estourado!";
        textoMsg.className = "msg-vermelha"; 
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

document.addEventListener("DOMContentLoaded", () => {
    fetch("/events/quantidade")
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                document.getElementById("qtd-roles").textContent = data.total;
            }
        })
        .catch(err => console.error(err));
});

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
    const nome = document.getElementById("input-nome").value;
    const valor = document.getElementById("input-valor").value;
    const data = document.getElementById("input-data").value;
    const local = document.getElementById("input-local").value;
    const quantidade = document.getElementById("input-quantidade").value;

    const dados = {
        nomeEvento: nome,
        valorEvento: valor,
        dataEvento: data,
        localEvento: local,
        QuantParticipantes: quantidade
    };

    fetch("/events/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(res => {
        if (res.ok) {
            window.location.href = "/menu_inicial.html";
        } else {
            alert("Erro ao salvar: " + res.msg);
        }
    })
    .catch(err => console.error("Erro:", err));
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


