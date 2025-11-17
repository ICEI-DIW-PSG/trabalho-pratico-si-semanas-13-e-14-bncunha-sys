function addGlobalEvent(event, selector, handler) {
document.addEventListener(event, function(e) {
        if (e.target.matches(selector)) {
            handler(e);
        }
    });
}
document.addGlobalEvent = addGlobalEvent;

function buscarUsuarios() {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';
            data.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-end">${user.id}</td>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.telefone}</td>
                    <td class="text-center">
                        <a href="#" class="btn btn-sm btn-primary btn-edit" data-id="${user.id}">Editar</a>
                        <a href="#" class="btn btn-sm btn-danger btn-delete" data-id="${user.id}">Excluir</a>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            document.getElementById('table_footer').innerText = `Exibindo ${data.length} usuário(s)`;
        })
        .catch(error => console.error('Erro ao buscar usuários:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    buscarUsuarios();
});

document.addGlobalEvent('click', ".btn-edit", function(e) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    fetch(`/api/usuarios/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('id').value = data.id;
            document.getElementById('nome').value = data.nome;
            document.getElementById('email').value = data.email;
            document.getElementById('telefone').value = data.telefone;
        })
        .catch(error => console.error('Erro ao buscar usuário:', error));
    const myModalAlternative = new bootstrap.Modal('#mdl_edit', {}).show();
});

document.addGlobalEvent('click', ".btn-delete", function(e) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Usuário excluído com sucesso!');
                location.reload();
            } else {
                alert('Erro ao excluir usuário.');
            }
        })
        .catch(error => console.error('Erro ao excluir usuário:', error));
    }
});

document.addGlobalEvent('submit', 'form', function(e) {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/api/usuarios/${id}` : '/api/usuarios';

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, telefone })
    })
    .then(response => {
        if (response.ok) {
            alert('Usuário salvo com sucesso!');
            location.reload();
        } else {
            alert('Erro ao salvar usuário.');
        }
    })
    .catch(error => console.error('Erro ao salvar usuário:', error));
});

document.addGlobalEvent('click', ".btn-create", function(e) {
    e.preventDefault();
    document.getElementById('id').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    const modal = new bootstrap.Modal('#mdl_edit', {}).show();
});
  