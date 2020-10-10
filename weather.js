// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: image;
// This widget was created by Max Zeryck @mzeryck,在原来的基础上增加了更多内容显示（均来自网络收集）
// Widgets are unique based on the name of the script.

const filename = Script.name() + ".jpg"
const files = FileManager.local()
const path = files.joinPath(files.documentsDirectory(), filename)
let widgetHello = new ListWidget();
let today = new Date();

let widgetInputRAW = args.widgetParameter;

try {
    widgetInputRAW.toString();
} catch (e) {
    widgetInputRAW = "50|#ffffff";
}

let widgetInput = widgetInputRAW.toString();

let inputArr = widgetInput.split("|");

// iCloud file path
let scriptableFilePath = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/";
let removeSpaces1 = inputArr[0].split(" "); // Remove spaces from file name
let removeSpaces2 = removeSpaces1.join('');
let tempPath = removeSpaces2.split(".");
let backgroundImageURLRAW = scriptableFilePath + tempPath[0];

let fm = FileManager.iCloud();
let backgroundImageURL = scriptableFilePath + tempPath[0] + ".";
let backgroundImageURLInput = scriptableFilePath + removeSpaces2;

/* 
For users having trouble with extensions,
Uses user-input file path is the file is found,
Checks for common file format extensions if the file is not found.
对于扩展有问题的用户,
使用用户输入的文件路径找到文件,
如果找不到文件，则检查常见的文件格式扩展名。
*/

if (fm.fileExists(backgroundImageURLInput) === false) {
    const fileTypes = ['png', 'jpg', 'jpeg', 'tiff', 'webp', 'gif'];

    fileTypes.forEach(function (item) {
        if (fm.fileExists((backgroundImageURL + item.toLowerCase())) === true) {
            backgroundImageURL = backgroundImageURLRAW + "." + item.toLowerCase();
        } else if (fm.fileExists((backgroundImageURL + item.toUpperCase())) === true) {
            backgroundImageURL = backgroundImageURLRAW + "." + item.toUpperCase();
        }
    });
} else {
    backgroundImageURL = scriptableFilePath + removeSpaces2;
}

/*
 * WEATHER
*/

// Load Your api in "".Get a free API key here: https://openweathermap.org/appid
let API_WEATHER = "7dbf12e00d4b90fad876a9559fa510b5";

// add your city ID
let CITY_WEATHER = "1816670";

// 华氏度设置为英制imperial，摄氏度设置为公制metric
let TEMPERATURE = "metric"

// 使用 "\u2103" 为摄氏度,使用 "\u2109" 为华氏度。
let UNITS = "\u2103"

// 储存空间。
const base_path = "/var/mobile/Library/Mobile Documents/iCloud~dk~simonbs~Scriptable/Documents/weather/";

// 从网址获取图片。
async function fetchImageUrl(url) {
    const request = new Request(url)
    return await request.loadImage();
}

// 从本地加载图像。
async function fetchImageLocal(path) {
    const finalPath = base_path + path + ".png";
    if (fm.fileExists(finalPath) === true) {
        console.log("file exists: " + finalPath);
        return finalPath;
    } else {
        if (fm.fileExists(base_path) === false) {
            console.log("Directory not exist creating one.");
            fm.createDirectory(base_path);
        }
        console.log("Downloading file: " + finalPath);
        await downloadImg(path);
        if (fm.fileExists(finalPath) === true) {
            console.log("file exists after download: " + finalPath);
            return finalPath;
        } else {
            throw new Error("Error file not found: " + path);
        }
    }
}

