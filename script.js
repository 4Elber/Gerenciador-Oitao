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

// Adicionar atividade
form.addEventListener('submit', e => {
  e.preventDefault();
  const materia = document.getElementById('materia').value;
  const descricao = document.getElementById('descricao').value;
  const dataEntrega = document.getElementById('dataEntrega').value;

  const novaAtividade = { materia, descricao, dataEntrega };
  db.ref('atividades').push(novaAtividade);

  form.reset();
});

// Carregar atividades em tempo real
db.ref('atividades').on('value', snapshot => {
  atividadesList.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    Object.keys(data).forEach(key => {
      const atividade = data[key];
      const div = document.createElement('div');
      div.classList.add('atividade');
      div.innerHTML = `
        <h3>${atividade.materia}
          <button class="delete-btn" onclick="deletarAtividade('${key}')">Excluir</button>
        </h3>
        <p>${atividade.descricao}</p>
        <span>Data de entrega: ${atividade.dataEntrega}</span>
      `;
      atividadesList.appendChild(div);
    });
  }
});

// Deletar atividade
function deletarAtividade(id) {
  db.ref('atividades/' + id).remove();
}
