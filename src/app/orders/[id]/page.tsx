"use client";
import OrdersPageSkeleton from "@/components/Skeleton/SkeletonTable";
import dynamic from "next/dynamic";
const OrderDetail = dynamic(
  () => import("@/components/Orders/OrderDetailContent"),
  {
    loading: () => <OrdersPageSkeleton />,
  }
);

export default function ProductsPage() {
  return <OrderDetail />;
}
