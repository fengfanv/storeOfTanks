<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	*{
		margin: 0;
		padding: 0;
	}
	page{
		background: #f5f5f5;
	}
	.clearfix:after,.clearfix:before{content: "";display: table;}
	.clearfix:after{clear: both;}
	.clearfix{zoom:1;}
</style>
