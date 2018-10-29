$(function() {
    Quagga.init({
        inputStream: {
            name: 'Live',
            type: 'LiveStream',
            numberOfWorkers: navigator.hardwareConcurrency,
            target: document.querySelector('#barcode')
        },
        decoder: {
            readers: ['i2of5', '2of5']
        }
    }, function(err) {
        if (err) { console.log('Error Occured...  ' + err); return; }
        Quagga.start();
    });


});