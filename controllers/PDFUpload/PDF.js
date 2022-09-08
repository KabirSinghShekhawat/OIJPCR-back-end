const multer = require('multer')
const multerS3 = require('multer-s3')
const {
  createFileName,
} = require('./utils')
const { s3, s3bucket } = require('../../config/config')

const multerStorage = multerS3({
  s3: s3,
  bucket: s3bucket,
  acl: 'public-read',
  cacheControl: 'max-age=604800000', // cache for 1 week
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    const filename = createFileName(file.originalname, file.mimetype)
    cb(null, filename)
  },
})

// ** filter -> allow files with mimeType: image/* to pass through
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application/pdf')) {
    cb(null, true)
  } else cb(new Error('Not a pdf'), false)
}

const multerPDFUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('pdf')

module.exports = { multerPDFUpload }