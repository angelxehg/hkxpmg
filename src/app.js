var lastHeartbeat = null;

function connect() {
    client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
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
        setStatusAsClosed("server");
        setStatusAsClosed("device");
    }
}
// called when a message arrives
function onMessageArrived(message) {
    try {
        var json = $.parseJSON(message.payloadString);
        if (json.type.localeCompare("heartbeat") == 0) {
            lastHeartbeat = convertTime(json.time);
        }
        if (json.type.localeCompare("access") == 0) {
            if (json.isKnow) {
                var date = convertTime(json.time);
                createRowOn("denied_list", "Known access at " + formatedDate(date))
            } else {
                var date = convertTime(json.time);
                createRowOn("allowed_list", "Unknown access at " + formatedDate(date))
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
    var date = new Date(unix_timestamp * 1000);
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
    if (dif > 45000) {
        setStatusAsClosed("device");
    } else {
        setStatusAsConnected("device");
    }
}

this.connect();

var daemon = setInterval(checkDevice, 5000);
