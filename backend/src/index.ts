import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import todosRoute from './routes/todos';
import usersRoute from './routes/users';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/todos', todosRoute);
app.use('/api/users', usersRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
