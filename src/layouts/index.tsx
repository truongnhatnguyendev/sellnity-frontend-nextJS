"use client";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
import React, { useState, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Header, Content, Sider } = Layout;

const MemoizedMenu = memo(function MemoizedMenu({
  items,
  pathname,
}: {
  items: any[];
  pathname: string;
}) {
  return (
    <Menu
      style={{
        height: "calc(100vh - 100px)",
      }}
      theme="light"
      mode="inline"
      defaultSelectedKeys={[pathname.split("/")[1]]}
      items={items}
    />
  );
});

export function LayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const menuItems = [
    {
      key: "products",
      icon: <ShopOutlined />,
      label: (
        <Link href="/products" prefetch={false}>
          Products
        </Link>
      ),
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: (
        <Link href="/orders" prefetch={false}>
          Orders
        </Link>
      ),
    },
    {
      key: "shops",
      icon: <ShoppingOutlined />,
      label: (
        <Link href="/shops" prefetch={false}>
          Shops
        </Link>
      ),
    },
  ];

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
                transition: "all 0.2s ease",
              }}
              priority
            />
          </div>
          <MemoizedMenu items={menuItems} pathname={pathname} />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
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
