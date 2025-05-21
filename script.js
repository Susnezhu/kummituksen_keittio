const canvas = document.getElementById("canvas");

if (canvas.getContext){

    console.log("testi");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    function functionMix(){

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 100, 100);
        ctx.closePath();
    }
}