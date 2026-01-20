# 🚀 Evolução do App - Sistema de Amizade e Notificações

## Novas Funcionalidades Implementadas

### 1. **Sistema de Solicitação de Amizade**
- **Procurar Usuários**: Na aba "Amigos", procure por outros usuários usando seu email
- **Enviar Solicitação**: Clique no botão "Adicionar" para enviar uma solicitação de amizade
- **Aceitar/Recusar**: Receba notificações de solicitações de amizade e aceite ou recuse

### 2. **Tarefas Públicas entre Amigos**
- Ao criar uma tarefa, selecione "Pública" na opção de Visibilidade
- **Apenas amigos aceitos** podem ver suas tarefas públicas
- Clique em "Ver tarefas" na aba Amigos para visualizar as tarefas públicas de um amigo
- Tarefas públicas mostram: nome, prioridade, localização, data, hora e descrição

### 3. **Sistema de Notificações em Tempo Real**
- **Notificação automática**: Quando você cria uma tarefa pública, todos seus amigos recebem uma notificação
- **Aba Notificações**: Acesse a aba "Notificações" para ver todas as notificações recentes
- **Marcar como lida**: Clique no ícone para marcar notificações como lidas
- **Badge de notificações não lidas**: O número de notificações não lidas aparece na aba

## Estrutura do Banco de Dados Firestore

```
users/
├── {userId}/
│   ├── tasks/
│   │   └── {taskId}
│   │       ├── name
│   │       ├── visibility (privada/publica)
│   │       ├── priority
│   │       ├── done
│   │       └── createdAt
│   │
│   ├── friends/
│   │   └── {friendId}
│   │       ├── friendId
│   │       ├── friendName
│   │       ├── friendEmail
│   │       └── addedAt
│   │
│   ├── friendRequests/
│   │   └── {requestId}
│   │       ├── fromUserId
│   │       ├── fromUserEmail
│   │       ├── fromUserName
│   │       ├── status (pending/accepted/rejected)
│   │       └── createdAt
│   │
│   └── notifications/
│       └── {notificationId}
│           ├── title
│           ├── message
│           ├── fromUserId
│           ├── fromUserName
│           ├── read
│           └── createdAt
```

## Como Usar

### Passo 1: Procurar e Adicionar Amigos
1. Vá para a aba **"Amigos"**
2. Digite o email de um usuário no campo de busca
3. Clique em "Procurar"
4. Clique em "Adicionar" para enviar uma solicitação de amizade

### Passo 2: Aceitar Solicitações
1. Na aba **"Amigos"**, veja a seção "Solicitações de Amizade"
2. Clique em **"Aceitar"** para confirmar a amizade
3. Clique em **"Recusar"** para rejeitar

### Passo 3: Ver Tarefas Públicas de Amigos
1. Na seção "Meus Amigos", clique em **"Ver tarefas"**
2. Uma janela mostrará todas as tarefas públicas daquele amigo
3. Você não pode editar as tarefas dos amigos (visualização apenas)

### Passo 4: Criar Tarefas Públicas
1. Ao criar uma nova tarefa, selecione **"Pública"** na opção Visibilidade
2. Clique em "Adicionar Tarefa"
3. **Automaticamente**, todos seus amigos receberão uma notificação sobre essa tarefa

### Passo 5: Visualizar Notificações
1. Clique na aba **"Notificações"**
2. Veja todas as notificações que você recebeu quando amigos criaram tarefas públicas
3. Clique no ícone ○ para marcar como lida (ícone vira ✓)

## Principais Mudanças no Código

### app.js
- **Imports atualizados**: Adicionadas funções `where`, `getDocs`, `writeBatch` do Firebase
- **Novos elementos DOM**: Variáveis para amigos, notificações, busca de usuários
- **Funções de amizade**:
  - `searchUserBtn`: Buscar usuários
  - `startFriendsListener()`: Monitorar amigos e solicitações em tempo real
  - `createNotificationForFriends()`: Criar notificações automáticas
  - `startNotificationsListener()`: Monitorar notificações
- **Sistema reativo**: Todos os dados atualizam em tempo real usando `onSnapshot`

### index.html
- **Abas de navegação**: Sistema de abas para Tarefas, Amigos e Notificações
- **Novo layout**: Seções organizadas para procurar usuários, ver solicitações e amigos
- **Modal adicional**: Para visualizar tarefas públicas de amigos

## Segurança e Privacidade

✅ **Apenas amigos aceitos** podem ver tarefas públicas  
✅ **Tarefas privadas** nunca são visíveis para outros usuários  
✅ **Solicitações podem ser recusadas** sem notificar o remetente  
✅ **Amigos podem ser removidos** a qualquer hora  
✅ **Notificações** são pessoais e personalizadas  

## Próximas Melhorias Possíveis

- 📨 Sistema de mensagens diretas entre amigos
- 🔔 Notificações por email ou push
- 👥 Grupos e compartilhamento de tarefas
- 📊 Estatísticas e gráficos de produtividade
- 🏷️ Tags/categorias customizadas
- 🔍 Filtros avançados de busca
- 📱 Versão mobile nativa

---

**Versão**: 2.0  
**Data**: Janeiro 2026  
**Desenvolvedor**: Seu Nome
