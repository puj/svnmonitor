#svnmonitor
A node module command-line wrapper for SVN read-only commands.
_PREREQUISITE:_ svn must be installed on your server, wherever you run 'node yourNodeProgram.js'


##Installation

###NPM
`npm install svnmonitor`

This will create a node_modules/ in your current directory if you don not already have one.
You can then `var svnMonitor = require('svnmonitor');`

###Manually

1. Go to your node apps root dir
2. Run 'git clone git@github.com:puj/svnmonitor.git'
3. Add  'var svnMonitor = require("./lib/svnmonitor");' to your requires.

Currently only supports the 'svn log' command.


##Usage:
	svnMonitor.init("http://extjs-public.googlecode.com/svn/trunk",{
		//user : 'username',
		//pass : 'password',	
		callback : function(){
			svnMonitor.getLatestCommits({
				//limit:3,
				callback: function(err, revisions){
					if(err){
						console.log('Error: ' + err);
						return;
					}

					console.log(revisions)
				}
			});
	}});

Username and password are optional to init. 
Url is required.

Currently getLatestCommits is the only functionality. 
If no limit is provided, all log entries are retrieved.


revisions is structured as follows:  
	[ { revision: '90 ', 
	    author: ' schmeeky ', 
	    date: ' 2009-12-06 18:12:44 +0100 (Sun, 06 Dec 2009) ', 
	    message: 'Set MIME types\n' }, 
	  { revision: '68 ', 
	    author: ' schmeeky ', 
	    date: ' 2009-06-22 15:14:18 +0200 (Mon, 22 Jun 2009) ', 
	    message: 'Missing changes\n' }, 
	  { revision: '39 ',  
	    author: ' Schmeeky ', 
	    date: ' 2009-02-12 13:40:57 +0100 (Thu, 12 Feb 2009) ', 
	    message: 'Update to ExtJS 2.2.1\n' } ] 



