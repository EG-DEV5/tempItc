/** @format */

const sendPasswordMessage = (password, name) => {
  return `
<div
  class="container"
  style="max-width: 90%; margin: auto; padding-top: 20px"
>
  <h2>Welcome to ITC.</h2>
  <h4>You are officially In ✔</h4>
  <p style="margin-bottom: 30px;">Your password account is </p>
  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${password}</h1>
  <p style="margin-bottom: 30px;">Your username  is </p>
  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${name}</h1>
</div>
`
}

module.exports = { sendPasswordMessage }
