
client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
// connect the client
client.connect({ onSuccess: onConnect });
// called when the client connects
function onConnect() {
    document.getElementById("mqtt").classList.remove('btn-danger');
    document.getElementById("mqtt").classList.add('btn-success');
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");

    client.subscribe("proyecto/#");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        document.getElementById("mqtt").classList.remove('btn-success');
        document.getElementById("mqtt").classList.add('btn-danger');
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
            alert("Bienvenido");
        } else {
            //Credencial Desconocida
            alert("Peligro");
        }
    }


}

function online(time) {
    //modificar el estilo del elemento mediante la clase
    document.getElementById("status").classList.remove('btn-danger');
    document.getElementById("status").classList.add('btn-success');

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
