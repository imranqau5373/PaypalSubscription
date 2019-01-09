var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AXxtAiKMnbQAmDO6FrgO48UJ0oCGbqdI_bsHpfqHSJXSrTaVpPMjnJwQMuWeBCC4dzOlrHg5IFCNCL3k',
  'client_secret': 'EBmFQoh3gJcIxDjxAO6tQdWtDiraxNWFWjPEXGBfkE8Ht9WAlkq-RkGcPVt2wKyuFIUO4gVnuZQYyvFS'
});







module.exports = paypal;