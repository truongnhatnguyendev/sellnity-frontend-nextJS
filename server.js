import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  const endpoints = ["/products", "/shops", "/orders"];
  const pathParts = req.path.split("/").filter(Boolean);
  const resourceName = pathParts[0];
  const baseEndpoint = "/" + resourceName;

  const isListRequest =
    pathParts.length === 1 &&
    endpoints.includes(baseEndpoint) &&
    req.method === "GET";

  const isDetailRequest =
    pathParts.length === 2 &&
    endpoints.includes(baseEndpoint) &&
    req.method === "GET";

  // Handle LIST: /orders?page=1&limit=10&status=processing&logic=AND
  if (isListRequest) {
    const query = req.query;
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const logic = (query.logic || "AND").toString().toUpperCase(); // AND / OR

    //  Loại bỏ các filter rỗng / null / không hợp lệ
    const filters = Object.fromEntries(
      Object.entries(query).filter(([key, value]) => {
        const str = String(value).trim().toLowerCase();
        return (
          !["page", "limit", "logic"].includes(key) &&
          value !== undefined &&
          value !== null &&
          str !== "" &&
          str !== "undefined" &&
          str !== "null"
        );
      })
    );

    let items = router.db.get(resourceName).value();

    // ✅ Áp dụng filter động
    items = items.filter((item) => {
      const conditions = Object.entries(filters).map(([key, value]) => {
        const val = value.toString().toLowerCase();

        // Xử lý range: priceFrom / priceTo
        if (key.endsWith("From")) {
          const realKey = key.replace("From", "");
          return parseFloat(item[realKey]) >= parseFloat(val);
        }

        if (key.endsWith("To")) {
          const realKey = key.replace("To", "");
          return parseFloat(item[realKey]) <= parseFloat(val);
        }

        const itemVal = item[key];

        if (itemVal == null) return false;

        if (typeof itemVal === "string") {
          return itemVal.toLowerCase().includes(val);
        }

        if (typeof itemVal === "number") {
          return itemVal === parseFloat(val);
        }

        return false;
      });

      return logic === "AND"
        ? conditions.every(Boolean)
        : conditions.some(Boolean);
    });

    // ✅ Phân trang
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);
    const pageCount = Math.ceil(items.length / limit);

    return res.jsonp({
      data: paginatedItems,
      page,
      count: paginatedItems.length,
      pageCount,
      total: items.length,
    });
  }

  // Handle DETAIL: /orders/:id
  if (isDetailRequest) {
    const id = pathParts[1];
    const item = router.db.get(resourceName).find({ id }).value();

    if (!item) return res.status(404).jsonp({ error: "Not found" });
    return res.jsonp(item);
  }

  next();
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server is running at http://localhost:3001");
});
