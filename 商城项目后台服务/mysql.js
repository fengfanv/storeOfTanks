const fs = require('fs');
const mysql = require('mysql');
/**
用户mysql配置文件user-mysql-config.json

{
    host     : '192.168.1.1',//服务地址
    user     : 'root',//mysql用户名
    password : 'root',//mysql摩玛
	port: '3306',//端口号
    database : 'store'//库名
}
*/
// 用户mysql配置
var userMysqlConfig = null;
// 创建 mysql 连接池资源
var pool = null;
fs.readFile("user-mysql-config.json", 'utf8', function (err, data) {
	if (err) {
	    throw "读取user-mysql-config.json文件错误！  解决方法：在同级目录下创建该文件并在新创建的文件内写入 “mysql.js” 文件中 “用户mysql配置文件user-mysql-config.json” 的注释内容";
	}
	userMysqlConfig = JSON.parse(data);
	pool = mysql.createPool(userMysqlConfig);
	//console.log(userMysqlConfig);
});

exports.query = function(sql, arr, callback){
    // 建立链接
    pool.getConnection(function(err,connection){
        if(err){
            //console.log(err);
            callback && callback(err);
            return false;
        }
        connection.query(sql,arr,function(error,results,fields){
			// Results代表是查询的结果，如果是插入修改等操作，则返回影响数据库信息的对象
			// fields代表查询的字段信息
			
            // 将链接返回到连接池中
            connection.release();
            if(error){
                //console.log(error);
                callback && callback(error);
                return false;
            } 
            // 执行回调
            callback && callback(error,results,fields);
        });
    });
};

//使用案例
/*
var sql = 'SELECT * FROM user where account = ?;
var account = 'xiaowang'
mysql.query(sql,account,function(err, result){
	if(err){
		console.log('[SELECT ERROR] - ',err.message);
		return;
	}
    //console.log(result);
});
*/