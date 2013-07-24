# Overview

**Mongo MapReduce WebBrowser (MMW)** is a Web application which gives you the capability to 

 * **write** your MapReduce.
 * **test (quickly)** your MapReduce by seeing the result.
 * **debug with breakpoints** your MapReduce with your Web Browser.

You can play with the  [live demo](http://mongo-mapreduce-webbrowser.opensagres.cloudbees.net/) or follow the [Installation Guide](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Installation-Guide) to use the webapp on localhost.

# Features

## Writing your MapReduce

**Mongo MapReduce WebBrowser (MMW)** provides advanced editor (syntax coloring, syntax errors, completions)
to write your MapReduce. After creating an empty MapReduce : 

 * fill your BSON document (data array) with stricted syntax by using The [BSON editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/BSON-Editor). 
 * fill your Map by using the [Map Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Map-Editor).
 * fill your Reduce by using the [Reduce Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Reduce-Editor).


And see the result of your MapReduce execution on fly time : 

![MapReduce Editor](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/images/Count_Tags_Editor.png)

## Debugging MapReduce

Use the debugger tools of your preffered WebBrowser to set breakpoint in your MapReduce to debug it. 
Here a screen with Chrome Dev Tools : 

![MapReduce Debug](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/images/Count_Tags_Debug.png)

# Installation

See [Installation Guide](https://github.com/angelozerr/mongo-mapreduce-webbrowser/wiki/Installation-Guide)

# Build

See cloudbees job: [https://opensagres.ci.cloudbees.com/job/mongo-mapreduce-webbrowser/](https://opensagres.ci.cloudbees.com/job/mongo-mapreduce-webbrowser/)
