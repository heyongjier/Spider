1. 对于规则的html结构和无特殊标签的页面，使用xpath解析更加高效便利
    - `page = etree.HTML(code)`   
    - 当打开的文件报错自定义的字节时，可以使用rb模式传入字节打开。  
    `f = open("file_name", model='rb')`  
    - `rt = page.xpath("/html/body/div/p")`  
    /  空格代表根节点     
    /html/body/div表示嵌套的父子节点关系。  
    - 解析后的结果是列表，无论结果是多少，都是列表类型xpth是可以取数的：`page.xpath("/html/body/div[1]/p[2]")`  但是xpth中的[]代表的是第几个子标签，从1开始计数  
    - xpth支持属性选择：`page.xpath("/html/body/div[@class='small-text']/p")`
    - 开头使用//，进行全文检索，获取整个页面中符合条件的标签：`page.xpath("//li[@id='10010']")` 。  
    - 全文检索可以进行嵌套使用来表示不严格的后代关系：`page.xpath("//div//p")`  &nbsp; &nbsp;  #表示选择所有后代中含有p标签的div标签。  
    
&nbsp;

2. xpath可以使用text()进行取值：  
`page.xpath("/html/body/div/p/text()")`也可以使用`//text()`这种格式。
  
&nbsp;

3. xpath可以取标签的属性：   
`page.xpath("/html/body/div/@class")`，同样也可以写成`//@class`(表示当前节点以及所有后代的属性，`/@class`则是只有自己节点下的而属性)

&nbsp;

4. 从当前标签出发，进行后续的匹配可以使用 `.`表示当前节点:
    ```
    a_lists = page.xpath("//a")
    for a_list in a_lists:
        href = a_list.xpath(".//@href")
        text = a_list.xpath(".//text()")
    ```

&nbsp;

5. 对于xpath而言，健壮性的处理逻辑应当是按照页面结构，去获取一个标签/表格的数据，然后按照条目类型进行归类，而不是循环去获取所有标签中的某一条目数据。这样可以有效的防止因为数据的确实而造成数据对应出错。

&nbsp;

6. 在xpath中，如果是`<p class="a1 a2">123</p>`这个时候进行匹配的时候，应该写成`page.xpath("/p[@class='a1 a2']")`，要其写全。

&nbsp;

7. xpath中存在通配符逻辑：
    ```
    page.xpath("//*[@class='a2']") #查找所有class是a2的标签。    
    page.xpath("/div/*/p")   #查找div标签下标签的子标签为p的p标签
    ```

&nbsp;
      
8. 当资源在HTML中时，直接获取HTML然后bs4和xpath进行解析；如果没有在HTML中，则需要解析请求，获取对饮的URL进行解析；如果页面使用了iframe和frameset内嵌，想要获取内嵌的资源要解析内嵌的url
