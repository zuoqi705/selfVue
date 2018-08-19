function Vue(data,el,key){
	this.data = data;
	var self = this;
	Observe(data);
	Object.keys(data).forEach(key => {
		self.proxyKey(key);// 绑定代理属性
	})
	el.innerHTML = this.data[key]//初始化模板数据的值
	new Watcher(this,key,function(value){
		el.innerHTML = value;
	});
	return this;//方便链式调用
}

Vue.prototype.proxyKey = function(key){
	// body... 
	var self = this;
	Object.defineProperty(this, key, {
		configurable:true,
		enumerable:false, //由于是代理属性，所以要设为不可枚举
		get:function(){
			return self.data[key];
		},
		set:function(value){
			self.data[key] = value;
		}
	})
};