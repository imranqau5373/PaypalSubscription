var express = require('express');
var router = express.Router();
var paypalObj = require('../config/settings');


router.get('/',function(req,res){
    var billingAgreementId = req.query.billId;//"I-08413VDRU6DE";
    console.log(billingAgreementId)

var cancel_note = {
    "note": "Canceling the agreement"
};

    paypalObj.billingAgreement.cancel(billingAgreementId, cancel_note, function (error, response) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log("Cancel Billing Agreement Response");
            console.log(response);

            paypalObj.billingAgreement.get(billingAgreementId, function (error, billingAgreement) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(billingAgreement.state);
                }
            });
        }
    });

});

module.exports = router;