// 天气icons
async function downloadImg(path) {
    const url = "http://a.animedlweb.ga/weather/weathers25_2.json";
    const data = await fetchWeatherData(url);
    let dataImg;
    let name;
    if (path.includes("bg")) {
        dataImg = data.background;
        name = path.replace("_bg", "");
    } else {
        dataImg = data.icon;
        name = path.replace("_ico", "");
    }
    let imgUrl = null;
    switch (name) {
        case "01d":
            imgUrl = dataImg._01d;
            break;
        case "01n":
            imgUrl = dataImg._01n;
            break;
        case "02d":
            imgUrl = dataImg._02d;
            break;
        case "02n":
            imgUrl = dataImg._02n;
            break;
        case "03d":
            imgUrl = dataImg._03d;
            break;
        case "03n":
            imgUrl = dataImg._03n;
            break;
        case "04d":
            imgUrl = dataImg._04d;
            break;
        case "04n":
            imgUrl = dataImg._04n;
            break;
        case "09d":
            imgUrl = dataImg._09d;
            break;
        case "09n":
            imgUrl = dataImg._09n;
            break;
        case "10d":
            imgUrl = dataImg._10d;
            break;
        case "10n":
            imgUrl = dataImg._10n;
            break;
        case "11d":
            imgUrl = dataImg._11d;
            break;
        case "11n":
            imgUrl = dataImg._11n;
            break;
        case "13d":
            imgUrl = dataImg._13d;
            break;
        case "13n":
            imgUrl = dataImg._13n;
            break;
        case "50d":
            imgUrl = dataImg._50d;
            break;
        case "50n":
            imgUrl = dataImg._50n;
            break;
    }
    const image = await fetchImageUrl(imgUrl);
    console.log("Downloaded Image");
    fm.writeImage(base_path + path + ".png", image);
}

// 获取天气Json。
async function fetchWeatherData(url) {
    const request = new Request(url);
    return await request.loadJSON();
}

// Get Location

let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?id=" + CITY_WEATHER + "&APPID=" + API_WEATHER + "&units=" + TEMPERATURE;

let weatherJSON = await fetchWeatherData(weatherUrl);
let weatherArray = weatherJSON.weather;
let iconData = weatherArray[0].icon;
let weatherName = weatherArray[0].main;
let curTempObj = weatherJSON.main;
let curTemp = curTempObj.temp;
let highTemp = curTempObj.temp_max;
let feel_like = curTempObj.feels_like;
//Completed loading weather data

/*
 * DATE
*/

// 日期和月份。
const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/*
 * GREETINGS
*/

// 每个时间段的问候语。
const greetingsMorning = [
    '早上好.靓仔'
];
const greetingsNoon = [
    '中午好.靓仔'
];
const greetingsAfternoon = [
    '下午好.靓仔'
];
const greetingsEvening = [
    '晚上好.靓仔'
];
const greetingsNight = [
    '睡觉时间.靓仔'
];
const greetingsLateNight = [
    '赶紧睡觉!!!'
];

// 节日问候语定制。
let holidaysByKey = {
    // month,week,day: date text
    "11,4,4": "Happy Thanksgiving!"
}

const holidaysByDate = {
    // month,date: greeting
    "1,1": "Happy " + (today.getFullYear()).toString() + "!",
    "10,31": "Happy Halloween!",
    "12,25": "Merry Christmas!"
};

let holidayKey = (today.getMonth() + 1).toString() + "," + (Math.ceil(today.getDate() / 7)).toString() + "," + (today.getDay()).toString();
let holidayKeyDate = (today.getMonth() + 1).toString() + "," + (today.getDate()).toString();

// 日期计算。
let weekday = days[today.getDay()];
let month = months[today.getMonth()];
let date = today.getDate();
let hour = today.getHours();

// 日期后缀,中文的全部改为 "日" 即可。
function ordinalSuffix(input) {
    if (input % 10 === 1 && date !== 11) {
        return input.toString() + "日";
    } else if (input % 10 === 2 && date !== 12) {
        return input.toString() + "日";
    } else if (input % 10 === 3 && date !== 13) {
        return input.toString() + "日";
    } else {
        return input.toString() + "日";
    }
}

// 日期生成格式顺序。
let fullDate = month + " " + ordinalSuffix(date) + ", " + weekday;

// 支持每个时间段的多个问候。
function randomGreeting(greetingArray) {
    return Math.floor(Math.random() * greetingArray.length);
}

