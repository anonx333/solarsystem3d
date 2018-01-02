var img={};

var sun;
var mercury;
var venus;
var earth;
var mars;
var jupiter;
var saturn;
var uranus;
var neptune;

var pluto;
var pause = false;
var asteroid = [];


function getRelativeDiameter(x){
/* get relative diameter of the planet relative to earth */
	var temp = (5 / 12756) * x;
	return temp;
}

function getRelativeSpin(x){
/* get relative spin of the planet relative to earth */
	var temp = (5/24) * x;
	return temp;
}

function getReleativeDays(x){
/* get relative speed of the planet relative to earth */
	var temp = ( 365 / x ) * 0.01;
	return temp;
}

function getRelativeShortDistance( x){
/* get shorter orbit distance relative to earth*/
	var temp = ( 80 / 147.1) * x;
	return temp;
	
}

function getRelativeDistance(x){
/* get longer orbit distance relative to earth */
	var temp = ( 100 / 152.6) * x;
	return temp;
	
}

function getAngleDeg(ax,ay,bx,by) {
/* get angle between two lines */
  var angleRad = Math.atan((ay-by)/(ax-bx));
  var angleDeg = angleRad * 180 / Math.PI;
  return(angleDeg);
}


function heavenlyBody(n,r,a,b,dip,s,spin,ring,ringangle){
/* 
n= name
r= radius
a= long orbit length
b= shorter orbit length

d = dip of the heavenlyBody
speed = speed of the heavenlyBody
spin = rotation of the heavenlyBody

*/

this.name = n;
img[n] = loadImage("assets/"+n +".jpg");
this.radius = getRelativeDiameter(r);
this.a = getRelativeDistance(a);
this.b = getRelativeShortDistance(b);
this.dip = dip;
this.speed = getReleativeDays(s);
this.spin = getRelativeSpin(spin);
this.xcoord = this.a / 2;
this.ycoord = 0; 
this.zcoord = this.b / 2;
this.time = 0;
this.ring = ring;
this.ringangle = radians(ringangle);

this.time = (Math.random() * (2000 - 200)) + 200 ;


this.pcoord = [];

this.orbit = function(){
	push();
	//translate(0,this.ycoord,0);
	rotateX(radians(90));
	var sb = this.b / this.a ;
	scale(1, sb);
	fill(200);
	torus(this.a,0.1,50,30);
	pop();
};

this.update = function(){
	var theta = getAngleDeg(0,0,this.xcoord,this.zcoord);
	this.xcoord = (this.a / 1.415) * cos(this.time) - (this.b / 1.415 )* sin(this.time);
	this.zcoord = (this.a / 1.415) * cos(this.time) + (this.b / 1.415) * sin(this.time);
	
	var deg = ((315) * (Math.PI/180));
	var tempX = (this.xcoord * cos(deg)) - (this.zcoord * sin(deg));
	var tempZ = (this.zcoord * cos(deg)) + (this.xcoord * sin(deg));
	
	this.xcoord = tempX;
	this.zcoord = tempZ;
	this.ycoord = this.zcoord - (this.zcoord / this.dip);
	
	this.time = this.time + this.speed;
	
	this.pcoord.push([this.xcoord,this.ycoord + this.radius / 2,this.zcoord]);
	
	if(this.pcoord.length > 500)
	{
		this.pcoord.shift();
	}
	
	for (var i = 0; i < this.pcoord.length; i++)
	{
		this.pcoord[i][1] = this.pcoord[i][1] + 10; 
	}
	
};

this.show = function (){
	texture(img[this.name]);
	push();
	translate(this.xcoord,this.ycoord,this.zcoord);
	rotateY(this.time * this.spin);
	if(this.ring)
		{
			push();
			rotateX(this.ringangle);
			ellipsoid(this.radius + (this.radius * 0.6), 1,this.radius +(this.radius * 0.6));
			pop();
		}
	
	sphere(this.radius);
	pop();
	
};


}



