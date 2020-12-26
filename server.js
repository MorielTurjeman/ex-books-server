const express= require("express");
const logger=require("morgan");
const app=express();
const port=process.env.PORT||3000;

const {reviewRouter}= require("./routers/reviewRouter");


app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods','POST, PUT, GET, DELETE, OPTIONS')
    res.set('Content-Type', 'application/json');
    next();
});

app.use((req, res, next) =>{
    //login simulation
    req.user_id = '5fe7601e77765782e215f29d'
    next()
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger("combined")); 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});

app.use("/api/reviews", reviewRouter);

app.listen(port, () => console.log('Express server is running on port ', port));