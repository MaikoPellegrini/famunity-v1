# 📋 Guia de Teste - Sistema de Amizade e Notificações

## Pré-requisitos para Testes

- 2 ou mais contas de usuário criadas no Firebase
- Acesso ao app em dois navegadores diferentes ou modo incógnito
- Console do navegador aberto (F12) para verificar logs

---

## Cenário 1: Procurar e Adicionar Amigos

### Teste A: Busca por Email
**Steps:**
1. Usuário A loga na conta
2. Na aba **"Amigos"** → Campo de busca
3. Digite o email do Usuário B
4. Clique em "Procurar"
5. Resultado esperado: Deve exibir o Usuário B com botão "Adicionar"

**Status**: ✅ Passou / ❌ Falhou

### Teste B: Enviar Solicitação
**Steps:**
1. Na lista de resultados, clique em "Adicionar"
2. Botão deve ficar desabilitado com "✓ Solicitação enviada"
3. Resultado esperado: Mensagem de sucesso "Solicitação de amizade enviada!"

**Status**: ✅ Passou / ❌ Falhou

---

## Cenário 2: Receber e Gerenciar Solicitações

### Teste C: Visualizar Solicitação Recebida
**Steps:**
1. Usuário B faz refresh na página ou aguarda atualização
2. Na aba **"Amigos"** → Seção "Solicitações de Amizade"
3. Resultado esperado: Deve exibir a solicitação do Usuário A com nome e email

**Status**: ✅ Passou / ❌ Falhou

### Teste D: Aceitar Solicitação
**Steps:**
1. Clique em "Aceitar" na solicitação
2. Resultado esperado: 
   - Mensagem "Amizade aceita!"
   - Usuário A aparece na seção "Meus Amigos" do Usuário B
   - Usuário B aparece na seção "Meus Amigos" do Usuário A (ambos veem reciprocamente)

**Status**: ✅ Passou / ❌ Falhou

### Teste E: Recusar Solicitação (Novo Teste)
**Steps:**
1. Envie outra solicitação de um novo usuário
2. Clique em "Recusar"
3. Resultado esperado: Solicitação desaparece da lista

**Status**: ✅ Passou / ❌ Falhou

---

## Cenário 3: Tarefas Públicas

### Teste F: Criar Tarefa Pública
**Steps:**
1. Usuário A cria uma tarefa:
   - Nome: "Comprar mantimentos"
   - Visibilidade: **"Pública"**
   - Clique em "Adicionar Tarefa"
2. Resultado esperado: 
   - Tarefa aparece em "Minhas Tarefas" com badge "🌍 Pública"
   - Mensagem de sucesso

**Status**: ✅ Passou / ❌ Falhou

### Teste G: Ver Tarefas Públicas de Amigo
**Steps:**
1. Usuário B vai para aba **"Amigos"** → seção "Meus Amigos"
2. Clica em "Ver tarefas" do Usuário A
3. Resultado esperado: 
   - Modal abre com título "Tarefas Públicas de [Nome]"
   - Exibe a tarefa "Comprar mantimentos" criada
   - Não há botões de editar/deletar (apenas visualização)

**Status**: ✅ Passou / ❌ Falhou

### Teste H: Não Ver Tarefas Privadas
**Steps:**
1. Usuário A cria uma tarefa privada: "Tarefa secreta"
2. Usuário B vai ver tarefas públicas de A
3. Resultado esperado: 
   - Modal mostra apenas tarefas públicas
   - "Tarefa secreta" NÃO aparece

**Status**: ✅ Passou / ❌ Falhou

---

## Cenário 4: Notificações

### Teste I: Receber Notificação ao Criar Tarefa Pública
**Steps:**
1. Usuário A tem Usuário B como amigo aceito
2. Usuário A cria tarefa pública: "Ir à academia"
3. Usuário B aguarda alguns segundos
4. Resultado esperado:
   - Badge vermelho "1" aparece na aba "Notificações"
   - Aba "Notificações" mostra a notificação: "Nova tarefa pública"
   - Mensagem: "[Nome A] criou uma tarefa pública: 'Ir à academia'"

**Status**: ✅ Passou / ❌ Falhou

