import { useState } from "react";
import "./index.css";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        {isLogin ? (
          <p>
            ¿No tienes cuenta?{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#6E7255",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setIsLogin(false)}
            >
              Regístrate aquí
            </button>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{" "}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#6E7255",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => setIsLogin(true)}
            >
              Inicia sesión aquí
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
