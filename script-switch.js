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


var eventNotificationArray = [];

var settingsApp;

const CIRCLE_TYPE_Y = 1;
const CIRCLE_TYPE_X = 2;

// класс для роботи з колом
class Circle {

    constructor(positionX, positionY, radius, color, type) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.radius = radius;
        this.color = color;

        this.vectorX = +1;
        this.vectorY = +1;

        this.startPoint = 0;

        this.type = type;
    };


    setPositionX(position) {
        this.positionX = position;
    }

    setPositionY(position) {
        this.positionY = position;
    }

    getPositionX() {
        return this.positionX;
    };

    getPositionY() {
        return this.positionY;
    };

    getRadius() {
        return this.radius;
    };

    getColor() {
        return this.color;
    };

    getType() {
        return this.type;
    };


    getRandomPositionX(axis_max_x) {
        return getRandomInt(axis_max_x - 2 * this.radius) + this.radius;
    };

    getRandomPositionY(axis_max_y) {
        return getRandomInt(axis_max_y - 2 * this.radius) + this.radius;
    };
}

class CircleCanvas extends Circle {


    getRandomPositionX(axis_max_x) {
        return getRandomInt(axis_max_x - 2 * this.radius) + this.radius;
    };

    getRandomPositionY(axis_max_y) {
        return getRandomInt(axis_max_y - 2 * this.radius) + this.radius;
    };

    // перміщення кола по осі Х
    moveX(speed, maxX) {

        var dtX = speed * this.vectorX; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtX + this.positionX) > maxX) {
            this.positionX = maxX - this.radius;
            this.vectorX = -1;
            notificationEvent("Touching circles on right border event");
        } else if ((dtX + this.positionX) <= 0) {
            this.positionX = this.radius;
            this.vectorX = +1;
            notificationEvent("Touching circles on left border event");
        } else {
            this.positionX = this.positionX + speed * this.vectorX; // переміщення кола
        }
        //this.draw(); // прорисовка нової позиції
    };

    moveY(speed, maxY) {

        var dtY = speed * this.vectorY; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtY + this.positionY) > maxY) {
            this.positionY = maxY - this.radius;
            this.vectorY = -1;

            notificationEvent("Touching circles on bottom border event");
        } else if ((dtY + this.positionY) <= 0) {
            this.positionY = this.radius;
            this.vectorY = +1;
            notificationEvent("Touching circles on top border event");
        } else {
            this.positionY = this.positionY + speed * this.vectorY; // переміщення кола
        }

    }

}

class CircleDiv extends Circle {


    // перміщення кола по осі Х
    moveX(speed, maxX) {

        var dtX = speed * this.vectorX; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtX + this.positionX) > maxX) {
            this.positionX = maxX - this.radius;
            this.vectorX = -1;
            notificationEvent("Touching circles on right border event");
        } else if ((dtX + this.positionX) <= 0) {
            this.positionX = 0;
            this.vectorX = +1;
            notificationEvent("Touching circles on left border event");
        } else {
            this.positionX = this.positionX + speed * this.vectorX; // переміщення кола
        }
        //this.draw(); // прорисовка нової позиції
    };

    moveY(speed, maxY) {

        var dtY = speed * this.vectorY; // обчисляення дистанція переміщення

        // перевіряємо щоб центр кола не вийшов за максимальні, мінімальні значення
        if ((dtY + this.positionY) > maxY) {
            this.positionY = maxY - this.radius;
            this.vectorY = -1;

            notificationEvent("Touching circles on bottom border event");
        } else if ((dtY + this.positionY) <= 0) {
            this.positionY = 0;
            this.vectorY = +1;
            notificationEvent("Touching circles on top border event");
        } else {
            this.positionY = this.positionY + speed * this.vectorY; // переміщення кола
        }

    }
}


class DrawContext {

    init(circleList) {
    };

    clear() {
    };

    /**
     *
     * @param {Circle} circle
     */
    draw(circle) {
    };

