var CIRCLE_COLOR_RED = '#FF3E37'; // колір для червоного кола
var CIRCLE_COLOR_GREEN = '#57E69D'; // колір для зеленого кола

const LS_EVENT_DATA = "notification-event-value"; // константа для збереження данних в лс для повідобмлень

var AXIS_MAX_Y = 300; // вісь У максимальне значення
var AXIS_MAX_X = 300; // вісь Х максимальне значення

var CIRCLE_RADIUS = 10;

var FRAME_INTERVAL = 30; // інтервал промальовування канвас

var canvaElement;
var canvaCtx;

var circleRed;
var circleGreen;

var buttonStart;
var buttonStop;
var buttonReload;
var buttonPlay;
var buttonClose;

var drawUpdateInterval;

var eventNotificationArray = [];

var settingsApp;

// класс для роботи з колом
class Circle {

    constructor(positionX, positionY, radius, color) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.radius = radius;
        this.color = color;

        this.vectorX = +1;
        this.vectorY = +1;
    };

    setContext(context) {
        this.context = context;
    };

    getPositionX() {
        return this.positionX;
    };

    getPositionY() {
        return this.positionY;
    };

    getRadius() {
        return this.radius;
    };

    // промальовування кола в контексті
    draw() {

        if (this.context == null) return;

        var circle = new Path2D();
        circle.arc(
            this.positionX, //getRandomInt(AXIS_MAX_X-2*CIRCLE_RADIUS)+CIRCLE_RADIUS
            this.positionY,
            this.radius,
            0, 2 * Math.PI,
            false
        );

        this.context.fillStyle = this.color;
        this.context.fill(circle);
    };

    // перміщення кола по осі Х
    moveX(speed) {

        var dtX = speed * this.vectorX; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtX + this.positionX) > AXIS_MAX_X) {
            this.positionX = AXIS_MAX_X - this.radius;
            this.vectorX = -1;
            notificationEvent("Touching circles on right border event");
        } else if ((dtX + this.positionX) <= 0) {
            this.positionX = this.radius;
            this.vectorX = +1;
            notificationEvent("Touching circles on left border event");
        } else {
            this.positionX = this.positionX + speed * this.vectorX; // переміщення кола
        }
        this.draw(); // прорисовка нової позиції
    };

    // переміщення кола по осі У
    moveY(speed) {

        var dtY = speed * this.vectorY; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtY + this.positionY) > AXIS_MAX_Y) {
            this.positionY = AXIS_MAX_Y - this.radius;
            this.vectorY = -1;

            notificationEvent("Touching circles on bottom border event");
        } else if ((dtY + this.positionY) <= 0) {
            this.positionY = this.radius;
            this.vectorY = +1;
            notificationEvent("Touching circles on top border event");
        } else {
            this.positionY = this.positionY + speed * this.vectorY; // переміщення кола
        }

        // прорисовка нової позиції
        this.draw();
    }

}

