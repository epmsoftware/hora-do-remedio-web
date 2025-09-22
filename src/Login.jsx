import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";
import { auth } from "../firebaseConfig"; // ajuste o caminho
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

    try {
      let cred;
      if (modoLogin) {
        cred = await signInWithEmailAndPassword(auth, formatUser(usuario), senha);
        alert(`Bem-vindo, ${usuario}!`);
      } else {
        cred = await createUserWithEmailAndPassword(auth, formatUser(usuario), senha);
        alert("Usuário cadastrado com sucesso!");
      }
      localStorage.setItem("usuarioLogado", JSON.stringify(cred.user));
      setUsuario("");
      setSenha("");
      navigate("/dashboard"); // se usar react-router-dom
    } catch (err) {
      console.error(err);
      if (err.code === "auth/weak-password")
        alert("A senha deve ter pelo menos 6 caracteres.");
      else if (err.code === "auth/email-already-in-use")
        alert("Este usuário já existe.");
      else
        alert("Usuário ou senha inválidos.");
    }
  };

  // login com Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      alert(`Bem-vindo, ${user.displayName}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer login com Google.");
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
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          Entrar com Google
        </button>

      </div>
    </div>
  );
}