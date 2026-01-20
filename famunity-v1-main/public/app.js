import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, query, orderBy, onSnapshot, where, getDocs, writeBatch, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const taskRecurrence = document.getElementById('task-recurrence');
const taskCustomDays = document.getElementById('task-custom-days');
const taskNotificationTime = document.getElementById('task-notification-time');
const taskNotificationUnit = document.getElementById('task-notification-unit');
const taskList = document.getElementById('task-list');
const loginAlert = document.getElementById('login-alert');
const loginSuccess = document.getElementById('login-success');
const signupAlert = document.getElementById('signup-alert');
const signupSuccess = document.getElementById('signup-success');
const taskAlert = document.getElementById('task-alert');
const taskSuccess = document.getElementById('task-success');

// Elementos de Amigos e Notificações
const searchUserInput = document.getElementById('search-user-input');
const searchUserBtn = document.getElementById('search-user-btn');
const searchResults = document.getElementById('search-results');
const userSearchList = document.getElementById('user-search-list');
const friendRequestsList = document.getElementById('friend-requests-list');
const friendsList = document.getElementById('friends-list');
const notificationsList = document.getElementById('notifications-list');
const friendCountBadge = document.getElementById('friend-count-badge');
const friendRequestsBadge = document.getElementById('friend-requests-badge');
const notificationCountBadge = document.getElementById('notification-count-badge');
const publicTasksModal = new bootstrap.Modal(document.getElementById('publicTasksModal'));
const friendProfileModal = new bootstrap.Modal(document.getElementById('friendProfileModal'));
const friendPublicTasksList = document.getElementById('friend-public-tasks-list');
const friendNameModal = document.getElementById('friend-name-modal');
const profileFriendName = document.getElementById('profile-friend-name');
const profileFriendEmail = document.getElementById('profile-friend-email');
const profileFriendTasksCount = document.getElementById('profile-friend-tasks-count');
const profileFriendPublicTasksCount = document.getElementById('profile-friend-public-tasks-count');
const removeFriendBtn = document.getElementById('remove-friend-btn');
const availableUsersList = document.getElementById('available-users-list');
const pendingRequestsCount = document.getElementById('pending-requests-count');
const friendsCount = document.getElementById('friends-count');

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
    
    // Salvar usuário no Firestore usando UID como ID do documento
    await setDoc(doc(db, 'users', userCred.user.uid), {
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
        
        // Badges de recorrência
        let recurrenceBadge = '';
        if (data.isRecurrent) {
          const recurrenceLabels = {
            'daily': '🔄 Diário',
            'weekly': '🔄 Semanal',
            'biweekly': '🔄 Bi-semanal',
            'monthly': '🔄 Mensal',
            'yearly': '🔄 Anual',
            'custom': `🔄 A cada ${data.customDays} dias`
          };
          recurrenceBadge = `<span class="badge bg-info">${recurrenceLabels[data.recurrence] || 'Recorrente'}</span>`;
        }
        
        // Badge de notificação
        let notificationBadge = '';
        if (data.notificationTime > 0) {
          const unitLabels = {
            'minutes': 'min',
            'hours': 'h',
            'days': 'd'
          };
          notificationBadge = `<span class="badge bg-warning" title="Notificação antecipada">🔔 ${data.notificationTime}${unitLabels[data.notificationUnit] || ''}</span>`;
        }
        
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
                ${recurrenceBadge}
                ${notificationBadge}
              </div>
              
              <div class="small text-muted mb-2">
                ${data.location ? `<div><i class="bi bi-geo-alt"></i> ${data.location}</div>` : ''}
                ${data.date ? `<div><i class="bi bi-calendar"></i> ${dataFormatada}${data.time ? ` às ${horaFormatada}` : ''}</div>` : ''}
                ${data.description ? `<div><i class="bi bi-info-circle"></i> ${data.description}</div>` : ''}
                ${data.nextDate && data.isRecurrent ? `<div><i class="bi bi-arrow-repeat"></i> <small>Próxima: ${new Date(data.nextDate).toLocaleDateString('pt-BR')}</small></div>` : ''}
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

// ===== SISTEMA DE AMIZADE =====

// Buscar usuário por email/nome
searchUserBtn.addEventListener('click', async () => {
  const searchTerm = searchUserInput.value.trim().toLowerCase();
  if (!searchTerm) {
    showAlert(taskAlert, 'Digite um email ou nome para procurar');
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const q = query(collection(db, 'users'), where('email', '==', searchUserInput.value.trim()));
    const snap = await getDocs(q);
    
    userSearchList.innerHTML = '';
    
    if (snap.empty) {
      userSearchList.innerHTML = '<div class="list-group-item text-muted text-center">Nenhum usuário encontrado</div>';
      searchResults.classList.remove('d-none');
      return;
    }

    snap.forEach((docSnap) => {
      const userData = docSnap.data();
      
      // Não mostrar o usuário atual nos resultados
      if (userData.uid === currentUser.uid) return;

      const li = document.createElement('div');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <h6 class="mb-1">${userData.name || 'Usuário'}</h6>
          <small class="text-muted">${userData.email}</small>
        </div>
        <button class="btn btn-sm btn-primary" data-user-id="${userData.uid}" data-user-name="${userData.name || userData.email}" data-action="send-friend-request">
          <i class="bi bi-person-plus"></i> Adicionar
        </button>
      `;
      userSearchList.appendChild(li);
    });

    searchResults.classList.remove('d-none');
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    showAlert(taskAlert, 'Erro ao procurar usuário: ' + err.message);
  }
});

// Enviar solicitação de amizade
userSearchList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="send-friend-request"]');
  if (!btn) return;

  const targetUserId = btn.getAttribute('data-user-id');
  const targetUserName = btn.getAttribute('data-user-name');
  const currentUser = auth.currentUser;

  if (!currentUser) return;

  try {
    // Obter dados do usuário atual
    const currentUserSnap = await getDoc(doc(db, 'users', currentUser.uid));
    const currentUserData = currentUserSnap.data();

    // Criar solicitação de amizade
    await addDoc(collection(db, 'users', targetUserId, 'friendRequests'), {
      fromUserId: currentUser.uid,
      fromUserEmail: currentUser.email,
      fromUserName: currentUserData.name || currentUser.email,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    btn.disabled = true;
    btn.textContent = '✓ Solicitação enviada';
    showAlert(taskSuccess, `Solicitação de amizade enviada para ${targetUserName}!`);
  } catch (err) {
    console.error('Erro ao enviar solicitação:', err);
    showAlert(taskAlert, 'Erro ao enviar solicitação: ' + err.message);
  }
});

// Carregar solicitações de amizade e amigos
let requestsUnsubscribe = null;
let friendsUnsubscribe = null;

function startFriendsListener(uid) {
  // Listener para solicitações de amizade
  const requestsRef = query(
    collection(db, 'users', uid, 'friendRequests'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  requestsUnsubscribe = onSnapshot(requestsRef, (snap) => {
    friendRequestsList.innerHTML = '';
    const pendingCount = snap.docs.length;
    
    // Atualizar badges
    if (pendingCount > 0) {
      friendRequestsBadge.textContent = pendingCount;
      friendRequestsBadge.classList.remove('d-none');
      pendingRequestsCount.textContent = pendingCount;
      pendingRequestsCount.classList.remove('d-none');
    } else {
      friendRequestsBadge.classList.add('d-none');
      pendingRequestsCount.classList.add('d-none');
    }
    
    if (snap.empty) {
      friendRequestsList.innerHTML = '<div class="list-group-item text-muted text-center">Nenhuma solicitação</div>';
    } else {
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const li = document.createElement('div');
        li.className = 'list-group-item';
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">${data.fromUserName}</h6>
              <small class="text-muted">${data.fromUserEmail}</small>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success" data-request-id="${docSnap.id}" data-user-id="${data.fromUserId}" data-action="accept-friend">
                <i class="bi bi-check-circle"></i> Aceitar
              </button>
              <button class="btn btn-sm btn-danger" data-request-id="${docSnap.id}" data-action="reject-friend">
                <i class="bi bi-x-circle"></i> Recusar
              </button>
            </div>
          </div>
        `;
        friendRequestsList.appendChild(li);
      });
    }
  }, (err) => {
    console.error('Erro ao carregar solicitações:', err);
  });

  // Listener para amigos aceitos
  const friendsRef = query(
    collection(db, 'users', uid, 'friends'),
    orderBy('addedAt', 'desc')
  );

  friendsUnsubscribe = onSnapshot(friendsRef, (snap) => {
    friendsList.innerHTML = '';
    friendCountBadge.textContent = snap.docs.length;
    friendsCount.textContent = snap.docs.length;
    
    if (snap.empty) {
      friendsList.innerHTML = '<div class="list-group-item text-muted text-center">Adicione amigos para ver suas tarefas públicas</div>';
    } else {
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const li = document.createElement('div');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <div>
            <h6 class="mb-1">${data.friendName}</h6>
            <small class="text-muted">${data.friendEmail}</small>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-info" data-friend-id="${data.friendId}" data-friend-name="${data.friendName}" data-action="view-public-tasks">
              <i class="bi bi-eye"></i> Ver tarefas
            </button>
            <button class="btn btn-sm btn-danger" data-friend-id="${data.friendId}" data-action="remove-friend">
              <i class="bi bi-trash"></i> Remover
            </button>
          </div>
        `;
        friendsList.appendChild(li);
      });
    }
  }, (err) => {
    console.error('Erro ao carregar amigos:', err);
  });
}

// Carregar todos os usuários disponíveis
async function loadAvailableUsers(currentUserId) {
  try {
    console.log('Carregando usuários disponíveis para:', currentUserId);
    const usersSnap = await getDocs(collection(db, 'users'));
    availableUsersList.innerHTML = '';

    console.log('Total de usuários no banco:', usersSnap.size);

    if (usersSnap.empty) {
      availableUsersList.innerHTML = '<div class="list-group-item text-muted text-center">Nenhum usuário disponível</div>';
      return;
    }

    // Obter lista de amigos atuais
    const friendsQuery = query(collection(db, 'users', currentUserId, 'friends'));
    const friendsSnap = await getDocs(friendsQuery);
    const friendIds = new Set(friendsSnap.docs.map(doc => doc.data().friendId));

    console.log('Amigos atuais:', friendIds);

    // Iterar usuários
    usersSnap.forEach((docSnap) => {
      const userData = docSnap.data();
      const userId = docSnap.id; // Usar ID do documento, não userData.uid

      console.log('Processando usuário:', userId, userData);

      // Não mostrar o usuário atual
      if (userId === currentUserId) {
        console.log('Pulando usuário atual');
        return;
      }

      const li = document.createElement('div');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      let buttonContent = '';
      let isAlreadyFriend = friendIds.has(userId);

      if (isAlreadyFriend) {
        buttonContent = `
          <button class="btn btn-sm btn-success" disabled>
            <i class="bi bi-check-circle"></i> Já é amigo
          </button>
        `;
      } else {
        buttonContent = `
          <button class="btn btn-sm btn-primary" data-user-id="${userId}" data-user-name="${userData.name || userData.email}" data-action="send-friend-request">
            <i class="bi bi-person-plus"></i> Adicionar
          </button>
        `;
      }

      li.innerHTML = `
        <div>
          <h6 class="mb-1">${userData.name || 'Usuário'}</h6>
          <small class="text-muted">${userData.email}</small>
        </div>
        ${buttonContent}
      `;

      availableUsersList.appendChild(li);
    });

    console.log('Usuários carregados com sucesso');
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
    availableUsersList.innerHTML = `<div class="list-group-item text-danger text-center">Erro ao carregar usuários: ${err.message}</div>`;
  }
}

// Aceitar solicitação de amizade
friendRequestsList.addEventListener('click', async (e) => {
  const acceptBtn = e.target.closest('button[data-action="accept-friend"]');
  const rejectBtn = e.target.closest('button[data-action="reject-friend"]');
  
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  if (acceptBtn) {
    const requestId = acceptBtn.getAttribute('data-request-id');
    const friendId = acceptBtn.getAttribute('data-user-id');

    try {
      const batch = writeBatch(db);
      
      // Obter dados do amigo
      const friendSnap = await getDoc(doc(db, 'users', friendId));
      const friendData = friendSnap.data();

      // Marcar solicitação como aceita
      batch.update(doc(db, 'users', currentUser.uid, 'friendRequests', requestId), {
        status: 'accepted'
      });

      // Adicionar às minhas amizades
      batch.set(doc(db, 'users', currentUser.uid, 'friends', friendId), {
        friendId: friendId,
        friendName: friendData.name || friendData.email,
        friendEmail: friendData.email,
        addedAt: serverTimestamp()
      });

      // Adicionar às amizades do amigo (recíproco)
      const currentUserSnap = await getDoc(doc(db, 'users', currentUser.uid));
      const currentUserData = currentUserSnap.data();

      batch.set(doc(db, 'users', friendId, 'friends', currentUser.uid), {
        friendId: currentUser.uid,
        friendName: currentUserData.name || currentUser.email,
        friendEmail: currentUser.email,
        addedAt: serverTimestamp()
      });

      await batch.commit();
      showAlert(taskSuccess, 'Amizade aceita!');
    } catch (err) {
      console.error('Erro ao aceitar solicitação:', err);
      showAlert(taskAlert, 'Erro ao aceitar: ' + err.message);
    }
  } else if (rejectBtn) {
    const requestId = rejectBtn.getAttribute('data-request-id');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'friendRequests', requestId), {
        status: 'rejected'
      });
      showAlert(taskSuccess, 'Solicitação recusada!');
    } catch (err) {
      console.error('Erro ao recusar solicitação:', err);
      showAlert(taskAlert, 'Erro ao recusar: ' + err.message);
    }
  }
});

// Remover amigo
friendsList.addEventListener('click', async (e) => {
  const removeBtn = e.target.closest('button[data-action="remove-friend"]');
  const viewBtn = e.target.closest('button[data-action="view-public-tasks"]');
  
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  if (removeBtn) {
    const friendId = removeBtn.getAttribute('data-friend-id');

    try {
      const batch = writeBatch(db);
      
      // Remover de minhas amizades
      batch.delete(doc(db, 'users', currentUser.uid, 'friends', friendId));
      
      // Remover das amizades do amigo (recíproco)
      batch.delete(doc(db, 'users', friendId, 'friends', currentUser.uid));
      
      await batch.commit();
      showAlert(taskSuccess, 'Amigo removido!');
    } catch (err) {
      console.error('Erro ao remover amigo:', err);
      showAlert(taskAlert, 'Erro ao remover: ' + err.message);
    }
  } else if (viewBtn) {
    const friendId = viewBtn.getAttribute('data-friend-id');
    const friendName = viewBtn.getAttribute('data-friend-name');
    
    // Carregar perfil do amigo no novo modal
    loadFriendProfile(friendId);
  }
});

// Carregar tarefas públicas do amigo
async function loadFriendPublicTasks(friendId) {
  try {
    const q = query(
      collection(db, 'users', friendId, 'tasks'),
      where('visibility', '==', 'publica'),
      orderBy('createdAt', 'desc')
    );
    
    const snap = await getDocs(q);
    friendPublicTasksList.innerHTML = '';

    if (snap.empty) {
      friendPublicTasksList.innerHTML = '<li class="list-group-item text-muted text-center">Nenhuma tarefa pública</li>';
      return;
    }

    snap.forEach((docSnap) => {
      const data = docSnap.data();
      
      let priorityColor = 'secondary';
      let priorityLabel = 'Média';
      if (data.priority === 'alta') {
        priorityColor = 'danger';
        priorityLabel = 'Alta';
      } else if (data.priority === 'baixa') {
        priorityColor = 'info';
        priorityLabel = 'Baixa';
      }

      const dataFormatada = data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '-';
      const horaFormatada = data.time || '-';

      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-2">
              <input type="checkbox" class="form-check-input" disabled ${data.done ? 'checked' : ''} style="cursor: not-allowed; width: 20px; height: 20px;">
              <h6 class="mb-0 ${data.done ? 'text-muted text-decoration-line-through' : ''}">${data.name}</h6>
              <span class="badge bg-${priorityColor}">${priorityLabel}</span>
            </div>
            
            <div class="small text-muted mb-2">
              ${data.location ? `<div><i class="bi bi-geo-alt"></i> ${data.location}</div>` : ''}
              ${data.date ? `<div><i class="bi bi-calendar"></i> ${dataFormatada}${data.time ? ` às ${horaFormatada}` : ''}</div>` : ''}
              ${data.description ? `<div><i class="bi bi-info-circle"></i> ${data.description}</div>` : ''}
            </div>
          </div>
        </div>
      `;
      friendPublicTasksList.appendChild(li);
    });
  } catch (err) {
    console.error('Erro ao carregar tarefas públicas:', err);
    friendPublicTasksList.innerHTML = '<li class="list-group-item text-danger text-center">Erro ao carregar tarefas</li>';
  }
}

// Carregar perfil completo do amigo
async function loadFriendProfile(friendId) {
  try {
    // Carregar dados do usuário amigo
    const friendSnap = await getDoc(doc(db, 'users', friendId));
    if (!friendSnap.exists()) {
      showAlert(taskAlert, 'Amigo não encontrado');
      return;
    }

    const friendData = friendSnap.data();

    // Contar tarefas totais
    const allTasksQuery = query(collection(db, 'users', friendId, 'tasks'));
    const allTasksSnap = await getDocs(allTasksQuery);
    const totalTasks = allTasksSnap.size;

    // Contar tarefas públicas
    const publicTasksQuery = query(
      collection(db, 'users', friendId, 'tasks'),
      where('visibility', '==', 'publica')
    );
    const publicTasksSnap = await getDocs(publicTasksQuery);
    const publicTasks = publicTasksSnap.size;

    // Atualizar informações no modal
    profileFriendName.textContent = friendData.name || friendData.email;
    profileFriendEmail.textContent = friendData.email;
    profileFriendTasksCount.textContent = `${totalTasks} Tarefas`;
    profileFriendPublicTasksCount.textContent = `${publicTasks} Públicas`;

    // Configurar botão de remover amigo
    removeFriendBtn.setAttribute('data-friend-id', friendId);

    // Carregar tarefas públicas
    const tasksList = document.getElementById('friend-public-tasks-list');
    tasksList.innerHTML = '<li class="list-group-item text-muted text-center">Carregando...</li>';

    if (publicTasksSnap.empty) {
      tasksList.innerHTML = '<li class="list-group-item text-muted text-center">Nenhuma tarefa pública</li>';
    } else {
      tasksList.innerHTML = '';
      publicTasksSnap.forEach((docSnap) => {
        const data = docSnap.data();
        
        let priorityColor = 'secondary';
        let priorityLabel = 'Média';
        if (data.priority === 'alta') {
          priorityColor = 'danger';
          priorityLabel = 'Alta';
        } else if (data.priority === 'baixa') {
          priorityColor = 'info';
          priorityLabel = 'Baixa';
        }

        const dataFormatada = data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '-';
        const horaFormatada = data.time || '-';

        // Badges de recorrência e notificação
        let recurrenceBadge = '';
        if (data.isRecurrent) {
          const recurrenceLabels = {
            'daily': '🔄 Diário',
            'weekly': '🔄 Semanal',
            'biweekly': '🔄 Quinzenal',
            'monthly': '🔄 Mensal',
            'yearly': '🔄 Anual',
            'custom': '🔄 Customizado'
          };
          recurrenceBadge = recurrenceLabels[data.recurrence] || '';
        }

        let notificationBadge = '';
        if (data.notificationTime && data.notificationTime > 0) {
          const unitLabels = {
            'minutes': 'min',
            'hours': 'h',
            'days': 'd'
          };
          notificationBadge = `🔔 ${data.notificationTime}${unitLabels[data.notificationUnit] || 'min'}`;
        }

        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <input type="checkbox" class="form-check-input" disabled ${data.done ? 'checked' : ''} style="cursor: not-allowed; width: 20px; height: 20px;">
                <h6 class="mb-0 ${data.done ? 'text-muted text-decoration-line-through' : ''}">${data.name}</h6>
                <span class="badge bg-${priorityColor}">${priorityLabel}</span>
                ${recurrenceBadge ? `<span class="badge bg-info">${recurrenceBadge}</span>` : ''}
                ${notificationBadge ? `<span class="badge bg-warning">${notificationBadge}</span>` : ''}
              </div>
              
              <div class="small text-muted mb-2">
                ${data.location ? `<div><i class="bi bi-geo-alt"></i> ${data.location}</div>` : ''}
                ${data.date ? `<div><i class="bi bi-calendar"></i> ${dataFormatada}${data.time ? ` às ${horaFormatada}` : ''}</div>` : ''}
                ${data.nextDate && data.isRecurrent ? `<div><i class="bi bi-arrow-repeat"></i> <small>Próxima: ${new Date(data.nextDate).toLocaleDateString('pt-BR')}</small></div>` : ''}
                ${data.description ? `<div><i class="bi bi-info-circle"></i> ${data.description}</div>` : ''}
              </div>
            </div>
          </div>
        `;
        tasksList.appendChild(li);
      });
    }

    // Mostrar modal
    friendProfileModal.show();
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    showAlert(taskAlert, 'Erro ao carregar perfil: ' + err.message);
  }
}

// Remover amigo do modal de perfil
removeFriendBtn.addEventListener('click', async () => {
  const friendId = removeFriendBtn.getAttribute('data-friend-id');
  const currentUser = auth.currentUser;
  
  if (!currentUser || !friendId) return;
  
  if (!confirm('Tem certeza que deseja remover este amigo?')) return;

  try {
    const batch = writeBatch(db);
    
    // Remover de minhas amizades
    batch.delete(doc(db, 'users', currentUser.uid, 'friends', friendId));
    
    // Remover das amizades do amigo (recíproco)
    batch.delete(doc(db, 'users', friendId, 'friends', currentUser.uid));
    
    await batch.commit();
    showAlert(taskSuccess, 'Amigo removido com sucesso!');
    friendProfileModal.hide();
  } catch (err) {
    console.error('Erro ao remover amigo:', err);
    showAlert(taskAlert, 'Erro ao remover: ' + err.message);
  }
});


let notificationsUnsubscribe = null;

function startNotificationsListener(uid) {
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc')
  );

  notificationsUnsubscribe = onSnapshot(q, (snap) => {
    notificationsList.innerHTML = '';
    
    // Obter solicitações de amizade pendentes
    const friendRequestsQuery = query(
      collection(db, 'users', uid, 'friendRequests'),
      where('status', '==', 'pending')
    );
    
    getDocs(friendRequestsQuery).then((friendRequestsSnap) => {
      const allNotifications = [];
      
      // Adicionar solicitações de amizade como notificações
      friendRequestsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        allNotifications.push({
          type: 'friend_request',
          id: docSnap.id,
          title: 'Solicitação de Amizade',
          message: `${data.fromUserName} enviou uma solicitação de amizade`,
          fromUserName: data.fromUserName,
          fromUserEmail: data.fromUserEmail,
          fromUserId: data.fromUserId,
          createdAt: data.createdAt,
          read: false
        });
      });
      
      // Adicionar notificações regulares
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        allNotifications.push({
          type: 'notification',
          id: docSnap.id,
          title: data.title,
          message: data.message,
          createdAt: data.createdAt,
          read: data.read
        });
      });
      
      // Ordenar por data
      allNotifications.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date();
        const dateB = b.createdAt?.toDate?.() || new Date();
        return dateB - dateA;
      });
      
      const unreadCount = allNotifications.filter(n => !n.read).length;
      
      if (unreadCount > 0) {
        notificationCountBadge.textContent = unreadCount;
        notificationCountBadge.classList.remove('d-none');
      } else {
        notificationCountBadge.classList.add('d-none');
      }

      if (allNotifications.length === 0) {
        notificationsList.innerHTML = '<div class="list-group-item text-muted text-center">Nenhuma notificação</div>';
        return;
      }

      allNotifications.forEach((data) => {
        const li = document.createElement('div');
        li.className = `list-group-item ${!data.read ? 'bg-light border-start border-5 border-warning' : ''}`;
        
        const dataFormatada = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('pt-BR') : '';
        const horaFormatada = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

        if (data.type === 'friend_request') {
          li.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <i class="bi bi-person-plus text-primary"></i>
                  <h6 class="mb-0">${data.title}</h6>
                </div>
                <p class="mb-1">${data.message}</p>
                <small class="text-muted">${dataFormatada} às ${horaFormatada}</small>
                <div class="d-flex gap-2 mt-2">
                  <button class="btn btn-sm btn-success" data-request-id="${data.id}" data-user-id="${data.fromUserId}" data-action="accept-friend">
                    <i class="bi bi-check-circle"></i> Aceitar
                  </button>
                  <button class="btn btn-sm btn-danger" data-request-id="${data.id}" data-action="reject-friend">
                    <i class="bi bi-x-circle"></i> Recusar
                  </button>
                </div>
              </div>
            </div>
          `;
        } else {
          li.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h6 class="mb-1">${data.title}</h6>
                <p class="mb-1">${data.message}</p>
                <small class="text-muted">${dataFormatada} às ${horaFormatada}</small>
              </div>
              <button class="btn btn-sm btn-outline-secondary" data-notification-id="${data.id}" data-action="mark-notification-read">
                ${data.read ? '✓' : '○'}
              </button>
            </div>
          `;
        }
        
        notificationsList.appendChild(li);
      });
    });
  }, (err) => {
    console.error('Erro ao carregar notificações:', err);
  });
}

// Marcar notificação como lida
notificationsList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="mark-notification-read"]');
  if (!btn) return;

  const notificationId = btn.getAttribute('data-notification-id');
  const currentUser = auth.currentUser;

  if (!currentUser) return;

  try {
    await updateDoc(doc(db, 'users', currentUser.uid, 'notifications', notificationId), {
      read: true
    });
  } catch (err) {
    console.error('Erro ao marcar notificação como lida:', err);
  }
});

// Função para criar notificação quando tarefa pública é criada
async function createNotificationForFriends(userId, taskName) {
  try {
    // Obter lista de amigos
    const friendsSnap = await getDocs(collection(db, 'users', userId, 'friends'));
    
    friendsSnap.forEach(async (friendDoc) => {
      const friendId = friendDoc.data().friendId;
      
      // Obter dados do usuário que criou a tarefa
      const userSnap = await getDoc(doc(db, 'users', userId));
      const userData = userSnap.data();

      // Criar notificação para o amigo
      await addDoc(collection(db, 'users', friendId, 'notifications'), {
        title: 'Nova tarefa pública',
        message: `${userData.name || userData.email} criou uma tarefa pública: "${taskName}"`,
        fromUserId: userId,
        fromUserName: userData.name || userData.email,
        read: false,
        createdAt: serverTimestamp()
      });
    });
  } catch (err) {
    console.error('Erro ao criar notificações:', err);
  }
}

// Atualizar a função de adicionar tarefa para enviar notificações
const originalTaskFormSubmit = taskForm.onsubmit;
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskName.value.trim();
  const location = taskLocation.value.trim();
  const date = taskDate.value;
  const time = taskTime.value;
  const priority = taskPriority.value;
  const visibility = taskVisibility.value;
  const description = taskDescription.value.trim();
  const recurrence = taskRecurrence.value;
  const customDays = taskRecurrence.value === 'custom' ? parseInt(taskCustomDays.value) : null;
  const notificationTime = parseInt(taskNotificationTime.value) || 0;
  const notificationUnit = taskNotificationUnit.value;
  
  const user = auth.currentUser;
  if (!user || !name) {
    showAlert(taskAlert, 'Digite um nome para a tarefa');
    return;
  }

  // Validar dias customizados
  if (recurrence === 'custom' && (!customDays || customDays < 1)) {
    showAlert(taskAlert, 'Digite uma quantidade válida de dias');
    return;
  }

  try {
    // Calcular próxima data se for recorrente
    let nextDate = date;
    if (recurrence !== 'none' && date) {
      nextDate = calculateNextDate(date, recurrence, customDays);
    }

    await addDoc(collection(db, 'users', user.uid, 'tasks'), {
      name,
      location,
      date,
      time,
      priority,
      visibility,
      description,
      recurrence,
      customDays,
      notificationTime,
      notificationUnit,
      nextDate,
      done: false,
      isRecurrent: recurrence !== 'none',
      createdAt: serverTimestamp()
    });
    
    // Se a tarefa é pública, criar notificações para amigos
    if (visibility === 'publica') {
      await createNotificationForFriends(user.uid, name);
    }
    
    // Limpar formulário
    taskForm.reset();
    showAlert(taskSuccess, 'Tarefa adicionada com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar tarefa:', err);
    showAlert(taskAlert, 'Erro ao adicionar: ' + err.message);
  }
});

// ===== FUNÇÕES DE RECORRÊNCIA =====

// Calcular próxima data baseada em recorrência
function calculateNextDate(currentDate, recurrence, customDays = null) {
  const date = new Date(currentDate);
  
  switch(recurrence) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    case 'custom':
      if (customDays) {
        date.setDate(date.getDate() + customDays);
      }
      break;
  }
  
  return date.toISOString().split('T')[0]; // Retornar em formato YYYY-MM-DD
}

// Verificar e enviar notificações antecipadas
async function checkAndNotifyUpcomingTasks(uid) {
  try {
    const tasksRef = query(
      collection(db, 'users', uid, 'tasks'),
      where('notificationTime', '>', 0)
    );
    
    const snap = await getDocs(tasksRef);
    const now = new Date();
    
    snap.forEach(async (docSnap) => {
      const task = docSnap.data();
      if (!task.date || !task.time) return;
      
      // Calcular quando notificar
      const taskDateTime = new Date(`${task.date}T${task.time || '00:00'}`);
      let notificationTime = new Date(taskDateTime);
      
      // Subtrair o tempo de antecedência
      if (task.notificationUnit === 'minutes') {
        notificationTime.setMinutes(notificationTime.getMinutes() - task.notificationTime);
      } else if (task.notificationUnit === 'hours') {
        notificationTime.setHours(notificationTime.getHours() - task.notificationTime);
      } else if (task.notificationUnit === 'days') {
        notificationTime.setDate(notificationTime.getDate() - task.notificationTime);
      }
      
      // Se é hora de notificar e ainda não foi notificada
      if (now >= notificationTime && now < taskDateTime && !task.notificationSent) {
        // Marcar como notificada
        await updateDoc(doc(db, 'users', uid, 'tasks', docSnap.id), {
          notificationSent: true
        });
        
        // Enviar notificação para notificações do usuário
        await addDoc(collection(db, 'users', uid, 'notifications'), {
          title: '⏰ Lembrete de Tarefa',
          message: `Sua tarefa "${task.name}" está próxima! Em ${task.date} às ${task.time || 'sem hora'}`,
          taskId: docSnap.id,
          read: false,
          createdAt: serverTimestamp()
        });
      }
      
      // Se a tarefa foi completada e é recorrente, criar nova instância
      if (task.done && task.isRecurrent && task.nextDate) {
        const nextTaskData = { ...task };
        delete nextTaskData.done;
        delete nextTaskData.notificationSent;
        
        nextTaskData.date = task.nextDate;
        nextTaskData.done = false;
        nextTaskData.notificationSent = false;
        nextTaskData.createdAt = serverTimestamp();
        nextTaskData.nextDate = calculateNextDate(task.nextDate, task.recurrence, task.customDays);
        
        // Criar nova tarefa para próxima ocorrência
        await addDoc(collection(db, 'users', uid, 'tasks'), nextTaskData);
        
        console.log(`✓ Nova tarefa recorrente criada: ${task.name}`);
      }
    });
  } catch (err) {
    console.error('Erro ao verificar tarefas agendadas:', err);
  }
}

// Listener para verificar tarefas recorrentes periodicamente
function startRecurrenceChecker(uid) {
  // Verificar a cada 5 minutos
  setInterval(() => {
    checkAndNotifyUpcomingTasks(uid);
  }, 5 * 60 * 1000);
  
  // Também verificar imediatamente
  checkAndNotifyUpcomingTasks(uid);
}

// Atualizar onAuthStateChanged para iniciar listeners de amigos
const originalOnAuthStateChanged = onAuthStateChanged;
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
    
    console.log('Iniciando listeners para UID:', user.uid);
    startTasksListener(user.uid);
    startFriendsListener(user.uid);
    startNotificationsListener(user.uid);
    startRecurrenceChecker(user.uid); // ← NOVO: Iniciar verificador de recorrências
    loadAvailableUsers(user.uid);
    
    // Recarregar usuários ao clicar na aba de amigos
    document.getElementById('amigos-tab')?.addEventListener('click', () => {
      loadAvailableUsers(user.uid);
    });
  } else {
    console.log('✗ Usuário desconectado');
    userEmailEl.textContent = '';
    
    // Mostrar tela de login
    loginScreen.classList.remove('hidden');
    
    // Ocultar tela do app
    appScreen.classList.add('hidden');
    
    if (typeof tasksUnsubscribe === 'function') tasksUnsubscribe();
    if (typeof requestsUnsubscribe === 'function') requestsUnsubscribe();
    if (typeof friendsUnsubscribe === 'function') friendsUnsubscribe();
    if (typeof notificationsUnsubscribe === 'function') notificationsUnsubscribe();
    taskList.innerHTML = '';
  }
});