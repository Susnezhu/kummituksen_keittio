
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

        //Alunperin paikka missä const centerSpotX, lisää tänne takaisin jos ei pysty olemaan globaalissa

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
        
        if (needleY >= greenZone.y && needleY <= greenZone.y + greenZone.height){
            alert(`success! You hit the green!`);
            gameActive = false;
            
            html_layout.style.display = 'grid';
            canvas.style.display = 'none';
            minipeli_button.style.display = "none";
        } else {
            speed -= 2;
            alert(`missed! Tries left: ${maxTries - tries}`);
            if (tries >= maxTries){
                alert(`all tries used, failed to mix.`);
                gameActive = false;

                html_layout.style.display = 'grid';
                canvas.style.display = 'none';
                minipeli_button.style.display = "none";

            }
        }
    }
}
