##  Git：

> ***注意：***
	`确保都是在utf-8的环境，否则在跨平台时会有点空格 换行问题`

> ***git分为：工作区  暂存区  版本仓储区***

	其中：暂存区 版本仓储区都属于版本库
	工作区 添加到 暂存区，暂存区 提交到 版本仓储区
## 常用命令：

>**查看目录文件** 

	ls
`参数：`
+ `-a 	查看目录文件，包含隐藏的`
+ `-l 	按详细信息查看`

>**查看当前目录路径**

	pwd

>**查看当前状态**

	git status
`参数：`
- `-s	按简单的行排列`
- `?:没有版本管理`
- `M:已经修改`

>**比较文件内容**

	git diff <head> -- <file>
`参数：`
* `<head -->：跟最新版本库比较`
	*	`head可以为：HEAD 或 commitid`
* `--：两横 这个必须要跟上`
* `<file>：比较的文件`
* `git diff：比较全部的文件`

>**查看日志**

	git log
`参数：`
* `--pretty=<args>`
	*	`oneline 在一行显示，这个可以单独使用 --oneline，还能带其他参数`
* `--graph 查看分支合并图`
* `--abbrev-commit 显示所有提交详细`

>**查看每次使用的命令历史，会有版本号显示**

	git reflog

>**查看所有配置信息**

	git config [--system/--global] -l/--list

---

## 创建一个仓库
>**创建一个仓库，会多出一个 .git 隐藏目录**

	git init

>**创建一个裸仓，一般用于在服务器做版本库，这样创建的仓库是看不到提交的文件的，但能获取到，提交的文件都以二进制的形式存放**

	git init --bare <gitname.git>

>**可以在已有项目下 或 空目录中使用创建的操作**

	git init

### 添加  提交

>**添加文件到暂存区**

	git add <-f> <file>
`参数：`
* `<-f>：可选，强制添加文件`
* `<file>：要添加的文件名称`
* `git add .：全部文件都提交`

>**将暂存区的文件提交到版本库**

	git commit -m <comment>
`参数：`
* `-m <comment>：参数添加提交的描述信息，不使用时会出现一个编辑环境叫你填写提交描述，这个环境是可以通过配置做一个全局的`

### 版本回退 撤销修改

	HEAD 指向的是当前版本
	上一个版本是：HEAD^ 或 HEAD~1    上上个版本是：HEAD^^ 或 HEAD~2  以此类推

>**回退到head版本**

	git reset --hard <head>
`参数：`
* `--hard：`
* `head：可以是 HEAD^ 或 commitid(只需要前面八位左右就能自动找到对应的完整commitid)`

>**撤销修改：checkout**

	git checkout -- <file>
`参数：`
* `--：一定要跟上，否则就是切换分支，这个命令有一键还原的功能(不管文件是修改还是删除)`
* `file：撤销的文件`
* ```
  两种情况：
	a、修改了，没有添加到暂存区，撤销-工作区就回到版本库的状态
	b、修改了并且添加到了暂存区，撤销-工作区就回到暂存区的状态
	撤销就是回到最近一次 git add 或 git commit 的状态
	```

>**撤销修改：reset，将添加到暂存区的文件撤回到版本库的状态**

	git reset <head> <file>
`参数：`
* `head：可以是 HEAD 或 commitid`
* `file：还原的文件`

### 删除

>**删除工作区的文件**

	rm <file>
`参数：`
* `file：删除的文件`

>**删除版本库的文件**

	git rm <file>
`参数：`
* `rm：删除命令`
* `file：删除的文件`

>**真正删除版本库的文件**

	#在工作区删掉
	rm <file>
	#在版本库删掉
	git rm <file>
	#提交状态
	git commit -m <comment>
	
	如果只是删除了工作区的，可以使用 checkout -- 命令将版本库的还原

### 远程

>**将远程版本库克隆到本地**

	git clone [-b branch] <url>
