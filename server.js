const app=require('express')();
const server=require('http').createServer(app);
const socketIo=require('socket.io')
const io=socketIo(server)
const path=require('path');
const { on } = require('process');

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html')
})

let online=[]
io.on('connection',function(socket){
    
    socket.on('login',(data)=>{
        socket.username=data.username
           online.push(data.username)
            socket.emit('online',online);
           console.log('user is login'+ data.username);
           socket.broadcast.emit('login',{msg:`${data.username} is login`})
          
           
    })
   
    socket.on('sendMassege',(data)=>{
        socket.broadcast.emit('redirect',data)
        console.log(online);
        
    })


    socket.on('disconnect',(data)=>{
        console.log('user is disconnected');
       console.log( socket.username);
       for(let i=0;i<online.length;i++){
           if(socket.username===online[i]){
               online.splice(i,1)
           }
       }
       socket.broadcast.emit('online',online);
       
       
        
    })
})
server.listen(3000,function(err){
    if(err){
        console.log(err);
        
    }else{
        console.log('server is running port 3000');
        
    }
})