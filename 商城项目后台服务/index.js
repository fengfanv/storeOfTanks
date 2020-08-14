const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');
const mysql = require('./mysql');
const parse = require('./praseFormData');

const PUBLIC_PATH = path.join(__dirname, "/\public\/");//项目地址
http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;
    console.log(pathname)
    let file_address = path.join(PUBLIC_PATH, decodeURI(pathname));
    fs.stat(file_address, function (err, stat) {
        if (err) {
            if (pathname.indexOf('/api') != -1) {
                //接口
                //console.log(request.method)
                if (pathname === '/api/addproduct' && request.method == 'POST') {
                    //添加产品
                    API_addProduct(request, response);
                } else if (pathname === '/api/getproduct' && request.method == 'GET') {
                    //获取所有产品
                    API_getProduct(request, response);
                } else if (pathname === '/api/setguige' && request.method == 'POST') {
                    //设置某个产品的规格
                    API_setGuige(request, response);
                } else if (pathname === '/api/setguigedapei' && request.method == 'POST') {
                    //设置某个产品的规格搭配
                    API_setGuigedapei(request, response);
                } else if (pathname === '/api/getguigedapei' && request.method == 'GET') {
                    //获取某个产品的规格搭配
                    API_getGuigedapei(request, response);
                } else if (pathname === '/api/delguigedapei' && request.method == 'POST') {
                    //删除某个产品的所有规格搭配
                    API_delGuigedapei(request, response);
                } else if (pathname === '/api/modifyguigedapei' && request.method == 'POST') {
                    //修改某个规格搭配的值
                    API_modifyGuigedapei(request, response);
                } else if (pathname === '/api/login' && request.method == 'POST') {
                    //登录账号
                    API_login(request, response);
                } else if (pathname === '/api/createorder' && request.method == 'POST') {
                    //创建订单
                    API_createOrder(request, response);
                } else if (pathname === '/api/getorder' && request.method == 'GET') {
                    //查询订单
                    API_getOrder(request, response);
                } else if (pathname === '/api/getallorder' && request.method == 'GET') {
                    //查询所有订单
                    API_getAllOrder(request, response);
                } else if (pathname === '/api/setorderstatus' && request.method == 'POST') {
                    //修改订单状态
                    API_setOrderStatus(request, response);
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                    response.end(pathname);
                }

            } else {
                response.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' })
                response.end('状态：404，没有这样的文件或目录！');
                //console.log(err);
            }
        } else {
            let file_type = pathname.split('.')[1];
            let MIME = ''
            if (file_type == 'html' || file_type == 'htm') {
                MIME = 'text/html;charset=utf-8'
            } else if (file_type == 'css') {
                MIME = 'text/css;charset=utf-8'
            } else if (file_type == 'js') {
                MIME = 'text/javascript;charset=utf-8'
            } else if (file_type == 'png') {
                MIME = 'image/png;charset=utf-8'
            } else if (file_type == 'jpg' || file_type == 'jpeg') {
                MIME = 'image/jpeg;charset=utf-8'
            }
            fs.readFile(file_address, function (err, fileData) {
                if (err) {
                    console.log(err);
                }
                response.writeHead(200, { 'Content-Type': MIME })
                response.end(fileData);
            })
        }
    })
}).listen(8080, function () {
    console.log('端口：8080，启动成功！');
});

//接收post数据
function parsePostData(ctx) {
    return new Promise(function (resolve, reject) {
        try {
            var postdata = "";
            ctx.on('data', function (data) {
                postdata += data;

            })
            ctx.on('end', function () {
                //console.log(querystring.parse(postdata));
                resolve(querystring.parse(postdata));
            })
        } catch (err) {
            reject('接收普通post数据失败！');
            console.log(err);
        }
    })
}

