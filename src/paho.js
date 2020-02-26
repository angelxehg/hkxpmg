// Create a client instance
client = new Paho.MQTT.Client("64.227.94.40", 8083, "angel");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });


// called when the client connects
function onConnect() {
    addClass("btn-success", "mqtt");
    removeClass("btn-danger", "mqtt");
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("proyecto/#");
    message = new Paho.MQTT.Message('{ "type":"message", "message":"Hello Angel!", "time":1582150368}');
    message.destinationName = "proyecto";
    client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    addClass("btn-danger", "mqtt");
    removeClass("btn-success", "mqtt");
}

// called when a message arrives
function onMessageArrived(message) {
    console.log(message.payloadString);
    try {
        var msg = JSON.parse(message.payloadString);
        if (msg.type == 'heartbeat') {
            createRow("Heartbeat at " + getDate(msg.time));
        }
        if (msg.type == 'access') {
            createRow("Access at " + getDate(msg.time));
        }
    } catch (error) {
        console.log("Can't parse string!");
    }
}

function addClass(new_class, to) {
    var element = document.getElementById(to);
    element.classList.add(new_class);
}

function removeClass(new_class, from) {
    var element = document.getElementById(from);
    element.classList.remove(new_class);
}

function createRow(message) {
    var list = document.getElementById("denied-list");
    list.innerHTML += "<li class='list-group-item'>" + message + "</li>";
}

function getDate(timestamp) {
    try {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    } catch (error) {
        return "";
    }
}
