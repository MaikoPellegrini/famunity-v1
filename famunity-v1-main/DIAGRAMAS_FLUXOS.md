# 📊 Diagramas e Fluxos - Sistema v2.0

## 1️⃣ Fluxo de Amizade

```
┌─────────────────────────────────────────────────────────┐
│                  USUÁRIO A                              │
│         Aba "Amigos" → Buscar Email Usuário B          │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Digita: usuario@b.com                           │  │
│  │  Clica: Buscar                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↓                                │
│              Resultado exibido:                        │
│         [Usuário B] [Adicionar]                        │
│                        ↓                                │
│            Clica "Adicionar"                           │
│                        ↓                                │
│      Documento criado em:                              │
│   users/{B_uid}/friendRequests/{requestId}            │
│   {                                                    │
│     fromUserId: A_uid,                                │
│     fromUserEmail: A_email,                           │
│     status: "pending"                                 │
│   }                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  USUÁRIO B                              │
│          Aba "Amigos" → Solicitações Recebidas         │
│                                                         │
│      [Usuário A] [Aceitar] [Recusar]                   │
│                        ↓                                │
│            Clica "Aceitar"                             │
│                        ↓                                │
│      Atualiza: status = "accepted"                     │
│      Cria em: users/{B_uid}/friends/{A_uid}           │
│      Cria em: users/{A_uid}/friends/{B_uid}  (recíproco)
│                        ↓                                │
│      Ambos veem um ao outro em "Meus Amigos"           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Fluxo de Tarefas Públicas

```
┌──────────────────────────────────────────────────────────┐
│                    USUÁRIO A                             │
│              Cria Nova Tarefa                            │
│                                                          │
│  Nome: "Comprar Leite"                                  │
│  Visibilidade: [Pública] ← IMPORTANTE                    │
│  Clica: "Adicionar Tarefa"                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         ↓
        Documento criado em: users/{A_uid}/tasks/
        {
          name: "Comprar Leite",
          visibility: "publica",  ← chave
          done: false,
          createdAt: timestamp
        }
                         ↓
        Firebase trigger executa:
        createNotificationForFriends(A_uid, "Comprar Leite")
                         ↓
        Para cada amigo em users/{A_uid}/friends:
        └─ Cria notificação em users/{friend_uid}/notifications
           {
             title: "Nova tarefa pública",
             message: "[Usuário A] criou: 'Comprar Leite'",
             read: false,
             createdAt: timestamp
           }
                         ↓
┌──────────────────────────────────────────────────────────┐
│                    USUÁRIO B                             │
│              (Amigo de A)                                │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Badge 🔔 mostra "1" notificação não lida        │   │
│  │ Clica na aba "Notificações"                     │   │
│  │                                                 │   │
│  │ "Nova tarefa pública"                           │   │
│  │ [Usuário A] criou: 'Comprar Leite'             │   │
│  │                                                 │   │
│  │ Clica "Ver tarefas" em Meus Amigos:            │   │
│  │ Modal abre com tarefas públicas de A           │   │
│  │ (apenas as com visibility: "publica")           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         ↓
            Usuário B clica "○" na notificação
                         ↓
       Atualiza: notification.read = true
                         ↓
            Badge de notificação desaparece
```

---

## 3️⃣ Fluxo de Notificações

```
┌─────────────────────────────────────────────────────────┐
│              CRIAÇÃO DE NOTIFICAÇÃO                      │
│                                                         │
│  Evento: Tarefa pública criada                          │
│  Função: createNotificationForFriends()                 │
│                                                         │
│  1. Buscar todos os amigos:                             │
│     getDocs(users/{A_uid}/friends/)                     │
│                                                         │
│  2. Para cada amigo:                                    │
│     └─ Cria documento em                                │
│        users/{friend_uid}/notifications/                │
│                                                         │
│  3. Documento contém:                                   │
│     - Título                                            │
│     - Mensagem personalizada                            │
│     - ID do usuário que criou                           │
│     - Timestamp                                         │
│     - Status "não lida" (false)                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│            LISTENER DE NOTIFICAÇÕES                      │
│                                                         │
│  Para cada usuário:                                     │
│  onSnapshot(users/{uid}/notifications/)                │
│                                                         │
│  Atualiza em TEMPO REAL:                                │
│  ✓ Exibe notificações novas                             │
│  ✓ Atualiza contador                                    │
│  ✓ Mostra data/hora                                     │
│  ✓ Diferencia lidas/não-lidas                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│         AÇÕES DO USUÁRIO (UI)                           │
│                                                         │
│  Clique no ○ (não lida) → Muda para ✓ (lida)           │
│                                                         │
│  updateDoc(notification, { read: true })               │
│                        ↓                                │
│  Badge de contagem atualiza automaticamente             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4️⃣ Estrutura de Dados no Firestore

