
## Apache 安装和最简单配置

> **下载地址**：http://httpd.apache.org/download.cgi

> **步骤**：

	1. 进入下载地址
	2. 点击“Files for Microsoft Windows”
	3. 点击“Apache lounge”
	4. 选择一个平台下载


> **安装配置**：

	1. 解压下载的文件到指定目录  如：g:/apache2464

	2. 在解压的目录下的 conf目录下 找到 httpd.conf文件进行修改
		将所有：c:Apache24  这个路径全部替换为当前解压的目录
		设置一下端口，80端口可能已经被占用了

	3. 打开cmd，进入到安装目录下的bin目录
		输入安装服务命令：httpd -k install
		出现：Service is aready installed.  表示服务安装成功

	4. 可以将Apache安装目录的bin目录(这里就是：g:/apache2464/bin)配置为环境变量，就能直接使用 httpd 这个命令

