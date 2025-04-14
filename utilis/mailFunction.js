const {getTransporter} = require("../config/nodeMailer");
const { createAccount } = require("../mailTemplates/createAccount");
const { loginAccount } = require("../mailTemplates/loginAccount");
const { orderConfirmation } = require("../mailTemplates/placeOrder");

const sendEmail = async ( email,options= {}, mailFunctionId, subject) => {
  const transporter = await getTransporter()
  const getHtmlMailGenrator = await sendCreateAccountMail(options, mailFunctionId);
    try {
      await transporter.sendMail({
        from: process.env.EMAIL || "knowledgestore25@gmail.com",
        to: email,
        subject,
        html: getHtmlMailGenrator,
      });
      return true;
    } catch (error) {
      console.error("error sending mail", error.message);
      return false
    }
  };

const sendCreateAccountMail = async (options, id)=>{
  if(id == 1){
    const template = await createAccount(options);
    return template
  }else if(id == 2){
    const template =  await loginAccount(options);
    return template
  }else if(id == 3){
    const template =  await orderConfirmation(options);
    return template
  }
}  

module.exports.sendEmail = sendEmail;