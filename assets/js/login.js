$(function () {
    // 入口函数
    // --------------------------  切换登录和注册的盒子 -------------
    // 点击去注册
    $('.login a').click(function () {
        $('.login').hide().next().show();
    });

    // 点击去登录
    $('.register a').click(function () {
        $('.register').hide().prev().show();
    });

    let layer = layui.layer; // 加载弹出层模块
    // --------------------- 完成注册功能 ---------------------
    $('.register form').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的数据
        let data = $(this).serialize(); // serialize是根据表单各项的name属性获取值的，所以要检查表单各项的name属性
        // 发送ajax请求到接口，完成注册
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                // alert(res.message);
                layer.msg(res.message);
                if (res.status === 0) {
                    // 注册成功，让登陆的盒子显示
                    $('.register').hide().prev().show();
                }
            }
        });
    });

    // -----------------------------   表单验证  --------------
    // 1. 加载表单（form）模块
    let form = layui.form;
    // 2. 使用form.verify()方法实现表单验证
    form.verify({
        // 第一个验证规则，验证密码长度必须是6~12位
        // key: value
        // 验证规则: array|function
        // pwd: ['正则', '验证不通过时的提示'],
        // pwd: [/^\S{6,12}$/, '密码长度必须是6~12位，并且不能有空格']
        pwd: function (value) {
            // value表示使用验证规则的输入框的值
            if (!/^\S{6,12}$/.test(value)) {
                return '密码长度必须是6~12位，并且不能有空格';
            }
        },
        // 验证两次密码
        repwd: function (value) {
            // value 表示确认密码
            let pwd = $('.reg-password').val().trim(); // 获取密码
            if (value !== pwd) {
                return '两次密码不一致';
            }
        }
    });

    // --------------------------  完成登录功能 ---------------------------
    $('.login form').on('submit', function (e) {
        e.preventDefault();
        // 获取账号和密码
        // 提交给接口，完成登录。登录成功，跳转到 index.html （index.html是项目的首页面）
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(), // 检查表单各项的name属性值
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 登录成功，先保存token（令牌）
                    localStorage.setItem('token', res.token);
                    // 登录成功，跳转到index.html
                    location.href = '/index.html';
                }
            }
        });
    })

});