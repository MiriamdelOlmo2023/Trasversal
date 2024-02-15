var table = document.getElementById("tableroTabla");
var bet = 0;
const eventoGenerarTirada = new Event("generarTiradaTrue");
var generarTirada = false;
var hotAndCold = [];
var numTiradas = 0;
//AUDIOS
var bgMusic = new Audio("source/sonidos/bgMusic.mp3");
var letsgo = new Audio("source/sonidos/letsgo.m4a");
var monedas = new Audio("source/sonidos/monedas.mp3");
var ficha = new Audio("source/sonidos/ficha.mp3");
var muerte = new Audio("source/sonidos/muerte.mp3");
var risaLuigi = new Audio("source/sonidos/risaLuigi.mp3");
var switch1 = new Audio("source/sonidos/switch1.mp3");
var switch2 = new Audio("source/sonidos/switch2.mp3");
var indignao = new Audio("source/sonidos/indignao.mp3");
var ohno = new Audio("source/sonidos/oh no.mp3");
var oye = new Audio("source/sonidos/oye.mp3");
var yahoo = new Audio("source/sonidos/yahoo.mp3");
var mamamia = new Audio("source/sonidos/mamamia.mp3");

setInterval(actualizarReloj, 1000);

table.addEventListener('click', function(event) {
    if (event.target.tagName === 'TD') {
        var cellId = event.target.id;
        colocarFichas(cellId);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    cuentaAtras();
    inicializarPorcentajes();
});

document.getElementById("borrarApuesta").addEventListener("click", function() {
    risaLuigi.currentTime = 0;
    risaLuigi.play();
    
    var parrafo = document.getElementById("bet");
    var texto = parrafo.textContent;
    var numero = texto.split(":")[1].trim();

    if(numero !== ""){
        var fichasTxt = document.getElementById("fichasTotales").innerHTML;
        var numeroFichas = fichasTxt.match(/\d+/) !== null ? parseInt(fichasTxt.match(/\d+/)[0], 10) : 0;
        document.getElementById("fichasTotales").innerHTML = "FICHAS: "+ (numeroFichas + parseInt(numero));
        mostrarGifAleatorio(2000, "source/gifs/clap.gif")
    }
   ocultarFichas();
});

document.addEventListener("generarTiradaTrue", function() {
    if(generarTirada){
        var numAleatorio = Math.floor(Math.random() * 37);
        var imgCasilla = document.getElementById("fichaCasilla"+numAleatorio);
        var ganancia = 0;

        //gana apuesta interna
        if(imgCasilla.hidden == false){
            var apuesta = document.getElementById("cantFichaNum"+numAleatorio).innerHTML;
            ganancia = ganancia + (apuesta * 35);
        }

        //apuestas externas
        //1st 12
        var cas1st12 = document.getElementById("fichaCasilla1st12");
        if(numAleatorio<13 && numAleatorio>0 && cas1st12.hidden == false){
            var apuesta = document.getElementById("cantFichaNum1st12").innerHTML;
            ganancia = ganancia + (apuesta * 3);
        }

        //2nd 12
        var cas2nd12 = document.getElementById("fichaCasilla2nd12");
        if(numAleatorio>12 && numAleatorio<25 && cas2nd12.hidden == false){
            var apuesta = document.getElementById("cantFichaNum2nd12").innerHTML;
            ganancia = ganancia + (apuesta * 3);
        }

        //3rd 12
        var cas3rd12 = document.getElementById("fichaCasilla3rd12");
        if(numAleatorio>24 && numAleatorio<37 && cas3rd12.hidden == false){
            var apuesta = document.getElementById("cantFichaNum3rd12").innerHTML;
            ganancia = ganancia + (apuesta * 3);
        }

        //1 to 18
        var cas1to18 = document.getElementById("fichaCasilla1to18");
        if(numAleatorio>0 && numAleatorio<19 && cas1to18.hidden == false){
            var apuesta = document.getElementById("cantFichaNum1to18").innerHTML;
            ganancia = ganancia + (apuesta * 2);
        }

        //19 to 36
        var cas19to36 = document.getElementById("fichaCasilla19to36");
        if(numAleatorio>18 && cas19to36.hidden == false){
            var apuesta = document.getElementById("cantFichaNum19to36").innerHTML;
            ganancia = ganancia + (apuesta * 2);
        }

        if((numAleatorio%2)==0){
            if(document.getElementById("fichaCasillaEVEN").hidden == false){//EVEN
                var apuesta = document.getElementById("cantFichaNumEVEN").innerHTML;
                ganancia = ganancia + (apuesta * 2);
            }
        }

        if((numAleatorio%2)!=0){
            if(document.getElementById("fichaCasillaODD").hidden == false){//ODD
                var apuesta = document.getElementById("cantFichaNumODD").innerHTML;
                ganancia = ganancia + (apuesta * 2);
            }
        }
        var color = ""
        if(document.getElementById(numAleatorio).classList.contains("red")){//ROJO
            var apuesta = document.getElementById("cantFichaNumceldaRoja").innerHTML;
            ganancia = ganancia + (apuesta * 2);
            color = "rojo";
        }

        if(document.getElementById(numAleatorio).classList.contains("black")){//NEGRO
            var apuesta = document.getElementById("cantFichaNumceldaNegra").innerHTML;
            ganancia = ganancia + (apuesta * 2);
            color = "negro";
        }

        //2 to 1
        if ((numAleatorio - 1) % 3 === 0) {//fila 3
            if(document.getElementById("fichaCasilla2to1.3").hidden == false){
                var apuesta = document.getElementById("cantFichaNum2to1.3").innerHTML;
                ganancia = ganancia + (apuesta * 3);
            }
        } else if ((numAleatorio - 2) % 3 === 0) {//fila 2
            if(document.getElementById("fichaCasilla2to1.2").hidden == false){
                var apuesta = document.getElementById("cantFichaNum2to1.2").innerHTML;
                ganancia = ganancia + (apuesta * 3);
            }
        } else {//fila 1
            if(document.getElementById("fichaCasilla2to1.1").hidden == false){
                var apuesta = document.getElementById("cantFichaNum2to1.1").innerHTML;
                ganancia = ganancia + (apuesta * 3);
            }
        }
        var fichasTxt = document.getElementById("fichasTotales").innerHTML;
        var numeroFichas = fichasTxt.match(/\d+/) !== null ? parseInt(fichasTxt.match(/\d+/)[0], 10) : 0;
        document.getElementById("fichasTotales").innerHTML = "FICHAS: "+ (numeroFichas + ganancia);
        if(ganancia>0){
            mostrarGanancia(ganancia);
            monedas.currentTime = 0;
            monedas.play();
        }
        numTiradas++;
        mostrarImagenRuleta(color);
        actualizarHotAndCold(numAleatorio);
        ocultarFichas();
        iluminarCelda(numAleatorio);
        mostrarUltimosNumeros(numAleatorio);
        cuentaAtras();
    }
});

function iluminarCelda(numAle){
    var celda = document.getElementById(numAle);
    var duracion = 800;

    function alternarBrillo() {
        celda.classList.toggle('brillante');
    }

    var intervalo = setInterval(alternarBrillo, 200);

    setTimeout(function () {
        clearInterval(intervalo);
        celda.classList.remove('brillante');
    }, duracion);
}

function mostrarGanancia(ganancia){
    document.getElementById("winner").innerHTML="+"+ganancia;
    setTimeout(function () {
        document.getElementById("winner").style.opacity = 0;
        setTimeout(function () {
            document.getElementById("winner").textContent = '';
        }, 1000);
    }, 2000);
    document.getElementById("winner").style.opacity = 1;
    var numeroAleatorio = Math.floor(Math.random() * 3) + 1;
    mostrarGifAleatorio(2000, "source/gifs/baile"+numeroAleatorio+".gif");
}

function ocultarFichas(){
        for(var i=0; i<37; i++){//numeros
            document.getElementById("cantFichaNum"+i).innerHTML = "";
            document.getElementById("fichaCasilla"+i).hidden = true;
        }

        for(var i=1; i<4; i++){//2 to 1
            document.getElementById("cantFichaNum2to1."+i).innerHTML = "";
            document.getElementById("fichaCasilla2to1."+i).hidden = true;
        }

        //docenas
        document.getElementById("cantFichaNum1st12").innerHTML = "";
        document.getElementById("fichaCasilla1st12").hidden = true;

        document.getElementById("cantFichaNum2nd12").innerHTML = "";
        document.getElementById("fichaCasilla2nd12").hidden = true;

        document.getElementById("cantFichaNum3rd12").innerHTML = "";
        document.getElementById("fichaCasilla3rd12").hidden = true;

        //ultima fila
        document.getElementById("cantFichaNum1to18").innerHTML = "";
        document.getElementById("fichaCasilla1to18").hidden = true;

        document.getElementById("cantFichaNumEVEN").innerHTML = "";
        document.getElementById("fichaCasillaEVEN").hidden = true;

        document.getElementById("cantFichaNumceldaRoja").innerHTML = "";
        document.getElementById("fichaCasillaceldaRoja").hidden = true;

        document.getElementById("cantFichaNumceldaNegra").innerHTML = "";
        document.getElementById("fichaCasillaceldaNegra").hidden = true;

        document.getElementById("cantFichaNumODD").innerHTML = "";
        document.getElementById("fichaCasillaODD").hidden = true;

        document.getElementById("cantFichaNum19to36").innerHTML = "";
        document.getElementById("fichaCasilla19to36").hidden = true;
        
        //vaciar bet
        bet = 0;
        document.getElementById("bet").innerHTML = "BET: ";
}

var ultimosNumeros = [];

function mostrarUltimosNumeros(numAle) {
    var ultNumeros = "";
    for (var i = ultimosNumeros.length - 1; i >= 0; i--) {
        ultNumeros += ultimosNumeros[i] + " ";
    }
    if (ultimosNumeros.length > 5) {
        ultimosNumeros.shift();
    }

    ultimosNumeros.push(numAle);
    document.getElementById("ultimoNumero").innerHTML = numAle;
    document.getElementById("lastNums").innerHTML = ultNumeros;
}

function cuentaAtras() {
    const progressBar = document.querySelector(".ProgressBar-percentage");
    let timeLeft = 30000;

    function updateProgressBar() {
        const progressWidth = (timeLeft / 30000) * 100;
        progressBar.style.width = `${progressWidth}%`;
    }

    function countdown() {
        if (timeLeft > 0) {
            timeLeft -= 10;
            updateProgressBar();
            setTimeout(countdown, 10);
        } else {
            generarTirada = true;
            document.dispatchEvent(eventoGenerarTirada);
        }
    }

    document.getElementById("jugarYa").addEventListener("click", function() {
        letsgo.volume = 0.7;
        letsgo.currentTime = 0;
        letsgo.play();
        timeLeft = 0;
        updateProgressBar();
    });

    countdown();
}


function colocarFichas(cellId) {
    if(!cellId.includes("celdaVacia")){
        var cantidadASumar = 0;
        var pElement = document.getElementById("cantFichaNum" + cellId);
        
        //COMPROBAR FICHA SELECCIONADA
        var fichaSeleccionada = document.getElementById("fichasCantidadIMG");
        var src = fichaSeleccionada.src;
        var nombreArchivo = src.substring(src.lastIndexOf("/") + 1);
    
        switch (nombreArchivo) {
            case "100.png":
                cantidadASumar=100;
                break;
    
            case "50.png":
                cantidadASumar=50;
                break;
    
            case "25.png":
                cantidadASumar=25;
                break;
    
            case "10.png":
                cantidadASumar=10;
                break;
    
            case "5.png":
                cantidadASumar=5;
                break;
    
            case "1.png":
                cantidadASumar=1;
                break;
        }
    
        var fichasTxt = document.getElementById("fichasTotales").innerHTML;
        var numeroFichas = fichasTxt.match(/\d+/) !== null ? parseInt(fichasTxt.match(/\d+/)[0], 10) : 0;
    
        if(numeroFichas>=cantidadASumar){
            var p = 0;
    
            if (pElement) {
                p = (parseInt(pElement.innerHTML, 10) || 0) + cantidadASumar;
                bet = bet + cantidadASumar;
            } else {
                p = cantidadASumar;
            }
            if (pElement) {
                pElement.innerHTML = p;
            }
            if (p >= 1) {
                var img = document.getElementById("fichaCasilla"+cellId);
    
                if(img){
                    img.hidden = false;
                    if (p >= 100) {
                        img.src = "source/100.png";
                    } else if (p >= 50) {
                        img.src = "source/50.png";
                    } else if (p >= 25) {
                        img.src = "source/25.png";
                    } else if (p >= 10) {
                        img.src = "source/10.png";
                    } else if (p >= 5) {
                        img.src = "source/5.png";
                    } else if (p >= 1) {
                        img.src = "source/1.png";
                    }
                }
                ficha.volume = 0.5;
                ficha.currentTime = 0;
                ficha.play();
                document.getElementById("fichasTotales").innerHTML = "FICHAS: "+ (numeroFichas - cantidadASumar);
                document.getElementById("bet").innerHTML = "BET: " + bet;
                if((numeroFichas - cantidadASumar)==0){
                    mostrarGifAleatorio(2000, "source/gifs/miedo.gif")
                    mamamia.currentTime = 0;
                    mamamia.volume = 0.5;
                    mamamia.play();
                }
            }
        } else {
            muerte.currentTime = 0;
            muerte.play();
            window.alert("No tienes fichas suficientes");
        } 
    }
}

function actualizarReloj() {
    var miFecha = new Date();
    var texto = document.getElementById("reloj");
    var mins = miFecha.getMinutes()<10? "0"+miFecha.getMinutes() : miFecha.getMinutes();
    texto.innerHTML = miFecha.getHours() + ":" + mins;
}

function aumentarImagen() {
    var imagen = document.getElementById("fichasCantidadIMG");
    var src = imagen.src;
    var nombreArchivo = src.substring(src.lastIndexOf("/") + 1);

    switch (nombreArchivo) {
        case "1.png":
            imagen.src = "source/fichasMenu/5.png";
            break;

        case "5.png":
            imagen.src = "source/fichasMenu/10.png";
            break;

        case "10.png":
            imagen.src = "source/fichasMenu/25.png";
            break;

        case "25.png":
            imagen.src = "source/fichasMenu/50.png";
            break;

        case "50.png":
            imagen.src = "source/fichasMenu/100.png";
            break;
    }
    switch1.volume = 0.8;
    switch1.currentTime = 0;
    switch1.play();
}

function reducirImagen() {
    var imagen = document.getElementById("fichasCantidadIMG");
    var src = imagen.src;
    var nombreArchivo = src.substring(src.lastIndexOf("/") + 1);

    switch (nombreArchivo) {
        case "100.png":
            imagen.src = "source/fichasMenu/50.png";
            break;

        case "50.png":
            imagen.src = "source/fichasMenu/25.png";
            break;

        case "25.png":
            imagen.src = "source/fichasMenu/10.png";
            break;

        case "10.png":
            imagen.src = "source/fichasMenu/5.png";
            break;

        case "5.png":
            imagen.src = "source/fichasMenu/1.png";
            break;
    }
    switch2.volume = 0.5;
    switch2.currentTime = 0;
    switch2.play();
}
//Modal retirar
function openModalRetirar() {
    document.getElementById('modalRetirar').style.display = 'block';
    document.getElementById('modal-overlayRetirar').style.display = 'block';
    indignao.currentTime = 0;
    indignao.volume = 0.5;
    indignao.play();
}

function closeModalRetirar() {
    document.getElementById('modalRetirar').style.display = 'none';
    document.getElementById('modal-overlayRetirar').style.display = 'none';
}

function acceptRetirar() {
    var cant = document.getElementById("inputRetirarFichas").value;
    var fichasTxt = document.getElementById("fichasTotales").innerHTML;
    var numeroFichas = fichasTxt.match(/\d+/) !== null ? parseInt(fichasTxt.match(/\d+/)[0], 10) : 0;
    if(!isNaN(cant) &&  cant<=numeroFichas && cant != ""){
        document.getElementById("fichasTotales").innerHTML = "FICHAS: "+ (parseInt(numeroFichas) - parseInt(cant));
        closeModalRetirar();
        mostrarGifAleatorio(2000, "source/gifs/nojao.gif")
        oye.currentTime = 0;
        oye.volume = 0.5;
        oye.play();
    } else {
        window.alert("Ingresa un número válido");
    }    
}
//Modal Ingresar
function openModalIngresar() {
    document.getElementById('modalIngresar').style.display = 'block';
    document.getElementById('modal-overlayIngresar').style.display = 'block';
}

function closeModalIngresar() {
    document.getElementById('modalIngresar').style.display = 'none';
    document.getElementById('modal-overlayIngresar').style.display = 'none';
}

function acceptIngresar() {
    var cant = document.getElementById("inputIngresarFichas").value;
    if(!isNaN(cant) && cant != ""){
        var fichasTxt = document.getElementById("fichasTotales").innerHTML;
        var numeroFichas = fichasTxt.match(/\d+/) !== null ? parseInt(fichasTxt.match(/\d+/)[0], 10) : 0;
        document.getElementById("fichasTotales").innerHTML = "FICHAS: "+ (parseInt(numeroFichas) + parseInt(cant));
        closeModalIngresar();
        mostrarGifAleatorio(2000, "source/gifs/felis.gif");
        yahoo.currentTime = 0;
        yahoo.volume = 0.5;
        yahoo.play();
    } else {
        window.alert("Ingresa un número válido");
    }    
}

function actualizarHotAndCold(numAle){
    hotAndCold[numAle]++;
    var cold = [];
    var hot = [];
    var porcentajes = [];

    for (var i = 0; i < hotAndCold.length; i++) {
        var porcentaje = (hotAndCold[i] / numTiradas) * 100;
        porcentajes.push({ numero: i, porcentaje: porcentaje });
    }
    
    porcentajes.sort(function(a, b) {
        return a.porcentaje - b.porcentaje;
    });
    
    var cold = porcentajes.slice(0, 5);
    var hot = porcentajes.slice(-5).reverse();

    var coldString = "", hotString = "";
    for(var i = 0; i<5; i++){
        coldString += cold[i].numero + ' ';
        hotString += hot[i].numero + ' ';
    }
    
    document.getElementById("coldNums").innerHTML = "COLD: " + coldString;
    document.getElementById("hotNums").innerHTML = "HOT: " + hotString;
}

function inicializarPorcentajes() {
    for(var i=0; i<37; i++){
        hotAndCold.push(0);
    }
}

function musicaFondo(){
    bgMusic.volume = 0.4;
    bgMusic.loop = true;
    if (bgMusic.paused) {
        bgMusic.play();
        mostrarGifAleatorio(2000, "source/gifs/dab.gif")
    } else {
        bgMusic.pause();
        mostrarGifAleatorio(2000, "source/gifs/agobiao.gif")
    }
}

function mostrarGifAleatorio(duracion, ruta) {
    var gifElement = document.createElement('img');  
    gifElement.src = ruta;
    gifElement.style.position = 'absolute';
    var randomX = Math.floor(Math.random() * (window.innerWidth - 150));
    var randomY = Math.floor(Math.random() * (window.innerHeight- 150));
    gifElement.style.left = randomX + 'px';
    gifElement.style.top = randomY + 'px';

    document.body.appendChild(gifElement);

    setTimeout(function() {
      document.body.removeChild(gifElement);
    }, duracion);
}

function mostrarImagenRuleta(color) {
    var superpuestaImg = document.getElementById("superpuestaImg");
    var numeroAleatorio = Math.floor(Math.random() * 3) + 1;
    if(color == "negro"){
        superpuestaImg.src = "source/opcionesRuleta/ruletaImgNegro"+numeroAleatorio+".png"; 
        superpuestaImg.classList.remove("oculta");
        superpuestaImg.style.opacity = 1;
    } else if(color == "rojo"){
        superpuestaImg.src = "source/opcionesRuleta/ruletaImgRojo"+numeroAleatorio+".png"; 
        superpuestaImg.classList.remove("oculta");
        superpuestaImg.style.opacity = 1;
    }

    setTimeout(function () {
        superpuestaImg.style.opacity = 0;
        setTimeout(function () {
            superpuestaImg.classList.add("oculta");
        }, 500);
    
    }, 1000);
}