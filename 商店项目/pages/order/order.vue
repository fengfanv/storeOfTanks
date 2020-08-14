<template>
	<view>
		<!-- 1：订单已创建(未付款)，2：订单已付款(待发货)，3：订单已收货(待收货)，4：订单已完成 -->
		<view class="top">
			<view :class="['topItem', navStatus==0?'active':'']" @tap="showStatus(0)">
				全部
			</view>
			<view :class="['topItem', navStatus==1?'active':'']" @tap="showStatus(1)">
				待付款
			</view>
			<view :class="['topItem', navStatus==2?'active':'']" @tap="showStatus(2)">
				待发货
			</view>
			<view :class="['topItem', navStatus==3?'active':'']" @tap="showStatus(3)">
				待收货
			</view>
			<view :class="['topItem', navStatus==4?'active':'']" @tap="showStatus(4)">
				已完成
			</view>
		</view>
		<view class="content">
			<view class="contentItem" v-for="(orderItem,orderIndex) in showList" :key="orderIndex">
				<view class="a1 clearfix">
					<view class="time">
						{{formatDate(orderItem.create_time)}}
					</view>
					<view class="status">
						{{getStatusStr(orderItem.status)}}
					</view>
				</view>
				<view class="a2 clearfix" v-for="(productItem,productIndex) in JSON.parse(orderItem.product_list)" :key="productIndex">
					<view class="image">
						<image :src="getURL(productItem.icon)" mode="widthFix"></image>
					</view>
					<view class="a2Content">
						<view class="name">
							{{productItem.productName}}
						</view>
						<view class="guige">
							{{productItem.selectValueArr.toString()}} X{{productItem.number}}
						</view>
						<view class="price">
							￥{{productItem.price}}元
						</view>
					</view>
				</view>
				<view class="a3 clearfix">
					<view class="lj" v-if="orderItem.status===1">
						立即支付
					</view>
					<view class="qx" v-if="orderItem.status===1">
						取消订单
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
				list: [],
				showList: [],
				navStatus: 0,
			}
		},
		onLoad() {
			this.getOrder();
		},
		methods: {
			getOrder() {
				let _this = this;
				if (_this.$store.state.isLogin) {
					uni.request({
						method: "get",
						url: _this.getURL('/api/getorder'),
						data: {
							userId: _this.$store.state.userId
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							let data = res.data;
							if (data.status) {
								//console.log(data);
								_this.list = data.data;
								_this.showList = data.data;

							} else {
								uni.showToast({
									title: '查询用户订单失败！',
									icon: 'none',
									duration: 2000
								});
							}
						},
						fail: function(err) {
							uni.showToast({
								title: '请求查询用户订单错误！',
								icon: 'none',
								duration: 2000
							});
						}
					})
				}

			},
			formatDate: function(num) {
				let date = new Date(num);
				let YY = date.getFullYear() + '-';
				let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD + " " + hh + mm + ss;
			},
			getStatusStr: function(status) {
				//1：订单已创建(未付款)，2：订单已付款(待发货)，3：订单已收货(待收货)，4：订单已完成
				switch (status) {
					case 1:
						return '未付款'
						break;
					case 2:
						return '待发货'
						break;
					case 3:
						return '待收货'
						break;
					case 4:
						return '已完成'
						break;
				}
			},
			//显示某个状态的订单
			showStatus: function(status) {
				let _this = this;
				if(status == 0){
					_this.showList = _this.list;
				}else{
					_this.navStatus = status;
					let len = _this.list.length;
					let arr = [];
					for(let i=0;i<len;i++){
						if(_this.list[i].status==status){
							arr.push(_this.list[i])
						}
					}
					_this.showList = arr;
				}
			}
		}
	}
</script>

<style>
	.top {
		width: 100%;
		height: 70rpx;
		background: white;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		display: flex;
		justify-content: space-around;
		border-bottom: 1rpx solid #f0f0f0;


	}

	.top>.active {
		border-bottom: 6rpx solid #d52a26;
		color: #d52a26;
	}

	.topItem {
		height: 64rpx;
		border-bottom: 6rpx solid white;
		font-size: 26rpx;
		line-height: 70rpx;
	}

	.content {
		width: 100%;
		height: calc(100vh - 72rpx);
		overflow-y: scroll;
	}

	.contentItem {
		padding: 0 30rpx;
		background: white;
		border-bottom: 1rpx solid #e0e0e0;


	}

	.contentItem>.a1 {
		border-bottom: 1rpx solid #f0f2f6;
	}

	.contentItem>.a1>.time {
		width: 50%;
		height: 78rpx;
		line-height: 78rpx;
		font-size: 26rpx;
		float: left;
	}

	.contentItem>.a1>.status {
		width: 50%;
		height: 78rpx;
		line-height: 78rpx;
		font-size: 26rpx;
		float: left;
		text-align: right;
		color: #d52a26;
	}

	.contentItem>.a2 {
		padding: 20rpx 0;
	}

	.contentItem>.a2>.image {
		width: 120rpx;
		height: 120rpx;
		float: left;
		display: flex;
		align-items: center;
	}

	.contentItem>.a2>.image image {
		width: 120rpx;
		height: auto;
		background: #2C405A;
	}

	.contentItem>.a2>.a2Content {
		width: 540rpx;
		height: auto;
		margin-left: 20rpx;
		float: left;
	}

	.contentItem>.a2>.a2Content>.name {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 25rpx;
	}

	.contentItem>.a2>.a2Content>.guige {
		width: 100%;
		height: 46rpx;
		line-height: 46rpx;
		font-size: 25rpx;
		color: #5c5c5c;
	}

	.contentItem>.a2>.a2Content>.price {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 25rpx;
		color: #d52a26;
	}

	.contentItem>.a3 {
		border-top: 1rpx solid #f0f2f6;
		padding: 16rpx 0rpx;
	}

	.contentItem>.a3>.lj {
		border: 1rpx solid #d52a26;
		width: 150rpx;
		height: 54rpx;
		line-height: 54rpx;
		font-size: 28rpx;
		text-align: center;
		float: right;
		border-radius: 25rpx;
		color: white;
		background-color: #d52a26;
	}

	.contentItem>.a3>.qx {
		border: 1rpx solid #f0f2f6;
		width: 150rpx;
		height: 54rpx;
		line-height: 54rpx;
		font-size: 28rpx;
		text-align: center;
		float: right;
		margin-right: 5rpx;
		border-radius: 25rpx;
	}
</style>
