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

7. 对于获取的数据出现乱码的情况大致可以分为：  
    - 如果获取的所有的数据都是乱码，这个要考虑传输过来的数据使用的压缩方法，本地是否能够解压。尤其是使用`content-type:br`时，可以考虑安装库` Brotli`。
    - 如果只是中文或者某些内容出现乱码，这个时候要考虑的是编码的问题。最常见的编码：`gbk`、`utf-8`。

&nbsp;

8. 对于编码出现乱码的情况，我们首先要明白，requests返回的内容：`res.content`实际上是字节，然后我们使用的`res.text`是requests定义的一种方法而不是属性，每次调用都会执行一个对content字节的编码操作。所以我们可以通过事先更换编码方式消除`res.text`字符的乱码情况：  
    ```
    response = session.get(url,headers=my_headers,cookies=my_cookies)
    response.encoding='utf-8' #指定编码形式
    ```  
更推荐使用自动识别的方式对`encoding`进行赋值：  
    `res.encoding = res.apparent_encoding`  

&nbsp;

9. 清楚抓取数据的特殊符号

&nbsp;

10. 在获取href值对应的网址时然后可能会涉及到拼接的操作，这个时候就要格外注意，例如`baseurl.com/1/2.html`：  
    - 对于`/a/b/c.html`而言，开头的`/`表示的是根路径，这个拼接就应该是`baseurl.com/a/b/c.html`  
    - 对于`a/b/c.html`而言，则是一种相对路径的逻辑，表示当前文件夹或者当前文件夹子文件夹中文件，这个拼接出来的应该是``baseurl.com/1//a/b/c.html`

    更推荐使用urllib库进行自动拼接，方便快捷，避免遇到繁琐的url进行复杂的字符串处理：  
    ```
    from urllib.parse import urljoin

    main_url = "https://baseurl.com/1/2.html"

    url1 = "/a/b/c.html"
    url2 = "a/b/c.html"

    url1 = urljoin(main_url, url1)
    url2 = urljoin(main_url, url2)

    # https://baseurl.com/a/b/c.html
    # https://baseurl.com/1/a/b/c.html
    ```
