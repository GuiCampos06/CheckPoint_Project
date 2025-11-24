fetch("/events")
    .then(r => r.json())
    .then(data => {
        const lista = document.getElementById("lista-eventos");

        lista.innerHTML = "";

        if (!data.ok || data.eventos.length === 0) {
            lista.innerHTML = "<p style='color:white;text-align:center;'>Nenhum rolê encontrado.</p>";
            return;
        }

        data.eventos.forEach(ev => {
            const card = document.createElement("div");
            card.classList.add("card-role");

            card.innerHTML = `
                <div class="card-header">
                    ${ev.nomeEvento}
                    <span class="seta-icon">▼</span>
                </div>

                <div class="card-body">
                    <p>Carregando...</p>
                </div>
            `;

            const header = card.querySelector(".card-header");
            const body = card.querySelector(".card-body");

            header.onclick = () => {
                const aberto = card.classList.contains("aberto");

             
                document.querySelectorAll(".card-role").forEach(c => {
                    c.classList.remove("aberto");
                    c.querySelector(".card-body").style.display = "none";
                });

                if (!aberto) {
                    card.classList.add("aberto");

                    fetch(`/events/${ev.pk_idEvento}`)
                        .then(r => r.json())
                        .then(info => {
                            if (!info.ok) { 
                                body.innerHTML = "<p>Erro ao carregar detalhes.</p>";
                                return};
                            
                            const gasto = info.gasto?.valorGasto ?? 0;
                            let dataFormatada = "Data não definida";

                            if (info.evento.dataEvento) {
                                const dataObj = new Date(info.evento.dataEvento);
                                const offset = dataObj.getTimezoneOffset() * 60000;
                                const corrigida = new Date(dataObj.getTime() + offset);
                                dataFormatada = corrigida.toLocaleDateString("pt-BR");
                            }

                            body.innerHTML = `
                                <p><strong>Data:</strong> ${dataFormatada}</p>
                                <p><strong>Local:</strong> ${info.evento.localEvento}</p>
                                <p><strong>Participantes:</strong> ${info.evento.QuantParticipantes}</p>
                                <p><strong>Gastos:</strong> R$ ${Number(gasto).toFixed(2)}</p>
                            `;

                            body.style.display = "block";
                        });
                }
            };

            lista.appendChild(card);
        });
    });
    window.addEventListener('load', () => {
    const paginaAtual = window.location.pathname;
    
    if(paginaAtual.includes('menu_inicial') || paginaAtual.includes('criar_role')) {
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
function alternarMenu(event) {
   
    if (event) event.stopPropagation();

    var menu = document.getElementById("menuUsuario");

    menu.classList.toggle("mostrar");
}