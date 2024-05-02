import { useState } from "react";
import React, { forwardRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { cn } from "@/lib/utils";

import { InputProps } from "../ui/input";

interface InputPwdProps extends InputProps {}

const InputPwd = forwardRef<HTMLInputElement, InputPwdProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const iconStyle = "mr-2 h-8 w-8";

    return (
      <div style={{ display: "flex" }}>
        <input
          type={showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            className
          )}
          ref={ref}
          {...props}
        />
        <div
          onClick={togglePasswordVisibility}
          className="flex cursor-pointer items-center justify-center pl-2"
        >
          {showPassword ? (
            <FaRegEye className={iconStyle} />
          ) : (
            <FaRegEyeSlash className={iconStyle} />
          )}
        </div>
      </div>
    );
  }
);

InputPwd.displayName = "InputPwd";

export default InputPwd;
