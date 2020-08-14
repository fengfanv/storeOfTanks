<template>
	<view>
		<view class="top">
			<!-- 轮播图 -->
			<view class="swiper">
				<swiper indicator-dots="true" indicator-color="rgba(255, 255, 255, .3)" indicator-active-color="white" autoplay="true">
					<block v-for="(item,index) in swiperList" :key="index">
						<swiper-item>
							<image :src="getURL(item)" mode="widthFix"></image>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<view class="content clearfix">
				<!--当前规格价格-->
				<view class="name">
					{{productName}}
				</view>
				<view class="worth">
					￥{{price}}
				</view>
			</view>
			<!--规格-->
			<view class="guige">
				<view class="title">
					已选
				</view>
				<view class="text" @tap="showGuige">
					{{selectValueArr.toString()}}
				</view>
			</view>
			<!--产品详细-->
			<view class="xiangxi">
				<view class="title">
					产品详细
				</view>
				<view class="neirong">
					<!-- <image src="" mode="" style="display:none"></image> -->
					<view class="kuai" style="background-color: white;">
						<view class="title">
							坦克描述
						</view>
						<view style="font-size: 26rpx;">
							{{productObj.text}}
						</view>
					</view>
					<view class="kuai">
						<view class="title">
							坦克参数
						</view>
						<view class="row clearfix">
							<view class="a1">
								国家
							</view>
							<view class="a2">
								{{productObj.nation}}
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								类型
							</view>
							<view class="a2">
								{{productObj.vehicleType}}
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								级别
							</view>
							<view class="a2">
								{{productObj.level}}
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								炮弹口径
							</view>
							<view class="a2">
								{{productObj.detailed.koujing}}MM
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								炮弹穿深
							</view>
							<view class="a2">
								{{productObj.detailed.chuanshen}}MM
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								正面装甲厚度
							</view>
							<view class="a2">
								{{productObj.detailed.houdu}}MM
							</view>
						</view>
						<view class="row clearfix">
							<view class="a1">
								最大速度
							</view>
							<view class="a2">
								{{productObj.detailed.sudu}}km/h
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="board clearfix">
			<view class="a1" style="background: #ffac27;">
				立即购买
			</view>
			<view class="a2" style="background: #ff6b00;" @tap="addCart">
				加入购物车
			</view>
			<view class="a3">
				<view class="item">
					<view class="icon"></view>
					<view class="text">
						跳转购物车
					</view>
				</view>
			</view>
		</view>
		<!-- 设置规格型号弹层 -->
		<view class="setGuigeModel" v-show="isGuigeModelShow">
			<view :class="['board',isGuigeModelShow?'openGMboard':'']">
				<view class="first">
					<view class="title">
						{{productName}}
					</view>
					<view class="close" @tap="closeGuigeBoard">×</view>
				</view>
				<view class="sgm_content">
					<view class="item" v-for="(guigeItem,guigeIndex) in specifications" :key="guigeIndex">
						<text class="name">{{guigeItem.name}}</text>
						<view class="sgn_ul">
							<view v-for="(guigeValueItem,guigeValueIndex) in guigeItem.item" :key="guigeValueIndex" v-if="guigeValueItem.isShow"
							 @tap="choiceGuige(guigeValueItem.name,guigeIndex,guigeValueIndex)">
								<!-- <text :class="['sgn_li',selectIndexArr[guigeIndex]===guigeValueIndex?'active':'']">{{guigeValueItem.name}}</text> -->
								<text :class="['sgn_li',selectValueArr[guigeIndex]===guigeValueItem.name?'active':'']">{{guigeValueItem.name}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productObj:null,//当前产品总数据包
				productId: null,
				productName: "59坦克",
				price: 5000,
				swiperList: [],

				isGuigeModelShow: false, //设置商品规格的面板是否显示
				shopItemInfo: {}, //存放要和选中的值进行匹配的数据
				specifications: [{
						//这里是要被渲染字段
						name: "发动机",
						item: [{
								name: "原装发动机"
							},
							{
								name: "高性能发动机"
							}
						]
					},
					{
						name: "涂装",
						item: [{
								name: "坦克出厂原漆"
							},
							{
								name: "现代数码迷彩"
							}
						]
					}
				],
				difference: [
					//所有的规格可能情况都在这个数组里
					{
						id: "19",
						price: 5000,
						stock: 5, //库存
						difference: "原装发动机,坦克出厂原漆" //此规格的属性键值
					},
					{
						id: "20",
						price: 6000,
						stock: 4,
						difference: "原装发动机,现代数码迷彩"
					},
					{
						id: "21",
						price: 7000,
						stock: 3,
						difference: "高性能发动机,坦克出厂原漆"
					},
					{
						id: "22",
						price: 8000,
						stock: 0,
						difference: "高性能发动机,现代数码迷彩"
					}
				],
				selectIndexArr: [0, 0], //当前选中规格子选项的坐标
				selectValueArr: [], //存放当前规格被选中的值
				specId:null,//当前选中的规格搭配的id
				maxNumber:0,//可购买的最大数量
			}
		},
		onLoad(options) {
			let _this = this;
			console.log(options);
			let product = this.$store.state.product;
			let len = product.length;
			for (let i = 0; i < len; i++) {
				if (product[i].id == options.id) {
					this.productObj = product[i];
					this.swiperList = product[i].swiper;
					this.productName = product[i].name;
					this.productId = product[i].id;
					//console.log(JSON.parse(product[i].specifications));
					this.specifications = JSON.parse(product[i].specifications || '[]');
					
				}
			}
			//请求规格搭配列表
			uni.showLoading({
				title: '请求规格搭配',
			})
			uni.request({
				"method": "get",
				"url": _this.URL + '/api/getguigedapei',
				"data": {
					"productId": options.id,
				},
				success: function(res) {
					uni.hideLoading();
					let data = res.data;
					if (data.status) {
						_this.difference = data.data;
						let len = _this.difference.length;
						for (let i = 0; i < len; i++) {
							if(_this.difference[i].stock>0){
								_this.selectValueArr = _this.difference[i].difference.split(',');
								_this.price = _this.difference[i].price;
								_this.specId = _this.difference[i].id;
								_this.maxNumber = _this.difference[i].stock;
								break;
							}
						}
					} else {
						uni.showToast({
							title: '请求规格搭配失败！',
							icon: 'none',
							duration: 2000
						});
					}
				},
				fail: function(err) {
					uni.hideLoading();
					uni.showToast({
						title: '请求规格搭配错误！',
						icon: 'none',
						duration: 2000
					});
				}
			})

		},
		methods: {
			//显示选择规格型号面板
			showGuige(e) {
				let obj = {};
				//遍历sku
				for (var i in this.difference) {
					//修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
					//键：由属性拼接而成，值：相对应sku的信息
					obj[this.difference[i].difference] = this.difference[i];
				}
				this.shopItemInfo = obj;
				//console.log(this.shopItemInfo);
				this.checkGuige();
				this.isGuigeModelShow = true;
			},
			//选择这个商品的某个规格型号
			choiceGuige(value, n, index) {
				if (this.selectValueArr[n] != value) {
					this.selectValueArr[n] = value; //当前规格选中,赋值为小项的名字(蓝色，黑色)
					//this.selectIndexArr[n] = index; //设置此项为选中
				} else {
					this.selectValueArr[n] = "";
					//this.selectIndexArr[n] = -1; //去掉选中的颜色
				}
				//console.log(this.selectIndexArr);
				this.checkGuige();
				// let len = this.cartList.length;
				// for(let i=0;i<len;i++){
				// 	if(this.cartList[i].product.id===this.nowGuigeSpId){
				// 		this.cartList[i].price = this.price;
				// 		this.cartList[i].MaxNumber = this.MaxNumber;
				// 		this.cartList[i].selectValueArr = this.selectValueArr;
				// 		this.cartList[i].selectIndexArr = this.selectIndexArr;
				// 	}
				// }
				//this.countMoney();
			},
			//校验规格
			checkGuige() {
				var _this = this;
				var option = _this.specifications;
				var result = []; //定义数组储存被选中的值
				for (var i in option) {
					//初始化被选中的数组，如果此类别没被选中，则赋值为空，如果有3个类别，则数组长度为3
					result[i] = _this.selectValueArr[i] ? _this.selectValueArr[i] : "";
				}
				//便利每个类别的每个小项
				for (var i in option) {
					var last = result[i]; //把选中的值存放到字符串last去
					for (var k in option[i].item) {
						result[i] = option[i].item[k].name; //获取每个小项的值(如：红色、蓝色)，并临时存放于result[i]，存在直接覆盖，不存在往里面添加name值
						option[i].item[k].isShow = _this.isShow(result); //result数组每一次修改都将计算一次是否可以选择，添加字段isShow来判断是否可以选择
					}
					//console.log(result[i]);
					result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
				}
				//如果可获取sku，则显示当前sku价格
				if (this.shopItemInfo[result]) {
					this.price = this.shopItemInfo[result].price || 0;
					this.specId = this.shopItemInfo[result].id;//当前选中规格搭配的id，用于下单时判断和减去这个规格的数量
					this.maxNumber = this.shopItemInfo[result].stock || 0;
				}
				this.$forceUpdate(); //重绘
			},
			//判断每个小项是否可以选择
			isShow: function(result) {
				for (var i in result) {
					if (result[i] == "") {
						return true; //如果数组里有为空的值，则表示未被全部选择，无法获取sku，直接返回true
						break;
					}
				}
				//result选满，可获取sku，根据初始化时shopItemInfo的difference[i].difference键值对(200,蓝色)可获取sku信息
				return this.shopItemInfo[result].stock == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
			},
			//关闭当前这个商品的选择规格面板
			closeGuigeBoard() {
				this.isGuigeModelShow = false;
			},
			//将产品假如到购物车
			addCart(){
				let _this = this;
				let obj = {
					"productId":this.productId,
					"productName":this.productName,
					"icon":this.productObj.icon,
					"specifications":this.specifications,
					"difference":this.difference,
					"selectValueArr":this.selectValueArr,
					"specId":this.specId,
					"price":this.price,
					"number":1,
					"maxNumber":this.maxNumber,
					"selected": false, //是否已被选择
				}
				//this.$store.commit('delCart',this.productId);
				this.$store.commit('addCart',obj);
			}
			// getHeight(url) {
			// 	let _this = this;
			// 	let windowWidth = wx.getSystemInfoSync().windowWidth;
			// 	return new Promise(function(resolve, reject) {
			// 		wx.getImageInfo({
			// 			src: _this.getURL(url),
			// 			success(res) {
			// 				let imgWidth = res.width;
			// 				let imgHeight = res.height;
			// 				// h1/w1 = h2/w2
			// 				resolve(imgHeight/imgWidth*windowWidth);
			// 			},
			// 			fail() {
			// 				reject(0);
			// 			}
			// 		})
			// 	});
			// }
		}
	}
