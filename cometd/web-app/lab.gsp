<html>
  <head>
    <script type="text/javascript" src="js/dojo/dojo/dojo.js.uncompressed.js"></script>
    <script type="text/javascript">
      dojo.require("dojox.cometd");

      dojox.cometd.init("cometd");

      var lab={
        subs:{},
        subscribe:function(channel){
          if (this.subs[channel]){
            this.output("already subscribed to channel "+channel);
          }else{
            this.subs[channel]=dojox.cometd.subscribe(channel, this, "publishHandler");
          }
        },
        publishHandler:function(msg) {
          var reply=msg.channel+" >>> "+dojo.toJson(msg.data);
          this.output(reply);
        },
        unsubscribe:function(channel){
          if (!this.subs[channel]){
            this.output("not subscribed to channel "+channel+" :: can't unsubscribe");
          }else{
            dojox.cometd.unsubscribe(this.subs[channel]);
          }
        },
        publish:function(channel,msg){
          dojox.cometd.publish(channel, {"message":msg} );
        },
        output:function(msg){
          var output=dojo.byId('output');
          var div=document.createElement("div");
          var txt=document.createTextNode(msg);
          div.appendChild(txt);
          output.appendChild(div);
        },
        ui:{
          subscribe:function(){
            var chan=dojo.byId("channel").value;
            lab.subscribe(chan);
          },
          unsubscribe:function(){
            var chan=dojo.byId("channel").value;
            lab.unsubscribe(chan);
          },
          publish:function(clientSide){
            var chan=dojo.byId("channel").value;
            var msg=dojo.byId("message").value;
            if (clientSide){
              lab.publish(chan,msg);
            }else{
              dojo.xhrPost({
                url:"laboratory/serverEvent",
                content:{
                  "channel":chan,
                  "message":msg
                },
                load:function(data){
                  console.output("server says "+data);
                }
              });
            }
          }
        }
      }

    </script>
  </head>
  <body>
    <h1>Comet Grails Plugin Console</h1>

    <div>
    channel <input type='text' size='18' id='channel' /> &nbsp;
    message <input type='text' size='32' id='message' /> &nbsp;
    <input type="button" onclick="lab.ui.subscribe()" value="subscribe">
    <input type="button" onclick="lab.ui.unsubscribe()" value="unsubscribe">
    <input type="button" onclick="lab.ui.publish(true)" value="publish (client)">
    <input type="button" onclick="lab.ui.publish(false)" value="publish (server)">
    </div>
    <hr />
    <div id='output' style='width:90%;padding:8px;border:solid green 1px;background-color:black;color:green;height:300px;overflow:auto;'></div>
  </body>
</html>