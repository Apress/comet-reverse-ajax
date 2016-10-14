class CometController {

	def index = { }
	def bayeux=null
	def bayeuxClient=null
	def msgId=0
	
	def getCometChannel(channelId){
	  if (bayeux==null){
        bayeux=servletContext.getAttribute(dojox.cometd.Bayeux.DOJOX_COMETD_BAYEUX)
      }
      if (bayeuxClient==null){
        bayeuxClient=bayeux.newClient("magpoetry_"+Math.floor(Math.random()*1e9))
      }  
      def channel=bayeux.getChannel(channelId,true)
      def filters=channel.getDataFilters()
      def fcount=(filters==null) ? "null" : ""+filters.size()
      log.error("${channelId} has ${fcount} datafilters attached")
      return channel
	}
	
	def publishToChannel(channelId,obj){
	  def channel=getCometChannel(channelId)
      channel.publish(bayeuxClient,obj,"cometController"+msgId)
	  msgId++
	  def json=new grails.converters.JSON(obj)
	  log.error("published [${msgId}] :: ${json}")
	}

    def create = {
      def newWord=new Word(
        text:params['text'],
        color:params['color'],
        x:params['x'],
        y:params['y']
      )
      newWord.save()
      publishToChannel("/magnetic/poetry",newWord)
      render(text:"ok")
    }
    
    def initialRead = {
      def words=Word.findAll()
      for (w in words){
        publishToChannel("/magnetic/poetry",w)
      }
      //render(contentType:"text/plain",content:"ok")
      render(text:"ok")
    }
    
    def update = {
      def id=params['id']
      log.debug("id="+id)              
      def word=Word.get(id)
      log.debug("word="+word)
      if (params['x']){ word.x=params['x'].toInteger() }
      if (params['y']){ word.y=params['y'].toInteger() }
      word.save()
      publishToChannel("/magnetic/poetry",word)
      render(text:"ok")
    }
    
    def delete = {
      def id=params['id']
      def word=Word.get(id)
      word.delete()
      publishToChannel("/magnetic/poetry",[id:id,deleted:true])
      render(text:"ok")
    }
    
	def bake={
	  spawnBakerThread(params['chanUid'])
	  render(text:"ok")
	}
	
	def spawnBakerThread(channelUid){
	  def channel=getCometChannel("/magnetic/bakery/"+channelUid);
	  def bakerThread=new Thread({    
		writeText(channel,"firing up the oven",2000)
	    def words=Word.findAll()
	    for (w in words){
	      writeText(channel,"shaping clay for '"+w.text+"'",1000)	
	    }
		writeText(channel,"baking...",6000)
		writeText(channel,"still baking...",4000)
		writeText(channel,"tum de tum, nice day today?",3000)
		writeText(channel,"still baking...",6000)
		writeText(channel,"nearly done now",2000)
		writeText(channel,"there - baked!",1000)
		writeText(channel,"cooling...",2000)
		writeText(channel,"wrapping parcel",2000)
		writeText(channel,"sending to dispatch",2000)
		writeText(channel,"done",0)
	  });
	  bakerThread.start();
	}  
	  
	def writeText(channel,text,sleeptime){
      channel.publish(bayeuxClient,text,"cometController"+msgId)
	  msgId++
	  log.error("baker published [${msgId}] :: ${text}")
	  if (sleeptime>0){
	    Thread.currentThread().sleep(sleeptime)
	  }  
	}
}
