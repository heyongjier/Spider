1. bs4模块，用于解析HTML、XML。使用 find 等函数进行匹配时，attrs 的 class 属性可以只指定一个，也可以指定多个，但要保证多个 class 之间用空格分隔。  
   - 示例：`res = page.findall("div", attrs="c1 elements c2")`  
   - 相对于 html，bs4 更多用于处理 xml。当逻辑结构混乱时，bs4 性能优良

&nbsp;

