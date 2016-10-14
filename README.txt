EXAMPLE CODE FOR "Comet & Reverse Ajax" by Crane & McCarthy, FirstPress 2008

GENERAL SETUP
The examples presented here use Groovy on Grails, a Java-based web technology stack. More details at http://grails.org. To get up and running:
0. Install Java on tyour machine if you need to. You'll need the JDK, not just the runtime (JRE).
1. download and install Grails for your platform. The most recent version of Grails at time of writing is 1.0.3, which uses Jetty 6.1.7 internally. The Jetty cometd examples require Jetty 6.1.11 or higher, so...
2. Download a recent version of Jetty (e.g. 6.1.11) and replace the Jetty jar files in your grails installation. The files that I modified were:
 - jetty-6.1.x.jar
 - jetty-naming-6.1.x.jar
 - jetty-plus-6.1.x.jar
 - jetty-util-6.1.x.jar
3. Unzip the source folder into a directory. There are two Grails projects in here:

CHAPTERS 1-3 
are covered by the Grails application 'magpoetry1'. Go into that directory in a command prompt, and issue the command 'grails run-app' to get started, then navigate to http://localhost:8080/magpoetry1/ to view the application. Javascripts, GSPs and Groovy controller code can all be edited live while the server is running.

CHAPTERS 6-7 
are covered by the Grails application 'cometd', which can be run in a similar fashion.


Happy coding!

Dave Crane
