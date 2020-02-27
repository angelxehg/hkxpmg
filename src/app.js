var lastHeartbeat = null;

function connect() {
    client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
}

function sampleHeartbeat() {
    message = new Paho.MQTT.Message('{"type":"heartbeat", "time":1582820388}');
    message.destinationName = "proyecto";
    client.send(message);
}

function onConnect() {
    statusOnHolding();
    client.subscribe("proyecto/#");
    sampleHeartbeat();
}

function statusOnHolding() {
    document.getElementById("status").innerHTML = "Esperando...";
    document.getElementById("status").classList.add('btn-warning');
    document.getElementById("status").classList.remove('btn-success');
    document.getElementById("status").classList.remove('btn-danger');
}

function statusOnConnected() {
    document.getElementById("status").innerHTML = "Conectado";
    document.getElementById("status").classList.remove('btn-warning');
    document.getElementById("status").classList.add('btn-success');
    document.getElementById("status").classList.remove('btn-danger');
}

function statusOnClosed() {
    document.getElementById("status").innerHTML = "Desconectado";
    document.getElementById("status").classList.remove('btn-warning');
    document.getElementById("status").classList.remove('btn-success');
    document.getElementById("status").classList.add('btn-danger');
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        statusOnClosed();
    }
}
// called when a message arrives
function onMessageArrived(message) {
    try {
        var json = $.parseJSON(message.payloadString);
        if (json.type.localeCompare("heartbeat") == 0) {
            lastHeartbeat = new Date();
        }
        if (json.type.localeCompare("access") == 0) {
            if (json.isKnow) {
                createRowOn("denied_list", "Known access at " + convertTime(json.time))
            } else {
                createRowOn("allowed_list", "Unknown access at " + convertTime(json.time))
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
    var Anio = date.getFullYear();
    var Mes = date.getMonth();
    var Dia = date.getDate();
    var Hora = date.getHours();
    var Minuto = "0" + date.getMinutes();
    var Segundo = "0" + date.getSeconds();
    var formattedTime = Anio + '-' + Mes + '-' + Dia + ' ' + Hora + ':' + Minuto.substr(-2) + ':' + Segundo.substr(-2);
    return formattedTime;
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
    console.log("Last heartbeat " + dif + "ms ago");
    if (dif > 30000) {
        statusOnHolding();
    } else {
        statusOnConnected();
    }
}

this.connect();

var daemon = setInterval(checkDevice, 5000);
