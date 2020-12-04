var cw = 640,
    ch = 480;
var bgcolor = "#fff";
// Brush
var bcolor = '#000',
    bspacing = 0.05,
    bsize = 10,
    blevel = 10,
    bweight = 0.5;

var croquis, brushes = [],
    selectedTool = 1;

var canvasArea, offX, offY, frame_format;
var ctrl = false;
var tools = [];
var selectedTool = 1;
var alphas = [];
var layerNames = [];
var oldColor = "#000000",
    oldAlpha = 1,
    oldSize = 10,
    oldTool = 1;

var selectedLayer = 0;
var contBrushes = 0;

var timer1, timer2, activeTime = 0,
    gestureTime = 0,
    isMoving = false;

const MSG1 = "As camadas do quadro estão sendo interpretadas. Aguarde!"

window.onload = function () {
    croquis = new Croquis();
    addBrush(bsize * 2, bcolor, 0.05, "img/brush/brush0.png");
    addBrush(bsize / 2, bcolor, 0.1, "img/brush/brush1.png");
    addBrush(bsize * 2, bcolor, 0.05, "img/brush/brush3.png");
    addBrush(bsize, bcolor, 0.05, "img/brush/brush0.png");
}

function init() {
    document.addEventListener('keydown', onkeydown);
    document.addEventListener('keyup', onkeyup);
    tools.push(document.getElementById("tool0"));
    tools.push(document.getElementById("tool1"));
    tools.push(document.getElementById("tool2"));
    tools.push(document.getElementById("tool3"));


    for (var i = 0; i < 4; i++) {
        tools[i].addEventListener('mouseover', ontoolsover);
        tools[i].addEventListener('mouseout', ontoolsout);
        tools[i].addEventListener("click", ontoolsclick, false);
    }

    tools[selectedTool].src = "img/tool" + (selectedTool) + ".png";
    document.getElementById("bsize").value = 10;
    croquis.getDOMElement().addEventListener('mousemove', moveMouse);
    document.getElementById("addLayer").addEventListener('click', addLayer);
    startDraw();

    //    document.getElementById('picker').addEventListener('click', function(){
    //        canvasArea.style.cursor = "url(img/ic_colorize_black_24px.svg), auto";
    //    })
}


function ontoolsclick(e) {
    var id = e.target.id.split('tool')[1];
    if (document.getElementById('ges' + selectedLayer).getAttribute('src') != 'img/ic_gesture_green_24px.svg' || (id == 0 || id == 3)) {
        selectedTool = id;
        selectTool(id);
        selectToolImage(id);
    }
}

function selectTool(id) {

    croquis.lockHistory();
    setBrush(id);
    selectedTool = id;
    if (id == 0) croquis.setPaintingKnockout(true);
    else croquis.setPaintingKnockout(false);
    croquis.unlockHistory();

    document.getElementById("bsize").value = (isNaN(brushes[selectedTool].getSize())) ? 10 : brushes[selectedTool].getSize();
    document.getElementById("balpha").value = alphas[selectedTool];


    var brushImg = document.getElementById("brushImg");

    brushImg.src = brushes[selectedTool].getImage().src;
    changeSize();
    document.getElementById("fgcolor").style.opacity = alphas[selectedTool];
}

function ontoolsover(e) {
    var id = e.target.id.split('tool')[1];
    selectToolImage(id);
    tools[selectedTool].src = "img/tool" + (selectedTool) + ".png";
}

function ontoolsout(e) {
    var id = e.target.id.split('tool')[1];
    if (id != selectedTool) tools[id].src = "img/tool" + (id) + "b.png";
    tools[selectedTool].src = "img/tool" + (selectedTool) + ".png";
}

function selectToolImage(id) {
    for (var i = 0; i < 4; i++) {
        tools[i].src = "img/tool" + i + "b.png";
    }
    tools[id].src = "img/tool" + (id) + ".png";
}

function onkeydown(e) {
    if (e.ctrlKey) ctrl = true;
    if (e.keyCode == 90 && ctrl) {
        croquis.undo();
    } else if (e.keyCode == 89 && ctrl) {
        croquis.redo();
    } else if (e.shiftKey && e.keyCode == 187) { //increment brush size
        bsize += 10;
        changeSize(bsize);
    } else if (e.shiftKey && e.keyCode == 189 && bsize > 10) { //decrement brush size
        bsize -= 10;
        changeSize(bsize);
    }
}

