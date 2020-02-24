var config = {
  people_count: 80,
  distance_margin: 5,
};
var model = {};
var control = {};

var colors = ["red", "blue", "green", "cyan", "magenta", "khaki", "gold", "royalblue", "thistle", "yellow", "firebrick", "purple"];

function shuffle(array) {
  for(var i = array.length - 1; i > 0; i--){
    var r = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
}
function initModel() {
  model.people = [];
  for(var i = 0; i < config.people_count; i++) {
    model.people[i] = {
      id: i,
      x: Math.random() * 400 + 50,
      y: Math.random() * 400 + 50,
      size: 20,
      color: colors[i % colors.length],
      target: [],
    };
    var targets = [];
    for(var ii = 0; ii < config.people_count; ii++) {
      if(i == ii) {
        continue;
      }
      targets.push(ii);
    }
    shuffle(targets);
    model.people[i].target[0] = targets[0];
    model.people[i].target[1] = targets[1];
  }
}

function draw() {
  var ctx = control.context;
  ctx.clearRect(0, 0, 500, 500);

  for(var i in model.people) {
    var p = model.people[i];
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'black';
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = p.color;
    ctx.fill();

    for(var j in p.target) {
      var t = p.target[j];
      ctx.beginPath();
      ctx.strokeStyle = p.color;
      ctx.setLineDash([2,4]);
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(model.people[t].x, model.people[t].y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}


function cal_dir(p, t1, t2) {
  // 線分t1-t2の中点で直行する直線にpから垂線を下ろし、その垂線に沿って距離1移動する
  // a = t2.x - t1.x
  // b = t2.y - t1.y
  // cx = (t1.x + t2.x) / 2
  // cy = (t1.y + t2.y) / 2
  // n = a(x - cx) + b(y - cy)
  // dx = -na
  // dy = -nb
  var n = (t2.x - t1.x) * (p.x - (t1.x + t2.x) / 2) + (t2.y - t1.y) * (p.y - (t1.y + t2.y) / 2);

  var dx = -n * (t2.x - t1.x);
  var dy = -n * (t2.y - t1.y);
  var d = Math.sqrt(dx ** 2 + dy ** 2);
  return [dx / d, dy / d];
}

function update() {
  for(var i in model.people) {
    var p = model.people[i];
    var t1 = model.people[p.target[0]];
    var t2 = model.people[p.target[1]];

    var d1 = Math.sqrt((p.x - t1.x) ** 2 + (p.y - t1.y) ** 2);
    var d2 = Math.sqrt((p.x - t2.x) ** 2 + (p.y - t2.y) ** 2);
    if(Math.abs(d1 - d2) < config.distance_margin) {
      continue;
    }

    d = cal_dir(p, t1, t2);
    p.x += d[0];
    p.y += d[1];
  }
  draw();
}

function start() {
  var canvas = document.getElementById('cnvs');
  if (!canvas.getContext) {
    return;
  }

  control.context = canvas.getContext('2d');

  initModel();
  setInterval(update, 100);
}