# uHaul.js

uHaul.js is a small class that makes handles loading of .js, .css and global variables in your project.
The best way to show how this works is with an example.

Imagine you are working on a project with someone and you would like the independently develop a new
module to do some sort of calculation or data plotting etc.  To do this you will need to include a bunch
of .js files and .css files that may already be a part of the main project (or whatever you plug your module into).
It may also happen that you require some external javascript variables for your modules.

The annoying part is that you have no idea what is included in the main project so adding multiple instances of jQuery or datatables isn't the greatest.  That is why I made uHaul.js.  It checks all of your modules dependent packages against what is already included in the main project and loads dynamically.

Let's look at an example.

In my main HTML file (main project) I currently require jquery and some css files.  Therefore my HTML file looks a little like this:

```HTML
<head>
  <link rel="stylesheet" href="css/getAbstract.min.css" />
  <script src="js/jquery-1.9.0.min.js"></script>
</head>
```

Cool!  Now imagine I wanted to make an independent .js module that gets plugged into my main project.  My modules also requires jquery, however I don't know what is in the main project.

In my module:
```javascript
  var myVariable = $('#myDiv').html();
```
The above code will only work if you assume you have jquery already loaded in the main project.  I would load this into my HTML code like this:

```HTML
<head>
  <link rel="stylesheet" href="css/getAbstract.min.css" />
  <script src="js/jquery-1.9.0.min.js"></script>
  <script src="js/myAwesomeModule.js"></script>
</head>
```
This works, but if you did it this way:
```HTML
<head>
  <link rel="stylesheet" href="css/getAbstract.min.css" />
  <script src="js/myAwesomeModule.js"></script>
  <script src="js/jquery-1.9.0.min.js"></script>
</head>
```
Then your module fails because it has no idea what jquery is.  Now let's use uHaul.js to fix this.  In my main project file I add:
```HTML
<head>
  <script src="js/uHaul.js"></script>
  <link rel="stylesheet" href="css/getAbstract.min.css" />
  <script src="js/jquery-1.9.0.min.js"></script>
</head>
```
Now anything I load after can use the uHaul functions.  In my external module I would do the following:
```javascript
  //My required .js files for this module
  var myPackage = {
    'js':['js/jquery-1.9.0.min.js'],
    'css':[],
    ;'globals':[]
  };

  // The money ohh yea
  myHaul = new uHaul();
  myHaul.init(myPackage);
  myHaul.checkLoad();

  var myVariable = $('#myDiv').html();
```
What the above will do is parse your package and do a progressive load of any .js / .css files you have specified.  This means no duplication of file loading and also means that you can independently develop your external module without worrying.

Documentation and more examples to come!
