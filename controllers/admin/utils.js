const AppError = require('../../utils/appError')
const { s3, s3bucket } = require('../../config/config')

const deleteFile = (fileName, next) => {
  const keyName = decodeURI(fileName)
  const params = {
    Bucket: s3bucket,
    Key: keyName
  };

  return new Promise(resolve => {
    s3.deleteObject(params, (error) => {
      if (error) return next(
        new AppError(`Could not delete file: ${fileName}`, 404)
      )

      resolve(`Delete File: ${fileName}`);
    });
  })
}

function isDefaultImage(imageName) {
  return imageName === 'article_cover_fallback.jpg'
}

module.exports = { isDefaultImage, deleteCoverImage: deleteFile }