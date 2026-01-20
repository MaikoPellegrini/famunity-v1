# 🚀 Guia de Instalação e Deployment - Versão 2.0

## 📋 Pré-requisitos

- Conta Firebase criada em [firebase.google.com](https://firebase.google.com)
- Projeto Firebase ativo
- Firestore Database habilitado
- Node.js 14+ (opcional, para Cloud Functions)
- Editor de código (VS Code recomendado)

---

## ✅ Passo 1: Verificar Arquivos

Confirme que você tem os seguintes arquivos no seu projeto:

```
famunity-v1-main/
├── index.html          ← ATUALIZADO com novas abas
├── app.js              ← ATUALIZADO com novo código
├── firebase-config.js
├── package.json
├── server.js
├── EVOLUCAO.md         ← NOVO
├── MUDANCAS_V2.md      ← NOVO
├── GUIA_TESTES.md      ← NOVO
├── FIRESTORE_RULES.js  ← NOVO
├── CLOUD_FUNCTIONS.js  ← NOVO
└── style-v2.css        ← NOVO (opcional, para melhor visual)
```

---

## 🔐 Passo 2: Configurar Firestore Security Rules

### 2.1 Acesse o Firebase Console

1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Clique em **Firestore Database** (no menu esquerdo)
4. Clique na aba **Rules**

### 2.2 Substitua as Regras

1. Limpe o conteúdo atual das regras
2. Copie o conteúdo de `FIRESTORE_RULES.js` (exceto comentários no final)
3. Cole no editor do Firebase
4. Clique em **Publicar**

**Resultado esperado:** Mensagem verde "Regras publicadas com sucesso"

⚠️ **IMPORTANTE**: Sem estas regras, o aplicativo pode ter problemas de segurança!

---

## 🌐 Passo 3: Fazer Deploy

### Opção A: Firebase Hosting (Recomendado)

#### 3A.1 Instale Firebase CLI

```bash
npm install -g firebase-tools
```

#### 3A.2 Autentique

```bash
firebase login
```

Isso abrirá o navegador para você fazer login com sua conta Google.

#### 3A.3 Inicialize o Projeto

```bash
firebase init
```

Responda às perguntas:
- **Which Firebase features do you want to set up?** → Selecione `Hosting`
- **What do you want to use as your public directory?** → Digite `.` (ponto) ou `public`
- **Configure as a single-page app?** → `Y`

#### 3A.4 Deploy

```bash
firebase deploy --only hosting
```

Você receberá uma URL pública como: `https://seu-projeto.firebaseapp.com`

### Opção B: Servidor Local (para testes)

```bash
# Instale dependências
npm install

# Inicie servidor
npm start
# ou
node server.js
```

Acesse em: `http://localhost:3000`

---

## 📱 Passo 4: Atualizar CSS (Opcional)

Se quiser o visual melhorado:

1. Abra `index.html`
2. Encontre a tag `<style>` (linha ~23)
3. Substitua ou adicione o conteúdo de `style-v2.css`
4. OU adicione um link:

```html
<link rel="stylesheet" href="style-v2.css">
```

---

## ☁️ Passo 5: Cloud Functions (OPCIONAL - Para Melhor Segurança)

### 5.1 Criar projeto de functions

```bash
mkdir functions
cd functions
npm init -y
```

### 5.2 Instalar dependências

```bash
npm install firebase-admin firebase-functions
```

### 5.3 Criar arquivo functions/index.js

Copie o conteúdo de `CLOUD_FUNCTIONS.js` para `functions/index.js`

### 5.4 Deploy

```bash
firebase deploy --only functions
```

**Benefícios:**
- Notificações processadas no servidor (mais seguro)
- Reduz sobrecarga do cliente
- Melhor performance

---

## ✨ Passo 6: Teste Sua Instalação

### 6.1 Criar Contas de Teste

1. Abra o app em seu navegador
2. Crie 2-3 contas com emails diferentes
3. Anote os emails para os testes

### 6.2 Testar Sistema de Amizade

**Teste 1: Buscar Usuário**
- Conta A: Aba "Amigos" → Busque o email da Conta B
- ✅ Deve exibir a Conta B nos resultados

**Teste 2: Enviar Solicitação**
- Conta A: Clique "Adicionar" na Conta B
- ✅ Deve mostrar mensagem de sucesso

**Teste 3: Aceitar Solicitação**
- Conta B: Veja em "Solicitações de Amizade"
- Clique "Aceitar"
- ✅ Ambas devem ser amigos agora

### 6.3 Testar Tarefas Públicas

**Teste 4: Criar Tarefa Pública**
- Conta A: Crie uma tarefa com Visibilidade = "Pública"
- ✅ Deve aparecer com badge "🌍 Pública"

**Teste 5: Ver Tarefas de Amigo**
- Conta B: Aba "Amigos" → "Ver tarefas" da Conta A
- ✅ Deve abrir modal com a tarefa pública

### 6.4 Testar Notificações

**Teste 6: Receber Notificação**
- Conte B: Fique na Aba "Notificações"
- Conta A: Crie outra tarefa pública
- ✅ Conta B deve receber notificação em tempo real

---

## 🔧 Troubleshooting

### Problema: "Permission denied" no Firestore

**Solução:**
1. Verifique as Security Rules foram publicadas
2. Certifique-se está logado (verifique `userEmailEl`)
3. Verifique console (F12) para erros específicos

### Problema: Amigos não aparecem

**Solução:**
1. Confirme que as contas são amigas (status "accepted")
2. Refresque a página (Ctrl+R)
3. Verifique Firestore: `users/{uid}/friends`

### Problema: Notificações não chegam

**Solução:**
1. Verifique que ambos são amigos aceitos
2. Confira que tarefa tem `visibility: "publica"`
3. Aguarde 3-5 segundos (sincronização)
4. Verifique Firestore: `users/{uid}/notifications`

### Problema: Erro de CORS

**Solução:**
- Use Firebase Hosting ou servidor com CORS configurado
- Não use `file://` (abrir arquivo local)

---

## 📊 Monitoramento e Logs

### Verificar Logs do Firebase

1. Firebase Console → **Logs** (menu esquerdo)
2. Filtre por:
   - **Colecção**: `users`
   - **Documento**: `{userId}`

### Verificar Console do Navegador

1. Abra Developer Tools (F12)
2. Vá para aba **Console**
3. Procure por mensagens de erro/sucesso

### Firestore Rules Playground

1. Firebase Console → Firestore → **Rules** → **Rules Playground**
2. Simule leitura/escrita com diferentes UIDs
3. Confirme que as regras funcionam como esperado

---

## 🔒 Checklist de Segurança

- [ ] Security Rules foram publicadas
- [ ] Modo Firestore não é "Test Mode" em produção
- [ ] API Keys estão restritas no Firebase
- [ ] Dados sensíveis não são logados no console
- [ ] HTTPS é obrigatório (Firebase Hosting faz isso automaticamente)
- [ ] Autenticação é obrigatória para acessar dados
- [ ] Tarefas privadas não são acessíveis por outros usuários

---

## 📈 Otimizações Recomendadas

### Performance

- Adicione índices Firestore conforme necessário
- Use paginação para grandes listas (próxima versão)
- Implemente lazy loading para imagens (se adicionar)

### Segurança

- Implemente Cloud Functions para notificações
- Use reCAPTCHA em formulários de login/signup
- Adicione rate limiting

### Funcionalidades Futuras

- Sistema de mensagens diretas
- Compartilhamento de tarefas em grupo
- Notificações por email/push
- Integração com calendário

---

## 📚 Documentação Adicional

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/rules)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)

---

## 🎯 Próximos Passos

1. ✅ Instale o código (este passo)
2. ✅ Configure Firestore Rules
3. ✅ Faça deploy
4. ✅ Teste os cenários do `GUIA_TESTES.md`
5. ✅ Configure Cloud Functions (opcional)
6. ⏭️ Implemente melhorias adicionais conforme necessário

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** (Firebase Console)
2. **Abra Developer Tools** (F12) e procure erros
3. **Consulte a documentação** dos arquivos inclusos
4. **Testar manualmente** cada funcionalidade

---

**Versão**: 2.0  
**Última atualização**: Janeiro 2026  
**Status**: ✅ Pronto para deploy
