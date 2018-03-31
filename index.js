var main = {
	init : function() {
		main.mines = [];
		main.totalMines = 0;
		main.totalFlags = 0;
		main.totalVisible = 0;
		main.probabilityPercent = 20;
		main.size = 10;
		main.initArrayMines();
		main.createBoard();
		main.load();
	},
	createBoard : function() {
		// Header
		var headerCont = document.createElement("div");
		headerCont.id="headerCont";
		var header = document.createElement("div");
		header.id="header";
		var smile = document.createElement("div");
		smile.id="smile";
		smile.addEventListener("click",main.restart);
		var counter = document.createElement("div");
		counter.id="counter";
		header.appendChild(counter);
		header.appendChild(smile);
		headerCont.appendChild(header);
		document.body.appendChild(headerCont);
		// Board
		var board = document.createElement("div");
		board.id="board";
		for (var i = 0; i < main.size; i++) {
			for (var j = 0; j < main.size; j++) {
				var cel = document.createElement("div");
				cel.className = "celNew";
				cel.x=i;
				cel.y=j;
				cel.id="cel"+i+","+j;
				cel.addEventListener("mousedown",main.celTrigger);
				var d = Math.random();
				if(d < main.probabilityPercent * 0.01) {
					cel.isMine=true;
					main.totalMines++;
				} else {
					cel.isMine=false;
				}
				cel.flag=false;
				cel.visible=false;
				main.mines[i][j]=0;
				board.appendChild(cel);
			}
		}
		document.body.appendChild(board);
		document.getElementById("counter").innerText=main.totalMines;
	},
	celTrigger : function(e) {
		if(e.which==1) {
			if(this.flag){
				return;
			}
			if(this.isMine) {
				this.className+=" celMineExploded";
				main.gameOver();
			} else {
				if(this.visible) {
					main.triggerNumber(this);
				} else {
					main.displayNum(this);
				}
				
			}
		} else if(e.which==2) {
			if(this.visible){
				return;
			}
			if(this.flag) {
				this.className=this.className.replace(" celFlag","");
				this.flag=false;
				main.totalFlags--;
			} else {
				this.className+=" celFlag";
				this.flag=true;
				main.totalFlags++;
			}
		}
		if(main.totalVisible==((main.size*main.size)-main.totalMines) && main.totalMines == main.totalFlags){
			main.winner();
		}
		document.getElementById("counter").innerText=main.totalMines-main.totalFlags;
	},
	displayNum : function(cel) {
		if(cel.visible || cel.flag){
			return;
		}
		cel.visible=true;
		main.totalVisible++;
		cel.className+=" celPressed";
		var mines = main.mines[cel.x][cel.y];
		if(mines==0) {
			main.exploreArea(cel.x,cel.y,function(cel) {
				if(!cel.isMine){
					main.displayNum(cel);
				}
			});
		} else {
			cel.innerText=mines==0?"":mines;
			cel.className+=" cel"+mines;
		}
	},
	triggerNumber : function(cel){
		var flagged=0;
		var i=-1;
		var j=-1;
		while(j!=2) {
			if(i==0&&j==0){
				i++;
				continue;
			}
			if(document.getElementById("cel"+(cel.x+i)+","+(cel.y+j))) {
				if(document.getElementById("cel"+(cel.x+i)+","+(cel.y+j)).flag){
					flagged++;
				}
			}
			if(i==1) {
				i=-2;
				j++
			}
			i++;
		}
		if(flagged==main.mines[cel.x][cel.y]){
			main.exploreArea(cel.x,cel.y,function(cel) {
				main.displayNum(cel);
				/*var event = new Event('mousedown', {
					'bubbles': true,
					'cancelable': true,
					'which' : 1
				});
				cel.dispatchEvent(event);*/
			});
		}
	},
	exploreArea : function(x,y,callback) {
		var i=-1;
		var j=-1;
		while(j!=2) {
			if(i==0&&j==0){
				i++;
				continue;
			}
			var cel = document.getElementById("cel"+(x+i)+","+(y+j));
			if(cel) {
				callback(cel);
			}
			if(i==1) {
				i=-2;
				j++
			}
			i++;
		}
	},
	load : function() {
		for (var i = 0; i < main.size; i++) {
			for (var j = 0; j < main.size; j++) {
				main.exploreArea(i,j,function(cel){
					if(cel.isMine){
						main.mines[i][j]++;
					}
				});
			}
		}

	},
	winner : function() {
		console.log("winner");
		document.getElementById("smile").className+=" smileWin";
	},
	gameOver : function() {
		for (var i = 0; i < main.size; i++) {
			for (var j = 0; j < main.size; j++) {
				var cel = document.getElementById("cel"+i+","+j);
				cel.removeEventListener("click",main.celTrigger);
				if(cel.isMine && !cel.flag) {
					cel.className += " celMine";
				} else{
					main.displayNum(cel);
				}
			}
		}
		document.getElementById("smile").className+=" smileDead";
	},
	restart : function() {
		document.body.innerHTML="";
		main.init();
	},
	initArrayMines : function(){
		for (var i = 0; i < 10; i++) {
			main.mines[i]=new Array(10);
		}
	},
	mines : [],
	totalMines: 0,
	totalFlags: 0,
	totalVisible: 0,
	probabilityPercent: 0,
	size: 0
}