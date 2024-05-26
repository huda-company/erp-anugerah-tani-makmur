import { FC } from "react";
import React from "react";

import { AlertModalProps } from "./types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { capitalizeStr } from "^/utils/capitalizeStr";
import clsxm from "^/utils/clsxm";

const AlertModal: FC<AlertModalProps> = ({
  open,
  title,
  content,
  className,
  onClose,
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          className={clsxm(
            "min-w-fit border-[0.5rem] border-primary bg-white sm:max-w-md",
            className
          )}
        >
          <DialogHeader>
            <DialogTitle>
              <u>{capitalizeStr(title)}</u>
            </DialogTitle>
            <DialogDescription>{content}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start"></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlertModal;
