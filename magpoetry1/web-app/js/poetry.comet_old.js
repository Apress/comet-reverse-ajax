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

var cometClient={
  counter:0,
  interval:0.5,
  startListening:function(response){
    if ((!this.response) || (response.request!=this.response.request)){
      debug("starting new response");
      this.stop();
      this.response=response;
      this.counter=0;
      this.listen();
    }
  },
  pause:function(){
    if (this.timer){
      clearTimeout(this.timer); 
    }
  },
  stop:function(){
    this.pause();
    if (this.response){
      var xhr=this.response.request.transport;
      if (xhr.readyState<4){
        debug("aborting current request");
        xhr.abort();
      }  
    }
  },
  listen:function(){  
    var packets=this.response.transport.responseText.split("/*----*/");
    var count=packets.length;
    if (this.counter<count){
      debug("tick "+this.counter);
      this.counter=count;
      var latest=packets[count-1];
      var obj=latest.evalJSON();
      if (obj.results.length>0){
        this.syncWords(obj.results);
      }
    }  
    this.pause();
    this.timer=setTimeout(
      function(){ 
        this.timer=null;
        this.listen();
      }.bind(this),
      this.interval*1000
    );
  },
  syncWords:function(results){
    results.each(
      function(result){ 
        if (Words["_"+result.id]){
          var word=Words["_"+result.id];
          if (result.deleted){
            debug("deleting "+result.text);
            word.deleteUI();
          }else{
            debug("updating "+result.text+" to "+result.version);
            word.updateUI(result.x,result.y,result.version);
          }
        }else{
          debug("new word: "+result.text);
          new Word(result);
        } 
      }
    );
  } 
}

function getWords(){
  debug("getWords()");
  cometClient.stop();
  new Ajax.Request(
    "comet/read",
    { 
      parameters: { versions: getVersions() }, 
      onInteractive:callbackInteractive, 
      onComplete:callbackComplete
    }
  );
}

function callbackInteractive(response){
  cometClient.startListening(response);
}
function callbackComplete(response){
  if (response.request.success() && response.request.getStatus()>0){
    getWords();
  }else{
    cometClient.timer=setTimeout(function(){ getWords(); },3000);
  }
}

var getVersions=function(){
  var versions=$H(Words).collect(
    function(pair){ 
      var word=pair.value;
      return word.id+"="+word.version;
    }
  ).join(" ");
  debug("getVersions() "+versions);
  return versions;
}

function addWord(){
  var text=$F('word_text');
  var color=$F('word_color');
  var x=Math.floor(Math.random()*350);  
  var y=Math.floor(Math.random()*420);  
  var paramsObj={ text:text, color:color, x:x, y:y };
  new Ajax.Request(
    "poll/create",
    { parameters: paramsObj,
      evalJSON:"force",
      onSuccess:function(response){
        new Word(response.responseJSON.created);
      }
    }
  );
}
/*
function addWord(){
  var text=$F('word_text');
  var color=$F('word_color');
  var x=Math.floor(Math.random()*350);  
  var y=Math.floor(Math.random()*420);  
  var paramsObj={ text:text, color:color, x:x, y:y };
  new Ajax.Request(
    "comet/create",
    { parameters: paramsObj,
      versions: getVersions(),
      onInteractive:callbackInteractive,
      onComplete:callbackComplete
    }
  );
}
*/

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
      +"#{text} : #{version}</div>";
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
      "poll/update",
      { parameters: params,
        evalJSON: "force",
        onSuccess:function(response){
          var updated=response.responseJSON.updated;
          this.updateUI(updated.x,updated.y,updated.version);
        }.bind(this)
      }
    );
  },
/*
  update:function(dx,dy){
    this.x=parseInt(this.x)+dx;
    this.y=parseInt(this.y)+dy;
    var params={
      id: this.id,
      x: this.x,
      y: this.y,
      versions: getVersions()
    };
    new Ajax.Request(
      "comet/update",
      { parameters: params,
        onInteractive:callbackInteractive,
        onComplete:callbackComplete
      }
    );
  },
*/  
  updateUI:function(x,y,version){
    this.x=x;
    this.y=y;
    if (version){ this.version=version; }
    this.body.setStyle({
      "left":x+"px","top":y+"px"
    });
    this.body.innerHTML=this.text+" : "+this.version;
  },
  deleteMe:function(){
    this.pendingDeletion=true;
    new Ajax.Request(
      "poll/delete",
      { parameters: { id: this.id },
        evalJSON: "force",
        onSuccess: function(response){
          var deleted=response.responseJSON.deleted;
          if (deleted.id==this.id){
            this.body.style.zIndex=3;
            new Effect.Puff(this.body);
            Words["_"+this.attr.id]=null;
          }
        }.bind(this)
      }
    );
  },
/*
  deleteMe:function(){
    this.pendingDeletion=true;
    new Ajax.Request(
      "comet/delete",
      { parameters: { id: this.id, versions: getVersions() },
        onInteractive: callback,
        onComplete:callbackComplete
      }
    );
  },
*/  
  deleteUI:function(){
    this.body.style.zIndex=3;
    new Effect.Puff(this.body);
    Words["_"+this.attr.id]=null;
  }
});

