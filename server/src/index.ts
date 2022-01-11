import 'reflect-metadata';
import express from 'express';
import path from 'path';
import purchaseOrders from './routes/purchaseOrders';

const port = 3000;
const clientBasePath = path.join(__dirname, '../../client/build');

const app = express();

app.use(express.json());

// API
app.use('/api', purchaseOrders);

// Client
app.use(express.static(clientBasePath));
app.use('*', (req, res) => {
  res.sendFile(path.join(clientBasePath, 'index.html'));
});

app.listen(port, () => console.log(`Service is running. Listening on port ${port}`));
