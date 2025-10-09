1. Scrapy是当下最流行的网络框架，可以规范爬虫工程。主要用来处理大批量的请求或者海量的数据下载。同时，Scrapy还具有先进的拓展性。    
 文档：https://docs.scrapy.net.cn/en/latest/index.html

&ensp;

2. Scrapy的中心思想，是将数据爬取的各个步骤、逻辑进行模块化处理：  
    - 引擎：相当于main程序，进行各个逻辑之间的调度
    - 下载器：被调度后发送网络请求，然后获取收到的网络相应信息返回给调度的引擎。
    - Spider：引擎将获取的网络响应回送到该模块中，用来解析数据。
    - 管道：调度后用于对数据的保存。
    - 调度器：维护请求队列和去重。 
    - 中间件：由于是Scrapy封装了请求代码，所以如果要对请求进行处理：逆向、记录页面信息等，对响应的信息进行处理，需要额外用到下载器中间件。解析的信息，做预先清洗等处理，也会用到spider中间件。

&ensp;

3. 运行命令：
    - scrapy startproject project_name 创建一个scrapy项目。
    - scrapy genspider spider_name domain_name 为需要解析的域名创建spider。在一个Scrapy框架中，可以创建多个spider，解析不同域名的网站。
    - scrapy crawl spider_name 在命令行运行。但是建议在Scrapy根目录中创建一个运行文件：  
        ```
         from scrapy.cmdline import execute

         if __name__ == 'main':
            execute("scrapy crawl spider_name".split())
        ```
    可以将上述的文件直接添加到Scrapy的模板文件中新建一个runner文件，每次创建时都会带上一个runnner

&ensp;
   
4. 要对Scrapy框架中的setting文件进行修改：
    - ROBOTSTXT_DBEY = False  # 不遵循robots.txt
    - LOG_LEVEL = "WARNING"   # 去掉一些无用的日志
    - DEFAULT_REQUEST_HEADERS  # 修改请求头内容  

   同时还要更改或编写spider.py：  
    - 赋值start_url
    - 修改parse函数，给出对网页的解析思路  

&ensp;

5. Scrapy框架实现了自动的发送请求，添加并维护请求头、控制访问频率等工作。同时Scrapy还是一个并发的协程程序。

&ensp;

6. 在spider数据返回引擎然后传递给管道时，实际上一条一条数据的返回要比最终循环完成后直接返回一个列表更合理。但是如果在循环中return，每循环一次都要中断程序，这时候，就用到了python的生成器 yield，而不是return。  
 scrapy内部是协程，支持并鼓励使用yield。但是spider的yield返回类型必须是request对象，Scrapy中items文件中定义的item对象或者none。 
 如果不在item文件中定义，也可以直接返回自定义的字典类型：
    ```
        yield {
            "name": name,
            "value": value
        }
    ```

 python三大器：装饰器、迭代器、生成器  

 &ensp;

 7. Scrapy的大致调度流程：
    - 引擎首先创建一个spider对象，调用spider.requests，获取start_url（实际上是一个包含start_url的request对象），然后将其发送到调度器中。
    - 调度器调对start_url进行去重，然后维护一个请求队列。  
    - 引擎通过请求队列，调用下载器进行请求的发送。  
    - 下载器向目标URL发送请求并获取Web响应封装成指定的响应对象，回送给引擎。
    - 引擎调用spider，通过parse函数等进行解析，然后将解析的数据返回。
    - 最后可以调用管道进行数据的指定存储。  

&ensp;

