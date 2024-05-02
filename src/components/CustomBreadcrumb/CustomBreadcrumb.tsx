import { FC } from "react";
import { CustomBreadcrumbProps } from "./types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { capitalizeStr } from "^/utils/capitalizeStr";

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ items, separator }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items &&
          items.map((item) => {
            return (
              <BreadcrumbItem key={item.key}>
                {!item.isActive && (
                  <BreadcrumbLink href={item.url}>
                    {capitalizeStr(item.name)}
                  </BreadcrumbLink>
                )}
                {item.isActive && (
                  <BreadcrumbPage>{capitalizeStr(item.name)}</BreadcrumbPage>
                )}

                {!item.isActive && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
