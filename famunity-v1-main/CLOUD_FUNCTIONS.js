// Cloud Function - Notificações Seguras (OPCIONAL)
// Este arquivo é para melhorar segurança movendo a lógica de notificações para o servidor
// Para usar: vá para Firebase Console → Cloud Functions → Deploy uma nova função

// ==========================================================
// OPÇÃO 1: Usando Cloud Functions (RECOMENDADO)
// ==========================================================

/*
Instale as dependências:
npm install firebase-admin firebase-functions

Arquivo: functions/index.js
*/

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

/**
 * Função acionada quando uma tarefa é criada
 * Cria automaticamente notificações para amigos se tarefa for pública
 */
exports.notifyFriendsOnPublicTask = functions.firestore
  .document('users/{userId}/tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const taskData = snap.data();
    const userId = context.params.userId;

    // Apenas processar tarefas públicas
    if (taskData.visibility !== 'publica') {
      return null;
    }

    try {
      // Obter lista de amigos do usuário
      const friendsRef = db.collection('users').doc(userId).collection('friends');
      const friendsSnap = await friendsRef.get();

      // Obter dados do usuário que criou a tarefa
      const userSnap = await db.collection('users').doc(userId).get();
      const userData = userSnap.data();

      // Criar notificação para cada amigo
      const batch = db.batch();

      friendsSnap.forEach((friendDoc) => {
        const friendId = friendDoc.data().friendId;
        
        const notificationRef = db
          .collection('users')
          .doc(friendId)
          .collection('notifications')
          .doc();

        batch.set(notificationRef, {
          title: 'Nova tarefa pública',
          message: `${userData.name || userData.email} criou uma tarefa pública: "${taskData.name}"`,
          fromUserId: userId,
          fromUserName: userData.name || userData.email,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });

      return batch.commit();
    } catch (error) {
      console.error('Erro ao notificar amigos:', error);
      return null;
    }
  });

/**
 * Função para criar notificação quando amizade é aceita
 */
exports.notifyFriendshipAccepted = functions.firestore
  .document('users/{userId}/friendRequests/{requestId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const userId = context.params.userId;

    // Apenas processar quando status muda para "accepted"
    if (beforeData.status === 'accepted' || afterData.status !== 'accepted') {
      return null;
    }

    try {
      const friendId = afterData.fromUserId;

      // Notificar quem enviou a solicitação
      await db
        .collection('users')
        .doc(friendId)
        .collection('notifications')
        .add({
          title: 'Amizade Aceita',
          message: `${afterData.toName || 'Um usuário'} aceitou sua solicitação de amizade`,
          fromUserId: userId,
          fromUserName: afterData.toName || 'Usuário',
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

      return null;
    } catch (error) {
      console.error('Erro ao notificar aceitação:', error);
      return null;
    }
  });

/**
 * Função para limpar notificações antigas (maiores de 30 dias)
 * Executar com scheduler (cron)
 */
exports.cleanOldNotifications = functions.pubsub
  .schedule('every 7 days')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersSnap = await db.collection('users').get();

    const batch = db.batch();
    let deleteCount = 0;

    for (const userDoc of usersSnap.docs) {
      const notificationsSnap = await userDoc.ref
        .collection('notifications')
        .where('createdAt', '<', thirtyDaysAgo)
        .get();

      notificationsSnap.forEach((notifDoc) => {
        batch.delete(notifDoc.ref);
        deleteCount++;
      });
    }

    await batch.commit();
    console.log(`Limpeza concluída: ${deleteCount} notificações deletadas`);
    return null;
  });

// ==========================================================
// OPÇÃO 2: Usar Web Hooks (Para Análise)
// ==========================================================

/*
Se quiser rastrear ações dos usuários:

exports.trackUserAction = functions.firestore
  .document('users/{userId}/tasks/{taskId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const action = change.before.exists ? 'update' : 'create';
    
    // Enviar para serviço de análise
    console.log(`User ${userId} performed action: ${action}`);
    
    return null;
  });

*/

// ==========================================================
// COMO FAZER DEPLOY
// ==========================================================

/*
1. Instale Firebase CLI:
   npm install -g firebase-tools

2. Autentique:
   firebase login

3. Vá para pasta de functions:
   cd functions

4. Instale dependências:
   npm install

5. Deploy:
   firebase deploy --only functions

6. Verifique logs:
   firebase functions:log
*/

// ==========================================================
// TESTES LOCAIS
// ==========================================================

/*
Para testar localmente:

firebase emulators:start

Abrirá um console em:
http://localhost:4000

Use para testar sem fazer deploy ao Firebase.
*/
