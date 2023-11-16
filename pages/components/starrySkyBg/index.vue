<template>
	<view class="starry-bg-box" id='starry-bg-box'>
		<text v-for="(item,index) in arr" :key="index" :style="{
			left:item.left,
			top:item.top,
			transform:item.transform,
			animationDelay: item.animationDelay,
			opacity: .7
		}">
		</text>
	</view>
</template>

<script>
	export default {
		name: 'starrySkyBg',
		data() {
			return {
				width: 300,
				height: 800,
				arr: [],
				timer:null
			}
		},
		mounted() {
			this.updateInfo()
			this.timer = setInterval(this.updateInfo, 9000)
		},
		methods: {
			updateInfo(flag) {
				this.arr = []
				for (let i = 0; i < Math.random()*(10+1-30)+30; i++) {
					this.arr.push({
						left: Math.random() * (this.width + 100) + 'px',
						top: Math.random() * (this.height) + 'px',
						transform: `scale(${Math.random() },${Math.random()+Math.random()}) `,
						animationDelay: Math.random() * 3 + 's'
					})
				}
			}
		},
		beforeDestroy(){
			if(this.timer){
				clearTimeout(this.timer)
				this.timer = null
			}
		}
	}
</script>

<style lang="scss">
	.starry-bg-box {
		position: absolute;
		left: -50rpx;
		top: -40rpx;
		height: 110%;
		width: 110%;
		z-index: 0;

		text {
			display: inline-block;
			width: 30px;
			height: 30px;
			background: url("@/static/sharpicons_cross.png") no-repeat;
			background-size: 100% 100%;
			animation: flash 1.5s alternate infinite;
			position: absolute;
		}

		@keyframes flash {
			from {
				opacity: 0;
				transform: scale(0, 0)
			}

			to {
				opacity: .7;
				transform: scale(1, 1)
			}
		}
	}
</style>
