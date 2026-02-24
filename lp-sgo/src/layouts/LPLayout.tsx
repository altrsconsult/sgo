/**
 * Layout principal da LP SGO
 * Header fixo + conteúdo + Footer + decorações globais
 */

import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function LPLayout() {
  return (
    <div className="lp-theme-altrs lp-sgo-layout">
      {/* Noise overlay global */}
      <div className="sgo-noise-overlay" />

      {/* Decorative blurs */}
      <div className="sgo-decor-blur sgo-decor-blur--primary" />
      <div className="sgo-decor-blur sgo-decor-blur--secondary" />

      {/* Header fixo */}
      <Header />

      {/* Conteúdo das páginas */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
