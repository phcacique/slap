var xobj = null,
    user = null,
    storyboard = null;
var canvas, ctx, showGesture = false;
var fps = 12,
    canvasWScale = 0.5;
var total_duration, interval;
var acc_time;

window.onload = function () {
    //?user=phcacique&id=52
    document.getElementById('cb_gesture').onchange = function () {
        showGesture = document.getElementById('cb_gesture').checked;
        //showFrame(storyboard.frames[current_frame]);
    }

    
    canvas = document.getElementById("canvas");
    var player = document.getElementById("player");
    canvas.width = window.innerWidth * canvasWScale;
    player.style.width = canvasWScale * 100 + "%";
    ctx = canvas.getContext('2d');
    resizeCanvas(1);
    showPreloader(true);
    var id = gup('id', window.location);
    var user = gup('user', window.location);

    var file = "http://pedrocacique.com/slap/restful/index.php/storyboard/" + user + "/" + id;
    xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) {
            if (xobj.status == "200") {
                startLoading(xobj.responseText);
            } else {
                showMessage("problema na conexão");
            }
        }
    };
    xobj.send(null);
};

window.onresize = function () {
    resizeCanvas(storyboard.info.frame_format);
    stopMovie();
}

function stopMovie() {
    tick = 0;
    current_frame = 0;
    pauseMovie(0);
}

function pauseMovie(t) {
    animFrame(storyboard.frames[0]);
    isPlaying = false;
    clearInterval(interval);
    var value = ((t / 1000) / (total_duration - 1)) * canvas.width - 10;
    if (value < 0) value = 0;
    document.getElementById("cursor").style.left = value + "px";
    document.getElementById('bar-active').style.width = value + "px";
    document.getElementById('but_play').innerHTML = "play_arrow";
}

function startLoading(content) {
    var json = JSON.parse(content);
    user = json.user;
    showUser(user);
    storyboard = json.storyboard;
    showStoryboardInfo(storyboard);

    if (storyboard.info.length == 0) showMessage("Storyboard não existe");
}

function showStoryboardInfo(storyboard) {
    console.log(storyboard);
    resizeCanvas(storyboard.info.frame_format);
    document.getElementById("title").innerHTML = storyboard.info.title;
    document.getElementById("last_update").innerHTML = storyboard.info.last_update;
    document.getElementById("description").innerHTML = storyboard.info.description;

    storyboard.info.cover_img = new Image();
    storyboard.info.cover_img.src = "http://" + storyboard.info.cover;

    document.getElementById('duration_play').innerHTML = parseTime(storyboard.info.duration);
    total_duration = storyboard.info.duration;

    fps = 1000 / storyboard.info.FPS;

    acc_time = [];
    for (var i = 0; i < storyboard.frames.length; i++) {
        if (acc_time.length == 0) acc_time.push(storyboard.frames[i].duration);
        else acc_time.push(acc_time[i - 1] + storyboard.frames[i].duration);
    }
    //    console.log("ACC_TIME", acc_time);

    var info = "<p>Duração: " + parseTime(total_duration) + "</p>";
    info += "<p>FPS: " + storyboard.info.FPS + "</p>";
    info += "<p>Quadros: " + storyboard.frames.length + "</p>";
    info += "<p>Formato: " + ((storyboard.info.frame_format == 1) ? "4:3" : "16:9") + "</p>";

    document.getElementById('info').innerHTML = info;
    setGestureInfo();
    loadImages();

}

var contImg = 0;


