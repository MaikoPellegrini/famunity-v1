# 📋 Guia de Testes - Recurring Tasks Feature

## 🌐 URL da Aplicação

**App está acessível em:** https://famunity-1.web.app

---

## 👥 Dados para Teste (2 Usuários)

### Usuário 1 - Teste Básico
- **Email:** user1.test@example.com
- **Senha:** Test123456!
- **Propósito:** Testar criação e recorrência de tarefas

### Usuário 2 - Teste de Amigos
- **Email:** user2.test@example.com  
- **Senha:** Test123456!
- **Propósito:** Testar sistema de amigos e tarefas públicas

---

## 📝 Instruções de Teste

### Fase 1: Criação de Conta (5 minutos)

1. **Usuário 1:**
   - Abra https://famunity-1.web.app
   - Clique em "Criar Conta"
   - Email: `user1.test@example.com`
   - Senha: `Test123456!`
   - Confirme a senha
   - Clique em "Registrar"

2. **Usuário 2:**
   - Faça o mesmo com `user2.test@example.com`

---

### Fase 2: Teste de Tarefas Recorrentes (15 minutos)

#### 2.1 Criar Tarefa Diária (Usuário 1)

1. Na aba "Tarefas", preencha:
   - **Nome:** "Exercício Matinal"
   - **Data:** Hoje (20 de janeiro de 2026)
   - **Hora:** 06:30
   - **Prioridade:** Alta
   - **Recorrência:** ✅ Diariamente
   - **Notificação:** 30 minutos antes
   - **Descrição:** "Série de exercícios na academia"

2. Clique em "Adicionar Tarefa"

3. **Verificar:**
   - ✅ Tarefa aparece na lista com badge 🔄 Diário
   - ✅ Badge 🔔 30 min aparece
   - ✅ "Próxima: 21 de jan. de 2026" é mostrada

#### 2.2 Criar Tarefa Semanal (Usuário 1)

1. Preencha:
   - **Nome:** "Compras de Supermercado"
   - **Data:** Sábado (25 de janeiro)
   - **Recorrência:** Semanalmente
   - **Notificação:** 1 dia antes
   - **Descrição:** "Comprar alimentos para semana"

2. **Verificar:**
   - ✅ Badge mostra 🔄 Semanal
   - ✅ Próxima data é 1º de fevereiro

#### 2.3 Criar Tarefa Customizada (Usuário 1)

1. Preencha:
   - **Nome:** "Tomar Medicamento"
   - **Data:** Hoje
   - **Hora:** 08:00
   - **Recorrência:** Personalizado
   - **Dias:** 12
   - **Notificação:** 1 hora antes
   - **Descrição:** "Medicamento prescrito"

2. **Verificar:**
   - ✅ Campo de dias aparece quando seleciona "Personalizado"
   - ✅ Próxima data é 01 de fevereiro (hoje + 12 dias)

---

### Fase 3: Teste de Notificações (10 minutos)

#### 3.1 Verificar Sistema de Notificações

1. **Criar tarefa com notificação próxima:**
   - **Nome:** "Teste Notificação"
   - **Data:** Hoje
   - **Hora:** 20:10 (10 minutos no futuro)
   - **Notificação:** 5 minutos antes
   - **Recorrência:** Diariamente

2. **Aguarde 5-10 minutos** para a notificação ser acionada

3. **Verificar:**
   - ✅ Notificação aparece na aba "Notificações"
   - ✅ Campo `notificationSent` fica true
   - ✅ Na próxima recorrência, notificationSent volta a false

---

### Fase 4: Teste de Auto-Recorrência (10 minutos)

#### 4.1 Completar Tarefa Recorrente (Usuário 1)

1. **Clique no checkbox** da tarefa "Exercício Matinal"

2. **Verificar:**
   - ✅ Tarefa é marcada como concluída ✓
   - ✅ **IMPORTANTE:** Uma NOVA tarefa com mesmo nome aparece na lista
   - ✅ Nova tarefa tem data = "21 de janeiro" (nextDate da original)
   - ✅ Nova tarefa tem nextDate = "22 de janeiro"
   - ✅ Recorrência mantida (🔄 Diário)
   - ✅ Notificação mantida (🔔 30 min)

#### 4.2 Testar Cada Tipo de Recorrência

| Tarefa | Recorrência | Data Criada | Próxima (Esperada) | Após Completar |
|--------|-------------|------------|-------------------|----------------|
| Exercício | Daily | Jan 20 | Jan 21 | Nova com data=Jan 21 |
| Compras | Weekly | Jan 25 | Feb 1 | Nova com data=Feb 1 |
| Medicamento | Custom (12d) | Jan 20 | Feb 1 | Nova com data=Feb 1 |

---

### Fase 5: Teste de Amigos & Tarefas Públicas (15 minutos)

#### 5.1 Adicionar Usuário 2 como Amigo (Usuário 1)

1. Na aba "Amigos", procure por:
   - **Email:** user2.test@example.com

2. Clique em "Adicionar"

3. **Verificar:**
   - ✅ Request aparece para Usuário 2

#### 5.2 Aceitar Amizade (Usuário 2)

1. Faça login como Usuário 2
2. Aba "Amigos" → "Pendente"
3. Clique em "Aceitar" para Usuário 1

#### 5.3 Criar Tarefa Pública (Usuário 1)

1. Faça login como Usuário 1
2. Crie nova tarefa:
   - **Nome:** "Churrasco no Fim de Semana"
   - **Visibilidade:** Pública ⚠️
   - **Recorrência:** Semanalmente (sábados)
   - **Notificação:** 2 dias antes

