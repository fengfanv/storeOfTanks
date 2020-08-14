<template>
	<view class="content clearfix">
		<view class="leftContent">
			<view v-for="(item,index) in showArr" :class="['item',item.active===true?'active':'']" :key="index" :data-item="item" :data-num="index" @tap="toNation" >
				<view></view>
				<text>{{item.nation}}</text>
			</view>
		</view>
		<view class="rightContent">
			<!--渲染这个国家下的每种类型-->
			<view class="group" v-for="(item,index) in rightShowArr.children" :key="index">
				<text class="rc_title">— {{item.vehicleType}} —</text>
				<view class="rc_ul clearfix">
					<!--渲染每种类型下的车-->
					<view class="rc_li" v-for="(item2,index2) in item.children" :style="{'margin-right':(index2+1)%3===0?'0':'19rpx'}" :key="index2" :data-item="item2" @tap="toProductPage">
						<view class="image">
							<image :src="getURL(item2.icon)" mode="widthFix"></image>
						</view>
						<text>{{item2.name}}</text>
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
				list:[//商品源list数据
					{
						"name":"豹一坦克",
						"nation":"德国",
						"vehicleType":"中型",
						"icon":""
					},{
						"name":"豹二坦克",
						"nation":"德国",
						"vehicleType":"中型",
						"icon":""
					},{
						"name":"虎式坦克",
						"nation":"德国",
						"vehicleType":"重型",
						"icon":""
					},{
						"name":"虎王坦克",
						"nation":"德国",
						"vehicleType":"重型",
						"icon":""
					},{
						"name":"58式",
						"nation":"中国",
						"vehicleType":"中型",
						"icon":""
					},{
						"name":"WZ111",
						"nation":"中国",
						"vehicleType":"重型",
						"icon":""
					},{
						"name":"四号坦克",
						"nation":"德国",
						"vehicleType":"中型",
						"icon":""
					}
				],
				showArr:[],//要显示的数据
				rightShowArr:null,//右边要显示的数据
			}
		},
		onLoad(){
			this.list = this.$store.state.product;
			this.work();//处理数据,并显示第一个国家的数据
			
		},
		methods: {
			
			//将单一的商品数据处理成分类需要的数据
			work(){
				//整理商品list数据，按国家进行分组
				let len = this.list.length;
				let list = this.list;
				let newArr = [];
				let nationArr = [];
				//找有几个国家
				for(let i=0;i<len;i++){
					if(nationArr.indexOf(list[i].nation)===-1){
						nationArr.push(list[i].nation)
					}
				}
				//console.log(nationArr);
				let nationArrLen = nationArr.length;
				for(let i=0;i<nationArrLen;i++){
					newArr.push({
						nation:nationArr[i],
						children:[]
					});
				};
				
				//找每个国家下有哪种类型的车辆
				for(let i=0;i<nationArrLen;i++){
					let typeArr = [];
					for(let j=0;j<len;j++){
						if(list[j].nation===newArr[i].nation){
							//用来找这个国家有几种车的类型
							if(typeArr.indexOf(list[j].vehicleType)===-1){
								typeArr.push(list[j].vehicleType)
							}
						}
					}
					newArr[i].typeArr = typeArr;
				}
				//找这个国家的这种类型的车
				for(let i=0;i<nationArrLen;i++){
					let typeArrLen = newArr[i].typeArr.length;
					for(let j=0;j<typeArrLen;j++){
						newArr[i].children.push({
							"vehicleType":newArr[i].typeArr[j],
							"children":[]
						});
						for(let k=0;k<len;k++){
							if(newArr[i].nation===list[k].nation&&newArr[i].typeArr[j]===list[k].vehicleType){
								
								newArr[i].children[j].children.push(list[k]);
							}
						}
					}
				}
				console.log(newArr);
				this.showArr = newArr;
				this.toNation({currentTarget:{dataset:{num:0,item:this.showArr[0]}}});//默认显示第一个国家的数据
			},
			//跳转（显示）国家内容
			toNation(e){
				let len = this.showArr.length;
				for(let i=0;i<len;i++){
					this.showArr[i].active = false;
				}
				this.showArr[e.currentTarget.dataset.num].active = true;
				this.rightShowArr = e.currentTarget.dataset.item;
			},
			//跳转到产品页面
			toProductPage(e){
				let data = e.currentTarget.dataset;
				let item = data.item;
				console.log(item);
				uni.navigateTo({
					"url":"../product/product?id="+item.id,
				})
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
	}

	.leftContent {
		width: 162rpx;
		height: 100%;
		overflow-y: scroll;
		border-right: 1rpx solid #f0f0f0;
		float: left;
		background: white;
	}

	.rightContent {
		width: 587rpx;
		height: 100%;
		overflow-y: scroll;
		float: left;
		background: white;
	}

	.leftContent>.item {
		width: 100%;
		height: 88rpx;
	}

	.leftContent>.item>view {
		width: 6rpx;
		height: 34rpx;
		float: left;
		margin-top: 28rpx;
	}

	.leftContent>.item>text {
		display: block;
		width: 156rpx;
		height: 88rpx;
		float: left;
		line-height: 88rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.leftContent>.active>text {
		color: #d52a26;
	}

	.leftContent>.active>view {
		background-color: #d52a26;
	}

	.rightContent>.group {
		width: 520rpx;
		height: auto;
		margin: 0 auto;
	}

	.rightContent>.group>.rc_title {
		display: block;
		width: 100%;
		line-height: 104rpx;
		text-align: center;
		font-size: 28rpx;
		color: #565656;
	}

	.rightContent>.group .rc_ul {
		width: 100%;
		height: auto;
	}

	.rightContent>.group .rc_li {
		width: 160rpx;
		height: auto;
		float: left;
		margin-right: 10rpx;
	}

	.rc_li>.image {
		width: 160rpx;
		height: 160rpx;
		background: #2C405A;
		display: flex;
		align-items: center;
	}
	.rc_li>.image>image {
		font-size: 0;
	}

	.rc_li>text {
		display: block;
		width: 100%;
		line-height: 74rpx;
		font-size: 20rpx;
		color: #5e5e5e;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
