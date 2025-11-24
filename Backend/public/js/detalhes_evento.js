const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`/events/${id}`)
    .then(r => r.json())
    .then(data => {
        if (!data.ok) return;

        document.getElementById("titulo").textContent = data.evento.nomeEvento;
        document.getElementById("data").textContent = "Data: " + data.evento.dataEvento;
        document.getElementById("local").textContent = "Local: " + data.evento.localEvento;
        document.getElementById("quant").textContent = "Participantes: " + data.evento.QuantParticipantes;
    });