function setGestureInfo() {
    for (var i = 0; i < storyboard.frames.length; i++) {
        for (var j = 0; j < storyboard.frames[i].layers.length; j++) {
            if (storyboard.frames[i].layers[j].isGesture == 1) {
                for (var k = 0; k < storyboard.frames[i].layers[j].gestures.length; k++) {

                    var params = storyboard.frames[i].layers[j].gestures[k].params;
                    //--------- TRANSLATION -----------
                    if (storyboard.frames[i].layers[j].gestures[k].name == "translation") {
                        //Get params

                        var points = [];
                        for (var m = 0; m < params.length; m++) {
                            var str = params[m].value;
                            var value = str.substr(2, str.length - 3).split(',');
                            points.push(new Point(parseInt(value[0]), parseInt(value[1])));
                        }

                        var x1 = points[0].x;
                        var y1 = points[0].x;

                        var x2 = points[1].x;
                        var y2 = points[1].y;
                        var p1 = new Point(x1, y1);
                        var p2 = new Point(x2, y2);

                        if (storyboard.frames[i].layers[j].gestures[k].actionLayer != null) {
                            storyboard.frames[i].layers[j].gestures[k].step = (storyboard.frames[i].layers[j].gestures[k].step * canvas.width) / storyboard.frames[i].layers[storyboard.frames[i].layers[j].gestures[k].actionLayer].img.width;
                        }

                        storyboard.frames[i].layers[j].gestures[k].rect = new Rect((x1 < x2) ? p1 : p2, (x1 < x2) ? p2 : p1);


                        var step = (storyboard.frames[i].layers[j].gestures[k].rect.p2.x - storyboard.frames[i].layers[j].gestures[k].rect.p1.x) / ((storyboard.frames[i].duration + 2) * storyboard.info.FPS);


                        console.log('RECT', storyboard.frames[i].layers[j].gestures[k].rect);
                        console.log('STEP', step);


                        storyboard.frames[i].layers[j].gestures[k].step = step;
                        storyboard.frames[i].layers[j].gestures[k].position = storyboard.frames[i].layers[j].gestures[k].rect.p1;
                        console.log(storyboard.frames[i].layers[j].gestures[k].position);
                    }
                    //--------- ROTATION -----------
                    else if (storyboard.frames[i].layers[j].gestures[k].name == "Rotation") {
                        var angles = [];
                        for (var m = 0; m < params.length; m++) {
                            var str = params[m].value;
                            value = parseInt(str.substr(3, str.length - 3));
                            if (!isNaN(value))
                                angles.push(value);
                        }
                        storyboard.frames[i].layers[j].gestures[k].angles = angles;

                        var step = (Math.abs(angles[1] - angles[0])) / ((storyboard.frames[i].duration - 1) * fps);

                        storyboard.frames[i].layers[j].gestures[k].step = step;
                        storyboard.frames[i].layers[j].gestures[k].angle = 0 + angles[0];
                    }
                    //--------- CAMERA -----------
                    else if (storyboard.frames[i].layers[j].gestures[k].name == "Cam") {

                        storyboard.frames[i].layers[j].gestures[k].frameObjects = [];
                        for (var m = 0; m < params.length; m++) {
                            var str = params[m].value.split(',');
                            str[0] = str[0].substr(3, str[0].length - 1);
                            str[str.length - 1] = str[str.length - 1].substr(0, str[str.length - 1].length - 1);
                            storyboard.frames[i].layers[j].gestures[k].frameObjects.push({
                                x: parseInt(str[0]),
                                y: parseInt(str[1]),
                                width: parseInt(str[2]),
                                height: parseInt(str[3])
                            });
                        }

                        var frameObjects = storyboard.frames[i].layers[j].gestures[k].frameObjects;
                        storyboard.frames[i].layers[j].gestures[k].clipping = {
                            x: frameObjects[0].x,
                            y: frameObjects[0].y,
                            width: frameObjects[0].width,
                            height: frameObjects[0].height
                        };

                        storyboard.frames[i].layers[j].gestures[k].step = {
                            x: (Math.abs(frameObjects[1].x - frameObjects[0].x)) / ((storyboard.frames[i].duration) * fps),
                            y: (Math.abs(frameObjects[1].y - frameObjects[0].y)) / ((storyboard.frames[i].duration) * fps),
                            width: (Math.abs(frameObjects[1].width - frameObjects[0].width)) / ((storyboard.frames[i].duration) * fps),
                            height: (Math.abs(frameObjects[1].height - frameObjects[0].height)) / ((storyboard.frames[i].duration) * fps)
                        };

                        //console.log(storyboard.frames[i].layers[j].gestures[k].frameObjects);
                    }

                    storyboard.frames[i].layers[j].gestures[k].actionLayer = searchActionLayer(storyboard.frames[i].layers, j);

                }
            }
        }
    }
}

function searchActionLayer(layers, index) {
    var result = -1;
    for (var i = index - 1; i >= 0; i--) {
        if (layers[i].isGesture == 0) {
            result = i;
            break;
        }
    }

    return result;
}

