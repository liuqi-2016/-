## Nginx

```
一个牛哄哄的web服务器，提供负载均衡、反向代理等操作
```

### Centos7下手动编译安装

> 1.先安装需要的工具

	gcc g++：源代码编译工具
	
	pcre pcre-devel：Perl Compatible Regular Expressions)，是一个Perl库，包括 perl 兼容的正则表达式库，nginx 的 http 模块使用 pcre 来解析正则表达式，pcre-devel 是使用 pcre 开发的一个二次开发库
	
	zlib zlib-devel：zlib提供了很多压缩和解方式，nginx需要zlib对http进行gzip
	
	openssl openssl-devel：openssl是一个安全套接字层密码库，nginx要支持https，需要使用openssl
	
	安装：
	yum install -y gcc g++ pcre pcre-devel zlib zlib-devel openssl openssl-devel

> 2.下载 Nginx

	进入下载文件夹：cd /root/下载
	#使用以下命令：
	wget http://nginx.org/download/nginx-1.16.1.tar.gz

> 3.解压

	tar -zxvf nginx-1.16.1.tar.gz


> 4.新增安装目录

	Linux下自己安装的软件一般安装在 /usr/local 文件夹下面，在这下面新建一个nginx文件夹
	
	cd /usr/local
	mkdir nginx
	cd /root/下载

> 5.安装

	#进入解压后的 nginx-1.16.1 文件夹
	cd nginx-1.16.1
	
	#查看该目录下的文件列表，其中有一个 configure 文件，是用来检查和做配置的
	ll
	
	#查看配置的操作文档，其中[--prefix=PATH]是指定安装目录的配置，要配置为上面新建的nginx安装目录：/usr/local/nginx
	./configure --help
	
	#检查，并指定安装目录
	./configure --prefix=/usr/local/nginx
	
	#编译，完成可以看到配置信息（安装，日志目录等）
	make
	
	#安装
	make install

> 6.检查

	#进入安装目录
	cd /usr/local/nginx
	
	#查看文件列表，sbin下是 nginx 执行文件
	ll
	
	#检查， -t 是指测试运行，但不是真的运行，安装成功显示配置文件没问题
	./sbin/nginx -t
	
	#启动
	./sbin/nginx
	
	#重启：
	./sbin/nginx -s reload
	
	#停止：
	./sbin/nginx -s quit
	
	#查看网络
	netstat -ntlp

> 7.添加Nginx服务
  *`添加服务后，才能使用 service 或 systemctl 操作nginx`*

	#进入 /etc/init.d
	cd /etc/init.d
	
	#新建 nginx 文件
	vim nginx
	
	#写入以下内容：
```shell
    #!/bin/sh
    # nginx - this script starts and stops the nginx daemin
    #
    # chkconfig:   - 85 15

    # description:  Nginx is an HTTP(S) server, HTTP(S) reverse \
    #               proxy and IMAP/POP3 proxy server
    
    # processname: nginx
    # config:      /usr/local/nginx/conf/nginx.conf
    # pidfile:     /usr/local/nginx/logs/nginx.pid
    
    # Source function library.
    
    . /etc/rc.d/init.d/functions
    
    # Source networking configuration.
    
    . /etc/sysconfig/network
    
    # Check that networking is up.
    
    [ "$NETWORKING" = "no" ] && exit 0
    
    nginx="/usr/local/nginx/sbin/nginx"
    
    prog=$(basename $nginx)
    
    NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"
    
    lockfile=/var/lock/subsys/nginx
    
    start() {
    
        [ -x $nginx ] || exit 5
    
        [ -f $NGINX_CONF_FILE ] || exit 6
    
        echo -n $"Starting $prog: "
    
        daemon $nginx -c $NGINX_CONF_FILE
    
        retval=$?
    
        echo
    
        [ $retval -eq 0 ] && touch $lockfile
    
        return $retval
    
    }
    
    stop() {
    
        echo -n $"Stopping $prog: "
    
        killproc $prog -QUIT
    
        retval=$?
    
        echo
    
        [ $retval -eq 0 ] && rm -f $lockfile
    
        return $retval
    
    }
    
    restart() {
    
        configtest || return $?
    
        stop
    
        start
    
    }
    
    reload() {
    
        configtest || return $?
    
        echo -n $"Reloading $prog: "
    
        killproc $nginx -HUP
    
        RETVAL=$?
    
        echo
    
    }
    
    force_reload() {
    
        restart
    
    }
    
    configtest() {
    
      $nginx -t -c $NGINX_CONF_FILE
    
    }
    
    rh_status() {
    
        status $prog
    
    }
    
    rh_status_q() {
    
        rh_status >/dev/null 2>&1
    
    }
    
    case "$1" in
    
        start)
    
            rh_status_q && exit 0
            $1
            ;;
    
        stop)


            rh_status_q || exit 0
            $1
            ;;
    
        restart|configtest)
            $1
            ;;
    
        reload)
            rh_status_q || exit 7
            $1
            ;;


        force-reload)
            force_reload
            ;;
        status)
            rh_status
            ;;


        condrestart|try-restart)
    
            rh_status_q || exit 0
                ;;
    
        *)
    
            echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
            exit 2
    
    esac
```

	#设置权限
	chmod 755 nginx
	
	#添加开机启动
	#方法一：
	chkconfig --add nginx
	
	#方法二：未实验
	#即在rc.local增加启动代码就可以了。
	#vi /etc/rc.local
	#增加一行 /usr/local/nginx/sbin/nginx
	#设置执行权限：
	#chmod 755 rc.local
	
	#使用 service 或 systemctl 操作
	service nginx status
	
	systemctl status nginx
	
	#service
	#支持的命令：start, stop, restart, try-restart, reload, force-reload, status
	#语法：service service_name command
	
	#systemctl
	#语法：systemctl command service_name

> 8.建立软连接
 `软连接放在 /usr/local/sbin 目录下，这样可以在任何地方使用 nginx`

	ln -n /usr/local/nginx/sbin/nginx /usr/local/sbin