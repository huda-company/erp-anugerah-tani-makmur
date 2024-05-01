type TailwindFontFamily = "font-primary" | "font-secondary" | "font-tertiary";
type TailwindTextAlign = "text-left" | "text-right" | "text-center";
type TailwindTextSizes =
  | "text-[0.563rem]"
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-[1.625rem]";

type TypographyFieldsType = {
  variant?: keyof JSX.IntrinsicElements;
  size?: TailwindTextSizes;
  textAlign?: TailwindTextAlign;
  fontFamily?: TailwindFontFamily;
  lineHeight?: string;
  color?: string;
  className?: string;
};

type Preset =
  | "custom"
  | "heading"
  | "heading2"
  | "heading3"
  | "subheading"
  | "subheading2"
  | "paragraph"
  | "regular";

type TypographyProps = {
  preset?: Preset;
} & TypographyFieldsType;

type TypographyPreset = {
  key: string;
  props: TypographyFieldsType;
};

type TypographyPresets = TypographyPreset[];

export type {
  TailwindFontFamily,
  TailwindTextAlign,
  TailwindTextSizes,
  TypographyFieldsType,
  TypographyPreset,
  TypographyPresets,
  TypographyProps,
};
