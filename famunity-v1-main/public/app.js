import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx_GRWbpqfrvzJ5VmBksi4Fd9FU77rIvk",
  authDomain: "famunity-1.firebaseapp.com",
  projectId: "famunity-1",
  storageBucket: "famunity-1.firebasestorage.app",
  messagingSenderId: "374801967486",
  appId: "1:374801967486:web:6a17381f9c272f3ed0eb2f",
  measurementId: "G-QNSVDC7ZSG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✓ Firebase inicializado');
console.log('Auth:', auth);
console.log('DB:', db);

// Referências de elementos
const loginScreen = document.getElementById('login-screen');
const appScreen = document.getElementById('app-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupBtn = document.getElementById('signup-btn');
const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
const logoutBtn = document.getElementById('logout-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const userEmailEl = document.getElementById('user-email');
const taskForm = document.getElementById('task-form');
const taskName = document.getElementById('task-name');
const taskLocation = document.getElementById('task-location');
const taskDate = document.getElementById('task-date');
const taskTime = document.getElementById('task-time');
const taskPriority = document.getElementById('task-priority');
const taskVisibility = document.getElementById('task-visibility');
const taskDescription = document.getElementById('task-description');
const taskList = document.getElementById('task-list');
const loginAlert = document.getElementById('login-alert');
const loginSuccess = document.getElementById('login-success');
const signupAlert = document.getElementById('signup-alert');
const signupSuccess = document.getElementById('signup-success');
const taskAlert = document.getElementById('task-alert');
const taskSuccess = document.getElementById('task-success');

// Alertas
function showAlert(el, msg) {
  el.textContent = msg;
  el.classList.remove('d-none');
  setTimeout(() => el.classList.add('d-none'), 3000);
}

// Criar conta
signupBtn.addEventListener('click', () => {
  signupModal.show();
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const senha = document.getElementById('signup-senha').value.trim();
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, senha);
    
    // Salvar nome do usuário no Firestore
    await addDoc(collection(db, 'users'), {
      uid: userCred.user.uid,
      name: name,
      email: email,
      createdAt: serverTimestamp()
    });
    
    showAlert(signupSuccess, 'Conta criada com sucesso!');
    setTimeout(() => {
      signupForm.reset();
      signupModal.hide();
    }, 2000);
  } catch (err) {
    showAlert(signupAlert, 'Erro: ' + err.message);
  }
});

// Login com email/senha
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    showAlert(loginSuccess, 'Login realizado!');
    // Limpar formulário após login bem-sucedido
    loginForm.reset();
  } catch (err) {
    let mensagem = 'Erro ao fazer login';
    
    // Customizar mensagens de erro
    if (err.code === 'auth/invalid-login-credentials') {
      mensagem = 'Email ou senha incorretos';
    } else if (err.code === 'auth/user-not-found') {
      mensagem = 'Usuário não encontrado';
    } else if (err.code === 'auth/wrong-password') {
      mensagem = 'Senha incorreta';
    } else if (err.code === 'auth/invalid-email') {
      mensagem = 'Email inválido';
    } else if (err.code === 'auth/too-many-requests') {
      mensagem = 'Muitas tentativas. Tente novamente mais tarde';
    }
    
    showAlert(loginAlert, mensagem);
  }
});

// Login com Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