    getCircleDistance(circleList) {
    };

    getTouchDistance(circleList) {
    };

    getAxisMaxY() {
        return this.axis_max_y;
    }

    getAxisMaxX() {
        return this.axis_max_x;
    }

    getCircleDistance(circleList) {
        var dtX = circleList[0].getPositionX() - circleList[1].getPositionX();
        var dtY = circleList[0].getPositionY() - circleList[1].getPositionY();

        return Math.sqrt(dtX * dtX + dtY * dtY);
    }


    getSpeedX() {
    };

    getSpeedY() {
    };

}

class DivContext extends DrawContext {

    constructor() {
        super();

        var conteiner = document.getElementById("anim");
        conteiner.innerHTML = "";

        this.divElement = document.createElement("div");
        this.divElement.setAttribute("id", "anim-content");

        conteiner.appendChild(this.divElement);

        //this.divElement = document.getElementById("anim-content");

        //console.log(this.divElement.clientWidth);

        this.axis_max_y = this.divElement.clientHeight - 25;
        this.axis_max_x = this.divElement.clientWidth - 25;

    }

    getSpeedX() {
        return 40;
    }

    getSpeedY() {
        return 35;
    }

    getTouchDistance(circleList) {
        return 40;
    }

    draw(circle) {

        var circleElement = document.createElement("div");

        circleElement.classList.add("circle");
        circleElement.style.backgroundColor = circle.getColor();
        circleElement.style.left = circle.getPositionX() + "px";
        circleElement.style.top = circle.getPositionY() + "px";

        this.divElement.appendChild(circleElement);
    }

    init(circleList) {

    }

    clear() {
        this.divElement.innerHTML = "";
    }
}

class CanvaContext extends DrawContext {

    constructor(elementName, axis_max_x, axis_max_y) {
        super();

        var conteiner = document.getElementById("anim");
        conteiner.innerHTML = "";

        this.canvaElement = document.createElement("canvas");
        this.canvaElement.setAttribute("id", elementName);

        conteiner.appendChild(this.canvaElement);
//        this.canvaElement = document.getElementById(elementName);

        this.axis_max_y = axis_max_y;
        this.axis_max_x = axis_max_x;

        this.canvaElement.setAttribute("width", axis_max_x);
        this.canvaElement.setAttribute("height", axis_max_y);

        this.context = this.canvaElement.getContext("2d");

    }

    getSpeedX() {
        return 10;
    }

    getSpeedY() {
        return 15;
    }

    getTouchDistance(circleList) {
        return circleList[0].getRadius() + circleList[1].getRadius();
    }

    draw(circle) {
        var circlePath = new Path2D();
        circlePath.arc(
            circle.getPositionX(),
            circle.getPositionY(),
            circle.getRadius(),
            0, 2 * Math.PI,
            false
        );

        this.context.fillStyle = circle.getColor();
        this.context.fill(circlePath);
    }

    init(circleList) {

        if (this.context != null) {
            this.clear();
        }

    }

    clear() {
        this.context.clearRect(0, 0, this.axis_max_x, this.axis_max_y);
    }
}

class Application {

    constructor() {
        this.circleList = [];
    }

    getContext() {
        return this.context;
    };

    getCircleList() {
        return this.circleList;
    }

    /**
     *
     * @param {Circle} circle
     */
    addCircle(circle) {
        this.circleList.push(circle);
    }


    getDrawUpdateInterval() {
        return this.drawUpdateInterval;
    }

    stop() {
        window.clearInterval(this.drawUpdateInterval);
    }

