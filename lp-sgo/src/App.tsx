/**
 * LP SGO — sgo.altrs.net
 * Rotas: home, devs, documentação, privacidade, termos.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { LPLayout } from "@/layouts/LPLayout";
import { HomePage } from "@/pages/HomePage";
import { DevsPage } from "@/pages/DevsPage";
import { DocsPage } from "@/pages/DocsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";

export function App() {
  return (
    <Routes>
      <Route element={<LPLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/devs" element={<DevsPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
        <Route path="/termos" element={<TermsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
