import React, { FC, PropsWithChildren } from "react";

import { typographyPresets } from "./config";
import type { TypographyFieldsType, TypographyProps } from "./types";

const Typography: FC<PropsWithChildren<TypographyProps>> = (props) => {
  const {
    preset = "custom",
    variant = "p",
    color = "text-nero",
    textAlign = "text-left",
    fontFamily = "font-primary",
    lineHeight = "leading-[0.957rem]",
    className,
    size,
    children,
  } = props;

  const fields: TypographyFieldsType | undefined =
    preset === "custom"
      ? { size, lineHeight, variant, color, textAlign, fontFamily, className }
      : typographyPresets.find(({ key }) => key === preset)?.props;

  const Element = fields?.variant as keyof JSX.IntrinsicElements;

  return (
    <Element
      className={`${fields?.size} ${fields?.lineHeight} ${fields?.color} ${fields?.textAlign} ${fields?.fontFamily} ${fields?.className} ${className}`}
    >
      {children}
    </Element>
  );
};

export default Typography;