function onkeyup(e) {
    if (e.ctrlKey) ctrl = false;
}

function startDraw(_frame_format) {
    frame_format = _frame_format;

    ch = window.innerHeight * 0.8;
    if (frame_format == 1) cw = ch * 4 / 3;
    else cw = ch * 16 / 9;

    var base = document.getElementById("mainEdit").offsetWidth - (document.getElementById("toolsdiv").offsetWidth + 20);
    if (cw > base) {
        cw = base;
        if (frame_format == 1) ch = cw * 3 / 4;
        else ch = cw * 9 / 16;
    }

    //    cw = document.getElementById("mainEdit").offsetWidth;
    //    ch = window.innerHeight * 0.8;
    canvasArea = document.getElementById("canvasArea");
    canvasArea.innerHTML = "";
    offX = canvasArea.offsetLeft;
    offY = canvasArea.offsetTop;


    croquis.lockHistory();
    croquis.setCanvasSize(cw, ch);
    if (layerArray.length == 0) {
        addLayer(null); //croquis.fillLayer(bgcolor);
        if (temp_img != null)
            croquis.fillLayerImage(temp_img, cw, ch);
        selectedLayer = 0;
    } else {
        for (var i = 0; i < layerArray.length; i++) {
            addLayer(null);
            croquis.selectLayer(i);
            document.getElementById('nameLayer' + i).value = layerArray[i].name;
            croquis.fillLayerImage(imgBase + layerArray[i].image, cw, ch);
            document.getElementById("clop" + i).src = (layerArray[i].visibility == 1) ? 'img/ic_visibility_black_24px.svg' : 'img/ic_visibility_off_black_24px.svg';
            croquis.setLayerVisible((layerArray[i].visibility == 1) ? true : false);
            document.getElementById("ges" + i).src = (layerArray[i].gesture == 1) ? 'img/ic_gesture_green_24px.svg' : 'img/ic_gesture_black_24px.svg';
            layerNames[i] = layerArray[i].name;

        }

        document.getElementById('nameLayer0').value = layerArray[0].name;
        selectedLayer = i - 1;
        selectLayer(document.getElementById('layer' + selectedLayer));
    }

    croquis.selectLayer(0);

    croquis.unlockHistory();
    setBrush(0);
    croquis.setToolStabilizeLevel(blevel);
    croquis.setToolStabilizeWeight(bweight);

    // croquis dom element
    canvasArea.appendChild(croquis.getDOMElement());

    // mouse event
    croquis.getDOMElement().addEventListener('mousedown', function (e) {

        var picker = document.getElementById("picker");
        if (!picker.checked) {
            croquis.down(e.clientX - offX, e.clientY - offY);
            croquis.getDOMElement().addEventListener('mousemove', onMouseMove);
            croquis.getDOMElement().addEventListener('mouseup', onMouseUp);
            if (!isMoving) {
                isMoving = true;

                timer1 = setInterval(function () {
                    activeTime++;
                }, 1);

                if (document.getElementById('ges' + selectedLayer) != null && document.getElementById('ges' + selectedLayer).getAttribute('src') == 'img/ic_gesture_green_24px.svg') {
                    timer2 = setInterval(function () {
                        gestureTime++;
                    }, 1);
                }
            }
        } else {
            var color = croquis.pickColor(e.clientX - offX, e.clientY - offY);
            color = rgbToHex(color.r, color.g, color.b);
            var colorhash = '#' + color;

            document.getElementById('fgcolor').jscolor = color;
            document.getElementById('fgcolor').value = color;
            document.getElementById('fgcolor').style.backgroundColor = colorhash;
            changeColor(color);

            document.getElementById("picker").checked = false;
            canvasArea.style.cursor = "crosshair";
        }



    });



}

function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function onMouseMove(e) {
    croquis.move(e.clientX - offX, e.clientY - offY);
}

function onMouseUp(e) {
    isMoving = false;
    clearInterval(timer1);
    clearInterval(timer2);
    croquis.up(e.clientX - offX, e.clientY - offY);
    croquis.getDOMElement().removeEventListener('mousemove', onMouseMove);
    croquis.getDOMElement().removeEventListener('mouseup', onMouseUp);


}

function setBrush(id) {
    croquis.setTool(brushes[id]);
    croquis.setPaintingOpacity(alphas[id]);
}

