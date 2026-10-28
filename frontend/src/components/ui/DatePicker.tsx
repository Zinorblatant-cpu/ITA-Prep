import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "./Input";

export const DatePicker = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => <Input ref={ref} type="date" {...props} />,
);
DatePicker.displayName = "DatePicker";
