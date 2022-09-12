let shooter;
let score_text;
let score;
let bullet;
let bullets;
let asteroid;
let asteroids;
let lives_text;
let lives;
let gameOver;
let endScore;
let scores = [];

class Game
{
    startGame = function () {
        g.gameArea.start();
        shooter = new Shooter(30,  '#6b6b6b', 425, 550, 0);
        score_text = new Component('20px', 'Courier New', 'white', 350, 30, 'text');
        lives_text = new Component('20px', 'Courier New', 'white', 20, 30, 'text');
        gameOver = new Component('50px', 'Courier New', 'white', 300, 300, 'text');
        endScore = new Component('20px', 'Courier New', 'white', 325, 350, 'text');
        bullets = [];
        asteroids = [];
        score = 0;
        lives = 3;
    }

    gameArea = {
        canvas : document.createElement('canvas'),
        start : function () {
            this.canvas.width = 900;
            this.canvas.height = 600;
            this.context = this.canvas.getContext("2d");
            let content = document.getElementById('main_content');
            content.insertBefore(this.canvas, content.childNodes[0]);
            this.interval_refresh = setInterval(g.updateGameArea, 20);
            this.interval_asteroid = setInterval(d.draw, 5000);
            window.addEventListener('keydown', function (e) {
                g.gameArea.key = e.keyCode;
            })
            window.addEventListener('keyup', function (e) {
                g.gameArea.key = false;
            })
        },
        clear : function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop : function () {
            clearInterval(this.interval_asteroid);
            clearInterval(this.interval_refresh);
        }
    }

    updateGameArea = function () {
        g.gameArea.clear();
        shooter.speedX = 0;
        shooter.speedY = 0;
        if (g.gameArea.key === 37) {shooter.speedX = -5; }
        if (g.gameArea.key === 39) {shooter.speedX = 5; }
        if(g.gameArea.key === 32)
        {
            let x = shooter.x - 7.5;
            bullet = new Bullet(15, 15, 'yellow', x, shooter.y);
            bullets.push(bullet);
            g.gameArea.key = false;
        }
        score_text.text = "Score: "+score+"";
        score_text.update();
        lives_text.text = "Lives: "+lives+"";
        lives_text.update();
        shooter.newPos();
        shooter.update();
        if(asteroids.length > 0) {
            for (let i = 0; i < asteroids.length; i++)
            {
                asteroids[i].newPos();
                asteroids[i].update();
            }
        }
        if(bullets.length > 0)
        {
            for(let i = 0; i <= bullets.length; i++)
            {
                bullets[i].newPos();
                bullets[i].update();
                if(bullets[i].collision(asteroids[i]))
                {
                    asteroids.shift();
                    bullets.shift();
                    score += 1;
                }
            }
        }
        if(lives === 0)
        {
            gameOver.text = "Game Over!";
            gameOver.update();
            endScore.text = "Your score was: "+score+"";
            endScore.update();
            scores.push(score);
            let button = document.createElement('a');
            button.href = "index.html";
            button.innerText = 'Back';
            document.body.appendChild(button);
            g.gameArea.stop();
        }
    }
}

class Shooter
{
    constructor(radius, color, x, y, angle) {
        this.radius = radius;
        this.speedX = 0;
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
    }

    update = function () {
        let ctx = g.gameArea.context;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.angle, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        let pointerLength = 60;
        ctx.lineTo(
            this.x + pointerLength * Math.sin(this.angle),
            this.y + pointerLength * Math.cos(this.angle) * -1);
        ctx.lineWidth = 20;
        ctx.fill();
        ctx.stroke();

    }

    newPos = function () {
        this.x += this.speedX;
        if(this.x < 30) {this.x = 30;}
        if(this.x > 870) {this.x = 870;}
    }
}

class Component
{
    constructor(width, font, color, x, y, type) {
        this.type = type;
        this.width = width;
        this.font = font;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    update = function () {
        let ctx = g.gameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.font;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.font);
        }
    }
}

class Asteroid
{
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.ySpeed = 2;
    }

    update = function () {
        let ctx = g.gameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos = function () {
        this.y += this.ySpeed;
        if(this.y > 600)
        {
            asteroids.shift();
            lives -= 1;
        }
    }

}

class Bullet
{
    constructor(width, height, color, x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ySpeed = 5;
    }

    update = function () {
        let ctx = g.gameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos = function () {
        this.y -= this.ySpeed;
        if(this.y < 0)
        {
            bullets.shift();
        }
    }

    collision = function(asteroid)
    {
        let rect1 = {x : this.x, y : this.y, width : this.width, height : this.height};
        let rect2 = {x : asteroid.x, y : asteroid.y, width : asteroid.width, height : asteroid.height};

        let collision = false;

        if(rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y)
        {
            collision = true;
        }
        return collision;
    }
}
class Draw
{
    draw = function()
    {
        let random_x = Math.floor(Math.random() * 860);
        asteroid = new Asteroid(40, 40, "red", random_x, 0);
        asteroids.push(asteroid);
    }
}

class Score
{
    getScores = function()
    {
        for(let i = 0; i < scores.length; i++)
        {
            let score1 = document.getElementById('score1');
            let score2 = document.getElementById('score2');
            let score3 = document.getElementById('score3');

            score1.innerText = '1. '+scores[1]+'';
            score2.innerText = '2. '+scores[2]+'';
            score3.innerText = '3. '+scores[3]+'';
        }
    }
}

class Video
{
    video = function()
    {
        let b = new Bideo();
        b.init({
            videoEl: document.querySelector('#background_video'),
            container: document.querySelector('body'),
            resize: false,
            src: [{src: 'Media/background_video.mp4', type: 'video/mp4'}],
            onLoad: function()
            {
                document.querySelector('#video_cover').style.display = 'none';
            }
        });
    }

    canvas = function()
    {
        let b = new Bideo();
        b.init({
            videoEl: document.querySelector('#background_video'),
            container: document.querySelector('canvas'),
            resize: false,
            src: [{src: 'Media/background_video.mp4', type: 'video/mp4'}],
            onLoad: function()
            {
                document.querySelector('#video_cover').style.display = 'none';
            }
        });
    }
}

let d = new Draw();
let s = new Score();
let g = new Game();
let v = new Video();