let greeting = String("Howdy.");
if (hour < 5 && hour >= 1) { // 1am - 5am
    greeting = greetingsLateNight[randomGreeting(greetingsLateNight)];
} else if (hour >= 23 || hour < 1) { // 11pm - 1am
    greeting = greetingsNight[randomGreeting(greetingsNight)];
} else if (hour < 11) { // Before noon (5am - 12pm)
    greeting = greetingsMorning[randomGreeting(greetingsMorning)];
} else if (hour >= 11 && hour <= 13) { // 11am - 1pm
    greeting = greetingsNoon[randomGreeting(greetingsNoon)];
} else if (hour > 13 && hour <= 17) { // 1pm - 5pm
    greeting = greetingsAfternoon[randomGreeting(greetingsAfternoon)];
} else if (hour > 17 && hour < 23) { // 5pm - 11pm
    greeting = greetingsEvening[randomGreeting(greetingsEvening)];
}

// 如果是特定假期,则使用假期问候语
if (holidaysByKey[holidayKey]) {
    greeting = holidaysByKey[holidayKey];
}
// 如果是节假日,则使用假期问候语
if (holidaysByDate[holidayKeyDate]) {
    greeting = holidaysByDate[holidayKeyDate];
}

/*
 * BATTERY
 * 电量信息
*/

function getBatteryLevel() {
    const batteryLevel = Device.batteryLevel()
    const batteryAscii = Math.round(batteryLevel * 100);
    return batteryAscii + "%";
}

function renderBattery() {
    const batteryLevel = Device.batteryLevel();
    const juice = "▓".repeat(Math.floor(batteryLevel * 10));
    const used = "░".repeat(10 - juice.length);
    return " " + juice + used + " ";
}

/*
 * YEAR PROGRESS
 * 年进度信息
*/

function getYearProgress() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1) // Start of this year
    const end = new Date(now.getFullYear() + 1, 0, 1) // End of this year
    const yearPassed = (now - start)
    const yearALL = (end - start)
    const yearPercent = (yearPassed) / (yearALL)
    const yearProgress = Math.round(yearPercent * 100);
    return yearProgress + "%";
}

function renderYear() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1) // Start of this year
    const end = new Date(now.getFullYear() + 1, 0, 1) // End of this year
    const yearPassed = (now - start)
    const yearALL = (end - start)
    const yearAscii = (yearPassed) / (yearALL);
    const passed = '▓'.repeat(Math.floor(yearAscii * 10));
    const left = '░'.repeat(10 - passed.length);
    return " " + passed + left + " ";
}

