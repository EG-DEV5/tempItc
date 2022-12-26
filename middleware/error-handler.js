/** @format */

const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  try {
    var mesObject = JSON.parse(err.message);
  } catch (error) {
    next(error);
  }
  let customError = {
    // set default
    statusCode:
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR || err.status,

    msg: {
      enMessage: mesObject?.enMessage || 'Something went wrong try again later',
      arMessage: mesObject?.arMessage || 'حدث خطأ ما ، برجاء المحاولة مرة اخرى',
    },
  };
  if (err.name === 'ValidationError') {
    customError.msg.enMessage = `there is an error in your data ${err.message} `;
    customError.msg.arMessage = `هناك خطأ فى القيمة التى أدخلتها برجاء المحاولة مرة أخرى`;
    customError.statusCode = 400;
  }
  if (err.name === 'validError') {
    // if(typeof err.message === "string"){
    //   err.message = '{"enMessage" : "please fill all fields", "arMessage" :"من فضلك ادخل جميع البيانات"}'
    //   const mesObject = JSON.parse(err.message)
    //   customError.msg.enMessage = mesObject.enMessage
    //   customError.msg.arMessage = mesObject.arMessage
    //   customError.statusCode = err.status
    // }
    const error = err.message.split('  ');
    const str = [];
    if (error.length - 1 !== 1) {
      for (let index = 0; index < error.length - 1; index++) {
        const mesObject = JSON.parse(error[index]);
        str.push(mesObject.enMessage.split(' ')[0]);
        customError.msg.arMessage = mesObject.arMessage;
      }

      customError.msg.enMessage = `${str.join(',')} are required`;
      customError.msg.arMessage = `من فضلك ادخل جميع البيانات`;
      customError.statusCode = err.status;
    } else {
      const mesObject = JSON.parse(err.message);
      customError.msg.arMessage = mesObject.arMessage;
      customError.msg.enMessage = mesObject.enMessage;
      customError.statusCode = err.status;
    }
  }
  if (err.code && err.code === 11000) {
    customError.msg.enMessage = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.msg.arMessage = `أدخلت قيمة مكررة للحقل ، يرجى اختيار قيمة أخرى`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.enMessage = `No item found with id : ${err.value}`;
    customError.msg.arMessage = `${err.value} لم يتم العثور على عنصر `;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({
    enMessage: customError.msg.enMessage,
    arMessage: customError.msg.arMessage,
  });
};

module.exports = errorHandlerMiddleware;
