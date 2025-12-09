import { useEffect, useState } from "react";
import "./Logo.css";

export default function Logo({ className = "" }) {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadLogo() {
      try {
        const res = await fetch("/api/getLogo");
        const data = await res.json();

        if (data?.logo?.Cover?.url) {
          setLogoUrl(data.logo.Cover.url);
        }
      } catch (err) {
        console.error("Logo.jsx ERROR loading logo:", err);
      }
    }

    loadLogo();
  }, []);

  return (
    <div className={`logo-wrapper ${className}`}>
      <a href="/" className="logo-link">
        {/* Keep layout stable with placeholder box */}
        {!logoUrl && <div className="logo-placeholder" />}

        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className={`logo-img ${loaded ? "logo-fade-in" : "logo-invisible"}`}
            onLoad={() => setLoaded(true)}
          />
        )}
      </a>
    </div>
  );
}
