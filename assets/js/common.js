// 判断。如果没有token，直接退出到 /login.html 
// 不要放到入口函数里面，需要代码执行到common.js，马上就执行代码
// 请求的路径不是login.html  并且 还没有token，那么就跳转到 /login.html
console.log(location.href);

if (!localStorage.getItem('token') && !location.href.includes('/login.html')) {
    location.href = '/login.html';
}

$(function () {
    // 修改和配置ajax选项
    $.ajaxPrefilter(function (options) {
        console.log(options);
        // 修改url
        // options.url ====  /my/userinfo
        options.url = 'http://www.liulongbin.top:3007' + options.url;

        // 以 /my 开头的url需要设置headers
        // if (options.url.indexOf('/my') > -1) {
        if (options.url.includes('/my')) {
            options.headers = {
                Authorization: localStorage.getItem('token')
            }

            // 配置complete函数。ajax请求完成（不管成功还是失败）都会触发的一个函数
            options.complete = function (xhr) {
                // xhr.responseJSON 表示服务器返回的结果
                // console.log(xhr);
                if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                    // 满足条件，说明用户没有登录，而且还访问了需要验证的接口
                    // 清除假token
                    localStorage.removeItem('token');
                    // 跳转到登录页面
                    location.href = '/login.html';
                }
            }
        }
        /**
         * options = {
         *    type: 'xxx',
         *    url: xxxxx
         *    .....
         * }
         */
    });
})