var exec = require('child_process').exec;


/*
 *Init function, save the information for connection
 */
function SVNMonitor(url, user, pass){

	if(!url){
		throw new Error("svnmonitor: url and a callback are required for init() function");
	};

	this.url = url || "";
	this.user = user || "";
	this.pass = pass || "";
		
	// Setup opt string for user, pass, and url
	this.svn_opt_str_user = this.user ? ('--username ' + this.user) : '';
	this.svn_opt_str_pass = this.pass ? ('--password ' + this.pass) : '';
	
};


/* 
 * Runs 'svn log' with arguments provided in init 
 */
SVNMonitor.prototype.getLatestCommits = function(limit, callback){
	
	if(!callback){
		throw new Error("svnmonitor: please provide a callback");
	}
	
	// Don't use -l if limit is not passed in explicitly
	//  this will retrieve all log entries
	var opt_str_limit = (limit)? "-l " + limit : "";
	
	this.getSvnLogProcess(opt_str_limit, function (error, stdout, stderr) {		
		if(error != null){			
			callback(error)
		};

		var revs = stdout.replace(/-+[\r\n]/g,'~').split(/~/);
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
			};
		};

		// No error
		callback(null,returnArray);
	});
};


/*
 * 	Spawns a child_process running svn log
 *	 Returns a child_process built with specific options for 'svn log'
 */
SVNMonitor.prototype.getSvnLogProcess = function(command_opt_str, callback){
	var commandString = 'svn ';
		commandString += this.buildSvnCommandArgs('log', command_opt_str).join(' ');
	return exec(commandString,callback);
};


/*
 *	Pushes all svn applicable options and the command 
 *  to an array to give to a child_process
 */
SVNMonitor.prototype.buildSvnCommandArgs = function(command,command_opt_str){
	var args = [];
	args.push(command);
	args.push(this.url);
	args.push(this.svn_opt_str_user);
	args.push(this.svn_opt_str_pass);
	args.push(command_opt_str);
	return args;
};


module.exports = SVNMonitor;
