"use client";
import RestfulTable, { RestfulTableRef } from "@/components/UI/Table";
import { productService } from "@/services/products/product.service";
import { ProductsEntity } from "@/types/product";
import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import FilterComponent, { ValueFilterType } from "@/components/Filter";
import { formatDate } from "@/utils/formatDate";
import StatsCard from "@/components/StatsCard";
import { DeepPartial } from "@/utils/deepPartial";
import truncateHTML from "@/utils/truncateHTML";

const DEFAULT_LIMIT = 5;
const IMAGE_SIZE = 100;
const DESCRIPTION_PREVIEW_LENGTH = 100;

const MOCK_STATS = {
  connectedShops: 5,
  recentOrders: 24,
};

const MOCK_CATEGORIES = [
  { id: "26F7660F-A00A-468A-BA29-E61A465C0D0B", name: "Health" },
  { id: "D2432903-0D4E-4787-886F-D3D9DA7890D9", name: "Women's Clothing" },
];
const MOCK_STATUS = [
  { id: "D244", name: "Active" },
  { id: "D243", name: "Out of Stock" },
];

const MOCK_VARIANT_ATTRIBUTES = {
  color: ["Black", "White", "Red"],
  size: ["S", "M", "L"],
};

const createColumns = (): ColumnsType<ProductsEntity> => [
  {
    title: "Image",
    dataIndex: ["productImages", "imageUrl"],
    key: "productImages",
    width: 120,
    render: (_, { productImages }) => {
      if (!productImages?.length)
        return <div className="w-[100px] h-[100px] bg-gray-200" />;

      const firstImage = productImages[0];
      return (
        <Image
          key={firstImage.imageSortOrder}
          src={firstImage.imageUrl}
          alt="Product image"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className="object-cover rounded"
          loading="lazy"
        />
      );
    },
  },
  {
    title: "Product Name",
    dataIndex: "productNameEn",
    key: "productNameEn",
    width: 200,
    ellipsis: true,
  },
  {
    title: "SKU",
    dataIndex: "productsku",
    key: "productsku",
    width: 150,
    ellipsis: true,
  },
  {
    title: "Description",
    dataIndex: "productDescription",
    key: "productDescription",
    width: 300,
    render: (value: string) => (
      <div
        className="max-w-xs"
        dangerouslySetInnerHTML={{
          __html: truncateHTML(value, DESCRIPTION_PREVIEW_LENGTH),
        }}
      />
    ),
  },
  {
    title: "Price",
    dataIndex: "variants",
    key: "price",
    width: 150,
    render: (_, { variants }) => {
      if (!variants?.length)
        return <span className="text-gray-400">No variants</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {variants.map((variant, index) => {
            const price = variant.price?.sellPrice;
            if (!price) return null;

            return (
              <Tag color="geekblue" key={`${price}-${index}`} className="mb-1">
                ${price}
              </Tag>
            );
          })}
        </div>
      );
    },
  },
  {
    title: "Weight",
    dataIndex: "productWeight",
    key: "productWeight",
    width: 100,
    render: (weight: number) => (weight ? `${weight}kg` : "-"),
  },
  {
    title: "Type",
    dataIndex: "productType",
    key: "productType",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Created",
    dataIndex: "productCreateTime",
    key: "productCreateTime",
    width: 150,
    render: (_, { productCreateTime }) => {
      if (!productCreateTime?.$date) return "-";
      return formatDate(productCreateTime.$date);
    },
  },
  {
    title: "Category",
    dataIndex: "categoryName",
    key: "categoryName",
    width: 150,
    ellipsis: true,
  },
];

export default function Products() {
  const tableRef = useRef<RestfulTableRef>(null);
  const [valueFilter, setValueFilter] = useState<Partial<ProductsEntity>>();

  const columns = useMemo(() => createColumns(), []);

  // const updateFilter = useCallback(
  //   (newFilter: DeepPartial<ValueFilterType>) => {
  //     setValueFilter((prev) => ({ ...prev, ...newFilter }));
  //   },
  //   []
  // );

  const handleFilterChange = useCallback(
    (filters: DeepPartial<ValueFilterType>) => {
      setValueFilter((prev) => ({ ...prev, ...filters }));
    },
    []
  );

  const renderTableTitle = useCallback(
    (_: readonly ProductsEntity[], total?: number) => {
      return (
        <div className="flex flex-col gap-4 justify-end">
          <div className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="Total Products" value={total as number} />
              <StatsCard
                title="Connected Shops"
                value={MOCK_STATS.connectedShops}
              />
              <StatsCard
                title="Recent Orders"
                value={MOCK_STATS.recentOrders}
              />
            </div>
          </div>

          <FilterComponent
            onFilterChange={handleFilterChange}
            categories={MOCK_CATEGORIES}
            status={MOCK_STATUS}
            variantAttributes={MOCK_VARIANT_ATTRIBUTES}
          />
        </div>
      );
    },
    [handleFilterChange]
  );

  return (
    <div className="w-full">
      <RestfulTable
        rowKey="productId"
        service={productService}
        ref={tableRef}
        columns={columns}
        filter={valueFilter}
        limit={DEFAULT_LIMIT}
        title={renderTableTitle}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}