function loadImages() {
    contImg = 0;
    for (var i = 0; i < storyboard.frames.length; i++) {
        for (var j = 0; j < storyboard.frames[i].layers.length; j++) {
            storyboard.frames[i].layers[j].img = new Image();
            storyboard.frames[i].layers[j].img.onload = function () {
                contImg++;
                if (contImg == storyboard.info.totalImages) {
                    startMovie();
                }
            }
            storyboard.frames[i].layers[j].img.src = "http://" + storyboard.frames[i].layers[j].image;
        }
    }
}

function startMovie() {
    showPreloader(false);

    document.getElementById('but_play').addEventListener('click', playMovie);
    document.getElementById('prev_frame').addEventListener('click', prevFrame);
    document.getElementById('next_frame').addEventListener('click', nextFrame);
    document.getElementById('cursor').addEventListener('mousedown', onCursorDown);


    for (var i = 0; i < storyboard.frames.length; i++) {
        for (var j = 0; j < storyboard.frames[i].layers.length; j++) {
            storyboard.frames[i].layers[j].offset = new Point(canvas.width, canvas.height);
            storyboard.frames[i].layers[j].size = new Point(0, 0);

            if (storyboard.frames[i].layers[j].isGesture == 0) {
                ctx.drawImage(storyboard.frames[i].layers[j].img, 0, 0, canvas.width, canvas.height);
                for (var m = 0; m < canvas.width; m++) {
                    for (var n = 0; n < canvas.height; n++) {
                        var data = ctx.getImageData(m, n, 1, 1).data;
                        if (data[3] != 0) {

                            if (m < storyboard.frames[i].layers[j].offset.x) storyboard.frames[i].layers[j].offset.x = m;
                            if (n < storyboard.frames[i].layers[j].offset.y) storyboard.frames[i].layers[j].offset.y = n;

                            if (m > storyboard.frames[i].layers[j].size.x) storyboard.frames[i].layers[j].size.x = m;
                            if (n > storyboard.frames[i].layers[j].size.y) storyboard.frames[i].layers[j].size.y = n;
                        }
                    }
                }
                storyboard.frames[i].layers[j].size.x -= storyboard.frames[i].layers[j].offset.x
                storyboard.frames[i].layers[j].size.y -= storyboard.frames[i].layers[j].offset.y
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    showFrame(storyboard.frames[0]);
}

function onCursorDown() {
    if (isPlaying = true) {
        pauseMovie(tick);
        showFrame(storyboard.frames[look4current((Math.floor(tick / 1000) + 2))]);
        window.addEventListener('mousemove', onCursorMove);
        window.addEventListener('mouseup', onCursorUp);
    }
}

function prevFrame() {
    pauseMovie();
    if (current_frame > 0) current_frame--;
    showFrame(storyboard.frames[current_frame]);
    var time = 0;
    if (current_frame > 0) time = acc_time[current_frame - 1];
    showBarTime(time);
}

function nextFrame() {
    pauseMovie();
    if (current_frame < storyboard.frames.length - 1) current_frame++;
    showFrame(storyboard.frames[current_frame]);
    var time = 0;
    if (current_frame > 0) time = acc_time[current_frame - 1];
    showBarTime(time);
}

function showBarTime(time) {
    var x = (canvas.width * time) / total_duration;
    document.getElementById('cursor').style.left = x + "px";
    document.getElementById('bar-active').style.width = x + "px";
    document.getElementById('duration_play').innerHTML = parseTime(time);
}

function onCursorMove(event) {
    if (event.clientX > window.innerWidth * 0.1 && event.clientX < window.innerWidth * 0.9 - 10) {
        var value = (event.clientX - window.innerWidth * 0.1);
        document.getElementById('cursor').style.left = value + "px";
        document.getElementById('bar-active').style.width = value + "px";

        var time = Math.floor((total_duration + 1) * (event.clientX - window.innerWidth * 0.1) / (canvas.width));
        showFrame(storyboard.frames[look4current(time)]);
        document.getElementById('duration_play').innerHTML = parseTime(time);
    }
}

function onCursorUp(event) {
    window.removeEventListener('mousemove', onCursorMove);
}

function look4current(time) {
    var c = 0;
    if (time >= total_duration) c = acc_time.length - 1;
    else
        for (var i = 0; i < acc_time.length; i++) {
            if (time > acc_time[i]) {
                c++;
            } else break;
        }
    return c;
}

var tick = 0;
var isPlaying = false;
var current_frame = 0;

function playMovie() {

    if (document.getElementById('duration_play').innerHTML == parseTime(total_duration)) {
        stopMovie();
    }
    showFrame(storyboard.frames[current_frame]);
    var value = document.getElementById("cursor").offsetLeft - (canvas.width * (1 - canvasWScale / 2));
    tick = (((value + 10) / canvas.width) * (total_duration - 1)) * 1000;
    //    tick = 0;

    if (!isPlaying) {
        interval = setInterval(startInterval, 1000 / fps);
        document.getElementById('but_play').innerHTML = "pause";
    } else {
        clearInterval(interval);
        document.getElementById('but_play').innerHTML = "play_arrow";
    }
    isPlaying = !isPlaying;
}

function startInterval() {
    tick += 1000 / fps;
    while (Math.floor(tick / 1000) + 1 < 1) {
        tick += 1000 / fps;
    }
    document.getElementById('duration_play').innerHTML = parseTime(Math.floor(tick / 1000) + 1);

    var value = ((tick / 1000) / (total_duration - 1)) * canvas.width - 10;

    if (value > canvas.width - 10) value = canvas.width - 10;
    if (value < 0) value = 0;
    document.getElementById("cursor").style.left = value + "px";
    document.getElementById('bar-active').style.width = value + "px";


    if ((Math.floor(tick / 1000) + 2) > acc_time[current_frame]) {
        if (current_frame < storyboard.frames.length - 1) current_frame++;
        if ((Math.floor(tick / 1000) + 2) <= total_duration) showFrame(storyboard.frames[current_frame]);
    }

    animFrame(storyboard.frames[current_frame]);

    if (Math.floor(tick / 1000) == total_duration - 1) {
        clearInterval(interval);
        tick = 0;
        current_frame = 0;
        isPlaying = false;
        document.getElementById('but_play').innerHTML = "play_arrow";
    }


}

function animFrame(frame) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var hasGesture = false;
    for (var j = 0; j < frame.layers.length; j++) {
        frame.layers[j].isOnScreen = false;
    }

    for (var j = 0; j < frame.layers.length; j++) {
        for (var k = 0; k < frame.layers[j].gestures.length; k++) {
            frame.layers[frame.layers[j].gestures[k].actionLayer].isOnScreen = true;
        }
    }
    for (var j = 0; j < frame.layers.length; j++) {
        if (frame.layers[j].isGesture == 1) {
            hasGesture = true;
            for (var k = 0; k < frame.layers[j].gestures.length; k++) {

                //--------- TRANSLATION -----------
                if (frame.layers[j].gestures[k].name == "translation") {

                    var x = frame.layers[j].gestures[k].position.x;
                    
                    if (frame.layers[j].gestures[k].position.x <= frame.layers[j].gestures[k].rect.p1.x || frame.layers[j].gestures[k].position.y <= frame.layers[j].gestures[k].rect.p1.y) x = frame.layers[j].gestures[k].rect.p1.x;
                    

                    x += frame.layers[j].gestures[k].step;
                    var y = frame.layers[j].gestures[k].rect.getY(x);

                    if (x > frame.layers[j].gestures[k].rect.p2.x || y > frame.layers[j].gestures[k].rect.p2.y) {
                        x = frame.layers[j].gestures[k].rect.p2.x;
                        y = frame.layers[j].gestures[k].rect.p2.y;
                    }

                    frame.layers[j].gestures[k].position = new Point(x, y);

                    //                    console.log(x,y,frame.layers[j].gestures[k].step);

                    var offset = frame.layers[frame.layers[j].gestures[k].actionLayer].offset;
                    showImage('translation', frame.layers[frame.layers[j].gestures[k].actionLayer].img, x - offset.x, y - offset.y);

                }
                //--------- ROTATION -----------
                else if (frame.layers[j].gestures[k].name == "Rotation") {
                    frame.layers[j].gestures[k].angle += frame.layers[j].gestures[k].step;
                    var offset = frame.layers[frame.layers[j].gestures[k].actionLayer].offset;
                    var size = frame.layers[frame.layers[j].gestures[k].actionLayer].size;
                    showImage('rotation', frame.layers[frame.layers[j].gestures[k].actionLayer].img, offset.x, offset.y, frame.layers[j].gestures[k].angle, size.x, size.y);
                }
                //--------- CAMERA -----------
                else if (frame.layers[j].gestures[k].name == "Cam") {

                    var step = frame.layers[j].gestures[k].step;
                    frame.layers[j].gestures[k].clipping.x += frame.layers[j].gestures[k].step.x;
                    frame.layers[j].gestures[k].clipping.y += frame.layers[j].gestures[k].step.y;
                    frame.layers[j].gestures[k].clipping.width += frame.layers[j].gestures[k].step.width;
                    frame.layers[j].gestures[k].clipping.height += frame.layers[j].gestures[k].step.height;

                    showImage('cam', frame.layers[frame.layers[j].gestures[k].actionLayer].img, 0, 0, null, 0, 0, frame.layers[j].gestures[k].clipping);
                }

            }
        } else {
            if (!frame.layers[j].isOnScreen) showImage(null, frame.layers[j].img, 0, 0);
        }
    }

    if (!hasGesture) {
        for (var j = 0; j < frame.layers.length; j++) {
            if (frame.layers[j].isGesture == 0) {
                showImage(null, frame.layers[j].img, 0, 0);
            }
        }
    }

}

function showFrame(frame) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < frame.layers.length; i++) {
        if (frame.layers[i].isGesture == 0 || (frame.layers[i].isGesture == 1 && showGesture))
            showImage(null, frame.layers[i].img);
        if (frame.layers[i].isGesture == 1) {
            for (var j = 0; j < frame.layers[i].gestures.length; j++) {
                if (frame.layers[i].gestures[j].name == "translation") {
                    frame.layers[i].gestures[j].position = frame.layers[i].gestures[j].rect.p1.clone();
                    animFrame(frame);
                }
                if (frame.layers[i].gestures[j].name == "Rotation") {
                    frame.layers[i].gestures[j].angle = frame.layers[i].gestures[j].angles[0];
                    animFrame(frame);
                }
                if (frame.layers[i].gestures[j].name == "Cam") {

                    var frameObjects = frame.layers[i].gestures[j].frameObjects;

                    frame.layers[i].gestures[j].clipping = {
                        x: frameObjects[0].x,
                        y: frameObjects[0].y,
                        width: frameObjects[0].width,
                        height: frameObjects[0].height
                    };
                }
            }
        }
    }
}