googleLoginBtn.addEventListener('click', async function () {
  try {
    console.log('Iniciando login com Google...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Login com Google bem-sucedido:', result.user.email);
    showAlert(loginSuccess, 'Login com Google realizado!');
  } catch (error) {
    console.error('Erro completo no login Google:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    showAlert(loginAlert, 'Erro no login com Google: ' + error.message);
  }
});

// Esqueci a Senha
forgotPasswordBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  if (!email) {
    showAlert(loginAlert, 'Digite seu email para recuperar a senha');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showAlert(loginSuccess, 'Email de recuperação enviado! Verifique sua caixa de entrada.');
  } catch (error) {
    showAlert(loginAlert, 'Erro: ' + error.message);
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

// Estado de autenticação
let tasksUnsubscribe = null;
onAuthStateChanged(auth, (user) => {
  console.log('onAuthStateChanged acionado, usuário:', user ? user.email : 'nenhum');
  
  if (user) {
    console.log('✓ Usuário autenticado:', user.email);
    userEmailEl.textContent = user.email;
    
    // Ocultar tela de login
    loginScreen.classList.add('hidden');
    
    // Mostrar tela do app
    appScreen.classList.remove('hidden');
    
    // Limpar alertas ao mudar de tela
    loginAlert.classList.add('d-none');
    loginSuccess.classList.add('d-none');
    
    console.log('Iniciando listener de tarefas para UID:', user.uid);
    startTasksListener(user.uid);
  } else {
    console.log('✗ Usuário desconectado');
    userEmailEl.textContent = '';
    
    // Mostrar tela de login
    loginScreen.classList.remove('hidden');
    
    // Ocultar tela do app
    appScreen.classList.add('hidden');
    
    if (typeof tasksUnsubscribe === 'function') tasksUnsubscribe();
    taskList.innerHTML = '';
  }
});

// Listener de tarefas
function startTasksListener(uid) {
  try {
    const ref = query(collection(db, 'users', uid, 'tasks'), orderBy('createdAt', 'desc'));
    tasksUnsubscribe = onSnapshot(ref, (snap) => {
      console.log('Tarefas carregadas:', snap.docs.length);
      taskList.innerHTML = '';
      
      if (snap.empty) {
        taskList.innerHTML = '<li class="list-group-item text-muted text-center">Nenhuma tarefa ainda. Adicione uma!</li>';
        return;
      }
      
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        // Determinar cor da prioridade
        let priorityColor = 'secondary';
        let priorityLabel = 'Média';
        if (data.priority === 'alta') {
          priorityColor = 'danger';
          priorityLabel = 'Alta';
        } else if (data.priority === 'baixa') {
          priorityColor = 'info';
          priorityLabel = 'Baixa';
        }
        
        // Formatar data e hora
        const dataFormatada = data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '-';
        const horaFormatada = data.time || '-';
        
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 mb-2">
                <input type="checkbox" class="form-check-input" ${data.done ? 'checked' : ''} data-id="${docSnap.id}" data-action="toggle" style="cursor: pointer; width: 20px; height: 20px;">
                <h6 class="mb-0 ${data.done ? 'text-muted text-decoration-line-through' : ''}">${data.name}</h6>
                <span class="badge bg-${priorityColor}">${priorityLabel}</span>
                <span class="badge ${data.visibility === 'publica' ? 'bg-success' : 'bg-secondary'}">
                  ${data.visibility === 'publica' ? '🌍 Pública' : '🔒 Privada'}
                </span>
              </div>
              
              <div class="small text-muted mb-2">
                ${data.location ? `<div><i class="bi bi-geo-alt"></i> ${data.location}</div>` : ''}
                ${data.date ? `<div><i class="bi bi-calendar"></i> ${dataFormatada}${data.time ? ` às ${horaFormatada}` : ''}</div>` : ''}
                ${data.description ? `<div><i class="bi bi-info-circle"></i> ${data.description}</div>` : ''}
              </div>
            </div>
            
            <div class="d-flex gap-2 ms-2">
              <button class="btn btn-sm btn-outline-danger" data-id="${docSnap.id}" data-action="delete" title="Remover">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `;
        taskList.appendChild(li);
      });
    }, (err) => {
      console.error('Erro ao carregar tarefas:', err);
      showAlert(taskAlert, 'Erro ao carregar tarefas');
    });
  } catch (err) {
    console.error('Erro ao iniciar listener:', err);
  }
}

// Adicionar tarefa
// Adicionar tarefa
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskName.value.trim();
  const location = taskLocation.value.trim();
  const date = taskDate.value;
  const time = taskTime.value;
  const priority = taskPriority.value;
  const visibility = taskVisibility.value;
  const description = taskDescription.value.trim();
  
  const user = auth.currentUser;
  if (!user || !name) {
    showAlert(taskAlert, 'Digite um nome para a tarefa');
    return;
  }

  try {
    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      name,
      location,
      date,
      time,
      priority,
      visibility,
      description,
      done: false,
      createdAt: serverTimestamp()
    });
    
    // Limpar formulário
    taskForm.reset();
    showAlert(taskSuccess, 'Tarefa adicionada com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar tarefa:', err);
    showAlert(taskAlert, 'Erro ao adicionar: ' + err.message);
  }
});

// Ações na lista - Eventos para botões e checkboxes
taskList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  const checkbox = e.target.closest('input[type="checkbox"]');
  
  let action, id;
  
  if (btn) {
    action = btn.getAttribute('data-action');
    id = btn.getAttribute('data-id');
  } else if (checkbox) {
    action = 'toggle';
    id = checkbox.getAttribute('data-id');
  }
  
  const user = auth.currentUser;
  if (!user || !id) return;

  const ref = doc(db, 'users', user.uid, 'tasks', id);

  try {
    if (action === 'delete') {
      await deleteDoc(ref);
      showAlert(taskSuccess, 'Tarefa removida!');
    } else if (action === 'toggle') {
      const docSnap = await getDoc(ref);
      const current = docSnap.data();
      await updateDoc(ref, { done: !current.done });
      showAlert(taskSuccess, current.done ? 'Marcada como pendente.' : 'Marcada como concluída.');
    }
  } catch (err) {
    console.error('Erro:', err);
    showAlert(taskAlert, 'Erro: ' + err.message);
  }
});