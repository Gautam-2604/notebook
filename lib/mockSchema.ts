
export type Column = {
  name: string;
  type: string;
};

export type TableSchema = {
  name: string;
  columns: Column[];
};

export const mockSchema: TableSchema[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "email", type: "VARCHAR" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INT" },
      { name: "user_id", type: "INT" },
      { name: "total", type: "DECIMAL" },
      { name: "status", type: "VARCHAR" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR" },
      { name: "price", type: "DECIMAL" },
      { name: "in_stock", type: "BOOLEAN" },
    ],
  },
  {
    name: "categories",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR" },
    ],
  },
  {
    name: "reviews",
    columns: [
      { name: "id", type: "INT" },
      { name: "product_id", type: "INT" },
      { name: "user_id", type: "INT" },
      { name: "rating", type: "INT" },
      { name: "comment", type: "TEXT" },
    ],
  },
];