3. **Verificar:**
   - ✅ Notificação foi criada para Usuário 2
   - ✅ Usuário 2 vê badge de notificação

#### 5.4 Usuário 2 Vê Tarefa Pública

1. Faça login como Usuário 2
2. Aba "Tarefas"
3. **Verificar:**
   - ✅ Vê tarefa "Churrasco" com 📌 (indica pública)
   - ✅ Vê notificação na aba "Notificações"

---

### Fase 6: Teste de Casos Extremos (10 minutos)

#### 6.1 Tarefa Sem Notificação
- Criar tarefa com Notificação = 0
- ✅ Verificar: Não mostra badge 🔔

#### 6.2 Tarefa Sem Recorrência
- Criar tarefa com Recorrência = "Sem recorrência"
- ✅ Marcar como concluída
- ✅ Verificar: NÃO cria próxima tarefa

#### 6.3 Editar Campo Customizado
- Criar com Recorrência = "Personalizado"
- Deixar dias em branco
- ✅ Verificar: Aparece erro "Digite uma quantidade válida"

#### 6.4 Múltiplas Recorrências
- Criar 5 tarefas com recorrências diferentes
- ✅ Verificar: Cada uma calcula nextDate corretamente

---

## 🐛 Checklist de Verificação

### Criação de Tarefas
- [ ] Form valida nome obrigatório
- [ ] Form valida dias customizados quando selecionado
- [ ] Campos de notificação aceitam 0-999
- [ ] Campo de hora é opcional
- [ ] Data é obrigatória para recorrências

### Recorrências
- [ ] Daily: cada dia +1
- [ ] Weekly: cada 7 dias
- [ ] Biweekly: cada 14 dias
- [ ] Monthly: mesmo dia cada mês
- [ ] Yearly: mesmo dia cada ano
- [ ] Custom: +X dias corretos

### Badges & UI
- [ ] Recurrence badge mostra corretamente
- [ ] Notification badge mostra corretamente
- [ ] Próxima data formatada em pt-BR
- [ ] Checkbox funciona para marcar completo

### Auto-Recorrência
- [ ] Completar task cria nova task
- [ ] Nova task herdaRecurrence do original
- [ ] Nova task herda notificationTime/Unit
- [ ] Nova task herda outros campos (location, priority, etc)
- [ ] Nova task tem done=false

### Notificações
- [ ] Notificações são criadas in Firestore
- [ ] notificationSent fica true após enviar
- [ ] Notificação reseta em nova recorrência
- [ ] 5 minutos de diferença entre check é ok

### Amigos
- [ ] Adicionar friend cria request
- [ ] Aceitar friend cria registro
- [ ] Tarefa pública cria notificação para amigos
- [ ] Amigo pode ver tarefa pública

---

## 📊 Logs para Monitora (Browser Console)

Abra DevTools (F12) e veja Console para:

```javascript
// Deve aparecer quando carrega
"Listener iniciado para tarefas"

// Deve aparecer a cada 5 minutos
"Verificando notificações..."

// Deve aparecer quando completa tarefa recorrente
"Nova tarefa recorrente criada"

// Erros devem ser mínimos (sem "'catch' or 'finally' expected")
```

---

## 🚨 Problemas Comuns & Soluções

| Problema | Solução |
|----------|---------|
| Não entra após registrar | Verifique email/senha, tente fazer login manual |
| Tarefa não aparece | Recarregue página, verifique Firestore rules |
| Recorrência não cria próxima | Verifique isRecurrent=true, check console para erros |
| Notificação não aparece | Verifique notificationTime>0, aguarde 5 minutos |
| Badge errado | Limpe cache (Ctrl+Shift+R), recarregue |

---

## 📱 Dicas para Teste

### Pré-Carregar Dados Rápido
```javascript
// No console, execute para criar teste rápido:
// (apenas para desenvolvimento, não use em produção)
```

### Simular Tempo Futuro
- Crie tasks com times próximos para testar notificações rápido
- Ex: "Teste Rápido" para 20:15 com 5min de notificação

### Verificar Firestore Diretamente
1. Vá para Firebase Console: https://console.firebase.google.com
2. Projeto: famunity-1
3. Firestore Database
4. Coleção: users > {uid} > tasks
5. Veja documentos criados

---

## 📞 Relatório de Bugs

Se encontrar erro, anote:
1. **O que fez:** Passos exatos para reproduzir
2. **O que esperava:** Resultado esperado
3. **O que aconteceu:** Resultado real
4. **Console error:** Mensagem exata do erro
5. **Firestore data:** Screenshots dos dados salvos

---

## ✅ Teste Completo Estimado

- Fase 1 (Criação): 5 min
- Fase 2 (Recorrência): 15 min
- Fase 3 (Notificações): 10 min
- Fase 4 (Auto-recorrência): 10 min
- Fase 5 (Amigos): 15 min
- Fase 6 (Casos extremos): 10 min

**Total: ~65 minutos para teste completo**

---

## 🎯 Objetivo Final

Após estes testes, esperamos confirmar:

✅ Tarefas recorrentes são criadas com nextDate correto
✅ Badges mostram tipo de recorrência e notificação
✅ Auto-recorrência cria nova tarefa ao completar
✅ Sistema de notificações funciona a cada 5 minutos
✅ Amigos podem ver tarefas públicas recorrentes
✅ Notificações são criadas in Firestore para amigos
✅ Nenhum erro de syntax ou runtime

---

Bom teste! 🚀

