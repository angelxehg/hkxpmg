var lastHeartbeat = null;
var begin = new Date();
var attempts = 0;

function connect() {
    client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
    console.log("Connected!");
}

function sampleHeartbeat() {
    message = new Paho.MQTT.Message('{"type":"heartbeat", "time":1582822313}');
    message.destinationName = "proyecto";
    client.send(message);
}

function onConnect() {
    setStatusAsConnected("server");
    setStatusAsWaiting("device");
    client.subscribe("proyecto/#");
    attempts = 0;
    // sampleHeartbeat();
}

function setStatusAsWaiting(element) {
    document.getElementById(element).classList.add('btn-warning');
    document.getElementById(element).classList.remove('btn-success');
    document.getElementById(element).classList.remove('btn-danger');
}

function setStatusAsConnected(element) {
    document.getElementById(element).classList.remove('btn-warning');
    document.getElementById(element).classList.add('btn-success');
    document.getElementById(element).classList.remove('btn-danger');
}

function setStatusAsClosed(element) {
    document.getElementById(element).classList.remove('btn-warning');
    document.getElementById(element).classList.remove('btn-success');
    document.getElementById(element).classList.add('btn-danger');
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    if (attempts < 3) {
        connect();
        setStatusAsWaiting("server");
        setStatusAsWaiting("device");
        attempts++;
        console.log("Attempt to reconnect " + attempts);
    } else {
        setStatusAsClosed("server");
        setStatusAsClosed("device");
    }
}
// called when a message arrives
function onMessageArrived(message) {
    try {
        var json = $.parseJSON(message.payloadString);
        if (json.type.localeCompare("heartbeat") == 0) {
            var date = convertTime(json.time);
            lastHeartbeat = date;
            var msg = "Heartbeat at " + formatedDate(date);
            console.log(msg);
        }
        if (json.type.localeCompare("access") == 0) {
            if (json.isKnow) {
                var date = convertTime(json.time);
                var msg = "Known access at " + formatedDate(date);
                console.log(msg);
                createRowOn("denied_list", msg);
            } else {
                var date = convertTime(json.time);
                var msg = "Denied access at " + formatedDate(date);
                console.log(msg);
                createRowOn("allowed_list", msg);
            }
        }
    } catch (error) {
        console.log(message.payloadString);
    }
}

function createRowOn(element, message) {
    var list = document.getElementById(element);
    list.innerHTML += "<li class='list-group-item'>" + message + "</li>";
}

function convertTime(time) {
    let unix_timestamp = time;
    var date = new Date(unix_timestamp);
    return date;
}

function formatedDate(date) {
    var Anio = date.getFullYear();
    var Mes = date.getMonth();
    var Dia = date.getDate();
    var Hora = date.getHours();
    var Minuto = "0" + date.getMinutes();
    var Segundo = "0" + date.getSeconds();
    var formattedTime = Anio + '-' + Mes + '-' + Dia + ' ' + Hora + ':' + Minuto.substr(-2) + ':' + Segundo.substr(-2);
    return formattedTime;
}

function checkDevice() {
    var current = new Date();
    var dif = current - this.lastHeartbeat;
    if (dif < 30000) {
        setStatusAsConnected("device");
    } else {
        if (dif < 60000) {
            setStatusAsWaiting("device");
        } else {
            if ((current - this.begin) < 60000) {
                setStatusAsWaiting("device");
            } else {
                setStatusAsClosed("device");
            }
        }
    }
}

this.connect();

var daemon = setInterval(checkDevice, 5000);
