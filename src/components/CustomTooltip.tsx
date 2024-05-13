import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface CustTooltipProps {
  elm: any;
  content: any;
}

const CustomToolTip: FC<CustTooltipProps> = ({ elm, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{elm}</TooltipTrigger>
        <TooltipContent className="bg-primary text-white">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default CustomToolTip;
