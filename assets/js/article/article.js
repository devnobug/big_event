$(function () {
    // 加在layui的form模块
    let form = layui.form;
    // --------------- 1. 查询文章、列表显示 ---------------
    // 加载分页模块
    let laypage = layui.laypage;
    let data = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条
        // cate_id: ,
        // state: ,
    };
    /**
     * 想要分页，改变 pagenum 和 pagesize。改变之后，调用renderArticle从新渲染
     */
    renderArticle();
    function renderArticle() {
        $.ajax({
            url: '/my/article/list',
            data: data,
            success: function (res) {
                console.log(res);
                // res.total // 总数
                // 通过模板引擎，渲染
                let str = template('list', res);
                $('tbody').html(str);
                // 当ajax请求成功之后，获取到总数之后，调用显示分页的函数
                renderPage(res.total);
            }
        });
    }

    // --------------  实现筛选功能 ---------------
    // 筛选之后，一定要重置 pagenum = 1;
    $('#search_form').on('submit', function (e) {
        e.preventDefault();
        let cate_id = $('#category').val();
        let state = $('select[name="state"]').val();
        if (cate_id) {
            data.cate_id = cate_id;
        } else {
            delete data.cate_id;
        }

        if (state) {
            data.state = state;
        } else {
            delete data.state;
        }
        // 修改页码为1
        data.pagenum = 1;
        // 更新渲染
        renderArticle();
    })

    // 实现分页
    function renderPage (t) {
        laypage.render({
            elem: 'page', // 不要加 #
            count: t, // 表示总计有多少条数据
            limit: data.pagesize, // 每页显示多少条
            limits: [2, 3, 4, 5],
            curr: data.pagenum, //  起始页（控制页码的背景色，表示是选中状态）
            // prev: '上一个'
            layout: ['limit', 'prev', 'page', 'next', 'count', 'skip'],
            // 点击页码的时候，会触发下面的jump函数。页面刷新之后，也会触发一次
            jump: function (obj, first) {
                // console.log(obj); // 表示前面控制分页的所有属性
                // console.log(first); // 刷新页面之后，是tru，再点击页码，它就是undefined了
                // 点击页码的时候，jump函数会触发，此时，改变data.pagesize和data.pagenum，调用renderArticle即可看对对应页的数据
                if (!first) {
                    // console.log(obj.curr);
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    renderArticle();
                }        
            }
        });
    }
    


    // 过滤器处理时间日期
    template.defaults.imports.formatDate = function (value) {
        // value 表示默认输出的值，比如 2020-03-27 16:25:19.359
        let date = new Date(value);
        let year = date.getFullYear();
        let month = addZero(date.getMonth() + 1);
        let day = addZero(date.getDate());
        let hour = addZero(date.getHours());
        let minute = addZero(date.getMinutes());
        let second = addZero(date.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
    // 补零函数
    function addZero (n) {
        return n<10 ? '0' + n : n;
    }

    // 获取分类，渲染到下拉菜单位置
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            let str = template('tpl-category', res);
            $('#category').html(str);
            form.render('select');
        }
    });
    // --------------- 2. 删除文章 -----------------------

});