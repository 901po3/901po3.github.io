var player = document.getElementById("player");
var background = document.getElementById("backgroundOne");
var scene = document.getElementById("stageOne");

var width = 500;
var height = 500;
background.style.width = width + "px";
background.style.height = height + "px";

var playerAllive = true;
var playerSpeed = 4;
var playerX = 250;
var playerY = 250;
var playerSizeX = 10;
var playerSizeY = 10;
var playerOffSetX = playerSizeX / 2;
var playerOffSetY = playerSizeY / 2;
player.style.width = playerSizeX + "px";
player.style.height = playerSizeY + "px";
player.style.left = playerX - playerOffSetX;
player.style.top = playerY - playerOffSetY;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var enemyFromTop = 0;
var enemyFromRight = 1;
var enemyFromBottom = 2;
var enemyFromLeft = 3;

	

var enemies = new Array();
var enemyRises = new Array();
var enemyRuns = new Array();
var enemyCnt = 0;
var enemySize = 10;
var enemyStarPoint;
var maxEnemy = 750;

setEnemy();

function setEnemy()
{
	for(var i = 0; i < maxEnemy; i++)
	{
		document.write("<div class = 'enemy' id = '"+i+"'></div>");
		enemies[i] = document.getElementById(i);
		scene.appendChild(enemies[i]);	
		enemies[i].style.position = "absolute";
		enemies[i].style.left = 0 + "px";
		enemies[i].style.top = 0 + "px";
		enemies[i].style.width = enemySize + "px";
		enemies[i].style.height = enemySize + "px";
		enemies[i].style.backgroundColor = background.style.backgroundColor;
		console.log(enemies[i]);
	}
}

window.onload = function(){
	
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	
	var updateInterval = setInterval(Update , 15);
	var enemyInterval = setInterval(enemyUpdate,50);
	
	function enemyPrompt()
	{
		if(enemyCnt > 500) return;
		if( (Math.random() * 10) > 7.5) return;
		
		var enemyType = (Math.floor(Math.random() * 4));
		
		var enemySpeed = (Math.floor(Math.random() * 6))+3;
		var run = 0;
		var rise = 0;
		
		while(rise + run != enemySpeed)
			if(Math.floor(Math.random() * 2))
				rise++;
			else
				run++;
			
		if(Math.floor(Math.random() * 2) == 0)
			rise = rise *-1;

		if( enemyType == 0 || enemyType == 1)
		{
			enemyStarPoint = Math.floor(Math.random() * (height - enemySize));
			enemies[enemyCnt].style.top = enemyStarPoint + "px";
			
			if(enemyType == 0) //from left
				enemies[enemyCnt].style.left = 0 + "px";
			else if(enemyType == 1) //from right;
			{
				enemies[enemyCnt].style.left = (width - enemySize) + "px";
				run *= -1;
			}
		}
		else if(enemyType == 2|| enemyType == 3)
		{
			enemyStarPoint = Math.floor(Math.random() * (width - enemySize));
			enemies[enemyCnt].style.left = enemyStarPoint + "px";
			var temp = run;
				run = rise;
				rise = temp;
				
			if(enemyType == 2) //from top
			{
				enemies[enemyCnt].style.top = 0 + "px"
			}
			else if(enemyType == 3)//from bottom
			{
				enemies[enemyCnt].style.top = (height - enemySize) + "px"
				rise *= -1;
			}
		}
			
		enemies[enemyCnt].style.backgroundColor = "black";
		enemyRises[enemyCnt] = rise;
		enemyRuns[enemyCnt++] = run;
	}
	
	function moveEnemy()
	{
		for(var i = 0; i < enemyCnt; i ++)
		{			
			if(enemies[i].backgroundColor == background.style.backgroundColor)
				continue;
			
			var curY = parseInt(enemyRises[i]) + parseInt(enemies[i].style.top);
			var curX = parseInt(enemyRuns[i]) + parseInt(enemies[i].style.left)
			if(curX >= 0 && curX <= width && curY >= 0 && curY <= height)
			{
				enemies[i].style.top = curY + "px";
				enemies[i].style.left = curX + "px";
			}	
			else
			{
				enemies[i].style.backgroundColor = background.style.backgroundColor;
			}
		}
	}
	
	function movePlayer()
	{
		if(leftPressed && playerX - playerSpeed >= 0)
			playerX -= playerSpeed;
		if(rightPressed && playerX + playerSpeed <= width - playerOffSetX )
			playerX += playerSpeed;
		if(upPressed && playerY - playerSpeed >= 0)
			playerY -= playerSpeed;
		if(downPressed && playerY + playerSpeed <= height - playerOffSetY)
			playerY += playerSpeed;
		
		player.style.top = playerY + "px";
		player.style.left = playerX + "px";
	}
	
	function collisionCheck()
	{
		for(var i = 0; i < enemyCnt; i++)
		{
			if(enemies[i].backgroundColor == background.style.backgroundColor)
				continue;
			
			var ememyLeft = parseInt(enemies[i].style.left) - 5;
			var enemyRight = ememyLeft + enemySize;
			var enemyTop = parseInt(enemies[i].style.top) - 5;
			var enemyBottom = enemyTop + enemySize;
			
			var playerLeft = playerX - playerOffSetX;
			var playerRight = playerX + playerOffSetX;
			var playerTop = playerY - playerOffSetY;
			var playerBottom = playerY + playerOffSetY;
			
			if((enemyRight >= playerLeft &&
				ememyLeft <= playerRight &&
				enemyTop <= playerBottom&& 
				enemyBottom >= playerTop))
				{
					console.log("collided");
					stopGame();
				}
		}
	}
	
	function onKeyDown(event)
	{
		switch(event.keyCode)
		{
			case 65: // A
				leftPressed = true; 
				break;
			case 68: // D
				rightPressed = true;
				break;
			case 87: // W
				upPressed = true;
				break;
			case 83: // S
				downPressed = true;
				break;
		}
	}
	
	function onKeyUp(event)
	{
		switch(event.keyCode)
		{
			case 65: // A
				leftPressed = false; 
				break;
			case 68: // D
				rightPressed = false;
				break;
			case 87: // W
				upPressed = false;
				break;
			case 83: // S
				downPressed = false;
				break;
		}
	}
	
	
	function Update()
	{
		movePlayer();
		collisionCheck();
		if(enemyCnt == maxEnemy)
		{
			stopGame();
			alert("YOU WIN");
		}			
	}
	
	function enemyUpdate()
	{
		enemyPrompt();
		moveEnemy();
	}
	
	
	function stopGame()
	{
		clearInterval(updateInterval);
		clearInterval(enemyInterval);
	}
}