```
database "famunity-1"
│
└─ users/ (coleção)
   │
   ├─ {uid_usuario_A}
   │  │
   │  ├─ (documento)
   │  │  ├─ uid: "abc123..."
   │  │  ├─ name: "João Silva"
   │  │  ├─ email: "joao@email.com"
   │  │  └─ createdAt: timestamp
   │  │
   │  ├─ tasks/ (coleção)
   │  │  ├─ {task_1}
   │  │  │  ├─ name: "Comprar leite"
   │  │  │  ├─ visibility: "publica"  ← NOVO
   │  │  │  ├─ priority: "media"
   │  │  │  ├─ done: false
   │  │  │  └─ createdAt: timestamp
   │  │  │
   │  │  └─ {task_2}
   │  │     ├─ name: "Estudar"
   │  │     ├─ visibility: "privada"
   │  │     └─ ...
   │  │
   │  ├─ friends/ (coleção) ← NOVA
   │  │  └─ {uid_usuario_B}
   │  │     ├─ friendId: "def456..."
   │  │     ├─ friendName: "Maria"
   │  │     ├─ friendEmail: "maria@email.com"
   │  │     └─ addedAt: timestamp
   │  │
   │  ├─ friendRequests/ (coleção) ← NOVA
   │  │  └─ {request_1}
   │  │     ├─ fromUserId: "ghi789..."
   │  │     ├─ fromUserEmail: "pedro@email.com"
   │  │     ├─ status: "pending"
   │  │     └─ createdAt: timestamp
   │  │
   │  └─ notifications/ (coleção) ← NOVA
   │     ├─ {notification_1}
   │     │  ├─ title: "Nova tarefa pública"
   │     │  ├─ message: "Maria criou: Comprar pão"
   │     │  ├─ fromUserId: "def456..."
   │     │  ├─ read: false
   │     │  └─ createdAt: timestamp
   │     │
   │     └─ {notification_2}
   │        ├─ title: "Amizade Aceita"
   │        ├─ message: "Pedro aceitou sua solicitação"
   │        ├─ read: true
   │        └─ ...
   │
   └─ {uid_usuario_B}
      └─ ... (mesma estrutura)
```

---

## 5️⃣ Fluxo de Controle de Acesso

```
                    ┌─────────────────────────┐
                    │  Usuário tenta acessar  │
                    │    tarefa de outro      │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ A tarefa é privada?     │
                    └────┬─────────────────┬──┘
                         │                 │
                        SIM               NÃO
                         │                 │
                         ↓                 ↓
                    ┌─────────────┐   ┌──────────────────┐
                    │   BLOQUEADO │   │ São amigos?      │
                    │  ❌ Erro    │   └────┬──────────┬───┘
                    └─────────────┘        │          │
                                          SIM        NÃO
                                          │          │
                                          ↓          ↓
                                    ┌──────────┐  ┌────────┐
                                    │ PERMITIDO│  │BLOQUEADO
                                    │  ✅ OK   │  │ ❌ Erro
                                    └──────────┘  └────────┘
```

---

## 6️⃣ Ciclo de Vida da Aplicação

```
┌──────────────────────────────────────────────────────────┐
│                   INICIALIZAÇÃO                          │
├──────────────────────────────────────────────────────────┤
│  1. Carrega Firebase Config                              │
│  2. Inicializa Auth e Firestore                          │
│  3. Aguarda autenticação                                 │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│              USUÁRIO FAZ LOGIN                           │
├──────────────────────────────────────────────────────────┤
│  Auth State Change dispara:                              │
│  - Mostra app screen                                     │
│  - Inicia 3 listeners:                                   │
│    ├─ startTasksListener()                               │
│    ├─ startFriendsListener()                             │
│    └─ startNotificationsListener()                       │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│           LISTENERS MONITORAM EM TEMPO REAL              │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐    │
│  │ 1. onSnapshot(users/{uid}/tasks/)              │    │
│  │    → Atualiza quando tarefas mudam              │    │
│  │                                                 │    │
│  │ 2. onSnapshot(users/{uid}/friends/)            │    │
│  │    + onSnapshot(users/{uid}/friendRequests/)   │    │
│  │    → Atualiza amigos e solicitações             │    │
│  │                                                 │    │
│  │ 3. onSnapshot(users/{uid}/notifications/)      │    │
│  │    → Atualiza notificações em tempo real        │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  Qualquer mudança no Firestore = UI atualiza             │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│           USUÁRIO INTERAGE COM APP                       │
├──────────────────────────────────────────────────────────┤
│  ✓ Buscar amigo                                          │
│  ✓ Enviar/aceitar/recusar solicitação                   │
│  ✓ Criar/editar/deletar tarefa                          │
│  ✓ Marcar tarefa como concluída                         │
│  ✓ Ver tarefas públicas de amigo                        │
│  ✓ Marcar notificação como lida                         │
│                                                          │
│  Cada ação atualiza Firestore                            │
│  → Listeners detectam mudança                            │
│  → UI atualiza automaticamente                           │
│  → Todos os amigos veem em tempo real                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│               USUÁRIO FAZ LOGOUT                         │
├──────────────────────────────────────────────────────────┤
│  - Cancela todos os listeners                            │
│  - Limpa dados da UI                                     │
│  - Volta para tela de login                              │
│  - Escuta novo auth state change                         │
└──────────────────────────────────────────────────────────┘
```

