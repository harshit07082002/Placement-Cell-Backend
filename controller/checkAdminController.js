const catchAsync = require('./catchAsync');
const authController = require('./authController');


exports.checkAdmin = catchAsync(async (req, res, next) => {
  const isAdmin = await authController.isAdmin(req.headers.authorization);
    res.status(200).json({
      status: 'success',
      isAdmin,
    });
});