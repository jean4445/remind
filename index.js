var express = require('express');
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var cool = require('cool-ascii-faces');
var app = express();
var md5 = require('md5');
var mongodbURL='mongodb://mkidsc1603:uiert1603@ds055722.mlab.com:55722/userdatadb';
var myDB;



mongodb.MongoClient.connect(mongodbURL, function(err,db) {
	if(err){
		console.log(err);
	}else{
		myDB = db;
		console.log('connection success');
	}
});


app.get('/cool', function(request, response) {
  response.send(cool());
});


//新增使用者
app.get('/api/insert',function(request,response){
	var item={
		name:request.query.name,
		account:request.query.account,
		password:md5(request.query.password),
		birthday:request.query.bitrhday,
		cm:request.query.cm,
		kg:request.query.kg,
		email:request.query.email,
		phone:request.query.phone,
		sex:request.query.sex,
		regid:request.query.regid,
		time:request.query.time
	}
	var collection=myDB.collection('member');
	collection.insert(item,function(err,result){
	if(err){
		response.status(406).send(err).end();
		}else{
			response.type('application/json');
			response.status(200).send(result).end();
		}
	
	});
});
//檢查帳號
app.get('/api/checkaccount', function(request, response) {
	var item = {
	 account : request.query.account
	}
	var collection = myDB.collection('member');
	collection.find({account: request.query.account} , {_id:0 , account:1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			var jsArray = new Array();
            var jsArray = docs; 
            var docs2 = []; 
            for(var i = 0; i < jsArray.length; i++){
                var jsObj = Object();
                var jsObj = jsArray[i];
            if(jsObj.account != " " && jsObj.account !=""){
					docs2 += jsObj.account;
                }
                }  
 
             if(docs2.length == 0)
             { 

            st = [{
            	account : "0"
            }]
            response.type('application/json');
			response.status(200).send(st).end();
			
             }
           
             else{
             	st2 = [{
             		account : "1"
             	}]
			        response.type('application/json');
			        response.status(200).send(st2).end();
                 }
		}
	});
});
//回傳密碼比對，若成功登入將UID、名稱紀錄起來
app.get('/api/query', function(request, response) {
	var item = {
	account : request.query.account,
	password : md5(request.query.password),
	name : request.query.name
	}
	var collection = myDB.collection('member');
	collection.find({account : request.query.account}, {password: 1, _id: 1, name: 1}).toArray(function(err, docs) {
		if (err) {
			response.status(406).send(err).end();
		} else {
			response.type('application/json');
			response.status(200).send(docs).end();
		}
	});
});
//搜尋使用者資料
app.get('/api/searchdata', function(request, response) {
      var collection = myDB.collection('member');
      collection.find({}).toArray(function(err, docs) {
      if (err) {
          response.status(406).end();
       } else {
         response.type('application/json');
         response.status(200).send(docs);
         response.end();
       }
   });
});

//新增提醒
app.get('/api/addremind',function(request,response){
	var item={
		eventname:request.query.eventname,
		eventdate:request.query.eventdate,
		eventtime:request.query.eventtime
	}
	var collection=myDB.collection('remind');
	collection.insert(item,function(err,result){
	if(err){
		response.status(406).send(err).end();
		}else{
			response.type('application/json');
			response.status(200).send(result).end();
		}
	
	});
});

//搜尋提醒資料
app.get('/api/searchreminddata', function(request, response) {
      var collection = myDB.collection('remind');
      collection.find({}).toArray(function(err, docs) {
      if (err) {
          response.status(406).end();
       } else {
         response.type('application/json');
         response.status(200).send(docs);
         response.end();
       }
   });
});
app.listen(process.env.PORT||5000);