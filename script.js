// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZBsxBGEWBZi_SDyqCDyCeDewE8oGj6V4",
  authDomain: "gerenciador-atividades-62786.firebaseapp.com",
  databaseURL: "https://gerenciador-atividades-62786-default-rtdb.firebaseio.com",
  projectId: "gerenciador-atividades-62786",
  storageBucket: "gerenciador-atividades-62786.firebasestorage.app",
  messagingSenderId: "859791411908",
  appId: "1:859791411908:web:83ac6e5ac7505c8c039791",
  measurementId: "G-SZ028ZGDFH"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Seletores
const form = document.getElementById('atividadeForm');
const atividadesList = document.getElementById('atividadesList');

// Função para converter data YYYY-MM-DD → DD/MM/AAAA
function formatarDataBR(dataISO) {
  if (!dataISO) return "";
  const partes = dataISO.split("-"); // [AAAA, MM, DD]
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para adicionar atividade
function adicionarAtividade(e) {
  e.preventDefault();
  const materia = document.getElementById('materia').value;
  const descricao = document.getElementById('descricao').value;
  const dataEntrega = document.getElementById('dataEntrega').value;

  const novaAtividade = { materia, descricao, dataEntrega };
  db.ref('atividades').push(novaAtividade);

  form.reset();
}

// Inicializa formulário para adicionar
form.onsubmit = adicionarAtividade;

// Carregar atividades em tempo real
db.ref('atividades').on('value', snapshot => {
  atividadesList.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    Object.keys(data).forEach(key => {
      const atividade = data[key];
      const div = document.createElement('div');
      div.classList.add('atividade');

      // Converter data para BR só na exibição
      const dataBR = formatarDataBR(atividade.dataEntrega);

      div.innerHTML = `
        <h3>${atividade.materia}</h3>
        <p>${atividade.descricao}</p>
        <span>Data de entrega: ${dataBR}</span>
        <div style="margin-top: 5px;">
          <button class="edit-btn" onclick="editarAtividade('${key}')">Editar</button>
          <button class="delete-btn" onclick="deletarAtividade('${key}')">Excluir</button>
        </div>
      `;
      atividadesList.appendChild(div);
    });
  }
});

// Deletar atividade
function deletarAtividade(id) {
  db.ref('atividades/' + id).remove();
}

// Editar atividade
function editarAtividade(id) {
  db.ref('atividades/' + id).once('value').then(snapshot => {
    const atividade = snapshot.val();

    // Preencher formulário com dados atuais
    document.getElementById('materia').value = atividade.materia;
    document.getElementById('descricao').value = atividade.descricao;
    document.getElementById('dataEntrega').value = atividade.dataEntrega; // YYYY-MM-DD (compatível com <input type="date">)

    // Alterar botão do formulário para atualizar
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = "Atualizar Atividade";

    // Alterar comportamento do formulário para atualizar
    form.onsubmit = function(e) {
      e.preventDefault();
      const materia = document.getElementById('materia').value;
      const descricao = document.getElementById('descricao').value;
      const dataEntrega = document.getElementById('dataEntrega').value;

      db.ref('atividades/' + id).set({ materia, descricao, dataEntrega });

      form.reset();
      submitButton.textContent = "Adicionar Atividade";
      form.onsubmit = adicionarAtividade; // Voltar para adicionar normalmente
    };
  });
}
