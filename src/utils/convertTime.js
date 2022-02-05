const convertTime = function (offsetHour) {

    const milnow = new Date(Date.now() + (offsetHour * 60 * 60 * 1000))
    const Datestring = milnow.getFullYear() + '-' + ('0' + (milnow.getMonth() + 1)).slice(-2) + '-' + ('0' + milnow.getDate()).slice(-2)

    return Datestring
}

module.exports = convertTime