// Try/catch for color input parameter
// 尝试获取输入的颜色参数
try {
    inputArr[0].toString();
} catch (e) {
    throw new Error("Please long press the widget and add a parameter.");
}
new Color(inputArr[0].toString());
if (config.runsInWidget) {
    let widget = new ListWidget()
    widget.backgroundImage = files.readImage(path)

    /* 您可以在此处编写自己的代码，以将其他项目添加到小部件。
     * ---------------
     * Assemble Widget
     * ---------------
     *Script.setWidget(widget)
     */

    // 顶部间距
    widgetHello.addSpacer(15);

    // 问候标签
    let hello = widgetHello.addText(" " + greeting);
    hello.font = Font.boldSystemFont(35);
    hello.textColor = new Color('e8ffc1');
    // 不透明度
    hello.textOpacity = (1);
    hello.leftAlignText();

    // 问候标签与年进度行之间的间距
    widgetHello.addSpacer(5);

    // 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack0）
    let hStack0 = widgetHello.addStack();
    hStack0.layoutHorizontally();
    // 向左对齐间距
    hStack0.addSpacer(10);

    // 年进度图标
    const YearProgressIcon = hStack0.addText("📅 全年")
    YearProgressIcon.font = Font.regularSystemFont(12)
    YearProgressIcon.textColor = new Color('#8675a9')
    // 不透明度
    YearProgressIcon.textOpacity = (1);
    YearProgressIcon.leftAlignText();

    // 年进度条、标签
    const YearProgress = hStack0.addText(renderYear())
    YearProgress.font = new Font('Menlo', 12)
    YearProgress.textColor = new Color('#8675a9')
    // 不透明度
    YearProgress.textOpacity = (1);
    YearProgress.leftAlignText();

    // 年进度百分比
    const YearPercentage = hStack0.addText(getYearProgress())
    YearPercentage.font = Font.regularSystemFont(12)
    YearPercentage.textColor = new Color('#8675a9')
    // 不透明度
    YearPercentage.textOpacity = (1);
    YearPercentage.leftAlignText();

    // 年进度标语
    const YearSlogan = hStack0.addText(" 𝒚𝒐𝒖 𝒅𝒊𝒅 𝒚𝒐𝒖𝒓 𝒃𝒆𝒔𝒕 𝒕𝒐𝒅𝒂𝒚?!")
    YearSlogan.font = Font.regularSystemFont(14)
    YearSlogan.textColor = new Color('#8675a9')
    // 不透明度
    YearSlogan.textOpacity = (1);
    YearSlogan.leftAlignText();


    // 年进度与电量行间距
    widgetHello.addSpacer(5);

    // 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack1）
    let hStack1 = widgetHello.addStack();
    hStack1.layoutHorizontally();

    hStack1.addSpacer(10);

    // 电量图标、标签、颜色
    const batteryIcon = hStack1.addText("⚡ 电能");
    batteryIcon.font = Font.regularSystemFont(12);
    setBatteryTextColor(batteryIcon)
    // 不透明度
    batteryIcon.textOpacity = (1);
    batteryIcon.leftAlignText();

    // 电量进度条、颜色
    const batteryLine = hStack1.addText(renderBattery());
    batteryLine.font = new Font("Menlo", 12);
    setBatteryTextColor(batteryLine)
    // 不透明度
    batteryLine.textOpacity = (1);
    batteryLine.leftAlignText();

    // 电量状态、提示语
    let battery = getBatteryLevel();
    if (Device.isCharging() && Device.batteryLevel() < 1) {
        battery = battery + " ⚡";
    }
    if (Device.isCharging() && Device.batteryLevel() >= 1) {
        battery = battery + " ⚡ 已充满电!请拔下电源!";
    } else if (Device.batteryLevel() > 0.8 && Device.batteryLevel() <= 1 && !Device.isCharging()) {
        battery = battery + " 电量充足,很有安全感!";
    } else if (Device.batteryLevel() >= 0.7 && Device.batteryLevel() < 0.8) {
        battery = battery + " 电量充足,不出远门没有问题!";
    } else if (Device.batteryLevel() >= 0.6 && Device.batteryLevel() < 0.7) {
        battery = battery + " 电量还有大半呢,不用着急充电!";
    } else if (Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.6) {
        battery = battery + " 电量用了不到一半,不着急充电!";
    } else if (Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 && !Device.isCharging()) {
        battery = battery + " 电量用了一半,有时间就充电啦!";
    } else if (Device.batteryLevel() >= 0.4 && Device.batteryLevel() < 0.5 && Device.isCharging()) {
        battery = battery + " 正在充入电能中...";
    } else if (Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 && !Device.isCharging()) {
        battery = battery + " 电量用了大半了,尽快充电啦!";
    } else if (Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.4 && Device.isCharging()) {
        battery = battery + " 正在充入电能中...";
    } else if (Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()) {
        battery = battery + " 电量很快用完,赶紧充电啦!";
    } else if (Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && Device.isCharging()) {
        battery = battery + " 正在快速充入电能中...";
    } else if (Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 && !Device.isCharging()) {
        battery = battery + " 电量就剩不到20%了,尽快充电!";
    } else if (Device.batteryLevel() >= 0.1 && Device.batteryLevel() < 0.2 && Device.isCharging()) {
        battery = battery + " 正在快速充入电能中...";
    } else if (Device.batteryLevel() <= 0.1 && !Device.isCharging()) {
        battery = battery + " 电量将耗尽,再不充电我就关机了!";
    } else if (Device.batteryLevel() <= 0.1 && Device.isCharging()) {
        battery = battery + " 正在快速充入电能中...";
    }
    // 电量状态颜色
    let batteryText = hStack1.addText(battery);
    batteryText.font = Font.regularSystemFont(12);
    setBatteryTextColor(batteryText)
    // 不透明度
    batteryText.textOpacity = (1);
    batteryText.leftAlignText();

    // 电量与天气、日期之间的间距
    widgetHello.addSpacer(5);

    // 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
    let hStack2 = widgetHello.addStack();
    hStack2.layoutHorizontally();

    hStack2.addSpacer(10);

    // 天气简报（最高温度与最低温度）
    const feeltext = hStack2.addText(weatherName + " 𝙩𝙤𝙙𝙖𝙮" + "." + " 𝙄𝙩 𝙛𝙚𝙚𝙡𝙨 𝙡𝙞𝙠𝙚 " + Math.round(feel_like) + UNITS + ";" + " 𝙩𝙝𝙚 𝙝𝙞𝙜𝙝 𝙬𝙞𝙡𝙡 𝙗𝙚 " + Math.round(highTemp) + UNITS);
    feeltext.font = Font.regularSystemFont(12);
    if (feel_like >= 33) {
        feeltext.textColor = new Color('#bd2216');
    } else if (feel_like >= 27 && feel_like < 33) {
        feeltext.textColor = new Color('#f2ca08');
    } else if (feel_like >= 20 && feel_like < 27) {
        feeltext.textColor = new Color('#4ceb39');
    } else if (feel_like >= 0 && feel_like < 20) {
        feeltext.textColor = new Color('#4ce8dd');
    } else {
        feeltext.textColor = new Color('#2401fd');
    }
    // 不透明度
    feeltext.textOpacity = (0.7);
    feeltext.leftAlignText();


    // 创建一个stack，使下面组件都在同一个stack中，布局为横向布局（hStack2）
    let hStack3 = widgetHello.addStack();
    hStack3.layoutHorizontally();

    hStack3.addSpacer(10);

    // 日期
    const datetext = hStack3.addText(fullDate + "  ");
    datetext.font = Font.regularSystemFont(30);
    datetext.textColor = new Color('#ffffff');
    // 不透明度
    datetext.textOpacity = (0.8);
    datetext.leftAlignText();

    // 天气图标
    var img = Image.fromFile(await fetchImageLocal(iconData + "_ico"));
    let widgetimg = hStack3.addImage(img);
    widgetimg.imageSize = new Size(40, 40);
    widgetimg.leftAlignImage();

    // 温度
    let temptext = hStack3.addText('\xa0\xa0' + Math.round(curTemp).toString() + UNITS);
    temptext.font = Font.boldSystemFont(30);
    temptext.textColor = new Color('#0278ae');
    // 不透明度
    temptext.textOpacity = (1);
    temptext.leftAlignText();

    // 底部间距
    widgetHello.addSpacer();
    widgetHello.setPadding(0, 0, 0, 0)
    widgetHello.backgroundImage = widget.backgroundImage
    Script.setWidget(widgetHello)
    //Script.complete()
} else {
    /*
     * The code below this comment is used to set up the invisible widget.
     * 以下的代码用于设置小组件的 "透明背景"
     * ===================================================================
     */

    // 确定用户是否有了屏幕截图。
    let message;
    message = "开始之前，请返回主屏幕并长按进入编辑模式。滑动到最右边的空白页并截图。"
    let exitOptions = ["继续", "退出以截图"]
    let shouldExit = await generateAlert(message, exitOptions)
    if (shouldExit) return

    // 获取屏幕截图并确定手机大小。
    let img = await Photos.fromLibrary()
    let height = img.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
        message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次。"
        await generateAlert(message, ["OK"])
        return
    }

    // 提示窗口小部件的大小和位置。
    message = "您想要创建什么尺寸的小部件？"
    let sizes = ["Small", "Medium", "Large"]
    let size = await generateAlert(message, sizes)
    let widgetSize = sizes[size]

    message = "您想它在什么位置？"
    message += (height === 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "")

    // 根据手机大小确定图像裁剪。
    let crop = {w: "", h: "", x: "", y: ""}
    if (widgetSize === "Small") {
        crop.w = phone.small
        crop.h = phone.small
        let positions = ["Top left", "Top right", "Middle left", "Middle right", "Bottom left", "Bottom right"]
        let position = await generateAlert(message, positions)

        // Convert the two words into two keys for the phone size dictionary.
        let keys = positions[position].toLowerCase().split(' ')
        crop.y = phone[keys[0]]
        crop.x = phone[keys[1]]

    } else if (widgetSize === "Medium") {
        crop.w = phone.medium
        crop.h = phone.small

        // Medium and large widgets have a fixed x-value.
        crop.x = phone.left
        let positions = ["Top", "Middle", "Bottom"]
        let position = await generateAlert(message, positions)
        let key = positions[position].toLowerCase()
        crop.y = phone[key]

    } else if (widgetSize === "Large") {
        crop.w = phone.medium
        crop.h = phone.large
        crop.x = phone.left
        let positions = ["Top", "Bottom"]
        let position = await generateAlert(message, positions)

        // Large widgets at the bottom have the "middle" y-value.
        crop.y = position ? phone.middle : phone.top
    }

    // 裁剪图像并完成小部件。
    let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))

    message = "您的小部件背景已准备就绪。您想在Scriptable的小部件中使用它还是导出图像？"
    const exportPhotoOptions = ["在Scriptable中使用", "导出图像"]
    const exportPhoto = await generateAlert(message, exportPhotoOptions)

    if (exportPhoto) {
        Photos.save(imgCrop)
    } else {
        files.writeImage(path, imgCrop)
    }

    Script.complete()
}

