<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>Magnetic Poetry!!</title>
    <link rel='stylesheet' type="text/css" href="css/poetry.css"/>
    <script type="text/javascript" src="js/prototype/prototype.js"></script>
    <script type="text/javascript" src="js/prototype/scriptaculous.js"></script>
    <script type="text/javascript" src="js/poetry.simple.js"></script>
    <script type="text/javascript">
      Event.observe(
        window,
        "load",
        function(){
          initWords();
          initUI();
          initDragDrop();
        }
      );  
    </script>
  </head>
  <body>
    <div id='sidebar'>

    <div class='sb_block'>
    <div class='sb_title'>Version 1 :: Single User</div>
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