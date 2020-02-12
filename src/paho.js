// Create a client instance
client = new Paho.MQTT.Client("test.mosquitto.org", 8080, "angel");

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
    message = new Paho.MQTT.Message("Hello Angel!");
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
    console.log("onMessageArrived:" + message.payloadString);
    var table = document.getElementById("mensajes");
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = message.payloadString;
}
