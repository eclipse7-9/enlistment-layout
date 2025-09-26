import FormTitle from "./FormTitle";
import InputField from "./InputField";
import Button from "./button";

function LoginForm() {
  return (
    <form>
      <FormTitle text="Iniciar Sesión - PET HEALTH-SERVICE´S" />

      <InputField label="Correo electrónico:" type="email" name="correo" placeholder="ejemplo@correo.com" required />
      <InputField label="Contraseña:" type="password" name="password" placeholder="Ingrese su contraseña" required />

      <Button text="Ingresar" type="submit" />
      <Button text="Volver al inicio" />
    </form>
  );
}

export default LoginForm;
