<template>
	<view class="content">
		<view class="uni-list-cell">
			<view class="uni-list-cell-db">
				<picker class="picker" :value="searchInfo.order" @change="bindPickerChange" :range="array"
					:range-key="'name'">
					<view class="uni-input">
						<view>
							按{{array[searchInfo.order].name}}排序
						</view>
						<view>
							<text class="xia"></text>
						</view>
					</view>
				</picker>
			</view>
			<view class="uni-list-cell-db" @click="getUserInfo">
				<picker class="picker" :value="isUserIndex" @change="bindUserPickerChange" :range="arrayName"
					:range-key="'name'">
					<view class="uni-input">
						<view>
							{{arrayName[isUserIndex].name}}
						</view>
						<view>
							<text class="xia"></text>
						</view>
					</view>
				</picker>
			</view>
			<view class="uni-list-cell-db">
				<picker class="picker" :value="isFinisIndex" @change="bindCompletionStatusPickerChange"
					:range="completionStatusArr" :range-key="'name'">
					<view class="uni-input">
						<view>
							{{completionStatusArr[isFinisIndex].name}}
						</view>
						<view>
							<text class="xia"></text>
						</view>
					</view>
				</picker>
			</view>
		</view>
		<view class="inner-info">
			<scroll-view :scroll-top="scrollTop" scroll-y :refresher-enabled="true" scroll-with-animation="true"
				:refresher-triggered="triggered" class="scroll-Y" @refresherrefresh="onRefresh"
				refresher-default-style="white" @scroll="scroll" @scrolltolower='scrolltolower'>
				<CardCmp v-for="(item,index) in list" :info="item" @blessClick="blessClick" :index='index'
					:blessArr='userBlessIdArr' :key="index" />
				<view class="loading" v-if="tolowerLoading">
					加载中...
				</view>
			</scroll-view>
		</view>
		<view class="fhdw" v-if="isShowBlackTop" @click="backTop">
			<image src="../../static/fhdb.jpg"></image>
		</view>
		<addInfoBtn type='index' />
		<starrySkyBg />
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import CardCmp from '../components/cardCmp/index.vue';
	import addInfoBtn from '../components/addInfoBtn/index.vue';
	import starrySkyBg from '../components/starrySkyBg/index.vue';

	export default {
		components: {
			CardCmp,
			addInfoBtn,
			starrySkyBg
		},
		data() {
			return {
				title: 'Hello11',
				array: [{
						name: '时间',
						value: 0
					},
					{
						name: '热度',
						value: 1
					}
				],
				arrayName: [{
					name: '全部',
					value: ''
				}],
				completionStatusArr: [{
					name: '全部',
					value: ''
				}, {
					name: '已完成',
					value: 1
				}, {
					name: '未完成',
					value: 0
				}],
				searchInfo: {
					order: 0, // 时间或者热度排序
					openid: '', // 用户查询
					isfinish: '' // 完成状态查询
				},
				isFinisIndex: 0,
				isUserIndex: 0,
				scrollTop: 0, // 设置顶部距离
				defaultScrollTop: 0,
				isShowBlackTop: false, // 回到顶部图片是否展示
				triggered: false, // 下拉刷新
				list: [],
				pageNum: 1,
				total: 30,
				pageSize: 10,
				tolowerLoading: false, // 上拉加载
				userBlessIdArr: [] ,// 祝福的数组
				timer:null
			}
		},
		async onLoad() {
			// 判断是否是注册后进来的
			if (!this.userInfo.username) {
				await this.hqJMXX() // 初始进入自动页面获取 openid
				await this.getInfoData() // 获取信息
			}
			this.getUserClickBless()
		},
		onShow() {
			this.getUserClickBless()
			this.listData(1)
			this.getUserInfo()
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			...mapActions(['hqJMXX', 'getInfoData']),
			// 查询所有用户信息
			async getUserInfo() {
				try {
					const {
						data: {
							data
						}
					} = await this.$http('/userInfoQuery', {}, 'Get')
					if (data && data.length) {
						this.arrayName = [{
							name: '全部',
							value: ''
						}]
						data.forEach(item => {
							this.arrayName.push({
								name: item.username,
								value: item.openid
							})
						})
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 查询自己点击的心愿
			async getUserClickBless() {
				if (!this.userInfo.openid) return false
				try {
					const {
						data: {
							data
						}
					} = await this.$http('/blessInfoQuery', {
						openid: this.userInfo.openid
					}, 'Get')
					if (data && data.length) {
						this.userBlessIdArr = data.map(item => item.shouyeid)
					}
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 排序下拉筛选框
			bindPickerChange(e) {
				this.searchInfo.order = e.detail.value
				this.listData(1)
			},
			// 用户信息下拉筛选框
			bindUserPickerChange(e) {
				this.isUserIndex = e.detail.value
				this.searchInfo.openid = this.arrayName[e.detail.value].value
				this.listData(1)
			},
			// 是否完成下拉筛选框
			bindCompletionStatusPickerChange(e) {
				this.isFinisIndex = e.detail.value
				this.searchInfo.isfinish = this.completionStatusArr[e.detail.value].value
				this.listData(1)
			},
			// 回到顶部
			backTop() {
				this.scrollTop = this.defaultScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0
				})
			},
			// 下拉刷新
			onRefresh() {
				if (!this.triggered) {
					this.triggered = true;
					this.listData(1)
				}
			},
			async listData(type) {
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
						...this.searchInfo,
						pageNum: this.pageNum,
						pageSzie: this.pageSize,
						isopen: 1
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
				this.triggered = false;
				this.tolowerLoading = false
			},
			// 上拉加载
			scrolltolower() {
				if (this.tolowerLoading) return
				this.tolowerLoading = true
				if (this.pageNum * this.pageSize < this.total) {
					this.pageNum++
					this.listData(2)
				} else {
					this.tolowerLoading = false
				}
			},
			// 滚动时触发
			scroll(e) {
				this.defaultScrollTop = e.detail.scrollTop
				if (e.detail.scrollTop > 300) {
					this.isShowBlackTop = true
				} else {
					this.isShowBlackTop = false
				}
			},
			// 添加祝福
			async blessClick(index) {
				let item = this.list[index]
				if (!this.userInfo.username) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					this.timer =  setTimeout(function() {
						uni.redirectTo({
							url: `/pages/personalInfo/index`
						})
					}, 500);
					return false;
				}
				console.log(item);
				try {
					const {
						data
					} = await this.$http('/homeInfoBleeNumUpdate', {
						shouyeid: item.id,
						openid: this.userInfo.openid,
						username: this.userInfo.username,
						userImag: this.userInfo.userImag
					}, 'Post')
					uni.showToast({
						title: '祝福成功',
						icon: 'none'
					})
					this.userBlessIdArr.push(item.id)
					this.$set(this.list, index, {
						...item,
						blessnum: ++item.blessnum
					})
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			}
		},
		destroyed() {
			if (this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
		}
	}
</script>

<style lang="scss">
	.content {
		text-align: left;
		background: linear-gradient(to bottom, #606065 0%, #4a4545 50%, #5d5b5b 80%, #4b4b4e 100%);
		height: 100vh;
		display: flex;
		flex-direction: column;

		.scroll-Y {
			height: 100%;
			white-space: nowrap;
		}

		.uni-list-cell {
			display: flex;

			.uni-list-cell-db {
				font-size: 26rpx;
				flex: 1;
				display: flex;
				background: #cecccc;
				line-height: 65rpx;
				padding: 0 20rpx;
				letter-spacing: 2rpx;
				color: #696767;
				position: relative;
				z-index: 2;
				overflow: hidden;
				border: 1px solid;
			}
		}

		.picker {
			width: 94vw;
		}

		.uni-input {
			display: flex;
			justify-content: space-between;
		}

		.xia {
			display: inline-block;
			position: relative;
			width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			border-top: 10px solid #696767;
			right: 10rpx;
		}

		.inner-info {
			flex: 1;
			overflow: hidden;
			position: relative;
			z-index: 2;
		}

		.loading {
			color: #fff;
			text-align: center;
			line-height: 50rpx;
		}

		.fhdw {
			position: absolute;
			bottom: 2%;
			right: 10rpx;
			color: #fff;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			z-index: 99;
			opacity: .8;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
