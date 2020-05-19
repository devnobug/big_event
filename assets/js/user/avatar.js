$(function () {
    // -------------  点击  上传  ，可以选择图片  ------------
    $('#chooseImage').click(function () {
        $('#file').click();
    });

    // ---------------  创建剪裁区 ------------------
    // - 找到剪裁区的图片 （img#image）
    let image = $('#image');
    // - 设置配置项
    let option = {
        // 纵横比(宽高比)
        aspectRatio: 1, // 正方形
        // 指定预览区域
        preview: '.img-preview' // 指定预览区的类名（选择器）
    };
    // - 调用cropper方法，创建剪裁区
    image.cropper(option);

    // --------------  更换剪裁区的图片 ---------------
    // 当文件域的内容改变的时候，更换图片
    $('#file').change(function () {
        // console.log(111);
        // 1. 找到选择的图片（文件对象）
        // console.dir(this);
        let fileObj = this.files[0]; // 我们选择的图片的文件对象
        // 2. 根据文件对象，生成一个临时的url，用于访问被选择的图片
        let url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 3. 更换剪裁区的图片的src属性
        // - 销毁原理的剪裁区
        // - 更换图片
        // - 重新创建剪裁区
        image.cropper('destroy').attr('src', url).cropper(option);
    });

    // ---------------  点击 确定 的时候，剪裁图片，转成base64格式，提交字符串到接口 ----------
    $('#sure').click(function () {
        // 剪裁得到一张图片（canvas图片）
        let i = image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        });
        // 把图片转成base64格式
        let str = i.toDataURL(); // 把canvas图片转成base64格式
        console.log(str); // base64格式的字符串
        // ajax提交字符串给接口
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {avatar: str},
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 更换成功，调用父页面的 getUserInfo() ，重新渲染头像
                    window.parent.getUserInfo();
                }
            }
        });
    });

});