function addBrush(bsize, bcolor, bspacing, bimage) {
    var brush = new Croquis.Brush();
    brush.setSize(bsize);
    brush.setColor(bcolor);
    brush.setSpacing(bspacing);
    brushes.push(brush);
    var img = new Image();
    img.src = bimage;
    img.onload = function () {
        brush.setImage(img);
        croquis.setTool((brushes.length < 2) ? brushes[0] : brushes[1]);
        changeSize();
        contBrushes++;
        if (contBrushes == 4) init();
    }
    alphas.push(1);
}


var gestureLayersNumber = 0;
var contLayers = 0;

function saveImage() {
    gestureLayersNumber = 0;
    console.log("SAVE IMAGE");
    showAlert();
    var layers = document.getElementById('layers');

    var form = document.getElementById('sendImageForm');

    addInput(form, 'numLayers', layers.children.length, 'hidden');
    addInput(form, 'id_frame', id_frame, 'hidden');
    addInput(form, 'activeTime', activeTime, 'hidden');
    addInput(form, 'gestureTime', gestureTime, 'hidden');
    addInput(form, 'duration', document.getElementById('fdur').value, 'hidden');
    var num = layers.children.length;

    slapResults = [];

    for (var i = 0; i < num; i++) {
        var name = document.getElementById('nameLayer' + i).value;
        var isGesture = (document.getElementById('ges' + i).getAttribute('src') == 'img/ic_gesture_green_24px.svg') ? 1 : 0;
        var isVisible = (document.getElementById('clop' + i).getAttribute('src') == 'img/ic_visibility_black_24px.svg') ? 1 : 0;
        addInput(form, 'layerName_' + i, name, 'hidden');
        addInput(form, 'layerVisibility_' + i, isVisible, 'hidden');
        addInput(form, 'layerGesture_' + i, isGesture, 'hidden');
        croquis.selectLayer(i);
        addInput(form, 'layerFile_' + i, croquis.createLayerThumbnail().toDataURL('image/png'), 'hidden');

        if (isGesture) {
            gestureLayersNumber++;
            showAlert(MSG1 + "<p>Gesture Layer #" + i + "</p>");
            testSlap(i, croquis.getLayerCanvas(i), croquis.createLayerThumbnail().toDataURL('image/png'));
        }
        croquis.selectLayer(i);
        croquis.setLayerVisible(true);
    }

    document.getElementById('file').value = croquis.createFlattenThumbnail().toDataURL('image/png');
    document.getElementById('numFrame').value = parseInt(selectedFrame) + 1;
    if (gestureLayersNumber == 0) {
        submitForm();
    }
    //else wait for slapTest finish
}

function submitForm(num) {
    if (contLayers == gestureLayersNumber);
    document.forms["sendImageForm"].submit(function (e) {
        e.preventDefault();
    });
}

function addInput(form, name, value, type) {
    var input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    form.appendChild(input);
}

function changeColor(jscolor) {

    for (var i = 0; i < brushes.length; i++) {
        brushes[i].setColor('#' + jscolor);
    }

}

function changeSize() {
    var value = document.getElementById("bsize").value;
    bsize = parseInt(value);
    brushes[selectedTool].setSize(bsize);
    var v = brushes[selectedTool].getSize();
    document.getElementById("brushImg").width = v;
    document.getElementById("brushImg").height = v;
}

function moveMouse(e) {
    //    cursor.style.left = e.clientX - cursor.offsetWidth / 2 + "px";
    //    cursor.style.top = e.clientY - cursor.offsetHeight / 2 + "px";
}

function changeAlpha() {
    alphas[selectedTool] = document.getElementById("balpha").value;
    document.getElementById("fgcolor").style.opacity = alphas[selectedTool];
    croquis.setPaintingOpacity(alphas[selectedTool]);
    setBrush(selectedTool);
}

function allowDrop(ev) {
    ev.preventDefault();
}

var isDragging = false;

function drag(ev) {
    e1 = ev.target;

    if (e1.className == "singleLayer" || e1.className == "singleLayer selected" || e1.className == "dicon") {
        isDragging = true;

        if (e1.className == "dicon") {
            e1 = ev.target.parentElement.parentElement;
        }
        t1 = e1.parentElement;
        i1 = Array.prototype.indexOf.call(t1.children, e1);

    }
}

