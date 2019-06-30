const express = require('express');
const bodyParse = require('body-parser');
const cookieParse = require('cookie-parser');


const app = express();
app.use(bodyParse.urlencoded({extended:false}));
app.use(express.static('./www'));
app.use(cookieParse());

let sql = [
    {
        user:'zfpx',
        pass:'zfpx'
    },
    {
        user:'nizp',
        pass:'nizp'
    }
];

let SESSIONId = 'ZF';
let session = {};

app.post('/login',(req,res,next)=>{
    console.log(req.body);
    let user = sql.find(item=>item.user === req.body.user && item.pass === req.body.pass)
    if(user){
        let cardId = Date.now();
        res.cookie(SESSIONId,cardId,{httpOnly:false});
        /*
            {
                32131321:{user:{user:,pass}}
            }
            http://localhost/welcome?type=<script>document.write('<a href="a">跳转</a>')</script>
        */
        session[cardId] = {user};
        res.json({
            code:0,
            msg:'成功'
        })
    }else{
        res.json({
            code:1,
            msg:'失败'
        })
    }
});

let ary = [
    {
        val:'好好好'
    }
]

app.post('/list',(req,res)=> {
    console.log('req', req)
    //说明刚才来过
    if(session[req.cookies[SESSIONId]]){
        ary.unshift({
            val:req.body.val
        })
        res.json({
            code:0,
            msg:ary
        })
    }else{
        res.json({
            code:1,
            mas:'失败'
        })
    }
    // signedCookies
})

app.get('/welcome',(req,res)=>{
    let {type} = req.query;
    res.send(encodeURI(type));
})

app.listen(8080);
