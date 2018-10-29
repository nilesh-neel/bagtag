$(function() {
    function order_by_occurance(arr) {
        var counts = {};
        arr.forEach(function(val) {
            if (!counts[val]) {
                counts[val] = 0;
            }
            counts[val]++;
        });
    }

    var last_result = [];
    var code;
    if (Quagga.initialized == undefined) {
        Quagga.onDetected(function(result) {
            var last_code = result.codeResult.code;
            last_result.push(last_code);
            if (last_result.length > 20) {
                code = order_by_occurance(last_result)[0];
                last_result = [];
                Quagga.stop();
                alert(code);
                document.querySelector('result').innerHTML = code;
            }
            // var $node = null,
            //     canvas = Quagga.canvas.dom.image;

            // $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
            // $node.find("img").attr("src", canvas.toDataURL());
            // $node.find("h4.code").html(code);
            // $("#result_strip ul.thumbnails").prepend($node);
        });
    };



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
        if (err) {
            console.log('Error Occured...  ' + err);
            alert(err);
            return;
        }
        Quagga.initialized = true;
        Quagga.start();
    });



});