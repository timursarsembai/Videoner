import { Language } from "@/lib/i18n/translations";

export const LEGAL_SLUGS = ["privacy", "terms", "cookies", "copyright"] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalSection = {
  heading: string;
  /** Абзацы. Внутри допустим только текст — разметку в документы не тащим. */
  body?: string[];
  /** Маркированный список — им удобны перечни данных, сроков и оснований. */
  bullets?: string[];
};

export type LegalDoc = {
  /** Заголовок страницы и <title> одновременно. */
  title: string;
  /** Короткое описание для meta description и подзаголовка. */
  summary: string;
  sections: LegalSection[];
};

/** Подписи интерфейса вокруг документа — на тех же трёх языках. */
export type LegalUi = {
  updated: string;
  back: string;
  operatorHeading: string;
  navHeading: string;
  labels: Record<LegalSlug, string>;
};

export type LegalContent = {
  ui: LegalUi;
  docs: Record<LegalSlug, LegalDoc>;
};

export type LegalByLanguage = Record<Language, LegalContent>;
