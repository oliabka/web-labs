var updatePostStats = {
    Like: function (imgId) {
        document.querySelector('#likes-count-' + imgId).textContent++;
    },
    Unlike: function(imgId) {
        document.querySelector('#likes-count-' + imgId).textContent--;
    }
};

var toggleButtonText = {
    Like: function(img) {
        img.src = "icons/hearts-like.png";
    },
    Unlike: function(img) {
        img.src = "icons/hearts-unlike.png";
    }
};

var actOnPost = function (event) {
    var imgId = event.target.getAttribute("id");
    console.log(event);
    if (event.target.src.includes("unlike"))
    {
        action="Like";
        toggleButtonText["Like"](event.target);
        updatePostStats["Like"](imgId);
    }else{
        action="Unlike";
        toggleButtonText["Unlike"](event.target);
        updatePostStats["Unlike"](imgId);
    }
    axios.post('/now/' + imgId + '/act', { action: action,  socket_id: socketId});
};