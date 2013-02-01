var SVNMonitor = require("./index.js");

var svnMon = new SVNMonitor(
	"svn://[url]",
	"[user]",
	"[pass]"
);

svnMon.getLatestCommits("30", function(err, log){
	console.log(log);
});