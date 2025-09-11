1. HTTP协议是不保持连接、无状态的，所以引入了`cookie`，一般是服务器生成一个值，然后放在响应头的`set-cookie`中回送浏览器中，用于后续发送请求时，做状态验证。服务器中有一个`session`字典，映射cookie和用户信息。

&nbsp;

2. 从cookie的生成方式可以分为：  
    - 服务器生成，响应头中带有set-cookie，此时服务器的生成规则是不可知的，本地无法生成；  
    - 也可以通过浏览器生成，表现为响应头中没有该值但是请求中包含cookie，此时可以通过JS逆向进行cookie生成。

&nbsp;

3. 在分析网站或者页面的cookie逻辑时，首先要打开开发者工具的Application标签页，Storage栏中`clear site data`清除缓存的cookie然后进行分析。

&nbsp;

4. 在访问需要cookie的页面时：  
    - 可以直接从浏览器中抓包，将cookie的值复制到请求的header中。此时可能遇到的问题是cookie是有时效性的。  
    - 可以使用 `res = requests.get(url1)`  获取响应后，再将其传递给需要cookie访问的url中，`res2 = requests.get(url2,cookie=res.cookie) ` 
    - 推荐使用requests库中的session，可以保持浏览器与服务器之间的状态（cookie），自动维护从响应头的cookie值

&nbsp;

5. 使用session：
    ```
    session = requests.session( )    #创建一个session类，维护不同属性的对应的字典 
        # session.cookies['cookie_name'] = "cookie_value"  也可以这样自定义cookie值，后续也会自动维护。逆向时用来手动指定cookie
        response = session.get(url,headers=headers)    #自动获取并维护填写cookie值
        print(response.text)
    ```

&nbsp;

6. 综合上述可以直接使用：
    ```
    session = requests.session()
    session.headers = headers
    # 这里是对原先有的请求头的值手动修改或者添加没有的信息。主要在爬取是，content-type和referer往往是需要手工与维护的
    response = session.get(url,headers={"param_name":"param_value"})   
    ```
    此时可以直接完成对请求头包含cookie的自动维护。  
    需要注意的是对于JS生成的本地cookie，要加入到其中，并不能自动获取

&nbsp;

7. 在解析cookies时，内容可能会有`Hm_lvt`、`Hm_Ipvt`开头的信息，这是百度的seo和sem ，只要不是爬取百度相关的网页，这些是与本网站没有任何关系的。同样的数据包中`HM`开头的文件也是一样。

&nbsp;

8. 模拟登录请求成功后，当前登录页一般都会进行跳转重定向302，跳转到登陆成功的页面。  
使用session时也是模仿浏览器操作，一样也会自动跳转到页面中，这时候登录成功的响应头不会出现location，状态码也是200，直接跳转到对应的页面。  
极个别少数情况不要这种自动转换的重定向可以：`response = session.get(url,headers=headers,allow_redrection=false)`

&nbsp;

Ddddocr验证码识别 图鉴 
