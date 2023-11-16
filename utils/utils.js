
const baseDev = "https://myshu.fun/api";//正式接口 /jianliInfo
// const imagesUrl = 'http://39.104.175.45/index/';//图片地址
// const baseDev = 'http://localhost:8081/api';//本地
// const imagesUrl = 'http://localhost:8081/api/public/';//本地
const togo = function(url,data={}){//封装路由跳转  
    if(data && data != null && data != {}){
        let str  = '';
        for(var key in data ){
            str += `${key}=${data[key]}&`;
        }
        uni.navigateTo({
           url:`/pages/${url}?${str.substring(0,str.length-1)}`  
        }) 
    }else{
       uni.navigateTo({
           url:`/pages/${url}`  
       }) 
    }
} 

const redirectTo = function(url,data={}){//封装路由跳转  
    if(data && data != null && data != {}){
        let str  = '';
        for(var key in data ){
            str += `${key}=${data[key]}&`;
        }
        uni.redirectTo({
           url:`/pages/${url}?${str.substring(0,str.length-1)}`  
        }) 
    }else{
       uni.redirectTo({
           url:`/pages/${url}`  
       }) 
    }
} 

const http = function(url,data = {}, method,header = {}){//封装api请求
   //基础地址wangge
   let path = baseDev;
   // var info = uni.getStorageSync("username");
    //返回promise
    return new Promise((resolve,reject)=>{
		uni.showLoading({
			title: '稍等~~~'
		});
        //请求
        uni.request({
            url:`${path}${url}`,
            data:data,
            header:header,
            method:method,
            success(res) {
				uni.hideLoading()
                resolve(res)
            },
            fail:(err)=>{
                //报异常跳转至登录界面
              
               // uni.redirectTo({
                //     url:`/pages/index/index`  
                // })   
				uni.hideLoading()
				reject(err);
            }
        })
    })
   }

const toImage  = function(){//屏幕截图
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    var bitmap = null;
    var currentWebview = page.$getAppWebview();
    bitmap = new plus.nativeObj.Bitmap('drawScreen');
    // 将webview内容绘制到Bitmap对象中
    currentWebview.draw(
        bitmap,
        function() {
            var picPath = '_doc/a' + new Date().getTime() + '.jpg';
            bitmap.save(
                picPath,
                {},
                function(i) {
                    // console.log('保存图片成功：' + JSON.stringify(i));
                    togo('share/share',{...i});
                },
                function(e) {
                    // console.log('保存图片失败：' + JSON.stringify(e));
                }
            );
        },
        function(e) {
            // console.log('截屏绘制图片失败：' + JSON.stringify(e));
        }
    );
}

export {
   http,
   togo,
   redirectTo,
   toImage,
   baseDev,
   // imagesUrl
}