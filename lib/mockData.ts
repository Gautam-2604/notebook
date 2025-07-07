

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type Order = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  in_stock: boolean;
};

type Category = {
  id: number;
  name: string;
};

type Review = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
};

export type MockData = {
  users: User[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  reviews: Review[];
};

export const mockData: MockData = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com", created_at: "2023-01-10T12:00:00Z" },
    { id: 2, name: "Bob", email: "bob@example.com", created_at: "2023-02-15T09:30:00Z" },
  ],
  orders: [
    { id: 101, user_id: 1, total: 199.99, status: "shipped", created_at: "2023-03-01T14:45:00Z" },
    { id: 102, user_id: 2, total: 89.5, status: "processing", created_at: "2023-03-02T16:10:00Z" },
  ],
  products: [
    { id: 1, name: "Laptop", price: 1200.0, in_stock: true },
    { id: 2, name: "Mouse", price: 25.5, in_stock: false },
  ],
  categories: [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Accessories" },
  ],
  reviews: [
    { id: 1, product_id: 1, user_id: 1, rating: 5, comment: "Excellent product!" },
    { id: 2, product_id: 2, user_id: 2, rating: 3, comment: "Good, but not great." },
  ],
};
