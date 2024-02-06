export default function Button({label , onClick}) {
  return <button onClick={onClick} type="button">
    {label}
  </button>
};
