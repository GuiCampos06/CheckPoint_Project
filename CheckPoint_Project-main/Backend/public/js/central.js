// ============================================================================
// VARIÁVEIS GLOBAIS
// ============================================================================
let chartLinhaInstance = null; 
let chartPizzaInstance = null; 
let idGastoEmEdicao = null;


// ============================================================================
// EVENTO PRINCIPAL – ONLOAD
// ============================================================================
window.addEventListener('load', () => {
    verificarSessao();
    carregarDadosFinanceiros();

    // Fecha o modal ao clicar fora dele
    window.onclick = event => {
        const modal = document.getElementById("modalGasto");
        if (event.target === modal) fecharModal();
    };
});


// ============================================================================
// MODAL
// ============================================================================
const modal = document.getElementById("modalGasto");
const btnAdd = document.querySelector(".btn-add");

// Abrir modal de novo gasto
if (btnAdd) {
    btnAdd.onclick = () => {
        idGastoEmEdicao = null;
        document.querySelector(".modal h2").innerText = "Novo Gasto";

        document.getElementById("valorGasto").value = "";
        document.getElementById("descGasto").value = "";

        const cat = document.getElementById("categoriaGasto");
        if (cat) cat.value = "outros";

        modal.style.display = "flex";
    };
}

function fecharModal() {
    modal.style.display = "none";
}


// ============================================================================
// SESSÃO
// ============================================================================
function verificarSessao() {
    fetch('/users/sessao')
        .then(r => r.json())
        .then(data => {
            if (!data.logado) return (window.location.href = "index.html");

            const elNome = document.getElementById("nome-usuario");
            if (elNome) elNome.innerText = data.usuario.Nick;
        })
        .catch(err => console.error("Erro sessão:", err));
}


// ============================================================================
// INPUT DE MOEDA
// ============================================================================
function formatarMoeda(elemento) {
    let v = elemento.value.replace(/\D/g, "");
    v = (v / 100).toFixed(2).replace(".", ",");

    // Formatação de milhares
    v = v.replace(/(\d)(\d{3})(\d{3}),/, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/, "$1.$2,");

    elemento.value = "R$ " + v;
}


// ============================================================================
// SALVAR GASTO (novo ou edição)
// ============================================================================
function salvarGasto() {
    const descricao = document.getElementById("descGasto").value;
    const categoria = document.getElementById("categoriaGasto")?.value || "outros";
    let valor = document.getElementById("valorGasto").value;

    // Limpa valor
    valor = valor.replace("R$", "").trim().replace(/\./g, "").replace(",", ".");
    valor = parseFloat(valor);

    if (!descricao || isNaN(valor) || valor <= 0) {
        return alert("Dados inválidos.");
    }

    const corpo = { descricao, valor, categoria };
    let url = "/gastos/novo";

    if (idGastoEmEdicao) {
        url = "/gastos/editar";
        corpo.idDespesa = idGastoEmEdicao;
    }

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    })
    .then(r => r.json())
    .then(data => {
        if (!data.ok) return alert("Erro: " + data.msg);

        alert(idGastoEmEdicao ? "Gasto atualizado!" : "Gasto criado!");
        fecharModal();
        carregarDadosFinanceiros();
    })
    .catch(err => console.error(err));
}


// ============================================================================
// CARREGAR DADOS FINANCEIROS
// ============================================================================
function carregarDadosFinanceiros() {
    fetch('/gastos/listar')
        .then(r => r.json())
        .then(data => {
            if (!data.ok) return;

            renderizarLista(data.gastos);
            atualizarCards(data.total, data.renda);
            renderizarGrafico(data.dadosGrafico);
            renderizarPizza(data.dadosPizza);
        })
        .catch(err => console.error("Erro carregar:", err));
}


