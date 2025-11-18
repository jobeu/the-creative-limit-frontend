import "./Logo.css";
import logo from "../assets/logo.png";

export default function Logo() {
  return (
    <div className="logo-wrapper">
      <a href="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo-img" />
      </a>
    </div>
  );
}