</script>

<style>
	.top {
		width: 100%;
		height: calc(100vh - 100rpx);
		overflow-y: scroll;
	}

	.swiper {
		width: 100%;
		height: auto;
		/* min-height: 800rpx; */
	}

	swiper,
	swiper-item {
		width: 100%;
		height: 800rpx;
	}

	swiper image {
		width: 100%;
		height: auto;
		background-color: #2C405A;
	}

	.content {
		padding: 0 32rpx;
		height: auto;
		background: white;
		padding-top: 10rpx;
	}

	.name {
		width: 50%;
		line-height: 100rpx;
		font-size: 36rpx;
		font-weight: bold;
		float: left;
	}

	.worth {
		width: 50%;
		line-height: 104rpx;
		font-size: 40rpx;
		color: #d52a26;
		font-weight: bold;
		float: right;
		text-align: right;
	}

	.guige {
		width: 100%;
		height: 90rpx;
		margin-top: 22rpx;
		background: white;
	}

	.guige>.title {
		width: 116rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 24rpx;
		float: left;
	}

	.guige>.text {
		width: 600rpx;
		line-height: 90rpx;
		font-size: 24rpx;
		float: left;
		background: url(../../static/toRright.png) no-repeat center right white;
		background-size: 30rpx 30rpx;
	}

	.xiangxi {
		height: auto;
		background: white;
	}

	.xiangxi>.title {
		padding: 0 32rpx;
		line-height: 104rpx;
		font-size: 28rpx;
		margin-top: 22rpx;
	}

	.xiangxi>.neirong {
		width: 100%;
		height: auto;
	}

	.xiangxi>.neirong image {
		width: 100%;
		height: 560rpx;
		background: #2C405A;
	}

	.xiangxi>.neirong .kuai {
		padding: 82rpx 74rpx;
		background: #fafbfd;
		height: auto;
	}

	.xiangxi>.neirong>.kuai>.title {
		width: 100%;
		line-height: 36rpx;
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
	}

	.xiangxi>.neirong>.kuai>.row {
		width: 100%;
		height: 50rpx;
		line-height: 50rpx;
	}

	.xiangxi>.neirong>.kuai>.row>.a1 {
		width: 200rpx;
		height: 50rpx;
		float: left;
		font-weight: bold;
		font-size: 26rpx;
		line-height: 50rpx;
		text-align: left;
	}

	.xiangxi>.neirong>.kuai>.row>.a2 {
		width: 200rpx;
		height: 50rpx;
		float: left;
		font-size: 26rpx;
		color: black;
		line-height: 50rpx;
		text-align: left;
	}

	.board {
		width: 100%;
		height: 100rpx;
		background-color: white;
	}

	.board>.a1,
	.a2 {
		width: 210rpx;
		height: 100rpx;
		float: right;
		line-height: 100rpx;
		text-align: center;
		font-size: 34rpx;
		color: white;

	}

	.board>.a3 {
		width: 330rpx;
		height: 99rpx;
		border-top: 1rpx solid #ebe5e1;
		float: left;
	}

	.board>.a3>.item {
		width: 130rpx;
		height: 99rpx;
		float: left;
	}

	.board>.a3>.item>.icon {
		width: 56rpx;
		height: 56rpx;
		background: url(../../static/cart.png) no-repeat center;
		background-size: 52rpx;
		margin: 0 auto;
		margin-top: 10rpx;
	}

	.board>.a3>.item>.text {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.setGuigeModel {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		position: fixed;
		left: 0;
		top: 0;
	}

	.setGuigeModel>.board {
		width: 100%;
		height: 50vh;
		background: white;
		position: absolute;
		bottom: 0;
		left: 0;
		tansform: translate(0, 100%);
	}

	.openGMboard {
		animation: 0.5s GMopen;
		tansform: translate(0, 0%);
	}

	@keyframes GMopen {
		from {
			transform: translate(0, 100%);
		}

		to {
			transform: translate(0, 0%);
		}
	}

	.setGuigeModel>.board>.first {
		width: 100%;
		height: 100rpx;
		border-bottom: 1rpx solid #d5d5d5;
	}

	.setGuigeModel>.board>.first>.title {
		width: 650rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;
		float: left;
		box-sizing: border-box;
		padding-left: 30rpx;
	}

	.setGuigeModel>.board>.first>.close {
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 55rpx;
		float: left;
		color: #aeaeae;
		text-align: center;
	}

	.sgm_content {
		width: 100%;
		height: calc(100% - 112rpx);
		overflow-y: scroll;
	}

	.sgm_content>.item {
		width: 684rpx;
		height: auto;
		margin: 0 auto;
		border-bottom: 1rpx solid #d5d5d5;
	}

	.sgm_content>.item>.name {
		display: block;
		width: 100%;
		height: 104rpx;
		line-height: 104rpx;
		font-size: 26rpx;
	}

	.sgm_content>.item>.sgn_ul {
		width: 100%;
		height: auto;
	}

	.sgm_content>.item>.sgn_ul>view {
		margin-bottom: 32rpx;
	}

	.sgm_content>.item .sgn_li {
		display: inline-block;
		width: auto;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 22rpx;
		padding: 0 20rpx;
		border: 1px solid #d5d5d5;
		border-radius: 5rpx;
		color: #d5d5d5;
	}

	.sgm_content>.item>.sgn_ul .active {
		border: 1px solid #d52a26;
		color: #d52a26;
	}
</style>
