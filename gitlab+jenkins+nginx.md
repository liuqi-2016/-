## Gitlab+Jenkins+Nginx部署前端项目

***准备：***
```
centos7环境三个分别安装：
gitlab(10.88.22.77)，jenkins(10.88.22.67)，nginx(10.1.245.101)
项目上传到gitlab
```
### Jenkins配置

> 部署Jenkins的系统需要安装git，这里安装位置在：/usr/local/gits

- [x] ***安装插件***
> 手动安装快些，[下载地址][1]，主要安装下面两个，其他的插件一般在安装jenkins时已经安装好了，有些插件不匹配需要将jenkins升级到最新版本

	构建时设置git参数：Build With Parameters
	
	构建后发布到服务器：Publish Over SSH


- [x] ***全局工具配置***

------
<img src="images/gitlab_jenkins_nginx/jenkins_globaltoolconfig.png" alt="jenkins全局工具配置"  />

------
> **1、gitlab使用的git所在路径**

![jenkins全局工具配置1](images/gitlab_jenkins_nginx/jenkins_globaltoolconfig1.png)

------
> **2、全局nodejs环境**

![jenkins全局工具配置3](images/gitlab_jenkins_nginx/jenkins_globaltoolconfig3.png)

- [x] ***系统配置***

------
![jenkins系统配置](images/gitlab_jenkins_nginx/jenkins_systemconfig.png)

------
> **1、配置全局gitlab，可以配置也可以不配置**

![jenkins系统配置1](images/gitlab_jenkins_nginx/jenkins_systemconfig1.png)

------
> **1.1、获取gitlab用户的token，先看设置里的Account，没有就去Account Token里面新增一个**

![jenkins系统配置2_gitlab_token1](images/gitlab_jenkins_nginx/jenkins_systemconfig2_gitlab_token1.png)
![jenkins系统配置2_gitlab_token](images/gitlab_jenkins_nginx/jenkins_systemconfig2_gitlab_token.png)

------
> 1.2、**给全局gitlab添加凭证，点击`添加`，选择`jenkins`，添加好凭证会在旁边的下拉项出现，右边`Test Connection`测试下是否能链接成功**

![jenkins系统配置3](images/gitlab_jenkins_nginx/jenkins_systemconfig3.png)

> **2、配置publish over ssh，构建后发布到的nginx服务器，设置好可以点击`Test Connection`测试是否连接成功**

![jenkins系统配置4_publishoverssh](images/gitlab_jenkins_nginx/jenkins_systemconfig4_publishoverssh.png)
     ***上面配置的密码Passphrase，是针对下面所有的ssh servers，每个ssh servers都可以设置自己的密码***

------
![jenkins系统配置4_publishoverssh1](images/gitlab_jenkins_nginx/jenkins_systemconfig4_publishoverssh1.png)
     ***每个ssh servers都能在右下角【高级】中配置自己的密码***



------



### 添加构建任务
> 新建一个视图，选择视图新建Item，添加后直接进入配置页
#### 1、自由风格任务

![jenkins添加自由风格item](images/gitlab_jenkins_nginx/jenkins添加自由风格item.png)

------
> **`1、设置构建时选择的参数`**

![jenkins添加自由风格item_配置任务](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务.png)
     ***这里没有配置全局gitlab，所有下拉项没有选项***
     

------
![jenkins添加自由风格item_配置任务1](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务1.png)

------
![jenkins添加自由风格item_配置任务2](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务2.png)
	***这里填写是 名称:branshs，描述:分支，参数类型:分支，默认值:master***

------
![jenkins添加自由风格item_配置任务3](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务3.png)

------
![jenkins添加自由风格item_配置任务4](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务4.png)
	***这里填写的是 名称：environment，选项：test2 prod saas，描述：构建环境***

------
> **`2、源码管理配置`**

![jenkins添加自由风格item_配置任务_源码管理](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_源码管理.png)
![jenkins添加自由风格item_配置任务_源码管理1](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_源码管理1.png)

***添加凭证后会出现再下拉项，没有凭证时设置仓库地址会报错，选择一个凭证后就可以了***

------
> **`3、构建环境配置`**

![jenkins添加自由风格item_配置任务_构建环境](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建环境.png)

------
> **`4、构建步骤`**

![jenkins添加自由风格item_配置任务_构建步骤](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建步骤.png)

------

![jenkins添加自由风格item_配置任务_构建步骤1](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建步骤1.png)
***这里填写如下，使用了参数配置中的环境变量草书`envrionment`：
`npm cache clean --force
npm install
rm -rf dist/*
npm run build:${envrionment}
`***

------
> **`5、构建后步骤`**

![jenkins添加自由风格item_配置任务_构建步骤2](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建步骤2.png)

![jenkins添加自由风格item_配置任务_构建步骤3](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建步骤3.png)

![jenkins添加自由风格item_配置任务_构建步骤4](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置任务_构建步骤4.png)
***这里填写如下：基础配置完成保存后可以使用
`Source files: dist/**
Remove prefix: dist/
Remote directory: /usr/local/nginx
Exec command: systemctl restart nginx
`***

> **`6、开始构建页面`**

![jenkins添加自由风格item_配置完成_开始构建页面](images/gitlab_jenkins_nginx/jenkins添加自由风格item_配置完成_开始构建页面.png)


[1]: http://updates.jenkins-ci.org/download/plugins/

