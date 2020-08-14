<template>
	<view>
		<!--登录界面-->
		<view class="login" v-if="!isLogin">
			<!-- <view class="title">
				商城账号登录
			</view> -->
			<view class="input">
				<label>账号：</label>
				<input type="text" v-model="account" placeholder="请输入账号" />
			</view>
			<view class="input">
				<label>密码：</label>
				<input type="password" v-model="password" placeholder="请输入密码" />
			</view>
			<button type="default" @tap="login">登录</button>
		</view>
		<!--用户界面-->
		<view class="user_view">
			<view class="user_info clearfix">
				<view class="user_image">
					<image src="../../static/user-icon.png"></image>
				</view>
				<view class="user_text">
					<view class="user_name">{{userAccount}}</view>
					<view class="user_content">用户</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="user_navs clearfix">
				<view class="list" @tap="toOrder">
					我的订单
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: "",
				password: "",
				isLogin: false,
				userId: null,
				userAccount: ""
			}
		},
		onLoad() {
			let _this = this;
			_this.isLogin = _this.$store.state.isLogin;
			_this.userId = _this.$store.state.userId;
			if(_this.isLogin){
				uni.getStorage({
					key:"userAccount",
					success:function(res){
						_this.userAccount = res.data;
					}
				})
			}
			
		},
		methods: {
			//登录方法
			login: function() {
				let _this = this;
				if (_this.account != null && _this.account.length > 0) {
					if (_this.password != null && _this.password.length > 0) {
						uni.showLoading({
							title: '登录中',
						})
						uni.request({
							method: "post",
							url: _this.getURL('/api/login'),
							data: {
								"account": _this.account,
								"password": _this.password
							},
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							success: function(res) {
								uni.hideLoading()
								let data = res.data
								//console.log(data);
								if (data.status) {
									uni.showToast({
										title: '登录成功！',
										icon: 'none',
										duration: 2000
									})
									_this.isLogin = true;
									_this.userId = data.data.id;
									_this.userAccount = _this.account;
									_this.$store.commit('setUserId',data.data.id);
									_this.$store.commit('setIsLogin',true);
									uni.setStorage({
										key: "isLogin",
										data: true
									});
									uni.setStorage({
										key: "userId",
										data: data.data.id
									});
									uni.setStorage({
										key: "userAccount",
										data: _this.account
									});
								} else {
									uni.showToast({
										title: data.message,
										icon: 'none',
										duration: 2000
									})
								}
							},
							fail: function(err) {
								uni.hideLoading();
								uni.showToast({
									title: '请求登录接口出现错误！',
									icon: 'none',
									duration: 2000
								})
							}
						})

					} else {
						uni.showToast({
							title: '请输入密码！',
							icon: 'none',
							duration: 2000
						})
					}
				} else {
					uni.showToast({
						title: '请输入账号！',
						icon: 'none',
						duration: 2000
					})
				}
			},
			//跳转到订单页面
			toOrder:function(){
				uni.navigateTo({
					url:'../order/order'
				})
			}
		}
	}
</script>

<style>
	/*登录页面*/
	.login {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		background-color: white;
		border-top: 1rpx solid #f0f0f0;
	}

	.login>.title {
		width: 700rpx;
		margin: 0 auto;
		line-height: 36rpx;
		font-size: 36rpx;
		margin-bottom: 50rpx;
	}

	.login>.input {
		width: 700rpx;
		height: 80rpx;
		border-bottom: 1rpx solid #c3c3c3;
		margin: 0 auto;
	}

	.login>.input>label {
		width: 110rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
		float: left;
	}

	.login>.input>input {
		width: 560rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 34rpx;
	}

	.login>button {
		width: 700rpx;
		height: 86rpx;
		line-height: 86rpx;
		background: #d52a26;
		text-align: center;
		font-size: 34rpx;
		color: white;
		margin-top: 60rpx;
	}

	/*用户界面*/

	.user_view {
		width: 700rpx;
		height: auto;
		margin: 0 auto;
		padding: 0 25rpx;
		background: white;
		border-top: 1rpx solid #f0f0f0;
	}

	.user_info {
		width: 100%;
		height: 130rpx;
		padding: 30rpx 0;
		margin-bottom: 30rpx;
	}

	.user_image {
		width: 130rpx;
		height: 130rpx;
		float: left;
		overflow: hidden;
		border-radius: 50%;
	}

	.user_image image {
		width: 100%;
		font-size: 0px;
		background: #2C405A;
		height: 100%;
		transform: scale(1.08);
	}

	.user_text {
		width: 500rpx;
		height: 130rpx;
		float: left;
		margin-left: 42rpx;
	}

	.user_name {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
		font-weight: bold;
	}

	.user_content {
		font-size: 26rpx;
	}

	.line {
		width: 250rpx;
		height: 0rpx;
		border: 1rpx solid #f1f1f1;
		margin: 0 auto;
	}

	.user_navs {
		width: 100%;
		height: auto;
		margin-top: 50rpx;
	}

	.user_navs>.list {
		width: 100%;
		height: 90rpx;
		background: #007AFF;
		line-height: 90rpx;
		font-size: 26rpx;
		background: url(../../static/toRright.png) no-repeat center right #007AFF;
		background-size: 30rpx 30rpx;

	}
</style>
