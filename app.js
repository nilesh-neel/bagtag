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

    function calculateRectFromArea(canvas, area) {
        var canvasWidth = canvas.width,
            canvasHeight = canvas.height,
            top = parseInt(area.top) / 100,
            right = parseInt(area.right) / 100,
            bottom = parseInt(area.bottom) / 100,
            left = parseInt(area.left) / 100;

        top *= canvasHeight;
        right = canvasWidth - canvasWidth * right;
        bottom = canvasHeight - canvasHeight * bottom;
        left *= canvasWidth;

        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }


    Quagga.onProcessed(function(result) {
        alert('onProcessed start');
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay,
            area;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function(box) {
                    return box !== result.box;
                }).forEach(function(box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }

            if (App.state.inputStream.area) {
                area = calculateRectFromArea(drawingCanvas, App.state.inputStream.area);
                drawingCtx.strokeStyle = "#0F0";
                drawingCtx.strokeRect(area.x, area.y, area.width, area.height);
            }
        }
    });


});