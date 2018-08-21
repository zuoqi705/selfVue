function Vue(options){
	this.vm = this;
	var self = this;
	this.data = options.data;
	this.methods = options.methods;
	Observe(this.data);
	Object.keys(this.data).forEach(key => {
		self.proxyKey(key);// 绑定代理属性
	})
	new compiler(this.vm,options.el);
	options.mounted.call(this); // 所有事情处理好后执行mounted函数
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