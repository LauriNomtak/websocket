
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript">

	     $(document).ready(function() {


	     	if ("WebSocket" in window)
            {
               
               // Let us open a web socket
               var ws = new WebSocket("ws://localhost:8080","echo-protocol");
				
               ws.onmessage = function (evt) 
               { 
                  var receivedStatus = evt.data;

                  if(receivedStatus == 1) {
                  	$('#checkbox').prop('checked', true)
                  } else if(receivedStatus == 0) {
                  	$('#checkbox').prop('checked', false)
                  }

               };
				
               ws.onclose = function()
               { 
                  // websocket is closed.
                  alert("Connection is closed..."); 
               };
            }
            
            else
            {
               // The browser doesn't support WebSocket
               alert("WebSocket NOT supported by your Browser!");
            }

	        $('#checkbox').change(function() {
			    if(this.checked) {
			    	ws.send("1");
	       			console.log('checked');
	    		} else {
	    			ws.send("0");
	    			console.log('unchecked');
	    		}
			});
	     });
</script>

   <body>	
   		
   		<input id="checkbox" type="checkbox" name="vehicle" value="Bike">Checkbox<br>

   </body>