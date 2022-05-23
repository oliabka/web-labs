Pusher.logToConsole = true;

var pusher = new Pusher('e11298570a0907468f43', {
    cluster: 'eu'
  });

var socketId = null;
// retrieve the socket ID on successful connection
pusher.connection.bind('connected', function() {
    socketId = pusher.connection.socket_id;
});

var channel = pusher.subscribe('post-events');
channel.bind('postAction', function(data) {
    // log message data to console - for debugging purposes
    console.log(data);
    var action = data.action;
    var senderUsername = data.username;
    var currentUsername = document.getElementsByClassName("now-title")[0].id;
    var img = document.getElementById(data.imgId);
    console.log(senderUsername, currentUsername, img);
    switch(action)
    {
        case 'Like': updatePostStats['Like'](data.imgId);
                    if(senderUsername == currentUsername){
                        toggleButtonText['Like'](img);
                    }
                    break;
        case 'Unlike': updatePostStats['Unlike'](data.imgId);
                    if(senderUsername == currentUsername){
                        toggleButtonText['Unlike'](img);
                    }
                    break;
    }
   
});