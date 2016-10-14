class SimpleController {

    def index = { }
    
    def create = {
      def newWord=new Word(
        text:params['text'],
        color:params['color'],
        x:params['x'],
        y:params['y']
      )
      newWord.save()
      render(contentType:"text/json"){
        created( 
          id:newWord.id,
          text:newWord.text,
          color:newWord.color,
          x:newWord.x,
          y:newWord.y
        )
      }
    }
    
    def read = {
      def words=Word.findAll()
      render(contentType:"text/json"){
        results{
          for (w in words){
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
      }
    }
    
    def update = {
      def id=params['id']
      def word=Word.get(id)
      if (params['x']){ word.x=params['x'].toInteger() }
      if (params['y']){ word.y=params['y'].toInteger() }
      word.save()
      log.error("updated '"+word.text+"' to version "+word.version)
      render(contentType:"text/json"){
        updated( 
          id:id,
          text:word.text,
          color:word.color,
          x:word.x,
          y:word.y
        )
      }
    }
    
    def delete = {
      def id=params['id']
      def word=Word.get(id)
      word.delete()
      render(contentType:"text/json"){
        deleted( 
          id:word.id,
        )
      }
      
    }
    
}
