<template>
	<view class="addInfo" @click="goAddWishView">
		<view>
			+
		</view>
		添加
		<view>
		祝福
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		props: {
			type: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				timer:null
			}
		},
		onLoad() {

		},
		computed: {
			...mapGetters(['userInfo'])
		},
		mounted(){
		},
		methods: {
			goAddWishView() {
				if (this.userInfo.username) {
					uni.navigateTo({
						url: `/pages/addWish/index?type=${this.type}`
					})
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					this.timer = setTimeout(function() {
						uni.redirectTo({
							url: `/pages/personalInfo/index`
						})
					}, 500);
					
				}
			},
		},
		destroyed(){
			if(this.timer){
				clearTimeout(this.timer)
				this.timer = null
			}
		}
	}
</script>

<style lang="scss">
	.addInfo {
		position: absolute;
		bottom: 48%;
		right: 10rpx;
		color: #fff;
		border: #007aff;
		width: 100rpx;
		height: 100rpx;
		box-shadow: 0 0rpx 10rpx #fff;
		border-radius: 50%;
		line-height: 30rpx;
		background: pink;
		font-size: 26rpx;
		text-align: center;
		z-index: 99;
		opacity: .8;
	}
</style>