### Teste J: Múltiplas Notificações
**Steps:**
1. Usuário A cria 3 tarefas públicas diferentes
2. Resultado esperado:
   - Badge mostra "3"
   - Todas as 3 notificações aparecem listadas
   - Mais recentes aparecem primeiro

**Status**: ✅ Passou / ❌ Falhou

### Teste K: Marcar Notificação como Lida
**Steps:**
1. Na aba "Notificações", clique no ícone "○"
2. Resultado esperado:
   - Ícone muda para "✓"
   - Item deixa de ter fundo cinza
   - Badge de notificações não lidas diminui

**Status**: ✅ Passou / ❌ Falhou

---

## Cenário 5: Remover Amigos

### Teste L: Remover Amigo
**Steps:**
1. Na aba **"Amigos"** → seção "Meus Amigos"
2. Clique em "Remover" (ícone 🗑️)
3. Resultado esperado:
   - Amigo desaparece da lista
   - Badge de contagem de amigos diminui
   - Reciprocamente: Amigo tb não vê você em sua lista

**Status**: ✅ Passou / ❌ Falhou

### Teste M: Não Ver Tarefas Após Remover
**Steps:**
1. Depois de remover o amigo (Teste L)
2. Tente procurar pelo amigo novamente e busque ver tarefas
3. Resultado esperado:
   - Não consegue mais ver tarefas dele
   - Pode enviar nova solicitação de amizade

**Status**: ✅ Passou / ❌ Falhou

---

## Cenário 6: Casos Extremos

### Teste N: Não Enviar Solicitação Duplicada
**Steps:**
1. Usuário A procura Usuário B novamente
2. Se já tiver enviado uma solicitação pendente
3. Resultado esperado: Botão deve estar desabilitado ou avisar sobre solicitação existente

**Status**: ✅ Passou / ❌ Falhou

### Teste O: Busca Não Encontra a Si Mesmo
**Steps:**
1. Usuário A busca pelo seu próprio email
2. Resultado esperado: Sua conta não aparece nos resultados

**Status**: ✅ Passou / ❌ Falhou

### Teste P: Tarefas Públicas com Status de Conclusão
**Steps:**
1. Usuário A marca uma tarefa pública como concluída (checkbox)
2. Usuário B visualiza tarefas públicas
3. Resultado esperado: Checkbox deve aparecer marcado para o amigo também

**Status**: ✅ Passou / ❌ Falhou

---

## Sumário de Testes

| Teste | Nome | Status | Observações |
|-------|------|--------|-------------|
| A | Busca por Email | ⬜ | |
| B | Enviar Solicitação | ⬜ | |
| C | Visualizar Solicitação | ⬜ | |
| D | Aceitar Solicitação | ⬜ | |
| E | Recusar Solicitação | ⬜ | |
| F | Criar Tarefa Pública | ⬜ | |
| G | Ver Tarefas Públicas | ⬜ | |
| H | Não Ver Privadas | ⬜ | |
| I | Receber Notificação | ⬜ | |
| J | Múltiplas Notificações | ⬜ | |
| K | Marcar Lida | ⬜ | |
| L | Remover Amigo | ⬜ | |
| M | Após Remover | ⬜ | |
| N | Solicitação Duplicada | ⬜ | |
| O | Busca Não Encontra Self | ⬜ | |
| P | Status Tarefa Pública | ⬜ | |

**Legenda**: ⬜ = Não testado | ✅ = Passou | ❌ = Falhou

---

## Notas Importantes para Debugging

### Se as notificações não chegam:
- Verifique se o usuário que criou a tarefa tem o outro como amigo **aceito**
- Verifique o console do navegador (F12) para erros
- Aguarde alguns segundos, as atualizações são em tempo real

### Se as tarefas públicas não aparecem:
- Confirme que as contas são amigas (status "accepted")
- Verifique se a tarefa tem `visibility: "publica"`
- Refresque a página (Ctrl+R)

### Se solicitações não aparecem:
- Verifique o Firestore console do Firebase para confirmar que documento foi criado
- Certifique-se que o email usado é exatamente igual (case-sensitive)

### Limpar dados para novo teste:
- Delete solicitações e amigos no Firestore manualmente
- Ou crie novas contas de teste

---

**Data de Teste**: _______________  
**Testador**: _______________  
**Resultado Final**: ✅ Passou / ❌ Falhou / ⚠️ Com Ressalvas
