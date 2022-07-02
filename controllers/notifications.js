const {
  OrderNotification,
  Order,
  OrderItem,
  ProductVersion,
} = require('../models');
const httpStatus = require('http-status');
const customError = require('../utils/customError');
const { response } = require('../utils/response');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const startIndex = (page - 1) * limit;
    const [{ rows, count }, countUnread] = await Promise.all([
      OrderNotification.findAndCountAll({
        where: {
          receiverUserId: userId,
        },
        limit,
        offset: startIndex,
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'createdAt', 'amount'],
            include: [
              {
                model: OrderItem,
                as: 'orderItems',
                attributes: ['id', 'productVersionId'],
                include: [
                  {
                    model: ProductVersion,
                    as: 'productVersion',
                    attributes: ['id', 'image'],
                  },
                ],
              },
            ],
          },
        ],

        order: [['createdAt', 'DESC']],
        distinct: true,
      }),
      OrderNotification.count({
        where: {
          receiverUserId: userId,
          isRead: false,
        },
      }),
    ]);

    return response(
      {
        notifications: rows,
        totalNotifications: count,
        totalUnreadNotifications: countUnread,
        currentPage: page,
      },
      httpStatus.OK,
      res
    );
  } catch (error) {
    next(error);
  }
};

exports.updateNotificationReadStatus = async (req, res, next) => {
  try {
    const notificationIds = req.body.notificationIds;
    const notifications = await OrderNotification.update(
      { isRead: true },
      {
        where: {
          id: notificationIds,
        },
      }
    );

    emitterNotificationEvent('read', { notificationIds });
    return response({ notifications }, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    emitterNotificationEvent(req.user.id, 'delete', { notificationId });
    const notification = await OrderNotification.destroy({
      where: {
        id: notificationId,
        receiverUserId: req.user.id,
      },
    });

    if (!notification) {
      throw new customError(
        'error.notification_not_found',
        httpStatus.NOT_FOUND
      );
    }

    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};

const emitterNotificationEvent = (receiverUserId, status, payload) => {
  _emitter.sockets.in(receiverUserId).emit('notification', { status, payload });
};
