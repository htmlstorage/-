// Tue Oct 29 2019 10:26:54 GMT+0800 (GMT+08:00)

// 存储页面基本信息
var owo = {
  // 手机入口
  phoneEnter: "null",
  // 全局方法变量
  tool: {},
  // 框架状态变量
  state: {}
};
/*
  存储每个页面的函数
  键名：页面名称
  键值：方法列表
*/

owo.script = {
  "home": {
    "template": {
      "topBar": {
        "prop": {
          "logo": "http://www.people.com.cn/img/2016people/images/rmw_logo.png"
        }
      },
      "swiperBox": {
        "created": function created() {
          // 轮播图展示区域swiper
          setTimeout(function () {
            new Swiper(owo.query('.swiper-container')[0], {
              pagination: owo.query('.pagination')[0],
              "autoplay": 3000,
              paginationClickable: true
            });
          }, 0);
        }
      },
      "switchShow": {
        "created": function created() {
          this.data.swiper = new Swiper('#auto-swiper', {
            "loop": true,
            "autoplay": 3000,
            "slidesPerView": 3
          });
        },
        "data": {
          "swiper": null
        },
        "swiperNext": function swiperNext() {
          this.data.swiper.swipeNext();
        },
        "swiperPrev": function swiperPrev() {
          // console.log('swiperPrev')
          this.data.swiper.swipePrev();
        }
      },
      "newsList": {
        "prop": {
          "class": "item"
        }
      },
      "newsList-1": {
        "prop": {
          "class": "item"
        }
      }
    }
  },
  "topBar": {
    "prop": {
      "logo": "http://www.people.com.cn/img/2016people/images/rmw_logo.png"
    }
  },
  "swiperBox": {
    "created": function created() {
      // 轮播图展示区域swiper
      setTimeout(function () {
        new Swiper(owo.query('.swiper-container')[0], {
          pagination: owo.query('.pagination')[0],
          paginationClickable: true
        });
      }, 0);
    }
  },
  "switchShow": {
    "created": function created() {
      this.data.swiper = new Swiper('#auto-swiper', {
        "loop": true,
        "autoplay": 3000,
        "slidesPerView": 3
      });
    },
    "data": {
      "swiper": null
    },
    "swiperNext": function swiperNext() {
      this.data.swiper.swipeNext();
    },
    "swiperPrev": function swiperPrev() {
      // console.log('swiperPrev')
      this.data.swiper.swipePrev();
    }
  },
  "newsList": {
    "prop": {
      "class": "item"
    }
  },
  "newsList-1": {
    "prop": {
      "class": "item"
    }
  }
};

/* 方法合集 */
var _owo = {}

/* 运行页面初始化方法 */
_owo.runCreated = function (pageFunction) {
  try {
    // console.log(pageFunction)
    if (pageFunction.show) {
      pageFunction.show.apply(pageFunction)
    }
    if (pageFunction["_isCreated"]) return

    // 确保created事件只被执行一次
    pageFunction._isCreated = true
    
    if (pageFunction.created) {
      pageFunction.created.apply(pageFunction)
    }
    
  } catch (e) {
    console.error(e)
  }
}




// 判断是否为手机
_owo.isMobi = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null


_owo._run = function (eventFor, templateName, event) {
  // 复制eventFor防止污染
  var eventForCopy = eventFor
  // 判断页面是否有自己的方法
  var newPageFunction = window.owo.script[window.owo.activePage]
  // console.log(this.attributes)
  if (templateName && templateName !== owo.activePage) {
    // 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
    if (newPageFunction.template) newPageFunction = newPageFunction.template[templateName]
  }
  // 待优化可以单独提出来
  // 取出参数
  var parameterArr = []
  var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g)
  
  if (parameterList && parameterList.length > 0) {
    // 参数列表
    parameterArr = parameterList[0].split(',')
    // 进一步处理参数
    
    for (var i = 0; i < parameterArr.length; i++) {
      var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, "")
      // console.log(parameterValue)
      // 判断参数是否为一个字符串
      
      if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
        parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1)
      }
      // console.log(parameterArr[i])
    }
  }
  eventForCopy = eventFor.replace(/\([\d\D]*\)/, '')
  // console.log(newPageFunction, eventForCopy)
  // 如果有方法,则运行它
  if (newPageFunction && newPageFunction[eventForCopy]) {
    // 绑定window.owo对象
    newPageFunction.$event = event
    newPageFunction.$target = event.target
    newPageFunction[eventForCopy].apply(newPageFunction, parameterArr)
  } else {
    // 如果没有此方法则交给浏览器引擎尝试运行
    eval(eventFor)
  }
}

