/**
 * Header — Navegação fixa com logo SVG e links
 */

import { Link, useLocation } from "react-router-dom";
import { siteData } from "@/content/siteData";

export function Header() {
  const location = useLocation();

  return (
    <header className="lp-sgo-header">
      <div className="lp-sgo-header-inner">
        <Link to="/" className="lp-sgo-logo">
          {/* Logo SVG — versão escura para o tema dark da LP */}
          <img
            src="/logo-light.svg"
            alt={siteData.siteName}
            className="lp-sgo-logo-img"
            onError={(e) => {
              // Fallback para texto se logo não carregar
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
            }}
          />
          <span className="lp-sgo-logo-fallback" style={{ display: 'none' }}>
            {siteData.siteName}<span className="lp-sgo-logo-dot">.</span>
          </span>
        </Link>

        <nav className="lp-sgo-nav">
          {siteData.nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`lp-sgo-nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <a href={siteData.portalUrl} target="_blank" rel="noopener noreferrer" className="lp-sgo-nav-cta">
            Acessar Portal
          </a>
        </nav>
      </div>
    </header>
  );
}
