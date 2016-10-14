<html>
  <head>
    <script type="text/javascript" src="js/dojo/dojo/dojo.js.uncompressed.js"></script>
    <script type="text/javascript">
      dojo.require("dojox.cometd");

      dojox.cometd.init("cometd");

      var listener={
        publishHandler:function(msg) {
          var reply=msg.data.test;
          var output=dojo.byId('output');
          var div=document.createElement("div");
          var txt=document.createTextNode(reply);
          div.appendChild(txt);
          output.appendChild(div);
        }
      }
      dojox.cometd.subscribe("/hello/world", listener, "publishHandler");

    </script>
  </head>
  <body>
    <h1>Comet Grails Plugin Test Page</h1>
    <p>If you can see this page, you're running the Comet plugin. Open the page up in a range of browsers, click the button on one, and see the message propagate to all the other instances.</p> 
    <input type="button"
       onclick="dojox.cometd.publish('/hello/world', { test: 'hello world' } )"
       value="Click Me!">
    <hr />
    <div id='output' style='width:90%;padding:8px;border:solid green 1px;background-color:black;color:green;height:300px;overflow:auto;'></div>
  </body>
</html>