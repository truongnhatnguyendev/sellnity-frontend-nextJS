"use client";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
import React, { useState, useCallback, memo, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShopOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  ShoppingOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import MemoizedMenu from "./Menu";
const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: "products",
    icon: <ShopOutlined />,
    label: <Link href="/products">Products</Link>,
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/orders">Orders</Link>,
  },
  {
    key: "shops",
    icon: <ShoppingOutlined />,
    label: <Link href="/shops">Shops</Link>,
  },
];

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const selectedKey = useMemo(() => pathname.split("/")[1], [pathname]);

  return (
    <ConfigProvider>
      <Layout className="h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={100}
              height={100}
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <MemoizedMenu items={menuItems} selectedKey={selectedKey} />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              display: "flex",
              overflow: "auto",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
