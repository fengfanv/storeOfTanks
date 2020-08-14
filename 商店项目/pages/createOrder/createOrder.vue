<template>
	<view>
		<view class="content">
			<view class="addressBox">
				<view class="shippingAddress1">
					河北省石家庄市长安区
				</view>
				<view class="shippingAddress2">
					谈固街道
				</view>
				<view class="shippingAddress1">
					王一笑 155****1111
				</view>
				<view class="bottom"></view>
			</view>
			<view class="product">
				<!--产品列表-->
				<view class="item clearfix" v-for="(item,index) in list" :key="index">
					<view class="image">
						<image :src="getURL(item.icon)" mode="widthFix"></image>
					</view>
					<view class="content">
						<view class="name">
							{{item.productName}}
							<text>￥{{item.price}}</text>
						</view>
						<view class="guige">
							{{item.selectValueArr.toString()}}
							<text>× {{item.number}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--付款底部-->
		<view class="board">
			<view class="left">
				共{{productCount}}件，共{{price}}元
			</view>
			<view class="right" @tap="createOrder">
				付款
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "创建订单",
				list: [],
				price: 0, //订单价格
				productCount: 0, //产品数量
			}
		},
		onLoad() {
			let cartList = JSON.parse(JSON.stringify(this.$store.state.cartList));
			let len = cartList.length;
			let arr = [];
			let productCount = 0;
			let price = 0;
			for (var i = 0; i < len; i++) {
				if (cartList[i].selected) {
					delete cartList[i].maxNumber;
					delete cartList[i].specifications;
					delete cartList[i].difference;
					productCount += cartList[i].number;
					price += (cartList[i].number * cartList[i].price);
					arr.push(cartList[i]);
				}
			}
			console.log(arr);
			this.list = arr;
			this.price = price;
			this.productCount = productCount;

		},
		methods: {
			//创建订单，返回订单id，用订单id去支付页面付款
			createOrder() {
				let _this = this;
				if (_this.$store.state.isLogin) {
					uni.request({
						method: "post",
						url: _this.getURL('/api/createorder'),
						data: {
							"userId":_this.$store.state.userId,
							"createTime":Date.now(),
							"productList":JSON.stringify(_this.list),
							"price":_this.price,
							"status":1//1：订单已创建，2：订单已付款，3：订单已收货，4：订单已完成
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success:function(res){
							let data = res.data;
							if(data.status){
								uni.showToast({
									title: '订单创建成功！',
									icon: 'none',
									duration: 2000
								});
								console.log(data);
								console.log(data.data.insertId);//插入数据库数据，返回的id
							}else{
								uni.showToast({
									title: '订单创建失败！',
									icon: 'none',
									duration: 2000
								});
							}
						},
						fail:function(err){
							uni.showToast({
								title: '请求创建订单错误！',
								icon: 'none',
								duration: 2000
							});
						}
					})
				} else {
					uni.showToast({
						title: '未登录，请先登录！',
						icon: 'none',
						duration: 2000
					});
				}
			}
		}
	}
</script>

<style>
	.content {
		width: 700rpx;
		height: calc(100vh - 100rpx);
		margin: 0 auto;
		overflow: hidden;
	}

	.addressBox {
		padding: 22rpx 26rpx 0 26rpx;
		background: url(../../static/toRright.png) no-repeat center right 10rpx white;
		background-size: 30rpx 30rpx;
		border-radius: 15rpx;
		margin-top: 20rpx;
		overflow: hidden;

	}

	.shippingAddress1 {
		width: 100%;
		height: 48rpx;
		line-height: 48rpx;
		font-size: 22rpx;
	}

	.shippingAddress2 {
		width: 100%;
		height: 56rpx;
		line-height: 56rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.addressBox>.bottom {
		width: calc(100% + 42rpx);
		height: 5rpx;
		background: url(../../static/orderBorder.png) repeat;
		margin-left: -26rpx;
		margin-top: 22rpx;
	}

	.product {
		width: 100%;
		height: auto;
	}

	.product>.item {
		padding: 22rpx 26rpx 22rpx 26rpx;
		border-radius: 15rpx;
		margin-top: 20rpx;
		background: white;
	}

	.product>.item>.image {
		width: 174rpx;
		height: 174rpx;
		float: left;
		display: flex;
		align-items: center;
	}

	.product>.item>.image>image {
		width: 100%;
		height: auto;
		background: #2C405A;
		font-size: 0;
	}

	.product>.item>.content {
		width: 450rpx;
		height: auto;
		margin-left: 18rpx;
		float: left;
	}

	.product>.item>.content>.name {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.product>.item>.content>.name text {
		float: right;
	}

	.product>.item>.content>.guige {
		width: 100%;
		height: 36rpx;
		line-height: 36rpx;
		font-size: 22rpx;
		color: #6a6a6a;
	}

	.product>.item>.content>.guige text {
		float: right;
	}

	.board {
		width: 100%;
		height: 100rpx;
		background: white;
	}

	.board>.left {
		width: 400rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 26rpx;
		margin-left: 50rpx;
		float: left;
	}

	.board>.right {
		width: 250rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 26rpx;
		margin-left: 50rpx;
		float: right;
		color: white;
		background: linear-gradient(to right, #ff7210, #fe4001);
		text-align: center;
		font-weight: bold;
	}
</style>
