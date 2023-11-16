<template>
	<view class="content">
		<view class="text-area">
			<view v-if="userInfo.username" class="info-text" @click="infoEdit">
				<img :src="userInfo.userImag" alt="">
				<text>{{userInfo.username}}</text>
			</view>
			<view v-else class="info-text" @click="goLogin">
				<img src="@/static/tx.jpg" alt="">
				<text>登录</text>
			</view>
		</view>
		<view class="login-content">
			<scroll-view scroll-y scroll-with-animation="true" class="scroll-Y" 
			 :refresher-enabled="true" :refresher-triggered="triggered"
				refresher-default-style="white" @refresherrefresh="onRefresh" @scrolltolower='scrolltolower'>
				<CardCmp v-for="(item,index) in list" :info="item" :index='index' :editStatus='true' :key="index"
				@isfinishClick='isfinishClick'
					types='edit'
				 @delete='deleteClick' />
				<view class="loading" v-if="tolowerLoading">
					加载中...
				</view>
			</scroll-view>
			<starrySkyBg />
		</view>
		<addInfoBtn />

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import addInfoBtn from '../components/addInfoBtn/index.vue';
	import starrySkyBg from '../components/starrySkyBg/index.vue';
	import CardCmp from '../components/cardCmp/index.vue';
	export default {
		components: {
			addInfoBtn,
			starrySkyBg,
			CardCmp
		},
		data() {
			return {
				list: [],
				pageNum: 1,
				total: 0,
				pageSize: 100,
				tolowerLoading: false,
				triggered: false, // 下拉刷新
			}
		},
		onLoad() {},
		computed: {
			...mapGetters(['userInfo'])
		},
		onShow() {
			if (this.userInfo.username) {
				this.getData(1)
			}
		},
		methods: {
			goLogin() {
				uni.redirectTo({
					url: `/pages/personalInfo/index`
				})
			},
			infoEdit(){
				console.log('1111111');
				uni.redirectTo({
					url:`/pages/personalInfo/index?type=edit`
				})
			},
			// 确定达成
			isfinishClick(index){
				uni.showModal({
					title: '提示',
					content: '确定达成',
					success:  async (res) => {
						if (res.confirm) {
							const {data} = await this.$http('/homeInfoUpdate',{isfinish:1,id:this.list[index].id},'Post');
							this.$set(this.list,index,{...this.list[index],isfinish:1})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 删除数据
			deleteClick(index){
				uni.showModal({
					title: '提示',
					content: '确定删除?',
					success:  async (res) => {
						if (res.confirm) {
							const {data} = await this.$http('/homeInfoDelete',{id:this.list[index].id},'Get');
							this.list = this.list.filter(item => item.id !== this.list[index].id)
							uni.showToast({
								title: '删除成功',
								duration: 1000
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async getData(type) {
				if (type === 1) {
					this.pageNum = 1
				}
				try {
					const {
						data: {
							data: {
								list,
								total
							}
						}
					} = await this.$http('/homeInfoQuery', {
						openid: this.userInfo.openid,
						pageNum: this.pageNum,
						pageSzie: this.pageSize
					}, 'Get')
					this.total = total
					// 获取data
					if (type === 1) {
						// 下拉刷新
						this.list = list
					} else {
						this.list = [...this.list, ...list]
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
				this.tolowerLoading = false
				this.triggered = false;
			},
			// 下拉刷新
			onRefresh() {
				if (!this.triggered) {
					this.triggered = true;
					this.getData(1)
				}
			},
			scrolltolower() {
				if (this.tolowerLoading) return
				this.tolowerLoading = true
				if (this.pageNum * this.pageSize < this.total) {
					this.pageNum++
					this.getData(2)
				} else {
					this.tolowerLoading = false
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
		}

		.scroll-Y {
			height: 100%;
			position: relative;
			z-index: 10;
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

		.loading {
			color: #fff;
			text-align: center;
			line-height: 50rpx;
		}
	}
</style>