function drop(ev) {
    if (isDragging) {
        ev.preventDefault();
        e2 = ev.target;

        t2 = e2.parentElement;
        if (t2.className == "dragname" || t2.className == "layerTools") {
            t2 = e2.parentElement.parentElement.parentElement;
            e2 = ev.target.parentElement.parentElement;
        } else if (t2.className == "singleLayer" || t2.className == "singleLayer selected") {
            t2 = e2.parentElement.parentElemen;
            e2 = ev.target.parentElement;
        }
        i2 = Array.prototype.indexOf.call(t2.children, e2);

        if (i1 > i2) {
            t2.insertBefore(e1, t2.children[i2]);
            //trocar camadas do canvas para cima
            for (var i = i1; i > i2; i--) {
                croquis.swapLayer(i, i - 1);
            }
        } else {
            t2.insertBefore(e1, t2.children[i2 + 1]);
            //trocar camadas do canvas para baixo
            for (var i = i1; i < i2; i++) {
                croquis.swapLayer(i, i + 1);
            }
        }
    }
    isDragging = false;
    className = "";
}

function addLayer(e) {
    var layers = document.getElementById("layers");
    var nums = [];
    for (var i = 0; i < layers.children.length; i++) {
        nums.push(parseInt(layers.children[i].getAttribute('id').split("layer")[1]));
    }
    nums.sort(function (a, b) {
        return a - b;
    });
    var num = 0;
    if (layers.children.length > 0)
        num = nums[nums.length - 1] + 1;

    layerNames.push('Layer ' + (num + 1));
    addLayerHTML(num);
    croquis.addLayer();
    croquis.selectLayer(layers.children.length - 1);

    for (var i = 0; i < layers.children.length; i++) {
        layers.children[i].className = "singleLayer";
        if (document.getElementById('nameLayer' + i) != null) document.getElementById('nameLayer' + i).value = layerNames[i];
    }
    layers.children[layers.children.length - 1].className = "singleLayer selected";

}

function dropLayer(e, el) {
    e.preventDefault();
    var layers = document.getElementById("layers");
    if (layers.children.length > 1) {
        var change = false;
        var layer = document.getElementById(el.parentElement.parentElement.id);

        if (layer.className == "singleLayer selected") change = true;
        var index = Array.prototype.indexOf.call(el.parentElement.parentElement.parentNode.children, el.parentElement.parentElement);
        croquis.removeLayer(index);
        layer.parentElement.removeChild(layer);
        if (change) {
            layers.children[0].className = "singleLayer selected";
            selectedLayer = 0;
        }

        croquis.selectLayer(selectedLayer);
    }
}

function selectLayer(e) {
    if ((e.className == "singleLayer" || e.className == "singleLayer selected") && e.parentNode != null) {
        var index = Array.prototype.indexOf.call(e.parentNode.children, e);

        for (var i = 0; i < layers.children.length; i++) {
            if (i != index) layers.children[i].className = "singleLayer";
            else layers.children[i].className = "singleLayer selected";
        }

        if (document.getElementById('ges' + selectedLayer) != null && document.getElementById('ges' + selectedLayer).getAttribute('src') != 'img/ic_gesture_green_24px.svg') {
            oldColor = brushes[selectedTool].getColor();
            oldAlpha = document.getElementById("balpha").value;
            oldSize = document.getElementById("bsize").value;
            oldTool = selectedTool;
        }

        selectedLayer = index;
        croquis.selectLayer(selectedLayer);

        setGesture(document.getElementById('ges' + index), true);
    }
}

function changeOpacity(t) {
    var l = t.parentElement.parentElement;
    selectLayer(l);
    var pos = parseInt(Array.prototype.indexOf.call(l.parentNode.children, l));
    var pos2 = l.getAttribute('id').split('layer')[1];

    croquis.setLayerVisible(!croquis.getLayerVisible(pos), pos);

    document.getElementById("clop" + pos2).src = (!croquis.getLayerVisible(pos)) ? "img/ic_visibility_off_black_24px.svg" : "img/ic_visibility_black_24px.svg";

}

