
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        mouse = {},
        dots = [],
        getMousePos = function (e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    };

    function Triangle(tr) {
        this.dots = tr.dots;
        this.color = document.getElementById('colorInput').value;
    }

    Triangle.prototype.draw = function () {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x, this.dots[0].y);
        ctx.lineTo(this.dots[1].x, this.dots[1].y);
        ctx.lineTo(this.dots[2].x, this.dots[2].y);
        ctx.lineTo(this.dots[0].x, this.dots[0].y);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    function Dot(dot) {
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

    Dot.prototype.onHover = function () {

    };

    canvas.addEventListener('mousedown', function (e) {
        mouse = getMousePos(e);
        var dot = new Dot(mouse),
            triangle;
        dot.draw();
        dots.push(dot);
        if(dots.length % 3 === 0){
            triangle = new Triangle({
                dots: dots
            });
            triangle.draw();
            dots = [];
        }
    });

    canvas.addEventListener('click', function () {

    });