"use client";
import {
  Descriptions,
  Table,
  Tag,
  Steps,
  Card,
  Divider,
  Spin,
  Alert,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ShoppingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { OrderEntity } from "@/types/order";
import { orderService } from "@/services/orders/order.service";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const { Step } = Steps;

type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled"
  | "payment_pending"
  | "paid";

const statusSteps: Record<OrderStatus, number> = {
  pending: 0,
  payment_pending: 0,
  paid: 1,
  processing: 1,
  shipping: 2,
  completed: 3,
  cancelled: -1,
};

const OrderDetail = () => {
  const params = useParams();
  const [order, setOrder] = useState<OrderEntity>({} as OrderEntity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOne({ id: params.id as string });
        setOrder(data);
      } catch (err: any) {
        setError(err);
        message.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const itemsColumns = useMemo<ColumnsType<any>>(
    () => [
      {
        title: "Product",
        dataIndex: "product",
        key: "product",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price) => `${price.toLocaleString()}₫`,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Subtotal",
        key: "total",
        render: (_, record) =>
          `${(record.price * record.quantity).toLocaleString()}₫`,
      },
    ],
    []
  );

  const statusStepsComponent = useMemo(() => {
    const status = order?.status as OrderStatus;

    if (status === "cancelled") {
      return (
        <Steps current={0} status="error">
          <Step title="Cancelled" icon={<CloseCircleOutlined />} />
        </Steps>
      );
    }

    return (
      <Steps current={statusSteps[status] ?? 0}>
        <Step title="Pending Confirmation" icon={<ClockCircleOutlined />} />
        <Step title="Processing" icon={<ShoppingOutlined />} />
        <Step title="Shipping" icon={<CarOutlined />} />
        <Step title="Completed" icon={<CheckCircleOutlined />} />
      </Steps>
    );
  }, [order?.status]);

  if (loading) {
    return <Spin tip="Loading order details..." />;
  }

  if (error) {
    return <Alert message="Error loading order" type="error" />;
  }

  return (
    <div className="w-full space-y-4">
      <Card title="Order Status">{statusStepsComponent}</Card>

      <Divider orientation="left">Order Information</Divider>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Order ID">{order?.id}</Descriptions.Item>
        <Descriptions.Item label="Shop Name">{order?.shop}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {order.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag>{order?.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Products</Divider>
      <Table
        columns={itemsColumns}
        dataSource={order?.items}
        pagination={false}
        rowKey={(record) => record.id || `${record.product}-${record.price}`}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <div className="text-right font-bold">Total:</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <div className="font-bold">
                  {order.items
                    ?.reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toLocaleString()}
                  ₫
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Divider orientation="left">Shipping Information</Divider>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Carrier">
          {order.shipping?.carrier}
        </Descriptions.Item>
        <Descriptions.Item label="Tracking Number">
          {order.shipping?.trackingNumber}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color="blue">
            {order.shipping?.status === "shipping" ? "In Transit" : "Delivered"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Estimated Delivery">
          {order.shipping?.estimatedDelivery}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Customer Information</Divider>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Full Name">
          {order.customerInfo?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {order.customerInfo?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {order.customerInfo?.address}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default OrderDetail;
