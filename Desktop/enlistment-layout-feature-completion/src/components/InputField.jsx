function InputField({ label, type, name, value, onChange, placeholder, required }) {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}          // ✅ enlaza con formData
        onChange={onChange}    // ✅ actualiza al escribir
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default InputField;
