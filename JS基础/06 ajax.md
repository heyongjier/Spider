1. 页面请求的ajax请求包的请求地址和抓包的不同，可以考虑是不是进行了xhr请求，对url进行了加密。

&ensp;

2. 在逆向过程中，如果调试中知道最后也没有找到对应的发送请求的未知，可能更改了xhr中的open函数对url加密，或者更改了send函数等，可以使用`XMLHttpRequest.prototype.open`进行测试，查看控制台的输出。

&ensp;

3. 在JS中发送请求的最底层就是通过ajax进行发送请求，jquery也会封装Ajax发送请求。