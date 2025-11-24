window.addEventListener('load', () => {
    const paginaAtual = window.location.pathname;
    
    // Verifica sessão e carrega dados
    if(paginaAtual.includes('menu_inicial') || paginaAtual.includes('criar_role') || paginaAtual === '/' || paginaAtual.endsWith('html')) {
        verificarSessao();
        
        // Se estiver no menu inicial, carrega o semáforo
        if (paginaAtual.includes('menu_inicial')) {
            carregarDadosSemaforo();
        }
    }
});

// === SESSÃO ===
function verificarSessao() {
    fetch('/users/sessao')
        .then(response => response.json())
        .then(data => {
            if (data.logado) {
                // Atualiza Nome
                const elNome = document.getElementById('nome-usuario');
                if (elNome) elNome.innerText = data.usuario.Nick;
                
                // Atualiza Saldo (Meta)
                const elValor = document.getElementById('textoSaldo');
                if (elValor && data.usuario.Valor) {
                    const valorF = parseFloat(data.usuario.Valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    elValor.innerText = valorF;
                }
            } else {
                window.location.href = 'index.html';
            }
        })
        .catch(err => console.error("Erro sessão", err));
}

// === LÓGICA DO SEMÁFORO (NOVA) ===
function carregarDadosSemaforo() {
    // Reutiliza a rota de listar gastos para pegar Total Gasto e Meta
    fetch('/gastos/listar')
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                const gasto = parseFloat(data.total) || 0;
                const meta = parseFloat(data.renda) || 0; // A "renda" é o Valor/Meta do usuário

                // Evita divisão por zero
                let porcentagem = 0;
                if (meta > 0) {
                    porcentagem = (gasto / meta) * 100;
                } else if (gasto > 0) {
                    // Se meta é 0 e gastou algo, é 100% de estouro
                    porcentagem = 100; 
                }

                atualizarSemaforo(porcentagem);
            }
        })
        .catch(err => console.error("Erro ao carregar semáforo:", err));
}

function atualizarSemaforo(porcentagem) {
    const luzVermelha = document.getElementById("luz-vermelha");
    const luzAmarela = document.getElementById("luz-amarela");
    const luzVerde = document.getElementById("luz-verde");
    const textoMsg = document.getElementById("texto-status");

    if (!luzVermelha || !textoMsg) return;

    // Reseta todas as luzes
    luzVermelha.classList.remove("aceso");
    luzAmarela.classList.remove("aceso");
    luzVerde.classList.remove("aceso");

    // Lógica das cores
    if (porcentagem < 80) {
        // VERDE (Gastou menos de 80%)
        luzVerde.classList.add("aceso");
        textoMsg.innerText = "Tudo tranquilo! Gastos sob controle.";
        textoMsg.className = "msg-verde"; 

    } else if (porcentagem >= 80 && porcentagem < 100) {
        // AMARELO (Gastou entre 80% e 99%)
        luzAmarela.classList.add("aceso");
        textoMsg.innerText = "Atenção! Você está perto do limite.";
        textoMsg.className = "msg-amarela"; 

    } else {
        // VERMELHO (Gastou 100% ou mais)
        luzVermelha.classList.add("aceso");
        textoMsg.innerText = "Cuidado! Orçamento estourado!";
        textoMsg.className = "msg-vermelha"; 
    }
}

// === MENU USUÁRIO ===
function alternarMenu(event) {
    if (event) event.stopPropagation();
    document.getElementById("menuUsuario").classList.toggle("mostrar");
}

window.onclick = function(event) {
    if (!event.target.closest('.area-usuario')) {
        const menu = document.getElementById("menuUsuario");
        if (menu) menu.classList.remove('mostrar');
    }
    // Fechar modal se clicar fora
    const modalSaldo = document.getElementById("modalSaldo");
    if (event.target == modalSaldo) fecharModalSaldo();
}

// === MODAL SALDO ===
function abrirModalSaldo(event) {
    if(event) event.preventDefault();
    const modal = document.getElementById("modalSaldo");
    const input = document.getElementById("input-novo-saldo");
    if(modal) {
        modal.classList.add("mostrar-modal");
        if(input) { input.value = ""; input.focus(); }
    }
}

function fecharModalSaldo() {
    const modal = document.getElementById("modalSaldo");
    if(modal) modal.classList.remove("mostrar-modal");
}

function salvarNovoSaldo() {
    const input = document.getElementById("input-novo-saldo");
    let valorLimpo = input.value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
    const valorFinal = parseFloat(valorLimpo);

    if (isNaN(valorFinal) || valorFinal < 0) {
        alert("Valor inválido.");
        return;
    }

    fetch('/users/saldo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Valor: valorFinal })
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            alert("✅ Meta atualizada!");
            fecharModalSaldo();
            // Atualiza texto e recarrega o semáforo
            const elSaldo = document.getElementById("textoSaldo");
            if(elSaldo) elSaldo.innerText = valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            carregarDadosSemaforo(); // <--- Recalcula a luz na hora
        } else {
            alert("Erro: " + data.msg);
        }
    })
    .catch(err => console.error(err));
}

// === FORMATAR MOEDA ===
function formatarMoeda(elemento) {
    let valor = elemento.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
    elemento.value = "R$ " + valor;
}

// === CONTAGEM ROLÊS ===
document.addEventListener("DOMContentLoaded", () => {
    const qtd = document.getElementById("qtd-roles");
    if(qtd) {
        fetch("/events/quantidade")
            .then(res => res.json())
            .then(data => { if(data.ok) qtd.textContent = data.total; })
            .catch(err => console.error(err));
    }
});

function atualizarContagemRoles() {
    const elementoQtd = document.getElementById("qtd-roles");
    
    // Só tenta buscar se o elemento existir na tela (para não dar erro em outras páginas)
    if (elementoQtd) {
        fetch("/events/quantidade")
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    console.log("Total de rolês encontrados:", data.total);
                    elementoQtd.textContent = data.total;
                } else {
                    elementoQtd.textContent = "0";
                }
            })
            .catch(err => {
                console.error("Erro ao buscar quantidade de rolês:", err);
                elementoQtd.textContent = "-";
            });
    }
}