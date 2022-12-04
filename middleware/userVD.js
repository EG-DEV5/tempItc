const { body, param, query } = require("express-validator");

exports.userValaidationAdd = [
  body("UserName")
    .notEmpty()
    .withMessage('{"enMessage" : "UserName is required", "arMessage" :"اسم المستخدم مطلوب"}'),
  body("Email")
    .notEmpty()
    .withMessage('{"enMessage" : "Email is required", "arMessage" :"البريد الإلكترونى مطلوب"}'),
  body("PhoneNumber")
    .notEmpty()
    .withMessage('{"enMessage" : "PhoneNumber is required", "arMessage" :"رقم الهاتف مطلوب"}'),
  body("Password")
    .notEmpty()
    .withMessage('{"enMessage" : "Password is required", "arMessage" :"كلمة السر مطلوبة"}'),
    body("Country")
    .notEmpty()
    .withMessage('{"enMessage" : "Country is required", "arMessage" :"يرجى إدخال البلد"}'),
    body("CompanyName")
    .optional()
    .isString()
    .withMessage('{"enMessage" : "CompanyName must be string", "arMessage" :"اسم الشركة يجب ان يكون نص"}'),
]