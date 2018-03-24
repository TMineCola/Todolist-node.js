var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');

// firebase init
var admin = require("firebase-admin");

// firebase -> 專案設定 -> 服務帳戶 -> 產生私密金鑰 -> 修改下方路徑
var serviceAccount = require("./firebase_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nodejs-todolist-2d00f.firebaseio.com"
});

var dbRef = admin.database();

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
// 增加靜態檔案的路徑
app.use('/public', express.static('public'));

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// 首頁
app.get('/',function(req,res){
    dbRef.ref('todos').once('value', function(snapshot){
        var data = snapshot.val();
        // 將網頁Title及todos資料帶入
        res.render('index',{"title": "MyTodo", "todolist": data});
        console.log(data);
    });
});

// 新增
app.post('/add',function(req,res){
    var todo = req.body;
    var createRef = dbRef.ref('todos').push();
    createRef.set(todo)
    .then(function() {
        dbRef.ref('todos').once('value', function(snapshot){
            res.send({
                "success": true,
                "result": snapshot.val(),
                "message": "新增成功"
            });
        });
    });
});

// 刪除
app.post('/remove',function(req,res){
    var _id = req.body.id;
    dbRef.ref('todos').child(_id).remove()
    .then(function() {
        dbRef.ref('todos').once('value', function(snapshot){
            res.send({
                "success": true,
                "result": {"_id": _id},
                "message": "刪除成功"
            });
        });
    });
});

// 清空
app.put('/remove',function(req,res){
    dbRef.ref('todos').set({})
    .then(function() {
        dbRef.ref('todos').once('value', function(snapshot){
            res.send({
                "success": true,
                "result": snapshot.val(),
                "message": "清除成功"
            });
        });
    });
});

// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);