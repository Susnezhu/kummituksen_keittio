
const canvas = document.getElementById("canvas");

if (canvas.getContext){
    
    window.onload = function() {
        html_layout.style.display = 'grid'; //Tärkeä, ei voi olla block.
        canvas.style.display = 'none';
        minipeli_button.style.display = "none";
    };

    const ctx = canvas.getContext("2d");
    const stop = document.getElementById("minipeli_button");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Global values nuolen liikuttamista varten, mutta tällähetkellä estää minipeliä näkymästä
    const centerSpotX = canvas.width / 2; //Jos vielä bugaa, vieä tämä takaisin mistä sen otit
    let meterY = canvas.height / 2;
    let meterHeight = 530;
    let needleY = meterY - 100; //^Näitä 3 arvoa voi muuttaa myöhemmin tarpeen tullen

    const needleTop = meterY -360;
    const needleBottom = meterY -360 + meterHeight;

    let speed = 7;
    let direction = -1;
    let gameActive = true;
    let tries = 0;
    let tries2 = 3;
    const maxTries = 3;
    const greenZone = {
    y: meterY - 140, height: 90
    }

    // handle space key to stop needle. Need to be in global region, not within animation function
    window.addEventListener("keydown", (e) => {
        const pressedKey = e.code;
        
        if (pressedKey === "Space"){
            stopNeedle();
        }
    });

    stop.addEventListener("click", stopNeedle);

    //called via button press "mix pot", then calls the main animation function
    function startTheMiniGame(){
        choosedIngredients.innerHTML = ""; //tämä puhdistaa näytön valituista kuvista

        gameActive = true;
        speed = 7;
        tries = 0;
        needleY = meterY - 100;
        
        html_layout.style.display = 'none';
        canvas.style.display = "block";
        minipeli_button.style.display = "block";
        
        animateMix(); //animation start
    }
    
    //draw the pictures, then move to animate function
    function animateMix(){        
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //draw white area
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(centerSpotX - 140, meterY - 390, 290, 600);
        
        //draw meter/red
        ctx.fillStyle = "rgb(225, 72, 51)";
        ctx.fillRect(centerSpotX - 80, meterY - 360, 170, meterHeight);

        //green area
        ctx.fillStyle = "rgb(83, 220, 101)"
        ctx.fillRect(centerSpotX - 80, greenZone.y, 170, greenZone.height);
        ctx.closePath();

        //Move needle here
        needleY += speed * direction;
        if (needleY <= needleTop || needleY >= needleBottom) {
            direction *= -1;
        }

        //needle draw
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerSpotX - 200, needleY);
        ctx.lineTo(centerSpotX + 130, needleY);
        ctx.stroke();
        
        requestAnimationFrame(animateMix);
    }
    
    //check if needle is in green zone
    function stopNeedle(){
        if (!gameActive) return
        
        tries++;
        
        if (needleY >= greenZone.y && needleY <= greenZone.y + greenZone.height) {

            document.getElementById("yritysmaara").textContent = "";
            minipeli_button.style.display = "none";

            sekoitus_teksti.style.display = "block";
            yritysmaara.style.display = "none";
            
            let greenMessage = document.getElementById("sekoitus_teksti");
            greenMessage.style.color = "rgb(110, 255, 141)";
            greenMessage.style.fontSize = "35px";
            greenMessage.textContent = "Onnittelut, osuit vihreään!";

            gameActive = false;
            setTimeout(function() {
                
                html_layout.style.display = 'grid';
                canvas.style.display = 'none';
                minipeli_button.style.display = "none";
                sekoitus_teksti.style.display = "none";
                yritysmaara.style.display = "none";
            }, 3000);
            
            tries2 = 3;
            document.getElementById("yritysmaara").textContent = `${tries2} yritystä jäljellä.`;
            reviewRecipe(); //kutsutaan funktio mikä on toisessa JS tiedostossa
        } 
        else {
            speed -= 2;
            new Audio("sounds/lose.mp3").play();
            
            let yritykset = document.getElementById("sekoitus_teksti");
            yritykset.style.fontSize = "30px";
            yritykset.style.color = "rgb(222, 80, 80)";
            yritykset.textContent = "Ohi meni!"
            document.getElementById("yritysmaara").style.color = "rgb(222, 80, 80)";
            document.getElementById("yritysmaara").style.fontSize = "30px";
            document.getElementById("yritysmaara").textContent = `${tries2 - 1} yritystä jäljellä.`;

            sekoitus_teksti.style.display = "block";
            yritysmaara.style.display = "block";
            tries2 -= 1;

            if (tries >= maxTries){

                minipeli_button.style.display = "none";
                new Audio("sounds/gameover.mp3").play();

                let yritykset = document.getElementById("sekoitus_teksti");
                document.getElementById("yritysmaara").textContent = "";
                yritykset.style.color =  "rgb(222, 80, 80)";
                yritykset.style.fontSize = "30px";
                yritykset.textContent = "Yritykset loppuivat, miksaus epäonnistui!"
                
                gameActive = false;
                setTimeout(function() {
                    
                    html_layout.style.display = 'grid';
                    canvas.style.display = 'none';
                    sekoitus_teksti.style.display = "none";
                    yritysMaara = document.getElementById("yritysmaara");
                    yritysMaara.textContent = `${tries2} yritystä jäljellä.`;
                    yritysmaara.style.display = "none";

                    tries2 = 3;
            }, 3000);
                
            }
        }
    }
}