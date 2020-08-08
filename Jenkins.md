## JenKins
	一个基于Java开发的自动化部署工具
	前提：需要安装JDK

#### 参考：https://blog.51cto.com/13293070/2173370?source=dra

### CentOS7手动离线rpm安装

> 1. 下载Jenkins的rpm包

	去这里：http://mirrors.jenkins-ci.org/status.html
	选择清华的镜像站 --> Redhat

> 2. 上传RPM包到centos

	新建个文件夹：/usr/local/jenkins，上传到这里
	这里是在window中用 Xftp工具上传

> 3. 安装

	a. 进入上传RPM包的文件夹
	b. rpm -ivh jenkins.xxx.xxx.rpm

> 4. 配置

	在这里：/etc/sysconfig/jenkins，可以做些设置 像 端口（默认8080） 用户名等

**查看安装路径：**
* 执行：rpm -ql jenkins
  * /etc/init.d/jenkins ：启动及命令配置
  * /usr/lib/jenkins/：jenkins安装目录，war包会放在这里
  * /etc/sysconfig/jenkins：jenkins配置文件，“端口”，“JENKINS_HOME”等都可以在这里配置
  * /var/lib/jenkins/：默认的JENKINS_HOME，工作目录
  * /var/log/jenkins/jenkins.log：jenkins日志文件

> 5. 启动

	执行：systemctl start jenkins
	看下状态：systemctl status jenkins

> 6. 设置防火墙

	添加端口：firewall-cmd --zone=public --permanent --add-port=8080/tcp
	查看是否成功：firewall-cmd --query-port=8080/tcp

> 7. 访问

	http://ip:8080 

**问题**
* 页面一直提示：Please wait while Jenkins is getting ready to work，无反应，F12 出现 503
* 解决：
  * 修改 ：`/var/lib/jenkins/hudson.model.UpdateCenter.xml` 中的 url
  * 将 `https://updates.jenkins.io/update-center.json` 改为 `http://mirror.xmission.com/jenkins/updates/update-center.json`
  * 重新加载：systemctl daemon-reload   

> 8. 访问成功，需要输入初始密码

	在日志中看：/var/log/jenkins/jenkins.log
	在文件中看：/var/lib/jenkins/secrets/initialAdminPassword 

> 9. 继续配置Jenkins，安装写插件

> 10. 卸载

	卸载：rpm -e jenkins  
	查看卸载是否成功：rpm -ql jenkins 
	彻底删除残余：find / -iname jenkins | xargs -n 1000 rm -rf

### 在线yum安装

> 1. 下载安装依赖获取的仓储配置

	yum的仓库在：/etc/yum.repos.d 文件夹，安装时会根据安装的软件名称在这里找到对应前缀的repo，获取里面的配置去下载
	
	执行以下命令，设置jenkins的下载配置：
	sudo wget -O /etc/yum.repos.d/jenkins https://pkg.jenkins.io/redhat-stable/jenkins.repo 

> 2. 导入密钥

	sudo rpm --import  https://pkg.jenkins.io/redhat-stable/jenkins.io.key

> 3. 安装

	yum install jenkins 这会很慢，下载最新的稳定版，等待完成



### 下载插件慢的处理

> 1. 修改jenkins工作目录下更新的配置文件 

	工作目录： /var/lib/jenkins
	更新位置：/var/lib/jenkins/updates，里面有个default.json，定义了更新时从哪里获取东西的url

> 第一种方式：手动修改 default.json

	vim /var/lib/jenkins/updates/default.json
	
	替换所有插件下载的URL：
	:1,$s/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g
	
	替换链接测试URL
	:1,$s/http:\/\/www.google.com/https:\/\/www.baidu.com/g
	
	**进入vim先输入：然后再粘贴上边的：后边的命令，注意不要写两个冒号！**
	
	然后保存退出

> 第二种方式：使用 sed

	sed -i 's#http://updates.jenkins-ci.org/download#https://mirrors.tuna.tsinghua.edu.cn/jenkins#g' default.json && sed -i 's#http://www.google.com#https://www.baidu.com#g' default.json
	
	这是直接修改的配置文件，如果前边Jenkins用sudo启动的话，那么这里的两个sed前均需要加上sudo

> 修改完成，重启jenkins，在安装插件