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
	}
	if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);  // 继续递归遍历子节点（注意子节点指包括一层）
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

//更新节点内容
compiler.prototype.updateText = function(node,value){
	node.textContent = typeof value === 'undefined'?'':value;
};

//判断是否为文本节点
compiler.prototype.isTextNode = function(node){
	return node.nodeType == 3;
};
