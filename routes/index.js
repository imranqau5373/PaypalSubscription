var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
  'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/success', function(req, res, next) {
  paymentToken = req.query.token;

paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log("Billing Agreement Execute Response");
        console.log(JSON.stringify(billingAgreement));
    }
});
  res.json('success message');
});

router.post('/pay',function (req,res,next){
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhsot:3000",
        "cancel_url": "http://localhost:3000/success"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Red Sox",
                "sku": "001",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "This is the payment description."
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      console.log("Create Payment Response");
      console.log(payment);
      res.send('test working.')
  }
});

});




module.exports = router;
