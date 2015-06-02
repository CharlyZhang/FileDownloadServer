/**
 * Created by CharlyZhang-Local on 15-5-12.
 */

exports.Expires = {

    fileMatch: /^(gif|png|jpg|mp3|epub)$/ig,
    maxAge: 606024365
};

exports.Compress = {

    match: /mp3|html/ig

};

exports.DownloadServer = {
    "IP": 	"127.0.0.1",  //此处必须重新设置，否则文件无法下载
	"Port": "8008"
};
