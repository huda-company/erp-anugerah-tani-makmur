export type BreadcrumbItem = {
  name: string;
  key: string;
  url: string;
  isActive: boolean;
};
export type CustomBreadcrumbProps = {
  items: BreadcrumbItem[] | undefined;
  separator: string;
};
