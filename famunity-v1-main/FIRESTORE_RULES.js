// Firestore Security Rules - Versão 2.0
// Copie este conteúdo para o console do Firebase (Firestore → Rules)
// Este arquivo garante segurança de acesso aos dados

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Função auxiliar para verificar se dois usuários são amigos
    function areFriends(uid1, uid2) {
      return exists(/databases/$(database)/documents/users/$(uid1)/friends/$(uid2));
    }

    // Função auxiliar para verificar se usuário autenticado é o dono
    function isOwner(uid) {
      return request.auth.uid == uid;
    }

    // COLEÇÃO USERS
    match /users/{userId} {
      // Ler perfil: qualquer usuário autenticado pode ler
      allow read: if request.auth != null;
      
      // Escrever perfil: apenas o próprio usuário
      allow write: if isOwner(userId);

      // SUBCOLEÇÃO TASKS
      match /tasks/{taskId} {
        // Ler tarefa própria: sempre permitido
        allow read: if isOwner(userId);
        
        // Ler tarefa pública de amigo: permitido se for amigo e tarefa pública
        allow read: if !isOwner(userId) && 
                       request.auth != null &&
                       resource.data.visibility == 'publica' &&
                       areFriends(userId, request.auth.uid);
        
        // Escrever tarefa: apenas o dono
        allow write: if isOwner(userId);
        
        // Deletar tarefa: apenas o dono
        allow delete: if isOwner(userId);
      }

      // SUBCOLEÇÃO FRIENDS
      match /friends/{friendId} {
        // Ler amigos: apenas o dono
        allow read: if isOwner(userId);
        
        // Escrever amigos: apenas o dono
        allow write: if isOwner(userId);
        
        // Deletar amigos: apenas o dono
        allow delete: if isOwner(userId);
      }

      // SUBCOLEÇÃO FRIENDREQUESTS
      match /friendRequests/{requestId} {
        // Ler solicitações: apenas o destinatário
        allow read: if isOwner(userId);
        
        // Escrever solicitação: qualquer usuário autenticado
        // (para enviar solicitação)
        allow create: if request.auth != null &&
                         request.resource.data.fromUserId == request.auth.uid &&
                         request.resource.data.status == 'pending';
        
        // Atualizar solicitação: apenas o destinatário pode aceitar/recusar
        allow update: if isOwner(userId) &&
                         (request.resource.data.status == 'accepted' ||
                          request.resource.data.status == 'rejected');
        
        // Deletar: o dono pode deletar
        allow delete: if isOwner(userId);
      }

      // SUBCOLEÇÃO NOTIFICATIONS
      match /notifications/{notificationId} {
        // Ler notificações: apenas o dono
        allow read: if isOwner(userId);
        
        // Escrever notificação: apenas o dono (para evitar spam)
        // Na prática, o backend enviará via Cloud Function
        allow create: if isOwner(userId) &&
                         request.resource.data.read == false;
        
        // Atualizar notificação: apenas o dono (marcar como lida)
        allow update: if isOwner(userId) &&
                         request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['read']);
        
        // Deletar: o dono pode deletar
        allow delete: if isOwner(userId);
      }
    }

    // Negar tudo que não foi explicitamente permitido
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

// ==================================
// NOTAS IMPORTANTES
// ==================================
/*

1. IMPLEMENTAÇÃO:
   - Vá para Firebase Console → Seu Projeto → Firestore Database → Rules
   - Cole as regras acima (após a linha "match /databases/{database}/documents {")
   - Clique em "Publicar"

2. TESTES:
   - Use o "Rules Playground" do Firebase para testar
   - Teste cenários de:
     • Usuário lendo sua própria tarefa (deve passar)
     • Usuário lendo tarefa privada de outro (deve falhar)
     • Amigo lendo tarefa pública (deve passar)
     • Não-amigo lendo tarefa pública (deve falhar)

3. SEGURANÇA:
   - Tarefas privadas: NÃO acessíveis por ninguém além do dono
   - Tarefas públicas: Acessíveis APENAS por amigos aceitos
   - Solicitações: Privadas e protegidas
   - Notificações: Privadas e protegidas

4. FUNÇÃO CUSTOMIZADA (Cloud Function) - OPCIONAL:
   Se quiser maior segurança, crie uma Cloud Function para notificações
   ao invés de deixar o cliente escrever diretamente.

5. MONITORAMENTO:
   - Use Firebase Analytics para monitorar acessos
   - Revise os logs regularmente
   - Monitore tentativas de acesso negado

*/