// 使用提供的选项数组生成提示
async function generateAlert(message, options) {
    let alert = new Alert()
    alert.message = message
    for (const option of options) {
        alert.addAction(option)
    }
    return await alert.presentAlert()
}

// 将图像裁剪为指定的矩形。
function cropImage(img, rect) {
    let draw = new DrawContext()
    draw.size = new Size(rect.width, rect.height)
    draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
    return draw.getImage()
}

function setBatteryTextColor(text) {
    if (Device.isCharging() && Device.batteryLevel() < 1) {
        // 充电状态
        text.textColor = new Color('#008891');
    }
    if (Device.isCharging() && Device.batteryLevel() >= 1) {
        // 满电提示
        text.textColor = new Color('#ff5f40');
    } else if (Device.batteryLevel() >= 0.8 && Device.batteryLevel() <= 1 && !Device.isCharging()) {
        // 电量充足
        text.textColor = new Color('#c4fb6d');
    } else if (Device.batteryLevel() >= 0.5 && Device.batteryLevel() < 0.8 && !Device.isCharging()) {
        // 电量正常
        text.textColor = new Color('#d3de32');
    } else if (Device.batteryLevel() >= 0.3 && Device.batteryLevel() < 0.5 && !Device.isCharging()) {
        // 电量偏低
        text.textColor = new Color('#e5df88');
    } else if (Device.batteryLevel() >= 0.2 && Device.batteryLevel() < 0.3 && !Device.isCharging()) {
        // 电量低
        text.textColor = new Color('#ffd571');
    } else if (Device.batteryLevel() >= 0 && Device.batteryLevel() < 0.2 && !Device.isCharging()) {
        // 电量不足
        text.textColor = new Color('#ec0101');
    }
}

