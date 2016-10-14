class CometController {

	/* default set-up is to test DB every 100ms over a minute */
	def tries=600 
	def blink=100
	
	def index = { }

    def read = {
      def writer=response.getWriter()
	  def versions = [:] 
      def knownVersions=params['versions']
      log.error("read() ::: known versions "+knownVersions)                               
      versions=[:]
      if (knownVersions!=null && knownVersions.length()>0){
        for (pair in knownVersions.split(" ")){
       	  def bits=pair.split("=")
   	      versions[bits[0]]=Integer.parseInt(bits[1],10)
        }
      }
      response.contentType='text/json'
      def counter=0
      checkChanges: while (counter<tries){
    	def changes=getChanges(versions);
  	    log.error("tick "+counter+" : changes "+changes.size())
    	if (changes.size()>0){
    	  def content="{ 'tick':"+counter+", 'results':["+changes.join(", ")+"] }"
          render(content)
          break checkChanges
    	}else{
     	  Thread.currentThread().sleep(blink)
    	  counter+=1
    	}  
      }
      if (counter>=tries){
    	  render("{ 'tick':"+tries+", 'results':[] }");
      }
	}  
      
    def getChanges(versions){ 
	    def words=Word.findAll()
	    def latestVersions=words.collect{ it.id+"="+it.version }.join(",")
	    log.error("word count "+words.size()+"::"+latestVersions)
	    def knownIds=new ArrayList(versions.keySet())
	    def entries=[]
	    for (w in words){
	      w.refresh()	
	      def key=""+w.id
	      def known=versions[key]
	      knownIds.remove(key)
	      def upToDate=(known!=null && known==w.version)
	      if (!upToDate){
	     	log.error("updating "+w.text+" from "+known+" to "+w.version)	
	        entries.add("{'id':'"+w.id
	      	  +"', 'version':'"+w.version
	      	  +"', 'text':'"+w.text
	      	  +"', 'color':'"+w.color
	      	  +"', 'x':'"+w.x
	      	  +"', 'y':'"+w.y
	      	  +"'}"
	        )
     	  }
	    } 	
	    knownIds.clone().each{ id ->
	      entries.add("{'id':'"+id+"', 'deleted':true}")
	    }
	    
	    return entries
	  
	  }
	  	    
      def bake={
    	response.contentType='text/plain'
 		def writer=response.getWriter()
 		writeText(writer,"firing up the oven",2000)
        def words=Word.findAll()
        for (w in words){
          writeText(writer,"shaping clay for '"+w.text+"'",1000)	
        }
 		writeText(writer,"baking...",6000)
 		writeText(writer,"still baking...",4000)
 		writeText(writer,"tum de tum, nice day today?",3000)
 		writeText(writer,"still baking...",6000)
 		writeText(writer,"nearly done now",2000)
 		writeText(writer,"there - baked!",1000)
 		writeText(writer,"cooling...",2000)
 		writeText(writer,"wrapping parcel",2000)
 		writeText(writer,"sending to dispatch",2000)
      }
      
      def writeText(writer,text,sleeptime){
   		writer.write(text+"\n");
 		writer.flush()
 		log.error("write: "+text)
   	    Thread.currentThread().sleep(sleeptime)
      }
}
