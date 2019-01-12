var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXxtAiKMnbQAmDO6FrgO48UJ0oCGbqdI_bsHpfqHSJXSrTaVpPMjnJwQMuWeBCC4dzOlrHg5IFCNCL3k',
  'client_secret': 'EBmFQoh3gJcIxDjxAO6tQdWtDiraxNWFWjPEXGBfkE8Ht9WAlkq-RkGcPVt2wKyuFIUO4gVnuZQYyvFS'
});

var isoDate = new Date();
isoDate.setMonth(isoDate.getMonth() + 1);
isoDate.toISOString().slice(0, 19) + 'Z';

var billingPlanAttributes = {
    "description": "Create Plan for Regular",
    "merchant_preferences": {
        "auto_bill_amount": "yes",
        //"cancel_url": "http://localhost:3000/cancelSub",
        "cancel_url": "https://paypalsub.herokuapp.com/cancelSub/billId",
        "initial_fail_amount_action": "continue",
        "max_fail_attempts": "1",
        "return_url": "https://paypalsub.herokuapp.com/success",
        //"return_url": "http://localhost:3000/success",
        "setup_fee": {
            "currency": "USD",
            "value": "10"
        }
    },
    "name": "Testing1-Regular1",
    "payment_definitions": [
        {
            "amount": {
                "currency": "USD",
                "value": "10"
            },
            "charge_models": [],
            "cycles": "0",
            "frequency": "MONTH",
            "frequency_interval": "1",
            "name": "Regular 1",
            "type": "REGULAR"
        }
    ],
    "type": "INFINITE"
};

var billingPlanUpdateAttributes = [
    {
        "op": "replace",
        "path": "/",
        "value": {
            "state": "ACTIVE"
        }
    }
];

var billingAgreementAttributes = {
    "name": "Fast Speed Agreement",
    "description": "Agreement for Fast Speed Plan",
    "start_date": isoDate,
    "plan": {
        "id": ""
    },
    "payer": {
        "payment_method": "paypal"
    },
    "shipping_address": {
        "line1": "StayBr111idge Suites",
        "line2": "Cro12ok Street",
        "city": "San Jose",
        "state": "CA",
        "postal_code": "95112",
        "country_code": "US"
    }
};

// Create the billing plan


router.post('/', function(req, res) {
    paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            console.log("Create Billing Plan Response");
            console.log(billingPlan);
            //res.json('billing return');
    
            // Activate the plan by changing status to Active
            paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    console.log("Billing Plan state changed to " + billingPlan.state);
                    console.log("Billing Plan id is " + billingPlan.id);

                    billingAgreementAttributes.plan.id = billingPlan.id;
    
                    // Use activated billing plan to create agreement
                    paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
                        if (error) {
                            console.log(error);
                            throw error;
                        } else {
                            console.log("Create Billing Agreement Response");
                            //console.log(billingAgreement);
                            let redirectUrl = '';
                            for (var index = 0; index < billingAgreement.links.length; index++) {
                                if (billingAgreement.links[index].rel === 'approval_url') {
                                    var approval_url = billingAgreement.links[index].href;
                                    console.log("For approving subscription via Paypal, first redirect user to");
                                    console.log(approval_url);
                                    redirectUrl = approval_url;


                                    // See billing_agreements/execute.js to see example for executing agreement 
                                    // after you have payment token
                                }
                            }
                            res.redirect(redirectUrl)
                        }
                    });
                }
            });
        }
    });
  });


  


  
  module.exports = router;


