this.connect();

function onMessageArrived(message) {
    console.log(message.payloadString);
    var json = $.parseJSON(message.payloadString);
    if (json.type.localeCompare("heartbeat") == 0) {
        online(json.time);
    }
    if (json.type.localeCompare("access") == 0) {
        if (json.isKnow) {
            createRowOn("denied_list", "Known access at " + convertTime(json.time))
        } else {
            createRowOn("allowed_list", "Unknown access at " + convertTime(json.time))
        }
    }
}

function setBtnDanger(objectName) {
    document.getElementById(objectName).classList.remove('btn-success');
    document.getElementById(objectName).classList.add('btn-danger');
}

function setBtnSuccess(objectName) {
    document.getElementById(objectName).classList.remove('btn-danger');
    document.getElementById(objectName).classList.add('btn-success');
}

function createRowOn(element, message) {
    var list = document.getElementById(element);
    list.innerHTML += "<li class='list-group-item'>" + message + "</li>";
}

function online(time) {
    //modificar el estilo del elemento mediante la clase
    setBtnSuccess("status");
}
