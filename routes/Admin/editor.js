const express = require('express')
const router = express.Router()
const editorController = require('../../controllers/admin/editorController')

router.route('/')
    .get(editorController.getJournals)
    .post(editorController.saveArticle)
    .patch(editorController.editArticle)
    .delete(editorController.deleteArticle)

router
    .delete('/file/:fileName', editorController.deleteFile)
    .delete('/:id/:articleCover/:authorPhoto', editorController.deleteArticle)

router
    .post('/upload/image', editorController.uploadImage, editorController.uploadFile)
    .post('/upload/pdf', editorController.uploadPDF, editorController.uploadFile)

router
    .get('/images/:name', editorController.getImageFile)


module.exports = router