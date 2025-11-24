    window.addEventListener('load', () => {
    const paginaAtual = window.location.pathname;
    
    if(paginaAtual.includes('central')) {
        verificarSessao();
    }
});
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
            } else {
                // Se não estiver logado, manda voltar pro login
                alert("Sessão expirada ou inválida. Faça login novamente.");
                window.location.href = 'index.html';
            }
        })
        .catch(err => console.error("Erro ao verificar sessão", err));
}
    
    // Gráfico de Linha - Métricas
    const ctxLine = document.getElementById('graficoLinha');

    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Gastos',
                data: [400, 450, 500, 430, 470, 500],
                borderWidth: 3,
                borderColor: '#ff0000',
                backgroundColor: 'transparent',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });

    // Gráfico de Pizza
    const ctxPie = document.getElementById('graficoPizza');

    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Salario','Lazer'],
            datasets: [{
                data: [300, 100],
                backgroundColor: ['#FF8C00', "#FA8072"]
            }]
        },
        options: {
            responsive: true
        }
    });


// === MODAL === //
const modal = document.getElementById("modalGasto");

document.querySelector(".btn-add").onclick = function() {
    modal.style.display = "flex";
};

function fecharModal() {
    modal.style.display = "none";
}

// === SISTEMA DE LOCALSTORAGE === //

function carregarValores() {
    let total = localStorage.getItem("gastosMes");
    if (!total) total = 0;

    document.querySelector('#gastosMesValor').textContent = `R$ ${Number(total).toFixed(2)}`;
}

function mascaraValor(input) {
    let v = input.value.replace(/\D/g, ""); // Remove tudo que não for número

    // Evitar campo vazio
    if (v.length === 0) {
        input.value = "R$ 0,00";
        return;
    }

    // Garante pelo menos 3 dígitos para centavos
    v = (Number(v) / 100).toFixed(2) + "";

    // Troca ponto por vírgula
    v = v.replace(".", ",");

    input.value = "R$ " + v;
}

function salvarGasto() {
    let valor = Number(document.getElementById("valorGasto").value);

    if (!valor) {
        alert("Digite um valor válido!");
        return;
    }

    let totalAtual = Number(localStorage.getItem("gastosMes")) || 0;
    let novoTotal = totalAtual + valor;

    localStorage.setItem("gastosMes", novoTotal);

    carregarValores();
    fecharModal();
}
function alternarMenu(event) {
   
    if (event) event.stopPropagation();

    var menu = document.getElementById("menuUsuario");

    menu.classList.toggle("mostrar");
}

// CHAMAR AO CARREGAR A PÁGINA
window.onload = carregarValores;