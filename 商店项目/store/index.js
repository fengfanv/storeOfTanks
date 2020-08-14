import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		product: null, //产品列表
		cartList: [], //购物车list
		isLogin:false,//用户登录状态
		userId:null,
	},
	mutations: {
		//设置产品列表
		setProduct(state, list = null) {
			state.product = list;
		},
		//添加产品进购物车
		addCart(state, obj) {
			// console.log('添加前：');
			// console.log(JSON.parse(JSON.stringify(state.cartList)));
			if (obj) {
				state.cartList.push(obj);
			};
			// console.log('添加后：');
			// console.log(JSON.parse(JSON.stringify(state.cartList)));
			//校验程序，重复的组合，不重复的添加
			let cartList = JSON.parse(JSON.stringify(state.cartList));
			let len = cartList.length;
			let newarr = [];
			cartList.forEach(function(iitem, i) {
				let productObj = JSON.parse(JSON.stringify(cartList[i]));
				if (cartList[i].isCheck == undefined || cartList[i].isCheck != true) {
					cartList[i].isCheck = true; //标记是否已检测
					let statusArr = []; //用于装重复项的坐标值
					cartList.forEach(function(jitem, j) {
						if (i != j) {
							if (cartList[j].productId == productObj.productId && cartList[j].specId == productObj.specId) {
								statusArr.push(j);
							}
						}
					});
					let statusArrLen = statusArr.length;
					let number = productObj.number;
					statusArr.forEach(function(kitem, k) {
						cartList[statusArr[k]].isCheck = true; //标记是否已检测
						number = number + cartList[statusArr[k]].number;
					})
					productObj.number = number;
					newarr.push(productObj);
				}
			});
			uni.showToast({
				title: '添加成功',
				icon: 'success',
				duration: 2000
			})
			// console.log('处理后：');
			// console.log(JSON.parse(JSON.stringify(newarr)));
			//检测完毕，重新赋值
			state.cartList = newarr;
		},
		//删除购物车里的产品
		delCartItem(state, action) {
			//let cartList = state.cartList;
			//console.log(action);
			let len = state.cartList.length;
			let index = null;
			for (let i = 0; i < len; i++) {
				if (state.cartList[i].productId == action.productId && state.cartList[i].specId == action.specId) {
					//state.cartList.splice(i, 1);
					index = i;
					break;
				}
			};
			state.cartList.splice(index, 1);
			//state.cartList = cartList;
		},
		//设置CartItem
		setCartItem(state,action){
			state.cartList[action.index] = action.item;
			
			//校验程序，重复的组合，不重复的添加
			let cartList = JSON.parse(JSON.stringify(state.cartList));
			let len = cartList.length;
			let newarr = [];
			cartList.forEach(function(iitem, i) {
				let productObj = JSON.parse(JSON.stringify(cartList[i]));
				if (cartList[i].isCheck == undefined || cartList[i].isCheck != true) {
					cartList[i].isCheck = true; //标记是否已检测
					let statusArr = []; //用于装重复项的坐标值
					cartList.forEach(function(jitem, j) {
						if (i != j) {
							if (cartList[j].productId == productObj.productId && cartList[j].specId == productObj.specId) {
								statusArr.push(j);
							}
						}
					});
					let statusArrLen = statusArr.length;
					let number = productObj.number;
					statusArr.forEach(function(kitem, k) {
						cartList[statusArr[k]].isCheck = true; //标记是否已检测
						number = number + cartList[statusArr[k]].number;
					})
					productObj.number = number;
					newarr.push(productObj);
				}
			});
			state.cartList = newarr;
			console.log(state.cartList);
		},
		//设置用户id
		setUserId(state,value){
			if(value){
				state.userId = value;
			}
		},
		//设置登录状态
		setIsLogin(state,status){
			state.isLogin = status;
		}
		

	},
	actions: {

	}
})

export default store
