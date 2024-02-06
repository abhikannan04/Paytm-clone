import Link from "react-router-dom";
export default function BottomWarning({ label, buttontext, to }) {
  return (
    <div>
      <div>{label}</div>
      <Link to={to}>{buttontext}</Link>
    </div>
  );
}
