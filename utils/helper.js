const { OrderNotification } = require('../models');
exports.notifyOrderStatusChangingEvent = (order, emitter) => {
  OrderNotification.create({
    orderId: order.id,
    receiverUserId: order.userId,
    message: `Your order ${order.id} is ${order.status}`,
  })
    .then(() => {
      _emitter.socket.in(order.userId).emit('orderStatusChanging', order);
    })
    .catch((error) => console.log(error));
};
