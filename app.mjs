import express from 'express';
import morgan from 'morgan';
import cors from "cors";
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:secret654321@cluster0.yv3bv.mongodb.net/posDB?retryWrites=true&w=majority');
const Contact = mongoose.model('Contact', {
  name: String,
  email: String,
  //address: String
});

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('short'))

app.use((req, res, next) => {
  console.log("a request came", req.body);
  next()
})

app.get('/contacts', (req, res) => {

  Contact.find({}, (err, contacts) => {
    if (!err) {
      res.send(contacts)
    } else {
      res.status(500).send("error happened")
    }
  })


})
app.get('/contact/:id', (req, res) => {

  Contact.findOne({ _id: req.params.id }, (err, contact) => {
    if (!err) {
      res.send(contact)
    } else {
      res.status(500).send("error happened")
    }
  })

})
app.post('/contact', (req, res) => {

  if (!req.body.name || !req.body.email) {
    res.status(400).send("invalid data");
  } else {
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      //address: req.body.address
    });
    
    newContact.save().then(res.send(newContact))
  }
})
app.put('/contact/:id', (req, res) => {
  let updateObj = {}

  if (req.body.name) {
    updateObj.name = req.body.name
  }
  if (req.body.email) {
    updateObj.email = req.body.email
  }
//   if (req.body.address) {
//     updateObj.address = req.body.address
//   }

Contact.findByIdAndUpdate(req.params.id, updateObj, { new: true },
    (err, data) => {
      if (!err) {
        res.send(data)
      } else {
        res.status(500).send("error happened")
      }
    })
})
app.delete('/contact/:id', (req, res) => {

Contact.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) {
      res.send("contact deleted")
    } else {
      res.status(500).send("error happened")
    }
  })
})

app.get('/home', (req, res) => {
  res.send('here is your home')
})
app.get('/', (req, res) => {
  res.send('Hi I am a hello world Server program')
})

app.listen(port, () => {
  console.log(`App is runing at http://localhost:${port}`)
})
