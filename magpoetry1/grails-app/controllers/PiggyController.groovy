class PiggyController {

    def index = { }
    
    def create = {
      def newWord=new Word(
        text:params['text'],
        color:params['color'],
        x:params['x'],
        y:params['y']
      )
      newWord.save()
      read()
    }
    
    def read = {
    	      def knownVersions=params['versions']
    	      def versions=[:]
    	      if (knownVersions.length()>0){
    	          for (pair in knownVersions.split(" ")){
    	        	def bits=pair.split("=")
    	        	versions[bits[0]]=Integer.parseInt(bits[1],10)
    	          }
    	      }
    	      log.error("versions = "+versions)
    	      def words=Word.findAll()
    	      render(contentType:"text/json"){
    	        results{
    	          for (w in words){
    	        	def key=""+w.id
    	        	def known=versions[key]
    	        	versions.remove(key)
    	        	def upToDate=(known!=null && known>=w.version)
    	        	log.error "  "+w.version+", "+known+" -> "+upToDate
    	        	if (!upToDate){
    	              word(
    	                id:w.id,
    	                version: w.version,
    	                text:w.text,
    	                color:w.color,
    	                x:w.x,
    	                y:w.y
    	              )
    	        	}  
    	          }
    	          versions.each{ key, val ->
    	            word(id: key, deleted:true)
    	          }
    	        }
    	      }
    	    }
    	    
    
    def update = {
      def id=params['id']
      log.debug("id="+id)              
      def word=Word.get(id)
      log.debug("word="+word)
      if (params['x']){ word.x=params['x'].toInteger() }
      if (params['y']){ word.y=params['y'].toInteger() }
      word.save()
      read()
    }
    
    def delete = {
      def id=params['id']
      def word=Word.get(id)
      word.delete()
      read()
    }
    
}
