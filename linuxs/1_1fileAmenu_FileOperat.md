### 档案权限


> 范例：

	-rwxr---w-	   1        root        root         1938     May 3 18:00   vm.tar.gz
	档案类型 权限	  连接数    档案拥有者    档案所属群组   档案大小  档案修改时间      档案名称


> 第一栏：

	- rwx r-- -w-  ：分为四组
	
	第一个字元：代表档案类型：
		[d]	目录，[-] 档案，[l] 链接，
		[b] 装置档里面的可供储存的周边设备(可随机存储装置)
		[c] 装置档里面的序列埠设备，如键盘 鼠标
		
	后面的则三个为一组，都为[rwx]的三个参数的组合
		[r] 可读，[w] 可写，[x] 可执行
		
	第一组：档案拥有者的权限
	第二组：档案所属群组中账号的权限
	第三组：非本人且非所属群组中账号的其他账号的权限


> 档案权限操作

	chgrp：改变档案所属群组
	
	chown：改变档案拥有者
	
	chmod：改变档案的权限


> 改变所属群组：

	chgrp [-R] dir/file			
		[-R] 进行递归(recursive)的持续更改

> 改变拥有者：

	chown [-R] username dir/file				改变拥有者
	chown [-R] username:groupname dir/file      同时改变拥有者和所属群组
	chown [-R] username.groupname dir/file		同时改变拥有者和所属群组
		[-R] 进行递归(recursive)的持续更改

> 改变权限：

	chmod [-R] xyz dir/file		
	
	权限分数对照：
		r : 4  可读
		w : 2  可写
		x : 1  可执行


> 可以用权限分数代替修改，使用每组的权限分数和

	如 rwxr--rw- : 746   chmod 746 dir/file

> owner/group/other的符号简称：

	owner : u 拥有者
	group : g 所属群组
	other : o 其他人
	all   : a 所有

> 符号简称修改格式：

					u:拥有者 					
					g:所属群组	    +:加入       r 		
		chmod        			   -:除去       w   dir/fileName
					o:其他人		 =:设置		x 		
					a:所有 					
		
	如：
		chomd u=rwx,go=rx dir/file
		
		chmod a+w dir/file


