<template>
	<view class="content">
		<qf-image-cropper @crop="handleCrop">
			<view class="upload-imgae">
				<view v-if="!avatarUrl">
					+
				</view>
				<image class="image" v-if="avatarUrl" :src="avatarUrl"></image>
			</view>
		</qf-image-cropper>
		<input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="niclName" />
		<button class="btn" type="primary" @click="getUsers">{{type === 'edit'?'修改':'登录'}}</button>
	</view>
</template>

<script>
	import QfImageCropper from '../components/qf-image-cropper/qf-image-cropper.vue';
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				avatarUrl: undefined,
				niclName: '',
				type: ''
			}
		},
		onLoad(option) {
			if (option.type === 'edit') {
				this.avatarUrl = this.userInfo.userImag
				this.niclName = this.userInfo.username
				this.type = option.type
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		components: {
			QfImageCropper
		},
		methods: {
			...mapActions(['setUser', 'addUserInfo']),
			...mapMutations(['setInfoData']),
			async handleCrop(e) {
				uni.showLoading({
					title: '加载中'
				})
				// 裁剪后图片的本地地址
				try {
					console.log('1111111')
					await this.uploadImage(e.tempFilePath)
				} catch (e) {
					//TODO handle the exception
				}
				uni.hideLoading();
			},
			// 上传图片
			uploadImage(tempFilePath) {
				let that = this
				return new Promise((res, rej) => {
					uni.uploadFile({
						url: this.$baseDev + '/postfile',
						method: "POST",
						filePath: tempFilePath,
						name: 'file',
						success(uploadFileRes) {
							const data = JSON.parse(uploadFileRes.data).location
							that.avatarUrl = data
							res()
						}
					})
				})

			},
			// 手动登录
			async getUsers() {
				if (!this.avatarUrl || !this.niclName) {
					return uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
				}
				try {
					if (this.type === 'edit') {
						const {
							data: {
								userInfo
							}
						} = await this.$http('/edit', {
							username: this.niclName,
							userImag: this.avatarUrl,
							openid:this.userInfo.openid
						}, 'Post')
						console.log(userInfo);
						this.setInfoData(userInfo)
						uni.switchTab({
						    url:`/pages/login/login`  
						})
					} else {
						// 保存信息
						await this.setUser({
							avatarUrl: this.avatarUrl,
							nickName: this.niclName
						})
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}

			}
		},

	}
</script>

<style lang="scss">
	.content {
		text-align: left;
		background: linear-gradient(to bottom, #606065 0%, #4a4545 50%, #5d5b5b 80%, #4b4b4e 100%);
		height: 100vh;

		.upload-imgae {
			width: 300rpx;
			height: 300rpx;
			margin: 0 auto;
			background: rgb(255, 255, 255);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 100rpx;
			color: #bbbaba;
			border-radius: 20rpx;
		}

		.image {
			width: 300rpx;
			height: 300rpx;
			margin: 0 auto;
			border-radius: 20rpx;
		}

		.weui-input {
			margin: 40rpx 100rpx;
			background: #fff;
			border-radius: 20px;
			padding-left: 40rpx;
			line-height: 30px;
			height: 72rpx;
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
			bottom: 160rpx;
		}
	}
</style>