function addLayerHTML(num) {
    var temp = layers.innerHTML;
    layers.innerHTML = temp +
        "<div class='singleLayer' ondrop='drop(event)' ondragover='allowDrop(event)' draggable='true' ondragstart='drag(event)' id='layer" + (num) + "' onclick='selectLayer(this)'><div class='dragname'><img src='img/ic_drag_handle_black_24px.svg' class='dicon' /><input id='nameLayer" + num + "' type='text' onchange='changeLayerName(this.value, " + num + ")' value='" + layerNames[num] + "' class='lname' value='Layer " + (num + 1) + "'/></div>                        <div class='layerTools'>                            <img src='img/ic_gesture_black_24px.svg' class='licon' onclick='setGesture(this,false)' id='ges" + num + "'/> <img src='img/ic_visibility_black_24px.svg' class='licon' onclick='changeOpacity(this)' id='clop" + num + "'/><img src='img/ic_delete_forever_black_24px.svg' class='licon' onclick='dropLayer(event,this)'/></div></div>";
}

function setGesture(target, isClick) {

    if (target != null) {
        var layer = target.parentElement.parentElement;

        //selectLayer(layer);
        var pos = parseInt(Array.prototype.indexOf.call(layer.parentNode.children, layer));
        var pos2 = layer.getAttribute('id').split('layer')[1];

        var oldLayer = selectedLayer;

        var isGesture;
        if (!isClick)
            isGesture = (document.getElementById('ges' + pos2).getAttribute('src') == 'img/ic_gesture_black_24px.svg') ? false : true;
        else isGesture = (document.getElementById('ges' + pos2).getAttribute('src') == 'img/ic_gesture_black_24px.svg') ? true : false;

        if (!isCanvasBlank(croquis.getLayerCanvas(pos2)) && !isGesture) {
            showAlert("Esta camada está vazia.", "Tente novamente!", "hideAlert()");
        } else {
            if (isGesture) {
                document.getElementById('ges' + pos2).src = 'img/ic_gesture_black_24px.svg';
                setGestureTool(false);
            } else {

                if (document.getElementById('ges' + oldLayer).getAttribute('src') != 'img/ic_gesture_green_24px.svg') {
                    oldColor = brushes[selectedTool].getColor();
                    oldAlpha = document.getElementById("balpha").value;
                    oldSize = document.getElementById("bsize").value;
                    oldTool = selectedTool;
                }
                document.getElementById('ges' + pos2).src = 'img/ic_gesture_green_24px.svg';
                setGestureTool(true);
            }
        }
    }
}



function setGestureTool(status) {
    var color = (status) ? "429994" : oldColor.split('#')[1];
    var colorhash = '#' + color;
    var alpha = (status) ? 1 : oldAlpha;
    var size = (status) ? 2 : oldSize;
    var tool = (status) ? 3 : oldTool;

    document.getElementById('fgcolor').jscolor = color;
    document.getElementById('fgcolor').value = color;
    document.getElementById('fgcolor').style.backgroundColor = colorhash;
    changeColor(color);
    brushes[tool].setColor(colorhash);
    selectTool(tool);
    selectToolImage(tool);
    document.getElementById("bsize").value = size;
    changeSize();
    document.getElementById("balpha").value = alpha;
    changeAlpha();
}

function changeLayerName(name, index) {
    layerNames[index] = name;
}


function showAlert(message, question, callback1, callback2) {
    if (message == null) message = MSG1;
    document.getElementById('alertWaiting').style.visibility = 'visible';
    var msg = "<div><p>" + message + "</p>";

    if (question != null && callback1 != null && callback2 != null)
        msg += "<p>" + question + "</p><div><button class = 'cancelButton' onclick = '" + callback2 + "'> NÃO </button> <button onclick = '" + callback1 + "' > SIM </button> </div>";
    else if (question != null && callback1 != null && callback2 == null)
        msg += "<p>" + question + "</p><div><button class = 'cancelButton' onclick = '" + callback1 + "'> TENTE NOVAMENTE </button>  </div>";

    msg += "</div>";
    document.getElementById('alertWaiting').innerHTML = msg;

}

function hideAlert() {
    drawBack();
    document.getElementById('alertWaiting').style.visibility = 'hidden';
}

function drawBack() {
    var im = new Image();
    im.onload = function () {
        var c = croquis.getLayerCanvas(activeSlapLayer);
        var ct = c.getContext('2d');
        ct.clearRect(0, 0, c.width, c.height);
        ct.drawImage(im, 0, 0);
        selectLayer(activeSlapLayer);
    }
    im.src = activeSlapImg;
}

