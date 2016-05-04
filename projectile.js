var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function drawCanvas(projectile, starting_pos, target_pos){
  ctx.beginPath();
  ctx.fillStyle = player.colour;
  ctx.arc(player.current_pos[0],player.current_pos[1],player.radius,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();
  if(starting_pos != null && target_pos != null){
    ctx.beginPath();
    ctx.strokeStyle = projectile.tail_colour;
    ctx.moveTo(starting_pos[0], starting_pos[1]);
    ctx.lineTo(starting_pos[0] + target_pos[0], starting_pos[1] + target_pos[1]);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = projectile.colour;
    ctx.arc(starting_pos[0] + target_pos[0], starting_pos[1] + target_pos[1], 3,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

var create_projectile = function(starting_pos, click_pos){
  this.starting_pos = starting_pos, //Your unit location, where the projectile starts
  this.click_pos = click_pos,
  this.opp_1 = this.click_pos[0] - this.starting_pos[0] //The opposite side from your player, to where you have clicked
  this.adj_1 = this.click_pos[1] - this.starting_pos[1] //The adjacent side from your player, to where you have clicked
  this.angle = 0,  //Between your unit, the hypotenuse (the bullet's path) and the adjacent side.
  this.target_pos = [], //Bullet's target destination
  this.range = 250, //Maximum distance
  this.steps = 12, //Number of times the bullet will appear
  this.steps_taken = 0, //How many times has this projectile appeared?
  this.colour = '#cc0000',
  this.tail_colour = '#ccccff'
  this.init = function(){
    this.angle = Math.atan2(this.opp_1,this.adj_1); //Tan is a ratio between the opposite and adjacent. Note, javascript works with radians. to find degrees, times radians by ```* 180/Math.Pi
    this.target_pos[0] = Math.sin(this.angle) * this.range; //sin is a ratio between hypotenuse and opposite
    this.target_pos[1] = Math.cos(this.angle) * this.range; //cos is a ratio between hypotenuse and adjacent
  },
  this.init()
}

var player = {
  current_pos: [300,300],
  radius: 10,
  colour: '#000',
  projectiles: [],
  fire_projectile: function(click_pos){
    var new_projectile = new create_projectile(this.current_pos, click_pos);
    this.projectiles.push(new_projectile);
  }
}

function getCursorPosition(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  return [+x, +y];
}

canvas.addEventListener('click', function(ev) {
  ev.preventDefault();
  var click_pos = getCursorPosition(canvas, ev);
  player.fire_projectile(click_pos);
});

//If I had more time to spend on this, I'd use requestAnimationframe instead of setInterval
setInterval(function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(player.projectiles.length > 0){
    for(var i = 0; i < player.projectiles.length; i++){
      var new_ratio_hyp_xy = player.projectiles[i].steps_taken / player.projectiles[i].steps;
      var new_x = player.projectiles[i].target_pos[0] * new_ratio_hyp_xy;
      var new_y = player.projectiles[i].target_pos[1] * new_ratio_hyp_xy;
      var old_x = 300;
      var old_y = 300;
      drawCanvas(player.projectiles[i], [old_x, old_y], [new_x, new_y]);
      player.projectiles[i].steps_taken ++;
    }
    //Removes projectiles that have ran their limit. You could add a condition to check if projectiles have hit their target.
    for(var j = 0; j < player.projectiles.length; j++){
      if(player.projectiles[j].steps_taken > player.projectiles[j].steps){
        player.projectiles.splice(j,1);
      }
    }    
  } else {
    drawCanvas(null, null, null); //Draw the player object at least
  }
}, 40);