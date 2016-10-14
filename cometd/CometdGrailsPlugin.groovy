
class CometdGrailsPlugin {
    def version = 0.1
    def dependsOn = [:]
	
    def doWithSpring = {
        // TODO Implement runtime spring config (optional)
    }
   
    def doWithApplicationContext = { applicationContext ->
        // TODO Implement post initialization spring config (optional)		
    }

    def doWithWebDescriptor = { xml ->
        // add the comet servlet to the web.xml file, mapped to the /comet/ url
        def servletElement = xml.'servlet'
        servletElement[0] + {
            'servlet' {
                'servlet-name'("cometd")
                'servlet-class'("org.mortbay.cometd.continuation.ContinuationCometdServlet")
                'load-on-startup'("1")
            }
        }

        def mappingElement = xml.'servlet-mapping'
        mappingElement[0] + {
            'servlet-mapping' {
                'servlet-name'("cometd")
                'url-pattern'("/cometd/*")
            }
        }
    }
	                                      
    def doWithDynamicMethods = { ctx ->
        // TODO Implement registering dynamic methods to classes (optional)
    }
	
    def onChange = { event ->
        // TODO Implement code that is executed when this class plugin class is changed  
        // the event contains: event.application and event.applicationContext objects
    }
                                                                                  
    def onApplicationChange = { event ->
        // TODO Implement code that is executed when any class in a GrailsApplication changes
        // the event contain: event.source, event.application and event.applicationContext objects
    }
}
