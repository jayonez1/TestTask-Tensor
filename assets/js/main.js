// рандом
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// добавление кораблей для подсчета статистики
var shipAdd = function (start, end, shipSize, arr){
  if (arr === userMap) {
    userShip.push([start,end,shipSize])
    shipSumUser = userShip.length
  } else {
    botShip.push([start,end,shipSize])
    shipSumBot = botShip.length
  }
}

// уменьшение корабля если в него попали
// удаление мертвых кораблей из массива
// если в массиве у игрока или бота пусто (конец игры)
var shipRemove = function (x, y, ship){
  // при попадании уменьшаем длинну корабля
  for (var i = 0; i < ship.length; i++){
    if (y >= ship[i][0][0] && x >= ship[i][0][1] && y <= ship[i][1][0] && x <= ship[i][1][1]){
      ship[i][2] = ship[i][2] - 1

    }
  }
  // если длина корабля 0 удаляем его - он убит
  for (var j = 0; j < ship.length; j++){
    if (ship[j][2] == 0) {
      ship.splice(j, 1);
    }
  }
  // если в массиве у игрока или бота пусто (конец игры)
  if (ship.length == 0) {
    endGame = true
  }
}

// проверка на вхождение ячейки в таблицу
var cellFined = function(y,x){
  if (y >= 0 && y <= 9 && x >= 0 && x <= 9){
    return true
  } else {
    return false
  }
}
// блокирование соседних ячеек от записи, для того чтобы корабли не сталкивались.
var cellBan = function(x,y,arr){
  if (cellFined(y,x-1) && arr[y][x-1] != 1) {arr[y][x-1] = 3}
  if (cellFined(y-1,x-1) && arr[y-1][x-1] != 1) {arr[y-1][x-1] = 3}
  if (cellFined(y+1,x-1) && arr[y+1][x-1] != 1) {arr[y+1][x-1] = 3}
  if (cellFined(y-1,x) && arr[y-1][x] != 1) {arr[y-1][x] = 3}
  if (cellFined(y+1,x) && arr[y+1][x] != 1) {arr[y+1][x] = 3}
  if (cellFined(y,x+1) && arr[y][x+1] != 1) {arr[y][x+1] = 3}
  if (cellFined(y-1,x+1) && arr[y-1][x+1] != 1) {arr[y-1][x+1] = 3}
  if (cellFined(y+1,x+1) && arr[y+1][x+1] != 1) {arr[y+1][x+1] = 3}
}

// Проверка, возможно ли в этом месте поставить корабль
var availabilityCheck = function(arr, shipSize, shipSum){
  for (var k = 0; k < shipSum; k++){
    var check = false;
    // расположение коробля
    var x;
    var y;
    var side; // 0 горизонтально, 1 вертикально
    while (!check) {
      var result = 0
      x = getRandomInt(0,9);
      y = getRandomInt(0,9);
      side = getRandomInt(0,1); // 0 горизонтально, 1 вертикально
      if (side == 0 ){
        if (x + shipSize <= 9){
          for (var i = 0; i < shipSize; i++){
            result = result + arr[y][x+i];
          }
        }else {
          for (var i = 0; i < shipSize; i++){
            result = result + arr[y][x-i]
          }
        }
      } else if (side == 1 ){
          if (y + shipSize <= 9){
            for (var i = 0; i < shipSize; i++){
              result = result + arr[y+i][x]
            }
          }else {
            for (var i = 0; i < shipSize; i++){
              result = result + arr[y-i][x]
            }
          }
        }
      if (result == 0) {
        check = true
      }
    }
    addShip(x,y,arr,side,shipSize) // создание корабля

  }
}


// расстановка кораблей
var shipsPlacement = function(arr) {
  availabilityCheck(arr,4,1) // создаем 1 - 4х палубник
  availabilityCheck(arr,3,2) // создаем 2 - 3х палубника
  availabilityCheck(arr,2,3) // создаем 3 - 2х палубника
  availabilityCheck(arr,1,4) // создаем 4 - 1 палубника
}
// возвращает нужную иконку на карте (живой/мертвый корабль, промах, пустота)
var iconSelection = function (cell, turn) {
  if (cell == 1 && turn == "user") {
    return "<i class='fa fa-square-o icon_ship-live'></i>"
  } else if (cell == 2) {
    return "<i class='fa fa-window-close-o icon_ship-die'></i>"
  } else if (cell == 4) {
    return "<i class='fa fa-dot-circle-o icon_ship-miss'></i>"
  } else {
    return "<i class='fa fa-square-o icon_ship-null'></i>"
  }
}

