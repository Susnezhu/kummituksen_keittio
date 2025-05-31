const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const needleStopBtn = document.getElementById("minipeli_button");
const minigameWindow = document.getElementById("canvasDiv");
const html_layout = document.getElementById("html_layout");
const tries_text = document.getElementById("yritysmaara");
const mixing_text = document.getElementById("sekoitus_teksti");

const helpWindow = document.getElementById("helpWindow");

//ottaa domilla elementin pois näytöltä
function displayNone(object, value=true) {
    if (value) {
        object.style.display = "none";
    } else {
        object.style.display = "block"; //jos false laittaa esille
    }
}
//piilottaa domilla elementin näkyvyyden
function visabilityHidden(object, value=true) {
    if (value) {
        object.style.visibility = "hidden";
    } else {
        object.style.visibility = "visible"; //jos false laittaa esille
    }
}

displayNone(helpWindow);
displayNone(minigameWindow);
visabilityHidden(tries_text);
visabilityHidden(mixing_text)

if (canvas.getContext){ //tarkistaa toimiikoo canvas käyttäjän selaimessa
    
    window.onload = function() {
        html_layout.style.display = 'grid'; //Tärkeä, ei voi olla block
    };

    canvas.width = 600;
    canvas.height = 550;

    //Global values nuolen liikuttamista varten, mutta tällähetkellä estää minipeliä näkymästä
    const centerSpotX = canvas.width / 2; //Jos vielä bugaa, vieä tämä takaisin mistä sen otit
    let meterY = canvas.height / 2 + 100;
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

    needleStopBtn.addEventListener("click", stopNeedle); //pysäytys nappula painaessa kutsuu funtion stopNeedle

    
    //called via button press "mix pot", then calls the main animation function
    function startTheMiniGame(){
        choosedIngredients.innerHTML = ""; //tämä puhdistaa näytön valituista kuvista

        gameActive = true;
        speed = 7;
        tries = 0;
        needleY = meterY - 100;
        
        displayNone(html_layout);
        displayNone(minigameWindow, false);
        visabilityHidden(needleStopBtn, false)
        visabilityHidden(tries_text);
        visabilityHidden(mixing_text)

        
        animateMix(); //animation start
    }
    
    //draw the pictures, then move to animate function
    function animateMix(){        
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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

            mixing_text.style.color = "rgb(110, 255, 141)";
            mixing_text.textContent = "Onnittelut, osuit vihreään!";

            visabilityHidden(needleStopBtn);
            visabilityHidden(mixing_text, false);
            visabilityHidden(tries_text);

            gameActive = false;
            setTimeout(function() {
                
                html_layout.style.display = 'grid';
                displayNone(minigameWindow)
                visabilityHidden(needleStopBtn, false)
            }, 1000);
            
            tries2 = 3;
            tries_text.textContent = `${tries2} yritystä jäljellä.`;
            reviewRecipe(); //kutsutaan funktio mikä on toisessa JS tiedostossa
        } 
        else {
            speed -= 2;
            new Audio("sounds/lose.mp3").play();
            
            mixing_text.style.color = "rgb(222, 80, 80)";
            mixing_text.textContent = "Ohi meni!";
            tries_text.textContent = `${tries2 - 1} yritystä jäljellä.`;

            visabilityHidden(mixing_text, false);
            visabilityHidden(tries_text, false);
            tries2 -= 1;

            if (tries >= maxTries){

                visabilityHidden(minipeli_button)
                new Audio("sounds/gameover.mp3").play();

                tries_text.style.color =  "rgb(222, 80, 80)";
                tries_text.textContent = "Yritykset loppuivat, miksaus epäonnistui!";
                visabilityHidden(tries_text, false)
                
                gameActive = false;
                setTimeout(function() {
                    tries2 = 3;
                    
                    html_layout.style.display = 'grid';

                    tries_text.textContent = `${tries2} yritystä jäljellä.`;

                    displayNone(minigameWindow)
                    visabilityHidden(mixing_text, false);
                    visabilityHidden(tries_text, false);
                    visabilityHidden(needleStopBtn, false)
            }, 1000);
                
            }
        }
    }
} else {
    console.log("canvas ei toimi nykyisessä selaimessa")
}

//Help Window, show image you made, and place text on top of it via <p> element
function showHelpWindow() {
    
    displayNone(html_layout)
    displayNone(minigameWindow)
    
    displayNone(helpWindow, false)
}

function poistuHelpWindow() {
    html_layout.style.display = "grid";
    displayNone(helpWindow)
}