let score = 0;
let asteroidCount = 5;
let asteroidsRemaining = 5;
let asteroidIdNum = 0;
let currentLevel = 0;
let livesRemaining = 5;
let prevDamage = 0.5;
let damage = 0.5;
let endDuration = 1800;
let explosion = new Audio("/sounds/explosion.wav");
let hit = new Audio("/sounds/hit.wav");
let song1 = new Audio("/sounds/MEGA.mp3");
let start = new Audio("/sounds/start.wav");
let powerup = new Audio("/sounds/powerUp.wav");
let extralife = new Audio("/sounds/extraLife.wav");
let gameover = new Audio("/sounds/game-over.mp3");
let started = false;

$(document).ready(() => {
    explosion.volume = 0.2;
    hit.volume = 0.2;
    song1.volume = 0.8;
    start.volume = 0.5;
    powerup.volume = 0.4;
    extralife.volume = 0.4;
    song1.loop = true;
});



function randFloat(min, max){
    return Math.floor(Math.random()*(max - min + 1) + min);
}



function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function subLife() {
    if (livesRemaining > 0) {
        livesRemaining -= 1;
        $("#lives-value").text(livesRemaining);
        if (livesRemaining <= 0) {
            gameOverScreen();
        }
        else {
            asteroidsRemaining -= 1;
            if (asteroidsRemaining <= 0) {
                startLevel();
            }
        }
    }
}



function createAsteroid() {
    asteroidIdNum++;
    let height = randFloat(2, 6);
    let width = randFloat(2, 6);
    let speed = randInt(9200, 13500);
    let positionNum = randInt(1, 4);
    let positionSpot = "";

    switch (positionNum) {
        case 1:
            positionSpot = "top-left";
            break;
        case 2:
            positionSpot = "top-right";
            break;
        case 3:
            positionSpot = "bottom-left";
            break;
        default:
            positionSpot = "bottom-right";
            break;
    }

    jQuery("<div>", {
        id: `ast-${asteroidIdNum}`,
        class: `asteroid ${positionSpot}`,
        height: `${height}rem`,
        width: `${width}rem`
    }).appendTo(".content-container");
    
    if (positionSpot === "top-left") {
        $(`#ast-${asteroidIdNum}`).animate({left: '110vw', top: '110vh'}, speed, 'linear');
        $(`#ast-${asteroidIdNum}`).promise().done (function(){
            if ($(this).css("opacity") > 0) {
                $(this).remove();
                subLife();
            }
        });
    }
    else if (positionSpot === "top-right") {
        $(`#ast-${asteroidIdNum}`).animate({right: '110vw', top: '110vh'}, speed, 'linear');
        $(`#ast-${asteroidIdNum}`).promise().done(function(){
            if ($(this).css("opacity") > 0) {
                $(this).remove();
                subLife();
            }
        });
    }
    else if (positionSpot === "bottom-left") {
        $(`#ast-${asteroidIdNum}`).animate({left: '110vw', bottom: '110vh'}, speed, 'linear');
        $(`#ast-${asteroidIdNum}`).promise().done(function(){
            if ($(this).css("opacity") > 0) {
                $(this).remove();
                subLife();
            }
        });
    }
    else {
        $(`#ast-${asteroidIdNum}`).animate({right: '110vw', bottom: '110vh'}, speed, 'linear');
        $(`#ast-${asteroidIdNum}`).promise().done(function(){
            if ($(this).css("opacity") > 0) {
                $(this).remove();
                subLife();
            }
        });
    }
}


function genPowerUp() {
    jQuery("<div>", {
        class: "power-up top-left",
    }).appendTo(".content-container");

    $(".power-up").animate({left: '110vw', top: '110vh'}, 10000, 'linear');
    $(".power-up").promise().done(function(){
        if ($(this).css("opacity") > 0) {
            $(this).remove();
        }
    });
}



