require('dotenv').config()
const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 

var Publishable_Key = process.env.PKEY
var Secret_Key =  process.env.SKEY


const stripe = require('stripe')(Secret_Key) 

// const stripe = require('stripe')('sk_test_51MmWOMSDNUpwLZAm1vVI5oA4IOUudh6LoKDuwg98yeIgS1KtySoZDF3czYyRipmyebN7XgMMYkbiqigLxHEGr3nq00mK3HZKBN');

// const paymentIntent = await stripe.paymentIntents.create({
//   amount: 2000,
//   currency: 'usd',
//   automatic_payment_methods: {enabled: true},
// });

const port = process.env.PORT || 8000 

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
		name: 'Shubham Shinde', 
		address: { 
			line1: '18/8 And nagar Dhule', 
			postal_code: '110092', 
			city: ' Dhule', 
			state: 'Maharashtra', 
			country: 'India', 
		} 
	}) 
	.then((customer) => { 

		return stripe.paymentIntents.create({ 
			amount: 7000,	 
			description: 'Web Development Product', 
			currency: 'INR', 
			automatic_payment_methods: {enabled: true},

			customer: customer.id 
		}); 
		
	}) 
	.then((charge) => { 
		res.send("Success") // If no error occurs 
	}) 
	.catch((err) => { 
		res.send(err)	 // If some error occurs 
	}); 
})

app.listen(port, function(error){ 
	if(error) throw error 
	console.log("Server created Successfully") 
}) 