//SLAP - Storyboard Language for Animation Programming
function Slap(properties) {
    var self = this;

    const LOAD_JSON = 0,
        GET_SYMBOLS = 1,
        LOAD_IMAGE = 2;

    const ERROR_MULTI_TIMELINE = "Multiplas timelines!",
        ERROR_NO_TIMELINE = "O símbolo TIMELINE não foi encontrado!",
        ERROR_NOT_ENOUGH_SYMBOLS = "Não há símbolos suficientes!",
        ERROR_NO_CONTROL = "O símbolo de controle não foi encontrado!",
        NO_ERROR = "OK";


    var jsonLoaded = false;
    var isJsonLoading = false;
    var gotInfo = false;
    var isGettingInfo = false;
    var isLoadingImage = false;
    var imageLoaded = false;

    var objectVector = []; //object vector from image
    var canvas = (properties["canvas"] == null) ? document.getElementById('initCanvas') : properties["canvas"];
    var context = canvas.getContext('2d');
    var divX = 15;
    var divY = 15;
    var threshold = 0;
    var file;
    var interval, interval2, interval3;
    var containOffset = 20;
    var commands = [];
    var scenePoints = [];

    var net;
    var netData = [];
    var error = NO_ERROR;

    var imageSrc = "";

    if (properties != null)
        for (var property in properties)
            self[property] = properties[property];

    if (self.imageSrc != "") {
        var image = new Image();
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, image.width, image.height);
            var imageData = context.getImageData(0, 0, image.width, image.height);
            var gray = tracking.Image.grayscale(imageData.data, image.width, image.height, true);
            context.putImageData(new ImageData(gray, image.width, image.height), 0, 0);
            //self.getContextInformation();
            self.imageLoaded = true;
            self.isLoadingImage = false;
        };
        image.src = self.imageSrc;
        self.isLoadingImage = true;
    }

    self.test = function () {
        self.loadNetFromJSON(self.file);
        self.addListener(LOAD_JSON, function () {
            console.log("JSON LOADED");
            //            console.log(self.netData);
            self.addListener(LOAD_IMAGE, function () {
                console.log("IMAGE LOADED");
                self.getContextInformation();
                self.addListener(GET_SYMBOLS, function () {
                    console.log("SYMBOLS RECOGNIZED");
                    for (var i = 0; i < objectVector.length; i++) {
                        objectVector[i].index = i;
                        objectVector[i].output = self.net.run(objectVector[i].input);
                        var props = [];
                        for (var property in objectVector[i].output)
                            props.push({
                                key: property,
                                value: objectVector[i].output[property]
                            });
                        objectVector[i].bestValue = self.getBestValue(props);
                    }
                    self.onTested();
                });
            });
        });


    }
    self.onTested = function () {
        //        for(var i=0; i<objectVector.length; i++){
        //            console.log(objectVector[i].bestValue.key,objectVector[i].bestValue.value);
        //        }

        var objectVector2 = objectVector.slice(0);
        if (error == NO_ERROR) {
            var off = containOffset;
            //--------- look for timeline
            for (var i = 0; i < objectVector2.length; i++) {
                if (objectVector2[i].bestValue.key == "timeline") {
                    commands.push({
                        timeline: self.cloneObject(objectVector2[i]),
                        points: [],
                        control: null,
                        error: NO_ERROR
                    });
                    //objectVector2.splice(i, 1);
                } else if (objectVector2[i].bestValue.key == "point") {
                    scenePoints.push({
                        pointObject: self.cloneObject(objectVector2[i]),
                        name: ""
                    });
                    //objectVector2.splice(i, 1);
                }
            }



            if (commands.length == 0) error = ERROR_NO_TIMELINE;
            else {

                //--------- Look for control symbols
                for (var ind = 0; ind < commands.length; ind++) {
                    //look for timeline control symbol and control points

                    for (var i = 0; i < objectVector2.length; i++) {
                        if (objectVector2[i].bestValue.value > threshold) {
                            var x = objectVector2[i].x;
                            var w = objectVector2[i].width;
                            var xt = commands[ind].timeline.x;
                            var wt = commands[ind].timeline.width;
                            off = commands[ind].timeline.height;

                            //look for control symbol
                            if ((x > xt - off && x < xt + wt + off) && (x + w > xt - off && x + w < xt + wt + off)) { //in X range
                                var y = objectVector2[i].y;
                                var h = objectVector2[i].height;
                                var yt = commands[ind].timeline.y;
                                var ht = commands[ind].timeline.height;

                                if (y < yt && y > yt - h - off) { //in Y range
                                    commands[ind].control = self.cloneObject(objectVector2[i]);
                                    //objectVector2.splice(i, 1);
                                }
                            }
                        }
                    }
                    self.orderPoints(commands[ind].points);
                }

                //---------  Look for properties under timeline --------
                for (var ind = 0; ind < commands.length; ind++) {

                    //look for timeline control symbol and control points
                    for (var i = 0; i < objectVector2.length; i++) {
                        if (objectVector2[i].bestValue.value > threshold) {
                            var x = objectVector2[i].x;
                            var w = objectVector2[i].width;
                            var xt = commands[ind].timeline.x;
                            var wt = commands[ind].timeline.width;
                            off = commands[ind].timeline.height;

                            if ((x > xt - off - w && x < xt + off) || (x > xt + wt - w - off && x < xt + wt + w + off)) {
                                var y = objectVector2[i].y;
                                var h = objectVector2[i].height;
                                var yt = commands[ind].timeline.y;
                                var ht = commands[ind].timeline.height;

                                if (y > yt + ht && y < yt + ht + h) { //in Y range
                                    var obj = self.cloneObject(objectVector2[i]);
                                    commands[ind].points.push(obj);
                                    //objectVector2.splice(i, 1);
                                }
                            }
                        }
                    }
                    self.orderPoints(commands[ind].points);
                }
            }

            //LOOK FOR SCENE POINTS
            console.log("Foram encontrados ", scenePoints.length, " pontos ");
            for (var i = 0; i < scenePoints.length; i++) {
                var xi = scenePoints[i].pointObject.x;
                var yi = scenePoints[i].pointObject.y;
                var wi = scenePoints[i].pointObject.width;
                var hi = scenePoints[i].pointObject.height;


                for (var j = 0; j < objectVector.length; j++) {
                    if (objectVector[j] != scenePoints[i].pointObject && objectVector[j].bestValue.value >= threshold) {
                        var xj = objectVector[j].x;
                        var yj = objectVector[j].y;
                        var wj = objectVector[j].width;
                        var hj = objectVector[j].height;
                        off = scenePoints[i].pointObject.height;

                        if ((xj > xi && xj < xi + wi) && (yj > yi + hi && yj < yi + hi + off)) {
                            scenePoints[i].name = objectVector[j].bestValue.key;
                        }
                    }
                }
            }


            scenePoints.sort(function (a, b) {
                return (a.name.charCodeAt(0) == b.name.charCodeAt(0)) ? 0 : ((a.name.charCodeAt(0) < b.name.charCodeAt(0)) ? -1 : 1);
            });
        }

        for (var i = 0; i < commands.length; i++) {
            if (commands[i].points.length < 2) commands[i].error = ERROR_NOT_ENOUGH_SYMBOLS;
            if (commands[i].control == null) commands[i].error = ERROR_NO_CONTROL;
        }
        console.log('OBJECTVECTOR', objectVector);
        self.onRecognized();

    };
    self.cloneObject = function (obj) {
        var output = {};
        for (var p in obj.output) {
            output[p] = obj.output[p];
        }

        var obj2 = {
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            res: obj.res,
            input: obj.input,
            output: output,
            index: obj.index,
            bestValue: {
                key: obj.bestValue.key,
                value: obj.bestValue.value
            }
        }
        return obj2;
    };
    self.lookForPoint = function (name) {
        var pt = null;
        for (var i = 0; i < scenePoints.length; i++) {
            if (scenePoints[i].name == name) pt = scenePoints[i].pointObject;
        }
        return pt;
    };
    self.getCommands = function () {
        return commands;
    };
    self.getScenePoints = function () {
        return scenePoints;
    };
    self.getObjectVector = function () {
        return objectVector;
    };
    self.getFrames = function () {
        var frames = [];
        for (var i = 0; i < objectVector.length; i++) {
            if (objectVector[i].bestValue.key == "frame") {
                objectVector[i].frameControl = "";
                frames.push(objectVector[i]);
            }
        }
        var off = containOffset;
        //serach frame name (always above frame)
        for (var i = 0; i < frames.length; i++) {
            var fx0 = frames[i].x;
            var fx1 = frames[i].x + frames[i].width;
            var fy0 = frames[i].y;

            for (var j = 0; j < objectVector.length; j++) {
                if (j != frames[i].index) {
                    py = objectVector[j].y + objectVector[j].height;
                    if ((objectVector[j].x >= fx0 && objectVector[j].x <= fx1) && ( py >= (fy0 - off) && py < fy0)){
                        frames[i].frameControl = objectVector[j].bestValue.key;
                    }
                }
            }
        }

        return frames;
    };
    self.onRecognized = function () {

        for (i = 0; i < commands.length; i++) {
            console.log(i + " -> timeline: " + objectVector.indexOf(commands[i].timeline) + " - " + commands[i].error);
        }
        console.log(commands);
        console.log(scenePoints);
        console.log(objectVector);
    };
    self.orderPoints = function (points, type) {
        if (type == null) type = "x";
        switch (type.toUpperCase()) {
        case "X":
            points.sort(function (a, b) {
                return (a.x == b.x) ? 0 : ((a.x < b.x) ? -1 : 1);
            });
            break;
        case "Y":
            points.sort(function (a, b) {
                return (a.y == b.y) ? 0 : ((a.y < b.y) ? -1 : 1);
            });
            break;
        }
    }
    self.addListener = function (type, callback) {
        if (type == LOAD_JSON)
            self.interval = setInterval(function () {
                if (!self.isJsonLoading || self.jsonLoaded) {
                    callback();
                    clearInterval(self.interval);
                }
            }, 1);
        if (type == GET_SYMBOLS)
            self.interval2 = setInterval(function () {
                if (!self.isGettingInfo || self.gotInfo) {
                    callback();
                    clearInterval(self.interval2);
                }
            }, 1);
        if (type == LOAD_IMAGE)
            self.interval3 = setInterval(function () {
                if (!self.isLoadingImage || self.imageLoaded) {
                    callback();
                    clearInterval(self.interval3);
                }
            }, 1);

    }
    self.loadNetFromJSON = function (file) {
        var xobj = new XMLHttpRequest();
        self.isJsonLoading = true;
        self.jsonLoaded = false;
        self.jsonLoaded = false;

        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                self.onJSONLoad(xobj.responseText);
            }
        };
        xobj.send(null);
    };
    self.onJSONLoad = function (response) {
        var actual_JSON = JSON.parse(response);
        self.net = new brain.NeuralNetwork({
            hiddenLayers: [4],
            learningRate: 0.6 // global learning rate, useful when training using streams
        });
        self.net.fromJSON(actual_JSON);
        self.netData = self.net.getData();

        self.isJsonLoading = false;
        self.jsonLoaded = true;
    };
    self.getBestValue = function (array) {
        var best = array[0].value;
        var ind = 0;
        var name = array[0].key;
        for (var i = 0; i < array.length; i++) {
            if (array[i].value > best) {
                best = array[i].value;
                name = array[i].key
            }
        }
        return {
            value: best,
            key: name
        };
    };
    self.getContextInformation = function () {
        self.gotInfo = false;
        self.isGettingInfo = true;

        tracking.ColorTracker.registerColor('threshold', function (r, g, b) {
            return r > 0;
        });

        var tracker = new tracking.ColorTracker(['threshold']);
        tracker.setMinDimension(2);
        tracker.setMinGroupSize(2);

        tracker.on('track', function (event) {
            var cont = 0;
            var total = event.data.length;
            if (total < 4) error = ERROR_NOT_ENOUGH_SYMBOLS;
            objectVector = [];
            event.data.forEach(function (rect) {

                var data = generateData(rect.x, rect.y, rect.width, rect.height, rect.color);
                console.log((cont + 1) + " of " + total);
                objectVector.push({
                    input: data,
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    res: -1
                });
                draw(rect.x, rect.y, rect.width, rect.height, "#f00", data, cont);
                cont++;
                if (cont == total) {
                    //loading.style.display = "none";
                    self.objectVector = objectVector;
                    self.gotInfo = true;
                    self.isGettingInfo = false;
                }
            });

        });



        function generateData(x, y, w, h, color) {
            var data = [];

            var stepX = w / divX;
            var stepY = h / divY;

            //divisões em Y
            for (b = 0; b < divY; b++) {
                var y0 = y + b * stepY;
                var y1 = y + (b + 1) * stepY;

                //divisões em X
                for (var a = 0; a < divX; a++) {
                    var x0 = x + a * stepX;
                    var x1 = x + (a + 1) * stepX;
                    data.push(0);

                    var isOk = !isCanvasBlank(createContext("canvas" + b + "-" + a, canvas, x0, y0, x1 - x0, y1 - y0));
                    data[data.length - 1] = (isOk) ? 1 : 0;
                }
            }
            return data;
        }

        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            var p = ((r << 16) | (g << 8) | b).toString(16);
            return "#" + ("000000" + p).slice(-6);
        }

        function isCanvasBlank(canvas) {
            var blank = document.createElement('canvas');
            blank.width = canvas.width;
            blank.height = canvas.height;

            return canvas.toDataURL() == blank.toDataURL();
        }

        function createContext(name, oldcanvas, x, y, width, height) {
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(oldcanvas, x, y, width, height, 0, 0, width, height);
            //document.body.appendChild(canvas);
            //canvas.setAttribute("id", name);
            //            canvas.style.display = "hidden";
            return canvas;
        }

        function draw(x, y, w, h, color, data, num) {
            context.fillStyle = "rgba(255,0,0,0.2)";
            var cont = 0;
            var stepX = w / divX;
            var stepY = h / divY;
            context.beginPath();
            context.strokeStyle = color;
            context.rect(x, y, w, h);
            context.stroke();

            context.font = "20px Georgia";
            context.fillText(num, x + w + 10, y);


            for (var j = 0; j < divX; j++) {
                for (var i = 0; i < divY; i++) {
                    if (data[cont] == 1) {
                        context.beginPath();
                        context.rect(x + i * stepX, y + j * stepY, stepX, stepY);
                        context.fill();
                    }
                    cont++;
                }
            }
        }
        tracking.track('#' + self.canvas.id, tracker);
    };
    self.getError = function (error) {
        switch (error) {
        case "ERROR_MULTI_TIMELINE":
            return ERROR_MULTI_TIMELINE;
            break;
        case "ERROR_NO_TIMELINE":
            return ERROR_NO_TIMELINE;
            break;
        case "ERROR_NOT_ENOUGH_SYMBOLS":
            return ERROR_NOT_ENOUGH_SYMBOLS;
            break;
        case "ERROR_NO_CONTROL":
            return ERROR_NO_CONTROL;
            break;
        case "NO_ERROR":
            return NO_ERROR;
            break;
        }
    };
    self.getProperty = function (name) {
        return self[name];
    };
    self.setProperty = function (name, value) {
        self[name] = value;
    };
}




//============ Third part Frameworks ============// 
//------------        Brain.js       ------------//

