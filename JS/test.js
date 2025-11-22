var f1= function () {
    var n = 1;
    function f2() {
        console.log(n);
    }
    return f2;
}

var result = f1();
result(); // 1