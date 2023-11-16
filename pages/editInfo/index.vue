<template>
	<view class="content">
		<view class="text-area">
			<view class="info-text">
				<img :src="userImag" alt="">
				<text>{{username}}</text>
			</view>
		</view>
		<view class="login-content">
			{{text}}
			<view class="boxs">
				祝福者:
				<template v-if="listArr.length">
					<view v-for="(item,index) in listArr" :key="index" class="item">
						<image :src="item.userImag" alt="">
						<text>{{item.username}}</text>
					</view>
				</template>
				<template v-else>
					<view class="item">
						暂无
					</view>
				</template>
				
			</view>
			<starrySkyBg />
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import starrySkyBg from '../components/starrySkyBg/index.vue';
	export default {
		components: {
			starrySkyBg
		},
		data() {
			return {
				listArr: [],
				username:'',
				text:'',
				userImag:''
			}
		},
		onLoad(options) {
			this.getData(options.id)
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		mounted() {
		},
		methods: {
			async getData(id) {
				try {
					const {
						data:{
							data
						}
					} = await this.$http('/homeInfoQueryById', {id}, 'Get');
					this.username = data.username
					this.userImag = data.userImag
					this.text = data.text
					this.listArr = data.blessDataArr
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

		height: 100vh;
		display: flex;
		flex-direction: column;

		.login-content {
			flex: 1;
			position: relative;
			z-index: 9;
			background: linear-gradient(to bottom, #606065 0%, #4a4545 50%, #5d5b5b 80%, #4b4b4e 100%);
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			margin-top: -30rpx;
			overflow: hidden;
			color: #fff;
			padding: 30rpx;

			.boxs {
				margin-top: 20px;
				display: flex;
				flex-wrap: wrap;
				color: #fb4040;
			}

			.item {
				display: flex;
				align-items: center;
				color: pink;
				margin-left: 20rpx;
				margin-bottom: 20rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					vertical-align: middle;
					margin-right: 10rpx;
					border-radius: 50%;
				}
			}
		}

		.text-area {
			height: 160rpx;
			background: linear-gradient(to bottom, #332f2f 0%, #4a4545 100%);
			position: relative;
			z-index: 9;
			padding-left: 50rpx;

			.info-text {
				display: flex;
				align-items: center;

				text {
					color: #fff;
					font-size: 40rpx;
					font-weight: bold;
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-left: 30rpx;
					letter-spacing: 4rpx;
				}
			}

			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
	}
</style>
