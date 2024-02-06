export default function InputBox({ label, placeholder, onChange }) {
  return (
    <>
      <div>{label}</div>
      <input type="text" placeholder={placeholder} onChange={onChange} />
    </>
  );
}
