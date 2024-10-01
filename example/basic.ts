import Server from '../src/server';

const app = new Server();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
