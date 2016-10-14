var Ajax;
if (Ajax && (Ajax != null)) {
	Ajax.Responders.register({
	  onCreate: function() {
        if($('spinner') && Ajax.activeRequestCount>0)
          Effect.Appear('spinner',{duration:0.5,queue:'end'});
	  },
	  onComplete: function() {
        if($('spinner') && Ajax.activeRequestCount==0)
          Effect.Fade('spinner',{duration:0.5,queue:'end'});
	  },
	  onException:function(request,e){
	    throw(e);
	  }
	});
}

function debug(str){
  if ($('debug')){
    $('debug').insert({ top: "<div>"+str+"</div>" });
  }  
}