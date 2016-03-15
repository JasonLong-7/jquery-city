# jquery-city
这是一个基于jquery编写的地址选择插件

### 如何使用？

1.在`<head>`里面引用下面css资源
```html
<link href="../css/jquery.city.css" rel="stylesheet" />
<link href="../css/animate.min.css" rel="stylesheet" /> <!--可选-->
```

2.在`<body>`里引用下面的js资源
```html
<script src="../js/jquery-1.10.2.js"></script>
<script src="../js/jquery.city.js"></script>

<script>
    $(function () {
        $('#txt_city').jcity({
            urlOrData: '/js/citydata.json',
            animate: { showClass: 'animated flipInX', hideClass: 'animated flipOutX' },  // 需要第一步引用的animate.min.css文件，也可以自己定义动画 
            onChoice: function (data) {
                console.log(data);
            }
        });
    });
</script>
```

-

`bootstrap`中使用：
只要把上面的第一步中的
```html
<link href="../css/jquery.city.css" rel="stylesheet" />
```
改成
```html
<link href="../css/jquery.city.bootstrap.css" rel="stylesheet" />
```

### 效果演示
http://jasonlong-7.github.io/jquery-city/
