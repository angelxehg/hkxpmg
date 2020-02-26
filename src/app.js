
client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
// connect the client
client.connect({ onSuccess: onConnect });
// called when the client connects
function onConnect() {
    setBtnDanger("mqtt");
    setBtnSuccess("mqtt");
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");

    client.subscribe("proyecto/#");
}

function setBtnDanger(objectName) {
    document.getElementById(objectName).classList.remove('btn-success');
    document.getElementById(objectName).classList.add('btn-danger');
}

function setBtnSuccess(objectName) {
    document.getElementById(objectName).classList.remove('btn-danger');
    document.getElementById(objectName).classList.add('btn-success');
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        setBtnSuccess("mqtt");
        setBtnDanger("mqtt");
    }
}
// called when a message arrives
function onMessageArrived(message) {
    console.log(message.payloadString);
    var json = $.parseJSON(message.payloadString);

    if (json.type.localeCompare("heartbeat") == 0) {
        online(json.time);
    }
    if (json.type.localeCompare("access") == 0) {
        if (json.isKnow) {
            //Credencial Conocida
            createRowOn("denied_list", "OK")
        } else {
            //Credencial Desconocida
            createRowOn("allowed_list", "NO")
        }
    }


}

function createRowOn(element, message) {
    var list = document.getElementById(element);
    list.innerHTML += "<li class='list-group-item'>" + message + "</li>";
}

function online(time) {
    //modificar el estilo del elemento mediante la clase
    setBtnSuccess("status");
    let unix_timestamp = time;
    var date = new Date(unix_timestamp * 1000);
    var Anio = date.getFullYear();
    var Mes = date.getMonth();
    var Dia = date.getDate();
    var Hora = date.getHours();
    var Minuto = "0" + date.getMinutes();
    var Segundo = "0" + date.getSeconds();
    var formattedTime = Anio + '-' + Mes + '-' + Dia + ' ' + Hora + ':' + Minuto.substr(-2) + ':' + Segundo.substr(-2);
}
