/** @format */

const User = require('../models/User')
const Custody = require('../models/Custody')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const { extractUrl, generatePassword, sendEmail } = require('../utils')
const axios = require('axios')
const {
  Types: { ObjectId },
} = require('mongoose')

// const {

//   authorizeRoles,
// } = require('../middleware/authentication');
const addUser = async (req, res, next) => {
  try {
    if (req.user.role === 'safety-advisor') {
      const { username, SerialNumber, idNumber, phoneNumber, email } = req.body
      const { custodyId } = req.user
      let image = {}
      const accountAlreadyExists = await User.findOne({
        username,
      })
      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "your username is already exists", "arMessage" :"اسم المستخدم موجود بالفعل"}'
        )
      }
      if (req.file) {
        image = await extractUrl(req.file)
      }

      const user = await User.create({
        username,
        role: 'trainer',
        SerialNumber,
        custodyId,
        idNumber,
        email,
        phoneNumber,
        image: image,
      })
      res.status(StatusCodes.CREATED).json({
        msg: '!safety-advisor added user ',
        user,
      })
    } else {
      const {
        username,
        memberShipType,
        vid,
        idNumber,
        SerialNumber,
        custodyId,
        phoneNumber,
        email,
      } = req.body
      let image = {}
      const accountAlreadyExists = await User.findOne({
        username,
      })

      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "your username is already exists", "arMessage" :"اسم المستخدم موجود بالفعل"}'
        )
      }

      // first registered user is an admin
      if (req.file) {
        image = await extractUrl(req.file)
      }
      let autoPass = generatePassword()

      const user = await User.create({
        username,
        role: memberShipType,
        vid,
        email: email,
        idNumber,
        password: memberShipType === 'safety-advisor' ? autoPass : '123456',
        SerialNumber,
        custodyId,
        phoneNumber,
        image: image,
      })
      if (memberShipType == 'safety-advisor') {
        await sendEmail({
          name: user.username,
          email: user.email,
          subject: 'Password Account',
          html: `<h4> Hello, ${user.username}</h4>
          <div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h2>Welcome to ITC.</h2>
  <h4>You are officially In ✔</h4>
  <p style="margin-bottom: 30px;">Your password account is </p>
  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${autoPass}</h1>
  <p style="margin-bottom: 30px;">Your username  is </p>
  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${user.username}</h1>
</div>
          `,
        })
      }
      res.status(StatusCodes.CREATED).json({
        msg: 'admin! added user ',
        user,
      })
    }
  } catch (error) {
    next(error)
  }
}
const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.role == 'admin') {
      const { username, SerialNumber, idNumber, custodyId, vid, phoneNumber } =
        req.body
      // const { custodyId } = req.user;
      const account = await User.findOne({
        _id: id,
      })

      if (account.custodyId == null || account.custodyId == custodyId) {
        account.custodyId = custodyId
        account.save()
      } else {
        const Cus = await Custody.find({ _id: custodyId })
        Cus.pendingTrainers.push(account._id)
        Cus.save()
      }
      let image = {}
      if (req.file) {
        image = await extractUrl(req.file)
      } else {
        image.url = account.image.url
        image.public_id = account.image.public_id
      }

      const user = await User.findOneAndUpdate(
        { _id: id },
        { username, SerialNumber, idNumber, vid, image: image, phoneNumber },
        { new: true, runValidators: true }
      )
      res.status(StatusCodes.CREATED).json({
        msg: '!safety-advisor updated user ',
        user,
      })
    } else {
      const {
        username,
        memberShipType,
        vid,
        idNumber,
        SerialNumber,
        custodyId,
        phoneNumber,
      } = req.body

      let image = {}
      const account = await User.findOne({
        _id: id,
      })
      if (!account) {
        throw new CustomError.BadRequestError(
          '{"enMessage" : "your account Not exists", "arMessage" :"اسم المستخدم غير موجود"}'
        )
      }
      // first registered user is an admin

      if (custodyId) {
        if (account.role == 'trainer') {
          if (account.custodyId == null || account.custodyId == custodyId) {
            account.custodyId = custodyId
            account.save()
          } else {
            const Cus = await Custody.findOne({ _id: custodyId })
            Cus.pendingTrainers.push(account._id)
            Cus.save()
          }
        } else {
          account.custodyId = custodyId
          account.save()
          const Cus = await Custody.findOne({ _id: custodyId })
          const oldCus = await User.findOne({ _id: custodyId })
          oldCus.custodyId = null
          Cus.SafetyAdvisor == account._id
          oldCus.save()
          Cus.save()
        }
      }
      if (req.file) {
        image = await extractUrl(req.file)
      } else {
        image.url = account.image.url
        image.public_id = account.image.public_id
      }
      const user = await User.findOneAndUpdate(
        { _id: id },
        {
          username: username,
          SerialNumber,
          idNumber,
          vid,
          image: image,
          phoneNumber,
          role: memberShipType,
        },
        { new: true, runValidators: true }
      )
      res.status(StatusCodes.CREATED).json({
        msg: '!admin updated user ',
        user,
      })
    }
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
const addCustody = async (req, res, next) => {
  try {
    const { custodyName, city, SafetyAdvisor } = req.body
    let image = {}

    if (req.file) {
      image = await extractUrl(req.file)
    }
    const custody = await Custody.create({
      custodyName,
      city,
      SafetyAdvisor,
      image: image,
    })

    await User.updateMany(
      {
        $or: [
          { _id: { $in: SafetyAdvisor } },
          { _id: { $in: req.body.trainerIds } },
        ],
      },
      { $set: { custodyId: custody._id } }
    )

    res.status(StatusCodes.CREATED).json({
      msg: 'add Custody successfully',
      custody,
    })
  } catch (error) {
    next(error)
  }
}
const updateCustody = async (req, res, next) => {
  try {
    const { custodyName, city, SafetyAdvisor } = req.body

    const custody = await Custody.findOne({ _id: req.params.id })

    if (!custody) return res.status(404).json({ msg: 'custody not found' })

    let image = {}

    if (req.file) {
      image = await extractUrl(req.file)
    } else {
      image.url = custody.image.url
      image.public_id = custody.image.public_id
    }

    if (!req.body.trainerIds || req.body.trainerIds.length === 0) {
      await User.updateMany(
        { custodyId: custody._id },
        {
          $set: { custodyId: null },
        }
      )
    } else {
      await User.updateMany(
        { _id: { $in: req.body.trainerIds } },
        { $set: { custodyId: custody._id } }
      )
    }

    if (!SafetyAdvisor || SafetyAdvisor.length === 0)
      return res
        .status(400)
        .json({ msg: `Please make sure to select at least '1' SafetyAdvisor` })
    else {
      await User.updateMany(
        { _id: { $in: custody.SafetyAdvisor } },
        { $set: { custodyId: null } }
      )
      await User.updateMany(
        { _id: { $in: SafetyAdvisor } },
        { $set: { custodyId: custody._id } }
      )
    }

    const updatedCustody = await Custody.findOneAndUpdate(
      { _id: req.params.id },
      {
        custodyName,
        city,
        SafetyAdvisor,
        image: image,
      },
      { new: true, runValidators: true }
    )

    return res
      .status(200)
      .json({ msg: 'Custody updated successfully', updatedCustody })
  } catch (error) {
    next(error)
  }
}
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
}
const getallCustodys = async (req, res, next) => {
  const { city } = req.query
  try {
    let agg
    if (city) {
      agg = [
        {
          $match: { city: city },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'custodyId',
            as: 'users',
          },
        },
        {
          $project: {
            users: {
              $map: {
                input: {
                  $filter: {
                    input: '$users',
                    as: 'user',
                    cond: {
                      $eq: ['$$user.role', 'trainer'],
                    },
                  },
                },
                as: 'user',
                in: {
                  _id: '$$user._id',
                  username: '$$user.username',
                  phoneNumber: '$$user.phoneNumber',
                  email: '$$user.email',
                  role: '$$user.role',
                  idNumber: '$$user.idNumber',
                  vid: '$$user.vid',
                  SerialNumber: '$$user.SerialNumber',
                  isOnline: '$$user.isOnline',
                  custodyId: '$custodyName',
                  image: '$$user.image',
                  __v: '$$user.__v',
                },
              },
            },
            custodyName: 1,
            pendingTrainers: 1,
            SafetyAdvisor: 1,
            city: 1,
            image: 1,
          },
        },
      ]
    } else {
      agg = [
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'custodyId',
            as: 'users',
          },
        },
        {
          $project: {
            users: {
              $map: {
                input: {
                  $filter: {
                    input: '$users',
                    as: 'user',
                    cond: {
                      $eq: ['$$user.role', 'trainer'],
                    },
                  },
                },
                as: 'user',
                in: {
                  _id: '$$user._id',
                  username: '$$user.username',
                  phoneNumber: '$$user.phoneNumber',
                  email: '$$user.email',
                  role: '$$user.role',
                  idNumber: '$$user.idNumber',
                  vid: '$$user.vid',
                  SerialNumber: '$$user.SerialNumber',
                  isOnline: '$$user.isOnline',
                  custodyId: '$custodyName',
                  image: '$$user.image',
                  __v: '$$user.__v',
                },
              },
            },
            custodyName: 1,
            pendingTrainers: 1,
            SafetyAdvisor: 1,
            city: 1,
            image: 1,
          },
        },
      ]
    }
    const custody = await Custody.aggregate(agg)

    await Custody.populate(custody, { path: 'SafetyAdvisor pendingTrainers' })
    res.status(StatusCodes.OK).json({ custody })
  } catch (error) {
    next(error)
  }
}
const getAllTrainers = async (req, res, next) => {
  try {
    // const users = await User.find({
    //   role: 'trainer',
    //   custodyId: { $ne: null },
    // })
    //   .populate('custodyId', 'custodyName -_id')
    let agg = [
      {
        $match: { role: 'trainer', custodyId: { $ne: null } },
      },
      {
        $lookup: {
          from: 'groups',
          localField: 'custodyId',
          foreignField: '_id',
          as: 'custodyId',
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          phoneNumber: 1,
          email: 1,
          role: 1,
          idNumber: 1,
          vid: 1,
          SerialNumber: 1,
          isOnline: 1,
          image: 1,
          custodyName: { $arrayElemAt: ['$custodyId.custodyName', 0] },
          custodyId: { $arrayElemAt: ['$custodyId._id', 0] },
        },
      },
    ]
    const users = await User.aggregate(agg)
    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
}
const getAllSafetyAdvisor = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'safety-advisor' })
    res.status(StatusCodes.OK).json({ users })
  } catch (error) {
    next(error)
  }
}
const CustodyDetails = async (req, res, next) => {
  try {
    let agg = [
      {
        $match: { _id: new ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'custodyId',
          as: 'users',
        },
      },
      {
        $project: {
          users: {
            $map: {
              input: {
                $filter: {
                  input: '$users',
                  as: 'user',
                  cond: {
                    $eq: ['$$user.role', 'trainer'],
                  },
                },
              },
              as: 'user',
              in: {
                _id: '$$user._id',
                username: '$$user.username',
                phoneNumber: '$$user.phoneNumber',
                email: '$$user.email',
                role: '$$user.role',
                idNumber: '$$user.idNumber',
                vid: '$$user.vid',
                SerialNumber: '$$user.SerialNumber',
                isOnline: '$$user.isOnline',
                custodyId: '$$user.custodyId',
                image: '$$user.image',
                __v: '$$user.__v',
              },
            },
          },
          custodyName: 1,
          pendingTrainers: 1,
          SafetyAdvisor: 1,
          city: 1,
          image: 1,
        },
      },
    ]
    // const custodyDetails = await Custody.aggregate(agg).populate('SafetyAdvisor');
    const custodyDetails = await Custody.aggregate(agg)
    await Custody.populate(custodyDetails, {
      path: 'SafetyAdvisor pendingTrainers',
    })
    res.status(StatusCodes.OK).json({ custodyDetails })
  } catch (error) {
    next(error)
  }
}
const getCustodyByCity = async (req, res, next) => {
  try {
    let agg = [
      {
        $match: { city: req.body.city },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'custodyId',
          as: 'users',
        },
      },
      {
        $project: {
          users: {
            $filter: {
              input: '$users',
              as: 'user',
              cond: { $eq: ['$$user.role', 'trainer'] },
            },
          },
          custodyName: 1,
          pendingTrainers: 1,
          SafetyAdvisor: 1,
          city: 1,
          image: 1,
        },
      },
    ]
    // const custodyDetails = await Custody.aggregate(agg).populate('SafetyAdvisor');
    const custodyDetails = await Custody.aggregate(agg)
    await Custody.populate(custodyDetails, {
      path: 'SafetyAdvisor pendingTrainers',
    })
    res.status(StatusCodes.OK).json({ custodyDetails })
  } catch (error) {
    next(error)
  }
}
const getsafteyAdvisorCustody = async (req, res, next) => {
  try {
    const { ObjectId } = require('mongoose').Types

    let agg = [
      {
        $match: { _id: new ObjectId(req.user.custodyId) },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'custodyId',
          as: 'users',
        },
      },
      {
        $project: {
          users: {
            $filter: {
              input: '$users',
              as: 'user',
              cond: { $eq: ['$$user.role', 'trainer'] },
            },
          },
          custodyName: 1,
          pendingTrainers: 1,
          SafetyAdvisor: 1,
          city: 1,
          image: 1,
        },
      },
    ]
    const data = await Custody.aggregate(agg)
    await Custody.populate(data, {
      path: 'SafetyAdvisor pendingTrainers',
    })
    res.status(StatusCodes.OK).json({ data })
  } catch (error) {
    next(error)
  }
}
const getProfile = async (req, res, next) => {
  try {
    const data = await User.find({ _id: req.user.userId })
    res.status(StatusCodes.OK).json({ data })
  } catch (error) {
    next(error)
  }
}
const getHomeStatistics = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({
      onlineUsers: 20,
      offlineUsers: 15,
      totalMillage: 1229,
      SafetyAdvisor: 10,
      totalUsers: 45,
    })
  } catch (error) {
    next(error)
  }
}
const addRequest = async (req, res, next) => {
  try {
    let waitingTrainer = []
    const { username, to } = req.body
    const user = await User.findOne({ username: username })
    const custody = await Custody.findOne({ _id: to })
    if (user.custodyId == null || custody.pendingTrainers.includes(user._id)) {
      throw new Error(
        '{"enMessage" : "you can not  add request for new trainers or trainer  already request it ", "arMessage" :"لا يمكنك إضافة طلب لمتدرب جديد أو لمتدرب قام بطلب بالفعل"}'
        // { statusCode: 400 }
      )
    }
    waitingTrainer = custody.pendingTrainers
    waitingTrainer.push(user._id)
    await Custody.findByIdAndUpdate(to, { pendingTrainers: waitingTrainer })
    res.status(StatusCodes.OK).json({ msg: 'add request successfully' })
  } catch (error) {
    next(error)
  }
}
const resForRequest = async (req, res, next) => {
  const { responce, trainerId, custodyId } = req.body
  try {
    if (responce == 'accept') {
      let trainer = await User.findOne({
        _id: trainerId,
      })
      let custody = await Custody.findOne({ _id: custodyId })
      let findTr = custody.pendingTrainers.findIndex(
        (e) => e._id.toString() == trainerId
      )
      if (findTr > -1) {
        custody.pendingTrainers.splice(findTr, 1)
        trainer.custodyId = custodyId
      } else {
        return res.status(200).json({ msg: "you can't added on this group" })
      }
      trainer.save()
      custody.save()
      res.status(200).json({ msg: 'accepted req' })
    } else if (responce == 'refuse') {
      let custody = await Custody.findOne({ _id: custodyId })
      let findTr = custody.pendingTrainers.findIndex(
        (e) => e._id.toString() == trainerId
      )
      if (findTr > -1) {
        custody.pendingTrainers.splice(findTr, 1)
      }
      custody.save()
      res.status(200).json({ msg: 'reject req' })
    } else {
      throw new Error(
        '{"enMessage" : "please try again", "arMessage" :"برجاء المحاولة مرة أخرى"}'
      )
    }
  } catch (error) {
    next(error)
  }
}
const freeSaftey = async (req, res, next) => {
  try {
    const safety = await User.find({
      custodyId: null,
      role: { $eq: 'safety-advisor' },
    })
    res.status(StatusCodes.OK).json({ safety })
  } catch (error) {
    next(error)
  }
}
const getPendingTrainers = async (req, res, next) => {
  const { custodyId } = req.body
  const data = await Custody.findOne({ _id: custodyId }).populate(
    'pendingTrainers'
  )
  res.status(200).json({ data })
}
const Vehicle = async (req, res, next) => {
  const { token } = req.user
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const getAllVech = await User.find(
    { SerialNumber: { $ne: null } },
    { SerialNumber: 1, _id: 0 }
  )
  const data = await axios
    .get('https://api.v6.saferoad.net/dashboard/vehicles', config)
    .then((apiResponse) => {
      // process the response
      return apiResponse.data
    })
    .catch((err) => {
      console.log(err)
    })

  data.Vehicles = data.Vehicles.filter((veh) => {
    return !getAllVech.some((g) => g.SerialNumber == veh.SerialNumber)
  })
  res.send(data.Vehicles)
}
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id: req.params.id })

    await Custody.findOneAndUpdate(
      { _id: deletedUser.custodyId },
      {
        $pull: { SafetyAdvisor: { $in: deletedUser._id } },
      }
    )

    if (!deletedUser)
      return res.status(404).json({ msg: 'No document found with that ID' })

    return res.status(200).json({ msg: 'the user has been deleted' })
  } catch (error) {
    res.status(500).json({ error, msg: 'Something went wrong' })
  }
}
const deleteCustody = async (req, res) => {
  try {
    const deletedCustody = await Custody.findOneAndDelete(req.params.id)

    await User.updateMany(
      { _id: deletedCustody.SafetyAdvisor },
      {
        $set: { custodyId: null },
      }
    )

    if (!deletedCustody)
      return res.status(404).json({ msg: 'No document found with that ID' })

    return res.status(200).json({ msg: 'the custody has been deleted' })
  } catch (error) {
    res.status(500).json({ error, msg: 'Something went wrong' })
  }
}

module.exports = {
  deleteCustody,
  deleteUser,
  addUser,
  addCustody,
  getAllUsers,
  getAllTrainers,
  getAllSafetyAdvisor,
  CustodyDetails,
  getCustodyByCity,
  getallCustodys,
  updateCustody,
  getsafteyAdvisorCustody,
  getProfile,
  getHomeStatistics,
  addRequest,
  resForRequest,
  updateUser,
  freeSaftey,
  getPendingTrainers,
  Vehicle,
}
