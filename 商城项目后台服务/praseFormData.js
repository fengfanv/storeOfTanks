
const fs = require('fs');

exports.parseFormData = function (ctx, configdata, callbackSuccess, callbackError) {
    ctx.setEncoding('base64');
    try {
        var postdata = "";
        ctx.on('data', function (data) {
            postdata += data;
        });
        ctx.on('end', function () {

            parseFormData(postdata, configdata).then(function(data){
                //console.log(data);
                callbackSuccess && callbackSuccess(JSON.parse(JSON.stringify(data)));
            },function(err){
                callbackError && callbackError(err);
            })

        })
    } catch (err) {
        //console.log(err)
        callbackError && callbackError(err);
    }
};
/**解析formdata数据 */
function parseFormData(formdata, configdata) {
	return new Promise(function (resolve, reject) {
		var config = configdata;
		//2020年5月6日通过接收编码为base64的数据在转换成binary编码数据实现文件上传
		var postData = Buffer.from(formdata, 'base64').toString('binary');//将编码为base64的字符串转换为buffer实体再转换为编码为binary的字符串

		var postData_utf8 = Buffer.from(formdata, 'base64').toString();

		//.replace(/^\s\s*/, '')匹配空格
		//1、找到处理后生成的hexname值，已便定位formdata处理过的文件数据和其它参数在那个位置
		//hexname值作用，用来标记数据位置（这个其实叫边界字符串）
		//找上面那个hexname值技巧，从尾部找找到\r\n停止
		var postDataLen = postData.length;
		var i = postDataLen;
		var foundValue = '';
		//console.log('开始找hexname值');
		while (foundValue !== '\r\n--') {
			//console.log(foundValue);
			//console.log(i);
			i--;
			foundValue = postData.substr(i, 4);
		}
		var hexname = postData.substring(i, postDataLen).replace(/[\r\n]/g, "");
		hexname = hexname.substring(0, hexname.length - 2);
		//console.log(hexname);
		//至此hexname输出的后16为，为hex值


		//2、根据上面找的hexname值把每一个formdata中每个参数切割，分出来

		//处理编码为binary
		var Arr1 = postData.split(hexname + '\r\n');
		var dataArr = Arr1.slice(1, Arr1.length);

		//处理编码为utf8
		var Arr1_utf8 = postData_utf8.split(hexname + '\r\n');
		var dataArr_utf8 = Arr1_utf8.slice(1, Arr1_utf8.length);

		//通过hexname切割并把formdata中的参数转到数组后，在过滤一下，防止在不上传文件时，防止切割后的参数体中还有hexname的情况
		dataArr.forEach(function (item, index) {
			//处理编码为binary
			dataArr[index] = item.replace(hexname, "");

			//处理编码为utf8
			dataArr_utf8[index] = dataArr_utf8[index].replace(hexname, "");
		});
		var dataArrLen = dataArr.length;


		//3、分析数据，把formdata中每一个参数的数据状态信息(数据名称,数据类型什么的)和数据本体提取出来
		var dataBody = {}; //dataBody用来存放处理后formdata中每一个参数状态信息和数据体的容器
		console.log('FormData 参数数量：' + dataArrLen);
		function eachArr(index) {
			//item现在是formdata中某一个参数的数据状态信息(数据名称,数据类型什么的)和数据值本身的结合体
			let item = dataArr[index];
			let addIndex = index + 1;

			//处理编码为binary
			let valueData = item;

			//处理编码为utf8
			let valueData_utf8 = dataArr_utf8[index];

			//寻找formdata中某一个参数的数据状态信息(数据名称,数据类型什么的)和数据本体中间的位置
			let endzuobiao = valueData.search('\r\n\r\n');

			//3.1、根据endzuobiao坐标之前为数据状态信息(数据名称,数据类型什么的)（3.1、提取参数的数据状态信息）
			//console.log(valueData.substring(0, endzuobiao));

			//把参数的数据状态信息字符串转换成arr，因为一个参数的状态信息不光有数据名称,还有别的数据说明属性，所以要把它换成arr
			//处理编码为binary
			let paramArr = valueData.substring(0, endzuobiao).replace(/[\r\n]/g, ";").split(';');

			//处理编码为utf8
			let paramArr_utf8 = valueData_utf8.substring(0, endzuobiao).replace(/[\r\n]/g, ";").split(';');

			//把参数的数据状态的信息提分别提取到对象中
			//提取参数 数据状态信息用utf8编码的，这样可以防止上传文件时，如果文件名称是中文的话无法识别中文的问题
			let param = {};//用于临时存放某个已处理好参数（已处理好的数据状态信息和对象和数据体）的容器
			paramArr.forEach(function (paramArrItem, paramArrIndex) {
				if (paramArrItem.length > 0) {
					var fuhao = ":";
					if (paramArrItem.search(":") !== -1) {
						fuhao = ":";
					} else {
						fuhao = "=";
					}
					//处理编码为binary
					// var paramArrItemkey = paramArrItem.split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
					// var paramArrItemvalue = paramArrItem.split(fuhao)[1].replace(/\ +/g, "").replace(/['"]/g, "");

					//处理编码为utf8
					var paramArrItemkey = paramArr_utf8[paramArrIndex].split(fuhao)[0].replace(/\ +/g, "").replace(/['"]/g, "");
					var paramArrItemvalue = paramArr_utf8[paramArrIndex].split(fuhao)[1].replace(/\ +/g, "").replace(/['"]/g, "");
					param[paramArrItemkey] = paramArrItemvalue;
				}
			});


			//3.2、根据endzuobiao坐标之后为数据本体（3.2、提取参数的数据本体）
			//根据提取的数据状态信息，分别用不同编码方式的数据来提取数据体
			if (param['Content-Type'] !== undefined) {

				//提取文件类数据体，文件类数据用binary编码的，防止数据写入文件后，文件无法使用
				//处理编码为binary
				let dataBody = valueData.substring(endzuobiao);
				let data = dataBody.substring(4, dataBody.length - 4); //去除数据头尾的换行符

				//console.log('这应该是图片类数据');
				/*
				.png 正常解析保存
				.jpg 正常解析保存
				.mp4 正常解析保存
				.mp3 正常解析保存
				.txt 正常解析保存，txt内容有中文也会正常保存，
				.word 正常保存，但是打开时说无法正常读取文件，需要修复，修复后可正常打开
				*/
				//把图片类数据写入文件

				//跟据config设置文件名称及文件存放地址
				let primaryFileName = param.filename.replace(/['"]/g, "");//原文件名
				//config.renameFileName 是否重新设置文件名 默认false
				//config.storageFilePath  存放文件的地址
				let filename = config.renameFileName === undefined || config.renameFileName === false ? primaryFileName : Date.now() + '_' + param.filename.replace(/['"]/g, "");//保存时的文件名
				//创建可写为流文件
				let filePath = config.storageFilePath + '/' + filename;
				let writerStream = fs.createWriteStream(filePath);
				writerStream.write(data, 'binary');
				// 标记文件末尾
				writerStream.end();
				// 处理流事件 ==> finish 事件
				writerStream.on('finish', function () {
					//finish所有数据已被写入到底层系统时触发。
					console.log(param.filename + '_写入完成');
					param.data = filePath; //图片类的文件写入保存的文件地址
					if (addIndex !== dataArrLen) {
						eachArr(addIndex);
					}
				});
				writerStream.on('error', function (err) {
					console.log(param.filename + '_写入失败');
					reject(err);
					//console.log(err.stack);
					param.errMessage = '写入文件失败！';
					if (addIndex !== dataArrLen) {
						eachArr(addIndex);
					}
				});
			} else {
				//提取普通数据体，普通数据用utf8编码的，防止出现中文字无法识别
				//处理编码为utf8
				let dataBody_utf8 = valueData_utf8.substring(endzuobiao);
				let data_utf8 = dataBody_utf8.replace(/[\r\n]/g, "").replace(/--$/, ""); //除去空格和结尾的--
				//普通数据,字符串型数据，啥的，object型数据会在浏览器上formdata解析成[object object]所以obj在传输前要转换成字符串

				//处理编码为utf8,直接将数据存入
				param.data = data_utf8; //将处理好的普通数据体写入到param中
				if (addIndex !== dataArrLen) {
					eachArr(addIndex);
				}
			}
			dataBody[param.name] = param; //将这个整理好的formdata参数存入到dataBody中

			if (index === dataArrLen - 1) {
				//formData中所有参数处理完成
				resolve(dataBody);
			};
		};
		eachArr(0);
	});
}