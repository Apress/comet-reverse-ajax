class WordSyncService {

   boolean transactional = false

   def serviceMethod() {

   }

   def sync(writer, versions){ 

    def words=Word.findAll()
    log.error("word count "+words.size())
    def knownIds=new ArrayList(versions.keySet())
    def entries=[]
    for (w in words){
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
        versions[key]=w.version
     	}
    } 	
    knownIds.clone().each{ id ->
      entries.add("{'id':'"+id+"', 'deleted':true}")
      versions.remove(id)
    }
    
    //ONLYWRITE IF SOMETHING TO SAY
    
    def delimiter="/*----*/\n"
    writer.write(delimiter)
    def json="{ 'results':["+entries.join(", ")+"] }\n"
    writer.write(json)
    writer.flush()
  
    return versions
  
  }
  	    

}
