class BootStrap {

     def init = { servletContext ->
       new Word(text:"Magnetic",color:'#ff0',x:150,y:180).save()
       new Word(text:"Poetry",color:'#fff',x:220,y:185).save()
       new Word(text:"version",color:'#f8f',x:180,y:220).save()
       new Word(text:"one",color:'#faa',x:245,y:205).save()
     }
     def destroy = {
     }
} 