`参数：`
* `url: 项目地址一般以.git结尾`
* `-b branch：克隆分支代码，不带这个参数克隆的是master分支代码，branch为具体分支的名称`

>**添加远程版本库**

	git remote add <originname> <url>
`参数：`
* `originname: 远程版本库地址对应本地的名称，之后可以使用这个名字代替url`
* `url：远程版本库地址`

>**将本地文件推送到版本库**

	git push <-u> <originame> <branch>
`参数：`
* `-u：可选，可以将本地的branch跟远程的branch建立关联，没有建立关联推送不了，所以一般第一次推送要加上这个参数`
* `originname：远程版本库名字`
* `branch：要推送到的远程版本库的分支名称`

>**拉取远程版本库文件到本地**

	git fetch/pull <--all/-vv> <originname> <branch>
`参数：`
* `fetch：只是拉取到本地，但不会合并，需要手动合并`
* `pull：拉取后会尝试合并`
* `--all/-vv：二选一，拉取所有分支，不需要指定远程版本库和远程分支名称`
* `originname：远程版本库名字`
* `branch：要拉取的远程版本库的分支名称`

>**查看所有远程分支**

	git remote <-v>
`参数：`
* `-v：可选，显示详细远程信息`

>**删除关联的远程版本库**

	git remote rm <originame>
`参数：`
* `originname：远程版本库名字`

### 分支

>**创建分支**

	git branch <-b> <branchname>	<remotename>/[branchname2]
`参数：`
* `<-b>：可选，创建分支后切换到该分支`
* `<branchname>：创建的分支名称`
*	`<remotename>/<branchname2>：可选，对应的远程分支，加上此项，创建的本地分支branchname将与远程的分支branchname2关联`

>**查看所有分支，带有 * 的表示为当前指向的分支**

	git branch

>**切换到分支**

	git checkout <branchname>
`参数：`
* `<branchname>	分支名称`

>**删除分支**

	git branch <-d|-D> <branchname>
`参数：`
*	`<-d>	删除分支，有错误将显示提示，并终止删除`
*	`<-D>	删除分支，强制删除`
*	`<branchname>	分支名称`

*	**`删除远程分支`**
	* `git push <originname> --delete <branchname2>`
	* `参数：`
		* `<originname>	远程版本库名字`
		* `<branchname2>	远程版本库中分支的名称`

>**合并分支，将 branchname分支合并到当前指向分支**

	git merge <--no-ff> <-m> <content> <branchname>
`参数：`
*	`<--no-ff>		可选，禁用快速合并，可以查看到合并后的历史有分支，默认为 快速分支:fast forward`
*	`<-m> <content>	可选，添加合并描述`
*	`<branchname>	分支名称`
*		如果合并有冲突，文件中会以 <<<<< HEAD  content1  ========  content2 >>>>>>> dev 的形式显示，content1表示在当前分支HEAD指向的修改，content2表示在dev分支的修改
		按需要调整后，删除 <<<<<< HEAD  ========   >>>>>>> dev 这些内容，然后做添加 提交操作即可

*	变基合并分支，一种叫变基 的合并方式，不会产生分支合并线路，就是跟在一个分支里面做操作一样
	*	`git rebase <branchname>`
	*	参数：
		* `<branchname>：目标基底分支，就是将当前所在分支与那个分支进行变基合并操作，一定要确保基底分支中没有对当前分支中修改的文件做修改，如果改了那么只能使用 merge合并`

>**将本地分支与远程分支建立关联**

	git branch --set-upstream-to/-u <branchname1> <originname>/<branchname2>
`参数：`

*	`<branchname1>：可选，本地分支名称，省略表示将当前所在分支跟踪 远程分支`
*	`<originname>：远程版本库名字`
*	`<branchname2>：远程版本库中分支的名称`

>**将当前所在分支与远程分支建立关联**

	git checkout --track <remotename>/<branchname2>
`参数：`
*	`<remotename>/<branchname2>：远程版本库名字/远程版本库中分支的名称`

