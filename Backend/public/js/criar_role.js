window.addEventListener('load', () => {
    // Aplica formatação de dinheiro no input
    const inputValor = document.getElementById("input-valor");
    if(inputValor) {
        inputValor.addEventListener('input', function() {
            let valor = this.value.replace(/\D/g, "");
            valor = (valor / 100).toFixed(2) + "";
            valor = valor.replace(".", ",");
            valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
            valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
            this.value = "R$ " + valor;
        });
    }
});

// 1. Abre o Modal para escolher a hora
function abrirModalHorario(event) {
    if(event) event.preventDefault();
    
    // Validação
    const nome = document.getElementById("input-nome").value;
    const data = document.getElementById("input-data").value;
    
    if(!nome || !data) {
        alert("Preencha pelo menos o Nome e a Data!");
        return;
    }

    const modal = document.getElementById("meuModal");
    modal.classList.add("mostrar-modal");
}

// 2. Fecha o Modal
function apenasFecharModal() {
    document.getElementById("meuModal").classList.remove("mostrar-modal");
}

// 3. Envia para o Banco
function finalizarRealmente() {
    const nome = document.getElementById("input-nome").value;
    const local = document.getElementById("input-local").value;
    const dataDia = document.getElementById("input-data").value; // YYYY-MM-DD
    const valor = document.getElementById("input-valor").value;
    const qtd = document.getElementById("input-quantidade").value;
    
    // Pega a hora do modal
    let hora = document.getElementById("input-hora").value;
    if(!hora) hora = "00:00"; // Hora padrão se não preencher

    // Monta o DATETIME para o MySQL (YYYY-MM-DD HH:MM:00)
    const dataCompleta = `${dataDia} ${hora}:00`;

    const dados = {
        nomeEvento: nome,
        localEvento: local,
        dataEvento: dataCompleta,
        valorEvento: valor,
        QuantParticipantes: qtd
    };

    fetch("/events/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            alert("✅ Rolê Criado com Sucesso!");
            window.location.href = "meus_roles.html";
        } else {
            alert("Erro: " + data.msg);
        }
    })
    .catch(err => console.error(err));
}