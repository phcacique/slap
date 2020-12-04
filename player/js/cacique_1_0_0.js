//-----------------------------------------
// CACIQUE Geometry and Physics Framework
// 1.0.0 - released on November 14th, 2016
//-----------------------------------------

//---------------- APP UTIL ------------------
function getRandomNumber(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function animate() {
    ctx.clearRect(0, 0, cw, ch);
    requestAnimationFrame(animate);
}

//---------- CACIQUE FRAMEWORK ------------
//----------- PROTOTYPES -------------

//===== GEOMETRY =====

//----- SHAPE -----
function Shape(geometry, position, color, properties) {
    this.position = (position == null || position.classname != "Point") ? new Point() : position;
    this.geometry = (geometry == null || geometry.constructor.name != "GenericObject") ? new Circle() : geometry;
    this.color = (color != null && geometry.constructor.name == "GenericObject" && ((color.classname == "Color") || color.classname == "Gradient")) ? color : null;
    this.lineColor = new Color();
    this.lineWidth = 1;
    this.scale = 1;
    this.decay = 0;
    this.showPoints = true;
    if (properties != null) this.setProperties(properties);
    GenericObject.call(this, "Shape");
}
Shape.prototype = new GenericObject();
Shape.prototype.setProperties = function (properties) {
    for (var p in properties) {
        this[p] = properties[p];
    }
}
Shape.prototype.draw = function (canvas) {
    if (this.scale > 0) {
        var ctx = canvas.getContext('2d');
        var cw = canvas.width;
        var ch = canvas.height;

        ctx.beginPath();
        if (this.lineWidth > 0) {
            ctx.strokeStyle = (this.lineColor.classname == "Color") ? this.lineColor.toRGBA() : this.lineColor.getGradient();
            ctx.lineWidth = this.lineWidth;
        }
        if (this.color != null && (this.color.classname == "Color" || this.color.classname == "Gradient")) {
            ctx.fillStyle = (this.color.classname == "Color") ? this.color.toRGBA() : this.color.getGradient();
        }

        switch (this.geometry.classname) {
        case "Circle":
            ctx.arc(this.position.x, this.position.y, this.geometry.radius * this.scale, 0, Math.PI * 2);
            break;
        case "Rectangle":
            ctx.rect(this.position.x, this.position.y, this.geometry.width * this.scale, this.geometry.height * this.scale);
            break;
        case "Rect":
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.geometry.p2.x * this.scale, this.geometry.p2.y * this.scale);
            break;
        case "Heart":
            for (var i = 0; i < Math.PI * 2; i += 0.05) {
                var p = this.geometry.getPositionByAngle(i);
                p.multiply(this.scale);
                p.add(this.position);
                if (i == 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            break;
        case "Polygon":
            var step = Math.PI * 2 / this.geometry.points;
            var angle = -Math.PI / 2;
            this.geometry.circle.radius *= this.scale;
            this.geometry.innerCircle.radius *= this.scale;
            for (var i = 0; i <= this.geometry.points; i++) {
                var p = this.geometry.circle.getPositionByAngle(angle);
                var p2 = this.geometry.innerCircle.getPositionByAngle(angle - step / 2);
                angle += step;
                if (i == 0) ctx.moveTo(this.position.x + p.x, this.position.y + p.y);
                else {
                    if (this.geometry.isStar) {

                        ctx.lineTo(this.position.x + p2.x, this.position.y + p2.y);
                    }
                    ctx.lineTo(this.position.x + p.x, this.position.y + p.y);
                }
            }
            break;
        case "BezierLine":
            ctx.strokeStyle = this.lineColor;
            ctx.lineWidth = this.lineWidth;
            ctx.moveTo(this.geometry.bezierCurve.startPoint.x, this.geometry.bezierCurve.startPoint.y);
            ctx.bezierCurveTo(this.geometry.bezierCurve.controlPoint1.x, this.geometry.bezierCurve.controlPoint1.y, this.geometry.bezierCurve.controlPoint2.x, this.geometry.bezierCurve.controlPoint2.y, this.geometry.bezierCurve.endPoint.x, this.geometry.bezierCurve.endPoint.y);
            break;
        case "BezierCurve":
            ctx.beginPath();
            new Shape(new BezierLine(this.geometry.clone())).draw(canvas);

            ctx.beginPath();
            new Shape(new Rectangle(8, 8), new Point(this.geometry.controlPoint1.x - 4, this.geometry.controlPoint1.y - 4), new Color(128, 201, 247, 1), {
                lineWidth: 0
            }).draw(canvas);

            ctx.beginPath();
            new Shape(new Rectangle(8, 8), new Point(this.geometry.controlPoint2.x - 4, this.geometry.controlPoint2.y - 4), new Color(128, 201, 247, 1), {
                lineWidth: 0
            }).draw(canvas);

            ctx.beginPath();
            new Shape(new Rect(this.geometry.startPoint.clone(), this.geometry.controlPoint1.clone()), this.geometry.startPoint, new Color(128, 201, 247, 1), {
                lineWidth: 0.5,
                lineColor: new Color(128, 201, 247, 1)
            }).draw(canvas);

            ctx.beginPath();
            new Shape(new Rect(this.geometry.endPoint.clone(), this.geometry.controlPoint2.clone()), this.geometry.endPoint, new Color(128, 201, 247, 1), {
                lineWidth: 0.5,
                lineColor: new Color(128, 201, 247, 1)
            }).draw(canvas);

            ctx.beginPath();
            new Shape(new Circle(5), this.geometry.startPoint.clone(), new Color(247, 229, 128, 1), {
                lineWidth: 0
            }).draw(canvas);

            ctx.beginPath();
            new Shape(new Circle(5), this.geometry.endPoint.clone(), new Color(247, 229, 128, 1), {
                lineWidth: 0
            }).draw(canvas);

            this.lineWidth = 0;
            break;
        }

        if (this.lineWidth > 0) ctx.stroke();
        if (this.color != null) ctx.fill();
        this.scale -= this.decay;
    }
}

//----- POINT -----
function Point(x, y) {
    this.x = (x != null && !isNaN(x)) ? x : 0;
    this.y = (y != null && !isNaN(y)) ? y : 0;
    GenericObject.call(this, "Point");
}
Point.prototype = new GenericObject();
Point.prototype.add = function (p2) {
    if (p2.classname != this.classname) return null;
    this.x += p2.x;
    this.y += p2.y;
    return this;
}
Point.prototype.sub = function (p2) {
    if (p2.classname != this.classname) return null;
    this.x -= p2.x;
    this.y -= p2.y;
    return this;
}
Point.prototype.distance = function (p2) {
    if (p2.classname != this.classname) return null;
    //Euclidean Disctance
    return Math.sqrt(Math.pow(this.x - p2.x, 2) + Math.pow(this.y - p2.y, 2));
}
Point.prototype.manhatan = function (p2) {
    if (p2.classname != this.classname) return null;
    return (p2.x - p1.x) + (p2.y - p1.y);
}
Point.prototype.multiply = function (scale) {
    this.x *= scale;
    this.y *= scale;
    return this;
}
Point.prototype.isNear = function (p2, offset) {
    if (p2.classname != this.classname) return false;
    return (this.x > p2.x - offset && this.x < p2.x + offset && this.y > p2.y - offset && this.y < p2.y + offset)
}

//----- RECT -----
function Rect(p1, p2) {
    this.p1 = (p1 == null || p1.classname != "Point") ? new Point() : p1;
    this.p2 = (p2 == null || p2.classname != "Point") ? new Point(10, 0) : p2;
    this.m = (this.p2.x == this.p1.x)?0:((this.p2.y - this.p1.y) / (this.p2.x - this.p1.x));
    this.n = this.p2.y - this.m * this.p2.x;
    GenericObject.call(this, "Rect");
}
Rect.prototype = new GenericObject();
Rect.prototype.getX = function (y) {
    if (y == null || isNaN(y)) return null;
    return (y - this.n) / this.m;
}
Rect.prototype.getY = function (x) {
    if (x == null || isNaN(x)) return null;
    return this.m * x + this.n;
}
Rect.prototype.isParallel = function (r2) {
    if (r2.classname != this.classname) return false;
    else return this.m == r2.m;
}

//---- BEZIER LINE ----
function BezierLine(bezierCurve) {
    this.bezierCurve = bezierCurve;
    GenericObject.call(this, "BezierLine");
}
BezierLine.prototype = new GenericObject();

//----- CIRCLE -----
function Circle(radius) {
    this.center = new Point();
    this.radius = (radius != null && !isNaN(radius)) ? radius : 1;
    GenericObject.call(this, "Circle");
}
Circle.prototype = new GenericObject();
Circle.prototype.getPositionByX = function (x) {
    if (x == null || isNaN(x)) return null;
    else return new Point(x, Math.sqrt(Math.pow(this.radius, 2) - Math.pow(x, 2)));
}
Circle.prototype.getPositionByAngle = function (angle) {
    if (angle == null || isNaN(angle)) return null;
    var x = this.center.x + this.radius * Math.cos(angle);
    var y = this.center.y + this.radius * Math.sin(angle);
    return new Point(x, y);
}

//----- RECTANGLE -----
function Rectangle(width, height) {
    this.width = (width != null && !isNaN(width)) ? width : 1;
    this.height = (height != null && !isNaN(height)) ? height : this.width;
    GenericObject.call(this, "Rectangle");
}
Rectangle.prototype = new GenericObject();

//----- POLYGON/STAR -----
function Polygon(radius, points, isStar, innerRadius) {
    this.isStar = (isStar != null) ? isStar : false;
    this.radius = (radius != null && !isNaN(radius)) ? radius : 5;
    this.innerRadius = (innerRadius != null && !isNaN(innerRadius)) ? innerRadius : ((isStar) ? (this.radius / 2) : this.radius);
    this.points = (points != null && !isNaN(points)) ? points : 5;
    this.circle = new Circle(this.radius);
    this.innerCircle = new Circle(this.innerRadius);
    if (this.points < 3) this.points = 3;
    GenericObject.call(this, "Polygon");
}
Polygon.prototype = new GenericObject();
Polygon.prototype.setRadius = function(r){
    this.radius = r;
    this.circle = new Circle(this.radius);
}
Polygon.prototype.setInnerRadius = function(r){
    this.innerRadius = r;
    this.innerCircle = new Circle(this.innerRadius);
}

//----- HEART -----
function Heart() {
    GenericObject.call(this, "Heart");
}
Heart.prototype = new GenericObject();
Heart.prototype.getPositionByAngle = function (angle) {
    if (angle == null || isNaN(angle)) return null;
    var x = 16 * Math.pow(Math.sin(angle), 3);
    var y = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
    return new Point(x, y);
}


//===== COLOR =====
//----- Color -----
function Color(r, g, b, a) {
    this.r = (r != null && !isNaN(r)) ? r : 0;
    this.g = (g != null && !isNaN(g)) ? g : 0;
    this.b = (b != null && !isNaN(b)) ? b : 0;
    this.a = (a != null && !isNaN(a)) ? a : 1;
    this.hex = this.toHex();
    GenericObject.call(this, "Color");
}
Color.prototype = new GenericObject();
Color.prototype.toHex = function () {
    var bin = this.r << 16 | this.g << 8 | this.b;
    return (function (h) {
        return "#" + new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
}
Color.prototype.toRGBA = function () {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
}
Color.prototype.setHex = function (hex) {
    this.r = hex >> 16;
    this.g = hex >> 8 & 0xFF;
    this.b = hex & 0xFF;
    this.hex = this.toHex();
}

//----- GRADIENT -----
function Gradient(colors, rect, radius1, radius2) {
    this.rect = (rect != null && (rect.constructor.name == "GenericObject" && rect.classname == "Rect")) ? rect : new Rect();
    this.colors = (colors != null && Array.isArray(colors)) ? colors : [];
    this.radius1 = (radius1 == null || isNaN(radius1)) ? 0 : radius1;
    this.radius2 = (radius2 == null || isNaN(radius2)) ? 0 : radius2;
    GenericObject.call(this, "Gradient");
}
Gradient.prototype = new GenericObject();
Gradient.prototype.addColor = function (color) {
    if (color.constructor.name == "GenericObject" && color.classname == "Color") {
        this.colors.push(color);
    }
}
Gradient.prototype.getGradient = function () {
    var grd = null;
    if (this.radius1 == 0 || this.radius2 == 0) {
        grd = ctx.createLinearGradient(this.rect.p1.x, this.rect.p1.y, this.rect.p2.x, this.rect.p2.y);
    } else {
        grd = ctx.createRadialGradient(this.rect.p1.x, this.rect.p1.y, this.radius1, this.rect.p2.x, this.rect.p2.y, this.radius2);
    }
    for (var i = 0; i < this.colors.length; i++) {
        grd.addColorStop(i, this.colors[i].toHex());
    }
    return grd;
}

//----------- BEZIER CURVE -----------
function BezierCurve(startPoint, controlPoint1, controlPoint2, endPoint, properties) {
    this.startPoint = (startPoint != null) ? startPoint : (new Point(100, 200));
    this.endPoint = (endPoint != null) ? endPoint : (new Point(200, 100));
    this.controlPoint1 = (controlPoint1 != null) ? controlPoint1 : (new Point(150, 200));
    this.controlPoint2 = (controlPoint2 != null) ? controlPoint2 : (new Point(200, 150));
    if (properties != null) this.setProperties(properties);
    GenericObject.call(this, "BezierCurve");
}
BezierCurve.prototype = new GenericObject();
BezierCurve.prototype.getPos = function (t) {
    var point = new Point();
    t2 = t * t
    t3 = t2 * t
    mt = 1 - t
    mt2 = mt * mt
    mt3 = mt2 * mt
    point.x = mt3 * this.startPoint.x + 3 * mt2 * t * this.controlPoint1.x + 3 * mt * t2 * this.controlPoint2.x + t3 * this.endPoint.x;
    point.y = mt3 * this.startPoint.y + 3 * mt2 * t * this.controlPoint1.y + 3 * mt * t2 * this.controlPoint2.y + t3 * this.endPoint.y;
    return point;
}


//===== PHYSICS =====
//----- Vector -----
function Vector(p1, p2, color) {
    this.p1 = (p1 != null && p1.constructor.name == "GenericObject" && p1.classname == "Point") ? p1 : new Point();
    this.p2 = (p2 != null && p2.constructor.name == "GenericObject" && p2.classname == "Point") ? p2 : new Point();
    this.rect = new Rect(p1, p2);
    this.origin = new Point();
    GenericObject.call(this, "Vector");
}
Vector.prototype = new GenericObject();
Vector.prototype.norm = function () {
    return this.p1.distance(this.p2);
}
Vector.prototype.component = function (axis) {
    switch (axis.toUpperCase()) {
    case "X":
        return this.p2.x - this.p1.x;
        break;
    case "Y":
        return this.p2.y - this.p1.y;
        break;
    }
}
Vector.prototype.toPoint = function (p) {
    if (p == null || p.constructor.name != "GenericObject" || p.classname != "Point") p = new Point();
    var d0x = this.p1.x - p.x;
    var d0y = this.p1.y - p.y;
    var p1n = new Point(this.p1.x - d0x, this.p1.y - d0y);
    var p2n = new Point(this.p2.x - d0x, this.p2.y - d0y);
    return new Vector(p1n, p2n);
}
Vector.prototype.toOrigin = function () {
    return this.toPoint(this.origin);
}
Vector.prototype.add = function (v2) {
    if (v2 == null || v2.constructor.name != "GenericObject" || v2.classname != "Vector") v2 = new Vector(new Point(), new Point());
    var v1c = this.toOrigin();
    var v2c = v2.toPoint(v1c.p2);
    var v = new Vector(v1c.p1, new Point(v1c.p1.x + v2c.p2.x, v1c.p1.y + v2c.p2.y));
    return v.toPoint(this.p1);
}
Vector.prototype.sub = function (v2) {
    if (v2 == null || v2.constructor.name != "GenericObject" || v2.classname != "Vector") v2 = new Vector(new Point(), new Point());
    var v1c = this.toOrigin();
    var v2c = v2.toOrigin();
    var vx = v1c.p2.x - v2c.p2.x;
    var vy = v1c.p2.y - v2c.p2.y;
    var v = new Vector(v1c.p1, new Point(vx, vy));
    return v.toPoint(this.p1);
}
Vector.prototype.dot = function (v2) {
    if (v2 == null || v2.constructor.name != "GenericObject" || v2.classname != "Vector") return null;
    var v1c = this.toOrigin();
    var v2c = v2.toOrigin();
    return v1c.p2.x * v2c.p2.x + v1c.p2.y * v2c.p2.y;
}
Vector.prototype.angleBetween = function (v2) {
    var v1c = this.toOrigin();
    var v2c = v2.toOrigin();
    return Math.acos(v1c.dot(v2c) / (v1c.norm() * v2c.norm()));
}
Vector.prototype.unit = function () {
    var v1c = this.toOrigin();
    var norm = v1c.norm();
    var v = new Vector(v1c.p1, new Point(v1c.p2.x / norm, v1c.p2.y / norm));
    return v.toPoint(this.p1);
}
Vector.prototype.zero = function () {
    return new Vector();
}
Vector.prototype.inverse = function (axis) {
    if (axis == null)
        return new Vector(this.p2, this.p1);
    else {
        var v1c = this.toOrigin();
        var v = new Vector();
        switch (axis.toUpperCase()) {
        case "X":
            v = new Vector(new Point(), new Point(-v1c.p2.x, v1c.p2.y));
            break;
        case "Y":
            v = new Vector(new Point(), new Point(v1c.p2.x, -v1c.p2.y));
            break;
        }
        return v.toPoint(this.p1);
    }
}


//===== GENERICOBJECT =====
function GenericObject(name) {
    this.classname = name;
}
GenericObject.prototype.clone = function () {
    var names = ["Point", "Rect", "Circle", "Rectangle", "Heart", "Polygon", "Shape", "Vector", "Color", "Gradient", "BezierCurve"];
    var objs = [new Point(), new Rect(), new Circle(), new Rectangle(), new Heart(), new Polygon(), new Shape(), new Vector(), new Color(), new Gradient(), new BezierCurve()];
    var copy = objs[names.indexOf(this.classname)];
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
            if (this[attr] != null && this[attr].constructor.name == "GenericObject") copy[attr] = (this[attr] != null) ? this[attr].clone() : null;
            else copy[attr] = this[attr];

        }
    }
    return copy;
}
GenericObject.prototype.equals = function (obj2) {
    var isEquals = true;
    if (this.classname != obj2.classname) return false;
    for (var attr in this) {
        if (this.hasOwnProperty(attr) && obj2.hasOwnProperty(attr)) {
            if (this[attr].constructor.name == "GenericObject" && obj2[attr].constructor.name == "GenericObject") {
                if (!this[attr].equals(obj2[attr])) isEquals = false;
            } else if (this[attr] != obj2[attr]) isEquals = false;
        }
    }
    return isEquals;
}
GenericObject.prototype.toString = function () {
    var str = this.classname + "{";
    for (var attr in this) {
        if (attr != "classname" && this.hasOwnProperty(attr)) {
            var obj2 = this[attr];
            var substr = "";
            if (obj2 != null && obj2.constructor.name == "GenericObject") substr = obj2.toString();
            else substr = this[attr];
            str += attr + ": " + substr + ",";
        }
    }
    str = str.substring(0, str.length - 1);
    str += "}";
    return str;
}
GenericObject.prototype.trace = function () {
    console.log(this.toString())
}