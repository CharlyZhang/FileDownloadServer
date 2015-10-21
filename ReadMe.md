#资源列表服务（ResourceAPIServer）

*	端口号8007

#文件下载服务器（ResourceDownloadServer）
*	*resources*文件夹放置资源，其中*covers*文件夹为资源的封面图片；需保证名称一致；
*	端口号8008
#linux部署
1.  安装node.js环境；
2.  将下载的资源及封面分别放入*resources*文件夹和*covers*文件夹；
3.  设置*config.js*中的DownloadServer的本机文件下载服务器的ip和port；
4.  运行*start.sh*脚本。
5.  运行*test.sh*脚本，测试接口运行状态。

#windows部署
1.  安装node.js环境；
2.  将下载的资源及封面分别放入*resources*文件夹和*covers*文件夹；
3.  设置*config.js*中的DownloadServer的本机文件下载服务器的ip和port；
4.  开启控制台，输入*node ResourceAPIServer.js*命令启动资源接口；
5.  另开启控制台，输入node ResourceDownloadServer.js*命令启动下载服务器；
6.  如果出现启动错误，可能由于端口被占用。先运行*taskkill /F /IM note.exe*杀死note进程，然后再重做4、5步即可。

