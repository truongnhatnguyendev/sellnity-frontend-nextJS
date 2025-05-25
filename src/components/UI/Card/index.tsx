import { Card } from "antd";
import React from "react";

interface Props {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function CardUI({ title, children, className }: Props) {
  return (
    <Card title={title} className={className}>
      {children}
    </Card>
  );
}