// 所有支持的手机上小部件的像素大小和位置。
function phoneSizes() {
    return {
        "2688": {
            "small": 507,
            "medium": 1080,
            "large": 1137,
            "left": 81,
            "right": 654,
            "top": 228,
            "middle": 858,
            "bottom": 1488
        },

        "1792": {
            "small": 338,
            "medium": 720,
            "large": 758,
            "left": 54,
            "right": 436,
            "top": 160,
            "middle": 580,
            "bottom": 1000
        },

        "2436": {
            "small": 465,
            "medium": 987,
            "large": 1035,
            "left": 69,
            "right": 591,
            "top": 213,
            "middle": 783,
            "bottom": 1353
        },

        "2208": {
            "small": 471,
            "medium": 1044,
            "large": 1071,
            "left": 99,
            "right": 672,
            "top": 114,
            "middle": 696,
            "bottom": 1278
        },

        "1334": {
            "small": 296,
            "medium": 642,
            "large": 648,
            "left": 54,
            "right": 400,
            "top": 60,
            "middle": 412,
            "bottom": 764
        },

        "1136": {
            "small": 282,
            "medium": 584,
            "large": 622,
            "left": 30,
            "right": 332,
            "top": 59,
            "middle": 399,
            "bottom": 399
        },
        "1624": {
            "small": 310,
            "medium": 658,
            "large": 690,
            "left": 46,
            "right": 394,
            "top": 142,
            "middle": 522,
            "bottom": 902
        }
    }
}
