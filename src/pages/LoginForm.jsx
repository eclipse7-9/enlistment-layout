import { useState } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "axios";
import FormTitle from "../components/FormTitle";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/AuthForm.css";
import { useAuth } from "../context/AuthContext"; 

function LoginForm() {
  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    correo_usuario: "",
    password_usuario: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.correo_usuario || !formData.password_usuario) {
      alert("❌ Ingresa tu correo y contraseña");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/usuarios/login", {
        correo_usuario: formData.correo_usuario,
        password_usuario: formData.password_usuario,
      });

      const userData = {
        correo: response.data.correo,
        nombre: response.data.nombre_usuario,
        id_usuario: response.data.id_usuario,
             id_rol: response.data.id_rol,   // 👈 se guarda el rol
        token: response.data.access_token,
      };

      login(userData);

      alert("✅ Inicio de sesión exitoso");

      if (userData.id_rol === 1) {
        navigate("/admin/users");   // 👈 admins van al panel
      } else {
        navigate("/");              // 👈 clientes van al home
      }

    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.detail || "Credenciales incorrectas"}`);
      } else {
        alert("❌ No se pudo conectar con el servidor");
      }
      console.error("Error en login:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <form onSubmit={handleLogin}>
      <FormTitle text="Iniciar Sesión - PET HEALTH-SERVICE´S" />

      <InputField
        label="Correo electrónico:"
        type="email"
        name="correo_usuario"
        value={formData.correo_usuario}
        onChange={handleChange}
        placeholder="ejemplo@correo.com"
        required
      />

      <InputField
        label="Contraseña:"
        type="password"
        name="password_usuario"
        value={formData.password_usuario}
        onChange={handleChange}
        placeholder="Ingrese su contraseña"
        required
      />

      <div className="buttons">
        <Button text="Ingresar" type="submit" />
        <Button text="Volver al inicio" type="button" onClick={handleBackToHome} />
      </div>
    </form>
  );
}

export default LoginForm;
