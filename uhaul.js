// uHaul.js: This is a class that takes a list of javascript files, css files and
// global scoped variables and determines if they are already loaded and if not,
// loads them without duplication.  It will also execute a callback when it is complete
function uHaul(){
  // In general the package requires jquery and datatables
  this.package = {
    'js'      : [],   // List of js files that need to be checked
    'css'     : [],   // List of css files tha need to be checked
    'globals' : []    // List of globally scopped variables that need checking
  };
  this.verbosity = true;
};

// This class is used to control console outputs
uHaul.prototype.myConsole = function (console_obj){
  if (this.verbosity){  // If we set this flag we will print the console output
    console.log(console_obj);
  };
};

// This init method get passed a package object that mimics the above.  It just
// sets the class properties so the checkload can be used
uHaul.prototype.init = function (package_object){
  this.package = package_object;
};
//checkload performs the checking and loading of the given package object defined in the above
uHaul.prototype.checkLoad = function (callback){
  var that = this; //Parent object copy
  that.myConsole('uHaul: Initializing...');
  // Perform checks to make sure we have the associated packages
  that.myConsole('| Checking package dependencies:');

  // The below loop populates a list of needed promises for loading the various scripts
  var promises = [];
  $.each(this.package,function(fileType,val){ // Loop the check types
    that.myConsole('|   Performing checks for '+ fileType + ' files:');
    $.each(val,function(idx,file){
      that.myConsole('|     name:'+file);
      if(fileType=='js'){
        // Perform the js type check and load:
        if (!$('script[src="'+file+'"]').length){// We load the file
          that.myConsole('|       File not found. Loading.')
           promises.push($.getScript(file));
        }else{
          that.myConsole('|       File already loaded.')
        };
      }else if (fileType=='css') {
        if (!$('link[href="'+file+'"]').length){
          that.myConsole('|       File not found. Loading.');
          $('<link href="'+file+'" rel="stylesheet">').appendTo("head");
        }else{
          that.myConsole('|       File already loaded.')
        };
      }else if (fileType=='globals'){
        if ( typeof window[file] !== 'undefined'){
          that.myConsole('|       File already loaded.')
        }else{
          throw '|       Variable '+file+' undeclared.';
        };
      };
    });
  });
  // Since the scripts need to be all loaded before anything else we send the promise
  // array to the $.when and when complete we perform a callback
  $.when.apply($, promises).then(function() {
    that.myConsole('| Checking package dependencies: PASS');
    typeof callback === 'function' && callback();
  }, function(e) {
    that.myConsole("uHaul: checkload has failed to apply the promises.");
    typeof callback === 'function' && callback();
  });
};
