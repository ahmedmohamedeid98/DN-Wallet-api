const config = require('config');
const twilio = require("twilio")(config.get('twilio-account_sid'), config.get('twilio-auth_token'));
const { User } = require('../../models/user');

async function codeCheck(req, res){
    const code = req.body.code;
    let verificationResult;

    const phoneNumber = req.body.phoneNumber;
    if (phoneNumber[0] !== '+') return res.status(400).json('You should send country code');

    try{
        verificationResult = await twilio.verify.services(config.get('twilio-service_id'))
                                        .verificationChecks
                                        .create({
                                            code ,
                                            to : phoneNumber
                                        });
    }catch(err) {
        return res.status(400).json({ "error": err })
    }
    
    if (verificationResult.status === 'approved'){
        
        let user = await User.findById(req.user._id);
        user.phone = phoneNumber;
        user.userIsValidate = true;
        await user.save();
        console.log(user);
        return res.status(200).json({ "Verified": verificationResult.status });
    }

    return res.status(400).json('someThing went wrong');
}

module.exports = codeCheck;