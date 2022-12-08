/** @format */

const User = require('../models/User');
const Custody = require('../models/Custody');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { extractUrl } = require('../utils');
// const {

//   authorizeRoles,
// } = require('../middleware/authentication');
const addUser = async (req, res, next) => {
  try {
    if (req.user.role === 'safety-advisor') {
      const { username, idNumber, IMEINumber } = req.body;
      const { custodyId } = req.user;
      let image = {};
      const accountAlreadyExists = await User.findOne({
        username,
      });
      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError('your account is already exists');
      }
      if (req.file) {
        image = await extractUrl(req.file);
      }
      const user = await User.create({
        username,
        role: 'trainer',
        idNumber,
        IMEINumber,
        custodyId,
        image: image,
      });
      res.status(StatusCodes.CREATED).json({
        msg: '!safety-advisor added user ',
        user,
      });
    } else {
      const {
        username,
        memberShipType,
        vid,
        location,
        idNumber,
        IMEINumber,
        custodyId,
      } = req.body;
      let image = {};
      const accountAlreadyExists = await User.findOne({
        username,
      });
      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError('your account is already exists');
      }

      // first registered user is an admin

      if (req.file) {
        image = await extractUrl(req.file);
      }
      const user = await User.create({
        username,
        role: memberShipType,
        vid,
        location,
        idNumber,
        IMEINumber,
        custodyId,
        image: image,
      });
      res.status(StatusCodes.CREATED).json({
        msg: 'admin! added user ',
        user,
      });
    }
  } catch (error) {
    console.log({ error });
    next(error);
  }
};
// const updateUser = async (req, res) => {
//   try {
//     const {
//       username,
//       memberShipType,
//       vid,
//       location,
//       idNumber,
//       IMEINumber,
//       itcCenter,
//       custodyId,
//       phoneNumber,
//       email,
//     } = req.body;
//     const Custody = await Custody.findOne({ id: req.params.id });

//     //update image and delete old from database
//     let image = {};
//     if (req.file) {
//       image = await extractUrl(req.file);
//     } else {
//       image.url = Custody.image.url;
//       image.public_id = Custody.image.public_id;
//     }
//     const updatedCustody = await User.findOneAndUpdate(
//       { id: req.params.id },
//       {
//         username,
//         memberShipType,
//         vid,
//         location,
//         idNumber,
//         IMEINumber,
//         itcCenter,
//         CustodyId,
//         phoneNumber,
//         email,
//       },
//       { new: true, runValidators: true }
//     );

//     await Custody.findOneAndUpdate({ _id: req.body.trainerIds }, { CustodyId: Custody._id });
//     await User.updateMany({ _id: difference }, { CustodyId: null });
//     return res.status(200).json({ updatedCustody });
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// };
const addCustody = async (req, res, next) => {
  try {
    const { custodyName, city, SafetyAdvisor } = req.body;
    let image = {};
    if (typeof req.body.trainerIds == 'string') {
      req.body.trainerIds = JSON.parse(req.body.trainerIds);
    }
    if (req.file) {
      image = await extractUrl(req.file);
    } else {
      const custody = await Custody.create({
        custodyName,
        trainerIds: req.body.trainerIds,
        city,
        SafetyAdvisor,
        image: image,
      });
      let updateUserToCustody = [];
      updateUserToCustody = req.body.trainerIds;
      updateUserToCustody.push(SafetyAdvisor);
      await User.updateMany(
        { _id: updateUserToCustody },
        { custodyId: custody._id }
      );
      res.status(StatusCodes.CREATED).json({
        msg: 'add Custody successfully',
        Custody,
      });
    }
  } catch (error) {
    next(error);
  }
};
const updateCustody = async (req, res, next) => {
  try {
    const { custodyName, city, SafetyAdvisor } = req.body;
    const custody = await Custody.findOne({ id: req.params.id });

    if (typeof req.body.trainerIds == 'string') {
      req.body.trainerIds = JSON.parse(req.body.trainerIds);
    }
    let image = {};
    let oldtrainers = [];
    if (req.file) {
      image = await extractUrl(req.file);
    } else {
      image.url = custody.image.url;
      image.public_id = custody.image.public_id;
    }
    const updatedCustody = await Custody.findOneAndUpdate(
      { id: req.params.id },
      {
        custodyName,
        trainerIds: req.body.trainerIds,
        city,
        SafetyAdvisor,
        image: image,
      },
      { new: true, runValidators: true }
    );
    if (req.body.trainerId) {
      oldtrainers = custody.trainerIds;
      oldtrainers.push(custody.SafetyAdvisor);
      let newtrainers = req.body.trainerIds;
      newtrainers.push(SafetyAdvisor);
      let difference = oldtrainers.filter(
        (x) => !newtrainers.toString().includes(x.toString())
      );
      await User.updateMany({ _id: newtrainers }, { custodyId: custody._id });
      await User.updateMany({ _id: difference }, { custodyId: null });
    }
    return res.status(200).json({ updatedCustody });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

const getallCustodys = async (req, res, next) => {
  try {
    const custody = await Custody.find({})
      .populate('trainerIds')
      .populate('SafetyAdvisor');
    res.status(StatusCodes.OK).json({ custody });
  } catch (error) {
    next(error);
  }
};
const getAllTrainers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'trainer' });
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};
const getAllSafetyAdvisor = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'safety-advisor' });
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};
const CustodyDetails = async (req, res, next) => {
  try {
    const custodyDetails = await Custody.findById(req.body.id)
      .populate('trainerIds')
      .populate('SafetyAdvisor');
    res.status(StatusCodes.OK).json({ custodyDetails });
  } catch (error) {
    next(error);
  }
};
const getCustodyByCity = async (req, res, next) => {
  try {
    const getCustodyByCity = await Custody.find({ city: req.body.city });
    res.status(StatusCodes.OK).json({ getCustodyByCity });
  } catch (error) {
    next(error);
  }
};
const getsafteyAdvisorCustody = async (req, res, next) => {
  try {
    const data = await Custody.find({ _id: req.user.custodyId })
      .populate('trainerIds')
      .populate('SafetyAdvisor');
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    next(error);
  }
};
const getProfile = async (req, res, next) => {
  try {
    const data = await User.find({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    next(error);
  }
};
const getHomeStatistics = async (req, res, next) => {
  try {
    res
      .status(StatusCodes.OK)
      .json({
        onlineUsers: 20,
        offlineUsers: 15,
        totalMillage: 1229,
        SafetyAdvisor: 10,
        totalUsers: 45,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
