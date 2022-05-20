const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError')
const { s3, s3bucket } = require('../../config/config')

const deleteCoverImage = (imageName, next) => {
  const keyName = decodeURI(imageName)
  const params = {
    Bucket: s3bucket,
    Key: keyName
  };

  return new Promise(resolve => {
    s3.deleteObject(params, (error) => {
      if (error) return next(
        new AppError('Could not delete image: ' + imageName, 404)
      )

      resolve("Delete Image: " + imageName);
    });
  })
}

function isDefaultImage(imageName) {
  return imageName === 'article_cover_fallback.jpg'
}

module.exports = { isDefaultImage, deleteCoverImage }