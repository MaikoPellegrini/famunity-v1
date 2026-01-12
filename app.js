import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const status = document.getElementById("status");

document.getElementById("btnCadastrar").onclick = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.value, senha.value);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome: nome.value,
      email: email.value,
      role: "user",
      familias: [],
      createdAt: serverTimestamp()
    });
    status.textContent = "Cadastro realizado com sucesso!";
  } catch (e) {
    status.textContent = "Erro ao cadastrar: " + e.message;
  }
};

document.getElementById("btnEntrar").onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value);
    status.textContent = "Login realizado com sucesso!";
  } catch (e) {
    status.textContent = "Erro ao entrar: " + e.message;
  }
};