// ============================================================================
// LISTA DE GASTOS
// ============================================================================
function renderizarLista(lista) {
    const div = document.getElementById("lista-gastos");
    if (!div) return;

    div.innerHTML = "";

    if (!lista || lista.length === 0) {
        return (div.innerHTML = "<p class='msg-vazio'>Nenhum gasto recente.</p>");
    }

    lista.forEach(item => {
        const valorF = parseFloat(item.valorGasto).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const linha = document.createElement("div");
        linha.classList.add("item-gasto");

        linha.innerHTML = `
            <div style="flex:1; display:flex; flex-direction:column;">
                <span class="desc">${item.descricao}</span>
                <span class="categoria">${item.categoria}</span>
            </div>

            <span class="data">${item.dataFormatada}</span>
            <span class="valor-gasto">- ${valorF}</span>

            <div class="acoes-item">
                <button class="btn-icon editar"
                    onclick="prepararEdicao(${item.pk_idDespesa}, '${item.descricao}', ${item.valorGasto}, '${item.categoria}')">✏️</button>

                <button class="btn-icon deletar"
                    onclick="deletarGasto(${item.pk_idDespesa})">🗑️</button>
            </div>
        `;

        div.appendChild(linha);
    });
}


// ============================================================================
// ATUALIZAR CARDS
// ============================================================================
function atualizarCards(total, renda) {
    const gasto = parseFloat(total);
    const rendaNum = parseFloat(renda);
    const economia = rendaNum - gasto;

    const cards = document.querySelectorAll('.card-info .valor');
    if (cards[0]) cards[0].innerText = gasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (cards[1]) {
        cards[1].innerText = economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        cards[1].style.color = economia < 0 ? '#ff5555' : '#4caf50';
    }
}


// ============================================================================
// EDIÇÃO
// ============================================================================
function prepararEdicao(id, desc, valor, categoria) {
    idGastoEmEdicao = id;

    document.querySelector(".modal h2").innerText = "Editar Gasto";
    document.getElementById("descGasto").value = desc;
    document.getElementById("categoriaGasto").value = categoria;

    const valorF = parseFloat(valor).toFixed(2).replace(".", ",");
    document.getElementById("valorGasto").value = "R$ " + valorF;

    modal.style.display = "flex";
}


// ============================================================================
// DELETAR
// ============================================================================
function deletarGasto(id) {
    if (!confirm("Tem certeza que deseja apagar este gasto?")) return;

    fetch('/gastos/deletar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idDespesa: id })
    })
    .then(r => r.json())
    .then(data => {
        if (!data.ok) return alert("Erro ao apagar.");
        carregarDadosFinanceiros();
    });
}


// ============================================================================
// GRÁFICO LINHA (EVOLUÇÃO)
// ============================================================================
function renderizarGrafico(dados) {
    const ctx = document.getElementById("graficoLinha");
    if (!ctx) return;

    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

    const labels = dados?.map(d => meses[d.mes - 1]) || ["Jan","Fev","Mar"];
    const valores = dados?.map(d => d.total) || [0,0,0];

    if (chartLinhaInstance) chartLinhaInstance.destroy();

    chartLinhaInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Gastos',
                data: valores,
                borderColor: '#4a09ff',
                backgroundColor: 'rgba(74,9,255,0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#ccc' }, grid: { color: '#333' } },
                x: { ticks: { color: '#ccc' }, grid: { display: false } }
            }
        }
    });
}


// ============================================================================
// GRÁFICO PIZZA (CATEGORIAS)
// ============================================================================
function renderizarPizza(dados) {
    const ctx = document.getElementById("graficoPizza");
    if (!ctx) return;

    const cores = {
        'alimentação': '#FF6384',
        'transporte': '#36A2EB',
        'lazer': '#FFCE56',
        'educação': '#4BC0C0',
        'saúde': '#9966FF',
        'roupas': '#FF9F40',
        'moradia': '#FF5733',
        'eventos': '#C70039',
        'outros': '#C9CBCF'
    };

    const labels = dados?.map(d => d.categoria.charAt(0).toUpperCase() + d.categoria.slice(1)) || [];
    const valores = dados?.map(d => d.total) || [];
    const coresUsadas = dados?.map(d => cores[d.categoria] || '#555') || [];

    if (chartPizzaInstance) chartPizzaInstance.destroy();

    chartPizzaInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{ data: valores, backgroundColor: coresUsadas, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "right",
                    labels: { color: "white", boxWidth: 15 }
                }
            }
        }
    });
}