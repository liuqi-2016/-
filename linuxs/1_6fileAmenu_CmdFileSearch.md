### 命令与文件的搜索

> 搜索

	命令档名搜索：
		which [-a] command
	
			a：将所有由PATH 目录中可以找到的命令均列出


	文集档名搜索：使用数据库搜索，find是找磁盘
		1. whereis [bmsu] 文集或目录
	
			b：只找 binary 格式的文件
	
			m：只找在 说明档 manual路径下的文件
	
			s：只找 source 来源文件
	
			u：搜索不在上述三项中的其他特殊文件


		2. locate [-ir] 关键字
			是由【已创建的数据库 /var/lib/mlocate/】里面的数据搜索到的，有点限制就是数据库是每天升级依次，所有新建的文件会找不到
			不过可以手动升级数据库，使用: updatedb
	
			i：忽略大小写
	
			r：后面可接正规表示法的显示方式
	
		3. updatedb：
			根据 /etc/updatedb.conf 的配置去搜索系统磁盘内的档名，并升级 /var/lib/mlocate 内的数据文件
			直接输入 回车


		 4. find [PATH] [option] [action]
			具体参数使用 man 或 info 查看