//添加产品方法
function API_addProduct(reqest, response) {

    parse.parseFormData(reqest, {
        "storageFilePath": __dirname + '/public/images',//文件存放到哪里
        "renameFileName": false,//是否重命名文件
    }, function (data) {

        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        var sql = 'insert into product (name,icon,swiper,detailed,text) values (?,?,?,?,?)';
        var params = [data.name.data, '/images/' + data.iconImage.filename, JSON.stringify(['/images/' + data.swiperImage.filename]), data.detailed.data, data.miaoshu.data];

        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                response.end(JSON.stringify({ status: false, message: '数据插入数据库错误！' }));
                return false;
            }
            //console.log(result);
            response.end(JSON.stringify({ status: true, message: '数据插入数据库成功！' }));
        });

    }, function (err) {
        response.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
        response.end(`<html>
            <head></head>
            <body>
                ${JSON.stringify(err)}
            </body>
        </html>`);
    });

    // parsePostData(reqest).then(function(data){
    //     response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
    //     response.end(JSON.stringify(data));
    // }).catch(function(){
    //     response.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    //     response.end('接收失败');
    // });

}

//查询product表，查找所有产品,查找某个产品
function searchProduct(id, callbackSuccess, callbackError) {
    var sql = 'select * from product';
    var params = [];
    if (id != null) {
        sql = 'select * from product where id=?';//这句话不管用？
        params = id;
    }
    mysql.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            callbackError && callbackError(err.message);
            return false;
        }
        let list = JSON.parse(JSON.stringify(result));
        let len = list.length;
        for (let i = 0; i < len; i++) {
            let detailed = JSON.parse(list[i].detailed);
            list[i].swiper = JSON.parse(list[i].swiper);
            list[i].nation = detailed.guojia;
            delete detailed.guojia;
            list[i].level = detailed.jibie;
            delete detailed.jibie;
            list[i].vehicleType = detailed.leixing;
            delete detailed.leixing;
            list[i].detailed = detailed;
            if (i === len - 1) {
                callbackSuccess && callbackSuccess(list)
            }
        };
        //console.log(result);
    });
}
// searchProduct([14/null],function (data) {
//     console.log(data)
// }, function (err) {
//     console.log(err)
// });

//获取所有产品
function API_getProduct(reqest, response) {
    searchProduct(null, function (data) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": true,
            data: data
        }));
    }, function (err) {
        console.log(err)
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "从数据库获取数据错误！",
            "error": err
        }));
    });
}

//设置某产品的规格
function API_setGuige(reqest, response) {
    parsePostData(reqest).then(function (data) {//这里有问题
        var sql = 'update product set specifications=? where id=?';
        var params = [data.value, data.id];
        if (data.value === 'empty') {
            sql = 'update product set specifications=NULL where id=?';
            params = [data.id];
        };
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库更新数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
            response.end(JSON.stringify({
                "status": true,
                "message": "数据库更新数据成功！"
            }));
            //console.log(result);
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//设置某产品的规格搭配
function API_setGuigedapei(reqest, response) {
    parsePostData(reqest).then(function (data) {//这里有问题
        let guigedaipei = JSON.parse(data.guigedapei);
        var sql = 'insert into specifications (product_id,name,price,number) values ';
        guigedaipei.forEach(element => {
            sql += `(${data.productId},'${element.difference}',${element.price},${element.stock}),`;
        });
        sql = sql.slice(0, -1);
        var params = [];
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库添加数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
            response.end(JSON.stringify({
                "status": true,
                "message": "数据库添加数据成功！"
            }));
            //console.log(result);
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//查询spceifications表，查找产品的规格搭配
function searchSpecifications(id, callbackSuccess, callbackError) {
    var sql = 'select * from specifications where product_id=?';
    var params = [id];
    mysql.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            callbackError && callbackError(err.message);
            return false;
        }
        let list = JSON.parse(JSON.stringify(result));
        // let len = list.length;
        let newarr = [];
        list.forEach(function (item, index) {
            newarr.push({
                id: item.id,
                product_id: item.product_id,
                difference: item.name,
                price: item.price,
                stock: item.number
            });
        });
        callbackSuccess && callbackSuccess(newarr);
        //console.log(result);
    });
}

//获取产品规格搭配
function API_getGuigedapei(reqest, response) {
    let data = querystring.parse(reqest.url.split('?')[1]);
    searchSpecifications(data.productId, function (res) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": true,
            data: res
        }));
    }, function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "从数据库获取数据错误！",
            "error": err
        }));
    })
}

