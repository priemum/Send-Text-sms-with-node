const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const Nexmo=require('nexmo')
const socketio=require('socket.io')


//Init app with express

const app=express() 

//init nexmo

const nexmo=new Nexmo({
apiKey:'15716a66',
apiSecret:'PQdIentQ19lI7rlC'
}, {debug:true})

//Template engine setup
app.set('view engine', 'html')
 app.engine('html', ejs.renderFile)


 //Public folder setup
 app.use(express.static(__dirname+'/public'))


 //Body parser middleware
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({extended:true}))

//index route
app.get('/',(req, res)=>{
    res.render('index')
})

//Catch form submit
app.post('/', (req, res)=>{
// res.send(req.body)
// console.log(req.body)

const number= req.body.number
const text= req.body.text

nexmo.message.sendSms(
    'Vonage APIs', number, text, {type:'unicode'},
    (err, res)=>{
        if(err){
            console.log(err)
        }else{
            console.dir(res)
            //Get data from the response

            const data= {
                id:res.messages[0]['message-id'],
                number: res.messages[0]['to']
            }

            //Emit to the client

            io.emit('smsStatus', data)
        }
    }
)
})
 //define port
 const port=5000

 //Start server

 const server= app.listen(port, ()=>{
     console.log(`server started on port ${port}`)
 })

 //Connect to secket.io
 const io=socketio(server)
 io.on('connection', (socket)=>{
     console.log('Connected')
     io.on('Disconnect', ()=>{
         console.log('Disconnected')
     })
 })
