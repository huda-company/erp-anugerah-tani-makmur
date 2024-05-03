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
import { Slash } from "lucide-react";

const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ items, separator }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items &&
          items.map((item) => {
            return (
              <BreadcrumbItem key={item.key}>
                {item.isActive == false && (
                  <BreadcrumbLink href={item.url}>
                    {capitalizeStr(item.name)}
                  </BreadcrumbLink>
                )}
                {item.isActive == true && (
                  <BreadcrumbPage>{capitalizeStr(item.name)}</BreadcrumbPage>
                )}

                {item.isActive == false && (
                  <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                )}
              </BreadcrumbItem>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
