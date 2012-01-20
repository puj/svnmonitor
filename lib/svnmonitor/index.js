var exec = require('child_process').exec;
	

// SVN Repo info
var svn_url,
	svn_user,
	svn_pass;

var svn_opt_str_user,
	svn_opt_str_pass;

/*
 * 	Spawns a child_process running svn log
 *	 Returns a child_process built with specific options for 'svn log'
 */
var _getSvnLogProcess = function(command_opt_str, callback){	
	return exec('echo p | svn ' + _buildSvnCommandArgs('log',command_opt_str).join(' '),callback);
};

/*
 *	Pushes all svn applicable options and the command 
 *  to an array to give to a child_process
 */
function _buildSvnCommandArgs(command,command_opt_str){
	var args = [];
	args.push(command);
	args.push(svn_url);
	args.push(svn_opt_str_user);
	args.push(svn_opt_str_pass);
	args.push(command_opt_str);
	return args;
}
 
 
/*
 *Init function, save the information for connection
 */
exports.init = function(url,options){
	var options = options || {};
	var svn_user = options.user ;
	var svn_pass = options.pass;
	var cb = options.callback;
	svn_url = url;
	
	if(!svn_url){
		throw new Error("svnmonitor: url and a callback are required for init() function");
	}
		
	// Setup opt string for user, pass, and url
	svn_opt_str_user = svn_user ? ('--username ' + svn_user) : '';
	svn_opt_str_pass = svn_pass ? ('--password ' + svn_pass) : '';
	
	
	if(cb)cb();
}; // init


/* 
 * Runs 'svn log' with arguments provided in init 
 */
exports.getLatestCommits = function(options){
	var options = options || {};
	var limit = options.limit;
	var cb = options.callback;
	
	if(!svn_url || !cb){
		throw new Error("svnmonitor: you need run init first, or provide a callback");
	}
	
	// Don't use -l if limit is not passed in explicitly
	//  this will retrieve all log entries
	var opt_str_limit = limit ? ('-l ' + limit) : ''; 
	
	var thisLogQuery = _getSvnLogProcess(opt_str_limit, function (error, stdout, stderr) {		
		if(error != null){			
			cb(error)
		}

		var revs =  stdout.replace(/-+\n/g,'~').split(/~/);
		
		var returnArray = [];
		for(var i in revs){
			// Some elements are empty after split
			if(revs[i].indexOf('|') != -1){
				// remove 'lines(s) ###' prefix from message
				//  and split on newline
				revs[i] = revs[i].replace(/\s+[0-9]+\s+line[s]*\s*\n/,'').replace(/[\n]/,'').split('|');

				// Add the valid element to the return array
				returnArray.push({
					revision : revs[i][0].substring(1),
					author : revs[i][1],
					date : revs[i][2],
					message : revs[i][3]
					});
			}
		}

		// No error
		cb(null,returnArray);
	});
	
}; // getLatestCommits