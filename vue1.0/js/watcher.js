function Watcher(vm,key,upfunc){//来自哪个vue实例，绑定的属性名，更新函数
	this.vm = vm;
	this.key = key;
	this.upfunc = upfunc;
	this.value = this.get();
}

Watcher.prototype.get = function(){//通过访问该属性的get函数来进行添加订阅者
	Dep.target = this;
	var value = this.vm.data[this.key];
	Dep.target = null;
	return value;
};
Watcher.prototype.run = function(){
	var newval = this.vm.data[this.key];
	var oldval = this.value;
	if(newval !== oldval){
		this.value = newval;
		this.upfunc.call(this.vm,newval,oldval);//调用更新函数，并传入参数
	}
};
Watcher.prototype.update = function(){
	this.run();
}