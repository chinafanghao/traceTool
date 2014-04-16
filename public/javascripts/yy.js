var yyy={
	toAll:function(){
		document.getElementById("all").src = document.getElementById("all").src.replace('White','Grey');
		document.getElementById("current").src = document.getElementById("current").src.replace('Grey','White');
		document.getElementById("Constraints_0").style.display="block";
		document.getElementById("Constraints_1").style.display="block";
		document.getElementById("Constraints_4").style.display="block";
	},
	toCurrent:function(){
		document.getElementById("current").src = document.getElementById("current").src.replace('White','Grey');
		document.getElementById("all").src = document.getElementById("all").src.replace('Grey','White');	
		document.getElementById("Constraints_0").style.display="none";
		document.getElementById("Constraints_1").style.display="none";
		document.getElementById("Constraints_4").style.display="none";
	}
}