function genExtraLife() {
    jQuery("<div>", {
        class: "extra-life bottom-right",
    }).appendTo(".content-container");

    $(".extra-life").animate({right: '110vw', bottom: '110vh'}, 9000, 'linear');
    $(".extra-life").promise().done(function() {
        if ($(this).css("opacity") > 0) {
            $(this).remove();
        }
    });
}


function startLevel() { 
    asteroidIdNum = 0;
    
    currentLevel++;
    asteroidCount += 3;

    damage = prevDamage;

    song1.playbackRate += 0.01;

    if (currentLevel === 5) {
        damage = 0.4;
        endDuration -= 200;
        $("body").css("background-image", "url('images/Lvl5BG.gif')");
    }
    else if (currentLevel === 10) {
        damage = 0.25;
        endDuration += 150;
        $("body").css("background-image", "url('images/Lvl10BG.gif')");
    }
    else if (currentLevel == 15) {
        $("body").css("background-image", "url('images/Lvl15BG.gif')");
        endDuration -= 50;
    }
    else if (currentLevel === 20) {
        damage = 0.2;
        endDuration -= 25;
        $("body").css("background-image", "url('images/Lvl20BG.gif')");
    }

    prevDamage = damage;

    asteroidsRemaining = asteroidCount;

    $(".content-container").css("box-shadow", "none");

    $(".level-container").css("display", "block");
    $("#level-value").text(currentLevel);
    $("#current-level").hide().fadeIn(1800, () => {
        $("#current-level").fadeOut(1700, () => {
            $(".level-container").css("display", "none");
            (randInt(1, 8) === 5) ? genPowerUp() : null;
            (randInt(1, 8) === 5) ? genExtraLife() : null;
            for (let i = 0; i < asteroidCount; i++) {
                setTimeout(() => {
                    if (livesRemaining > 0) {
                        createAsteroid();
                    }
                    else {
                        return;
                    }
                }, randInt(500, endDuration) * i);
            }
        });
    });
}



function gameOverScreen() {
    song1.pause();
    gameover.play();
    $(".content-container").animate({backgroundColor: "rgba(120, 15, 0, 0.75)"}, 3500, () => {
        $(".level-container").css("display", "block");
        $("#current-level").css("font-size", "4.25rem");
        $("#current-level").text("GAME OVER");
        $("#current-level").hide().fadeIn(3500);
    });

    $(".stats-bar").fadeOut(2500);
    $(".asteroid").stop();
}

function main() {
    $(".data-container").css("display", "flex");
    song1.play();
    startLevel(currentLevel);
}



$(".start-button").click(() => {
    if (started === false) {
        started = true;
        start.play();
        $(".start-container").fadeOut(1250, () => {
            main();
        });
    }
});



$(".content-container").on('click', '.asteroid', function() {
    if (livesRemaining > 0) {
        $(this).css("opacity", $(this).css("opacity") - damage);
        hit.currentTime = 0;
        hit.play();
        score += 5;
        $("#current-score-value").text(score);
        if ($(this).css("opacity") <= 0) {
            $(this).stop();
            $(this).remove();
            explosion.currentTime = 0;
            explosion.play();
            score += 15;
            $("#current-score-value").text(score);
            asteroidsRemaining -= 1;
            if (asteroidsRemaining <= 0) {
                startLevel();
            }
        }
    }
});



$(".content-container").on('click', '.power-up', function() {
    if (livesRemaining > 0) {
        $(this).stop();
        $(this).css("opacity", "0");
        $(this).remove();
        powerup.play();
        prevDamage = damage;
        damage = 1;
        $(".content-container").css("box-shadow", "inset 0px 0px 35px #ee0000");
    }
});



$(".content-container").on('click', '.extra-life', function() {
    if (livesRemaining > 0) {
        $(this).stop();
        $(this).css("opacity", "0");
        $(this).remove();
        extralife.play();
        livesRemaining += 1;
        $("#lives-value").text(livesRemaining);
    }
});