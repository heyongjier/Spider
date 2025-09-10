1. 使用requests包进行请求，返回的是一个包含状态码、响应头、响应体等的集合类。  
可以使用例如：`response.status_code`   `response.text`等查看具体的内容 

&nbsp;

2. 简单的爬虫识别：头信息（User-Agmet）、请求参数、请求方式、签名算法、加密算法、访问频率 

&nbsp;

3. 推荐插件：Headers，可以直接在网站上复制浏览器的请求头，然后到Pycharm中右键选择Headers可以自动生成键值对的格式，本质上就是将复制的键值对转换成字典的格式  
    - 对于url有很多参数（数据包Payload标签中的Query String Paraments）时，尽量将此参数使用字典的方式，此时也可以使用Headers插件，  
    - 同时，在url请求时，会用urlencode()，将一些特殊符号进行编码，这样直接使用编码后的url，可能会出问题。使用字典参数的形式:  
        `response = requests.get(url,params=my_params,headers=my_headers) `  
        requests自动拼接可以避免这种情况的发生。

&nbsp;

4. 当requests返回的结果是json时，直接使用response.text，实际上是将json表示成了字符串形式，可能会出现`\\uxxxx`等乱码，但是我们采取`response.json()`方法后就成功转化为json格式。如果还有乱码，则可能是嵌套的json，循环处理下就可以。

&nbsp;

5. 当数据包中出现Form Data时，一定是POST请求。  
`response.post(url.params=my_params,data=my_forms,headers=my_headers)`

&nbsp;

6. 文件的下载：首先获取到该资源的url，然后使用open的方法，将请求的文件写入：  
    ```
    response = requests.get(url,headers=headers)
    with open("file_name.jpg",mode="wb") as f:
        f.write(response.content)
    ```

&nbsp;
