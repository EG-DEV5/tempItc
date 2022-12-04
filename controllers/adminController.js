/** @format */

const User = require('../models/User');
const Group = require('../models/Group');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { extractUrl } = require('../utils');
const addUser = async (req, res, next) => {
  try {
    const {
      username,
      memberShipType,
      vid,
      location,
      idNumber,
      IMEINumber,
      itcCenter,
      groupId,
      phoneNumber,
      email,
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
      itcCenter,
      groupId,
      image: image,
      phoneNumber,
      email
    });
    // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

    // const tempOrigin = req.get('origin');
    // const protocol = req.protocol;
    // const host = req.get('host');
    // const forwardedHost = req.get('x-forwarded-host');
    // const forwardedProtocol = req.get('x-forwarded-proto');

    // send verification token back only while testing in postman!!!
    res.status(StatusCodes.CREATED).json({
      msg: 'Success! added user ',
      user,
    });
  } catch (error) {
    next(error);
  }
};
const addGroup = async (req, res, next) => {
  const { groupName, itcCenter, TeamLeader } = req.body;
  if (typeof req.body.trainerIds == 'string') {
    req.body.trainerIds = JSON.parse(req.body.trainerIds);
  } 
  
  else {
    const group = await Group.create({
      groupName,
      trainerIds:req.body.trainerIds,
      itcCenter,
      TeamLeader,
    });
    await User.updateMany({ _id: req.body.trainerIds }, { groupId: group._id });
    res.status(StatusCodes.CREATED).json({
      msg: 'add Group successfully',
      group,
    });
  }
};
const getAllUsers = async (req,res,next)=>{
    try {
        const users = await User.find();
        res.status(StatusCodes.OK).json({ users });
      } catch (error) {
        next(error);
      }
}
const getusersGroup = async (req,res,next)=>{
    try {
        const {groupName} = req.body
        const group = await Group.find({groupName:groupName}).populate('trainerIds').populate('TeamLeader');
        res.status(StatusCodes.OK).json({ group });
      } catch (error) {
        next(error);
      }
}

module.exports = {
  addUser,
  addGroup,
  getAllUsers,
  getusersGroup
};
