import 'dotenv/config'
import app from './app.js'
import connectdb from './db/index.js'


connectdb()
.then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on Port: ${process.env.PORT}`);
    })

    console.log('MongoDB successfully Connected');
})
.catch((error)=>{
    console.log('Error in MongoDB connection', error);
});