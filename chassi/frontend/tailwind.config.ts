import type { Config } from "tailwindcss";
import baseConfig from "@sgo/ui/tailwind.config";

/**
 * Tailwind do chassi — estende o Design System e inclui content do frontend e do @sgo/ui.
 * Sem isso o CSS com @tailwind/@apply não é gerado e a tela carrega sem estilos.
 */
const config: Config = {
  ...baseConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
