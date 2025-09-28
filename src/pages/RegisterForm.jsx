import { useState } from "react";
import axios from "axios";
import FormTitle from "../components/FormTitle";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "../styles/AuthForm.css";
import { useNavigate } from "react-router-dom";  
import { useAuth } from "../context/AuthContext"; 

function RegisterForm() {
  const navigate = useNavigate(); 
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    telefono_usuario: "",
    correo_usuario: "",
    password_usuario: "",
    confirmar: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password_usuario !== formData.confirmar) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/usuarios/register", {
        nombre_usuario: formData.nombre_usuario,
        apellido_usuario: formData.apellido_usuario,
        correo_usuario: formData.correo_usuario,
        telefono_usuario: formData.telefono_usuario,
        password_usuario: formData.password_usuario,
        direccion_usuario: "Sin dirección",
        codigo_postal_usuario: "00000",
        imagen_usuario: null,
        id_rol: 4,
        estado_usuario: "activo",
      });

      alert(`✅ ${response.data.msg}`);
      console.log("✅ Registro exitoso:", response.data);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);

        const userData = {
          nombre: formData.nombre_usuario,
          correo: formData.correo_usuario,
          token: response.data.access_token,
        };
        login(userData); 
      }

      navigate("/");

    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.detail || "Error en el registro"}`);
      } else {
        alert("❌ No se pudo conectar con el servidor");
      }
      console.error("Error en el registro:", error);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="form-title">
        <FormTitle text="Registro de Usuario PET HEALTH-SERVICE´S" />
      </div>

      <InputField
        label="Nombre:"
        type="text"
        name="nombre_usuario"
        value={formData.nombre_usuario}
        onChange={handleChange}
        placeholder="Ingrese su nombre"
        required
      />
      <InputField
        label="Apellido:"
        type="text"
        name="apellido_usuario"
        value={formData.apellido_usuario}
        onChange={handleChange}
        placeholder="Ingrese su apellido"
        required
      />
      <InputField
        label="Teléfono:"
        type="tel"
        name="telefono_usuario"
        value={formData.telefono_usuario}
        onChange={handleChange}
        placeholder="Ej: 3001234567"
        required
      />
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
      <InputField
        label="Confirmar contraseña:"
        type="password"
        name="confirmar"
        value={formData.confirmar}
        onChange={handleChange}
        placeholder="Repita su contraseña"
        required
      />

      <label className="checkbox">
        <input type="checkbox" name="politicas" required />
        <span>Acepto las políticas de privacidad</span>
      </label>

      <div className="buttons">
        <Button text="Registrarse" type="submit" />
        <Button text="Volver al inicio" type="button" onClick={handleBackToHome} />
      </div>
    </form>
  );
}

export default RegisterForm;
