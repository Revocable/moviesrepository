function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

function updateTime() {
  const clock = document.getElementById('clock');
  if (clock) {
    clock.innerText = getTime();
  }
}

document.getElementById('filmeButton').addEventListener('click', showFilmeForm);
document.getElementById('usuarioButton').addEventListener('click', showUsuarioForm);
document.getElementById('favoritosButton').addEventListener('click', showFavoritosForm);

function showFilmeForm(event) {
  event.preventDefault();

  const boxForm = document.querySelector('.boxForm');

  boxForm.innerHTML = '';

  const filmeForm = document.createElement('form');
  filmeForm.id = 'filmeForm';
  filmeForm.classList.add('m-0');

  const tituloInput = createInput('text', 'titulo', 'Título', 'form-control');
  const diretorInput = createInput('text', 'diretor', 'Diretor', 'form-control');
  const anoInput = createInput('number', 'ano', 'Ano de Lançamento', 'form-control');
  const generoInput = createInput('text', 'genero', 'Gênero', 'form-control');

  filmeForm.appendChild(createFormGroup(tituloInput, 'mt-2'));
  filmeForm.appendChild(createFormGroup(diretorInput, 'mt-2'));
  filmeForm.appendChild(createFormGroup(anoInput, 'mt-2'));
  filmeForm.appendChild(createFormGroup(generoInput, 'mt-2'));

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Cadastrar Filme';
  submitButton.classList.add('btn', 'btn-primary', 'mt-2');

  submitButton.addEventListener('click', submitFilmeForm);

  filmeForm.appendChild(submitButton);

  boxForm.appendChild(filmeForm);
  exibirFilmes();

}

function createFormGroup(element, marginClass) {
  const formGroup = document.createElement('div');
  formGroup.classList.add('form-group', marginClass);
  formGroup.appendChild(element);
  return formGroup;
}

function createInput(type, name, placeholder, classes) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.required = true;
  input.classList.add(classes);
  return input;
}

