#资源列表服务（ResourceAPIServer）

*	端口号8007

#文件下载服务器（ResourceDownloadServer）
*	*resources*文件夹放置资源，其中*covers*文件夹为资源的封面图片；需保证名称一致；
*	端口号8008
#部署
1.  安装node.js环境；
2.  将下载的资源及封面分别放入*resources*文件夹和*covers*文件夹；
3.  设置*config.js*中的DownloadServer的本机文件下载服务器的ip和port；
4.  运行*start.sh*脚本。


