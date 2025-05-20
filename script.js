const canvas = document.getElementById("canvas");

if (canvas.getContext){

    console.log("testi");
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.fillRect(20, 20, 50, 50);

    function canvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.fillStyle = "rgb(136, 146, 151)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", canvasSize);

    canvasSize();
}