! function e(t, r, n) {
    function i(o, s) {
        if (!r[o]) {
            if (!t[o]) {
                var u = "function" == typeof require && require;
                if (!s && u) return u(o, !0);
                if (a) return a(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = r[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function (e) {
                var r = t[o][1][e];
                return i(r ? r : e)
            }, f, f.exports, e, t, r, n)
        }
        return r[o].exports
    }
    for (var a = "function" == typeof require && require, o = 0; o < n.length; o++) i(n[o]);
    return i
}({
    1: [function (e, t, r) {
        brain = e("./lib/brain")
    }, {
        "./lib/brain": 2
    }],
    2: [function (e, t, r) {
        r.NeuralNetwork = e("./neuralnetwork").NeuralNetwork, r.crossValidate = e("./cross-validate")
    }, {
        "./cross-validate": 3,
        "./neuralnetwork": 5
    }],
    3: [function (e, t, r) {
        function i(e, t, r, i, a) {
            var o = new e(t),
                s = Date.now(),
                u = o.train(i, r),
                f = Date.now(),
                l = o.test(a),
                h = Date.now(),
                c = n(l).extend({
                    trainTime: f - s,
                    testTime: h - f,
                    iterations: u.iterations,
                    trainError: u.error,
                    learningRate: o.learningRate,
                    hidden: o.hiddenSizes,
                    network: o.toJSON()
                });
            return c
        }
        var n = e("underscore")._;
        t.exports = function (e, t, r, a, o) {
            o = o || 4;
            var s = t.length / o;
            t = n(t).sortBy(function () {
                return Math.random()
            });
            var u = {
                    error: 0,
                    trainTime: 0,
                    testTime: 0,
                    iterations: 0,
                    trainError: 0
                },
                f = {
                    truePos: 0,
                    trueNeg: 0,
                    falsePos: 0,
                    falseNeg: 0,
                    total: 0
                },
                l = [],
                h = n.range(o).map(function (o) {
                    var h = n(t).clone(),
                        c = h.splice(o * s, s),
                        d = h,
                        p = i(e, r, a, d, c);
                    return n(u).each(function (e, t) {
                        u[t] = e + p[t]
                    }), n(f).each(function (e, t) {
                        f[t] = e + p[t]
                    }), l.push(p.misclasses), p
                });
            return n(u).each(function (e, t) {
                u[t] = e / o
            }), f.precision = f.truePos / (f.truePos + f.falsePos), f.recall = f.truePos / (f.truePos + f.falseNeg), f.accuracy = (f.trueNeg + f.truePos) / f.total, f.testSize = s, f.trainSize = t.length - s, {
                avgs: u,
                stats: f,
                sets: h,
                misclasses: n(l).flatten()
            }
        }
    }, {
        underscore: 20
    }],
    4: [function (e, t, r) {
        function i(e) {
            var t = n(e).reduce(function (e, t) {
                return n(e).extend(t)
            }, {});
            return a(t)
        }

        function a(e) {
            var t = {},
                r = 0;
            for (var n in e) t[n] = r++;
            return t
        }

        function o(e, t) {
            var r = [];
            for (var n in e) r[e[n]] = t[n] || 0;
            return r
        }

        function s(e, t) {
            var r = {};
            for (var n in e) r[n] = t[e[n]];
            return r
        }

        function u(e) {
            for (var t = {}, r = 0, n = e.length; n-- > 0;) t[e[n]] = r++;
            return t
        }
        var n = e("underscore");
        t.exports = {
            buildLookup: i,
            lookupFromHash: a,
            toArray: o,
            toHash: s,
            lookupFromArray: u
        }
    }, {
        underscore: 20
    }],
    5: [function (e, t, r) {
        function u() {
            return .4 * Math.random() - .2
        }

        function f(e) {
            for (var t = new Array(e), r = 0; e > r; r++) t[r] = 0;
            return t
        }

        function l(e) {
            for (var t = new Array(e), r = 0; e > r; r++) t[r] = u();
            return t
        }

        function h(e) {
            for (var t = 0, r = 0; r < e.length; r++) t += Math.pow(e[r], 2);
            return t / e.length
        }

        function c(e) {
            if (a.call(this, {
                    objectMode: !0
                }), e = e || {}, !e.neuralNetwork) throw new Error("no neural network specified");
            return this.neuralNetwork = e.neuralNetwork, this.dataFormatDetermined = !1, this.inputKeys = [], this.outputKeys = [], this.i = 0, this.iterations = e.iterations || 2e4, this.errorThresh = e.errorThresh || .005, this.log = e.log || !1, this.logPeriod = e.logPeriod || 10, this.callback = e.callback, this.callbackPeriod = e.callbackPeriod || 10, this.floodCallback = e.floodCallback, this.doneTrainingCallback = e.doneTrainingCallback, this.size = 0, this.count = 0, this.sum = 0, this.on("finish", this.finishStreamIteration), this
        }
        var n = e("underscore"),
            i = e("./lookup"),
            a = e("stream").Writable,
            o = e("inherits"),
            s = function (e) {
                e = e || {}, this.learningRate = e.learningRate || .3, this.momentum = e.momentum || .1, this.hiddenSizes = e.hiddenLayers, this.binaryThresh = e.binaryThresh || .5, e != {} && (this.data = e.data)
            };
        s.prototype = {
            initialize: function (e) {
                this.sizes = e, this.outputLayer = this.sizes.length - 1, this.biases = [], this.weights = [], this.outputs = [], this.deltas = [], this.changes = [], this.errors = [];
                for (var t = 0; t <= this.outputLayer; t++) {
                    var r = this.sizes[t];
                    if (this.deltas[t] = f(r), this.errors[t] = f(r), this.outputs[t] = f(r), t > 0) {
                        this.biases[t] = l(r), this.weights[t] = new Array(r), this.changes[t] = new Array(r);
                        for (var n = 0; r > n; n++) {
                            var i = this.sizes[t - 1];
                            this.weights[t][n] = l(i), this.changes[t][n] = f(i)
                        }
                    }
                }
            },
            run: function (e) {
                this.inputLookup && (e = i.toArray(this.inputLookup, e));
                var t = this.runInput(e);
                return this.outputLookup && (t = i.toHash(this.outputLookup, t)), t
            },
            runInput: function (e) {
                this.outputs[0] = e;
                for (var t = 1; t <= this.outputLayer; t++) {
                    for (var r = 0; r < this.sizes[t]; r++) {
                        for (var n = this.weights[t][r], i = this.biases[t][r], a = 0; a < n.length; a++) i += n[a] * e[a];
                        this.outputs[t][r] = 1 / (1 + Math.exp(-i))
                    }
                    var o = e = this.outputs[t]
                }
                return o
            },
            getData: function () {
                return this.data
            },
            train: function (e, t) {
                this.data = e, e = this.formatData(e), t = t || {};
                var r = t.iterations || 2e4,
                    i = t.errorThresh || .005,
                    a = t.log || !1,
                    o = t.logPeriod || 10,
                    s = t.callback,
                    u = t.callbackPeriod || 10,
                    f = e[0].input.length,
                    l = e[0].output.length,
                    h = this.hiddenSizes;
                h || (h = [Math.max(3, Math.floor(f / 2))]);
                var c = n([f, h, l]).flatten();
                this.initialize(c);
                for (var d = 1, p = 0; r > p && d > i; p++) {
                    for (var v = 0, g = 0; g < e.length; g++) {
                        var y = this.trainPattern(e[g].input, e[g].output);
                        v += y
                    }
                    d = v / e.length, a && p % o == 0 && console.log("iterations:", p, "training error:", d), s && p % u == 0 && s({
                        error: d,
                        iterations: p
                    })
                }
                return {
                    error: d,
                    iterations: p
                }
            },
            trainPattern: function (e, t) {
                this.runInput(e), this.calculateDeltas(t), this.adjustWeights();
                var r = h(this.errors[this.outputLayer]);
                return r
            },
            calculateDeltas: function (e) {
                for (var t = this.outputLayer; t >= 0; t--)
                    for (var r = 0; r < this.sizes[t]; r++) {
                        var n = this.outputs[t][r],
                            i = 0;
                        if (t == this.outputLayer) i = e[r] - n;
                        else
                            for (var a = this.deltas[t + 1], o = 0; o < a.length; o++) i += a[o] * this.weights[t + 1][o][r];
                        this.errors[t][r] = i, this.deltas[t][r] = i * n * (1 - n)
                    }
            },
            adjustWeights: function () {
                for (var e = 1; e <= this.outputLayer; e++)
                    for (var t = this.outputs[e - 1], r = 0; r < this.sizes[e]; r++) {
                        for (var n = this.deltas[e][r], i = 0; i < t.length; i++) {
                            var a = this.changes[e][r][i];
                            a = this.learningRate * n * t[i] + this.momentum * a, this.changes[e][r][i] = a, this.weights[e][r][i] += a
                        }
                        this.biases[e][r] += this.learningRate * n
                    }
            },
            formatData: function (e) {
                if (!n.isArray(e)) {
                    var t = [];
                    t.push(e), e = t
                }
                var r = e[0].input;
                return n(r).isArray() || r instanceof Float64Array || (this.inputLookup || (this.inputLookup = i.buildLookup(n(e).pluck("input"))), e = e.map(function (e) {
                    var t = i.toArray(this.inputLookup, e.input);
                    return n(n(e).clone()).extend({
                        input: t
                    })
                }, this)), n(e[0].output).isArray() || (this.outputLookup || (this.outputLookup = i.buildLookup(n(e).pluck("output"))), e = e.map(function (e) {
                    var t = i.toArray(this.outputLookup, e.output);
                    return n(n(e).clone()).extend({
                        output: t
                    })
                }, this)), e
            },
            test: function (e) {
                e = this.formatData(e);
                for (var t = 1 == e[0].output.length, r = 0, i = 0, a = 0, o = 0, s = [], u = 0, f = 0; f < e.length; f++) {
                    var d, p, l = this.runInput(e[f].input),
                        c = e[f].output;
                    if (t ? (d = l[0] > this.binaryThresh ? 1 : 0, p = c[0]) : (d = l.indexOf(n(l).max()), p = c.indexOf(n(c).max())), d != p) {
                        var v = e[f];
                        n(v).extend({
                            actual: d,
                            expected: p
                        }), s.push(v)
                    }
                    t && (0 == d && 0 == p ? o++ : 1 == d && 1 == p ? a++ : 0 == d && 1 == p ? i++ : 1 == d && 0 == p && r++);
                    var g = l.map(function (e, t) {
                        return c[t] - e
                    });
                    u += h(g)
                }
                var y = u / e.length,
                    m = {
                        error: y,
                        misclasses: s
                    };
                return t && n(m).extend({
                    trueNeg: o,
                    truePos: a,
                    falseNeg: i,
                    falsePos: r,
                    total: e.length,
                    precision: a / (a + r),
                    recall: a / (a + i),
                    accuracy: (o + a) / e.length
                }), m
            },
            toJSON: function () {
                for (var e = [], t = 0; t <= this.outputLayer; t++) {
                    e[t] = {};
                    var r;
                    r = 0 == t && this.inputLookup ? n(this.inputLookup).keys() : t == this.outputLayer && this.outputLookup ? n(this.outputLookup).keys() : n.range(0, this.sizes[t]);
                    for (var i = 0; i < r.length; i++) {
                        var a = r[i];
                        if (e[t][a] = {}, t > 0) {
                            e[t][a].bias = this.biases[t][i], e[t][a].weights = {};
                            for (var o in e[t - 1]) {
                                var s = o;
                                1 == t && this.inputLookup && (s = this.inputLookup[o]), e[t][a].weights[o] = this.weights[t][i][s]
                            }
                        }
                    }
                }
                return {
                    layers: e,
                    outputLookup: !!this.outputLookup,
                    inputLookup: !!this.inputLookup,
                    data: this.data
                }
            },
            fromJSON: function (e) {
                var t = e.layers.length;
                this.data = e.data, this.outputLayer = t - 1, this.sizes = new Array(t), this.weights = new Array(t), this.biases = new Array(t), this.outputs = new Array(t);
                for (var r = 0; r <= this.outputLayer; r++) {
                    var a = e.layers[r];
                    0 != r || a[0] && !e.inputLookup ? r != this.outputLayer || a[0] && !e.outputLookup || (this.outputLookup = i.lookupFromHash(a)) : this.inputLookup = i.lookupFromHash(a);
                    var o = n(a).keys();
                    this.sizes[r] = o.length, this.weights[r] = [], this.biases[r] = [], this.outputs[r] = [];
                    for (var s in o) {
                        var u = o[s];
                        this.biases[r][s] = a[u].bias, this.weights[r][s] = n(a[u].weights).toArray()
                    }
                }
                return this
            },
            toFunction: function () {
                var e = this.toJSON();
                return new Function("input", "  var net = " + JSON.stringify(e) + ";\n\n  for (var i = 1; i < net.layers.length; i++) {\n    var layer = net.layers[i];\n    var output = {};\n    \n    for (var id in layer) {\n      var node = layer[id];\n      var sum = node.bias;\n      \n      for (var iid in node.weights) {\n        sum += node.weights[iid] * input[iid];\n      }\n      output[id] = (1 / (1 + Math.exp(-sum)));\n    }\n    input = output;\n  }\n  return output;")
            },
            createTrainStream: function (e) {
                return e = e || {}, e.neuralNetwork = this, this.trainStream = new c(e), this.trainStream
            }
        }, r.NeuralNetwork = s, o(c, a), c.prototype._write = function (e, t, r) {
            if (!e) return this.emit("finish"), r();
            if (!this.dataFormatDetermined) return this.size++, this.inputKeys = n.union(this.inputKeys, n.keys(e.input)), this.outputKeys = n.union(this.outputKeys, n.keys(e.output)), this.firstDatum = this.firstDatum || e, r();
            this.count++;
            var i = this.neuralNetwork.formatData(e);
            this.trainDatum(i[0]), r()
        }, c.prototype.trainDatum = function (e) {
            var t = this.neuralNetwork.trainPattern(e.input, e.output);
            this.sum += t
        }, c.prototype.finishStreamIteration = function () {
            if (this.dataFormatDetermined && this.size !== this.count && console.log("This iteration's data length was different from the first."), !this.dataFormatDetermined) {
                this.neuralNetwork.inputLookup = i.lookupFromArray(this.inputKeys), this.neuralNetwork.outputLookup = i.lookupFromArray(this.outputKeys);
                var e = this.neuralNetwork.formatData(this.firstDatum),
                    t = e[0].input.length,
                    r = e[0].output.length,
                    a = this.hiddenSizes;
                a || (a = [Math.max(3, Math.floor(t / 2))]);
                var o = n([t, a, r]).flatten();
                return this.dataFormatDetermined = !0, this.neuralNetwork.initialize(o), void("function" == typeof this.floodCallback && this.floodCallback())
            }
            var s = this.sum / this.size;
            if (this.log && this.i % this.logPeriod == 0 && console.log("iterations:", this.i, "training error:", s), this.callback && this.i % this.callbackPeriod == 0 && this.callback({
                    error: s,
                    iterations: this.i
                }), this.sum = 0, this.count = 0, this.i++, this.i < this.iterations && s > this.errorThresh) {
                if ("function" == typeof this.floodCallback) return this.floodCallback()
            } else if ("function" == typeof this.doneTrainingCallback) return this.doneTrainingCallback({
                error: s,
                iterations: this.i
            })
        }
    }, {
        "./lookup": 4,
        inherits: 19,
        stream: 12,
        underscore: 20
    }],
    6: [function (e, t, r) {
        function a(e, t, r) {
            if (!(this instanceof a)) return new a(e, t, r);
            var n = typeof e;
            if ("base64" === t && "string" === n)
                for (e = M(e); e.length % 4 !== 0;) e += "=";
            var i;
            if ("number" === n) i = N(e);
            else if ("string" === n) i = a.byteLength(e, t);
            else {
                if ("object" !== n) throw new Error("First argument needs to be a number, array or string.");
                i = N(e.length)
            }
            var o;
            a._useTypedArrays ? o = T(new Uint8Array(i)) : (o = this, o.length = i, o._isBuffer = !0);
            var s;
            if (a._useTypedArrays && "function" == typeof Uint8Array && e instanceof Uint8Array) o._set(e);
            else if (R(e))
                for (s = 0; i > s; s++) a.isBuffer(e) ? o[s] = e.readUInt8(s) : o[s] = e[s];
            else if ("string" === n) o.write(e, 0, t);
            else if ("number" === n && !a._useTypedArrays && !r)
                for (s = 0; i > s; s++) o[s] = 0;
            return o
        }

        function o(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n), n > i && (n = i)) : n = i;
            var o = t.length;
            V(o % 2 === 0, "Invalid hex string"), n > o / 2 && (n = o / 2);
            for (var s = 0; n > s; s++) {
                var u = parseInt(t.substr(2 * s, 2), 16);
                V(!isNaN(u), "Invalid hex string"), e[r + s] = u
            }
            return a._charsWritten = 2 * s, s
        }

        function s(e, t, r, n) {
            var i = a._charsWritten = P(F(t), e, r, n);
            return i
        }

        function u(e, t, r, n) {
            var i = a._charsWritten = P(O(t), e, r, n);
            return i
        }

        function f(e, t, r, n) {
            return u(e, t, r, n)
        }

        function l(e, t, r, n) {
            var i = a._charsWritten = P(W(t), e, r, n);
            return i
        }

        function h(e, t, r, n) {
            var i = a._charsWritten = P(z(t), e, r, n);
            return i
        }

        function c(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
        }

        function d(e, t, r) {
            var n = "",
                i = "";
            r = Math.min(e.length, r);
            for (var a = t; r > a; a++) e[a] <= 127 ? (n += q(i) + String.fromCharCode(e[a]), i = "") : i += "%" + e[a].toString(16);
            return n + q(i)
        }

        function p(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; r > i; i++) n += String.fromCharCode(e[i]);
            return n
        }

        function v(e, t, r) {
            return p(e, t, r)
        }

        function g(e, t, r) {
            var n = e.length;
            (!t || 0 > t) && (t = 0), (!r || 0 > r || r > n) && (r = n);
            for (var i = "", a = t; r > a; a++) i += D(e[a]);
            return i
        }

        function y(e, t, r) {
            for (var n = e.slice(t, r), i = "", a = 0; a < n.length; a += 2) i += String.fromCharCode(n[a] + 256 * n[a + 1]);
            return i
        }

        function m(e, t, r, n) {
            n || (V("boolean" == typeof r, "missing or invalid endian"), V(void 0 !== t && null !== t, "missing offset"), V(t + 1 < e.length, "Trying to read beyond buffer length"));
            var i = e.length;
            if (!(t >= i)) {
                var a;
                return r ? (a = e[t], i > t + 1 && (a |= e[t + 1] << 8)) : (a = e[t] << 8, i > t + 1 && (a |= e[t + 1])), a
            }
        }

        function b(e, t, r, n) {
            n || (V("boolean" == typeof r, "missing or invalid endian"), V(void 0 !== t && null !== t, "missing offset"), V(t + 3 < e.length, "Trying to read beyond buffer length"));
            var i = e.length;
            if (!(t >= i)) {
                var a;
                return r ? (i > t + 2 && (a = e[t + 2] << 16), i > t + 1 && (a |= e[t + 1] << 8), a |= e[t], i > t + 3 && (a += e[t + 3] << 24 >>> 0)) : (i > t + 1 && (a = e[t + 1] << 16), i > t + 2 && (a |= e[t + 2] << 8), i > t + 3 && (a |= e[t + 3]), a += e[t] << 24 >>> 0), a
            }
        }

        function w(e, t, r, n) {
            n || (V("boolean" == typeof r, "missing or invalid endian"), V(void 0 !== t && null !== t, "missing offset"), V(t + 1 < e.length, "Trying to read beyond buffer length"));
            var i = e.length;
            if (!(t >= i)) {
                var a = m(e, t, r, !0),
                    o = 32768 & a;
                return o ? -1 * (65535 - a + 1) : a
            }
        }

        function _(e, t, r, n) {
            n || (V("boolean" == typeof r, "missing or invalid endian"), V(void 0 !== t && null !== t, "missing offset"), V(t + 3 < e.length, "Trying to read beyond buffer length"));
            var i = e.length;
            if (!(t >= i)) {
                var a = b(e, t, r, !0),
                    o = 2147483648 & a;
                return o ? -1 * (4294967295 - a + 1) : a
            }
        }

        function k(e, t, r, n) {
            return n || (V("boolean" == typeof r, "missing or invalid endian"), V(t + 3 < e.length, "Trying to read beyond buffer length")), i.read(e, t, r, 23, 4)
        }

        function L(e, t, r, n) {
            return n || (V("boolean" == typeof r, "missing or invalid endian"), V(t + 7 < e.length, "Trying to read beyond buffer length")), i.read(e, t, r, 52, 8)
        }

        function E(e, t, r, n, i) {
            i || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 1 < e.length, "trying to write beyond buffer length"), H(t, 65535));
            var a = e.length;
            if (!(r >= a))
                for (var o = 0, s = Math.min(a - r, 2); s > o; o++) e[r + o] = (t & 255 << 8 * (n ? o : 1 - o)) >>> 8 * (n ? o : 1 - o)
        }

        function A(e, t, r, n, i) {
            i || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 3 < e.length, "trying to write beyond buffer length"), H(t, 4294967295));
            var a = e.length;
            if (!(r >= a))
                for (var o = 0, s = Math.min(a - r, 4); s > o; o++) e[r + o] = t >>> 8 * (n ? o : 3 - o) & 255
        }

        function S(e, t, r, n, i) {
            i || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 1 < e.length, "Trying to write beyond buffer length"), J(t, 32767, -32768));
            var a = e.length;
            r >= a || (t >= 0 ? E(e, t, r, n, i) : E(e, 65535 + t + 1, r, n, i))
        }

        function x(e, t, r, n, i) {
            i || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 3 < e.length, "Trying to write beyond buffer length"), J(t, 2147483647, -2147483648));
            var a = e.length;
            r >= a || (t >= 0 ? A(e, t, r, n, i) : A(e, 4294967295 + t + 1, r, n, i))
        }

        function I(e, t, r, n, a) {
            a || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 3 < e.length, "Trying to write beyond buffer length"), K(t, 3.4028234663852886e38, -3.4028234663852886e38));
            var o = e.length;
            r >= o || i.write(e, t, r, n, 23, 4)
        }

        function j(e, t, r, n, a) {
            a || (V(void 0 !== t && null !== t, "missing value"), V("boolean" == typeof n, "missing or invalid endian"), V(void 0 !== r && null !== r, "missing offset"), V(r + 7 < e.length, "Trying to write beyond buffer length"), K(t, 1.7976931348623157e308, -1.7976931348623157e308));
            var o = e.length;
            r >= o || i.write(e, t, r, n, 52, 8)
        }

        function M(e) {
            return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
        }

        function T(e) {
            return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = B.get, e.set = B.set, e.write = B.write, e.toString = B.toString, e.toLocaleString = B.toString, e.toJSON = B.toJSON, e.copy = B.copy, e.slice = B.slice, e.readUInt8 = B.readUInt8, e.readUInt16LE = B.readUInt16LE, e.readUInt16BE = B.readUInt16BE, e.readUInt32LE = B.readUInt32LE, e.readUInt32BE = B.readUInt32BE, e.readInt8 = B.readInt8, e.readInt16LE = B.readInt16LE, e.readInt16BE = B.readInt16BE, e.readInt32LE = B.readInt32LE, e.readInt32BE = B.readInt32BE, e.readFloatLE = B.readFloatLE, e.readFloatBE = B.readFloatBE, e.readDoubleLE = B.readDoubleLE, e.readDoubleBE = B.readDoubleBE, e.writeUInt8 = B.writeUInt8, e.writeUInt16LE = B.writeUInt16LE, e.writeUInt16BE = B.writeUInt16BE, e.writeUInt32LE = B.writeUInt32LE, e.writeUInt32BE = B.writeUInt32BE, e.writeInt8 = B.writeInt8, e.writeInt16LE = B.writeInt16LE, e.writeInt16BE = B.writeInt16BE, e.writeInt32LE = B.writeInt32LE, e.writeInt32BE = B.writeInt32BE, e.writeFloatLE = B.writeFloatLE, e.writeFloatBE = B.writeFloatBE, e.writeDoubleLE = B.writeDoubleLE, e.writeDoubleBE = B.writeDoubleBE, e.fill = B.fill, e.inspect = B.inspect, e.toArrayBuffer = B.toArrayBuffer, e
        }

        function C(e, t, r) {
            return "number" != typeof e ? r : (e = ~~e, e >= t ? t : e >= 0 ? e : (e += t, e >= 0 ? e : 0))
        }

        function N(e) {
            return e = ~~Math.ceil(+e), 0 > e ? 0 : e
        }

        function U(e) {
            return (Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            })(e)
        }

        function R(e) {
            return U(e) || a.isBuffer(e) || e && "object" == typeof e && "number" == typeof e.length
        }

        function D(e) {
            return 16 > e ? "0" + e.toString(16) : e.toString(16)
        }

        function F(e) {
            for (var t = [], r = 0; r < e.length; r++) {
                var n = e.charCodeAt(r);
                if (127 >= n) t.push(e.charCodeAt(r));
                else {
                    var i = r;
                    n >= 55296 && 57343 >= n && r++;
                    for (var a = encodeURIComponent(e.slice(i, r + 1)).substr(1).split("%"), o = 0; o < a.length; o++) t.push(parseInt(a[o], 16))
                }
            }
            return t
        }

        function O(e) {
            for (var t = [], r = 0; r < e.length; r++) t.push(255 & e.charCodeAt(r));
            return t
        }

        function z(e) {
            for (var t, r, n, i = [], a = 0; a < e.length; a++) t = e.charCodeAt(a), r = t >> 8, n = t % 256, i.push(n), i.push(r);
            return i
        }

        function W(e) {
            return n.toByteArray(e)
        }

        function P(e, t, r, n) {
            for (var a = 0; n > a && !(a + r >= t.length || a >= e.length); a++) t[a + r] = e[a];
            return a
        }

        function q(e) {
            try {
                return decodeURIComponent(e)
            } catch (t) {
                return String.fromCharCode(65533)
            }
        }

        function H(e, t) {
            V("number" == typeof e, "cannot write a non-number as a number"), V(e >= 0, "specified a negative value for writing an unsigned value"), V(t >= e, "value is larger than maximum value for type"), V(Math.floor(e) === e, "value has a fractional component")
        }

        function J(e, t, r) {
            V("number" == typeof e, "cannot write a non-number as a number"), V(t >= e, "value larger than maximum allowed value"), V(e >= r, "value smaller than minimum allowed value"), V(Math.floor(e) === e, "value has a fractional component")
        }

        function K(e, t, r) {
            V("number" == typeof e, "cannot write a non-number as a number"), V(t >= e, "value larger than maximum allowed value"), V(e >= r, "value smaller than minimum allowed value")
        }

        function V(e, t) {
            if (!e) throw new Error(t || "Failed assertion")
        }
        var n = e("base64-js"),
            i = e("ieee754");
        r.Buffer = a, r.SlowBuffer = a, r.INSPECT_MAX_BYTES = 50, a.poolSize = 8192, a._useTypedArrays = function () {
            if ("function" != typeof Uint8Array || "function" != typeof ArrayBuffer) return !1;
            try {
                var e = new Uint8Array(0);
                return e.foo = function () {
                    return 42
                }, 42 === e.foo() && "function" == typeof e.subarray
            } catch (t) {
                return !1
            }
        }(), a.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "raw":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                return !0;
            default:
                return !1
            }
        }, a.isBuffer = function (e) {
            return !(null === e || void 0 === e || !e._isBuffer)
        }, a.byteLength = function (e, t) {
            var r;
            switch (e += "", t || "utf8") {
            case "hex":
                r = e.length / 2;
                break;
            case "utf8":
            case "utf-8":
                r = F(e).length;
                break;
            case "ascii":
            case "binary":
            case "raw":
                r = e.length;
                break;
            case "base64":
                r = W(e).length;
                break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                r = 2 * e.length;
                break;
            default:
                throw new Error("Unknown encoding")
            }
            return r
        }, a.concat = function (e, t) {
            if (V(U(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new a(0);
            if (1 === e.length) return e[0];
            var r;
            if ("number" != typeof t)
                for (t = 0, r = 0; r < e.length; r++) t += e[r].length;
            var n = new a(t),
                i = 0;
            for (r = 0; r < e.length; r++) {
                var o = e[r];
                o.copy(n, i), i += o.length
            }
            return n
        }, a.prototype.write = function (e, t, r, n) {
            if (isFinite(t)) isFinite(r) || (n = r, r = void 0);
            else {
                var i = n;
                n = t, t = r, r = i
            }
            t = Number(t) || 0;
            var a = this.length - t;
            r ? (r = Number(r), r > a && (r = a)) : r = a, n = String(n || "utf8").toLowerCase();
            var c;
            switch (n) {
            case "hex":
                c = o(this, e, t, r);
                break;
            case "utf8":
            case "utf-8":
                c = s(this, e, t, r);
                break;
            case "ascii":
                c = u(this, e, t, r);
                break;
            case "binary":
                c = f(this, e, t, r);
                break;
            case "base64":
                c = l(this, e, t, r);
                break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                c = h(this, e, t, r);
                break;
            default:
                throw new Error("Unknown encoding")
            }
            return c
        }, a.prototype.toString = function (e, t, r) {
            var n = this;
            if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, r = void 0 !== r ? Number(r) : r = n.length, r === t) return "";
            var i;
            switch (e) {
            case "hex":
                i = g(n, t, r);
                break;
            case "utf8":
            case "utf-8":
                i = d(n, t, r);
                break;
            case "ascii":
                i = p(n, t, r);
                break;
            case "binary":
                i = v(n, t, r);
                break;
            case "base64":
                i = c(n, t, r);
                break;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
                i = y(n, t, r);
                break;
            default:
                throw new Error("Unknown encoding")
            }
            return i
        }, a.prototype.toJSON = function () {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        }, a.prototype.copy = function (e, t, r, n) {
            var i = this;
            if (r || (r = 0), n || 0 === n || (n = this.length), t || (t = 0), n !== r && 0 !== e.length && 0 !== i.length) {
                V(n >= r, "sourceEnd < sourceStart"), V(t >= 0 && t < e.length, "targetStart out of bounds"), V(r >= 0 && r < i.length, "sourceStart out of bounds"), V(n >= 0 && n <= i.length, "sourceEnd out of bounds"), n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                for (var a = 0; n - r > a; a++) e[a + t] = this[a + r]
            }
        }, a.prototype.slice = function (e, t) {
            var r = this.length;
            if (e = C(e, r, 0), t = C(t, r, r), a._useTypedArrays) return T(this.subarray(e, t));
            for (var n = t - e, i = new a(n, void 0, !0), o = 0; n > o; o++) i[o] = this[o + e];
            return i
        }, a.prototype.get = function (e) {
            return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
        }, a.prototype.set = function (e, t) {
            return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
        }, a.prototype.readUInt8 = function (e, t) {
            return t || (V(void 0 !== e && null !== e, "missing offset"), V(e < this.length, "Trying to read beyond buffer length")), e >= this.length ? void 0 : this[e]
        }, a.prototype.readUInt16LE = function (e, t) {
            return m(this, e, !0, t)
        }, a.prototype.readUInt16BE = function (e, t) {
            return m(this, e, !1, t)
        }, a.prototype.readUInt32LE = function (e, t) {
            return b(this, e, !0, t)
        }, a.prototype.readUInt32BE = function (e, t) {
            return b(this, e, !1, t)
        }, a.prototype.readInt8 = function (e, t) {
            if (t || (V(void 0 !== e && null !== e, "missing offset"), V(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) {
                var r = 128 & this[e];
                return r ? -1 * (255 - this[e] + 1) : this[e]
            }
        }, a.prototype.readInt16LE = function (e, t) {
            return w(this, e, !0, t)
        }, a.prototype.readInt16BE = function (e, t) {
            return w(this, e, !1, t)
        }, a.prototype.readInt32LE = function (e, t) {
            return _(this, e, !0, t)
        }, a.prototype.readInt32BE = function (e, t) {
            return _(this, e, !1, t)
        }, a.prototype.readFloatLE = function (e, t) {
            return k(this, e, !0, t)
        }, a.prototype.readFloatBE = function (e, t) {
            return k(this, e, !1, t)
        }, a.prototype.readDoubleLE = function (e, t) {
            return L(this, e, !0, t)
        }, a.prototype.readDoubleBE = function (e, t) {
            return L(this, e, !1, t)
        }, a.prototype.writeUInt8 = function (e, t, r) {
            r || (V(void 0 !== e && null !== e, "missing value"), V(void 0 !== t && null !== t, "missing offset"), V(t < this.length, "trying to write beyond buffer length"), H(e, 255)), t >= this.length || (this[t] = e)
        }, a.prototype.writeUInt16LE = function (e, t, r) {
            E(this, e, t, !0, r)
        }, a.prototype.writeUInt16BE = function (e, t, r) {
            E(this, e, t, !1, r)
        }, a.prototype.writeUInt32LE = function (e, t, r) {
            A(this, e, t, !0, r)
        }, a.prototype.writeUInt32BE = function (e, t, r) {
            A(this, e, t, !1, r)
        }, a.prototype.writeInt8 = function (e, t, r) {
            r || (V(void 0 !== e && null !== e, "missing value"), V(void 0 !== t && null !== t, "missing offset"), V(t < this.length, "Trying to write beyond buffer length"), J(e, 127, -128)), t >= this.length || (e >= 0 ? this.writeUInt8(e, t, r) : this.writeUInt8(255 + e + 1, t, r))
        }, a.prototype.writeInt16LE = function (e, t, r) {
            S(this, e, t, !0, r)
        }, a.prototype.writeInt16BE = function (e, t, r) {
            S(this, e, t, !1, r)
        }, a.prototype.writeInt32LE = function (e, t, r) {
            x(this, e, t, !0, r)
        }, a.prototype.writeInt32BE = function (e, t, r) {
            x(this, e, t, !1, r)
        }, a.prototype.writeFloatLE = function (e, t, r) {
            I(this, e, t, !0, r)
        }, a.prototype.writeFloatBE = function (e, t, r) {
            I(this, e, t, !1, r)
        }, a.prototype.writeDoubleLE = function (e, t, r) {
            j(this, e, t, !0, r)
        }, a.prototype.writeDoubleBE = function (e, t, r) {
            j(this, e, t, !1, r)
        }, a.prototype.fill = function (e, t, r) {
            if (e || (e = 0), t || (t = 0), r || (r = this.length), "string" == typeof e && (e = e.charCodeAt(0)), V("number" == typeof e && !isNaN(e), "value is not a number"), V(r >= t, "end < start"), r !== t && 0 !== this.length) {
                V(t >= 0 && t < this.length, "start out of bounds"), V(r >= 0 && r <= this.length, "end out of bounds");
                for (var n = t; r > n; n++) this[n] = e
            }
        }, a.prototype.inspect = function () {
            for (var e = [], t = this.length, n = 0; t > n; n++)
                if (e[n] = D(this[n]), n === r.INSPECT_MAX_BYTES) {
                    e[n + 1] = "...";
                    break
                }
            return "<Buffer " + e.join(" ") + ">"
        }, a.prototype.toArrayBuffer = function () {
            if ("function" == typeof Uint8Array) {
                if (a._useTypedArrays) return new a(this).buffer;
                for (var e = new Uint8Array(this.length), t = 0, r = e.length; r > t; t += 1) e[t] = this[t];
                return e.buffer
            }
            throw new Error("Buffer.toArrayBuffer not supported in this browser")
        };
        var B = a.prototype
    }, {
        "base64-js": 7,
        ieee754: 8
    }],
    7: [function (e, t, r) {
        var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        ! function (e) {
            "use strict";

            function l(e) {
                var t = e.charCodeAt(0);
                return t === a ? 62 : t === o ? 63 : s > t ? -1 : s + 10 > t ? t - s + 26 + 26 : f + 26 > t ? t - f : u + 26 > t ? t - u + 26 : void 0
            }

            function h(e) {
                function h(e) {
                    s[f++] = e
                }
                var t, n, i, a, o, s;
                if (e.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var u = e.length;
                o = "=" === e.charAt(u - 2) ? 2 : "=" === e.charAt(u - 1) ? 1 : 0, s = new r(3 * e.length / 4 - o), i = o > 0 ? e.length - 4 : e.length;
                var f = 0;
                for (t = 0, n = 0; i > t; t += 4, n += 3) a = l(e.charAt(t)) << 18 | l(e.charAt(t + 1)) << 12 | l(e.charAt(t + 2)) << 6 | l(e.charAt(t + 3)), h((16711680 & a) >> 16), h((65280 & a) >> 8), h(255 & a);
                return 2 === o ? (a = l(e.charAt(t)) << 2 | l(e.charAt(t + 1)) >> 4, h(255 & a)) : 1 === o && (a = l(e.charAt(t)) << 10 | l(e.charAt(t + 1)) << 4 | l(e.charAt(t + 2)) >> 2, h(a >> 8 & 255), h(255 & a)), s
            }

            function c(e) {
                function s(e) {
                    return n.charAt(e)
                }

                function u(e) {
                    return s(e >> 18 & 63) + s(e >> 12 & 63) + s(e >> 6 & 63) + s(63 & e)
                }
                var t, a, o, r = e.length % 3,
                    i = "";
                for (t = 0, o = e.length - r; o > t; t += 3) a = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2], i += u(a);
                switch (r) {
                case 1:
                    a = e[e.length - 1], i += s(a >> 2), i += s(a << 4 & 63), i += "==";
                    break;
                case 2:
                    a = (e[e.length - 2] << 8) + e[e.length - 1], i += s(a >> 10), i += s(a >> 4 & 63), i += s(a << 2 & 63), i += "="
                }
                return i
            }
            var r = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                a = ("0".charCodeAt(0), "+".charCodeAt(0)),
                o = "/".charCodeAt(0),
                s = "0".charCodeAt(0),
                u = "a".charCodeAt(0),
                f = "A".charCodeAt(0);
            t.exports.toByteArray = h, t.exports.fromByteArray = c
        }()
    }, {}],
    8: [function (e, t, r) {
        r.read = function (e, t, r, n, i) {
            var a, o, s = 8 * i - n - 1,
                u = (1 << s) - 1,
                f = u >> 1,
                l = -7,
                h = r ? i - 1 : 0,
                c = r ? -1 : 1,
                d = e[t + h];
            for (h += c, a = d & (1 << -l) - 1, d >>= -l, l += s; l > 0; a = 256 * a + e[t + h], h += c, l -= 8);
            for (o = a & (1 << -l) - 1, a >>= -l, l += n; l > 0; o = 256 * o + e[t + h], h += c, l -= 8);
            if (0 === a) a = 1 - f;
            else {
                if (a === u) return o ? NaN : (d ? -1 : 1) * (1 / 0);
                o += Math.pow(2, n), a -= f
            }
            return (d ? -1 : 1) * o * Math.pow(2, a - n)
        }, r.write = function (e, t, r, n, i, a) {
            var o, s, u, f = 8 * a - i - 1,
                l = (1 << f) - 1,
                h = l >> 1,
                c = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                d = n ? 0 : a - 1,
                p = n ? 1 : -1,
                v = 0 > t || 0 === t && 0 > 1 / t ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, o = l) : (o = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -o)) < 1 && (o--, u *= 2), t += o + h >= 1 ? c / u : c * Math.pow(2, 1 - h), t * u >= 2 && (o++, u /= 2), o + h >= l ? (s = 0, o = l) : o + h >= 1 ? (s = (t * u - 1) * Math.pow(2, i), o += h) : (s = t * Math.pow(2, h - 1) * Math.pow(2, i), o = 0)); i >= 8; e[r + d] = 255 & s, d += p, s /= 256, i -= 8);
            for (o = o << i | s, f += i; f > 0; e[r + d] = 255 & o, d += p, o /= 256, f -= 8);
            e[r + d - p] |= 128 * v
        }
    }, {}],
    9: [function (e, t, r) {
        function n() {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }

        function i(e) {
            return "function" == typeof e
        }

        function a(e) {
            return "number" == typeof e
        }

        function o(e) {
            return "object" == typeof e && null !== e
        }

        function s(e) {
            return void 0 === e
        }
        t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function (e) {
            if (!a(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e, this
        }, n.prototype.emit = function (e) {
            var t, r, n, a, u, f;
            if (this._events || (this._events = {}), "error" === e && (!this._events.error || o(this._events.error) && !this._events.error.length)) throw t = arguments[1], t instanceof Error ? t : TypeError('Uncaught, unspecified "error" event.');
            if (r = this._events[e], s(r)) return !1;
            if (i(r)) switch (arguments.length) {
                case 1:
                    r.call(this);
                    break;
                case 2:
                    r.call(this, arguments[1]);
                    break;
                case 3:
                    r.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    for (n = arguments.length, a = new Array(n - 1), u = 1; n > u; u++) a[u - 1] = arguments[u];
                    r.apply(this, a)
                } else if (o(r)) {
                    for (n = arguments.length, a = new Array(n - 1), u = 1; n > u; u++) a[u - 1] = arguments[u];
                    for (f = r.slice(), n = f.length, u = 0; n > u; u++) f[u].apply(this, a)
                }
            return !0
        }, n.prototype.addListener = function (e, t) {
            var r;
            if (!i(t)) throw TypeError("listener must be a function");
            if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t), this._events[e] ? o(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, o(this._events[e]) && !this._events[e].warned) {
                var r;
                r = s(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners, r && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), console.trace())
            }
            return this
        }, n.prototype.on = n.prototype.addListener, n.prototype.once = function (e, t) {
            function n() {
                this.removeListener(e, n), r || (r = !0, t.apply(this, arguments))
            }
            if (!i(t)) throw TypeError("listener must be a function");
            var r = !1;
            return n.listener = t, this.on(e, n), this
        }, n.prototype.removeListener = function (e, t) {
            var r, n, a, s;
            if (!i(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (r = this._events[e], a = r.length, n = -1, r === t || i(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
            else if (o(r)) {
                for (s = a; s-- > 0;)
                    if (r[s] === t || r[s].listener && r[s].listener === t) {
                        n = s;
                        break
                    }
                if (0 > n) return this;
                1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(n, 1), this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }, n.prototype.removeAllListeners = function (e) {
            var t, r;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
            if (0 === arguments.length) {
                for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (r = this._events[e], i(r)) this.removeListener(e, r);
            else
                for (; r.length;) this.removeListener(e, r[r.length - 1]);
            return delete this._events[e], this
        }, n.prototype.listeners = function (e) {
            var t;
            return t = this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }, n.listenerCount = function (e, t) {
            var r;
            return r = e._events && e._events[t] ? i(e._events[t]) ? 1 : e._events[t].length : 0
        }
    }, {}],
    10: [function (e, t, r) {
        var n = t.exports = {};
        n.nextTick = function () {
            var e = "undefined" != typeof window && window.setImmediate,
                t = "undefined" != typeof window && window.postMessage && window.addEventListener;
            if (e) return function (e) {
                return window.setImmediate(e)
            };
            if (t) {
                var r = [];
                return window.addEventListener("message", function (e) {
                        var t = e.source;
                        if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), r.length > 0)) {
                            var n = r.shift();
                            n()
                        }
                    }, !0),
                    function (e) {
                        r.push(e), window.postMessage("process-tick", "*")
                    }
            }
            return function (e) {
                setTimeout(e, 0)
            }
        }(), n.title = "browser", n.browser = !0, n.env = {}, n.argv = [], n.binding = function (e) {
            throw new Error("process.binding is not supported")
        }, n.cwd = function () {
            return "/"
        }, n.chdir = function (e) {
            throw new Error("process.chdir is not supported")
        }
    }, {}],
    11: [function (e, t, r) {
        function s(e) {
            return this instanceof s ? (a.call(this, e), o.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), void this.once("end", u)) : new s(e)
        }

        function u() {
            if (!this.allowHalfOpen && !this._writableState.ended) {
                var e = this;
                i(function () {
                    e.end()
                })
            }
        }
        t.exports = s;
        var n = e("inherits"),
            i = e("process/browser.js").nextTick,
            a = e("./readable.js"),
            o = e("./writable.js");
        n(s, a), s.prototype.write = o.prototype.write, s.prototype.end = o.prototype.end, s.prototype._write = o.prototype._write
    }, {
        "./readable.js": 15,
        "./writable.js": 17,
        inherits: 19,
        "process/browser.js": 13
    }],
    12: [function (e, t, r) {
        function a() {
            n.call(this)
        }
        t.exports = a;
        var n = e("events").EventEmitter,
            i = e("inherits");
        i(a, n), a.Readable = e("./readable.js"),
            a.Writable = e("./writable.js"), a.Duplex = e("./duplex.js"), a.Transform = e("./transform.js"), a.PassThrough = e("./passthrough.js"), a.Stream = a, a.prototype.pipe = function (e, t) {
                function i(t) {
                    e.writable && !1 === e.write(t) && r.pause && r.pause()
                }

                function a() {
                    r.readable && r.resume && r.resume()
                }

                function s() {
                    o || (o = !0, e.end())
                }

                function u() {
                    o || (o = !0, "function" == typeof e.destroy && e.destroy())
                }

                function f(e) {
                    if (l(), 0 === n.listenerCount(this, "error")) throw e
                }

                function l() {
                    r.removeListener("data", i), e.removeListener("drain", a), r.removeListener("end", s), r.removeListener("close", u), r.removeListener("error", f), e.removeListener("error", f), r.removeListener("end", l), r.removeListener("close", l), e.removeListener("close", l)
                }
                var r = this;
                r.on("data", i), e.on("drain", a), e._isStdio || t && t.end === !1 || (r.on("end", s), r.on("close", u));
                var o = !1;
                return r.on("error", f), e.on("error", f), r.on("end", l), r.on("close", l), e.on("close", l), e.emit("pipe", r), e
            }
    }, {
        "./duplex.js": 11,
        "./passthrough.js": 14,
        "./readable.js": 15,
        "./transform.js": 16,
        "./writable.js": 17,
        events: 9,
        inherits: 19
    }],
    13: [function (e, t, r) {
        t.exports = e(10)
    }, {}],
    14: [function (e, t, r) {
        function a(e) {
            return this instanceof a ? void n.call(this, e) : new a(e)
        }
        t.exports = a;
        var n = e("./transform.js"),
            i = e("inherits");
        i(a, n), a.prototype._transform = function (e, t, r) {
            r(null, e)
        }
    }, {
        "./transform.js": 16,
        inherits: 19
    }],
    15: [function (e, t, r) {
        (function (r) {
            function f(t, r) {
                t = t || {};
                var n = t.highWaterMark;
                this.highWaterMark = n || 0 === n ? n : 16384, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = !1, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.calledRead = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (s || (s = e("string_decoder").StringDecoder), this.decoder = new s(t.encoding), this.encoding = t.encoding)
            }

            function l(e) {
                return this instanceof l ? (this._readableState = new f(e, this), this.readable = !0, void i.call(this)) : new l(e)
            }

            function h(e, t, r, n, i) {
                var a = g(t, r);
                if (a) e.emit("error", a);
                else if (null === r || void 0 === r) t.reading = !1, t.ended || y(e, t);
                else if (t.objectMode || r && r.length > 0)
                    if (t.ended && !i) {
                        var o = new Error("stream.push() after EOF");
                        e.emit("error", o)
                    } else if (t.endEmitted && i) {
                    var o = new Error("stream.unshift() after end event");
                    e.emit("error", o)
                } else !t.decoder || i || n || (r = t.decoder.write(r)), t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : (t.reading = !1, t.buffer.push(r)), t.needReadable && m(e), w(e, t);
                else i || (t.reading = !1);
                return c(t)
            }

            function c(e) {
                return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
            }

            function p(e) {
                if (e >= d) e = d;
                else {
                    e--;
                    for (var t = 1; 32 > t; t <<= 1) e |= e >> t;
                    e++
                }
                return e
            }

            function v(e, t) {
                return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || null === e ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : 0 >= e ? 0 : (e > t.highWaterMark && (t.highWaterMark = p(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
            }

            function g(e, t) {
                var r = null;
                return a.isBuffer(t) || "string" == typeof t || null === t || void 0 === t || e.objectMode || r || (r = new TypeError("Invalid non-string/buffer chunk")), r
            }

            function y(e, t) {
                if (t.decoder && !t.ended) {
                    var r = t.decoder.end();
                    r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
                }
                t.ended = !0, t.length > 0 ? m(e) : x(e)
            }

            function m(e) {
                var t = e._readableState;
                t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, t.sync ? o(function () {
                    b(e)
                }) : b(e))
            }

            function b(e) {
                e.emit("readable")
            }

            function w(e, t) {
                t.readingMore || (t.readingMore = !0, o(function () {
                    _(e, t)
                }))
            }

            function _(e, t) {
                for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (e.read(0), r !== t.length);) r = t.length;
                t.readingMore = !1
            }

            function k(e) {
                return function () {
                    var r = e._readableState;
                    r.awaitDrain--, 0 === r.awaitDrain && L(e)
                }
            }

            function L(e) {
                function i(e, n, i) {
                    var a = e.write(r);
                    !1 === a && t.awaitDrain++
                }
                var r, t = e._readableState;
                for (t.awaitDrain = 0; t.pipesCount && null !== (r = e.read());)
                    if (1 === t.pipesCount ? i(t.pipes, 0, null) : I(t.pipes, i), e.emit("data", r), t.awaitDrain > 0) return;
                return 0 === t.pipesCount ? (t.flowing = !1, void(n.listenerCount(e, "data") > 0 && A(e))) : void(t.ranOut = !0)
            }

            function E() {
                this._readableState.ranOut && (this._readableState.ranOut = !1, L(this))
            }

            function A(e, t) {
                var r = e._readableState;
                if (r.flowing) throw new Error("Cannot switch to old mode now.");
                var n = t || !1,
                    a = !1;
                e.readable = !0, e.pipe = i.prototype.pipe, e.on = e.addListener = i.prototype.on, e.on("readable", function () {
                    a = !0;
                    for (var t; !n && null !== (t = e.read());) e.emit("data", t);
                    null === t && (a = !1, e._readableState.needReadable = !0)
                }), e.pause = function () {
                    n = !0, this.emit("pause")
                }, e.resume = function () {
                    n = !1, a ? o(function () {
                        e.emit("readable")
                    }) : this.read(0), this.emit("resume")
                }, e.emit("readable")
            }

            function S(e, t) {
                var s, r = t.buffer,
                    n = t.length,
                    i = !!t.decoder,
                    o = !!t.objectMode;
                if (0 === r.length) return null;
                if (0 === n) s = null;
                else if (o) s = r.shift();
                else if (!e || e >= n) s = i ? r.join("") : a.concat(r, n), r.length = 0;
                else if (e < r[0].length) {
                    var u = r[0];
                    s = u.slice(0, e), r[0] = u.slice(e)
                } else if (e === r[0].length) s = r.shift();
                else {
                    s = i ? "" : new a(e);
                    for (var f = 0, l = 0, h = r.length; h > l && e > f; l++) {
                        var u = r[0],
                            c = Math.min(e - f, u.length);
                        i ? s += u.slice(0, c) : u.copy(s, f, 0, c), c < u.length ? r[0] = u.slice(c) : r.shift(), f += c
                    }
                }
                return s
            }

            function x(e) {
                var t = e._readableState;
                if (t.length > 0) throw new Error("endReadable called on non-empty stream");
                !t.endEmitted && t.calledRead && (t.ended = !0, o(function () {
                    t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
                }))
            }

            function I(e, t) {
                for (var r = 0, n = e.length; n > r; r++) t(e[r], r)
            }

            function j(e, t) {
                for (var r = 0, n = e.length; n > r; r++)
                    if (e[r] === t) return r;
                return -1
            }
            t.exports = l, l.ReadableState = f;
            var s, n = e("events").EventEmitter,
                i = e("./index.js"),
                a = e("buffer").Buffer,
                o = e("process/browser.js").nextTick,
                u = e("inherits");
            u(l, i), l.prototype.push = function (e, t) {
                var r = this._readableState;
                return "string" != typeof e || r.objectMode || (t = t || r.defaultEncoding, t !== r.encoding && (e = new a(e, t), t = "")), h(this, r, e, t, !1)
            }, l.prototype.unshift = function (e) {
                var t = this._readableState;
                return h(this, t, e, "", !0)
            }, l.prototype.setEncoding = function (t) {
                s || (s = e("string_decoder").StringDecoder), this._readableState.decoder = new s(t), this._readableState.encoding = t
            };
            var d = 8388608;
            l.prototype.read = function (e) {
                var t = this._readableState;
                t.calledRead = !0;
                var r = e;
                if (("number" != typeof e || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return m(this), null;
                if (e = v(e, t), 0 === e && t.ended) return 0 === t.length && x(this), null;
                var n = t.needReadable;
                t.length - e <= t.highWaterMark && (n = !0), (t.ended || t.reading) && (n = !1), n && (t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), n && !t.reading && (e = v(r, t));
                var i;
                return i = e > 0 ? S(e, t) : null, null === i && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), t.ended && !t.endEmitted && 0 === t.length && x(this), i
            }, l.prototype._read = function (e) {
                this.emit("error", new Error("not implemented"))
            }, l.prototype.pipe = function (e, t) {
                function f(e) {
                    e === i && c()
                }

                function l() {
                    e.end()
                }

                function c() {
                    e.removeListener("close", v), e.removeListener("finish", g), e.removeListener("drain", h), e.removeListener("error", p), e.removeListener("unpipe", f), i.removeListener("end", l), i.removeListener("end", c), (!e._writableState || e._writableState.needDrain) && h()
                }

                function p(t) {
                    y(), 0 === d && 0 === n.listenerCount(e, "error") && e.emit("error", t)
                }

                function v() {
                    e.removeListener("finish", g), y()
                }

                function g() {
                    e.removeListener("close", v), y()
                }

                function y() {
                    i.unpipe(e)
                }
                var i = this,
                    a = this._readableState;
                switch (a.pipesCount) {
                case 0:
                    a.pipes = e;
                    break;
                case 1:
                    a.pipes = [a.pipes, e];
                    break;
                default:
                    a.pipes.push(e)
                }
                a.pipesCount += 1;
                var s = (!t || t.end !== !1) && e !== r.stdout && e !== r.stderr,
                    u = s ? l : c;
                a.endEmitted ? o(u) : i.once("end", u), e.on("unpipe", f);
                var h = k(i);
                e.on("drain", h);
                var d = n.listenerCount(e, "error");
                return e.once("error", p), e.once("close", v), e.once("finish", g), e.emit("pipe", i), a.flowing || (this.on("readable", E), a.flowing = !0, o(function () {
                    L(i)
                })), e
            }, l.prototype.unpipe = function (e) {
                var t = this._readableState;
                if (0 === t.pipesCount) return this;
                if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, this.removeListener("readable", E), t.flowing = !1, e && e.emit("unpipe", this), this);
                if (!e) {
                    var r = t.pipes,
                        n = t.pipesCount;
                    t.pipes = null, t.pipesCount = 0, this.removeListener("readable", E), t.flowing = !1;
                    for (var i = 0; n > i; i++) r[i].emit("unpipe", this);
                    return this
                }
                var i = j(t.pipes, e);
                return -1 === i ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
            }, l.prototype.on = function (e, t) {
                var r = i.prototype.on.call(this, e, t);
                if ("data" !== e || this._readableState.flowing || A(this), "readable" === e && this.readable) {
                    var n = this._readableState;
                    n.readableListening || (n.readableListening = !0, n.emittedReadable = !1, n.needReadable = !0, n.reading ? n.length && m(this, n) : this.read(0))
                }
                return r
            }, l.prototype.addListener = l.prototype.on, l.prototype.resume = function () {
                A(this), this.read(0), this.emit("resume")
            }, l.prototype.pause = function () {
                A(this, !0), this.emit("pause")
            }, l.prototype.wrap = function (e) {
                var t = this._readableState,
                    r = !1,
                    n = this;
                e.on("end", function () {
                    if (t.decoder && !t.ended) {
                        var e = t.decoder.end();
                        e && e.length && n.push(e)
                    }
                    n.push(null)
                }), e.on("data", function (i) {
                    if (t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
                        var a = n.push(i);
                        a || (r = !0, e.pause())
                    }
                });
                for (var i in e) "function" == typeof e[i] && "undefined" == typeof this[i] && (this[i] = function (t) {
                    return function () {
                        return e[t].apply(e, arguments)
                    }
                }(i));
                var a = ["error", "close", "destroy", "pause", "resume"];
                return I(a, function (t) {
                    e.on(t, function (e) {
                        return n.emit.apply(n, t, e)
                    })
                }), n._read = function (t) {
                    r && (r = !1, e.resume())
                }, n
            }, l._fromList = S
        }).call(this, e("/Users/harth/repos/brain/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
    }, {
        "./index.js": 12,
        "/Users/harth/repos/brain/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 10,
        buffer: 6,
        events: 9,
        inherits: 19,
        "process/browser.js": 13,
        string_decoder: 18
    }],
    16: [function (e, t, r) {
        function a(e, t) {
            this.afterTransform = function (e, r) {
                return o(t, e, r)
            }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
        }

        function o(e, t, r) {
            var n = e._transformState;
            n.transforming = !1;
            var i = n.writecb;
            if (!i) return e.emit("error", new Error("no writecb in Transform class"));
            n.writechunk = null, n.writecb = null, null !== r && void 0 !== r && e.push(r), i && i(t);
            var a = e._readableState;
            a.reading = !1, (a.needReadable || a.length < a.highWaterMark) && e._read(a.highWaterMark)
        }

        function s(e) {
            if (!(this instanceof s)) return new s(e);
            n.call(this, e);
            var r = (this._transformState = new a(e, this), this);
            this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("finish", function () {
                "function" == typeof this._flush ? this._flush(function (e) {
                    u(r, e)
                }) : u(r)
            })
        }

        function u(e, t) {
            if (t) return e.emit("error", t);
            var r = e._writableState,
                i = (e._readableState, e._transformState);
            if (r.length) throw new Error("calling transform done when ws.length != 0");
            if (i.transforming) throw new Error("calling transform done when still transforming");
            return e.push(null)
        }
        t.exports = s;
        var n = e("./duplex.js"),
            i = e("inherits");
        i(s, n), s.prototype.push = function (e, t) {
            return this._transformState.needTransform = !1, n.prototype.push.call(this, e, t)
        }, s.prototype._transform = function (e, t, r) {
            throw new Error("not implemented")
        }, s.prototype._write = function (e, t, r) {
            var n = this._transformState;
            if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
                var i = this._readableState;
                (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
            }
        }, s.prototype._read = function (e) {
            var t = this._transformState;
            t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
        }
    }, {
        "./duplex.js": 11,
        inherits: 19
    }],
    17: [function (e, t, r) {
        function f(e, t, r) {
            this.chunk = e, this.encoding = t, this.callback = r
        }

        function l(e, t) {
            e = e || {};
            var r = e.highWaterMark;
            this.highWaterMark = r || 0 === r ? r : 16384, this.objectMode = !!e.objectMode, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
            var n = e.decodeStrings === !1;
            this.decodeStrings = !n, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
                b(t, e)
            }, this.writecb = null, this.writelen = 0, this.buffer = []
        }

        function h(e) {
            return this instanceof h || this instanceof o.Duplex ? (this._writableState = new l(e, this), this.writable = !0, void o.call(this)) : new h(e)
        }

        function c(e, t, r) {
            var n = new Error("write after end");
            e.emit("error", n), s(function () {
                r(n)
            })
        }

        function d(e, t, r, n) {
            var i = !0;
            if (!u.isBuffer(r) && "string" != typeof r && null !== r && void 0 !== r && !t.objectMode) {
                var a = new TypeError("Invalid non-string/buffer chunk");
                e.emit("error", a), s(function () {
                    n(a)
                }), i = !1
            }
            return i
        }

        function p(e, t, r) {
            return e.objectMode || e.decodeStrings === !1 || "string" != typeof t || (t = new u(t, r)), t
        }

        function v(e, t, r, n, i) {
            r = p(t, r, n);
            var a = t.objectMode ? 1 : r.length;
            t.length += a;
            var o = t.length < t.highWaterMark;
            return t.needDrain = !o, t.writing ? t.buffer.push(new f(r, n, i)) : g(e, t, a, r, n, i), o
        }

        function g(e, t, r, n, i, a) {
            t.writelen = r, t.writecb = a, t.writing = !0, t.sync = !0, e._write(n, i, t.onwrite), t.sync = !1
        }

        function y(e, t, r, n, i) {
            r ? s(function () {
                i(n)
            }) : i(n), e.emit("error", n)
        }

        function m(e) {
            e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
        }

        function b(e, t) {
            var r = e._writableState,
                n = r.sync,
                i = r.writecb;
            if (m(r), t) y(e, r, n, t, i);
            else {
                var a = L(e, r);
                a || r.bufferProcessing || !r.buffer.length || k(e, r), n ? s(function () {
                    w(e, r, a, i)
                }) : w(e, r, a, i)
            }
        }

        function w(e, t, r, n) {
            r || _(e, t), n(), r && E(e, t)
        }

        function _(e, t) {
            0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
        }

        function k(e, t) {
            t.bufferProcessing = !0;
            for (var r = 0; r < t.buffer.length; r++) {
                var n = t.buffer[r],
                    i = n.chunk,
                    a = n.encoding,
                    o = n.callback,
                    s = t.objectMode ? 1 : i.length;
                if (g(e, t, s, i, a, o), t.writing) {
                    r++;
                    break
                }
            }
            t.bufferProcessing = !1, r < t.buffer.length ? t.buffer = t.buffer.slice(r) : t.buffer.length = 0
        }

        function L(e, t) {
            return t.ending && 0 === t.length && !t.finished && !t.writing
        }

        function E(e, t) {
            var r = L(e, t);
            return r && (t.finished = !0, e.emit("finish")), r
        }

        function A(e, t, r) {
            t.ending = !0, E(e, t), r && (t.finished ? s(r) : e.once("finish", r)), t.ended = !0
        }
        t.exports = h, h.WritableState = l;
        var n = "undefined" != typeof Uint8Array ? function (e) {
                return e instanceof Uint8Array
            } : function (e) {
                return e && e.constructor && "Uint8Array" === e.constructor.name
            },
            i = "undefined" != typeof ArrayBuffer ? function (e) {
                return e instanceof ArrayBuffer
            } : function (e) {
                return e && e.constructor && "ArrayBuffer" === e.constructor.name
            },
            a = e("inherits"),
            o = e("./index.js"),
            s = e("process/browser.js").nextTick,
            u = e("buffer").Buffer;
        a(h, o), h.prototype.pipe = function () {
            this.emit("error", new Error("Cannot pipe. Not readable."))
        }, h.prototype.write = function (e, t, r) {
            var a = this._writableState,
                o = !1;
            return "function" == typeof t && (r = t, t = null), !u.isBuffer(e) && n(e) && (e = new u(e)), i(e) && "undefined" != typeof Uint8Array && (e = new u(new Uint8Array(e))), u.isBuffer(e) ? t = "buffer" : t || (t = a.defaultEncoding), "function" != typeof r && (r = function () {}), a.ended ? c(this, a, r) : d(this, a, e, r) && (o = v(this, a, e, t, r)), o
        }, h.prototype._write = function (e, t, r) {
            r(new Error("not implemented"))
        }, h.prototype.end = function (e, t, r) {
            var n = this._writableState;
            "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), "undefined" != typeof e && null !== e && this.write(e, t), n.ending || n.finished || A(this, n, r)
        }
    }, {
        "./index.js": 12,
        buffer: 6,
        inherits: 19,
        "process/browser.js": 13
    }],
    18: [function (e, t, r) {
        function i(e) {
            if (e && !n.isEncoding(e)) throw new Error("Unknown encoding: " + e)
        }

        function o(e) {
            return e.toString(this.encoding)
        }

        function s(e) {
            var t = this.charReceived = e.length % 2;
            return this.charLength = t ? 2 : 0, t
        }

        function u(e) {
            var t = this.charReceived = e.length % 3;
            return this.charLength = t ? 3 : 0, t
        }
        var n = e("buffer").Buffer,
            a = r.StringDecoder = function (e) {
                switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), i(e), this.encoding) {
                case "utf8":
                    this.surrogateSize = 3;
                    break;
                case "ucs2":
                case "utf16le":
                    this.surrogateSize = 2, this.detectIncompleteChar = s;
                    break;
                case "base64":
                    this.surrogateSize = 3, this.detectIncompleteChar = u;
                    break;
                default:
                    return void(this.write = o)
                }
                this.charBuffer = new n(6), this.charReceived = 0, this.charLength = 0
            };
        a.prototype.write = function (e) {
            for (var t = "", r = 0; this.charLength;) {
                var n = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
                if (e.copy(this.charBuffer, this.charReceived, r, n), this.charReceived += n - r, r = n, this.charReceived < this.charLength) return "";
                t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                var i = t.charCodeAt(t.length - 1);
                if (!(i >= 55296 && 56319 >= i)) {
                    if (this.charReceived = this.charLength = 0, n == e.length) return t;
                    e = e.slice(n, e.length);
                    break
                }
                this.charLength += this.surrogateSize, t = ""
            }
            var a = this.detectIncompleteChar(e),
                o = e.length;
            this.charLength && (e.copy(this.charBuffer, 0, e.length - a, o), this.charReceived = a, o -= a), t += e.toString(this.encoding, 0, o);
            var o = t.length - 1,
                i = t.charCodeAt(o);
            if (i >= 55296 && 56319 >= i) {
                var s = this.surrogateSize;
                return this.charLength += s, this.charReceived += s, this.charBuffer.copy(this.charBuffer, s, 0, s), this.charBuffer.write(t.charAt(t.length - 1), this.encoding), t.substring(0, o)
            }
            return t
        }, a.prototype.detectIncompleteChar = function (e) {
            for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
                var r = e[e.length - t];
                if (1 == t && r >> 5 == 6) {
                    this.charLength = 2;
                    break
                }
                if (2 >= t && r >> 4 == 14) {
                    this.charLength = 3;
                    break
                }
                if (3 >= t && r >> 3 == 30) {
                    this.charLength = 4;
                    break
                }
            }
            return t
        }, a.prototype.end = function (e) {
            var t = "";
            if (e && e.length && (t = this.write(e)), this.charReceived) {
                var r = this.charReceived,
                    n = this.charBuffer,
                    i = this.encoding;
                t += n.slice(0, r).toString(i)
            }
            return t
        }
    }, {
        buffer: 6
    }],
    19: [function (e, t, r) {
        "function" == typeof Object.create ? t.exports = function (e, t) {
            e.super_ = t, e.prototype = Object.create(t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        } : t.exports = function (e, t) {
            e.super_ = t;
            var r = function () {};
            r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
        }
    }, {}],
    20: [function (e, t, r) {
        (function () {
            var e = this,
                n = e._,
                i = {},
                a = Array.prototype,
                o = Object.prototype,
                s = Function.prototype,
                u = a.push,
                f = a.slice,
                l = a.concat,
                h = o.toString,
                c = o.hasOwnProperty,
                d = a.forEach,
                p = a.map,
                v = a.reduce,
                g = a.reduceRight,
                y = a.filter,
                m = a.every,
                b = a.some,
                w = a.indexOf,
                _ = a.lastIndexOf,
                k = Array.isArray,
                L = Object.keys,
                E = s.bind,
                A = function (e) {
                    return e instanceof A ? e : this instanceof A ? void(this._wrapped = e) : new A(e)
                };
            "undefined" != typeof r ? ("undefined" != typeof t && t.exports && (r = t.exports = A), r._ = A) : e._ = A, A.VERSION = "1.6.0";
            var S = A.each = A.forEach = function (e, t, r) {
                if (null == e) return e;
                if (d && e.forEach === d) e.forEach(t, r);
                else if (e.length === +e.length) {
                    for (var n = 0, a = e.length; a > n; n++)
                        if (t.call(r, e[n], n, e) === i) return
                } else
                    for (var o = A.keys(e), n = 0, a = o.length; a > n; n++)
                        if (t.call(r, e[o[n]], o[n], e) === i) return; return e
            };
            A.map = A.collect = function (e, t, r) {
                var n = [];
                return null == e ? n : p && e.map === p ? e.map(t, r) : (S(e, function (e, i, a) {
                    n.push(t.call(r, e, i, a))
                }), n)
            };
            var x = "Reduce of empty array with no initial value";
            A.reduce = A.foldl = A.inject = function (e, t, r, n) {
                var i = arguments.length > 2;
                if (null == e && (e = []), v && e.reduce === v) return n && (t = A.bind(t, n)), i ? e.reduce(t, r) : e.reduce(t);
                if (S(e, function (e, a, o) {
                        i ? r = t.call(n, r, e, a, o) : (r = e, i = !0)
                    }), !i) throw new TypeError(x);
                return r
            }, A.reduceRight = A.foldr = function (e, t, r, n) {
                var i = arguments.length > 2;
                if (null == e && (e = []), g && e.reduceRight === g) return n && (t = A.bind(t, n)), i ? e.reduceRight(t, r) : e.reduceRight(t);
                var a = e.length;
                if (a !== +a) {
                    var o = A.keys(e);
                    a = o.length
                }
                if (S(e, function (s, u, f) {
                        u = o ? o[--a] : --a, i ? r = t.call(n, r, e[u], u, f) : (r = e[u], i = !0)
                    }), !i) throw new TypeError(x);
                return r
            }, A.find = A.detect = function (e, t, r) {
                var n;
                return I(e, function (e, i, a) {
                    return t.call(r, e, i, a) ? (n = e, !0) : void 0
                }), n
            }, A.filter = A.select = function (e, t, r) {
                var n = [];
                return null == e ? n : y && e.filter === y ? e.filter(t, r) : (S(e, function (e, i, a) {
                    t.call(r, e, i, a) && n.push(e)
                }), n)
            }, A.reject = function (e, t, r) {
                return A.filter(e, function (e, n, i) {
                    return !t.call(r, e, n, i)
                }, r)
            }, A.every = A.all = function (e, t, r) {
                t || (t = A.identity);
                var n = !0;
                return null == e ? n : m && e.every === m ? e.every(t, r) : (S(e, function (e, a, o) {
                    return (n = n && t.call(r, e, a, o)) ? void 0 : i
                }), !!n)
            };
            var I = A.some = A.any = function (e, t, r) {
                t || (t = A.identity);
                var n = !1;
                return null == e ? n : b && e.some === b ? e.some(t, r) : (S(e, function (e, a, o) {
                    return n || (n = t.call(r, e, a, o)) ? i : void 0
                }), !!n)
            };
            A.contains = A.include = function (e, t) {
                return null == e ? !1 : w && e.indexOf === w ? -1 != e.indexOf(t) : I(e, function (e) {
                    return e === t
                })
            }, A.invoke = function (e, t) {
                var r = f.call(arguments, 2),
                    n = A.isFunction(t);
                return A.map(e, function (e) {
                    return (n ? t : e[t]).apply(e, r)
                })
            }, A.pluck = function (e, t) {
                return A.map(e, A.property(t))
            }, A.where = function (e, t) {
                return A.filter(e, A.matches(t))
            }, A.findWhere = function (e, t) {
                return A.find(e, A.matches(t))
            }, A.max = function (e, t, r) {
                if (!t && A.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.max.apply(Math, e);
                var n = -(1 / 0),
                    i = -(1 / 0);
                return S(e, function (e, a, o) {
                    var s = t ? t.call(r, e, a, o) : e;
                    s > i && (n = e, i = s)
                }), n
            }, A.min = function (e, t, r) {
                if (!t && A.isArray(e) && e[0] === +e[0] && e.length < 65535) return Math.min.apply(Math, e);
                var n = 1 / 0,
                    i = 1 / 0;
                return S(e, function (e, a, o) {
                    var s = t ? t.call(r, e, a, o) : e;
                    i > s && (n = e, i = s)
                }), n
            }, A.shuffle = function (e) {
                var t, r = 0,
                    n = [];
                return S(e, function (e) {
                    t = A.random(r++), n[r - 1] = n[t], n[t] = e
                }), n
            }, A.sample = function (e, t, r) {
                return null == t || r ? (e.length !== +e.length && (e = A.values(e)), e[A.random(e.length - 1)]) : A.shuffle(e).slice(0, Math.max(0, t))
            };
            var j = function (e) {
                return null == e ? A.identity : A.isFunction(e) ? e : A.property(e)
            };
            A.sortBy = function (e, t, r) {
                return t = j(t), A.pluck(A.map(e, function (e, n, i) {
                    return {
                        value: e,
                        index: n,
                        criteria: t.call(r, e, n, i)
                    }
                }).sort(function (e, t) {
                    var r = e.criteria,
                        n = t.criteria;
                    if (r !== n) {
                        if (r > n || void 0 === r) return 1;
                        if (n > r || void 0 === n) return -1
                    }
                    return e.index - t.index
                }), "value")
            };
            var M = function (e) {
                return function (t, r, n) {
                    var i = {};
                    return r = j(r), S(t, function (a, o) {
                        var s = r.call(n, a, o, t);
                        e(i, s, a)
                    }), i
                }
            };
            A.groupBy = M(function (e, t, r) {
                A.has(e, t) ? e[t].push(r) : e[t] = [r]
            }), A.indexBy = M(function (e, t, r) {
                e[t] = r
            }), A.countBy = M(function (e, t) {
                A.has(e, t) ? e[t]++ : e[t] = 1
            }), A.sortedIndex = function (e, t, r, n) {
                r = j(r);
                for (var i = r.call(n, t), a = 0, o = e.length; o > a;) {
                    var s = a + o >>> 1;
                    r.call(n, e[s]) < i ? a = s + 1 : o = s
                }
                return a
            }, A.toArray = function (e) {
                return e ? A.isArray(e) ? f.call(e) : e.length === +e.length ? A.map(e, A.identity) : A.values(e) : []
            }, A.size = function (e) {
                return null == e ? 0 : e.length === +e.length ? e.length : A.keys(e).length
            }, A.first = A.head = A.take = function (e, t, r) {
                return null == e ? void 0 : null == t || r ? e[0] : 0 > t ? [] : f.call(e, 0, t)
            }, A.initial = function (e, t, r) {
                return f.call(e, 0, e.length - (null == t || r ? 1 : t))
            }, A.last = function (e, t, r) {
                return null == e ? void 0 : null == t || r ? e[e.length - 1] : f.call(e, Math.max(e.length - t, 0))
            }, A.rest = A.tail = A.drop = function (e, t, r) {
                return f.call(e, null == t || r ? 1 : t)
            }, A.compact = function (e) {
                return A.filter(e, A.identity)
            };
            var B = function (e, t, r) {
                return t && A.every(e, A.isArray) ? l.apply(r, e) : (S(e, function (e) {
                    A.isArray(e) || A.isArguments(e) ? t ? u.apply(r, e) : B(e, t, r) : r.push(e)
                }), r)
            };
            A.flatten = function (e, t) {
                return B(e, t, [])
            }, A.without = function (e) {
                return A.difference(e, f.call(arguments, 1))
            }, A.partition = function (e, t) {
                var r = [],
                    n = [];
                return S(e, function (e) {
                    (t(e) ? r : n).push(e)
                }), [r, n]
            }, A.uniq = A.unique = function (e, t, r, n) {
                A.isFunction(t) && (n = r, r = t, t = !1);
                var i = r ? A.map(e, r, n) : e,
                    a = [],
                    o = [];
                return S(i, function (r, n) {
                    (t ? n && o[o.length - 1] === r : A.contains(o, r)) || (o.push(r), a.push(e[n]))
                }), a
            }, A.union = function () {
                return A.uniq(A.flatten(arguments, !0))
            }, A.intersection = function (e) {
                var t = f.call(arguments, 1);
                return A.filter(A.uniq(e), function (e) {
                    return A.every(t, function (t) {
                        return A.contains(t, e)
                    })
                })
            }, A.difference = function (e) {
                var t = l.apply(a, f.call(arguments, 1));
                return A.filter(e, function (e) {
                    return !A.contains(t, e)
                })
            }, A.zip = function () {
                for (var e = A.max(A.pluck(arguments, "length").concat(0)), t = new Array(e), r = 0; e > r; r++) t[r] = A.pluck(arguments, "" + r);
                return t
            }, A.object = function (e, t) {
                if (null == e) return {};
                for (var r = {}, n = 0, i = e.length; i > n; n++) t ? r[e[n]] = t[n] : r[e[n][0]] = e[n][1];
                return r
            }, A.indexOf = function (e, t, r) {
                if (null == e) return -1;
                var n = 0,
                    i = e.length;
                if (r) {
                    if ("number" != typeof r) return n = A.sortedIndex(e, t), e[n] === t ? n : -1;
                    n = 0 > r ? Math.max(0, i + r) : r
                }
                if (w && e.indexOf === w) return e.indexOf(t, r);
                for (; i > n; n++)
                    if (e[n] === t) return n;
                return -1
            }, A.lastIndexOf = function (e, t, r) {
                if (null == e) return -1;
                var n = null != r;
                if (_ && e.lastIndexOf === _) return n ? e.lastIndexOf(t, r) : e.lastIndexOf(t);
                for (var i = n ? r : e.length; i--;)
                    if (e[i] === t) return i;
                return -1
            }, A.range = function (e, t, r) {
                arguments.length <= 1 && (t = e || 0, e = 0), r = arguments[2] || 1;
                for (var n = Math.max(Math.ceil((t - e) / r), 0), i = 0, a = new Array(n); n > i;) a[i++] = e, e += r;
                return a
            };
            var T = function () {};
            A.bind = function (e, t) {
                var r, n;
                if (E && e.bind === E) return E.apply(e, f.call(arguments, 1));
                if (!A.isFunction(e)) throw new TypeError;
                return r = f.call(arguments, 2), n = function () {
                    if (!(this instanceof n)) return e.apply(t, r.concat(f.call(arguments)));
                    T.prototype = e.prototype;
                    var i = new T;
                    T.prototype = null;
                    var a = e.apply(i, r.concat(f.call(arguments)));
                    return Object(a) === a ? a : i
                }
            }, A.partial = function (e) {
                var t = f.call(arguments, 1);
                return function () {
                    for (var r = 0, n = t.slice(), i = 0, a = n.length; a > i; i++) n[i] === A && (n[i] = arguments[r++]);
                    for (; r < arguments.length;) n.push(arguments[r++]);
                    return e.apply(this, n)
                }
            }, A.bindAll = function (e) {
                var t = f.call(arguments, 1);
                if (0 === t.length) throw new Error("bindAll must be passed function names");
                return S(t, function (t) {
                    e[t] = A.bind(e[t], e)
                }), e
            }, A.memoize = function (e, t) {
                var r = {};
                return t || (t = A.identity),
                    function () {
                        var n = t.apply(this, arguments);
                        return A.has(r, n) ? r[n] : r[n] = e.apply(this, arguments)
                    }
            }, A.delay = function (e, t) {
                var r = f.call(arguments, 2);
                return setTimeout(function () {
                    return e.apply(null, r)
                }, t)
            }, A.defer = function (e) {
                return A.delay.apply(A, [e, 1].concat(f.call(arguments, 1)))
            }, A.throttle = function (e, t, r) {
                var n, i, a, o = null,
                    s = 0;
                r || (r = {});
                var u = function () {
                    s = r.leading === !1 ? 0 : A.now(), o = null, a = e.apply(n, i), n = i = null
                };
                return function () {
                    var f = A.now();
                    s || r.leading !== !1 || (s = f);
                    var l = t - (f - s);
                    return n = this, i = arguments, 0 >= l ? (clearTimeout(o), o = null, s = f, a = e.apply(n, i), n = i = null) : o || r.trailing === !1 || (o = setTimeout(u, l)), a
                }
            }, A.debounce = function (e, t, r) {
                var n, i, a, o, s, u = function () {
                    var f = A.now() - o;
                    t > f ? n = setTimeout(u, t - f) : (n = null, r || (s = e.apply(a, i), a = i = null))
                };
                return function () {
                    a = this, i = arguments, o = A.now();
                    var f = r && !n;
                    return n || (n = setTimeout(u, t)), f && (s = e.apply(a, i), a = i = null), s
                }
            }, A.once = function (e) {
                var r, t = !1;
                return function () {
                    return t ? r : (t = !0, r = e.apply(this, arguments), e = null, r)
                }
            }, A.wrap = function (e, t) {
                return A.partial(t, e)
            }, A.compose = function () {
                var e = arguments;
                return function () {
                    for (var t = arguments, r = e.length - 1; r >= 0; r--) t = [e[r].apply(this, t)];
                    return t[0]
                }
            }, A.after = function (e, t) {
                return function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0
                }
            }, A.keys = function (e) {
                if (!A.isObject(e)) return [];
                if (L) return L(e);
                var t = [];
                for (var r in e) A.has(e, r) && t.push(r);
                return t
            }, A.values = function (e) {
                for (var t = A.keys(e), r = t.length, n = new Array(r), i = 0; r > i; i++) n[i] = e[t[i]];
                return n
            }, A.pairs = function (e) {
                for (var t = A.keys(e), r = t.length, n = new Array(r), i = 0; r > i; i++) n[i] = [t[i], e[t[i]]];
                return n
            }, A.invert = function (e) {
                for (var t = {}, r = A.keys(e), n = 0, i = r.length; i > n; n++) t[e[r[n]]] = r[n];
                return t
            }, A.functions = A.methods = function (e) {
                var t = [];
                for (var r in e) A.isFunction(e[r]) && t.push(r);
                return t.sort()
            }, A.extend = function (e) {
                return S(f.call(arguments, 1), function (t) {
                    if (t)
                        for (var r in t) e[r] = t[r]
                }), e
            }, A.pick = function (e) {
                var t = {},
                    r = l.apply(a, f.call(arguments, 1));
                return S(r, function (r) {
                    r in e && (t[r] = e[r])
                }), t
            }, A.omit = function (e) {
                var t = {},
                    r = l.apply(a, f.call(arguments, 1));
                for (var n in e) A.contains(r, n) || (t[n] = e[n]);
                return t
            }, A.defaults = function (e) {
                return S(f.call(arguments, 1), function (t) {
                    if (t)
                        for (var r in t) void 0 === e[r] && (e[r] = t[r])
                }), e
            }, A.clone = function (e) {
                return A.isObject(e) ? A.isArray(e) ? e.slice() : A.extend({}, e) : e
            }, A.tap = function (e, t) {
                return t(e), e
            };
            var C = function (e, t, r, n) {
                if (e === t) return 0 !== e || 1 / e == 1 / t;
                if (null == e || null == t) return e === t;
                e instanceof A && (e = e._wrapped), t instanceof A && (t = t._wrapped);
                var i = h.call(e);
                if (i != h.call(t)) return !1;
                switch (i) {
                case "[object String]":
                    return e == String(t);
                case "[object Number]":
                    return e != +e ? t != +t : 0 == e ? 1 / e == 1 / t : e == +t;
                case "[object Date]":
                case "[object Boolean]":
                    return +e == +t;
                case "[object RegExp]":
                    return e.source == t.source && e.global == t.global && e.multiline == t.multiline && e.ignoreCase == t.ignoreCase
                }
                if ("object" != typeof e || "object" != typeof t) return !1;
                for (var a = r.length; a--;)
                    if (r[a] == e) return n[a] == t;
                var o = e.constructor,
                    s = t.constructor;
                if (o !== s && !(A.isFunction(o) && o instanceof o && A.isFunction(s) && s instanceof s) && "constructor" in e && "constructor" in t) return !1;
                r.push(e), n.push(t);
                var u = 0,
                    f = !0;
                if ("[object Array]" == i) {
                    if (u = e.length, f = u == t.length)
                        for (; u-- && (f = C(e[u], t[u], r, n)););
                } else {
                    for (var l in e)
                        if (A.has(e, l) && (u++, !(f = A.has(t, l) && C(e[l], t[l], r, n)))) break;
                    if (f) {
                        for (l in t)
                            if (A.has(t, l) && !u--) break;
                        f = !u
                    }
                }
                return r.pop(), n.pop(), f
            };
            A.isEqual = function (e, t) {
                return C(e, t, [], [])
            }, A.isEmpty = function (e) {
                if (null == e) return !0;
                if (A.isArray(e) || A.isString(e)) return 0 === e.length;
                for (var t in e)
                    if (A.has(e, t)) return !1;
                return !0
            }, A.isElement = function (e) {
                return !(!e || 1 !== e.nodeType)
            }, A.isArray = k || function (e) {
                return "[object Array]" == h.call(e)
            }, A.isObject = function (e) {
                return e === Object(e)
            }, S(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
                A["is" + e] = function (t) {
                    return h.call(t) == "[object " + e + "]"
                }
            }), A.isArguments(arguments) || (A.isArguments = function (e) {
                return !(!e || !A.has(e, "callee"))
            }), "function" != typeof /./ && (A.isFunction = function (e) {
                return "function" == typeof e
            }), A.isFinite = function (e) {
                return isFinite(e) && !isNaN(parseFloat(e))
            }, A.isNaN = function (e) {
                return A.isNumber(e) && e != +e
            }, A.isBoolean = function (e) {
                return e === !0 || e === !1 || "[object Boolean]" == h.call(e)
            }, A.isNull = function (e) {
                return null === e
            }, A.isUndefined = function (e) {
                return void 0 === e
            }, A.has = function (e, t) {
                return c.call(e, t)
            }, A.noConflict = function () {
                return e._ = n, this
            }, A.identity = function (e) {
                return e
            }, A.constant = function (e) {
                return function () {
                    return e
                }
            }, A.property = function (e) {
                return function (t) {
                    return t[e]
                }
            }, A.matches = function (e) {
                return function (t) {
                    if (t === e) return !0;
                    for (var r in e)
                        if (e[r] !== t[r]) return !1;
                    return !0
                }
            }, A.times = function (e, t, r) {
                for (var n = Array(Math.max(0, e)), i = 0; e > i; i++) n[i] = t.call(r, i);
                return n
            }, A.random = function (e, t) {
                return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1))
            }, A.now = Date.now || function () {
                return (new Date).getTime()
            };
            var N = {
                escape: {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;"
                }
            };
            N.unescape = A.invert(N.escape);
            var U = {
                escape: new RegExp("[" + A.keys(N.escape).join("") + "]", "g"),
                unescape: new RegExp("(" + A.keys(N.unescape).join("|") + ")", "g")
            };
            A.each(["escape", "unescape"], function (e) {
                A[e] = function (t) {
                    return null == t ? "" : ("" + t).replace(U[e], function (t) {
                        return N[e][t]
                    })
                }
            }), A.result = function (e, t) {
                if (null == e) return void 0;
                var r = e[t];
                return A.isFunction(r) ? r.call(e) : r
            }, A.mixin = function (e) {
                S(A.functions(e), function (t) {
                    var r = A[t] = e[t];
                    A.prototype[t] = function () {
                        var e = [this._wrapped];
                        return u.apply(e, arguments), z.call(this, r.apply(A, e))
                    }
                })
            };
            var R = 0;
            A.uniqueId = function (e) {
                var t = ++R + "";
                return e ? e + t : t
            }, A.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var D = /(.)^/,
                F = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "	": "t",
                    "\u2028": "u2028",
                    "\u2029": "u2029"
                },
                O = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            A.template = function (e, t, r) {
                var n;
                r = A.defaults({}, r, A.templateSettings);
                var i = new RegExp([(r.escape || D).source, (r.interpolate || D).source, (r.evaluate || D).source].join("|") + "|$", "g"),
                    a = 0,
                    o = "__p+='";
                e.replace(i, function (t, r, n, i, s) {
                    return o += e.slice(a, s).replace(O, function (e) {
                        return "\\" + F[e]
                    }), r && (o += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'"), n && (o += "'+\n((__t=(" + n + "))==null?'':__t)+\n'"), i && (o += "';\n" + i + "\n__p+='"), a = s + t.length, t
                }), o += "';\n", r.variable || (o = "with(obj||{}){\n" + o + "}\n"), o = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + o + "return __p;\n";
                try {
                    n = new Function(r.variable || "obj", "_", o)
                } catch (s) {
                    throw s.source = o, s
                }
                if (t) return n(t, A);
                var u = function (e) {
                    return n.call(this, e, A)
                };
                return u.source = "function(" + (r.variable || "obj") + "){\n" + o + "}", u
            }, A.chain = function (e) {
                return A(e).chain()
            };
            var z = function (e) {
                return this._chain ? A(e).chain() : e
            };
            A.mixin(A), S(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (e) {
                var t = a[e];
                A.prototype[e] = function () {
                    var r = this._wrapped;
                    return t.apply(r, arguments), "shift" != e && "splice" != e || 0 !== r.length || delete r[0], z.call(this, r)
                }
            }), S(["concat", "join", "slice"], function (e) {
                var t = a[e];
                A.prototype[e] = function () {
                    return z.call(this, t.apply(this._wrapped, arguments))
                }
            }), A.extend(A.prototype, {
                chain: function () {
                    return this._chain = !0, this
                },
                value: function () {
                    return this._wrapped
                }
            }), "function" == typeof define && define.amd && define("underscore", [], function () {
                return A
            })
        }).call(this)
    }, {}]
}, {}, [1]);






