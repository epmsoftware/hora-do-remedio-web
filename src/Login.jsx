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
  const [modoLogin, setModoLogin] = useState(true);

  const navigate = useNavigate();

  const formatUser = (nomeUsuario) => `${nomeUsuario}@login.local`;

  // login/cadastro com email e senha
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    // Verifica antes de enviar ao Firebase
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      if (modoLogin) {
        // LOGIN NORMAL
        const cred = await signInWithEmailAndPassword(auth, formatUser(usuario), senha);
        alert(`Bem-vindo, ${usuario}!`);
        localStorage.setItem("usuarioLogado", JSON.stringify(cred.user));
        navigate("/dashboard");
      } else {
        // CADASTRO
        await createUserWithEmailAndPassword(auth, formatUser(usuario), senha);
        alert("Usuário cadastrado com sucesso! Faça login para continuar.");
        setModoLogin(true); // muda automaticamente para modo login
        setUsuario("");
        setSenha("");
      }
    } catch (err) {
      console.error("Erro Firebase:", err.code, err.message);

      if (err.code === "auth/weak-password") {
        alert("A senha deve ter pelo menos 6 caracteres.");
      } else if (err.code === "auth/email-already-in-use") {
        alert("Este usuário já existe.");
      } else if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-email"
      ) {
        alert("Usuário não cadastrado. Alternando para tela de cadastro...");
        setModoLogin(false);
      } else if (err.code === "auth/wrong-password") {
        alert("Senha incorreta. Tente novamente.");
      } else {
        alert("Erro ao autenticar. Tente novamente.");
      }
    }
  };

  // login com Google
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = async () => {
    if (loadingGoogle) return; // impede múltiplos cliques

    try {
      setLoadingGoogle(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      alert(`Bem-vindo, ${user.displayName}!`);
      navigate("/dashboard");
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
        <h2>{modoLogin ? "Login" : "Cadastro"}</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">
            {modoLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p className="toggle" onClick={() => setModoLogin(!modoLogin)}>
          {modoLogin
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