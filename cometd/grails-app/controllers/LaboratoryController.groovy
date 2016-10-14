class LaboratoryController{
  def serverEvent={
    def chan=params['channel']
    def mess=params['message']
    def bayeux=CometdService.getBayeuxFromServletContext(servletContext)
    def client=bayeux.newClient("serv")
    def channel=bayeux.getChannel(chan,true)
    channel.subscribe(client)
    channel.publish(client,mess,"1234")
    channel.unsubscribe(client)

    render(contentType:"text/plain",content:"ok")
    
  }
} 
