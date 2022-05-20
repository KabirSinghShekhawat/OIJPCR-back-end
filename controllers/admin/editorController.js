const fs = require('fs/promises')
const path = require('path')
const Journal = require('../../models/journal')
const AppError = require('../../utils/appError')
const {deleteCoverImage} = require('./utils')
const {multerImageUpload} = require('../ImageUpload/ArticleCoverImage')
const {multerPDFUpload} = require('../PDFUpload/PDF')

exports.uploadImage = multerImageUpload
exports.uploadPDF = multerPDFUpload

exports.getJournals = async (req, res) => {
    const journals = await Journal.find()
    if (!journals) throw new AppError('Could not load articles', 500)
    res.json(journals)
}

// ! change buffer type
// ! for local testing only
exports.getImageFile = async (req, res) => {
    const {name} = req.params
    // * calculate path of image in ./public/img
    const imagePath = path.dirname(require.main.filename) + '/public/img/' + name
    const imageSource = path.join(imagePath)
    //  * read image
    const data = await fs.readFile(imageSource)
    if (!data) throw new AppError('Could not load image', 400)
    // * send image using correct headers
    res.writeHead(200, {'Content-Type': 'image/jpeg'})
    res.end(data)
}

// * return image URL to client, stored in MongoDB.
exports.uploadFile = (req, res) => {
    const aliasLocationURL = `https://${req.file.location.split("https://s3.ap-south-1.amazonaws.com/")[1]}`
    res.send({
        msg: 'File Uploaded Successfully',
        file: {
            url: aliasLocationURL,
        }
    })
}

exports.saveArticle = async (req, res) => {
    const {author, title, content, slug, volume, cover, tags, authorPhoto, pdfFilePath} = req.body

    const newArticle = new Journal({
        author, title, content, slug, volume, cover, tags, authorPhoto, pdf: pdfFilePath
    })

    const result = await newArticle.save()

    if (!result) throw new AppError('Could not create Article', 400)

    res.status(201).send({status: 'success'})
}

exports.editArticle = async (req, res) => {
    const {id} = req.body
    const {
        author, title, content, slug, volume, cover, tags, authorPhoto, pdfFilePath
    } = req.body

    const modifiedArticle = {author, title, content, slug, volume, cover, tags, authorPhoto, pdf: pdfFilePath}

    const result = await Journal.findByIdAndUpdate(id, {...modifiedArticle})

    if (!result) throw new AppError('Could not update Article', 400)

    res.status(201).send({status: 'success'})
}

exports.deleteArticle = async (req, res, next) => {
    const {id, articleCover, authorPhoto} = req.body
    // * deleting the fallback image is not a good idea.
    // * all articles use this image as a fallback
    if (articleCover !== 'article_cover_fallback') await deleteCoverImage(articleCover, next)
    // * there is no fallback author photo in images
    // * author photo can be safely deleted now
    await deleteCoverImage(authorPhoto, next)
    // * After deleting the cover image, article can be safely deleted.
    const result = await Journal.findByIdAndDelete(id)

    if (!result) throw new AppError('Could not delete Article', 400)

    res.status(201).send({status: 'success'})
}

exports.deleteFile = async (req, res, next) => {
    const {fileName} = req.params
    await deleteCoverImage(fileName, next)
    res.status(204).send({status: 'success'})
}
