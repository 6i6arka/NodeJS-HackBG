function Interface(){
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        colorInput = document.getElementById('colorInput'),
        savesDropDown = document.getElementById('savesDropDown');

    this.triangles = [];
    this.dots = [];


    this.init = function () {
        this.resetDropDown();
    };

    function Triangle (tr) {
        this.points = tr.dots;
        this.color = tr.color;
    }

    function Dot(dot){
        this.x = dot.x;
        this.y = dot.y;
    }

    Dot.prototype.draw = function () {
        ctx.save();
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    function getMousePos(e){
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    this.resetDropDown = function () {
        savesDropDown.innerHTML = '';
        var localStorage = window.localStorage, i;
        if(localStorage.length){
            for(i in localStorage){
                if(localStorage.hasOwnProperty(i)){
                    savesDropDown.innerHTML += '<option>' + i + '</option>'
                }
            }
        }
    };

    this.resetCanvas = function (state) {
        this.clearCanvas();
        var triangles = this.loadCanvas(state), i;
        console.log(triangles);
        for(i in triangles){
            if (triangles.hasOwnProperty(i)) {
                this.drawTriangle(new Triangle({
                    dots: triangles[i].points,
                    color: triangles[i].color
                }));
            }
        }
    };

    this.clearCanvas = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.triangles = [];
    };

    this.saveCanvas = function(){
        var name = prompt('Name your masterpiece:'),
            triangles = {};
        for(var i = 0; i < this.triangles.length; i++){
            triangles['triangle' + i] = this.triangles[i];
        }

        window.localStorage.setItem(name, JSON.stringify(triangles));

        this.resetDropDown();
    };

    this.loadCanvas = function (state) {
        return JSON.parse(window.localStorage[state])
    };

    this.drawTriangle = function(triangle){
        this.triangles.push(triangle);

        ctx.save();
        ctx.fillStyle = triangle.color;
        ctx.beginPath();
        ctx.moveTo(triangle.points[0].x, triangle.points[0].y);
        ctx.lineTo(triangle.points[1].x, triangle.points[1].y);
        ctx.lineTo(triangle.points[2].x, triangle.points[2].y);
        ctx.lineTo(triangle.points[0].x, triangle.points[0].y);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        drawArea(triangle);
    };

    this.drawDot = function (e) {
        var mouse = getMousePos(e),
            dot = new Dot(mouse);
        dot.draw();
        this.dots.push(dot);
        if(this.dots.length % 3 === 0){
            this.drawTriangle(new Triangle({dots: this.dots, color: colorInput.value}));
            this.dots = [];
        }
    };

    function drawArea(triangle) {
        var area = calculateArea(triangle),
            center = calculateCenter(triangle),
            textWidth = ctx.measureText(area.toString());
        ctx.save();
        ctx.fillStyle = triangle.color === '#ff00ff' ? 'black' : '#ff00ff';
        console.log('#' + Number(triangle.color.slice(1, 7)));
        ctx.font = '20px Helvetica';
        ctx.fillText(area.toString(), center.x - textWidth.width, center.y + 10);
        ctx.restore();

        console.log(area.toString())
    }

    function calculateArea (triangle){
        var dots = triangle.points;

        return Math.abs((dots[0].x * (dots[1].y - dots[2].y) + dots[1].x * (dots[2].y - dots[0].y) + dots[2].x * (dots[0].x - dots[1].x)) / 2);
    }

    function calculateLength (a, b){
        var dx = Math.abs(a.x - b.x),
            dy = Math.abs(a.y - b.y);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    function calculateCenter (triangle){

        var dots = triangle.points,
            a = calculateLength(dots[0], dots[1]),
            b = calculateLength(dots[1], dots[2]),
            c = calculateLength(dots[2], dots[0]),
            p = a + b + c;

        return {
            x: Math.floor((a*dots[0].x + b*dots[1].x + c*dots[2].x) / p),
            y: Math.floor((a*dots[0].y + b*dots[1].y + c*dots[2].y) / p)
        }
    }
}

window.onload = function () {
    var app = new Interface();

    app.init();

    document.addEventListener('mousedown', function(e){
        if(e.target.id === 'canvas'){
            app.drawDot(e);
        }
        else if(e.target.id === 'clearButton'){
            app.clearCanvas();
        }
        else if(e.target.id === 'saveCanvas'){
            app.saveCanvas();
        }
        else if(e.target.id ==='loadCanvas'){
            app.resetCanvas(document.getElementById('savesDropDown').value)
        }
    });
};