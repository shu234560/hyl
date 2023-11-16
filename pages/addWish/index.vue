<template>
	<view class="addWish">
		<view class="sds-bg">
			<image class="image" src="../../static/sds.jpg"></image>
		</view>
		<view class="uni-textarea">
			<textarea v-model="text" placeholder-style="color:pink" placeholder="输入心愿❤" />
		</view>
		<view class="uni-radio">
			<label class="radio" @click="changeRadio(1)">
				<radio :value="0" :checked="current === 1" />全部可见
			</label>
			<label class="radio" @click="changeRadio(0)">
				<radio :value="1" :checked="current === 0" />仅自己可见
			</label>
		</view>
		<view class="btn" v-if="isLoading">
			发送
		</view>
		<view class="btn" v-else @click="submit">
			发送
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				current: 1,
				text: '',
				isLoading:false,
				type:''
			}
		},
		onLoad(e) {
			this.type = e.type
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			changeRadio(item) {
				this.current = item
			},
			async submit() {
				this.isLoading = true
				if (this.text.trim() === '') {
					this.isLoading = false
					return uni.showToast({
						title: '请填写心愿',
						icon: 'none'
					})
				}
				try {
					const {
						data:{
							msg
						}
					} = await this.$http('/homeInfoAdd', {
						openid:this.userInfo.openid,
						username:this.userInfo.username,
						userImag:this.userInfo.userImag,
						text:this.text,
						blessnum:0,
						isfinish:0,
						isopen:this.current
					}, 'Post')
					this.isLoading = false
					if(msg === '成功'){
						uni.showToast({
							title: '添加成功',
							icon: 'none'
						})
						uni.switchTab({
						    url:this.type === 'index'? '/pages/index/index' :'/pages/login/login'
						})
						uni.$emit('refresh',{refresh:true})
					}else{
						uni.showToast({
							title: '异常',
							icon: 'none'
						})
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}

			}
		}
	}
</script>

<style lang="scss">
	.addWish {
		width: 100%;
		height: 100%;

		.sds-bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.uni-textarea {
			margin: 48rpx;

			textarea {
				width: 620rpx;
				height: 500rpx;
				padding: 20rpx;
				background: rgba(0, 0, 0, .5);
				border-radius: 17rpx;
				color: #fff !important;
				overflow-y: auto !important;
				box-shadow: 0 0 10rpx rgba(0, 0, 0, .5);
			}
		}

		.uni-radio {
			display: flex;
			padding: 0 40rpx;
			justify-content: space-around;
			color: #fff;
		}

		.btn {
			position: absolute;
			background: rgb(0, 122, 255);
			box-shadow: 0 0 20rpx rgb(0, 122, 255);
			height: 80rpx;
			border-radius: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			margin: 0 154rpx;
			width: 60%;
			bottom: 200rpx;
		}
	}
</style>