    start(frame_interval) {
        // встановлення оброки промальовування кола
        this.drawUpdateInterval = window.setInterval(function () {

            application.clear();

            application.getCircleList().forEach(element => {
                switch (element.getType()) {
                    case CIRCLE_TYPE_Y:
                        //console.log("max:",application.getContext().getAxisMaxY());
                        element.moveY(
                            application.getContext().getSpeedY(),
                            application.getContext().getAxisMaxY()
                        );
                        break;
                    case CIRCLE_TYPE_X:
                        element.moveX(
                            application.getContext().getSpeedX(),
                            application.getContext().getAxisMaxX()
                        );
                        break;

                }
                application.getContext().draw(element);
            });

            var distance = application.getContext()
                .getCircleDistance(application.getCircleList());

            // якщо дистанця меша, то наші кола зіштовхнулися один з одним
            if (distance <= application.getContext().getTouchDistance(application.getCircleList())) {

                notificationEvent("Touching circles event");

                application.stop();

                buttonStop.classList.add('hidden');
                buttonReload.classList.remove('hidden');
            }


        }, frame_interval);
    }

    /**
     *
     * @param {DrawContext} context
     */
    setContext(context) {
        this.context = context
    }

    init() {
        this.context.init(this.circleList);

        this.circleList.forEach(element => {
            switch (element.getType()) {
                case CIRCLE_TYPE_Y:

                    var maxY = this.context.getAxisMaxY();
                    console.log(maxY);
                    element.setPositionY(element.getRandomPositionY(maxY));
                    break;
                case CIRCLE_TYPE_X:
                    var maxX = this.context.getAxisMaxX();
                    element.setPositionX(element.getRandomPositionX(maxX));
                    break;

            }

            this.context.draw(element);

        });
    }

    clear() {
        this.context.clear();
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


// обробка кнопки старт
function start() {

    // збереження повідомлення
    notificationEvent("Button start click");

    // включаємо, виключаємо показ кнопок
    buttonStart.classList.add('hidden');
    buttonStop.classList.remove('hidden');
    buttonReload.classList.add('hidden');

    application.start(FRAME_INTERVAL);

}


function stop() {

    notificationEvent("Button stop click");

    buttonStart.classList.remove('hidden');
    buttonStop.classList.add('hidden');
    buttonReload.classList.add('hidden');

    application.stop();

}

function reload() {

    notificationEvent("Button reload click");

    buttonStart.classList.remove('hidden');
    buttonStop.classList.add('hidden');
    buttonReload.classList.add('hidden');

    application.clear();
    application.init();
}

function playDiv() {
    var workElement = document.getElementById("work");
    workElement.classList.remove('hidden');

    application = new Application();

    var divContext = new DivContext();

    application.setContext(divContext);

    application.addCircle(new CircleDiv(
        getRandomInt(divContext.getAxisMaxX() - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        0,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_RED,
        CIRCLE_TYPE_X
    ));

    application.addCircle(new CircleDiv(
        0,
        getRandomInt(divContext.getAxisMaxY() - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_GREEN,
        CIRCLE_TYPE_Y
    ));


    application.init();
}

function playCanva() {

    var workElement = document.getElementById("work");
    workElement.classList.remove('hidden');

    application = new Application();

    var canvaContext = new CanvaContext("myCanvas", AXIS_MAX_X, AXIS_MAX_Y);

    application.setContext(canvaContext);

    application.addCircle(new CircleCanvas(
        getRandomInt(AXIS_MAX_X - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_RED,
        CIRCLE_TYPE_X
    ));

    application.addCircle(new CircleCanvas(
        CIRCLE_RADIUS,
        getRandomInt(AXIS_MAX_Y - 2 * CIRCLE_RADIUS) + CIRCLE_RADIUS,
        CIRCLE_RADIUS,
        CIRCLE_COLOR_GREEN,
        CIRCLE_TYPE_Y
    ));

    application.init();
}

function closeWork() {

    application.stop();

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

var application = null;

window.onload = function () {

    buttonStart = document.getElementById('button-start');
    buttonStop = document.getElementById('button-stop');
    buttonReload = document.getElementById('button-reload');
    buttonPlay = document.getElementById('button-play');
    buttonClose = document.getElementById('button-close');


    //canvaElement = document.getElementById("myCanvas");

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