---

## 7️⃣ Tabela de Permissões

```
┌───────────────────┬──────────────┬──────────────┬──────────────┐
│  Ação             │  Tarefa      │  Tarefa      │  Relação     │
│                   │  Privada     │  Pública     │  Amigos?     │
├───────────────────┼──────────────┼──────────────┼──────────────┤
│ Ver sua própria   │     ✅       │     ✅       │      -       │
│ Editar própria    │     ✅       │     ✅       │      -       │
│ Deletar própria   │     ✅       │     ✅       │      -       │
│                   │              │              │              │
│ Ver de outro      │     ❌       │     ❌       │    NÃO       │
│ Ver de amigo      │     ❌       │     ✅       │    SIM       │
│ Editar de outro   │     ❌       │     ❌       │      -       │
│ Deletar de outro  │     ❌       │     ❌       │      -       │
│                   │              │              │              │
│ Receber notif     │     -        │     ✅       │    SIM       │
│ Ver no perfil     │     -        │     ✅       │    SIM       │
│ Bloquear acesso   │     -        │     ✅       │    NÃO       │
└───────────────────┴──────────────┴──────────────┴──────────────┘

Legenda:
✅ = Permitido
❌ = Bloqueado
 - = Não aplicável
```

---

## 8️⃣ Timeline de Exemplo

```
[10:00] Usuário A se loga
        → Carrega tarefas, amigos, notificações
        → UI mostra 0 amigos, 0 notificações

[10:05] Usuário A busca "maria@email.com"
        → Clica "Adicionar"
        → Firebase cria: users/B/friendRequests/req1

[10:10] Usuário B se loga
        → Vê "Solicitações Recebidas" com Usuário A
        → Clica "Aceitar"
        → Firebase cria:
          - users/A/friends/B
          - users/B/friends/A

[10:15] Usuário A navega para aba "Amigos"
        → Vê Usuário B na lista "Meus Amigos"

[10:20] Usuário A cria tarefa:
        - Nome: "Comprar leite"
        - Visibilidade: Pública
        → Firebase cria: users/A/tasks/task1
        → Função createNotificationForFriends() executada
        → Firebase cria: users/B/notifications/notif1

[10:21] Usuário B:
        → Badge de notificação aparece (🔔 1)
        → Clica na aba "Notificações"
        → Vê: "Usuário A criou: Comprar leite"

[10:25] Usuário B:
        → Aba "Amigos" → "Ver tarefas" de A
        → Modal abre mostrando "Comprar leite"
        → Tarefas privadas de A NÃO aparecem

[10:30] Usuário B:
        → Clica ○ na notificação
        → Notificação marcada como lida (✓)
        → Badge some da aba

[10:35] Usuário A remove Usuário B da amizade
        → Firebase delete:
          - users/A/friends/B
          - users/B/friends/A
        → Usuário B já não vê tarefas públicas de A

---

Tempo decorrido: 35 minutos
Ações realizadas: 8
Documentos criados: ~5
Sistema funcionando: ✅ Perfeito!
```

---

## 💾 Resumo dos Diagramas

1. **Amizade**: Solicitação → Aceitação → Recíproco
2. **Tarefas**: Criar → Detectar Pública → Notificar amigos
3. **Notificações**: Criar → Listener → UI atualiza em tempo real
4. **Dados**: Estrutura hierárquica no Firestore
5. **Acesso**: Apenas amigos veem tarefas públicas
6. **Ciclo**: Login → Listeners → Interação → Logout
7. **Permissões**: Tabela clara de o que pode fazer

---

*Versão: 2.0 | Data: Janeiro 2026*
