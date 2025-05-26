"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Card,
  Tag,
  Avatar,
  Progress,
  Button,
  Space,
  Modal,
  message,
  Select,
  Form,
} from "antd";
import {
  ShopOutlined,
  LinkOutlined,
  DisconnectOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import RestfulTable, { RestfulTableRef } from "@/components/UI/Table";
import { ShopEntity } from "@/types/shop";
import { shopService } from "@/services/shops/shop.service";

const ShopManagement = () => {
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<RestfulTableRef>(null);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  const refreshDataTable = useCallback(() => {
    tableRef?.current?.refresh();
  }, []);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      await refreshDataTable();
    } catch (error) {
      message.error("Failed to fetch shops");
    } finally {
      setLoading(false);
    }
  }, [refreshDataTable]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  const handleConnectShop = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConnectLoading(true);
      // await shopService.connect(values);
      message.success("Shop connected successfully");
      setIsModalOpen(false);
      refreshDataTable();
    } catch (error) {
      message.error("Failed to connect shop");
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async (shopId: number) => {
    try {
      // await shopService.disconnect(shopId);
      message.success("Shop disconnected successfully");
      refreshDataTable();
    } catch (error) {
      message.error("Failed to disconnect shop");
    }
  };

  const handleSyncProducts = async (shopId: number) => {
    try {
      // await shopService.syncProducts(shopId);
      message.success("Products sync initiated");
      refreshDataTable();
    } catch (error) {
      message.error("Failed to sync products");
    }
  };

  const columns = useMemo<ColumnsType<ShopEntity>>(
    () => [
      {
        title: "Shop",
        fixed: "left",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <div className="flex items-center gap-5">
            <Avatar src={record.logo} icon={<ShopOutlined />} />
            <div>
              <div className="font-medium">{text}</div>
              <div className="text-gray-500 text-xs">{record.platform}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Orders",
        dataIndex: "orders",
        key: "orders",
        render: (orders) => (
          <div className="font-semibold">{orders?.toLocaleString()}</div>
        ),
      },
      {
        title: "Products",
        dataIndex: "products",
        key: "products",
        render: (products) => (
          <div>
            <div className="font-semibold">
              {products?.synced.toLocaleString()}
            </div>
            <Progress
              percent={Math.min(100, (products.synced / products.total) * 100)}
              size="small"
              showInfo={false}
            />
            <div className="text-gray-500 text-xs">
              {products?.synced.toLocaleString()} of{" "}
              {products?.total.toLocaleString()} synced
            </div>
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          let color = "";
          let icon = null;

          switch (status) {
            case "CONNECTED":
              color = "green";
              icon = <LinkOutlined />;
              break;
            case "DISCONNECTED":
              color = "red";
              icon = <DisconnectOutlined />;
              break;
            case "PENDING":
              color = "orange";
              icon = <SyncOutlined spin />;
              break;
            default:
              color = "gray";
          }

          return (
            <Tag icon={icon} color={color}>
              {status}
            </Tag>
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="middle">
            <Button
              size="small"
              onClick={() => handleSyncProducts(record.id)}
              loading={loading}
            >
              <span className="flex items-center gap-6">
                <SyncOutlined />
                Sync
              </span>
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleDisconnect(record.id)}
              loading={loading}
            >
              <span className="flex items-center gap-6">
                <DisconnectOutlined />
                Disconnect
              </span>
            </Button>
          </Space>
        ),
      },
    ],
    [loading]
  );

  return (
    <div className="w-full">
      <Card
        title="Shop management"
        extra={
          <Space>
            <Button
              type="primary"
              onClick={handleConnectShop}
              loading={loading}
            >
              Connect New Shop
            </Button>
          </Space>
        }
      >
        <RestfulTable
          rowKey="id"
          scroll={{ x: "max-content" }}
          service={shopService}
          ref={tableRef}
          columns={columns}
          loading={loading}
          limit={5}
        />
      </Card>

      <Modal
        title="Connect New Shop"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={connectLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="platform"
            label="Platform"
            rules={[{ required: true, message: "Please select platform" }]}
          >
            <Select placeholder="Select platform">
              <Select.Option value="SHOPEE">Shopee</Select.Option>
              <Select.Option value="LAZADA">Lazada</Select.Option>
              <Select.Option value="SHOPIFY">Shopify</Select.Option>
              <Select.Option value="WEBSITE">Website cá nhân</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShopManagement;
