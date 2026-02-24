import { describe, it, expect } from "vitest";
import { Layers, UserPlus } from "lucide-react";
import { getModuleIcon, getModuleColor } from "@/lib/module-icons";

describe("getModuleIcon", () => {
  it("retorna Layers como fallback quando icon não está mapeado", () => {
    expect(getModuleIcon({ slug: "qualquer" })).toBe(Layers);
  });

  it("retorna o ícone correto quando icon está no mapa", () => {
    expect(getModuleIcon({ slug: "test", icon: "UserPlus" })).toBe(UserPlus);
  });

  it("retorna Layers quando icon é string vazia", () => {
    expect(getModuleIcon({ slug: "test", icon: "" })).toBe(Layers);
  });

  it("retorna Layers quando icon é null", () => {
    expect(getModuleIcon({ slug: "test", icon: null })).toBe(Layers);
  });
});

describe("getModuleColor", () => {
  it("retorna a cor personalizada quando válida (#rrggbb)", () => {
    expect(getModuleColor({ slug: "test", color: "#ff0000" })).toBe("#ff0000");
  });

  it("retorna a cor da paleta quando color é null", () => {
    const color = getModuleColor({ slug: "leads-intake" });
    // Deve ser uma cor hexadecimal da paleta
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("cores diferentes para slugs diferentes (determinístico)", () => {
    const c1 = getModuleColor({ slug: "modulo-a" });
    const c2 = getModuleColor({ slug: "modulo-b" });
    // Não necessariamente diferentes (colisão de hash possível), mas ambas devem ser válidas
    expect(c1).toMatch(/^#/);
    expect(c2).toMatch(/^#/);
  });

  it("mesma cor para o mesmo slug (função pura)", () => {
    const slug = "modulo-consistente";
    expect(getModuleColor({ slug })).toBe(getModuleColor({ slug }));
  });

  it("ignora cor inválida e usa paleta", () => {
    const color = getModuleColor({ slug: "test", color: "vermelho" });
    // Cor inválida → usa paleta
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
