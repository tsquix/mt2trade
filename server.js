// server.js
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Next.js dev serwer
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('✅ Client connected');

  socket.on('join-order-room', (orderIds) => {
    if (Array.isArray(orderIds)) {
      orderIds.forEach((orderId) => {
        socket.join(orderId);
        console.log(`room joined for ${orderId}`);
      });
    } else {
      console.log(`no orderid provided`);
    }
  });

  socket.on('new-purchase-request', ({ orderId, selectedOffer }) => {
    console.log(`📤 update for ${orderId}: ${selectedOffer}`);
    io.to(selectedOffer._id).emit('new-purchase', { orderId });
  });

  socket.on('order-status-updated', ({ orderId, status }) => {
    console.log(`📤 update for ${orderId}: ${status}`);
    io.to(orderId).emit('order-updated', { orderId, status });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

httpServer.listen(4001, () => {
  console.log('🚀 WebSocket server running at http://localhost:4001');
});
