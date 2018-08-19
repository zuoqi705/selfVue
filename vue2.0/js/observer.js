// Observer 监听器
function getProperty(obj,key,val){//对象，属性名，属性名对应的值
	Observe(val);// 递归遍历所有子属性
	var dep =  new Dep(); 
	Object.defineProperty(obj, key, {
		configurable:true,
		enumerable:true,
		get:function(){
			if(Dep.target){//只有初始化一个新的Watcher对象才会添加，其他时候调用get函数时候不需要
				dep.addsub(Dep.target);// 在这里添加一个订阅者
			}
			return val;
		},
		set:function(newval){
			if (val === newval) {
				return;
			}
			val = newval;
			console.log(`属性${key}已经被监听，现在值为${newval}`);
			dep.notify(); // 如果数据变化，通知所有订阅者
		}
	})
}

function Observe(obj){
	if(obj && typeof obj == 'object'){
		Object.keys(obj).forEach(key => getProperty(obj,key,obj[key]))
	}
	else {
		return
	}
}

//Dep 消息订阅器
function Dep(){
	this.subs = [];
}

Dep.prototype.addsub = function(watcher){//添加订阅者
	this.subs.push(watcher);
};
Dep.prototype.notify = function(){//为每个订阅者执行更新函数
	this.subs.forEach( sub => {
		sub.update();
	});
};
Dep.target = null;//初始化target为null;

//测试Observer
// var library = {
//     book1: {
//         name: 'js'
//     },
//     book2: 'vue'
// };
// Observe(library);
// library.book1.name = 'css';
// library.book2= 'html';

