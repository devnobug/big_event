
// 页面dom元素全部加载完毕之后，才会执行
$(function () {

    // 加载layer模块
    let layer = layui.layer;

    // ---------------------  退出 -------------------
    $('#logout').click(function () {
        // 1. 询问是否要删除
        layer.confirm('确定退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 2. 清除token
            localStorage.removeItem('token');
            // 3. 跳转到登录页面
            location.href = '/login.html';
            // 关闭窗口
            layer.close(index);
        });
    });

    // --------------------  获取用户信息 --------------------
    getUserInfo();
})

// 定义获取用户信息的函数，定义一个全局函数
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 渲染页面
                // 1. 欢迎你 用户名（优先使用nickname、没有的话，使用username）
                let name = res.data.nickname || res.data.username;
                $('.welcome').html('欢迎&nbsp;&nbsp;' + name); // 必须使用html，不能使用text，因为 &nbsp; 也是HTML

                // 2. 头像（优先使用图片、没有图片使用name）
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic);
                    // 让图片显示、让文字隐藏
                    $('.layui-nav-img').show();
                    $('.text-avatar').hide();
                } else {
                    let w = name.substr(0, 1).toUpperCase();
                    // 让文字头像显示，不要用show，因为show方法会让盒子display: block
                    $('.text-avatar').text(w).css('display', 'inline-block');
                    $('.layui-nav-img').hide();
                }
            }
        }
    });
}