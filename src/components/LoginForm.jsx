import { useState } from "react";
import axios from "axios";
import FormTitle from "./FormTitle";
import InputField from "./InputField";
import Button from "./Button";

function LoginForm() {
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

    try {
      const response = await axios.post("http://127.0.0.1:8000/usuarios/login", {
        correo_usuario: formData.correo_usuario,
        password_usuario: formData.password_usuario,
      });

      // Aquí puedes guardar el token que devuelva el backend
      localStorage.setItem("token", response.data.access_token);

      alert("✅ Inicio de sesión exitoso");
      console.log("🔑 Token guardado:", response.data.access_token);
    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.detail || "Credenciales incorrectas"}`);
      } else {
        alert("❌ No se pudo conectar con el servidor");
      }
      console.error("Error en login:", error);
    }
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
        <Button text="Volver al inicio" type="button" />
      </div>
    </form>
  );
}

export default LoginForm;
