window.addEventListener('load', () => {
    carregarEventos();
});

function carregarEventos() {
    fetch("/events")
        .then(r => r.json())
        .then(data => {
            const lista = document.getElementById("lista-eventos");
            lista.innerHTML = "";

            if (!data.ok || data.eventos.length === 0) {
                lista.innerHTML = "<p style='color:#ccc; text-align:center; font-size:1.2rem;'>Nenhum rolê marcado. Bora marcar um?</p>";
                return;
            }

            data.eventos.forEach(ev => {
                const card = document.createElement("div");
                card.classList.add("card-role");

                // Estrutura do Card
                card.innerHTML = `
                    <div class="card-header">
                        <span>${ev.nomeEvento}</span>
                        <span class="seta-icon">▼</span>
                    </div>
                    <div class="card-body" style="display:none;">
                        <p class="loading">Carregando detalhes...</p>
                    </div>
                `;

                // Clique no Cabeçalho
                const header = card.querySelector(".card-header");
                const body = card.querySelector(".card-body");

                header.onclick = () => {
                    const estaAberto = card.classList.contains("aberto");

                    // Fecha todos os outros
                    document.querySelectorAll(".card-role").forEach(c => {
                        c.classList.remove("aberto");
                        c.querySelector(".card-body").style.display = "none";
                    });

                    if (!estaAberto) {
                        card.classList.add("aberto");
                        body.style.display = "block";
                        buscarDetalhes(ev.pk_idEvento, body); // Busca no banco
                    }
                };

                lista.appendChild(card);
            });
        })
        .catch(err => console.error("Erro:", err));
}

function buscarDetalhes(id, container) {
    fetch(`/events/${id}`)
        .then(r => r.json())
        .then(info => {
            if (!info.ok) {
                container.innerHTML = "<p>Erro ao carregar.</p>";
                return;
            }

            // Formatação de Data e Hora
            let dataTexto = "Data a definir";
            if (info.evento.dataEvento) {
                const d = new Date(info.evento.dataEvento);
                dataTexto = d.toLocaleDateString('pt-BR') + " às " + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            }

            // Formatação de Dinheiro
            const custo = parseFloat(info.gasto?.valorGasto || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            container.innerHTML = `
                <p><strong>📅 Quando:</strong> ${dataTexto}</p>
                <p><strong>📍 Onde:</strong> ${info.evento.localEvento}</p>
                <p><strong>👥 Galera:</strong> ${info.evento.QuantParticipantes} pessoas</p>
                <p><strong>💰 Investimento:</strong> ${custo}</p>
                
                <div style="text-align: right; margin-top: 15px;">
                    <button onclick="excluirRole(${id})" style="background:#ff4444; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer;">
                        Cancelar Rolê
                    </button>
                </div>
            `;
        });
}

function excluirRole(id) {
    if(!confirm("Tem certeza que vai cancelar?")) return;

    fetch('/events/excluir', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(data => {
        if(data.ok) {
            alert("Cancelado!");
            carregarEventos(); // Recarrega a lista
        } else {
            alert("Erro: " + data.msg);
        }
    });
}