function asteroid_create(){
/* create asteroid belt */
	var temp_asteroid;
	for (var i = 0; i < 150; i ++)
	{
		var ascolor = [255, 152, 89];
		temp_asteroid = new heavenlyBody("Asteroid" ,800 + (Math.random() * (500 - 200)) + 200 , 300 + (Math.random() * (80 - 10)) + 10, 280 + (Math.random() * (70 - 10)) + 10 , 1 + (Math.random()*(0.3-0.01)) + 0.01 , 10000 + (Math.random() * (400 - 200)) + 200, 24,false,90);
		
		asteroid.push(temp_asteroid);
	}
	
}

function asteroid_update(){
/* update asteroid belt */
	for(var i = 0; i<asteroid.length ; i ++)
	{
		asteroid[i].update();
	}
}

function asteroid_show(){
/* display asteroid belt */
	for(var i = 0; i<asteroid.length ; i ++)
	{
		asteroid[i].show();
	}
}

function setup(){
var w = window.innerWidth - 30;
var h = window.innerHeight - 30;
  createCanvas(w, h, WEBGL);
  bkimg = loadImage("assets/milkyway.jpg");
  sun = new heavenlyBody("sun",50000,0,0,1,365,-10,false,0);
  
  /* name, diameter, a, b, dip, days,spin,ring,ringangle */
  
  mercury = new heavenlyBody("mercury",4879,69.8,46,1,88,24,false,90);
  venus = new heavenlyBody("venus",12104,108.9,107.5,1,225,24,false,90);
  earth = new heavenlyBody("earth",12756,152.6,147.1,1,365,24,false,90);
  mars = new heavenlyBody("mars",6792,249.2,206.6,1,687,24,false,90);
  
  asteroid_create();
  
  jupiter = new heavenlyBody("jupiter",72984,500,450,1,4380,24,false,90);
  saturn = new heavenlyBody("saturn",60536,800,700,1,10767.5,24,true,5);
  uranus = new heavenlyBody("uranus",40118, 1200,900,1,30660,24,true,90);
  neptune = new heavenlyBody("neptune",30528,1500,1000,1,59800,24,true,28.32);
  pluto = new heavenlyBody("pluto",5000,1900,1500,1,90520,24,false,5);

}

function draw(){
  background(10);
  var camerapos = (document.getElementById("camerapos").value) * -1;
  camera(0,0,camerapos,0,0,0,0,0,0);
  var xangle = document.getElementById("xscroll").value;
  var yangle = document.getElementById("yscroll").value;
  push();
	
	rotateX(radians(xangle/10));
	rotateY(radians(yangle/100));
	texture(bkimg);
	translate(0,0,-1000);
	plane(5000,3000);
  pop();
  ambientLight(150);
  pointLight(200, 200, 200, 0, 0, 0);

  push();
  
  rotateX(radians(xangle));
  rotateY(radians(yangle));
  var orbitshow = document.getElementById("orbitshow").checked;
  if (orbitshow)
  {
	  mercury.orbit();
	  venus.orbit();
	  earth.orbit();
	  mars.orbit();
	  jupiter.orbit();
	  saturn.orbit();
	  uranus.orbit();
	  neptune.orbit();
	  pluto.orbit();
  }
   
  sun.show();
  mercury.show();
  earth.show();
  venus.show();
  mars.show();
  
  asteroid_show();
  
  jupiter.show();
  saturn.show();
  uranus.show();
  neptune.show();
  pluto.show();
  
  if(!pause){
	   mercury.update();
  sun.update();
  earth.update();
  venus.update();
  mars.update();
  
  asteroid_update();
  
  jupiter.update();
  saturn.update();
  uranus.update();
  neptune.update();
  pluto.update();
  }
 
  pop();
}

function pausescreen(){
	if(pause){
		pause = false;
		document.getElementById("pausebutton").value = "Pause";
	}
	else{
		pause = true;
		document.getElementById("pausebutton").value = "Play";
	}
}