function submitFilmeForm(event) {
  event.preventDefault();

  const titulo = document.getElementById('filmeForm').elements['titulo'].value;
  const diretor = document.getElementById('filmeForm').elements['diretor'].value;
  const ano = document.getElementById('filmeForm').elements['ano'].value;
  const genero = document.getElementById('filmeForm').elements['genero'].value;

  console.log('Dados do Filme:', titulo, diretor, ano, genero);

  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('diretor', diretor);
  formData.append('anoLancamento', ano);
  formData.append('genero', genero);

  console.log('FormData:', formData);

  fetch('/trabalhoFinal/filme/', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro na requisição: ${response.status} - ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      Toastify({
        text: "Filme cadastrado com sucesso!",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
    })
    .catch((error) => {
      console.error(error);
      exibirFilmes();
      if (error.message.includes("alguma condição específica")) {
        Toastify({
          text: "Erro específico ao cadastrar filme.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "orange",
        }).showToast();
      } else {
        Toastify({
          text: "Erro ao cadastrar filme.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    });

    exibirFilmes();
}

function showUsuarioForm(event) {
  event.preventDefault();

  const smartImgDiv = document.querySelector('.smartImg');
  smartImgDiv.innerHTML = '';

  const clockDiv = document.createElement('div');
  clockDiv.id = 'clock';

  smartImgDiv.appendChild(clockDiv);

  function updateTime() {
    const time = getTime();
    clockDiv.innerText = time;
  }

  updateTime();
  setInterval(updateTime, 1000);

  const boxForm = document.querySelector('.boxForm');
  boxForm.innerHTML = '';

  const usuarioForm = document.createElement('form');
  usuarioForm.id = 'usuarioForm';
  usuarioForm.classList.add('m-0');

  const nomeInput = createInput('text', 'nome', 'Nome', 'form-control');
  const emailInput = createInput('email', 'email', 'E-mail', 'form-control');
  const senhaInput = createInput('password', 'senha', 'Senha', 'form-control');

  usuarioForm.appendChild(createFormGroup(nomeInput, 'mt-2'));
  usuarioForm.appendChild(createFormGroup(emailInput, 'mt-2'));
  usuarioForm.appendChild(createFormGroup(senhaInput, 'mt-2'));

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Cadastrar Usuário';
  submitButton.classList.add('btn', 'btn-primary', 'mt-2');

  submitButton.addEventListener('click', submitUsuarioForm);

  usuarioForm.appendChild(submitButton);

  boxForm.appendChild(usuarioForm);
}

function submitUsuarioForm(event) {
  event.preventDefault();

  const nome = document.querySelector('#usuarioForm input[name="nome"]').value;
  const email = document.querySelector('#usuarioForm input[name="email"]').value;
  const senha = document.querySelector('#usuarioForm input[name="senha"]').value;

  // Construa o objeto FormData para enviar os dados como formulário
  const formData = new FormData();
  formData.append('signup', '1');
  formData.append('nome', nome);
  formData.append('login', email);
  formData.append('senha', senha);

  // Faça a requisição usando fetch
  fetch('/trabalhoFinal/usuario/', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // Processar a resposta do servidor
      console.log(data);

      // Exibir uma mensagem de sucesso usando Toastify
      Toastify({
        text: "Usuário cadastrado com sucesso!",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
    })
    .catch(error => {
      // Lidar com erros durante a requisição
      console.error(error);

      // Exibir uma mensagem de erro usando Toastify
      Toastify({
        text: "Erro ao cadastrar usuário.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    });
}

function showFavoritosForm(event) {
  event.preventDefault();

  // Fazer a requisição para obter a lista de filmes
  fetch('/trabalhoFinal/filme')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((filmes) => {
      console.log('Resposta do servidor:', filmes);

      const boxForm = document.querySelector('.boxForm');
      boxForm.innerHTML = '';

      const favoritosForm = document.createElement('form');
      favoritosForm.id = 'favoritosForm';
      favoritosForm.classList.add('m-0');

      // Verifique se 'filmes' é um objeto antes de usar for..in
      if (typeof filmes === 'object' && filmes !== null) {
        // Criar o elemento select e adicionar options para cada filme
        const filmeIdSelect = document.createElement('select');
        filmeIdSelect.name = 'id_filme';
        filmeIdSelect.classList.add('form-control', 'mt-2');

        for (const filmeId in filmes) {
          const filme = filmes[filmeId];
          const option = document.createElement('option');
          option.value = filme.id;
          option.text = filme.titulo;
          filmeIdSelect.add(option);
        }

        favoritosForm.appendChild(createFormGroup(filmeIdSelect, 'mt-2'));

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Cadastrar Favorito';
        submitButton.classList.add('btn', 'btn-primary', 'mt-2');

        submitButton.addEventListener('click', submitFavoritosForm);

        favoritosForm.appendChild(submitButton);

        boxForm.appendChild(favoritosForm);

        exibirFavoritos();
      } else {
        // Se não for um objeto, exiba uma mensagem de erro
        console.error('A resposta do servidor não é um objeto:', filmes);

        Toastify({
          text: "Erro ao obter a lista de filmes.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    })
    .catch((error) => {
      // Lidar com erros durante a requisição
      console.error(error);
      // Exibir uma mensagem de erro usando Toastify
      Toastify({
        text: "Erro ao obter a lista de filmes.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    });
}

function submitFavoritosForm(event) {
  event.preventDefault();
  const idFilmeSelect = document.querySelector('#favoritosForm select[name="id_filme"]');
  const idFilme = idFilmeSelect.options[idFilmeSelect.selectedIndex].value;
  const formData = new FormData();
  formData.append('adicionarFavorito', '1');
  formData.append('idFilme', idFilme);

  fetch('/trabalhoFinal/usuario', {
    method: 'POST',
    body: formData,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      Toastify({
        text: "Filme adicionado aos favoritos com sucesso!",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
    })
    .catch(error => {
      console.error(error);
      Toastify({
        text: "Erro ao adicionar filme aos favoritos.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    });

    exibirFavoritos();
}

function exibirFilmes() {
  const url = 'http://localhost/trabalhoFinal/filme';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const filmesDiv = document.createElement('div');
      filmesDiv.id = 'filmesDiv';

      Object.values(data).forEach(filme => {
        const filmeDiv = document.createElement('div');
        filmeDiv.classList.add('filme');

        filmeDiv.innerHTML = `
          <p>ID: ${filme.id}</p>
          <p>Título: ${filme.titulo}</p>
          <p>Diretor: ${filme.diretor}</p>
          <p>Ano de Lançamento: ${filme.ano_lancamento}</p>
          <p>Gênero: ${filme.genero}</p>
          <button value="${filme.id}" class="botaoDeletar">Deletar</button>
          <button value="${filme.id}" class="botaoEditar">Editar</button>
          <hr>
        `;

        filmeDiv.querySelector(".botaoDeletar").addEventListener("click", async function () {
          const idFilmeDeletar = this.value;
          const urlExclusao = `http://localhost/trabalhoFinal/filme/${idFilmeDeletar}`;

          try {
            const response = await fetch(urlExclusao, {
              method: 'DELETE',
            });

            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Filme deletado com sucesso:', data);

            exibirFilmes();
          } catch (error) {
            console.error('Erro ao deletar filme:', error);
          }
        });

        filmeDiv.querySelector(".botaoEditar").addEventListener("click", function () {
          const idFilmeEditar = this.value;

          console.log('Clicou em editar, ID do Filme:', idFilmeEditar);
          exibirFormularioEdicao(idFilmeEditar);
        });

        filmesDiv.appendChild(filmeDiv);
      });

      const smartDiv = document.querySelector('.smartImg');
      smartDiv.innerHTML = ''; // Limpar o conteúdo existente
      smartDiv.appendChild(filmesDiv);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function exibirFormularioEdicao(idFilme) {
  // Criar o formulário de edição
  const formularioEdicao = document.createElement('form');
  formularioEdicao.id = 'formularioEdicao';

  // Função assíncrona para obter os detalhes do filme
  async function getFilmeId() {
    const urlDetalhes = `http://localhost/trabalhoFinal/filme/${idFilme}`;
    try {
      const response = await fetch(urlDetalhes);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter detalhes do filme:', error);
    }
  }

  getFilmeId().then(filmeDetalhes => {
    console.log('Detalhes do Filme:', filmeDetalhes);

    formularioEdicao.innerHTML = `
      <label for="tituloEdit">Título:</label>
      <input type="text" id="tituloEdit" name="tituloEdit" value="${filmeDetalhes.titulo}" required>

      <label for="diretorEdit">Diretor:</label>
      <input type="text" id="diretorEdit" name="diretorEdit" value="${filmeDetalhes.diretor}" required>

      <label for="anoLancamentoEdit">Ano de Lançamento:</label>
      <input type="number" id="anoLancamentoEdit" name="anoLancamentoEdit" value="${filmeDetalhes.ano_lancamento}" required>

      <label for="generoEdit">Gênero:</label>
      <input type="text" id="generoEdit" name="generoEdit" value="${filmeDetalhes.genero}" required>

      <button type="button" id="botaoSalvarEdicao">Salvar</button>
    `;

    const smartDiv = document.querySelector('.smartImg');
    // Limpar o conteúdo existente antes de adicionar o formulário
    smartDiv.innerHTML = '';
    smartDiv.appendChild(formularioEdicao);

    document.getElementById('botaoSalvarEdicao').addEventListener('click', function () {
      const urlEdicao = `http://localhost/trabalhoFinal/filme.php/${idFilme}`;

      const dadosEdicao = new URLSearchParams();
      dadosEdicao.append('id', idFilme);
      dadosEdicao.append('titulo', document.getElementById('tituloEdit').value);
      dadosEdicao.append('diretor', document.getElementById('diretorEdit').value);
      dadosEdicao.append('anoLancamento', document.getElementById('anoLancamentoEdit').value);
      dadosEdicao.append('genero', document.getElementById('generoEdit').value);

      fetch(urlEdicao, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: dadosEdicao,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Filme editado com sucesso:', data);

          formularioEdicao.remove();

          exibirFilmes();
        })
        .catch(error => {
          console.error('Erro ao editar filme:', error);
        });
    });
  });
}

function exibirFavoritos() {
  const url = 'usuario/obterFilmesFavoritos';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const favoritosDiv = document.createElement('div');
      favoritosDiv.id = 'favoritosDiv';
      if (data.filmesFavoritos) {
        Object.values(data.filmesFavoritos).forEach(filmeFavorito => {
          const filmeFavoritoDiv = document.createElement('div');
          filmeFavoritoDiv.classList.add('filmeFavorito');

          filmeFavoritoDiv.innerHTML = `
            <p>Título: ${filmeFavorito.titulo}</p>
            <p>Diretor: ${filmeFavorito.diretor}</p>
            <p>Ano de Lançamento: ${filmeFavorito.ano_lancamento}</p>
            <p>Gênero: ${filmeFavorito.genero}</p>
            <button value="${filmeFavorito.id}" class="botaoRemoverFavorito">Remover Favorito</button>
            <hr>
          `;

          filmeFavoritoDiv.querySelector(".botaoRemoverFavorito").addEventListener("click", function(){
            const idFilmeFavoritoRemover = this.value;

            const urlRemocaoFavorito = `usuario/removerFavorito/${idFilmeFavoritoRemover}`;


            fetch(urlRemocaoFavorito, {
              method: 'DELETE',
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Favorito removido com sucesso:', data);

                exibirFavoritos();
              })
              .catch(error => {
                console.error('Erro ao remover favorito:', error);
              });
          });

          favoritosDiv.appendChild(filmeFavoritoDiv);
        });
      } else {
        favoritosDiv.innerHTML = '<p>Nenhum filme favorito encontrado.</p>';
      }

      const smartDiv = document.querySelector('.smartImg');
      smartDiv.innerHTML = '';
      smartDiv.appendChild(favoritosDiv);
    })
    .catch(error => {
      console.error('Erro na requisição de filmes favoritos:', error);
    });
}

updateTime();
setInterval(updateTime, 1000);

function showIndex(event) {
  event.preventDefault();

  boxForm.innerHTML = '';

  let smartDivremove = document.querySelector('.smartImg');

  let newSmartDivremove = document.createElement('div');
  newSmartDivremove.classList.add('smartImg');

  newSmartDivremove.style.backgroundImage = 'url(./assets/smartphone.png)';

  const clockDiv = document.createElement('div');
  clockDiv.id = 'clock';

  newSmartDivremove.appendChild(clockDiv);

  function updateTime() {
    const time = getTime();
    clockDiv.innerText = time;
  }

  updateTime();
  setInterval(updateTime, 1000);

  smartDivremove.parentNode.replaceChild(newSmartDivremove, smartDivremove);

  smartDivremove = newSmartDivremove;
}