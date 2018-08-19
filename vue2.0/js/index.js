function Vue(data,el,key){
	this.data = data;
	Observe(data);
	el.innerHTML = this.data[key]//初始化模板数据的值
	new Watcher(this,key,function(value){
		el.innerHTML = value;
	});
	return this;//方便链式调用
}