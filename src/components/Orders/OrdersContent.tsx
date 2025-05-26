"use client";
import { Card, Tag, Button, Space, Dropdown } from "antd";
import {
  EyeOutlined,
  PrinterOutlined,
  DownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useCallback, useState } from "react";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";
import { OrderEntity } from "@/types/order";
import RestfulTable from "@/components/UI/Table";
import { orderService } from "@/services/orders/order.service";
import FilterComponent, { ValueFilterType } from "@/components/Filter";
import { DeepPartial } from "@/utils/deepPartial";

const MOCK_CATEGORIES = [
  { id: "26F7660F-A00A-468A-BA29-E61A465C0D0B", name: "Health" },
  { id: "D2432903-0D4E-4787-886F-D3D9DA7890D9", name: "Women's Clothing" },
];
const MOCK_STATUS = [
  { id: "pending", name: "Pending" },
  { id: "processing", name: "Processing" },
  { id: "shipping", name: "Shipping" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
  { id: "payment_pending", name: "Payment Pending" },
  { id: "paid", name: "Paid" },
];
const MOCK_VARIANT_ATTRIBUTES = {
  color: ["Black", "White", "Red"],
  size: ["S", "M", "L"],
};

type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled"
  | "payment_pending"
  | "paid";

const OrdersManagement = () => {
  const [filterParams, setFilterParams] = useState<
    DeepPartial<ValueFilterType>
  >({});

  const statusColors: Record<OrderStatus, string> = {
    pending: "gray",
    processing: "blue",
    shipping: "orange",
    completed: "green",
    cancelled: "red",
    payment_pending: "purple",
    paid: "cyan",
  };

  const statusLabels: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    shipping: "Shipping",
    completed: "Completed",
    cancelled: "Cancelled",
    payment_pending: "Payment Pending",
    paid: "Paid",
  };

  const columns: ColumnsType<OrderEntity> = [
    {
      title: "Order ID",
      dataIndex: "id",
      fixed: "left",
      key: "id",
      render: (id) => <Link href={`/orders/${id}`}>{id}</Link>,
    },
    {
      title: "Shop Name",
      dataIndex: "shop",
      key: "shop",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total?.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = status as OrderStatus;
        return <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/orders/${record.id}`}>
            <EyeOutlined size={100} />
          </Link>
          <Dropdown
            menu={{
              items: [
                {
                  key: "print",
                  label: "Print Order",
                  icon: <PrinterOutlined />,
                },
                {
                  key: "export",
                  label: "Export PDF",
                  icon: <DownloadOutlined />,
                },
              ],
            }}
          >
            <Button>
              <MoreOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleFilterChange = useCallback(
    (filters: DeepPartial<ValueFilterType>) => {
      setFilterParams((prev) => ({ ...prev, ...filters }));
    },
    []
  );

  const renderTableTitle = useCallback(() => {
    return (
      <div className="flex flex-col gap-4 justify-end">
        <FilterComponent
          onFilterChange={handleFilterChange}
          categories={MOCK_CATEGORIES}
          status={MOCK_STATUS}
          variantAttributes={MOCK_VARIANT_ATTRIBUTES}
        />
      </div>
    );
  }, [handleFilterChange]);

  return (
    <div className="w-full">
      <Card
        title="Order Management"
        extra={
          <Space>
            <Button type="primary">Create New Order</Button>
          </Space>
        }
      >
        <RestfulTable
          service={orderService}
          filter={filterParams}
          scroll={{ x: 1500 }}
          columns={columns}
          rowKey="id"
          limit={5}
          title={renderTableTitle}
        />
      </Card>
    </div>
  );
};

export default OrdersManagement;
