$(function () {

    // 初始化富文本编辑器
    initEditor();

    let form = layui.form;

    // 获取所有的分类，渲染到下拉列表中
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            if (res.status === 0) {
                // 使用模板引擎，渲染数据到页面中
                let str = template('cate', res);
                $('select').html(str);
                // 执行更新渲染方法
                form.render('select');
            }
        }
    });


    // ------------ 剪裁区处理 -----------------
    // 实现基本的剪裁效果（初始化剪裁效果），页面刷新之后，得有剪裁效果
    let $image = $('#image');
    let options = {
        // 宽高比
        aspectRatio: 400 / 280,
        // 设置预览区的选择器
        preview: '.img-preview'
    };
    $image.cropper(options);

    // 点击选择图片，可以选择图片
    $('#chooseImage').click(function () {
        $('#file').click();
    });

    // 当文件域的内容改变的时候，更换剪裁区的图片
    $('#file').change(function () {
        // 找到文件对象
        // console.dir(this);
        let fileObj = this.files[0];
        // 生成url
        let url = URL.createObjectURL(fileObj);
        // 销毁剪裁区，更换图片，重新创建剪裁区
        $image.cropper('destroy').attr('src', url).cropper(options);
    });


    // 设置全局变量，state，默认是 ”已发布“
    let state = '已发布';

    // 点击的是 ”草稿“，改变state为草稿
    $('#caogao').click(function () {
        state = '草稿';
    });
    // 点击的是 ”已发布“，改变state为已发布（可以省略）
    $('#fabu').click(function () {
        state = '已发布';
    });

    // 无论点击了草稿、还是已发布，都会触发表单的提交事件
    $('form').on('submit', function (e) {
        e.preventDefault();
        // 使用FormData收集表单数据
        let fd = new FormData(this); // 一定要检查表单各项的name属性值，值要和接口的请求参数一致
        // fd 里面包括了 标题、分类id、内容
        // 手动添加state
        fd.append('state', state);
        // 到此为止，fd中又多了state
        // 剪裁图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 手动添加图片到fd
                fd.append('cover_img', blob);
                // 到此为止，fd中包含了cover_img
                // 提交数据给接口
                $.ajax({
                    type: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    processData: false, // jQuery默认会把data处理成查询字符串；这里设置为false，表示不要把fd处理成查询字符串。
                    contentType: false, // 默认的Content-Type是application/x-www-form-urlencoded ，这里设置为false，表示不要设置这个请求头
                    success: function (res) {
                        // console.log(res);
                        layer.msg(res.message);
                        if (res.status === 0) {
                            location.href = '/article/article.html'
                        }
                    }
                });
            })
        // console.log(fd.get('title'));
        // console.log(fd.get('cate_id'));
        // console.log(fd.get('content'));
        // console.log(fd.get('cover_img'));
        // console.log(fd.get('state'));


    });
});