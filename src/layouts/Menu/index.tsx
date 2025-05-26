"use client";
import { Menu } from "antd";
import { memo } from "react";

const MemoizedMenu = memo(function MemoizedMenu({
  items,
  selectedKey,
}: {
  items: any[];
  selectedKey: string;
}) {
  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={items}
    />
  );
});

export default MemoizedMenu;
