const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const {
  User,
  Product,
  ProductVersion,
  // Feedback,
  Order,
  OrderItem,
  ProductImage,
  WishlistItem,
  Shop,
  Category,
  sequelize,
} = require('../models');
const { Op, and, or, where } = require('sequelize');
const customError = require('../utils/customError');
const { response } = require('../utils/response');
const { ORDER_STATUS } = require('../constants/constants');
const { required } = require('joi');

/**
 * @desc    add new product
 * @route   POST /api/v1/products
 */
exports.addProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let { name, description, categoryId, images, size, versions } = req.body;
    let minPrice = (maxPrice = versions[0].price);
    versions.forEach((version) => {
      minPrice = minPrice > version.price ? version.price : minPrice;
      maxPrice = maxPrice < version.price ? version.price : maxPrice;
    });
    const product = await Product.create(
      {
        name,
        description,
        shopId: req.user.shop.id,
        categoryId,
        size,
        totalVersions: versions.length,
        minPrice,
        maxPrice,
      },
      { transaction: t }
    );

    images = images.map((image) => ({
      productId: product.id,
      image,
    }));

    await ProductImage.bulkCreate(images, {
      transaction: t,
    });

    versions = versions.map((version) => ({
      productId: product.id,
      ...version,
    }));
    await ProductVersion.bulkCreate(versions, {
      transaction: t,
    });
    await t.commit();
    return response(product, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

/**
 * @desc    update product
 * @route   PUT /api/v1/products/:productId
 * @access  shop owner
 */
exports.updateProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const productId = req.params.productId;
    const shopId = req.user.shop.id;
    const result = await Product.destroy(
      {
        where: { shopId, id: productId },
      },
      { transaction: t }
    );
    if (result === 1) {
      let { name, description, categoryId, images, size, versions } = req.body;
      let minPrice = (maxPrice = versions[0].price);
      versions.forEach((version) => {
        minPrice = minPrice > version.price ? version.price : minPrice;
        maxPrice = maxPrice < version.price ? version.price : maxPrice;
      });
      const product = await Product.create(
        {
          id: productId,
          name,
          description,
          shopId,
          categoryId,
          size,
          totalVersions: versions.length,
          minPrice,
          maxPrice,
        },
        { transaction: t }
      );

      images = images.map((image) => ({
        productId: product.id,
        image,
      }));

      await ProductImage.bulkCreate(images, {
        transaction: t,
      });

      versions = versions.map((version) => ({
        productId: product.id,
        ...version,
      }));
      await ProductVersion.bulkCreate(versions, {
        transaction: t,
      });
    }
    await t.commit();
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

/**
 * @desc    delete product
 * @route   DELETE /api/v1/products/:productId
 * @access  shop owner or admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.destroy({
      where: { id: req.params.productId },
    });
    return response({ success: true }, httpStatus.OK, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    get one product
 * @route   GET /api/v1/products/:productId
 * @access  public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    let product = await Product.findOne({
      where: { id: productId },
      include: [
        {
          model: ProductVersion,
          as: 'productVersions',
          attributes: ['id', 'size', 'color', 'quantity', 'price', 'image'],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: ['id', 'name', 'description', 'coverImage'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image'],
        },
      ],
      attributes: [
        'id',
        'name',
        'description',
        'soldQuantity',
        'avgRatings',
        'totalRatings',
      ],
    });
    let orderItem;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1];
      const userId = jwt.verify(token, process.env.JWT_SECRET).id;
      orderItem = await OrderItem.findOne({
        include: [
          {
            model: Order,
            as: 'order',
            select: ['id'],
            where: { status: ORDER_STATUS.DELIVERED, userId },
            required: true,
          },
          {
            model: ProductVersion,
            as: 'productVersion',
            select: ['id'],
            include: [
              {
                model: Product,
                as: 'product',
                where: { id: productId },
                select: ['id'],
                required: true,
              },
            ],
            required: true,
          },
        ],
      });
    }
    if (orderItem) {
      product = JSON.parse(JSON.stringify(product));
      product.wasOrdered = true;
    }

    return response(product, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get products of shop
 * @route   GET /api/v1/products
 * @access  public
 */
exports.getProducts = async (req, res, next) => {
  try {
    let { keyword, categories, min, max, ratings, sort, order } = req.query;
    let findingQuery = {};

    if (req.params.shopId) {
      findingQuery = { shopId: req.params.shopId };
    }
    //filter keyword
    if (keyword) {
      findingQuery = {
        ...findingQuery,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      };
    }

    //filter categories
    if (categories) {
      // categories = categories.split(',').map((iNum) => parseInt(iNum, 10));
      findingQuery = { ...findingQuery, categoryId: categories };
    }

    // filter price
    min = min ? min : 0;
    max = max ? max : Number.MAX_SAFE_INTEGER;
    if (req.query.min) {
      findingQuery.minPrice = {
        [Op.and]: [{ [Op.gte]: min }, { [Op.lte]: max }],
      };
    }

    //filter rating
    let minRating = 0;
    let maxRating = 5;
    if (ratings) {
      minRating = Math.min(...ratings);
      maxRating = Math.max(...ratings) + 1;
      findingQuery.avgRatings = {
        [Op.and]: [{ [Op.gte]: minRating }, { [Op.lte]: maxRating }],
      };
    }

    //Pagination, default page 1, limit 5
    let { page = 1, limit = 9 } = req.query;
    limit = parseInt(limit, 10);
    const startIndex = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      where: findingQuery,
      limit,
      offset: startIndex,
      order: [[`${sort}`, `${order}`]],
      include: [
        {
          model: Shop,
          as: 'shop',
          attributes: ['userId'],
          include: [
            {
              model: User,
              as: 'owner',
              where: { isActive: true },
              attributes: [],
              required: true,
            },
          ],
          required: true,
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image'],
        },
        {
          model: WishlistItem,
          as: 'wishlistItems',
          attributes: ['id', 'userId'],
        },
      ],
      distinct: true,
    });

    let products = JSON.parse(JSON.stringify(rows));
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1];
      const userId = jwt.verify(token, process.env.JWT_SECRET).id;
      products.forEach((product) => {
        const wishlistItemIdIndex = product.wishlistItems.findIndex(
          (item) => item.userId === userId
        );
        if (wishlistItemIdIndex > -1) {
          product.inWishlist = true;
          product.wishlistItemId =
            product.wishlistItems[wishlistItemIdIndex].id;
        } else {
          product.inWishlist = false;
        }
        product.wishlistItems = undefined;
      });
    }

    return response(
      { products, totalProducts: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

/**
 * @desc    get best selling products
 * @route   GET /api/v1/products/best-sellings
 * @access  public
 */
exports.getBestSellingProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const startIndex = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      limit,
      offset: startIndex,
      order: [
        ['soldQuantity', 'DESC'],
        ['avgRatings', 'DESC'],
      ],
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'image'],
          limit: 1,
        },
        {
          model: WishlistItem,
          as: 'wishlistItems',
          attributes: ['id', 'userId'],
        },
      ],
    });

    let products = JSON.parse(JSON.stringify(rows));
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1];
      const userId = jwt.verify(token, process.env.JWT_SECRET).id;
      products.forEach((product) => {
        const wishlistItemIdIndex = product.wishlistItems.findIndex(
          (item) => item.userId === userId
        );
        if (wishlistItemIdIndex > -1) {
          product.inWishlist = true;
          product.wishlistItemId =
            product.wishlistItems[wishlistItemIdIndex].id;
        } else {
          product.inWishlist = false;
        }
        product.wishlistItems = undefined;
      });
    }

    return response(
      { products, totalProducts: count, currentPage: page },
      httpStatus.OK,
      res
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    get purchased products
 * @route   GET /api/v1/products/purchased
 */
exports.getPurchasedProducts = async (req, res, next) => {
  try {
    const { categoryId = { [Op.not]: null } } = req.query;
    let products = await OrderItem.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Order,
          as: 'order',
          where: { userId: req.user.id, status: ORDER_STATUS.DELIVERED },
          required: true,
        },
        {
          model: ProductVersion,
          as: 'productVersion',
          attributes: ['id', 'productId'],
          include: [
            {
              model: Product,
              where: { categoryId },
              as: 'product',
              attributes: ['id', 'name', 'categoryId'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['id', 'image'],
                  limit: 1,
                },
              ],
              required: true,
            },
          ],
          required: true,
        },
      ],
      distinct: true,
    });

    products = JSON.parse(JSON.stringify(products));
    products = products.map((product) => product.productVersion.product);

    // remove duplicates products
    products = products.filter(
      (product, index) =>
        products.findIndex((p) => p.id === product.id) === index
    );
    return response(products, httpStatus.OK, res);
  } catch (error) {
    return next(error);
  }
};
