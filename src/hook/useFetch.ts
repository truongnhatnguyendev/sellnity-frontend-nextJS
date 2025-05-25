"use client";
import { RestBaseService } from "@/services/rest-base.service";
import { useEffect, useState } from "react";

export function useFetch<T>(service: RestBaseService<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await service.getMany();

        setData(resp as T[]);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}
