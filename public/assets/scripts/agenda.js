function addGlobalEvent(event, selector, handler) {
    document.addEventListener(event, function (e) {
        if (e.target.matches(selector)) handler(e);
    });
}
document.addGlobalEvent = addGlobalEvent;

const API = "/api"; // compatível com cadastro.js

document.addEventListener("DOMContentLoaded", function () {
    debugger;
    carregarUsuariosDropDown();

    // Inicializa o calendário
    $('#calendar').fullCalendar({
        selectable: true,
        editable: false,

        select: function (start) {
            abrirModalCriar(start);
        },

        eventClick: function (event) {
            abrirModalEditar(event);
        },

        events: function (start, end, timezone, callback) {

    // 1) Carrega compromissos
    fetch(`${API}/compromissos`)
        .then(res => res.json())
        .then(compromissos => {

            // 2) Carrega usuários
            fetch(`${API}/usuarios`)
                .then(r => r.json())
                .then(usuarios => {
                    debugger;

                    const eventos = [];

                    // 3) Mesclar compromissos + usuários (join manual)
                    for (let c of compromissos) {

                        // achar o usuário correspondente
                        let usuarioEncontrado = null;

                        for (let u of usuarios) {
                            if (u.id === c.usuarioId) {
                                usuarioEncontrado = u;
                                break;
                            }
                        }

                        // calcular fim com base na duração
                        const fim = new Date(c.start);
                        fim.setMinutes(fim.getMinutes() + c.duration);

                        eventos.push({
                            id: c.id,
                            title: usuarioEncontrado ? usuarioEncontrado.nome : "Sem usuário",
                            start: c.start,
                            end: fim,
                            duration: c.duration,
                            usuarioId: c.usuarioId
                        });
                    }

                    // 4) Envia para o calendário
                    callback(eventos);
                });
        });
}

    });
});


// ----------------------------------------------
// CARREGAR USUÁRIOS NO DROPDOWN
// ----------------------------------------------
function carregarUsuariosDropDown() {
    fetch(`${API}/usuarios`)
        .then(res => res.json())
        .then(lista => {
            const ddl = document.getElementById("userId");
            ddl.innerHTML = "";

            lista.forEach(u => {
                ddl.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
            });
        });
}


// ----------------------------------------------
// ABRIR MODAL - CRIAR
// ----------------------------------------------
function abrirModalCriar(start) {
    debugger;
    carregarUsuariosDropDown();

    document.getElementById("compromissoId").value = "";
    document.getElementById("start").value = formatarDataHora(start);;
    document.getElementById("duration").value = 60;

    document.getElementById("btnExcluir").style.display = "none";

    new bootstrap.Modal("#compromissoModal").show();
}


// ----------------------------------------------
// ABRIR MODAL - EDITAR
// ----------------------------------------------
function abrirModalEditar(evento) {
    carregarUsuariosDropDown();

    document.getElementById("compromissoId").value = evento.id;
    document.getElementById("start").value = formatarDataHora(evento.start);
    document.getElementById("duration").value = evento.duration;
    document.getElementById("userId").value = evento.usuarioId;

    document.getElementById("btnExcluir").style.display = "inline-block";

    new bootstrap.Modal("#compromissoModal").show();
}


// ----------------------------------------------
// SALVAR (Create/Update)
// ----------------------------------------------
document.addGlobalEvent("click", "#btnSalvar", function () {

    const id = document.getElementById("compromissoId").value;

    const payload = {
        start: document.getElementById("start").value,
        duration: parseInt(document.getElementById("duration").value),
        usuarioId: parseInt(document.getElementById("userId").value)
    };

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API}/compromissos/${id}` : `${API}/compromissos`;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw "Erro ao salvar";
            $('#compromissoModal').modal('hide');
            $('#calendar').fullCalendar('refetchEvents');
        })
        .catch(err => alert(err));
});


// ----------------------------------------------
// DELETAR
// ----------------------------------------------
document.addGlobalEvent("click", "#btnExcluir", function () {

    const id = document.getElementById("compromissoId").value;
    if (!id) return;

    if (!confirm("Deseja realmente excluir este compromisso?"))
        return;

    fetch(`${API}/compromissos/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) throw "Erro ao excluir";

            $('#compromissoModal').modal('hide');
            $('#calendar').fullCalendar('refetchEvents');
        })
        .catch(err => alert(err));
});


// ----------------------------------------------
// UTIL
// ----------------------------------------------
function formatarDataHora(date) {
    debugger;
    let tmp = moment.parseZone(date).format("YYYY-MM-DDTHH:mm").toString().replaceAll("P", "T").replaceAll("A", "T");
    return tmp;
}

function toInputDateTime(dt) {
    return moment(dt).format("DD/MM/YYYY HH:mm");
}

