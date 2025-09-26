export default function InputField({ label, type, id, name, placeholder, required }) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </>
  );
}
