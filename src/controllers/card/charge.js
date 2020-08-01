const { Card } = require('../../models/card');
// const { Bank } = require('../../models/bank');
const Joi = require('joi');
const { Schema } = require('mongoose');


async function charage(req, res) {

    const card = await Card.findOne({ cardHolder : req.user._id});
    // const bank = await Bank.findOne({ name : "DN-Wallet" });
    
    if(!card) return res.status(400).json({ "error" : "User have no Card" });
    
    if(req.body.amount <= 0) return res.status(400).json({ "error" : "amount can't be 0 or negative number"});

    const found = card.balance.find(balance => balance.currency_code == req.body.currency_code);
    if (!found) {
        const balance = {
            amount: req.body.amount,
            currency_code: req.body.currency_code
        }

        card.balance.unshift(balance);
    } else {

        found.amount += req.body.amount;
    }

    await card.save();

    console.log(card);
    return res.status(200).json(card);
}

function validate(req){
    const schema = {
        amount: Joi.number().required(),
        currency_code: Joi.string().valid('EGP', 'USD', 'EUR', 'JPY', 'SAR').required()
    }
    return Joi.validate(req, schema);
}

module.exports = charage;