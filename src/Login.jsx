import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function LoginCadastro() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [usuariosExistem, setUsuariosExistem] = useState(true);

  const navigate = useNavigate();

  const formatUser = (nomeUsuario) => `${nomeUsuario}@app.com`;

  const showAlert = (titulo, mensagem) => {
    alert(`${titulo}\n\n${mensagem}`);
  };

  const handleLogin = async () => {
    if (!usuario || !senha) {
      showAlert("Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, formatUser(usuario), senha);
      const user = cred.user;

      // salva usuário logado localmente
      const usuarioParaSalvar = {
        uid: user.uid,
        nome: usuario, // se for login normal, usa o nome digitado
        email: user.email,
        foto: "/assets/user.png",
        tipo: "local"
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioParaSalvar));

      setUsuario("");
      setSenha("");
      showAlert("Sucesso", `Bem-vindo, ${usuarioParaSalvar.nome}!`);

      navigate("/home");
    } catch (err) {
      console.error("Erro no login:", err);
      showAlert("Erro", "Usuário ou senha inválidos!");
    }
  };

  const handleCadastro = async () => {
    if (!usuario || !senha) {
      showAlert("Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formatUser(usuario), senha);

      showAlert("Sucesso", "Usuário cadastrado com sucesso!");

      setUsuario("");
      setSenha("");

      // Volta para modo login
      setUsuariosExistem(true);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);

      if (err.code === "auth/weak-password") {
        showAlert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === "auth/email-already-in-use") {
        showAlert("Erro", "Este usuário já existe.");
      } else if (err.code === "auth/invalid-email") {
        showAlert("Erro", "Usuário inválido, tente outro nome.");
      } else {
        showAlert("Erro", "Não foi possível cadastrar. Tente novamente.");
      }
    }
  };

  const alternarModo = () => setUsuariosExistem(!usuariosExistem);

  // login com Google
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = async () => {
    if (loadingGoogle) return; // impede múltiplos cliques

    try {
      setLoadingGoogle(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Padroniza o formato salvo no localStorage
      const usuarioParaSalvar = {
        uid: user.uid,
        nome: user.displayName || "Usuário Google",
        email: user.email,
        foto: user.photoURL || "/assets/user.png",
        tipo: "google"
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioParaSalvar));

      alert(`Bem-vindo, ${usuarioParaSalvar.nome}!`);
      window.location.href = "/home";
    } catch (err) {
      console.error(err);

      if (err.code === "auth/popup-blocked") {
        alert("O navegador bloqueou o popup. Desative bloqueadores ou permita popups.");
      } else if (err.code === "auth/cancelled-popup-request") {
        alert("Requisição de login cancelada. Tente novamente.");
      } else if (err.code === "auth/network-request-failed") {
        alert("Erro de rede. Verifique sua conexão.");
      } else {
        alert("Erro ao fazer login com Google.");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <h2>{usuariosExistem ? "Login" : "Cadastro"}</h2>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={usuariosExistem ? handleLogin : handleCadastro}>
          {usuariosExistem ? "Entrar" : "Cadastrar"}
        </button>

        <p className="toggle" onClick={alternarModo}>
          {usuariosExistem
            ? "Não possui conta? Cadastre-se"
            : "Já possui conta? Faça login"}
        </p>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
        >
          {loadingGoogle ? "Carregando..." : "Entrar com Google"}
        </button>

      </div>
    </div>
  );
}