/**
 * tracking.js - A modern approach for Computer Vision on the web.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.0.0
 * @link http://trackingjs.com
 * @license BSD
 */
! function (t) {
    t.tracking = t.tracking || {}, tracking.inherits = function (t, r) {
        function n() {}
        n.prototype = r.prototype, t.superClass_ = r.prototype, t.prototype = new n, t.prototype.constructor = t, t.base = function (t, n) {
            var e = Array.prototype.slice.call(arguments, 2);
            return r.prototype[n].apply(t, e)
        }
    }, tracking.initUserMedia_ = function (r, n) {
        t.navigator.getUserMedia({
            video: !0,
            audio: n.audio
        }, function (n) {
            try {
                r.src = t.URL.createObjectURL(n)
            } catch (e) {
                r.src = n
            }
        }, function () {
            throw Error("Cannot capture user camera.")
        })
    }, tracking.isNode = function (t) {
        return t.nodeType || this.isWindow(t)
    }, tracking.isWindow = function (t) {
        return !!(t && t.alert && t.document)
    }, tracking.one = function (t, r) {
        return this.isNode(t) ? t : (r || document).querySelector(t)
    }, tracking.track = function (t, r, n) {
        if (t = tracking.one(t), !t) throw new Error("Element not found, try a different element or selector.");
        if (!r) throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");
        switch (t.nodeName.toLowerCase()) {
        case "canvas":
            return this.trackCanvas_(t, r, n);
        case "img":
            return this.trackImg_(t, r, n);
        case "video":
            return n && n.camera && this.initUserMedia_(t, n), this.trackVideo_(t, r, n);
        default:
            throw new Error("Element not supported, try in a canvas, img, or video.")
        }
    }, tracking.trackCanvas_ = function (t, r) {
        var n = this,
            e = new tracking.TrackerTask(r);
        return e.on("run", function () {
            n.trackCanvasInternal_(t, r)
        }), e.run()
    }, tracking.trackCanvasInternal_ = function (t, r) {
        var n = t.width,
            e = t.height,
            i = t.getContext("2d"),
            a = i.getImageData(0, 0, n, e);
        r.track(a.data, n, e)
    }, tracking.trackImg_ = function (t, r) {
        var n = t.width,
            e = t.height,
            i = document.createElement("canvas");
        i.width = n, i.height = e;
        var a = new tracking.TrackerTask(r);
        return a.on("run", function () {
            tracking.Canvas.loadImage(i, t.src, 0, 0, n, e, function () {
                tracking.trackCanvasInternal_(i, r)
            })
        }), a.run()
    }, tracking.trackVideo_ = function (r, n) {
        var e, i, a = document.createElement("canvas"),
            o = a.getContext("2d"),
            c = function () {
                e = r.offsetWidth, i = r.offsetHeight, a.width = e, a.height = i
            };
        c(), r.addEventListener("resize", c);
        var s, g = function () {
                s = t.requestAnimationFrame(function () {
                    if (r.readyState === r.HAVE_ENOUGH_DATA) {
                        try {
                            o.drawImage(r, 0, 0, e, i)
                        } catch (t) {}
                        tracking.trackCanvasInternal_(a, n)
                    }
                    g()
                })
            },
            h = new tracking.TrackerTask(n);
        return h.on("stop", function () {
            t.cancelAnimationFrame(s)
        }), h.on("run", function () {
            g()
        }), h.run()
    }, t.URL || (t.URL = t.URL || t.webkitURL || t.msURL || t.oURL), navigator.getUserMedia || (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}(window),
function () {
    tracking.EventEmitter = function () {}, tracking.EventEmitter.prototype.events_ = null, tracking.EventEmitter.prototype.addListener = function (t, r) {
        if ("function" != typeof r) throw new TypeError("Listener must be a function");
        return this.events_ || (this.events_ = {}), this.emit("newListener", t, r), this.events_[t] || (this.events_[t] = []), this.events_[t].push(r), this
    }, tracking.EventEmitter.prototype.listeners = function (t) {
        return this.events_ && this.events_[t]
    }, tracking.EventEmitter.prototype.emit = function (t) {
        var r = this.listeners(t);
        if (r) {
            for (var n = Array.prototype.slice.call(arguments, 1), e = 0; e < r.length; e++) r[e] && r[e].apply(this, n);
            return !0
        }
        return !1
    }, tracking.EventEmitter.prototype.on = tracking.EventEmitter.prototype.addListener, tracking.EventEmitter.prototype.once = function (t, r) {
        var n = this;
        n.on(t, function e() {
            n.removeListener(t, e), r.apply(this, arguments)
        })
    }, tracking.EventEmitter.prototype.removeAllListeners = function (t) {
        return this.events_ ? (t ? delete this.events_[t] : delete this.events_, this) : this
    }, tracking.EventEmitter.prototype.removeListener = function (t, r) {
        if ("function" != typeof r) throw new TypeError("Listener must be a function");
        if (!this.events_) return this;
        var n = this.listeners(t);
        if (Array.isArray(n)) {
            var e = n.indexOf(r);
            if (0 > e) return this;
            n.splice(e, 1)
        }
        return this
    }, tracking.EventEmitter.prototype.setMaxListeners = function () {
        throw new Error("Not implemented")
    }
}(),
function () {
    tracking.Canvas = {}, tracking.Canvas.loadImage = function (t, r, n, e, i, a, o) {
        var c = this,
            s = new window.Image;
        s.onload = function () {
            var r = t.getContext("2d");
            t.width = i, t.height = a, r.drawImage(s, n, e, i, a), o && o.call(c), s = null
        }, s.src = r
    }
}(),
function () {
    tracking.DisjointSet = function (t) {
        if (void 0 === t) throw new Error("DisjointSet length not specified.");
        this.length = t, this.parent = new Uint32Array(t);
        for (var r = 0; t > r; r++) this.parent[r] = r
    }, tracking.DisjointSet.prototype.length = null, tracking.DisjointSet.prototype.parent = null, tracking.DisjointSet.prototype.find = function (t) {
        return this.parent[t] === t ? t : this.parent[t] = this.find(this.parent[t])
    }, tracking.DisjointSet.prototype.union = function (t, r) {
        var n = this.find(t),
            e = this.find(r);
        this.parent[n] = e
    }
}(),
function () {
    tracking.Image = {}, tracking.Image.blur = function (t, r, n, e) {
        if (e = Math.abs(e), 1 >= e) throw new Error("Diameter should be greater than 1.");
        for (var i = e / 2, a = Math.ceil(e) + (1 - Math.ceil(e) % 2), o = new Float32Array(a), c = (i + .5) / 3, s = c * c, g = 1 / Math.sqrt(2 * Math.PI * s), h = -1 / (2 * c * c), k = 0, u = Math.floor(a / 2), f = 0; a > f; f++) {
            var l = f - u,
                p = g * Math.exp(l * l * h);
            o[f] = p, k += p
        }
        for (var v = 0; v < o.length; v++) o[v] /= k;
        return this.separableConvolve(t, r, n, o, o, !1)
    }, tracking.Image.computeIntegralImage = function (t, r, n, e, i, a, o) {
        if (arguments.length < 4) throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");
        var c;
        o && (c = tracking.Image.sobel(t, r, n));
        for (var s = 0; n > s; s++)
            for (var g = 0; r > g; g++) {
                var h = s * r * 4 + 4 * g,
                    k = ~~(.299 * t[h] + .587 * t[h + 1] + .114 * t[h + 2]);
                if (e && this.computePixelValueSAT_(e, r, s, g, k), i && this.computePixelValueSAT_(i, r, s, g, k * k), a) {
                    var u = h - 4 * r,
                        f = ~~(.299 * t[u] + .587 * t[u + 1] + .114 * t[u + 2]);
                    this.computePixelValueRSAT_(a, r, s, g, k, f || 0)
                }
                o && this.computePixelValueSAT_(o, r, s, g, c[h])
            }
    }, tracking.Image.computePixelValueRSAT_ = function (t, r, n, e, i, a) {
        var o = n * r + e;
        t[o] = (t[o - r - 1] || 0) + (t[o - r + 1] || 0) - (t[o - r - r] || 0) + i + a
    }, tracking.Image.computePixelValueSAT_ = function (t, r, n, e, i) {
        var a = n * r + e;
        t[a] = (t[a - r] || 0) + (t[a - 1] || 0) + i - (t[a - r - 1] || 0)
    }, tracking.Image.grayscale = function (t, r, n, e) {
        for (var i = new Uint8ClampedArray(e ? t.length : t.length >> 2), a = 0, o = 0, c = 0; n > c; c++)
            for (var s = 0; r > s; s++) {
                var g = .299 * t[o] + .587 * t[o + 1] + .114 * t[o + 2];
                i[a++] = g, e && (i[a++] = g, i[a++] = g, i[a++] = t[o + 3]), o += 4
            }
        return i
    }, tracking.Image.horizontalConvolve = function (t, r, n, e, i) {
        for (var a = e.length, o = Math.floor(a / 2), c = new Float32Array(r * n * 4), s = i ? 1 : 0, g = 0; n > g; g++)
            for (var h = 0; r > h; h++) {
                for (var k = g, u = h, f = 4 * (g * r + h), l = 0, p = 0, v = 0, m = 0, y = 0; a > y; y++) {
                    var d = k,
                        w = Math.min(r - 1, Math.max(0, u + y - o)),
                        T = 4 * (d * r + w),
                        C = e[y];
                    l += t[T] * C, p += t[T + 1] * C, v += t[T + 2] * C, m += t[T + 3] * C
                }
                c[f] = l, c[f + 1] = p, c[f + 2] = v, c[f + 3] = m + s * (255 - m)
            }
        return c
    }, tracking.Image.verticalConvolve = function (t, r, n, e, i) {
        for (var a = e.length, o = Math.floor(a / 2), c = new Float32Array(r * n * 4), s = i ? 1 : 0, g = 0; n > g; g++)
            for (var h = 0; r > h; h++) {
                for (var k = g, u = h, f = 4 * (g * r + h), l = 0, p = 0, v = 0, m = 0, y = 0; a > y; y++) {
                    var d = Math.min(n - 1, Math.max(0, k + y - o)),
                        w = u,
                        T = 4 * (d * r + w),
                        C = e[y];
                    l += t[T] * C, p += t[T + 1] * C, v += t[T + 2] * C, m += t[T + 3] * C
                }
                c[f] = l, c[f + 1] = p, c[f + 2] = v, c[f + 3] = m + s * (255 - m)
            }
        return c
    }, tracking.Image.separableConvolve = function (t, r, n, e, i, a) {
        var o = this.verticalConvolve(t, r, n, i, a);
        return this.horizontalConvolve(o, r, n, e, a)
    }, tracking.Image.sobel = function (t, r, n) {
        t = this.grayscale(t, r, n, !0);
        for (var e = new Float32Array(r * n * 4), i = new Float32Array([-1, 0, 1]), a = new Float32Array([1, 2, 1]), o = this.separableConvolve(t, r, n, i, a), c = this.separableConvolve(t, r, n, a, i), s = 0; s < e.length; s += 4) {
            var g = o[s],
                h = c[s],
                k = Math.sqrt(h * h + g * g);
            e[s] = k, e[s + 1] = k, e[s + 2] = k, e[s + 3] = 255
        }
        return e
    }
}(),
function () {
    tracking.ViolaJones = {}, tracking.ViolaJones.REGIONS_OVERLAP = .5, tracking.ViolaJones.classifiers = {}, tracking.ViolaJones.detect = function (t, r, n, e, i, a, o, c) {
        var s, g = 0,
            h = [],
            k = new Int32Array(r * n),
            u = new Int32Array(r * n),
            f = new Int32Array(r * n);
        o > 0 && (s = new Int32Array(r * n)), tracking.Image.computeIntegralImage(t, r, n, k, u, f, s);
        for (var l = c[0], p = c[1], v = e * i, m = v * l | 0, y = v * p | 0; r > m && n > y;) {
            for (var d = v * a + .5 | 0, w = 0; n - y > w; w += d)
                for (var T = 0; r - m > T; T += d) o > 0 && this.isTriviallyExcluded(o, s, w, T, r, m, y) || this.evalStages_(c, k, u, f, w, T, r, m, y, v) && (h[g++] = {
                    width: m,
                    height: y,
                    x: T,
                    y: w
                });
            v *= i, m = v * l | 0, y = v * p | 0
        }
        return this.mergeRectangles_(h)
    }, tracking.ViolaJones.isTriviallyExcluded = function (t, r, n, e, i, a, o) {
        var c = n * i + e,
            s = c + a,
            g = c + o * i,
            h = g + a,
            k = (r[c] - r[s] - r[g] + r[h]) / (a * o * 255);
        return t > k ? !0 : !1
    }, tracking.ViolaJones.evalStages_ = function (t, r, n, e, i, a, o, c, s, g) {
        var h = 1 / (c * s),
            k = i * o + a,
            u = k + c,
            f = k + s * o,
            l = f + c,
            p = (r[k] - r[u] - r[f] + r[l]) * h,
            v = (n[k] - n[u] - n[f] + n[l]) * h - p * p,
            m = 1;
        v > 0 && (m = Math.sqrt(v));
        for (var y = t.length, d = 2; y > d;) {
            for (var w = 0, T = t[d++], C = t[d++]; C--;) {
                for (var _ = 0, E = t[d++], M = t[d++], x = 0; M > x; x++) {
                    var I, b, O, A, S = a + t[d++] * g + .5 | 0,
                        D = i + t[d++] * g + .5 | 0,
                        R = t[d++] * g + .5 | 0,
                        j = t[d++] * g + .5 | 0,
                        F = t[d++];
                    E ? (I = S - j + R + (D + R + j - 1) * o, b = S + (D - 1) * o, O = S - j + (D + j - 1) * o, A = S + R + (D + R - 1) * o, _ += (e[I] + e[b] - e[O] - e[A]) * F) : (I = D * o + S, b = I + R, O = I + j * o, A = O + R, _ += (r[I] - r[b] - r[O] + r[A]) * F)
                }
                var L = t[d++],
                    V = t[d++],
                    U = t[d++];
                w += L * m > _ * h ? V : U
            }
            if (T > w) return !1
        }
        return !0
    }, tracking.ViolaJones.mergeRectangles_ = function (t) {
        for (var r = new tracking.DisjointSet(t.length), n = 0; n < t.length; n++)
            for (var e = t[n], i = 0; i < t.length; i++) {
                var a = t[i];
                if (tracking.Math.intersectRect(e.x, e.y, e.x + e.width, e.y + e.height, a.x, a.y, a.x + a.width, a.y + a.height)) {
                    var o = Math.max(e.x, a.x),
                        c = Math.max(e.y, a.y),
                        s = Math.min(e.x + e.width, a.x + a.width),
                        g = Math.min(e.y + e.height, a.y + a.height),
                        h = (o - s) * (c - g),
                        k = e.width * e.height,
                        u = a.width * a.height;
                    h / (k * (k / u)) >= this.REGIONS_OVERLAP && h / (u * (k / u)) >= this.REGIONS_OVERLAP && r.union(n, i)
                }
            }
        for (var f = {}, l = 0; l < r.length; l++) {
            var p = r.find(l);
            f[p] ? (f[p].total++, f[p].width += t[l].width, f[p].height += t[l].height, f[p].x += t[l].x, f[p].y += t[l].y) : f[p] = {
                total: 1,
                width: t[l].width,
                height: t[l].height,
                x: t[l].x,
                y: t[l].y
            }
        }
        var v = [];
        return Object.keys(f).forEach(function (t) {
            var r = f[t];
            v.push({
                total: r.total,
                width: r.width / r.total + .5 | 0,
                height: r.height / r.total + .5 | 0,
                x: r.x / r.total + .5 | 0,
                y: r.y / r.total + .5 | 0
            })
        }), v
    }
}(),
function () {
    tracking.Brief = {}, tracking.Brief.N = 512, tracking.Brief.randomImageOffsets_ = {}, tracking.Brief.randomWindowOffsets_ = null, tracking.Brief.getDescriptors = function (t, r, n) {
        for (var e = new Int32Array((n.length >> 1) * (this.N >> 5)), i = 0, a = this.getRandomOffsets_(r), o = 0, c = 0; c < n.length; c += 2)
            for (var s = r * n[c + 1] + n[c], g = 0, h = 0, k = this.N; k > h; h++) t[a[g++] + s] < t[a[g++] + s] && (i |= 1 << (31 & h)), h + 1 & 31 || (e[o++] = i, i = 0);
        return e
    }, tracking.Brief.match = function (t, r, n, e) {
        for (var i = t.length >> 1, a = n.length >> 1, o = new Array(i), c = 0; i > c; c++) {
            for (var s = 1 / 0, g = 0, h = 0; a > h; h++) {
                for (var k = 0, u = 0, f = this.N >> 5; f > u; u++) k += tracking.Math.hammingWeight(r[c * f + u] ^ e[h * f + u]);
                s > k && (s = k, g = h)
            }
            o[c] = {
                index1: c,
                index2: g,
                keypoint1: [t[2 * c], t[2 * c + 1]],
                keypoint2: [n[2 * g], n[2 * g + 1]],
                confidence: 1 - s / this.N
            }
        }
        return o
    }, tracking.Brief.reciprocalMatch = function (t, r, n, e) {
        var i = [];
        if (0 === t.length || 0 === n.length) return i;
        for (var a = tracking.Brief.match(t, r, n, e), o = tracking.Brief.match(n, e, t, r), c = 0; c < a.length; c++) o[a[c].index2].index2 === c && i.push(a[c]);
        return i
    }, tracking.Brief.getRandomOffsets_ = function (t) {
        if (!this.randomWindowOffsets_) {
            for (var r = 0, n = new Int32Array(4 * this.N), e = 0; e < this.N; e++) n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16)), n[r++] = Math.round(tracking.Math.uniformRandom(-15, 16));
            this.randomWindowOffsets_ = n
        }
        if (!this.randomImageOffsets_[t]) {
            for (var i = 0, a = new Int32Array(2 * this.N), o = 0; o < this.N; o++) a[i++] = this.randomWindowOffsets_[4 * o] * t + this.randomWindowOffsets_[4 * o + 1], a[i++] = this.randomWindowOffsets_[4 * o + 2] * t + this.randomWindowOffsets_[4 * o + 3];
            this.randomImageOffsets_[t] = a
        }
        return this.randomImageOffsets_[t]
    }
}(),
function () {
    tracking.Fast = {}, tracking.Fast.THRESHOLD = 40, tracking.Fast.circles_ = {}, tracking.Fast.findCorners = function (t, r, n, e) {
        var i = this.getCircleOffsets_(r),
            a = new Int32Array(16),
            o = [];
        void 0 === e && (e = this.THRESHOLD);
        for (var c = 3; n - 3 > c; c++)
            for (var s = 3; r - 3 > s; s++) {
                for (var g = c * r + s, h = t[g], k = 0; 16 > k; k++) a[k] = t[g + i[k]];
                this.isCorner(h, a, e) && (o.push(s, c), s += 3)
            }
        return o
    }, tracking.Fast.isBrighter = function (t, r, n) {
        return t - r > n
    }, tracking.Fast.isCorner = function (t, r, n) {
        if (this.isTriviallyExcluded(r, t, n)) return !1;
        for (var e = 0; 16 > e; e++) {
            for (var i = !0, a = !0, o = 0; 9 > o; o++) {
                var c = r[e + o & 15];
                if (!this.isBrighter(t, c, n) && (a = !1, i === !1)) break;
                if (!this.isDarker(t, c, n) && (i = !1, a === !1)) break
            }
            if (a || i) return !0
        }
        return !1
    }, tracking.Fast.isDarker = function (t, r, n) {
        return r - t > n
    }, tracking.Fast.isTriviallyExcluded = function (t, r, n) {
        var e = 0,
            i = t[8],
            a = t[12],
            o = t[4],
            c = t[0];
        return this.isBrighter(c, r, n) && e++, this.isBrighter(o, r, n) && e++, this.isBrighter(i, r, n) && e++, this.isBrighter(a, r, n) && e++, 3 > e && (e = 0, this.isDarker(c, r, n) && e++, this.isDarker(o, r, n) && e++, this.isDarker(i, r, n) && e++, this.isDarker(a, r, n) && e++, 3 > e) ? !0 : !1
    }, tracking.Fast.getCircleOffsets_ = function (t) {
        if (this.circles_[t]) return this.circles_[t];
        var r = new Int32Array(16);
        return r[0] = -t - t - t, r[1] = r[0] + 1, r[2] = r[1] + t + 1, r[3] = r[2] + t + 1, r[4] = r[3] + t, r[5] = r[4] + t, r[6] = r[5] + t - 1, r[7] = r[6] + t - 1, r[8] = r[7] - 1, r[9] = r[8] - 1, r[10] = r[9] - t - 1, r[11] = r[10] - t - 1, r[12] = r[11] - t, r[13] = r[12] - t, r[14] = r[13] - t + 1, r[15] = r[14] - t + 1, this.circles_[t] = r, r
    }
}(),
function () {
    tracking.Math = {}, tracking.Math.distance = function (t, r, n, e) {
        var i = n - t,
            a = e - r;
        return Math.sqrt(i * i + a * a)
    }, tracking.Math.hammingWeight = function (t) {
        return t -= t >> 1 & 1431655765, t = (858993459 & t) + (t >> 2 & 858993459), 16843009 * (t + (t >> 4) & 252645135) >> 24
    }, tracking.Math.uniformRandom = function (t, r) {
        return t + Math.random() * (r - t)
    }, tracking.Math.intersectRect = function (t, r, n, e, i, a, o, c) {
        return !(i > n || t > o || a > e || r > c)
    }
}(),
function () {
    tracking.Matrix = {}, tracking.Matrix.forEach = function (t, r, n, e, i) {
        i = i || 1;
        for (var a = 0; n > a; a += i)
            for (var o = 0; r > o; o += i) {
                var c = a * r * 4 + 4 * o;
                e.call(this, t[c], t[c + 1], t[c + 2], t[c + 3], c, a, o)
            }
    }
}(),
function () {
    tracking.EPnP = {}, tracking.EPnP.solve = function () {}
}(),
function () {
    tracking.Tracker = function () {
        tracking.Tracker.base(this, "constructor")
    }, tracking.inherits(tracking.Tracker, tracking.EventEmitter), tracking.Tracker.prototype.track = function () {}
}(),
function () {
    tracking.TrackerTask = function (t) {
        if (tracking.TrackerTask.base(this, "constructor"), !t) throw new Error("Tracker instance not specified.");
        this.setTracker(t)
    }, tracking.inherits(tracking.TrackerTask, tracking.EventEmitter), tracking.TrackerTask.prototype.tracker_ = null, tracking.TrackerTask.prototype.running_ = !1, tracking.TrackerTask.prototype.getTracker = function () {
        return this.tracker_
    }, tracking.TrackerTask.prototype.inRunning = function () {
        return this.running_
    }, tracking.TrackerTask.prototype.setRunning = function (t) {
        this.running_ = t
    }, tracking.TrackerTask.prototype.setTracker = function (t) {
        this.tracker_ = t
    }, tracking.TrackerTask.prototype.run = function () {
        var t = this;
        if (!this.inRunning()) return this.setRunning(!0), this.reemitTrackEvent_ = function (r) {
            t.emit("track", r)
        }, this.tracker_.on("track", this.reemitTrackEvent_), this.emit("run"), this
    }, tracking.TrackerTask.prototype.stop = function () {
        return this.inRunning() ? (this.setRunning(!1), this.emit("stop"), this.tracker_.removeListener("track", this.reemitTrackEvent_), this) : void 0
    }
}(),
function () {
    tracking.ColorTracker = function (t) {
        tracking.ColorTracker.base(this, "constructor"), "string" == typeof t && (t = [t]), t && (t.forEach(function (t) {
            if (!tracking.ColorTracker.getColor(t)) throw new Error('Color not valid, try `new tracking.ColorTracker("magenta")`.')
        }), this.setColors(t))
    }, tracking.inherits(tracking.ColorTracker, tracking.Tracker), tracking.ColorTracker.knownColors_ = {}, tracking.ColorTracker.neighbours_ = {}, tracking.ColorTracker.registerColor = function (t, r) {
        tracking.ColorTracker.knownColors_[t] = r
    }, tracking.ColorTracker.getColor = function (t) {
        return tracking.ColorTracker.knownColors_[t]
    }, tracking.ColorTracker.prototype.colors = ["magenta"], tracking.ColorTracker.prototype.minDimension = 20, tracking.ColorTracker.prototype.maxDimension = 1 / 0, tracking.ColorTracker.prototype.minGroupSize = 30, tracking.ColorTracker.prototype.calculateDimensions_ = function (t, r) {
        for (var n = -1, e = -1, i = 1 / 0, a = 1 / 0, o = 0; r > o; o += 2) {
            var c = t[o],
                s = t[o + 1];
            i > c && (i = c), c > n && (n = c), a > s && (a = s), s > e && (e = s)
        }
        return {
            width: n - i,
            height: e - a,
            x: i,
            y: a
        }
    }, tracking.ColorTracker.prototype.getColors = function () {
        return this.colors
    }, tracking.ColorTracker.prototype.getMinDimension = function () {
        return this.minDimension
    }, tracking.ColorTracker.prototype.getMaxDimension = function () {
        return this.maxDimension
    }, tracking.ColorTracker.prototype.getMinGroupSize = function () {
        return this.minGroupSize
    }, tracking.ColorTracker.prototype.getNeighboursForWidth_ = function (t) {
        if (tracking.ColorTracker.neighbours_[t]) return tracking.ColorTracker.neighbours_[t];
        var r = new Int32Array(8);
        return r[0] = 4 * -t, r[1] = 4 * -t + 4, r[2] = 4, r[3] = 4 * t + 4, r[4] = 4 * t, r[5] = 4 * t - 4, r[6] = -4, r[7] = 4 * -t - 4, tracking.ColorTracker.neighbours_[t] = r, r
    }, tracking.ColorTracker.prototype.mergeRectangles_ = function (t) {
        for (var r, n = [], e = this.getMinDimension(), i = this.getMaxDimension(), a = 0; a < t.length; a++) {
            var o = t[a];
            r = !0;
            for (var c = a + 1; c < t.length; c++) {
                var s = t[c];
                if (tracking.Math.intersectRect(o.x, o.y, o.x + o.width, o.y + o.height, s.x, s.y, s.x + s.width, s.y + s.height)) {
                    r = !1;
                    var g = Math.min(o.x, s.x),
                        h = Math.min(o.y, s.y),
                        k = Math.max(o.x + o.width, s.x + s.width),
                        u = Math.max(o.y + o.height, s.y + s.height);
                    s.height = u - h, s.width = k - g, s.x = g, s.y = h;
                    break
                }
            }
            r && o.width >= e && o.height >= e && o.width <= i && o.height <= i && n.push(o)
        }
        return n
    }, tracking.ColorTracker.prototype.setColors = function (t) {
        this.colors = t
    }, tracking.ColorTracker.prototype.setMinDimension = function (t) {
        this.minDimension = t
    }, tracking.ColorTracker.prototype.setMaxDimension = function (t) {
        this.maxDimension = t
    }, tracking.ColorTracker.prototype.setMinGroupSize = function (t) {
        this.minGroupSize = t
    }, tracking.ColorTracker.prototype.track = function (t, r, n) {
        var e = this,
            i = this.getColors();
        if (!i) throw new Error('Colors not specified, try `new tracking.ColorTracker("magenta")`.');
        var a = [];
        i.forEach(function (i) {
            a = a.concat(e.trackColor_(t, r, n, i))
        }), this.emit("track", {
            data: a
        })
    }, tracking.ColorTracker.prototype.trackColor_ = function (n, e, i, a) {
        var o, c, s, g, h, k = tracking.ColorTracker.knownColors_[a],
            u = new Int32Array(n.length >> 2),
            f = new Int8Array(n.length),
            l = this.getMinGroupSize(),
            p = this.getNeighboursForWidth_(e),
            v = new Int32Array(n.length),
            m = [],
            y = -4;
        if (!k) return m;
        for (var d = 0; i > d; d++)
            for (var w = 0; e > w; w++)
                if (y += 4, !f[y]) {
                    for (o = 0, h = -1, v[++h] = y, v[++h] = d, v[++h] = w, f[y] = 1; h >= 0;)
                        if (s = v[h--], c = v[h--], g = v[h--], k(n[g], n[g + 1], n[g + 2], n[g + 3], g, c, s)) {
                            u[o++] = s, u[o++] = c;
                            for (var T = 0; T < p.length; T++) {
                                var C = g + p[T],
                                    _ = c + t[T],
                                    E = s + r[T];
                                !f[C] && _ >= 0 && i > _ && E >= 0 && e > E && (v[++h] = C, v[++h] = _, v[++h] = E, f[C] = 1)
                            }
                        }
                    if (o >= l) {
                        var M = this.calculateDimensions_(u, o);
                        M && (M.color = a, m.push(M))
                    }
                }
        return this.mergeRectangles_(m)
    }, tracking.ColorTracker.registerColor("cyan", function (t, r, n) {
        var e = 50,
            i = 70,
            a = t - 0,
            o = r - 255,
            c = n - 255;
        return r - t >= e && n - t >= i ? !0 : 6400 > a * a + o * o + c * c
    }), tracking.ColorTracker.registerColor("magenta", function (t, r, n) {
        var e = 50,
            i = t - 255,
            a = r - 0,
            o = n - 255;
        return t - r >= e && n - r >= e ? !0 : 19600 > i * i + a * a + o * o
    }), tracking.ColorTracker.registerColor("yellow", function (t, r, n) {
        var e = 50,
            i = t - 255,
            a = r - 255,
            o = n - 0;
        return t - n >= e && r - n >= e ? !0 : 1e4 > i * i + a * a + o * o
    });
    var t = new Int32Array([-1, -1, 0, 1, 1, 1, 0, -1]),
        r = new Int32Array([0, 1, 1, 1, 0, -1, -1, -1])
}(),
function () {
    tracking.ObjectTracker = function (t) {
        tracking.ObjectTracker.base(this, "constructor"), t && (Array.isArray(t) || (t = [t]), Array.isArray(t) && t.forEach(function (r, n) {
            if ("string" == typeof r && (t[n] = tracking.ViolaJones.classifiers[r]), !t[n]) throw new Error('Object classifier not valid, try `new tracking.ObjectTracker("face")`.')
        })), this.setClassifiers(t)
    }, tracking.inherits(tracking.ObjectTracker, tracking.Tracker), tracking.ObjectTracker.prototype.edgesDensity = .2, tracking.ObjectTracker.prototype.initialScale = 1, tracking.ObjectTracker.prototype.scaleFactor = 1.25, tracking.ObjectTracker.prototype.stepSize = 1.5, tracking.ObjectTracker.prototype.getClassifiers = function () {
        return this.classifiers
    }, tracking.ObjectTracker.prototype.getEdgesDensity = function () {
        return this.edgesDensity
    }, tracking.ObjectTracker.prototype.getInitialScale = function () {
        return this.initialScale
    }, tracking.ObjectTracker.prototype.getScaleFactor = function () {
        return this.scaleFactor
    }, tracking.ObjectTracker.prototype.getStepSize = function () {
        return this.stepSize
    }, tracking.ObjectTracker.prototype.track = function (t, r, n) {
        var e = this,
            i = this.getClassifiers();
        if (!i) throw new Error('Object classifier not specified, try `new tracking.ObjectTracker("face")`.');
        var a = [];
        i.forEach(function (i) {
            a = a.concat(tracking.ViolaJones.detect(t, r, n, e.getInitialScale(), e.getScaleFactor(), e.getStepSize(), e.getEdgesDensity(), i))
        }), this.emit("track", {
            data: a
        })
    }, tracking.ObjectTracker.prototype.setClassifiers = function (t) {
        this.classifiers = t
    }, tracking.ObjectTracker.prototype.setEdgesDensity = function (t) {
        this.edgesDensity = t
    }, tracking.ObjectTracker.prototype.setInitialScale = function (t) {
        this.initialScale = t
    }, tracking.ObjectTracker.prototype.setScaleFactor = function (t) {
        this.scaleFactor = t
    }, tracking.ObjectTracker.prototype.setStepSize = function (t) {
        this.stepSize = t
    }
}();