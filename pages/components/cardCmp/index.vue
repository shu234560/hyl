<template>
	<view class="item">
		<view class="top"  @click="goAddWishView">
			<text>{{info.username}}{{info.isopen == 1? '' :'(仅自己可见)'}}：</text>
			<text class="time">{{info.createtime.split('T')[0]}} {{info.createtime.split('T')[1].split('.')[0]}}</text>
		</view>
		<view class="center"  @click="goAddWishView">
			{{info.text}}
		</view>
		<view class="bottom">
			<view>
				<img :src="info.userImag" alt="1">
				<text>{{info.name}}</text>
			</view>
			<view v-if="!editStatus" class="btn"
				:style="{background:info.isfinish === 1?'pink':'rgba(0, 122, 255, .8)'}">
				<view v-if="info.isfinish == 1" @click="finishClick">
					已达成
				</view>

				<view v-else-if="blessArr.includes(info.id)" @click="overBless" class="btn yzf">
					已祝福
				</view>
				<view @click.stop.prevent="$emit('blessClick',index)" v-else>
					祝福
				</view>
			</view>
			<view v-if="editStatus" class="btn"
				:style="{background:info.isfinish === 1?'pink':'rgba(0, 122, 255, .8)'}" @click="() => { info.isfinish !== 1 && $emit('isfinishClick',index)}">
				{{info.isfinish == 1 ? '已达成':'确认达成'}}
			</view>
			<view v-if="editStatus" class="btn" :style="{background:'#bb3733'}" @click="$emit('delete',index)">
				删除
			</view>
			<view class="love" style="width: 180rpx;">
				<text>❤</text>
				祝福值×{{info.blessnum}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			editStatus: {
				type: Boolean,
				default: false
			},
			info: {
				type: Object,
				default: () => ({
					text: '我想要。。。。',
					createtime: '2020-10-10T10:00:00',
					username: 'myShu',
					userImag: require('../../../static/logo.png'),
					blessnum: 0,
					isFinish: 0,
					id: ''
				})
			},
			index: {
				type: Number,
				default: 0
			},
			blessArr: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {}
		},
		methods: {
			goAddWishView() {
				uni.navigateTo({
					url: `/pages/editInfo/index?id=${this.info.id}`
				})
			},
			overBless(){
				uni.showToast({
					title: '您已祝福过啦',
					icon: 'none'
				})
			},
			finishClick(){
				uni.showToast({
					title: '心愿以达成，无需祝福',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss">
	.item {
		max-height: 310rpx;
		box-shadow: 0 0rpx 18rpx #ccc;
		border-radius: 10rpx;
		margin: 32rpx;
		display: flex;
		flex-direction: column;
		padding: 0rpx 20rpx;
		color: #ccc;
		background: rgba(0, 0, 0, .2);

		.top,
		.bottom {
			height: 70rpx;
			line-height: 70rpx;
			display: flex;
			padding: 0 10rpx;
		}

		.top {
			border-bottom: 1px solid #696767;
			justify-content: space-between;
		}

		.bottom {
			border-top: 1px solid #696767;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			justify-content: space-around;

			image {
				width: 28rpx;
				height: 28rpx;
				vertical-align: middle;
				margin-right: 10rpx;
			}

			view {
				display: flex;
				align-items: center;
			}

			.btn {
				background: rgba(0, 122, 255, .8);
				height: 45rpx;
				width: 140rpx;
				border-radius: 20rpx;
				display: flex;
				justify-content: center;
				color: #fff;
			}

			.love {
				text {
					color: #cc1d1d;
					margin-right: 6rpx;
				}
			}
		}

		.center {
			flex: 1;
			margin: 20rpx;
			display: flex;
			align-items: center;
			white-space: pre-wrap;
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical; // 在父元素设置,子元素的排列方式/vertical(垂直)
			-webkit-line-clamp: 3; // 只显示2行
		}

		.time {
			font-size: 26rpx;
			color: #ccc;
		}

		.yzf {
			background: #ccc !important;
		}
	}
</style>