function saveGesture() {
    var form = document.getElementById('sendImageForm');
    addInput(form, 'layer_' + activeSlapLayer + '_numgestures', commands.length, 'hidden');
    for (var i = 0; i < commands.length; i++) {

        var g = "";
        switch (commands[i].control.bestValue.key) {
        case "r_arrow":
            g = 'Gesture{layer:' + activeSlapLayer + '; type:' + 'translation' + '; params:[';
            for (var j = 0; j < commands[i].points.length; j++) {
                var ind = lookForPoint(scenePoints, commands[i].points[j].bestValue.key);
                g += commands[i].points[j].bestValue.key + '(' + scenePoints[ind].pointObject.x + ',' + scenePoints[ind].pointObject.y + ')';
                if (j < commands[i].points.length - 1) g += ' / ';
            }
            g += ']}';
            break;
        case "r_rotate":
            g = 'Gesture{layer:' + activeSlapLayer + '; type:' + 'rotation' + '; params:[';
            for (var j = 0; j < commands[i].params.length; j++) {
                g += 's' + j + '(' + commands[i].params[j] + ')';
                if (j < commands[i].points.length - 1) g += ' / ';
            }
            g += ']}';
            break;
        case "cam":
            g = 'Gesture{layer:' + activeSlapLayer + '; type:' + 'cam' + '; params:[';
            for (var j = 0; j < commands[i].frames.length; j++) {
                g += 'f' + commands[i].frames[j].frameControl + '(' + commands[i].frames[j].x + ',' + commands[i].frames[j].y + ',' + commands[i].frames[j].width + ',' + commands[i].frames[j].height + ')';
                if (j < commands[i].frames.length - 1) g += ' / ';
            }
            g += ']}';
            console.log(g);
            break;
        }
        addInput(form, 'layer_' + activeSlapLayer + '_gesture_' + i, g, 'hidden');
    }
    contLayers++;
    console.log(contLayers, gestureLayersNumber);
    if (contLayers == gestureLayersNumber)
        submitForm();
    hideAlert();
}


function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;

    return canvas.toDataURL() == blank.toDataURL();
}

// ------------- SLAP -------------
var slapResults = [];
var activeSlapLayer = -1;
var activeSlapImg = "";
var commands = [];
var scenePoints = [];

