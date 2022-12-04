
const User = require('../models/User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

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
      } = req.body;
      let image = {};
      const accountAlreadyExists = await User.findOne({
        username,
      });
      if (accountAlreadyExists) {
        throw new CustomError.BadRequestError(
          'your account is already exists'
        );
      }

      // first registered user is an admin

      if (req.file) {
        image = await extractUrl(req.file);
      }
      const user = await User.create({
        username,
        memberShipType,
        vid,
        location,
        idNumber,
        IMEINumber,
        itcCenter,
        groupId,
        image: image,
        age: age,
      });
      // const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';
  
      // const tempOrigin = req.get('origin');
      // const protocol = req.protocol;
      // const host = req.get('host');
      // const forwardedHost = req.get('x-forwarded-host');
      // const forwardedProtocol = req.get('x-forwarded-proto');
  

      // send verification token back only while testing in postman!!!
      res.status(StatusCodes.CREATED).json({
        msg: 'Success! added user ',user
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    addUser
  }