export default function Checkbox({ name, label, required }) {
  return (
    <label>
      <input type="checkbox" name={name} required={required} /> {label}
    </label>
  );
}
