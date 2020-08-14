<template>
	<view class="content">
		<!--没有东西-->
		<view class="nothings" v-if="cartList.length===0">
			<view class="image">
				<image src="../../static/cart-grey.png" mode="widthFix"></image>
			</view>
			<text>购物车还是空的</text>
		</view>
		<!--有东西-->
		<view class="things" v-if="cartList.length>0">
			<view class="item clearfix" v-for="(spitem,spindex) in cartList" :key="spindex">
				<view :class="['select',spitem.selected==true?'active':'']" :data-index="spindex" @tap="itemSelect"></view>
				<view class="image">
					<image :src="getURL(spitem.icon)" mode="widthFix"></image>
				</view>
				<view class="info">
					<text class="name">{{spitem.productName}}</text>
					<view class="model" :data-index="spindex" @tap="showGuige">
						<!--当前选的规格型号的text-->
						{{spitem.selectValueArr.toString()}}
					</view>
					<view class="worth">￥{{spitem.price}}元</view>
				</view>
				<!--数量-->
				<view class="number">
					<view class="left" :data-index="spindex" @tap="jianNumber">
						-
					</view>
					<view class="middle">
						{{spitem.number}}
					</view>
					<view class="right" :data-index="spindex" @tap="jiaNumber">
						+
					</view>
				</view>
			</view>
		</view>
		<!--结算底部-->
		<view class="board" v-if="cartList.length">
			<view class="selectFa clearfix">
				<view :class="['select',isAllSelected==true?'active':'']" @tap="allSelected"></view>
				<view class="text" @tap="allSelected">全选</view>
			</view>
			<view class="money" @tap="jiesuan">
				结算({{totalMoney}}元)
			</view>
			<view class="delete" @tap="deleteSelectItem">
				删除
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
				title: "Hello",
				cartList: [{ //这个商品
					"productId": 1, //商品id
					"productName": "虎王坦克",
					"icon": "",
					"specifications": [{
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
					"difference": [
						//所有的规格可能情况都在这个数组里
						{
							id: 19,
							price: 5000,
							stock: 5, //库存
							difference: "原装发动机,坦克出厂原漆" //此规格的属性键值
						},
						{
							id: 20,
							price: 6000,
							stock: 4,
							difference: "原装发动机,现代数码迷彩"
						},
						{
							id: 21,
							price: 7000,
							stock: 3,
							difference: "高性能发动机,坦克出厂原漆"
						},
						{
							id: 22,
							price: 8000,
							stock: 0,
							difference: "高性能发动机,现代数码迷彩"
						}
					],
					"selectValueArr": ["原装发动机", "坦克出厂原漆"], //存放当前被选中的值
					//"selectIndexArr": [0, 0], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
					"specId": null, //当前选中规格搭配的id
					"price": 5000, //当前所选规格的价格
					"maxNumber": 0, //当前规格能购买的最大数量
					"number": 1, //要购买的数量
					"selected": true, //是否已被选择
				}],
				/*商品规格*/
				isGuigeModelShow: false, //设置商品规格的面板是否显示
				shopItemInfo: {}, //存放要和选中的值进行匹配的数据,从商品中取出来的
				specifications: [], //商品规格,从商品中取出来的
				productId: 0, //当前操作规格的商品的id
				productName: "", //当前操作规格的商品名称
				price: 0, //当前规格的钱
				maxNumber: 0,
				selectValueArr: ["原装发动机", "坦克出厂原漆"], //存放当前被选中的值，从商品中取出来的
				//selectIndexArr: [0, 0], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断,从商品中取出来的
				specId: null, //当前选中规格搭配的id
				productIndex: null, //当前选择规格的产品在cartlist中的坐标，
				/*商品规格*/
				isAllSelected: true, //是否已全选
				totalMoney: 0, //总金额
			}
		},
		onLoad() {
			// this.checkGuige();
			// this.cartList = this.$store.state.cartList;
			// this.checkSelect(); //检测是否都选上了
			// this.countMoney();
		},
		onShow(){
			this.cartList = this.$store.state.cartList;
			this.checkSelect(); //检测是否都选上了
			this.countMoney();
		},
		methods: {
			//选择该商品，或取消选择
			itemSelect(e) {
				let item = this.cartList[e.currentTarget.dataset.index];
				//console.log(e.currentTarget.dataset)
				item.selected = item.selected ? false : true;
				//console.log(item);
				this.cartList[e.currentTarget.dataset.index] = item;
				
				this.checkSelect(); //检测是否全选
				this.countMoney(); //算钱
			},
			//减这个商品的数量
			jianNumber(e) {
				let item = this.cartList[e.currentTarget.dataset.index];
				if (item.number > 1) {
					item.number = item.number - 1
					this.cartList[e.currentTarget.dataset.index] = item;
				}
				
				//这里需要有操作-同步vuex里cartlist的操作
				this.$store.commit('setCartItem',{"index":e.currentTarget.dataset.index,"item":item});
				this.cartList = this.$store.state.cartList;
				
				this.countMoney();
			},
			//加这个商品的数量
			jiaNumber(e) {
				let item = this.cartList[e.currentTarget.dataset.index];
				if (item.number < item.maxNumber) {
					item.number = item.number + 1
					this.cartList[e.currentTarget.dataset.index] = item;
				}
				
				//这里需要有操作-同步vuex里cartlist的操作
				this.$store.commit('setCartItem',{"index":e.currentTarget.dataset.index,"item":item});
				this.cartList = this.$store.state.cartList;
				
				this.countMoney();
				
			},
			//显示选择规格型号面板
			showGuige(e) {
				let item = this.cartList[e.currentTarget.dataset.index];
				let obj = {};
				//遍历sku
				for (var i in item.difference) {
					//修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
					//键：由属性拼接而成，值：相对应sku的信息
					obj[item.difference[i].difference] = item.difference[i];
				}
				this.shopItemInfo = obj;
				//console.log(this.shopItemInfo);
				this.productIndex = e.currentTarget.dataset.index;
				this.specifications = item.specifications;
				this.selectValueArr = item.selectValueArr;
				//this.selectIndexArr = item.selectIndexArr;
				this.productName = item.productName;
				this.productId = item.productId;
				this.specId = item.specId;
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
				//let len = this.cartList.length;
				// for (let i = 0; i < len; i++) {
				// 	if (this.cartList[i].productId === this.productId&&this.cartList[i].specId === this.specId) {
				// 		this.cartList[i].price = this.price;
				// 		this.cartList[i].maxNumber = this.maxNumber;
				// 		this.cartList[i].selectValueArr = this.selectValueArr;
				// 		//this.cartList[i].selectIndexArr = this.selectIndexArr;
				// 		//this.cartList[i].specId = this.specId;
				// 	}
				// }
				this.cartList[this.productIndex].price = this.price;
				this.cartList[this.productIndex].maxNumber = this.maxNumber;
				this.cartList[this.productIndex].selectValueArr = this.selectValueArr;
				this.cartList[this.productIndex].specId = this.specId;
				
				//这里需要有操作-同步vuex里cartlist的操作
				this.$store.commit('setCartItem',{"index":this.productIndex,"item":this.cartList[this.productIndex]});
				this.cartList = this.$store.state.cartList;
				
				
				this.countMoney();
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
					this.maxNumber = this.shopItemInfo[result].stock || 0;
					this.specId = this.shopItemInfo[result].id; //赋值当前规格搭配的id
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
				this.specifications = null;
				this.selectValueArr = null;
				//this.selectIndexArr = null;
				this.productName = null;
				this.productId = null;
				this.specId = null;
				this.isGuigeModelShow = false;
			},
			//点击的全选按钮
			allSelected() {
				let cartList = this.cartList;
				let len = cartList.length;
				if (this.isAllSelected === true) {
					//已全选，则变成全不选
					for (let i = 0; i < len; i++) {
						cartList[i].selected = false;
					};
					this.isAllSelected = false;
				} else {
					//未全选，则变全选
					for (let i = 0; i < len; i++) {
						cartList[i].selected = true;
					};
					this.isAllSelected = true;
				}
				this.countMoney();
			},
			//检查cartlist是否都已选上了
			checkSelect() {
				let cartList = this.cartList;
				let len = cartList.length;
				let add = 0;
				if (len === 0) {
					this.isAllSelected = false;
				} else {
					for (let i = 0; i < len; i++) {
						if (cartList[i].selected == true) {
							add = add + 1;
						};
						if (i == len - 1) {
							if (add === len) {
								this.isAllSelected = true;
							} else {
								this.isAllSelected = false;
							}
						}
					};
				}
			},
			//算钱
			countMoney() {
				let cartList = this.cartList;
				let len = cartList.length;
				let totalMoney = 0;
				for (let i = 0; i < len; i++) {
					if (cartList[i].selected == true) {
						totalMoney += cartList[i].price * cartList[i].number
					}
					if (i == len - 1) {
						this.totalMoney = totalMoney;
					}
				};
			},
			//删除选中的
			deleteSelectItem() {
				let _this = this;
				let cartList = this.cartList;
				let len = cartList.length;
				for (let i = 0; i < len; i++) {
					if (cartList[i].selected == true) {
						_this.$store.commit('delCartItem', {
							productId: cartList[i].productId,
							specId: cartList[i].specId
						});
					}
				};
				this.cartList = _this.$store.state.cartList;
			},
			//结算
			jiesuan(){
				let cartList = this.$store.state.cartList;
				let len = cartList.length;
				console.log(cartList);
				//找选中的
				let num = 0;
				for(var i=0;i<len;i++){
					if(cartList[i].selected){
						num++;
					}
				}
				if(i==len){
					if(num>0){
						uni.navigateTo({
							url:"../createOrder/createOrder"
						});
					}
				}
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100vh;
		border-top: 1rpx solid #f0f0f0;
		box-sizing: border-box;
		position: relative;
	}

	.nothings {
		width: 100%;
		height: 100%;
		background: #f7f7f7;
		overflow: hidden;
	}

	.nothings>.image {
		width: 156rpx;
		height: auto;
		margin: 0 auto;
		margin-top: 104rpx;
	}

	.nothings>.image>image {
		width: 100%;
		font-size: 0;
	}

	.nothings>text {
		display: block;
		font-size: 26rpx;
		color: #9c9c9c;
		text-align: center;
		margin-top: 36rpx;
	}

	.things {
		width: 100%;
		height: calc(100% - 112rpx);
		background: #f7f7f7;
		overflow-y: scroll;
	}

	.things>.item {
		width: 100%;
		height: 238rpx;
		background: white;
		border-bottom: 1rpx solid #e0e0e0;
		position: relative;
	}

	.things>.item>.select {
		width: 44rpx;
		height: 44rpx;
		margin: 96rpx 32rpx;
		float: left;
		border: 1rpx solid #d5d5d5;
		border-radius: 50%;
	}

	.things>.item>.active {
		border: 1rpx solid #d52a26;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.things>.item>.active::before {
		content: "";
		display: block;
		width: 30rpx;
		height: 30rpx;
		background: #d52a26;
		border-radius: 50%;
	}

	.things>.item>.image {
		width: 148rpx;
		height: 148rpx;
		border: 1rpx solid #d5d5d5;
		float: left;
		margin: 44rpx 32rpx;
		display: flex;
		align-items: center;
	}

	.things>.item>.image>image {
		width: 148rpx;
		height: auto;
		background: #2C405A;
	}

	.things>.item>.info {
		width: 424rpx;
		height: 160rpx;
		margin: 36rpx 0;
		float: left;
	}

	.things>.item>.info>.name {
		display: block;
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 24rpx;
	}

	.things>.item>.info>.model {
		display: inline-block;
		width: auto;
		line-height: 46rpx;
		background: #f5f5f5;
		color: #5c5c5c;
		font-size: 22rpx;
		height: 46rpx;
		margin: 16rpx 0;
		padding: 0 16rpx;
	}

	.things>.item>.info>.model::after {
		content: "∨";
		margin-left: 5rpx;
	}

	.things>.item>.info>.worth {
		color: #d52a26;
		font-size: 24rpx;
	}

	.things>.item>.number {
		width: 170rpx;
		height: 54rpx;
		border: 1rpx solid #f0f0f0;
		position: absolute;
		bottom: 45rpx;
		right: 34rpx;

	}

	.things>.item>.number>.left,
	.right {
		width: 54rpx;
		height: 54rpx;
		float: left;
		line-height: 54rpx;
		text-align: center;
		font-size: 26rpx;
		color: #4f4f4f;
		float: left;
	}

	.things>.item>.number>.middle {
		width: 54rpx;
		height: 54rpx;
		border-left: 1rpx solid #f0f0f0;
		border-right: 1rpx solid #f0f0f0;
		float: left;
		line-height: 54rpx;
		text-align: center;
		font-size: 26rpx;
	}

	.content>.board {
		width: 100%;
		height: 110rpx;
		border-top: 1rpx solid #f0f0f0;
		background: white;
	}

	.board>.selectFa {
		float: left;
	}

	.board>.selectFa>.select {
		width: 44rpx;
		height: 44rpx;
		float: left;
		margin: 32rpx 32rpx;
		border: 1rpx solid #d5d5d5;
		border-radius: 50%;
		margin-right: 18rpx;
	}

	.board>.selectFa>.active {
		border: 1rpx solid #d52a26;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.board>.selectFa>.active::before {
		content: "";
		display: block;
		width: 30rpx;
		height: 30rpx;
		background: #d52a26;
		border-radius: 50%;
	}

	.board>.selectFa>.text {
		line-height: 110rpx;
		height: 110rpx;
		font-size: 30rpx;
		float: left;
	}

	.board>.delete {
		width: 100rpx;
		height: 110rpx;
		line-height: 110rpx;
		font-size: 30rpx;
		text-align: center;
		float: right;
		margin-right: 20rpx;
	}

	.board>.money {
		display: inline-block;
		height: 110rpx;
		line-height: 110rpx;
		font-size: 30rpx;
		padding: 0 20rpx;
		background: #d52a26;
		color: white;
		float: right;
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
