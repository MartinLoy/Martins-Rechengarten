const BACKGROUND_COLOUR = '#000000';
const LINE_COLOUR = '#FFFFFF';
const LINE_WIDTH = 15;


var currentX=0;
var currentY=0;
var previousX = 0;
var previousY = 0;


function prepareCanvas() {
    console.log('Preparing Canvas');
    const canvas = document.getElementById('myCanvas')
    const context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOUR;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = LINE_COLOUR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round'


    var isPainting = false;

    document.addEventListener('mousedown', function (event) {
        console.log('Mouse down');
        isPainitng = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mousemove', function (event) {
        if (isPainting)
            previousX = currentX;
            currentX = event.clientX - canvas.offsetLeft;
            previousY = currentY;
            currentY = event.clientY - canvas.offsetTop;
            context.beginPath();
            context.moveTo(previousX, previousY);
            context.lineTo(currentX, currentY);
            context.closePath();
            context.stroke();
    });

    document.addEventListener('mouseup', function (event) {
        console.log('Mouse Released');
        isPainting = false;
    });
}