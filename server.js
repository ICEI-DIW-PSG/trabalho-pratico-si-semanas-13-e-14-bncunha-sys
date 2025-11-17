import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jsonServer from 'json-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

const apiRouter = jsonServer.router(path.join(__dirname, 'db/db.json'));
const middlewares = jsonServer.defaults();

app.use('/api', middlewares, apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API fake rodando em http://localhost:${PORT}/api`);
});
