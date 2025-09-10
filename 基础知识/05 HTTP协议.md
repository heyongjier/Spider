1. network中：  
    - Fetch/XHR和JS主要时用来加载数据的脚本等；  
    - Doc一般是页面的源代码；  
    - WS即WebSocket，Wasm用来加载汇编文件，C代码等

&nbsp;

2. 使用开发者工具打开一个数据包:  
    - header显示请求头，响应头；
    - preview可以查看无脚本和样式的html，图片用来查看json数据会自动格式化，比较方便；  
    - response显示从服务器返回的内容，可以用来查看文本/页面源代码；  
    - payload可以查看相关载荷参数

&nbsp;

3. 开发者工具中的Element标签则是显示加载所有资源、脚本、样式等的当前网页的实时状态。但是我们一般爬取并分析原本的源代码文件，如果直接使用分析Element或者使用Element的Copy Xpath获取的是经过脚本、增加样式、用户操作等才得到的，并不能用来分析。

&nbsp;

4. 开发者工具中的Sources标签表示网页的页面资源，包含：HTML、CSS、js、图片视频等。注意：在设置中关闭JavaScript Source Map选项；map文件是用来映射例如使用Webpack压缩后的JS文件与源文件的映射字典，很容易在逆向时被混淆。

&nbsp;
 
5. HTTP协议，请求和响应格式 
