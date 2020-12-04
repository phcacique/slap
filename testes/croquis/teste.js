var cw = 640,
    ch = 480;
var bgcolor = "#fff";
// Brush
var bcolor = "#000",
    bspacing = 0.1,
    bsize = 2;
var slevel = 10,
    sweight = 0.5;

var croquis;
var brush;

function () {
    cw = window.innerWidth * 0.8;
    ch = window.innerHeight * 0.8;
    croquis = new Croquis();
    croquis.lockHistory();
    croquis.setCanvasSize(cw, ch);
    croquis.addLayer();
    croquis.fillLayer(bgcolor);
    croquis.addLayer();
    croquis.fillLayerImage("1469299641.png",cw,ch);
    croquis.selectLayer(1);
    croquis.unlockHistory();
    brush = new Croquis.Brush();
    brush.setSize(bsize);
    brush.setColor(bcolor);
    brush.setSpacing(bspacing);
    croquis.setTool(brush);
    croquis.setToolStabilizeLevel(slevel);
    croquis.setToolStabilizeWeight(sweight);
    
    
    
    
    
    // croquis dom element
    document.getElementById("canvas-area").appendChild(croquis.getDOMElement());
    // mouse event
    document.addEventListener('mousedown', function (e) {
        croquis.down(e.clientX - croquis.getDOMElement().offsetLeft, e.clientY - croquis.getDOMElement().offsetTop);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        croquis.move(e.clientX - croquis.getDOMElement().offsetLeft, e.clientY - croquis.getDOMElement().offsetTop);
    }

    function onMouseUp(e) {
        croquis.up(e.clientX - croquis.getDOMElement().offsetLeft, e.clientY - croquis.getDOMElement().offsetTop);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}