// функція для роботи з повідомленнями
function notificationEvent(text) {

    // вивід на позицію контрол
    var notificationElement = document.getElementById("notification-text");
    notificationElement.innerHTML = "";

    notificationElement.append(text);

    // формаування дати
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();

    // збереження повідомлення в лог
    eventNotificationArray.push([time, text]);

    // збереження логу повідомень в ЛС
    localStorage.setItem(LS_EVENT_DATA, JSON.stringify(eventNotificationArray));
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// функція ініціалізації прорисовки кола
function initCircle(context) {

    // очищення елемментів
    context.clearRect(0, 0, AXIS_MAX_X, AXIS_MAX_Y);

    circleRed = new Circle(
        /*450*/ getRandomInt(AXIS_MAX_X - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_RED
    );
    circleRed.setContext(context);
    circleRed.draw();

    circleGreen = new Circle(
        CIRCLE_RADIUS,
        /*450*/ getRandomInt(AXIS_MAX_Y - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_GREEN
    );

    circleGreen.setContext(context);
    circleGreen.draw();

}

// обробка кнопки старт
function start() {

    // збереження повідомлення
    notificationEvent("Button start click");

    // включаємо, виключаємо показ кнопок
    buttonStart.classList.add('hidden');
    buttonStop.classList.remove('hidden');
    buttonReload.classList.add('hidden');

    // встановлення оброки промальовування кола
    drawUpdateInterval = window.setInterval(function () {
        // draw frame update
        canvaCtx.clearRect(0, 0, AXIS_MAX_X, AXIS_MAX_Y); // очищення
        circleGreen.moveY(11); // 11 - швидкість переміщення 
        circleRed.moveX(10); // 10 - швидкість переміщення

        // отримуємо відстань між двома колами
        var dtX = circleGreen.getPositionX() - circleRed.getPositionX();
        var dtY = circleGreen.getPositionY() - circleRed.getPositionY();

        var distance = Math.sqrt(dtX * dtX + dtY * dtY);

        // якщо дистанця меша, то наші кола зіштовхнулися один з одним
        if (distance <= circleRed.getRadius() + circleGreen.getRadius()) {
            notificationEvent("Touching circles event");
            window.clearInterval(drawUpdateInterval); // зупиняємо оновлення

            buttonStop.classList.add('hidden');
            buttonReload.classList.remove('hidden');
        }


    }, FRAME_INTERVAL);

}

function stop() {

    notificationEvent("Button stop click");

    buttonStart.classList.remove('hidden');
    buttonStop.classList.add('hidden');
    buttonReload.classList.add('hidden');

    window.clearInterval(drawUpdateInterval);
}

function reload() {

    notificationEvent("Button reload click");

    buttonStart.classList.remove('hidden');
    buttonStop.classList.add('hidden');
    buttonReload.classList.add('hidden');

    initCircle(canvaCtx);
}

function play() {

    var workElement = document.getElementById("work");
    workElement.classList.remove('hidden');

    canvaElement.setAttribute("width", AXIS_MAX_X);
    canvaElement.setAttribute("height", AXIS_MAX_Y);

    canvaCtx = canvaElement.getContext("2d");

    initCircle(canvaCtx);

}

function closeWork() {

    window.clearInterval(drawUpdateInterval);

    var workElement = document.getElementById("work");
    workElement.classList.add('hidden');

    var notificationList = localStorage.getItem(LS_EVENT_DATA);
    notificationList = JSON.parse(notificationList);

    var eventLogElement = document.getElementById("event-log-teaxtaera");
    eventLogElement.classList.remove("hidden");

    notificationList.forEach(element => {
        eventLogElement.append(element[0] + " " + element[1] + "\r\n");
    });

}

window.onload = function () {

    buttonStart = document.getElementById('button-start');
    buttonStop = document.getElementById('button-stop');
    buttonReload = document.getElementById('button-reload');
    buttonPlay = document.getElementById('button-play');
    buttonClose = document.getElementById('button-close');

    canvaElement = document.getElementById("myCanvas");

    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {

            // отримання данних кофігурації з серсера
            settingsApp = JSON.parse(httpRequest.responseText);

            CIRCLE_COLOR_RED = settingsApp.CIRCLE_COLOR_RED;
            CIRCLE_COLOR_GREEN = settingsApp.CIRCLE_COLOR_GREEN;
            AXIS_MAX_Y = settingsApp.AXIS_MAX_Y;
            AXIS_MAX_X = settingsApp.AXIS_MAX_X;
            CIRCLE_RADIUS = settingsApp.CIRCLE_RADIUS;
            FRAME_INTERVAL = settingsApp.FRAME_INTERVAL;

            buttonStart.innerText = settingsApp.button_start_name;
            buttonStop.innerText = settingsApp.button_stop_name;
            buttonReload.innerText = settingsApp.button_reload_name;
            buttonPlay.innerText = settingsApp.button_play_name;
            buttonClose.innerText = settingsApp.button_close_name;

            var anim = document.getElementById("anim");
            anim.style.backgroundImage = "url('" + settingsApp.texture + "')";


        }
        ;
    }

    httpRequest.open("GET", "/get", false);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send();

    localStorage.setItem(LS_EVENT_DATA, JSON.stringify(eventNotificationArray));
};
