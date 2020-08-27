<template>
	<scroll-view scroll-y="true" :style="{'height':'100vh'}" @scrolltolower="hasAtTheBottom">
		<!-- 自定义导航栏 -->
		<view class="nav">
			<view class="navTop"></view>
			<view class="navContent">
				坦克商城
			</view>
		</view>
		<view class="content">
			<button @tap="requestPost">post数据发送</button>
			<!-- 搜索框 -->
			<view class="search">
				<view class="box">
					<view class="icon"></view>
					<input placeholder-class="placeholderStyle" maxlength="10" placeholder="搜索店内好物" />
				</view>
			</view>
			<!-- 轮播图 -->
			<view class="swiper">
				<swiper indicator-dots="true" indicator-color="rgba(255, 255, 255, .3)" indicator-active-color="white" autoplay="true">
					<block v-for="(item,index) in swiperList" :key="index">
						<swiper-item>
							<view class="swiperItem">{{item}}</view>
							<!-- <image src="" mode=""></image> -->
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 圆背景 -->
			<view class="roundBackgroundcolor">
				<view class="first"></view>
				<view class="second"></view>
			</view>
			<!-- 首页商品分类层 -->
			<view class="section">
				<view>
					<image src="" mode=""></image>
					<text>热门坦克</text>
				</view>
				<view>
					<image src="" mode=""></image>
					<text>绝版坦克</text>
				</view>
				<view>
					<image src="" mode=""></image>
					<text>坦克涂装</text>
				</view>
				<view>
					<image src="" mode=""></image>
					<text>通用炮弹</text>
				</view>
			</view>
			<!-- 热门爆款 -->
			<view class="hotMoney">
				<text class="hm_title">热门爆款</text>
				<view class="hm_content">
					<view class="hm_content_xscroll clearfix" style="width: 1000rpx;">
						<view class="item">
							<view class="image">
								<image src="" mode=""></image>
							</view>
							<text class="name">59式</text>
							<text class="worth">￥250元</text>
						</view>
						<view class="item">
							<view class="image">
								<image src="" mode=""></image>
							</view>
							<text class="name">62式</text>
							<text class="worth">￥160元</text>
						</view>
						<view class="item">
							<view class="image">
								<image src="" mode=""></image>
							</view>
							<text class="name">WZ111</text>
							<text class="worth">￥300元</text>
						</view>
						<view class="item">
							<view class="image">
								<image src="" mode=""></image>
							</view>
							<text class="name">E100 WT</text>
							<text class="worth">￥1600元</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 为你推荐 -->
			<view class="forYou">
				<view class="fy_title">
					<view class="left1"></view>
					<view class="left2"></view>
					<text>为你推荐</text>
					<view class="right1"></view>
					<view class="right2"></view>
				</view>
				<view class="fy_content">

					<view class="box" v-for="(item,index) in showForYou" :key="index">
						<view class="image">
							<image :src="item.imgUrl" mode="" :style="{'height':'400rpx'}"></image>
						</view>
						<text class="name">{{item.name}}</text>
						<view class="label clearfix" v-if="item.label.length>=1">
							<text v-for="(labelItem,labelIndex) in item.label" :key="labelIndex">{{labelItem}}</text>
						</view>
						<text class="worth">￥{{item.worth}}元</text>
					</view>

				</view>
				<view class="bottomLine">— 我是有底线的 —</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				swiperList: ['1', '2', '3'],
				forYouList: [{
						"imgUrl": "",
						"name": "豹一坦克",
						"worth": "8800",
						"label": ["退役坦克", "包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "IS-3重型坦克",
						"worth": "6888",
						"label": ["退役坦克", "包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "T-10重型坦克",
						"worth": "7999",
						"label": ["退役坦克", "包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "克伦威尔中型坦克",
						"worth": "3666",
						"label": ["退役坦克", "包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "58式中型坦克",
						"worth": "3666",
						"label": ["退役坦克", "包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "59式中型坦克",
						"worth": "6888",
						"label": ["包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "潘兴中型坦克",
						"worth": "6888",
						"label": ["包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "猎豹二坦克歼击车",
						"worth": "6888",
						"label": ["包邮", "保养良好"]
					},
					{
						"imgUrl": "",
						"name": "虎式重型坦克",
						"worth": "5888",
						"label": ["包邮", "保养良好"]
					}
				],
				showForYou: [],
				forYouPageIndex: 1, //为你推荐加载的页码
				isForYouLoad: true, //为你推荐是否可以加载

			}
		},
		onLoad() {
			let _this = this;
			this.toForYouPage(1);
			//获取产品列表
			this.getProduct();

			//检测是否登录
			uni.getStorage({
				key: 'isLogin',
				success(isLoginRes) {
					console.log(isLoginRes.data)
					if (isLoginRes.data) {
						_this.$store.commit('setIsLogin', true);
						uni.getStorage({
							key: 'userId',
							success(userIdRes) {
								_this.$store.commit('setUserId', userIdRes.data);
							}
						});
					}
				}
			})
		},
		methods: {
			requestPost() {
				let _this = this;
				uni.request({
					method: "post",
					url: _this.URL + "/api/setName",
					data: {
						"name": "我是微信",
						"sex": "女"
					},
					header: {
						"content-type": "appLication/json"
					},
					success(data) {
						console.log('------success-start------')
						console.log(data)
						console.log('------success-end------')
					},
					fail(err) {
						console.log('------err-start------')
						console.log(err)
						console.log('------err-end------')
					}
				})
			},
			getProduct: function() {
				let _this = this;
				uni.showLoading({
					title: '正在请求产品列表...',
				})
				uni.request({
					"method": "GET",
					"url": _this.URL + "/api/getproduct",
					"success": function(res) {
						let data = res.data;
						uni.hideLoading();
						if (data.status) {
							_this.$store.commit("setProduct", data.data);
							console.log(_this.$store.state.product);
						} else {
							uni.showToast({
								title: '产品列表请求失败！',
								icon: 'none',
								duration: 2000
							});
						}
					},
					fail: function(err) {
						uni.hideLoading();
						uni.showToast({
							title: '产品列表请求错误！',
							icon: 'none',
							duration: 2000
						});

					}
				})
			},
			hasAtTheBottom() { //滚动条到底部了
				this.forYouPageIndex = this.forYouPageIndex + 1;
				this.toForYouPage(this.forYouPageIndex);
			},
			//根据分页渲染为你推荐
			toForYouPage(index) {
				let len = this.forYouList.length;
				let showCount = 2; //每页显示几个
				let pageCount = len / showCount > parseInt(len / showCount) ? parseInt(len / showCount) + 1 : parseInt(len /
					showCount); //一共分多少页
				console.log("一共分" + pageCount + ',当前' + index)
				if (index <= pageCount && this.isForYouLoad === true) {

					let showStart = (index - 1) * showCount;
					let showEnd = index * showCount;
					if (showEnd > len) {
						showEnd = len;
					}
					let showList = this.showForYou;
					for (let i = showStart; i < showEnd; i++) {
						showList.push(this.forYouList[i]);
					};
					this.showForYou = showList;
					this.isForYouLoad = false;
					setTimeout(() => {
						this.isForYouLoad = true;
					}, 500);
				}
			}
		}
	}
</script>

<style>
	.nav {
		width: 100%;
		height: auto;
		background: #d52a26;
	}

	.navTop {
		width: 100%;
		height: 40rpx;
	}

	.navContent {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 34rpx;
		color: white;
		font-weight: bold;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* width: 700rpx;
		padding: 0 25rpx; */
	}

	.search {
		width: 100%;
		background: #d52a26;
	}

	.search>.box {
		width: 700rpx;
		height: auto;
		background: white;
		border-radius: 30rpx;
		display: flex;
		margin: 0 auto;
	}

	.search>.box>.icon {
		width: 66rpx;
		height: 66rpx;
		background: url(../../static/search_icon.png) no-repeat center;
		background-size: 32rpx;
	}

	.search>.box>input {
		width: 632rpx;
		height: 66rpx;
	}

	.placeholderStyle {
		color: #a1a1a1;
	}

	.swiper {
		width: 100%;
		height: 200rpx;
		background: #d52a26;
		padding-top: 25rpx;
	}

	swiper {
		height: 200rpx;
	}

	.swiperItem {
		width: 700rpx;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
		background: white;
		margin: 0 auto;
	}

	.roundBackgroundcolor {
		width: 100%;
		height: auto;
	}

	.roundBackgroundcolor>.first {
		width: 100%;
		height: 32rpx;
		background: #d52a26;
		padding-top: 25rpx;
	}

	.roundBackgroundcolor>.second {
		width: 100%;
		height: 50rpx;
		background: #d52a26;
		border-radius: 0 0 50% 50%;
	}

	.section {
		width: 650rpx;
		height: auto;
		border-radius: 12rpx;
		background: white;
		margin: 0 auto;
		margin-top: -82rpx;
		display: flex;
		justify-content: space-between;
		padding: 25rpx;
		box-shadow: 0 0 5rpx #ccc;
		text-align: center;
	}

	.section>view {
		width: 150rpx;
		height: auto;
	}

	.section>view>image {
		width: 150rpx;
		height: 150rpx;
		font-size: 0;
		background: #2C405A;
	}

	.section>view>text {
		font-size: 26rpx;
	}

	.hotMoney {
		width: 650rpx;
		padding: 25rpx;
		background: white;
		margin-top: 25rpx;
		border-radius: 12rpx;
	}

	.hm_title {
		width: 100%;
		height: 30rpx;
		font-size: 30rpx;
		line-height: 30rpx;
		display: flex;
		align-items: flex-start;
	}

	.hm_title::after {
		content: "HOT";
		/* width: 50rpx;
		height: 24rpx; */
		line-height: 15rpx;
		background: linear-gradient(to bottom right, #f84a43, #ec2820);
		color: white;
		border-radius: 10rpx 0 10rpx 0;
		font-size: 14rpx;
		padding: 5rpx;
		padding-right: 8rpx;
		font-style: italic;
		margin-left: 10rpx;
	}

	.hm_content {
		margin-top: 25rpx;
		width: 100%;
		overflow-x: scroll;
		overflow-y: hidden;
	}

	.hm_content_xscroll {
		display: flex;
		justify-content: space-between;
	}

	.hm_content_xscroll>.item {
		width: 244rpx;
		height: auto;
	}

	.hm_content_xscroll>.item>.image {
		width: 100%;
		position: relative;
		font-size: 0;
	}

	.hm_content_xscroll>.item>.image::before {
		content: "店长点赞";
		width: 100rpx;
		height: 34rpx;
		line-height: 34rpx;
		background: #fd4c4c;
		color: white;
		font-size: 20rpx;
		text-align: center;
		position: absolute;
		right: 0px;
		bottom: 0px;
		z-index: 1;
		border-radius: 10rpx 0 0 0;
	}

	.hm_content_xscroll>.item image {
		width: 244rpx;
		height: 244rpx;
		background: #2C405A;
		font-size: 0;
	}

	.hm_content_xscroll>.item>.name {
		width: 244rpx;
		font-size: 26rpx;
		display: block;
		font-weight: bold;
		padding: 10rpx 0;
	}

	.hm_content_xscroll>.item>.worth {
		width: 244rpx;
		font-size: 26rpx;
		display: block;
		color: #e72722;
		font-weight: bold;
	}

	.forYou {
		width: 700rpx;
		height: auto;
		margin: 0 auto;
		margin-top: 10rpx;
	}

	.fy_title {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx 0;
	}

	.fy_title>.left1,
	.right2 {
		width: 8rpx;
		height: 14rpx;
		background: linear-gradient(to bottom right, #f84a43, #ec2820);
		margin: 0 6rpx;
		border-radius: 4rpx;
	}

	.fy_title>.left2,
	.right1 {
		width: 8rpx;
		height: 22rpx;
		background: linear-gradient(to bottom right, #f84a43, #ec2820);
		margin: 0 6rpx;
		border-radius: 4rpx;
	}

	.fy_title>text {
		font-size: 36rpx;
		font-weight: bold;
		display: inline-block;
		margin: 0 10rpx;
	}

	.fy_content {
		width: 100%;
		height: auto;
		position: relative;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.fy_content>.box {
		width: 304rpx;
		padding: 20rpx;
		height: auto;
		float: left;
		background: white;
		border-radius: 10rpx;
		margin-bottom: 10rpx;
	}

	.fy_content>.box>.image {
		width: 100%;
		position: relative;
		font-size: 0;
	}

	.fy_content>.box image {
		width: 100%;
		/* height: 244rpx; */
		background: #2C405A;
		font-size: 0;
	}

	.fy_content>.box>.name {
		width: 244rpx;
		font-size: 26rpx;
		display: block;
		font-weight: bold;
		padding: 10rpx 0;
	}

	.fy_content>.box>.label {
		width: 100%;
		height: auto;
		padding: 0 0 10rpx 0;
	}

	.fy_content>.box>.label>text {
		background: #fff4f4;
		color: #e72722;
		font-size: 20rpx;
		padding: 5rpx 10rpx;
		margin-right: 10rpx;
		border-radius: 5rpx;
		display: inline-block;
		float: left;
	}

	.fy_content>.box>.worth {
		width: 244rpx;
		font-size: 26rpx;
		display: block;
		color: #e72722;
		font-weight: bold;
	}

	.bottomLine {
		width: 100%;
		text-align: center;
		font-size: 24rpx;
		color: #8a8a8a;
		line-height: 80rpx;
	}
</style>
