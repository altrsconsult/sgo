import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

/**
 * Configuração do Storybook para @sgo/ui.
 * Framework: Vite + React para máxima compatibilidade com o stack do projeto.
 */
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal(config) {
    // Resolve aliases do monorepo para que stories possam importar @sgo/ui
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@sgo/ui": path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default config;
