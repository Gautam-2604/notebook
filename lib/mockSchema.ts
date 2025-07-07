export const mockSchema = {
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'integer', primaryKey: true },
        { name: 'name', type: 'varchar(100)' },
        { name: 'email', type: 'varchar(255)' },
        { name: 'created_at', type: 'timestamp' }
      ]
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', type: 'integer', primaryKey: true },
        { name: 'customer', type: 'varchar(100)' },
        { name: 'total', type: 'decimal(10,2)' },
        { name: 'status', type: 'varchar(50)' },
        { name: 'created_at', type: 'timestamp' }
      ]
    },
    {
      name: 'products',
      columns: [
        { name: 'id', type: 'integer', primaryKey: true },
        { name: 'name', type: 'varchar(200)' },
        { name: 'price', type: 'decimal(10,2)' },
        { name: 'category', type: 'varchar(100)' }
      ]
    }
  ]
};

