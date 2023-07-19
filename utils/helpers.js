/** @format */
const cloudinary = require('./cloudainary')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')
const envToInt = (val, def = 100) => {
  const res = parseInt(val, 10)
  if (isNaN(res)) return def
  else if (res < 0) return def
  else return res
}
const extractUrl = async (file) => {
  let userimage = {}
  const { filename: image } = file
  const resizedpath = path.resolve(file.destination, image + '_resized_' + Date.now())
  const maxSize = envToInt(process.env.IMAGE_MAX_SIZE, 500)
  await sharp(file.path)
    .resize(maxSize, maxSize, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFile(resizedpath)
  fs.unlinkSync(file.path)
  const { public_id, secure_url } = await cloudinary.uploader.upload(resizedpath, { folder: 'itc' })
  userimage.url = secure_url
  userimage.public_id = public_id
  return userimage
}

module.exports = { extractUrl, envToInt }
