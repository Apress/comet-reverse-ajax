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

var poll={
  timer:null,
  interval:3,
  run:function(){
    this.stop();
    this.timer=setTimeout(
      function(){ getWords(); }.bind(this),
      this.interval*1000
    );  
  },
  stop:function(){
    if (this.timer){
      clearTimeout(this.timer);
    }
  }
};

function getWords(){
  new Ajax.Request(
    "comet/read",
    { evalJSON: "force",
      parameters: { "versions": getVersions() },
      onComplete:function(response){
        var jsonObj=response.responseJSON;
        debug("returned on tick "+jsonObj.tick);
        var results=jsonObj.results;
        results.each(
          function(result){ 
            if (Words["_"+result.id]){
              var word=Words["_"+result.id];
              if (result.deleted){
                word.deleteUI();
              }else{
                word.updateUI(result.x,result.y,result.version);
              }
            }else{
              new Word(result);
            } 
          }
        );
        poll.run();
      }
    }
  );
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
            this.deleteUI();
          }
        }.bind(this)
      }
    );
  },
  deleteUI:function(){
    this.body.style.zIndex=3;
    new Effect.Puff(this.body);
    Words["_"+this.attr.id]=null;
  }
});

var baker={
  localPollInterval:0.5,
  start:function(){
    this.output=$("bake_status");
    $("bake_button").hide();
    this.output.show();
    new Ajax.Request(
      "comet/bake",
      { method: "get",
        onInteractive:function(response){
          this.xhr=response.request.transport;
          this.listen();
        }.bind(this),
        onComplete:function(){
          this.done();
        }.bind(this)
      }
    );
  },
  listen:function(){
    if (this.timer){ clearTimeout(this.timer); }
    this.timer=setTimeout(
      function(){ 
        var text=this.xhr.responseText;
        var lines=text.split("\n");
        var latest=(lines.length>1)
          ? lines[lines.length-2]
          : "waiting for server";
        this.output.innerHTML=latest;  
        this.listen();
      }.bind(this),
      this.localPollInterval*1000
    );
  },
  done:function(){
    if (this.timer){ clearTimeout(this.timer); }
    this.output.hide();
    $("bake_button").show();
  }
}