8. Scrapy的请求对象包含：
    - url = 
    - dont_fulter = True/False # 指定请求队列是否去重后放入请求队列。是否有反复爬取同一页面  
    - callback = parse() # 指定该请求回送的响应应该用那个解析方法/函数进行解析。  
    - meta = {}  # 用于程序编写，该值可以被其他的方法函数直接读取到，并且可以修改  
    - method = method_name   # 指定请求的方法
    - body = json.dump(data)  #用于传递POST请求的表单数据 
    - **一定要注意，传入body参数，还要指定头要又对应的content-type，不然编码成json的数据将无法解析：`headers={"Content-Type": "application/json"}`**

    。。。。。。。。

 要时刻明确，在Scrapy中，与请求有关的一定是通过request对象进行操作的。同样，只要想发起请求，只需要返回一个request对象就可以，引擎获取到类型是request对象就会读取url等信息，然后发起请求。  

 &ensp;

 9. 在Scrapy中，每次请求前都会调用调度器，不设置dont_fulter的话也就意味着默认是去重的。这也就意味着如果我们进行换页操作，只需要在处理完当前页面后，获取下方的页面对应的href，然后循环就可以。在请求队列中会自动去重，然后请求所有页面。

 &ensp;

 10. 在scrapy中，设置cookie直接在setting修改是不可行的。scrapy的cookie设置是通过中间件进行配置，相当于是使用session进行管理和维护。可以在setting中设置`COOKIES_ENABLE = False`来取消下载器cookie中间件的使用，但也就意味着cookie只能在setting中静态固定的指定。  
  使用cookie中间件去实现自动的维护的Cookie，首先要构造一个字典`cookie_dict`，然后直接：
    ```
        yield scrapy.Request(
            url = ,
            cookies = cookie_dict
        )
    ```

&ensp;

11. 在使用POST发送请求时，有的时候，`form_data`实际上是通过urlcode编码之后的结果。这个时候直接使用scrapy，`body = form_dict`这是不合适的，所以：
    ```
        from urllib.parse import urlencode
        
        form_dict = {.....}
        scrapy.Request(
            url = ,
            method = 'post',
            body = 
        )        
    ```

 ***一定要注意，对于POST请求中，请求头会有content-type这个字段，这个字段对get是没有用的，所以常常可能会被忽略***  
  上述的发送请求，既要考虑到urlencode，还有注意头信息的变化，所以推荐直接使用**`FormRequest`**： 
    ```
        yeild scrapy.FormRequest(
            url= ,
            body = form_dict,
            callback = 
        )
    ```

&ensp;

12. 在循环链接爬取时，获取详情页链接等逻辑时，推荐使用连接提取器`LxmlLinkExtractor`。支持对链接进行过滤，筛选出该页面中符合过滤条件的url等:
    - 默认的 LinkExtractor 内部用的是 <a> 和 <area> 的 href
    - 如果你想从其他地方提取,可以用 tags 和 attrs 参数:`LinkExtractor(tags=('script',), attrs=('src',))`  

要求输入的参数是一个response响应对象，LxmlLinkExtractor会返回一个符合匹配规则的Link对象，方便后面进行取用。结果会自动进行url拼接。  

在crawlspider中，使用rule+LinkExtractor可以实现翻页的逻辑： 
    ```
    import scrapy
    from scrapy.linkextractors import LinkExtractor
    from scrapy.spiders import CrawlSpider, Rule


    class MySpider(CrawlSpider):
        name = "example"
        allowed_domains = ["example.com"]
        start_urls = ["https://example.com/page/1"]

        rules = (
            # 1. 提取详情页链接，并交给 parse_item 处理
            Rule(LinkExtractor(allow=r'/item/\d+'), callback='parse_item', follow=False),

            # 2. 提取分页链接，继续跟进（注意 follow=True）
            Rule(LinkExtractor(allow=r'/page/\d+'), follow=True),
        )

        def parse_item(self, response):
            yield {
                "title": response.css("h1::text").get(),
                "url": response.url
            }

    ```
 通过：`follow=True`，Scrapy 会把这些链接继续交给调度器，下载下一页并继续应用所有 rules

13. `scrapy crawl -t templete_name` 可以指定船舰不同的模板进行处理。  
`scrapy gensipder -t crawl spider_name domain_name` 可以创建一个解析不同链接的模板，在rules中指定url筛选匹配的逻辑，指定对应的回调函数进行解析就可以。简化了需要额外进行url链接解析匹配的逻辑。