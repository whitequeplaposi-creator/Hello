const { createClient } = require('@libsql/client');
const c = createClient({
  url: 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxMzY3MzcsImlkIjoiMDE5Y2QzN2QtYzYwMS03YWVjLTljMjctMzY0MmE2ZjA0YjIyIiwicmlkIjoiNzg3ZmQwMjYtZDk5OS00ZTM3LThiZjctODBlYmU2NGViYzRjIn0.ahQ8U_X0Mbrefkedzbr0eDDqGM7lPtnkM2p0bzh9l_5pl2SFQ8ODOhcECfDZo9qLKy9H58SUVYbF1y2OQjsJBg'
});

c.execute("SELECT id, namn, color FROM Eprolo WHERE color IS NOT NULL AND color != '' LIMIT 10").then(r => {
  r.rows.forEach(row => console.log(row.id, '|', row.namn, '|', row.color));
}).catch(e => console.error(e));
