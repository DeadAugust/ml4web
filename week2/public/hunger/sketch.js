// Open and connect player
let socket = io('/');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Connected");
});

//sockets on in here so that I don't get data before I'm ready to use them
function setup() {
  createCanvas(windowWidth, windowHeight);


  // Listen for message
  socket.on('message', function (message) {
    let id = message.id;
    let data = message.data;
  }

}


function draw() {


}
