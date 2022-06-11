const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
 
var Publishable_Key = "pk_test_51L5GPRB72RxX6rzlK6afpo2HPoxX7mn6vCmYxX2DJsf1waXC1w77NNolcupmmB2vp7l9k8dcjVz6I9BGJPuSVz2C00dPlD1TLO"
var Secret_Key = "sk_test_51L5GPRB72RxX6rzlZ28jB0ohk2GMhGywMQZMQLRnfBJ51W8oUUqZAvVb60dlemEcXVr51Rt5hjqq9NRatUiWtttx00eutJsVyW"
 
const stripe = require('stripe')(Secret_Key)
 
const port = process.env.PORT || 3000
 
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
 
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
 
app.get('/', function(req, res){
    res.render('Home', {
    key: Publishable_Key
    })
})
 
app.post('/payment', function(req, res){
 
    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Rabbit Mart',
        address: {
            line1: 'German International University',
            postal_code: '110092',
            city: 'Nasr City',
            state: 'Cairo',
            country: 'Egypt',
        }
    })
    .then((customer) => {
 
        return stripe.charges.create({
            amount: 7000,    
            description: 'Product Checkout',
            currency: 'USD',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Success") // If no error occurs
    })
    .catch((err) => {
        res.send(err)    // If some error occurs
    });
})
 
app.listen(port, function(error){
    if(error) throw error
    console.log("Server created Successfully")
})