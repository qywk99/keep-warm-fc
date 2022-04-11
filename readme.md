# Keep-warm-fc Plugin
![image](https://img.alicdn.com/imgextra/i1/O1CN01MtBYtc1aRoSTAtZ4p_!!6000000003327-2-tps-1810-688.png)
<p align="center" class="flex justify-center">
  <a href="https://nodejs.org/en/" class="ml-1">
    <img src="https://img.shields.io/badge/node-%3E%3D%2010.8.0-brightgreen" alt="node.js version">
  </a>
  <a href="https://github.com/devsapp/website-fc/blob/master/LICENSE" class="ml-1">
    <img src="https://img.shields.io/badge/License-MIT-green" alt="license">
  </a>
</p>

本插件帮助您通过 [Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs/) 工具和 [FC组件](https://github.com/devsapp/fc/) 实现实例预热，降低冷启动的概率。

- [快速开始](快速开始)
  - [冷启动优化](./codeStart.md)
  - [作用](#作用)
  - [快速上手](#快速上手)
  - [参数说明](#参数说明)

- [工作原理](#工作原理)
## 快速开始
### 作用
本插件主要通过[定时触发器预热函数](./codeStart.md#使用定时触发器预热函数)达到有效`降低冷启动的概率`目的

### 快速上手
`website-fc`本质是针对[FC组件](https://serverless-devs.com/fc/readme)进行增强。
还是遵循FC组件的[Yaml规范](https://serverless-devs.com/fc/yaml/readme)

在执行部署钩子`post-deploy`之后声明插件, 同时声明Http函数的访问链接
```
actions:
  post-deploy: # 在deploy之后运行
    - plugin: keep-warm-fc
      args:
        url: http://start-fc-http-nodejs14.hello-world-service.1694024725952210.cn-hangzhou.fc.devsapp.net
```
### 参数说明
| 参数名称 | 默认值 | 参数含义 | 必填 |
| --- | --- | --- | --- | --- |
| url  | -- |  Http函数的访问地址    | true |
| cronExpression  | 2m |  请求的频率(默认2分钟)    | false |
| enable  | true |  定时函数是否开启    | | false |

## 工作原理
工作原理比较简单，就是在完成当前部署后。`post-deploy`的钩子函数中，部署一个[定时触发器](https://help.aliyun.com/document_detail/68172.html)的辅助函数，这个函数每隔`2s`会触发一次主函数(`Http函数`)中的URL，达到降低冷启动概率的目的。
![](https://img.alicdn.com/imgextra/i2/O1CN01iDeAjC1IktsqMLN8u_!!6000000000932-2-tps-550-300.png)

### 实现代码
```
def handler(event, context):
  url = os.environ['KEEP_WARM_FC_URL']
  res = requests.head(url)
  return res.status_code
```
