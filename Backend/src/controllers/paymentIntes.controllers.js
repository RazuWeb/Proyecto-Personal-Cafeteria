const paymentCtrl = {};
const querys = require('../database/querys')
const mysql2 = require('../database/mysql2')
const stripe = require('stripe')('sk_test_51KA2KGAuoyYpNXzKXqROlpAV3nzmS4mUuUcrNt7SjezNdro8dtnxDjInO1gQeHVzpdIoaVvBcs2QqmaO6Z9D3yzD00BLsGIqGb');

const getOrdenAmount = require('../data/getOrdenAmount');
const { json } = require('express');

paymentCtrl.postPyament = async (req, res) => {

  const  productItems  = Object.values(req.body)
  //console.log( productItems );
  console.log(productItems);

  
  let amount = 0;
  /* const resultado = await getOrdenAmount(productItems)
  console.log(resultado); */

  //OBTENER EL PRECIO DE LA BASE DE DATOS Y CALCULAR EL MONTO TOTAL
  let productoDB;
  for (i = 0; i < productItems.length; i++) {
    const item = productItems[i]
    console.log(item);

    
    productoDB = await new Promise(function (resolve, reject) {
      mysql2.query(querys.getOnlyOneProduct, [item.id], (err, rows) => {
        if (rows === undefined) {
          reject(new Error("Error rows is undefinide"))
        }
        else {
          
          resolve(rows[0]);
          
        }
      })
    })
    let operation = productoDB.precio * item.cantidad;
    amount += operation;
  }
  console.log(amount);
  
  let amountParce = amount.toString(10);
  let amountModific = amountParce + '00'
  let amountTotal = parseInt(amountModific)
 
  console.log(amountTotal);
  

  const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTotal,
      currency: 'mxn',
      payment_method_types: ['card'],
    }); 
 
  res.json({client_secret: paymentIntent.client_secret})

};


module.exports = paymentCtrl