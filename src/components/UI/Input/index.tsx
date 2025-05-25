import { Input, InputProps } from "antd";
import "antd/dist/reset.css";
import { ChangeEvent, useEffect, useState } from "react";

export type InputUIType = "text" | "number" | "password";
export interface InputUIProps<T extends string | number>
  extends Omit<InputProps, "onChange" | "value"> {
  onChange?: (value: string) => void;
  onEmit?: (value: string) => void;
  placeholder?: string;
  value?: T | null;
  type?: InputUIType;
}
export function InputUI<T extends string | number>(props: InputUIProps<T>) {
  const [value, setValue] = useState<T | null>();
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as T);
    props.onChange?.(e.target.value);
  };

  return (
    <Input
      {...props}
      value={value ? value : undefined}
      placeholder={props.placeholder}
      onChange={handleChange}
      allowClear={props.allowClear}
    />
  );
}