>**查看本地分支与跟踪的远程分支的信息**
	   是否跟踪了远程分支；
	   本地分支与远程分支哪个领先 落后版本；
	   提交时的描述；

	git branch -vv

>**获取远程分支并创建本地分支1**
	   本地分支会跟远程分支建立映射关系

	git checkout -b <localbranch> origin/<remotebranch>
`参数：`

*	`<localbranch>：本地分支名称`
*	`<remotebranch>：远程分支名称`

>**获取远程分支并创建本地分支2**
	   本地分支不会与远程分支建立映射关系，需要手动建立

	git fetch origin <remotebranch>:<localbranch>
`参数：`
*	`<localbranch>：本地分支名称`
*	`<remotebranch>：远程分支名称`



### 分支管理--Stash

>**将当前分支工作区‘隐藏’，使用这个命令保存后，工作区是干净的**
>**只有add到git版本库中的文件才能被缓存为stash**

	git stash [save message]
`参数：`
*	[save message] ：可选，填写备注，这样方便查找
```
  使用场景：
   在分支dev开发时，突然要回到master分支修改问题，那么就使用 git stash将当前分支工作区保存起来，然后可以切换到master分支，创建个upd分支
   在upd分支中修改完成，回到master分支合并upd，然后删除upd分支
   继续回到dev分支开发，但此时dev分支的工作区是干净的，所有需要恢复到工作现场
```

>**查看保存的工作现场**

	git stash list

>**恢复保存的工作现场**

	git stash apply <stash@{commitid}>
`参数：`

*	`<stash@{commitid}>	可选，恢复到指定commitid的工作现场`
*	eg：git stash apply "stash@{0}"

>**删除工作现场**

	git stash drop <stash@{commitid}>
`参数：`

* `<stash@{commitid}>	可选，删除指定commitid的工作现场`

>**恢复并删除工作现场**

	git stash pop <stash@{commitid}>
`参数：`

* `<stash@{commitid}>	可选，删除指定commitid的工作现场`

>**清除所有缓存的stash**

	git stash clear

### 标签

>**创建标签，类似分支，但标签只是给当前分支添加一个标记，是固定的**

	git tag <-s> <-a> <tagname> <-m> <comment> <commitid>
`参数：`
* `<-s>：可选，使用密钥签名标签，必须首先安装gpg（GnuPG）`
* `<-a>：可选，指定标签名称`
* `<tagname>：标签名称，如v1.0`
* `<-m> <comment>：可选，添加描述指定`
* `<commitid>：可选，提交的commitid，有这个就是在这个地方打标签`

>**查看所有标签**

	git tag

>**查看标签对应的内容信息**

	git tag <tagname>
`参数：`
* `<tagname>：标签名称，如v1`

>**删除标签**

	git tag -d <tagname>
`参数：`
* `<tagname>：标签名称，如v1`

>**推送标签到远程版本库**

	git push <originname> <tagname>/<--tags>
`参数：`
* `<originname>：远程版本库名字`
* `<tagname>/<--tags>：标签名称，如v1  或  --tags：这个是将所有标签都推送到远程`

>**删除远程版本库的标签，先删除本地，然后删远程**

	git push <originame> :refs/tags/<tagname>
`参数：`
* `<originame>		远程版本库名字`
* `<tagname>		标签名称，如v1`


### 其他

>**忽略文件以.gitignore后缀的文件，[GitIgnore](https://github.com/github/gitignore "GitIgnore") 这里已经设定了很多可以直接使用**

	git check-ignore -v <file>：检查忽略文件内容
	
	如果要删掉，就在.git/.gitconfig 文件中找到对应的行删掉

>**别名 添加命令的别名**

	git config <--system/--global> alias.<shortname> <command>
`参数：`
* `<--sytem/--global>：`
	*	`--system:系统(全部用户)级别`
	* `--global:全局(当前用户)级别`
	* `不加就是在当前本地版本库的`
* `<command>：命令名称，如 status:状态    reset HEAD:撤销修改`


