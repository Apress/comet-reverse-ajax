<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>Magnetic Poetry!!</title>
    <link rel='stylesheet' type="text/css" href="css/poetry.css"/>
    <script type="text/javascript" src="js/dojo/dojo/dojo.js.uncompressed.js"></script>
    <script type="text/javascript" src="js/prototype/prototype.js"></script>
    <script type="text/javascript" src="js/prototype/effects.js"></script>
    <script type="text/javascript" src="js/prototype/dragdrop.js"></script>
    <script type="text/javascript" src="js/application.js"></script>
    <script type="text/javascript" src="js/poetry.comet.js"></script>
    <script type="text/javascript">
      dojo.require("dojox.cometd");
	</script>
    <script type="text/javascript">
      Event.observe(
        window,
        "load",
        function(){
          initComet();
          initUI();
          initDragDrop();
        }
      );  
    </script>
  </head>
  <body>
    <div id='sidebar'>

    <div class='sb_block'>
    <div class='sb_title'>Version 3 :: Naive Comet</div>
    <div class='sb_body'>
      <h3>Debug Console</h3>
      <div id='debug'></div>
    </div>
    </div>

    <div class='sb_block'>
    <div class='sb_title'>Order Real Magnets</div>
    <div class='sb_body'>
      <h3 id='bake_status' style='display:none'>status message goes here</h3>
      <button id='bake_button'>Bake Me Some Magnets!</button>
    </div>
    </div>

    <div class='sb_block'>
      <div class='sb_title'>Add A New Note</div>
      <div class='sb_body'>
        <table>
          <tr>
            <td><label for="word_text">Text</label></td>
            <td><input id="word_text" size="30" type="text" value="" /></td>
          </tr>
          <tr>
            <td><label for="word_color">Color</label></td>
            <td><input id="word_color" size="30" type="text" value="#ff0" /></td>
          </tr>
        </table>
        <br/>
        <input id='addNew' type="submit" value="Add New Word" onclick='addWord()'/>
      </div>
    </div>

    </div>

    <div id='trash'></div>

    <div id='board'></div>

  </body>
</html>