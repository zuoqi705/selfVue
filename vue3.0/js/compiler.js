function compiler(vm,el){
	this.vm = vm;
	this.el = document.querySelector(el);
	this.fragment = null;
	this.init();
}

compiler.prototype.init = function(){
	if(this.el){
		this.fragment = this.nodeToFragment(this.el);
		this.compileElement(this.fragment);
		this.el.appendChild(this.fragment);//将原先的el元素复原
	}else {
		console.log('Dom元素不存在');
	}
};

//将要操作的node节点用fragment存起来，节省dom操作
compiler.prototype.nodeToFragment = function(el){
	var fragment = document.createDocumentFragment();
	var child = el.firstChild;
	while(child){
		//appendChild:如果被插入的节点已经存在于当前文档的文档树中,则那个节点会首先从原先的位置移除,然后再插入到新的位置
		fragment.appendChild(child);
		child = el.firstChild;
	}
	return fragment;
};

//处理节点
compiler.prototype.compileElement = function(el){
	var childNodes = el.childNodes;
	var self = this;
	[...childNodes].forEach(node =>{
		var reg = /\{\{(.*)\}\}/;
		var text = node.textContent;
		if(self.isTextNode(node)&&reg.test(text)){// 判断是否是符合这种形式{{}}的指令
			self.compileText(node,reg.exec(text)[1]);
	}else if(self.isElementNode(node)){//判断是否为元素节点
		self.compile(node);
	}
	if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);  // 继续递归遍历子节点（注意子节点指包括一层）
            }
        })


};

//处理元素节点(除了{{}}以外的)
compiler.prototype.compile = function(node){
	var nodeAttrs = node.attributes;//获取节点所有属性
	var self = this;
	[...nodeAttrs].forEach(attr =>{
		var attrName = attr.name;
		console.log(attrName);
		if(self.isDirective(attrName)){
			var key = attr.value;
			var dir = attrName.substring(2);//获取v-后面的部分，判断是不是属于绑定事件指令(on:开头)
			if(self.isEventDirective(dir)){//是事件绑定指令
				self.compileEvent(node,self.vm,key,dir);
			}else{//v-model指令
				self.compileModel(node,self.vm,key);
			}
			node.removeAttribute(attrName);//移除该属性，处理完之后就用不到了
		}
	})
};

//处理{{}}中的内容
compiler.prototype.compileText = function(node,key){
	var self = this;
	var initText = this.vm[key];
	this.updateText(node,initText);// 将初始化的数据初始化到视图中
	new Watcher(this.vm,key,function(value){// 生成订阅器并绑定更新函数
		self.updateText(node,value);
	})

};

//处理v-on:中的事件
compiler.prototype.compileEvent = function(node,vm,funcName,dir){//节点名称，属于哪个vue实例，指令后面绑定的函数名，指令
	var eventName = dir.split(':')[1];//获取v-on后面的事件名
	var func = vm.methods && vm.methods[funcName];
	if(eventName && func){
		node.addEventListener(eventName, func.bind(vm), false);//为该节点绑定对应事件
	}

};

//处理v-model中的内容,这里要进行双向绑定
compiler.prototype.compileModel = function(node,vm,key){//节点名称，属于哪个vue实例，绑定属性名称
	var self = this;
	var value = this.vm[key];
	this.updateModel(node,value);
	new Watcher(this.vm,key,function(value){//添加订阅者,data => view
		self.updateModel(node,value);
	})

	node.addEventListener('input', function(e){//监听input事件获取里面的值，并更新data里面对应的值，view => data
		var newValue = e.target.value;
		if(newValue === value){
			return;
		}
		value = newValue;
		self.vm[key] = newValue;
	});

};

//更新节点内容
compiler.prototype.updateText = function(node,value){
	node.textContent = typeof value === 'undefined'?'':value;
};

//更新绑定的v-model元素值
compiler.prototype.updateModel = function(node,value){
	node.value = typeof value === 'undefined'?'':value;//注意是node.value,因为绑定的元素像input是没有textContent的
};

//判断是否为文本节点
compiler.prototype.isTextNode = function(node){
	return node.nodeType == 3;
};

//判断是否为元素节点
compiler.prototype.isElementNode = function(node){
	return node.nodeType ==1;
};

//判断是否为指令(v-开头)
compiler.prototype.isDirective = function(str){
	return str.indexOf('v-')==0;
};

//判断是否为绑定事件指令(on:开头)
compiler.prototype.isEventDirective = function(str){
	return str.indexOf('on:')==0;
};