function testSlap(i, canvas, image) {
    activeSlapImg = image;
    activeSlapLayer = i;
    var slap = new Slap({
        imageSrc: image,
        //        file: 'js/slapnet_min.json',
        file: 'js/slapnet.json',
        threshold: 0.7,
        canvas: canvas
    });
    slap.onRecognized = function () {
        commands = slap.getCommands();
        scenePoints = slap.getScenePoints();
        var resp = "";
        console.log("COMMANDS", commands);
        console.log("SCENEPOINTS", scenePoints);

        if (commands.length == 0) {
            showAlert("Número insuficiente de símbolos para criar um comando.", "Tente novamente!", "hideAlert()");
        } else {
            for (var i = 0; i < commands.length; i++) {

                if (commands[i].error != slap.getError("NO_ERROR")) {
                    showAlert(commands[i].error, "Tente novamente!", "hideAlert()");
                } else {
                    var hasAllPoints = true;
                    if (commands[i].points.length == 0) hasAllPoints = true;
                    else {

                        for (var j = 0; j < commands[i].points.length; j++) {
                            var pt = commands[i].points[j].bestValue.key;

                            if (lookForPoint(scenePoints, commands[i].points[j].bestValue.key) == -1) {
                                hasAllPoints = false;
                            }
                        }
                    }

                    var controlKey = commands[i].control.bestValue.key;
                    var control = "Comando não reconhecido";
                    if (controlKey == 'r_arrow') control = "translation";
                    if (controlKey == 'r_rotate') control = "rotation";
                    if (controlKey == 'cam') control = "cam";

                    console.log("===========", control);
                    switch (control) {
                    case 'translation':
                        if (!hasAllPoints) {
                            var msg = "Foi detectada uma <b>translação</b> do ponto <b>" + commands[i].points[0].bestValue.key + "</b> ao ponto <b>" + commands[i].points[1].bestValue.key + "</b>.</p><p> Mas não foram detectados os pontos na cena!</p>";
                            console.log(scenePoints);
                            if (scenePoints.length > 0) {
                                msg += "<p><small>o que foi encontrado: ";
                                for (var i = 0; i < scenePoints.length; i++) {
                                    msg += scenePoints[i].name;
                                    if (i < scenePoints[i].length - 1)
                                        msg += ', '
                                }
                            } else {
                                msg += "<p><small>não foram encontrados todos os pontos!";
                            }

                            msg += "</small></p>";


                            showAlert(msg, "Tente novamente!", "hideAlert()");
                        } else {
                            var msg = "Foi detectada uma <b>" + control + "</b> do ponto <b>" + commands[i].points[0].bestValue.key + "</b> ao ponto <b>" + commands[i].points[1].bestValue.key + "</b>.";
                            showAlert(msg, "Está correto?", "saveGesture()", "hideAlert()");
                        }
                        break;
                    case 'rotation':

                        var p1 = "";
                        var p2 = "";
                        for (var j = 0; j < commands[i].points.length; j++) {
                            var v1 = Math.abs(commands[i].timeline.x - commands[i].points[j].x);
                            var v2 = Math.abs((commands[i].timeline.x + commands[i].timeline.width) - commands[i].points[j].x);
                            console.log(v1, v2);
                            if (v1 < v2) p1 += commands[i].points[j].bestValue.key;
                            else p2 += commands[i].points[j].bestValue.key;
                        }
                        commands[i].params = [p1, p2];
                        var msg = "Foi detectada uma <b>rotação</b> de <b>" + p1 + "</b>º para <b>" + p2 + "º</b>.";
                        showAlert(msg, "Está correto?", "saveGesture()", "hideAlert()");
                        break;
                    case 'cam':

                        var objectVector = slap.getObjectVector();
                        var frames = slap.getFrames();
                        console.log('FRAMES', frames);
                        commands[i].frames = frames;

                        var error = true;
                        if (commands[i].points.length < 2) {
                            var msg = "Foi detectado um <b>movimento de câmera</b>. <p>Mas os quadros não foram encontrados na cena!</p>";
                            showAlert(msg, "Tente novamente!", "hideAlert()");
                        } else {
                            var p1 = commands[i].points[0];
                            var p2 = commands[i].points[1];

                            var msg = "Foi detectado um <b>movimento de câmera</b> de <b>" + p1.bestValue.key + "</b> para <b>" + p2.bestValue.key + "</b>.";

                            if (frames.length < 2) {
                                msg += "<p> mas não foram encontrados os quadros na cena!</p>";
                            } else {

                                var hasP1 = lookForFrame(frames, p1.bestValue.key)
                                var hasP2 = lookForFrame(frames, p2.bestValue.key)
                                if ((hasP1 == -1 && hasP2 == -1) || hasP1 == hasP2)
                                    msg += "<p> Mas nenhum quadro foi encontrado!</p>";
                                else if (hasP1 == -1)
                                    msg += "<p> Mas não foi encontrado o quadro <b>" + p1.bestValue.key + "</b> na cena!</p>";
                                else if (hasP2 == -1)
                                    msg += "<p> Mas não foi encontrado o quadro <b>" + p2.bestValue.key + "</b> na cena!</p>";
                                else error = false;

                                msg += "<p><small>Foram encontrados os quadros " + frames[0].frameControl + " e " + frames[1].frameControl + "</small></p>";
                            }

                            if (error) showAlert(msg, "Tente novamente!", "hideAlert()");
                            else showAlert(msg, "Está correto?", "saveGesture()", "hideAlert()");
                        }


                        break;

                    default:
                        var msg = "O símbolo de controle da <i>timeline</i> não foi encontrado.";
                        showAlert(msg, "Tente novamente!", "hideAlert()");
                        break;
                    }

                }
            }
        }
        slapResults.push({
            commands: commands,
            scenePoints: scenePoints
        })
    };
    slap.test();

}

function lookForFrame(frames, key) {
    console.log("LOOK FOR " + key)
    var index = -1;
    for (var i = 0; i < frames.length; i++) {
        if (frames[i].frameControl == key) {
            index = i;
            break;
        }
    }
    console.log((index == -1) ? "not found" : "found");
    return index;
}

function lookForPoint(points, key) {
    console.log("LOOK FOR " + key)
    var index = -1;
    for (var i = 0; i < points.length; i++) {
        if (points[i].name == key) {
            index = i;
            break;
        }
    }
    console.log((index == -1) ? "not found" : "found");
    return index;
}