import type { Preview } from "@storybook/react";
import "../src/globals.css";

/**
 * Preview global do Storybook: importa estilos Tailwind e configura backgrounds.
 */
const preview: Preview = {
  parameters: {
    // Backgrounds para testar dark/light mode
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#09090b" },
      ],
    },
    // Acessibilidade habilitada em todos os stories
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default preview;
