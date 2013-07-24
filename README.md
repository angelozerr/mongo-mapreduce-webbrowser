# Overview

**Mongo MapReduce WebBrowser (MMW)** is a Web application which gives you the capability to 

 * **write** your MapReduce.
 * **test (quickly)** your MapReduce by seeing the result.
 * **debug with breakpoints** your MapReduce with your Web Browser.

You can play with the  [live demo](http://mongo-mapreduce-webbrowser.opensagres.cloudbees.net/) or follow the [Installation Guide](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Installation-Guide) to use the webapp on localhost.

# Features

## Writing MapReduce

**Mongo MapReduce WebBrowser (MMW)** provides advanced editor (syntax coloring, syntax errors, completions)
to [write your MapReduce](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Develop-MapReduce): 

 * fill the  BSON ocument (data array) with stricted syntax by using The [BSON editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/BSON-Editor). 
 * fill the Map function by using the [Map Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Map-Editor).
 * fill the Reduce function by using the [Reduce Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Reduce-Editor).


And see the result of your MapReduce execution on fly time : 

![MapReduce Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/images/Count_Tags_Editor.png)

## Debugging MapReduce

As MapReduce is executed with WebBrowser, it's possible to use the WebBrowser debugger to debug MapReduce with breakpoints. Here a screen with Chrome Dev Tools : 

![MapReduce Debug](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/images/Count_Tags_Debug.png)

# Supported Web Browsers

Tested with Chrome and FF (some problems with IE).

# Installation

See [Installation Guide](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Installation-Guide)


# Build

See cloudbees job: [https://opensagres.ci.cloudbees.com/job/mongo-mapreduce-webbrowser/](https://opensagres.ci.cloudbees.com/job/mongo-mapreduce-webbrowser/)
