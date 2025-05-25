interface IPagination<T> {
  data: T[];
  page: number;
  count: number;
  pageCount: number;
  total: number;
}
export class RestBaseService<T> {
  constructor(public apiUrl: string, public entity: string) {
    this.apiUrl = apiUrl;
    this.entity = entity;
  }

  getBaseUrl() {
    return `${this.apiUrl}/${this.entity}`;
  }
  getMany(): Promise<T[]> {
    return this.fetch(this.getBaseUrl(), {
      method: "GET",
    });
  }
  getOne(params: { id: string }): Promise<T> {
    return this.fetch(`${this.getBaseUrl()}/${params.id}`, {
      method: "GET",
    });
  }
  getPagination(
    limit: number,
    page: number,
    filter?: Record<string, any>
  ): Promise<IPagination<T>> {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      ...filter,
    });

    const url = `${this.getBaseUrl()}?${queryParams.toString()}`;

    return this.fetch(url, {
      method: "GET",
    });
  }

  async fetch<R = any>(url: string, options?: any) {
    try {
      const response = await fetch(url, {
        ...options,
      });
      const json = await response.json();
      return json as R;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
