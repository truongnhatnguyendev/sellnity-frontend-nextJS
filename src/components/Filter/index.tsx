"use client";
import { Button, Col, Row, Select, Space } from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { InputUI } from "../UI/Input";
import { DeepPartial } from "@/utils/deepPartial";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

export interface ValueFilterType {
  productNameEn: string;
  categoryId: string;
  status: string;
  priceFrom: string;
  priceTo: string;
  color: string;
  size: string;
}

interface FilterProps {
  onFilterChange: (filters: DeepPartial<ValueFilterType>) => void;
  categories: { id: string; name: string }[];
  status: { id: string; name: string }[];
  loading?: boolean;
  variantAttributes: { color?: string[]; size?: string[] };
}

const FilterComponent: React.FC<FilterProps> = ({
  onFilterChange,
  categories,
  variantAttributes,
  loading,
  status,
}) => {
  const [filters, setFilters] = useState<DeepPartial<ValueFilterType>>({});
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createDebounce = useCallback(
    (func: (filters: DeepPartial<ValueFilterType>) => void, delay: number) => {
      return (filters: DeepPartial<ValueFilterType>) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          func(filters);
        }, delay);
      };
    },
    []
  );

  const debouncedFilterChange = useMemo(
    () => createDebounce(onFilterChange, 500),
    [createDebounce, onFilterChange]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (key: string, value: string) => {
    const updated = { ...filters, [key]: value };
    if (key === "productNameEn" || key === "priceFrom" || key === "priceTo") {
      debouncedFilterChange(updated);
    }
    setFilters(updated);
    onFilterChange(updated);
  };

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories]
  );

  const statusOptions = useMemo(
    () => status.map((s) => ({ label: s.name, value: s.id })),
    [status]
  );

  const colorOptions = useMemo(
    () =>
      variantAttributes.color?.map((color) => ({
        label: color,
        value: color,
      })) || [],
    [variantAttributes.color]
  );

  const sizeOptions = useMemo(
    () =>
      variantAttributes.size?.map((size) => ({ label: size, value: size })) ||
      [],
    [variantAttributes.size]
  );

  // Check if any filters are applied
  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(
        (value) => value && value.toString().trim() !== ""
      ),
    [filters]
  );

  // Clear all filters
  const handleClearAll = useCallback(() => {
    setFilters({});
    onFilterChange({
      productNameEn: "",
      categoryId: "",
      status: "",
      priceFrom: "",
      priceTo: "",
      color: "",
      size: "",
    });
  }, [onFilterChange]);

  return (
    <div className=" bg-white ">
      <Row gutter={[16, 16]}>
        {/* Product Name Search */}
        <Col xs={24} sm={12} md={6}>
          <InputUI
            placeholder="Search by product name..."
            value={filters.productNameEn}
            onChange={(e) => handleChange("productNameEn", e as string)}
            allowClear
            prefix={<SearchOutlined />}
          />
        </Col>

        {/* Category Filter */}
        <Col xs={24} sm={12} md={6}>
          <Select
            className="w-full"
            value={filters.categoryId}
            onChange={(value) => handleChange("categoryId", value)}
            placeholder="Select category"
            options={categoryOptions}
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Col>

        {/* Status Filter */}
        <Col xs={24} sm={12} md={6}>
          <Select
            className="w-full"
            value={filters.status}
            onChange={(value) => handleChange("status", value)}
            placeholder="Select status"
            options={statusOptions}
            allowClear
          />
        </Col>

        {/* Price Range */}
        <Col xs={24} sm={12} md={6}>
          <Space.Compact className="w-full">
            <InputUI
              className="w-1/2"
              placeholder="Price from"
              type="number"
              value={filters.priceFrom || ""}
              onChange={(e) => handleChange("priceFrom", e as string)}
              min={0}
            />
            <InputUI
              className="w-1/2"
              placeholder="Price to"
              type="number"
              value={filters.priceTo || ""}
              onChange={(e) => handleChange("priceTo", e as string)}
              min={0}
            />
          </Space.Compact>
        </Col>

        {/* Color Filter */}
        {colorOptions.length > 0 && (
          <Col xs={24} sm={12} md={6}>
            <Select
              className="w-full"
              value={filters.color}
              onChange={(value) => handleChange("color", value)}
              placeholder="Select color"
              options={colorOptions}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Col>
        )}

        {/* Size Filter */}
        {sizeOptions.length > 0 && (
          <Col xs={24} sm={12} md={6}>
            <Select
              className="w-full"
              value={filters.size}
              onChange={(value) => handleChange("size", value)}
              placeholder="Select size"
              options={sizeOptions}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Col>
        )}

        {/* Action Buttons */}
        <Col xs={24} md={6}>
          <Space className="w-full">
            {hasActiveFilters && (
              <Button danger onClick={handleClearAll} disabled={loading}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ClearOutlined />
                  Clear Filters
                </span>
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Active Filters:</div>

          {filters.productNameEn && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              Name: {filters.productNameEn}
            </span>
          )}

          {filters.categoryId && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
              Category:{" "}
              {categories.find((c) => c.id === filters.categoryId)?.name}
            </span>
          )}

          {filters.status && (
            <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
              Status: {status.find((s) => s.id === filters.status)?.name}
            </span>
          )}

          {(filters.priceFrom || filters.priceTo) && (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
              Price: {filters.priceFrom || "0"} - {filters.priceTo || "∞"}
            </span>
          )}

          {filters.color && (
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs">
              Color: {filters.color}
            </span>
          )}

          {filters.size && (
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs">
              Size: {filters.size}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
