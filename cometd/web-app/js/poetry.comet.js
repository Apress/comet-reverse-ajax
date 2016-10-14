function initComet(){
  dojox.cometd.init("cometd");
  var listener={
    callback:function(msg) {
      var data=msg.data;
      processUpdate(data);
    }
  }
  debug("init cometd");
  var subscription=dojox.cometd.subscribe("/magnetic/poetry", listener, "callback");
  subscription.addCallback(
    function(){ 
      debug("subscribed to /magnetic/poetry ready");
      initWords(); 
    }
  );
}  

function initWords(){
  debug("initWords()");
  getWords();
}

function initUI(){
  //add behaviour to the sidebar panels
  $$('div.sb_block').each(
    function(el){
      var titles=el.select("div.sb_title");
      var bodies=el.select("div.sb_body");
      if (titles[0] && bodies[0]){
        var bod=bodies[0];
        titles[0].observe("click",
          function(){ bod.toggle(); }
        );
      }  
    }      
  );
  Event.observe(
    'bake_button',
    "click",
    function(){ baker.start() }
  );
}

function initDragDrop(){
  //set listener on dragging, to update note positions
  Draggables.addObserver(
    { onStart:function(evName,draggable,event){
        draggable.startPos={ 
          x: event.clientX, 
          y: event.clientY 
        };
      },
      onEnd:function(evName,draggable,event){
        var el=draggable.element;
        if (el.hasClassName('note') && el.word){
          if (!el.word.pendingDeletion){
            var startPos=draggable.startPos;
            var dx=event.clientX-startPos.x;
            var dy=event.clientY-startPos.y;
            el.word.update(dx,dy);
          }
        }
        draggable.startPos=null;
      }
    }
  );
  
  //activate the trashcan
  Droppables.add(
    'trash',
    { onHover:function(el,trash){
        x=3;
      },
      onDrop: function(el, trash){
        if (el.hasClassName('note') && el.word){
          el.word.deleteMe();
        }
      }
    }
  );
}


function processUpdate(data){
  var word=Words["_"+data.id];
  if (word){
    if (!data.deleted){
      word.updateUI(data.x,data.y);      
    }else{
      word.deleteUI();      
    }
  }else if (!data.deleted){
    new Word(data);
  }
}

function getWords(){
  new Ajax.Request("comet/initialRead"); //fire and forget
}

function addWord(){
  var text=$F('word_text');
  var color=$F('word_color');
  var x=Math.floor(Math.random()*350);  
  var y=Math.floor(Math.random()*420);  
  var paramsObj={ text:text, color:color, x:x, y:y };
  new Ajax.Request(
    "comet/create",
    { parameters: paramsObj } //fire and forget
  );
}

var Words={};
var Word=Class.create({
  initialize:function(props){
    Object.extend(this,props);
    Words["_"+this.id]=this;
    this.render();
  },
  render:function(){
    var tmpl="<div id='note_#{id}' class='note' "
      +"style='top:#{y}px;left:#{x}px;background-color:#{color}'>"
      +"#{text}</div>";
    var html=tmpl.interpolate(this)
    $("board").insert({top:html});
    this.body=$("note_"+this.id);
    this.body.word=this;
    new Draggable(this.body);
  },
  update:function(dx,dy){
    this.x=parseInt(this.x)+dx;
    this.y=parseInt(this.y)+dy;
    var params={
      id: this.id,
      x: this.x,
      y: this.y
    };
    new Ajax.Request(
      "comet/update",
      { parameters: params } //fire and forget
    );
  },
  updateUI:function(x,y){
    this.x=x;
    this.y=y;
    this.body.setStyle({
      "left":x+"px","top":y+"px"
    });
    this.body.innerHTML=this.text;
  },
  deleteMe:function(){
    this.pendingDeletion=true;
    new Ajax.Request(
      "comet/delete",
      { parameters: { id: this.id } } //fire and forget
    );
  },
  deleteUI:function(){
    this.body.style.zIndex=3;
    new Effect.Puff(this.body);
    Words["_"+this.attr.id]=null;
  }
});

var baker={
  start:function(){
    this.output=$("bake_status");
    $("bake_button").hide();
    this.output.show();
    var uid=Math.floor(Math.random()*1000000000)
    this.sub=dojox.cometd.subscribe("/magnetic/bakery/"+uid, this, "callback");
    new Ajax.Request("comet/bake",{
      parameters: { "chanUid": uid }
    }); //fire and forget
  },
  callback:function(msg){
    var data=msg.data
    if (data=="done"){
      this.done();
    }else{  
      this.output.innerHTML=data;
    }  
  },
  done:function(){
    dojox.comet.unsubscribe(this.sub);
    this.output.hide();
    $("bake_button").show();
  }
}

function debug(str){
  if ($('debug')){
    $('debug').insert({ top: "<div>"+str+"</div>" });
  }  
}