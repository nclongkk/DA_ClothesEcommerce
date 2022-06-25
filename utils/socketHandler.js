const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      console.log('connect');
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new customError('Unauthorization', httpStatus.FORBIDDEN));
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: payload.id,
      };
      return next();
    } catch (error) {
      return next(error);
    }
  }).on('connection', (socket) => {
    console.log(socket.user.id);
    socket.join(socket.user.id);

    // emit connected event
    socket.emit('connected', { msg: 'connected' });
  });
};

module.exports = socketHandler;
