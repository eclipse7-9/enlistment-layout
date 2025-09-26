// RegisterForm.jsx
import FormTitle from "./FormTitle";
import InputField from "./InputField";
import Button from "./button"; // IMPORTANTE: coincide con el nombre del archivo

function RegisterForm() {
  const handleRegister = (e) => {
    e.preventDefault();
    alert("Usuario registrado con éxito 🚀");
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="form-title">
        <FormTitle text="Registro de Usuario PET HEALTH-SERVICE´S" />
      </div>

      <InputField label="Nombre:" type="text" name="nombre" placeholder="Ingrese su nombre" required />
      <InputField label="Apellido:" type="text" name="apellido" placeholder="Ingrese su apellido" required />
      <InputField label="Teléfono:" type="tel" name="telefono" placeholder="Ej: 3001234567" required />
      <InputField label="Correo electrónico:" type="email" name="correo" placeholder="ejemplo@correo.com" required />
      <InputField label="Contraseña:" type="password" name="password" placeholder="Ingrese su contraseña" required />
      <InputField label="Confirmar contraseña:" type="password" name="confirmar" placeholder="Repita su contraseña" required />

      <label className="checkbox">
        <input type="checkbox" name="politicas" required />
        <span>Acepto las políticas de privacidad</span>
      </label>

      <div className="buttons">
        <Button text="Registrarse" type="submit" />
        <Button text="Volver al inicio" type="button" />
      </div>
    </form>
  );
}

export default RegisterForm;

