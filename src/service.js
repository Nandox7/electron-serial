const electron = require('electron');
const serialport = require('serialport')

let selectBox = document.getElementById('ports-list');
let port = null
let buffer = new Buffer(1);
let dataBuffer = new Buffer(22);
let dataBufferIndex = 0;

listPorts = function() {
    serialport.list( function(err, ports) {
        if(err) console.log('Error listing serial ports!');
        ports.forEach(function(port) {
            let option = document.createElement('option');
            option.text = port.comName;
            selectBox.add(option);
        });
    });
};

openPort = function(comName) {
    port = new serialport(comName, {
        baudRate: 115200,
        databits: 8,
        parity: 'none',
        //parser: serialport.parsers.raw
        // Every entry is terminated with newline - dec 10
        parser: serialport.parsers.byteDelimiter([10])
    });

    port.on('open', _ => {
        console.log('Port open: ', comName);
    });

    port.on('close', _ => {
        console.log('Port closed: ', comName);
    });

    port.on('data', function(data) {
        console.log('Data: ' + data);
        //storeData(data);
        parseData(data);
    });

    port.on('error', (err) => {
        console.log('Error: ', err.message);
    });
}

// Data Parsing
/*
    C + 4bits - channel index
    R + 4bits - Is race started
    M + Byte  - Min Lap Time
    T + Int   - RSSI Threshold
    S + Int   - RSSI value
    L + Long  - Lap Time

*/
storeData = function(data){
    console.log('lenght', data.length);
    if(dataBufferIndex < 22) {
        dataBuffer = Buffer.concat([data, dataBuffer]);
        dataBufferIndex += data.length;
        console.log('test: ', dataBufferIndex);
    } 

    if(dataBufferIndex = 22) {
        console.log('Data: ', dataBuffer);
        parseData();
        dataBufferIndex = 0;
    }
}

parseData = function(data) {
    switch (data[0]) {
        case 67: // Channel index
            console.log('Channel');
            break;
        case 82: // Is race started
            console.log('Channel');
            break;
        case 77: // Min Lap Time
            console.log('Channel');
            break;
        case 84: // RSSI threshould
            console.log('Channel');
            break;
        case 83: // RSSI value
            break;
        default:
            console.log('Unkown data received...');
            break;
    }
}

selectBox.addEventListener('click', _ => {
    console.log('Selected:', selectBox.options[selectBox.selectedIndex].value);
});


document.getElementById('btnScan').addEventListener('click', _ => {
    console.log('Scan pressed!');
    listPorts();
});

document.getElementById('btnOpen').addEventListener('click', _ => {
    console.log('Connect pressed!');
    if(selectBox.selectedIndex >= 0) {
        openPort(selectBox.options[selectBox.selectedIndex].value);
    } else {
        console.log('No port selected!');
    };
});

document.getElementById('btnClose').addEventListener('click', _ => {
    if(port.isOpen()) port.close();
});


document.getElementById('incChan').addEventListener('click', _ => {
    console.log('Increase Channel pressed!');
    buffer[0] = 0x05;
    port.write(buffer);
});


document.getElementById('decChan').addEventListener('click', _ => {
    console.log('Decrease Channel pressed!');
    buffer[0] = 0x06;
    port.write(buffer);
});

document.getElementById('getData').addEventListener('click', _ => {
    console.log('Read data');
    buffer[0] = 0xFF;
    port.write(buffer);
});