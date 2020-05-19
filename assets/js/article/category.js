$(function () {
    let add_id = null;
    let edit_id = null;

    // 加载form模块
    let form = layui.form;

    // ------------------  ajax请求类别列表，并渲染到页面中 -----------------
    renderHtml();

    function renderHtml() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                let str = template('list', res);
                // 把最终结果放到tbody中
                $('tbody').html(str);
            }
        });
    }

    // ------------------  点击 添加类别 的时候，显示弹出层 -------------
    $('#addBtn').click(function () {
        // layui官网 --> 文档 --> 内置模块 --> 弹出层 --> 独立版本：layer.layui.com
        // 或者，直接打开弹出层的独立版本网站：layer.layui.com
        //页面层
        add_id = layer.open({
            type: 1,
            // skin: 'layui-layer-rim', //加上边框
            title: '添加文章类别',
            area: ['500px', '250px'], //宽高
            content: $('#add').html() // 内容，可以使用字符串，也可以使用DOM
        });
    });

    // ------------------ 点击弹出层中的 确认添加 ，发送ajax请求，完成分类添加------------------
    // 表单是动态创建的元素。所以必须使用事件委托的方式
    $('body').on('submit', '#addForm', function (e) {
        e.preventDefault();
        // alert(111);
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 从新渲染页面
                    renderHtml();
                    // 关闭窗口
                    layer.close(add_id);
                }
            }
        });
    });

    // -----------------  点击删除，完成删除功能 -----------------
    $('body').on('click', '.delete', function () {
        let that = $(this);
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 获取id
            let id = that.attr('data-id');
            // ajax请求
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        // 删除成功，重新渲染页面
                        renderHtml();
                    }
                }
            });
            layer.close(index); // 关闭弹层
        });

    });

    // ------------------ 点击编辑，显示弹出层 ------------------
    $('body').on('click', '.edit', function () {
        // 先获取按钮的三个 data-xxx 属性值，他们分别是 id、name、alias
        let id = $(this).attr('data-id');
        let name = $(this).attr('data-name');
        let alias = $(this).attr('data-alias');
        edit_id = layer.open({
            type: 1,
            // skin: 'layui-layer-rim', //加上边框
            title: '编辑文章类别',
            area: ['500px', '250px'], //宽高
            content: $('#edit').html(), // 内容，可以使用字符串，也可以使用DOM
            success: function () {
                // 弹层成功后，触发的一个函数。在这里快速为表单赋值
                form.val('editForm', {id, name, alias});
            }
        });
    });

    // ------------------ 点击弹出层中的 确认修改 ，发送ajax请求，完成分类修改------------------
    $('body').on('submit', '#editForm', function (e) {
        e.preventDefault();
        // alert(111);
        let data = $(this).serializeArray();
        data[0].name = 'Id';
        // console.log(data);
        // return;
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 从新渲染页面
                    renderHtml();
                    // 关闭窗口
                    layer.close(edit_id);
                }
            }
        });
    });
})