// Create a client instance
client = new Paho.MQTT.Client("64.227.94.40", 8083, "angel");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });


// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("proyecto/#");
    message = new Paho.MQTT.Message('{ "type":"message", "message":"Hello Angel!"}');
    message.destinationName = "proyecto";
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    try {
        var msg = JSON.parse(message.payloadString);
        if (msg.type == 'heartbeat') {
            console.log(msg);
        } else {
            createRow(msg.message);
        }
    } catch (error) {
        console.log(message.payloadString);
    }
}

function createRow(message) {
    var list = document.getElementById("mensajes");
    list.innerHTML += "<li class='list-group-item'>" + message + "</li>";
}