// обновление карт для хода игрока
var mapUpdateUserAttack = function (){
  updateStateShip(); // обновление статы
  $("#gameMapUserTable").empty(); // очистка поля игрока
  // заполнение поля игрока
  $("#gameMapUserTable").append(" <tr><th></th><th>А</th><th>Б</th><th>В</th><th>Г</th><th>Д</th><th>Е</th><th>Ж</th><th>З</th><th>И</th><th>К</th></tr>")
  for (var i = 0; i < 10; i++){
    $("#gameMapUserTable").append("<tr id='userTableTr_"+i+"' ><td style='border:none'>"+(i+1)+"</td></tr>");
    for (var j = 0; j < 10; j++){
      $("#userTableTr_"+i).append("<td>"+iconSelection(userMap[i][j], "user")+"</td>");
    }
  }
  $("#gameMapAttackTable").empty(); // очистка поля для атаки (поле бота)
  // заполнение поля для атаки (поле бота)
  $("#gameMapAttackTable").append(" <tr><th></th><th>А</th><th>Б</th><th>В</th><th>Г</th><th>Д</th><th>Е</th><th>Ж</th><th>З</th><th>И</th><th>К</th></tr>")
  for (var i = 0; i < 10; i++){
    $("#gameMapAttackTable").append("<tr id='attackTableTr_"+i+"' ><td style='border:none'>"+(i+1)+"</td></tr>");
    for (var j = 0; j < 10; j++){
      // если в ячейку уже попадали, запрещаем нажатие на нее
      if (attackMap[i][j] == 2 || attackMap[i][j] == 4 || endGame) {
        $("#attackTableTr_"+i).append("<td >"+iconSelection(attackMap[i][j])+"</td>");
        // иначе добавляем возможность нажатия на ячейку, для атаки
      } else {
        $("#attackTableTr_"+i).append("<td class='user_attack_cell' onclick='userAttack("+i+","+j+")'>"+iconSelection(attackMap[i][j])+"</td>");
      }
    }
  }
}

// обновление карт для хода компьютера
var mapUpdateBotAttack = function (){
  updateStateShip(); // обновление статы
  $("#gameMapUserTable").empty(); // очистка поля пользователя
  // заполнение поля игрока
  $("#gameMapUserTable").append(" <tr><th></th><th>А</th><th>Б</th><th>В</th><th>Г</th><th>Д</th><th>Е</th><th>Ж</th><th>З</th><th>И</th><th>К</th></tr>")
  for (var i = 0; i < 10; i++){
    $("#gameMapUserTable").append("<tr id='userTableTr_"+i+"' ><td style='border:none'>"+(i+1)+"</td></tr>");
    for (var j = 0; j < 10; j++){
      $("#userTableTr_"+i).append("<td>"+iconSelection(userMap[i][j], "user")+"</td>");
    }
  }
  $("#gameMapAttackTable").empty(); // очистка поля для атаки (поле бота)
  // заполнение поля для атаки (поле бота)
  $("#gameMapAttackTable").append(" <tr><th></th><th>А</th><th>Б</th><th>В</th><th>Г</th><th>Д</th><th>Е</th><th>Ж</th><th>З</th><th>И</th><th>К</th></tr>")
  for (var i = 0; i < 10; i++){
    $("#gameMapAttackTable").append("<tr id='attackTableTr_"+i+"' ><td style='border:none'>"+(i+1)+"</td></tr>");
    for (var j = 0; j < 10; j++){
      $("#attackTableTr_"+i).append("<td>"+iconSelection(attackMap[i][j])+"</td>");
    }
  }
}

// обновление статистики о кораблях
var updateStateShip = function(){
  $("#userStateShip").text(" У Вас кораблей осталось: "+userShip.length);
  $("#botStateShip").text(" У противника кораблей осталось: "+botShip.length);
}

// добавление корабля
var addShip = function(x,y,arr,side,shipSize){
  var start = []
  var end = []
  if (side == 0 ){
    if (x + shipSize <= 9){
      for (var i = 0; i < shipSize; i++){
        if (i == 0 || shipSize == 1) {
          start = [y,x]
          end = [y,x]
        } else if (i == shipSize-1){
          end = [y,x+i]
        }
        arr[y][x+i] = 1
        cellBan(x+i,y,arr)
      }
    }else {
      for (var i = 0; i < shipSize; i++){
        if (i == 0 || shipSize == 1) {
          start = [y,x]
          end = [y,x]
        } else if (i == shipSize-1){
          start = [y,x-i]
        }
        arr[y][x-i] = 1
        cellBan(x-i,y,arr)
      }
    }
  } else if (side == 1 ){
      if (y + shipSize <= 9){
        for (var i = 0; i < shipSize; i++){
          if (i == 0 || shipSize == 1) {
            start = [y,x]
            end = [y,x]
          } else if (i == shipSize-1){
            end = [y+i,x]
          }
          arr[y+i][x] = 1
          cellBan(x,y+i,arr)
        }
      }else {
        for (var i = 0; i < shipSize; i++){
          if (i == 0 || shipSize == 1) {
            start = [y,x]
            end = [y,x]
          } else if (i == shipSize-1){
            start = [y-i,x]
          }
          arr[y-i][x] = 1
          cellBan(x,y-i,arr)
        }
      }
    }
    shipAdd(start, end, shipSize, arr) // добавление кораблей для подсчета статистики
}

