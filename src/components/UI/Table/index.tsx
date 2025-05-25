"use client";
import { RestBaseService } from "@/services/rest-base.service";
import { Table } from "antd";
import { TablePaginationConfig, TableProps } from "antd/es/table";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

export interface RestfulTableProp<T> extends TableProps<T> {
  service: RestBaseService<T>;
  filter?: Record<string, any>;
  onDbClickRow?: (record: T) => void;
  rowKey: string;
  limit?: number;
  scroll?: TableProps<T>["scroll"] & {
    scrollToFirstRowOnChange?: boolean;
  };
  showHeader?: boolean;
  title?: (data: readonly T[], total?: number) => React.ReactNode;
  outData?: (data: T[]) => void;
}
export interface RestfulTableRef {
  refresh: () => void;
}
const RestfulTable = forwardRef<RestfulTableRef, RestfulTableProp<any>>(
  (props, ref) => {
    const { service, outData, filter } = props;
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(props.limit ?? 10);

    const [pending, setPending] = useState<boolean>(false);

    const loadData = async () => {
      try {
        setPending(true);
        await service.getPagination(limit, currentPage, filter).then((data) => {
          setDataSource(data.data);
          setTotal(data.total);
          if (currentPage > data.pageCount) {
            setCurrentPage(1);
          }
        });
      } catch (error: any) {
        setPending(false);
        throw new Error(error);
      } finally {
        setPending(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: loadData,
    }));

    useEffect(() => {
      loadData();
    }, [limit, currentPage, filter]);

    useEffect(() => {
      outData?.(dataSource);
    }, [dataSource]);

    const onChange = (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[],
      extra: TableCurrentDataSource<any>
    ) => {
      setCurrentPage(pagination.current as number);
      setLimit(pagination.pageSize as number);
    };

    return (
      <Table
        loading={pending}
        rowKey={props.rowKey}
        columns={props.columns}
        dataSource={dataSource}
        pagination={{
          total,
          current: currentPage,
          pageSize: limit,
        }}
        onChange={onChange}
        scroll={props.scroll}
        title={() => props.title?.(dataSource, total)}
        showHeader={props.showHeader}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              props.onDbClickRow && props.onDbClickRow(record);
            },
          };
        }}
      />
    );
  }
);
export default RestfulTable;
