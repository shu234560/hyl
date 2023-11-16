import Vue from 'vue'
import Vuex from 'vuex'
import {
	http
} from '../utils/utils.js'


Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// sessionKey: '',
		code: '',
		info: {
			userImag: '',
			username: '',
			gender: '',
			openid: ''
		}
	},
	getters: {
		userInfo(state) {
			return state.info
		}
	},
	actions: {
		hqCode({
			commit
		}) { // 获取登录凭证
			return new Promise((ress, rej) => {
				uni.login({
					provider: 'weixin',
					success: res => {
						console.log(res)
						commit('setCodeData', res)
						ress()
					}
				});
			})
		},
		async getInfoData({
			state,
			commit,
			dispatch
		}) {
			// 首次进入 判断是否已经注册过
			return new Promise((ress, rej) => {
				http('/login', {
					openid: state.info.openid
				}, 'Get').then(res => {
					if (res.data.msg === '登录成功') {
						commit('setInfoData', res.data.userInfo)
					}
					ress()
				})
			})
		},
		async hqJMXX({
			state,
			commit,
			dispatch
		}) { // 获取密钥 === 需要登录才可以获取密钥
			await dispatch("hqCode")
			return new Promise((ress, rej) => {
				http('/getWxOpenId', {
					code: state.code
				}, 'Post').then(res => {
					if(res.data.data.openid){
						commit('setOpenidData', res.data)
					}
					ress()
				})
			})
		},
		setUser({
			state,
			commit,
			dispatch
		}, data) { // 获取用户信息
			return new Promise((ress, rej) => {
				uni.getUserProfile({ // 主要获取性别
					desc: '用户登录',
					success: async res => {
						commit('setInfoData', {
							...data,
							gender: res.userInfo.gender
						}) // 存储到vuex
						await dispatch("addUserInfo") // 保存到后台
						ress()
					}
				})
			})
		},
		// 登录信息存入数据库
		addUserInfo({
			state
		}) {
			return new Promise((ress, rej) => {
				http('/register', {
					username: state.info.username,
					userImag: state.info.userImag,
					openid: state.info.openid,
					gender: state.info.gender
				}, 'Post').then(res => {
					uni.switchTab({
						url: `/pages/index/index`
					})
					ress()
				})
			})
		}
	},
	mutations: {
		setCodeData(state, res) {
			state.code = res.code
		},
		setOpenidData(state, res) {
			console.log(state.info,'info');
			state.info['openid'] = res.data.openid
			// state.sessionKey = res.data.session_key
		},
		setInfoData(state, data) {
			state.info['userImag'] = data.avatarUrl ? data.avatarUrl : data.userImag //微信头像
			state.info['username'] = data.nickName ? data.nickName : data.username // 微信昵称
			state.info['gender'] = data.gender // 性别
		}
	},
})

export default store
