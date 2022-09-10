const AppError = require('../../utils/appError')
const Volume = require('../../models/volume')
const {deleteCoverImage} = require('./utils')

exports.volumes = async (req, res) => {
    const volumes = await Volume.find({}).sort({volume: 1})
    res.status(200).json(volumes)
}


exports.getVolume = async (req, res) => {
    const {volume} = req.params

    if (isNaN(parseInt(volume, 10))) {
        throw new AppError('Volume is not a valid number', 400)
    }

    const result = await Volume.find({'volume': volume})
    res.status(200).json(result)
}

exports.createVolume = async (req, res) => {
    const {volume, about, cover, date} = req.body
    const newVolume = new Volume({
        volume, about, cover, date,
    })

    const result = await newVolume.save()

    if (!result) throw new AppError('Could not create volume ' + volume, 400)

    res.status(201).json({status: 'success'})
}


exports.editVolume = async (req, res) => {
    const {volume, about, cover, date, id} = req.body

    const filter = {_id: id}
    const update = {
        volume, about, cover, date,
    }

    if (cover.length === 0) delete update.cover

    const result = await Volume.findOneAndUpdate(filter, update, {
        returnOriginal: false
    })

    if (!result) throw new AppError('Could not edit volume ' + volume, 400)

    res.status(201).json({status: 'success'})
}

exports.deleteVolume = async (req, res, next) => {
    const {volume, imageName} = req.body
    if (isNaN(parseInt(volume, 10))) {
        throw new AppError('Volume is not a valid number', 400)
    }
    // * deleting the default image is not a good idea.
    // * all volumes use this image as default
    if (imageName !== 'volume_cover_fallback.jpeg') {
        await deleteCoverImage(imageName, next)
    }
    // * After deleting the cover image, volume can be safely deleted.
    const result = await Volume.deleteOne({'volume': volume})

    if (!result) throw new AppError('Could not delete Volume', 400)

    res.status(204).json({status: 'success'})
}