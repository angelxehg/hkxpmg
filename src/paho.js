function connect() {
    client = new Paho.MQTT.Client("64.227.94.40", 8083, "");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect });
}

function onConnect() {
    setBtnDanger("mqtt");
    setBtnSuccess("mqtt");
    client.subscribe("proyecto/#");
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        setBtnSuccess("mqtt");
        setBtnDanger("mqtt");
    }
}
