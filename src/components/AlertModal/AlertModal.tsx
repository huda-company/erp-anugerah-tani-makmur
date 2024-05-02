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

const AlertModal: FC<AlertModalProps> = ({ open, title, content, onClose }) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="border-[0.5rem] border-primary bg-white sm:max-w-md">
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
