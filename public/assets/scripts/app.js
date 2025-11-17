 const dados = [
  {
    "id": 1,
    "titulo": "RRT Mulheres em Treinamento",
    "descricao": "Novo plano visa melhorar o condicionamento fisíco e capacitar as mulheres para que saibao o mínimo para poder se defender, uma vez que vivemos em um mundo em que os valores humanos estão se perdendo.",
    "conteudo": "O  CT RRT vem com a criação deste projeto em prol de uma sociedade capacitada e conciente de sua força e capacidade, entendendo que a arte suave pode salvar vidas.",
    "categoria": "Esporte",
    "autor": "Robson Ribeiro",
    "data": "2025-03-30",
    "imagem": "assets/img/Imagem do WhatsApp de 2025-10-05 à(s) 17.17.18_392f49c6.jpg"
  },
  {
    "id": 2,
    "titulo": "Jiu Jitsu Muito Mais que um Esporte",
    "descricao": "Capacidades trabalhadas nas aulas de Jiu Jitsu.",
    "conteudo": "Onde Voce aprende muito mais que só um esporte mas tambem encontra uma familia e acaba entendendo que a luta e muito mais do que um esporte, e uma escola de disciplina, respeito, carater, onde são formados seres humanos capazes de conviver em uma sociedade dignos de respeito e reconhecimento.",
    "categoria": "Esporte",
    "autor": "Robson Ribeiro",
    "data": "2025-03-28",
    "imagem": "assets/img/Imagem do WhatsApp de 2025-10-05 à(s) 17.58.12_00903386.jpg"
  },
  {
    "id": 3,
    "titulo": "Honrarias ao Mestre Robson Ribeiro",
    "descricao": "Evento Esportivo onde foi realizado a entrega de honrarias ao Mestre Robson Ribeiro.",
    "conteudo": "Entrega De Reconhecimento .",
    "categoria": "Esporte",
    "autor": "Bruno N Cunha",
    "data": "2025-03-27",
    "imagem": "assets/img/Imagem do WhatsApp de 2025-10-05 à(s) 17.59.00_277bc63f.jpg"
  }
]

const montarItemBlog = function(dadosItem){
  return `
    <div class="col-lg-4 mb-5">
      <article class="card blog-item" data-id="${dadosItem.id}">
        <img src="${dadosItem.imagem}" alt="${dadosItem.descricao}">
        <div class="card-body">
          <h5>${dadosItem.categoria}</h5>  
          <h3>${dadosItem.titulo}</h3>
          <p>${dadosItem.descricao}</p>
          <div class="blog-metadado">${dadosItem.data} - ${dadosItem.autor}</div>
        </div>
      </article>
    </div>
  `;
};

const montarListaBlog = function(dados){
  let html = '';
  dados.forEach(item => {
    html += montarItemBlog(item);
  });

  return html;
};

const montarDetalhe = function(id){
  debugger;
  const post = dados.find(item => item.id == id);
  if (!post){
    alert("Artigo não encontrado.")
    document.location.href = "index.html";
  }

  const postHtml = document.getElementById("post");
  
  postHtml.innerHTML = `
    <h5>${post.categoria}</h5>
    <h2>${post.titulo}</h2>
    <div class="pb-4">${post.data} - ${post.autor}</div>
    <img src="${post.imagem}" alt="${post.descricao}" class="mb-3" width="100%"/>
    <p>${post.conteudo}</p>
  
  `;



}

document.addEventListener("DOMContentLoaded", function() {
  debugger;
  const list = document.getElementById("blog-list");
  if (list){
    list.innerHTML = montarListaBlog(dados);
  }
  else{
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    montarDetalhe(id);
  }


});


document.addEventListener('click', function(evt) {
  debugger;
  const item = evt.target.closest('.blog-item');
  if (!item)
    return;
  const id = item.dataset.id;
  document.location.href = 'detalhes.html?id=' + encodeURIComponent(id);
});

