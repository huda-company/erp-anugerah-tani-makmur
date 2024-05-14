import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CustTooltipProps {
  children: any;
  content: any;
}

const CustomToolTip: FC<CustTooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="bg-primary text-white">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default CustomToolTip;