_owo.bindEvent = function (eventName, eventFor, tempDom, templateName) {
  tempDom['on' + eventName] = function(event) {
    _owo._run(eventFor, templateName, event || this)
  }
}

/* owo事件处理 */
// 参数1: 当前正在处理的dom节点
// 参数2: 当前正在处理的模块名称
_owo.handleEvent = function (tempDom, templateName) {
  var activePage = window.owo.script[owo.activePage]
  
  if (tempDom.attributes) {
    for (var ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]
      // 判断是否为owo的事件
      // ie不支持startsWith
      if (attribute.name[0] == ':') {
        var eventName = attribute.name.slice(1)
        var eventFor = attribute.textContent || attribute.value
        switch (eventName) {
          case 'show' : {
            // 初步先简单处理吧
            var temp = eventFor.replace(/ /g, '')
            // 取出条件
            var condition = temp.split("==")
            if (activePage.data[condition[0]] != condition[1]) {
              tempDom.style.display = 'none'
            }
            break
          }
          case 'tap': {
            // 待优化 可合并
            // 根据手机和PC做不同处理
            if (_owo.isMobi) {
              _owo._event_tap(tempDom, function (event) {
                _owo._run(eventFor, templateName, event || this)
              })
            } else _owo.bindEvent('click', eventFor, tempDom, templateName)
            break
          }
          default: {
            _owo.bindEvent(eventName, eventFor, tempDom, templateName)
          }
        }
      }
    }
  }
  
  // 判断是否有子节点需要处理
  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      // 获取子节点实例
      var childrenDom = tempDom.children[i]
      // 每个子节点均要判断是否为模块
      if (childrenDom.getAttribute('template')) {
        
        // 如果即将遍历进入模块 设置即将进入的模块为当前模块
        // 获取模块的模块名
        _owo.handleEvent(childrenDom, childrenDom.getAttribute('template'))
      } else {
        _owo.handleEvent(childrenDom, templateName)
      }
    }
  } else {
    console.info('元素不存在子节点!')
    console.info(tempDom)
  }
}

// 快速选择器
owo.query = function (str) {
  return document.querySelectorAll('.owo[template=' + owo.activePage +'] ' + str)
}

/* 运行页面所属的方法 */
_owo.handlePage = function (newPageFunction, entryDom) {
  /* 判断页面是否有自己的方法 */
  if (!newPageFunction) return
  // console.log(entryDom)
  newPageFunction['$el'] = entryDom
  // console.log(newPageFunction)
  _owo.runCreated(newPageFunction)
  // debugger
  // 判断页面是否有下属模板,如果有运行所有模板的初始化方法
  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key]
    var childDom = entryDom.querySelector('[template="' + key +'"]')
    // 判断相关模块是否在存在
    if (!childDom) {continue}
    _owo.handlePage(templateScript, childDom)
  }
}// 单页面-页面资源加载完毕事件
_owo.showPage = function() {
  // 查找入口
  var entryDom = document.querySelector('[template]')
  if (entryDom) {
    owo.entry = entryDom.getAttribute('template')
    owo.activePage = owo.entry
    _owo.handlePage(window.owo.script[owo.activePage], entryDom)
    _owo.handleEvent(entryDom, null)
  } else {
    console.error('找不到页面入口!')
  }
}

/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */
_owo.ready = (function() {               //这个函数返回whenReady()函数
  var funcs = [];             //当获得事件时，要运行的函数
  
  //当文档就绪时,调用事件处理程序
  function handler(e) {
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
    if(e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return
    }
    // 确保事件处理程序只运行一次
    if(window.owo.state.isRrady) return
    window.owo.state.isRrady = true
    
    // 运行所有注册函数
    for(var i=0; i<funcs.length; i++) {
      funcs[i].call(document);
    }
    funcs = null;
  }
  //为接收到的任何事件注册处理程序
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false)
    document.addEventListener('readystatechange', handler, false)            //IE9+
    window.addEventListener('load', handler, false)
  } else if(document.attachEvent) {
    document.attachEvent('onreadystatechange', handler)
    window.attachEvent('onload', handler)
  }
  //返回whenReady()函数
  return function whenReady (fn) {
    if (window.owo.state.isRrady) {
      fn.call(document)
    } else {
      funcs.push(fn)
    }
  }
})()

// 执行页面加载完毕方法
_owo.ready(_owo.showPage)