function showPreloader(value) {
    document.getElementById("preloader").style.display = (value) ? "block" : "none";
}

function showUser(user) {
    document.getElementById("author-name").innerHTML = user.username;
    document.getElementById("author-email").innerHTML = user.email;
    document.getElementById("useravatar").src = "http://" + user.avatar;
}

function showMessage(msg) {
    console.log(msg);
}

function showImage(type, img, x, y, angle, w, h, clip) {
    if (x == null) x = 0;
    if (y == null) y = 0;
    if (angle == null) angle = 0;
    if (type == null) type = '';

    if (x > canvas.width) x = canvas.width;
    if (y > canvas.height) y = canvas.height;

    //    x = (x * canvas.width) / img.width;
    //    y = (y * canvas.height) / img.height;

    //    console.log(new Point(x, y));
    canvas.style.backgroundColor = "#fff";
    if (type == 'rotation') {
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-(x + w / 2), -(y + h / 2));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        //        ctx.beginPath();
        //        ctx.arc(x+w/2,y+h/2,2,0,Math.PI);
        //        ctx.fill();
        ctx.restore();
    } else
    if (type == 'cam') {
        x = (clip.x * canvas.width) / img.width;
        y = (clip.y * canvas.height) / img.height;
        w = (clip.width * canvas.width) / img.width;
        h = (clip.height * canvas.height) / img.height;
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
    } else if (type == 'translation') {
        x = (x * canvas.width) / img.width;
        y = (y * canvas.height) / img.height;
        console.log(x, y);
        ctx.drawImage(img, x, y, canvas.width, canvas.height);
    } else {
        ctx.drawImage(img, x, y, canvas.width, canvas.height);
    }

}


function resizeCanvas(ff) {
    canvas.width = window.innerWidth * canvasWScale;
    if (ff == 1) canvas.height = 3 * canvas.width / 4;
    else if (ff == 2) canvas.height = 9 * canvas.width / 16;
}

function parseTime(sec) {
    var min = 0;
    var hour = 0;
    if (sec > 60) {
        min = Math.floor(sec / 60);
        sec = sec - min * 60;
    }
    if (min > 60) {
        hour = Math.floor(min / 60);
        min = min - hour * 60;
    }

    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;
    if (hour > 0 && hour < 10) hour = "0" + hour;

    if (hour > 0) return hour + ":" + min + ":" + sec;
    else return min + ":" + sec;
}

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}