//删除某个产品所有规格搭配
function API_delGuigedapei(reqest, response) {
    parsePostData(reqest).then(function (data) {//这里有问题
        var sql = 'delete from specifications where product_id=?';
        var params = [data.productId];
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库删除数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
            response.end(JSON.stringify({
                "status": true,
                "message": "数据库删除数据成功！"
            }));
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//修改某个规格搭配的值
function API_modifyGuigedapei(reqest, response) {
    parsePostData(reqest).then(function (data) {//这里有问题
        var sql = `update specifications set ${data.key === 'stock' ? 'number' : 'price'}=? where id=?`;
        var params = [data.value, data.id];
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库修改数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
            response.end(JSON.stringify({
                "status": true,
                "message": "数据库修改数据成功！"
            }));
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//登录账号，返回用户id
function API_login(reqest, response) {
    parsePostData(reqest).then(function (data) {
        var sql = `select id from user where account=? and password=?`;
        var params = [data.account, data.password];
        console.log(data);
        console.log(params);
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库查询数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            console.log(result);
            if (result.length > 0) {
                response.end(JSON.stringify({
                    "status": true,
                    "data": result[0],
                    "message": "登录成功！"
                }));
            } else {
                response.end(JSON.stringify({
                    "status": false,
                    "data": null,
                    "message": "登录失败，请检查账号或密码是否正确！"
                }));
            }
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });

        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//创建订单，返回订单id
function API_createOrder(reqest, response) {
    parsePostData(reqest).then(function (data) {
        var sql = `insert into product_order (user_id,create_time,product_list,price,status) values (?,?,?,?,?)`;
        var params = [data.userId, data.createTime, data.productList, data.price, data.status];
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库插入数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            //console.log(result);
            response.end(JSON.stringify({
                "status": true,
                "data": result,
                "message": "数据库插入数据成功！"
            }));
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}

//查询用户订单表
function searchProductOrder(userId, callbackSuccess, callbackError) {
    var sql = `select user.account,product_order.id,user_id,create_time,product_list,price,status from product_order,user where user.id=product_order.user_id;`;
    var params = [];
    if (userId != undefined || userId != null) {
        sql = `select * from product_order where user_id=?`;
        params.push(userId);
    }
    mysql.query(sql, params, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            callbackError && callbackError(err.message);
            return false;
        }
        callbackSuccess && callbackSuccess(result);
    });
}


//查询用户订单
function API_getOrder(reqest, response) {
    let data = querystring.parse(reqest.url.split('?')[1]);
    if (data.userId) {
        searchProductOrder(data.userId, function (res) {
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            //console.log(result);
            response.end(JSON.stringify({
                "status": true,
                "data": res,
                "message": "数据库查询数据成功！"
            }));

        }, function (err) {
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
            response.end(JSON.stringify({
                "status": false,
                "message": "数据库查询数据错误！",
                "error": err
            }));
        });
    } else {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        response.end(JSON.stringify({
            "status": false,
            "message": "接收数据失败！"
        }));
    }
}

//查询所有订单
function API_getAllOrder(reqest, response) {
    searchProductOrder(null, function (res) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
        //console.log(result);
        response.end(JSON.stringify({
            "status": true,
            "data": res,
            "message": "数据库查询数据成功！"
        }));

    }, function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据库查询数据错误！",
            "error": err
        }));
    });
}

//修改订单状态
function API_setOrderStatus(reqest, response) {
    parsePostData(reqest).then(function (data) {
        var sql = `update product_order set status=? where id=?`;
        var params = [data.status, data.id];
        mysql.query(sql, params, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
                response.end(JSON.stringify({
                    "status": false,
                    "message": "数据库更新数据出现错误！",
                    "error": err
                }));
                return false;
            }
            response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            //console.log(result);
            response.end(JSON.stringify({
                "status": true,
                "data": result,
                "message": "数据库更新数据成功！"
            }));
        });
    }).catch(function (err) {
        response.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' })
        response.end(JSON.stringify({
            "status": false,
            "message": "数据接收失败！",
            "error": err
        }));
    })
}