//Ход игрока
var userAttack = function(y,x){
  // если попал в корабль, повтор хода
  if (attackMap[y][x] == 1){
    attackMap[y][x] = 2 // делаем ячейку мертвой
    shipRemove(x, y, botShip) // уменьшение корабля или удаление при смерти
    // если после удаления, в массиве еще есть корабли, продолжаем игру
    if (!endGame) {
      mapUpdateUserAttack() // обновление карт, для хода игрока
      // если сумма сохраненых до хода кораблей у бота такая же как и новая, значит в корабль попали
      if (shipSumBot == botShip.length) {
        $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Эй! Ты подбил мой корабль, осторожнее!</p>")
      } else {
        // если сумма сохраненных не равна новой сумме кораблей, значит корабль во время этого хода убили
        $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Ты УБИЛ мой корабль! Я буду мстить!</p>")
        // сохраняем новую информацию о кол-ве кораблей у бота
        shipSumBot = botShip.length;
      }
      // скрол чата вниз
      scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // если после хода игрока, в массиве не осталось кораблей, заканчиваем игру
    } else {
      endGameGo()
    }
  // если не попал, переход к ходу бота
  } else {
    attackMap[y][x] = 4 // делаем ячейку - МИМО
    mapUpdateBotAttack() // обновляем карты для хода бота
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> фууух, МИМО!</p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Ход противника </p>")
    // скрол чата вниз
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    setTimeout(botAttack, 1000); // ход бота
  }

}
// Ход бота
var botAttack = function(turnInfo){
  // если игра не закончилась, бот ходит
  if (!endGame) {
    // получаем случайную ячейку для атаки
    var x = getRandomInt(0,9)
    var y = getRandomInt(0,9)
    // если бот попадает в ячейку в которую уже стрелял - получает новые значения для атаки
    if (userMap[y][x] == 4 || userMap[y][x] == 2){
      botAttack()
    // если бот попал - повтор хода
    }else if (userMap[y][x] == 1){
      userMap[y][x] = 2 // делаем ячейку мертвой
      shipRemove(x, y, userShip) // уменьшение корабля или удаление при смерти
      mapUpdateBotAttack() // обновление карт, для хода бота
      // если сумма сохраненых до хода кораблей у игрока такая же как и новая, значит в корабль попали
      if (shipSumUser == userShip.length) {
        $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Я подбил твой корабль! Ееее!</p>")
      } else {
        // если сумма сохраненных не равна новой сумме кораблей, значит корабль во время этого хода убили
        $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Я УБИЛ твой корабль!!!</p>")
        // сохраняем новую информацию о кол-ве кораблей у игрока
        shipSumUser = userShip.length;
      }
      // скрол чата вниз
      scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
      setTimeout(botAttack, 1000); // повтор хода
      // если не попал, переход к ходу игрока
    } else {
      userMap[y][x] = 4 // делаем ячейку - МИМО
      $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Я промахнулся, бывает =( </p>")
      $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Ваш ход </p>")
      // скрол чата вниз
      scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
      mapUpdateUserAttack() // обновление карт, для хода игрока
    }
    // если после хода бота, в массиве не осталось кораблей, заканчиваем игру
  } else {
    endGameGo()
  }
}
// Конец игры
var endGameGo = function() {
  mapUpdateBotAttack(); // обновление карт, для хода бота (для предотвращения нажатий по карте атаки)
  // если у игрока не осталось кораблей - значит он проиграл
  if (userShip.length == 0){
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Ладно, мне просто повезло! НО, Я ВЫЙГРАЛ! УРАА!!!</p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Противник выйграл. </p>")
    // если у бота не осталось кораблей - значит он проиграл
  } else if (botShip.length == 0) {
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Ладно, я просто ... я поддавался!!!</p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Вы победили. </p>")
  }
  $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Для новой игры напишите: старт </p>")
  // скрол чата вниз
  scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
}

// обработка сообщей в чате от игрока, при нажатии кнопки отправить
var chatSay = function () {
  var userSay = $("#gameInfoFormInput").val() // получаем значение из input
  // если игрок отправил не пустое сообщение и игра еще не закончилась
  if (userSay.length > 0 && !endGame) {
    $("#gameInfoFormInput").val("");
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-user'><b>"+userName+":</b> "+userSay+" </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Хватит болтать! Играй!</p>")
    // скрол чата вниз
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // если игра закончилась и игрок написал СТАРТ - перезапустить игру
  } else if (userSay.toLowerCase() == "старт" && endGame) {
    main();
  }
}
// создание имени пользователя
var createUserName = function () {
  var name = $("#gameInfoFormInput").val() // получаем значение из input
  // если сообщение от игрока пустое
  if (name.length == 0) {
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> ауу? ты просто отправил мне пустоту? </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Попробуй еще раз! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // если сообщение от игрока больше 10 символов
  } else if (name.length > 10) {
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Это очень длиииииино, давай не больше 10 знаков. ок? </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Попробуй еще раз! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // иначе, сохраняем имя пользователя
  } else {
    $("#gameInfoFormInput").val("");
    // меняем функцию на нажатие кнопки отправить в чате на "создание имени бота"
    $("#gameInfoFormButton").attr("onclick","createBotName()");
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Вы установили себе имя: "+name+" </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Как бы ты хотел меня звать? </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    userName = name; // сохраняем имя пользователя
  }
}

// создание имени бота
var createBotName = function () {
  var name = $("#gameInfoFormInput").val() // получаем значение из input
  // если сообщение от игрока пустое
  if (name.length == 0) {
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Нуу нет! я не хочу быть пустым местом. </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Давай еще раз! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // если сообщение от игрока больше 10 символов
  } else if (name.length > 10) {
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Это очень длиииииино, давай не больше 10 знаков. ок? </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Попробуй еще раз! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // если игрок ввел тоже имя, что и у него
  } else if (userName.toLowerCase() == name.toLowerCase()){
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Придумай что то поинтереснее чем написать своё имя! Ладно? </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Попробуй еще раз! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    // иначе - сохраняем имя бота
  } else {
    $("#gameInfoFormInput").val("");
    // меняем функцию на нажатие кнопки отправить в чате на "обработка сообщей в чате от игрока"
    $("#gameInfoFormButton").attr("onclick","chatSay()");
        $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Вы установили противнику имя: "+name+" </p>")
    $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Привет "+userName+", меня завут "+name+", давай начнем нашу игру! </p>")
    scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
    botName = name; // сохраняем имя бота
    startGame() // начинаем игру
  }
}

// Старт игры - игрок ходит первый
var startGame = function() {
  mapUpdateUserAttack() // обновление карт, для хода игрока
  $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>"+botName+":</b> Давай ходи первым! </p>")
  $(".gameInfo_chat").append("<p class='gameInfo_chatSay-system'><b>Система:</b> Ваш ход </p>")
  scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
}

var main = function () {
  newGame() // обнуление всех показателей
  shipsPlacement(userMap) // создаем корабли игрока
  shipsPlacement(attackMap) // создаем корабли бота
  mapUpdateBotAttack() // показываем карту с кораблями
  // приветствие
  $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Привет! Сразимся? </p>")
  $(".gameInfo_chat").append("<p class='gameInfo_chatSay-bot'><b>Противник :</b> Как тебя зовут? </p>")
  scrollGameInfoChat.scrollTop(scrollGameInfoChat.get(0).scrollHeight);
  $("#gameInfoFormButton").attr("onclick","createUserName()");
}


// основные переменные
var userMap // поле игрока
var userShip // корабли игрока
var attackMap // поле бота и поле для атаки игрока
var botShip // корабли бота
var userName // имя игрока
var botName // имя бота
var scrollGameInfoChat
var shipSumUser // сохраненное число кораблей у игрока, до попадания бота
var shipSumBot // сохраненное число кораблей у бота, до попадания игрока
var endGame // конец игры



var newGame = function () {
  // разм. кораблей:
  // 0 - пустая клетка
  // 1 - живая клетка корабля
  // 2 - мертвая клетка корабля
  // 3 - пустая клетка запрещенная для записи
  // 4 - клетка при попадании мимо
  userMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
  attackMap = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];
  scrollGameInfoChat = $('#gameInfoChat'); // чат
  scrollGameInfoChat.empty(); // очистка чата, если до этого была другая игра
  $("#gameInfoFormInput").val(""); // очистка инпука
  userName = ""; // очистка имени пользователя
  botName = ""; // очистка имени бота
  userShip = []; // обнуление списка кораблей игрока
  botShip = []; // обнуление списка кораблей бота
  shipSumBot = 0; // обнуление числа кораблей у бота, до попадания бота
  shipSumUser = 0; // обнуление числа кораблей у игрока, до попадания бота
  endGame = false; // выставляем, что игра не закончена
}

$(function() {
  main();
});
