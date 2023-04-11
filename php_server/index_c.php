<?php

// Определяем параметры для соединения с базой данных
$host = "h304122827.mysql";
$username = "h304122827_mysql";
$password = "kW1tipd_";
$database = "h304122827_db";

// Устанавливаем соединение с базой данных
$mysqli = new mysqli($host, $username, $password, $database);

// Проверяем, удалось ли установить соединение
if ($mysqli->connect_errno) {
   // echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    exit();
}

function downloadExchangeRates($mysqli) {
    // Задаем параметры для запроса к API
    $base_currency = 'RUB';
    $api_key = "6rOLEhF1PKO8tbicWoLG9wCXSRwlE3hk";
    $api_url = "https://api.apilayer.com/exchangerates_data/latest?base=RUB";

    // Проверяем, прошло ли 6 часов с момента последнего обновления
    $result = $mysqli->query("SELECT update_date FROM exchange_rates ORDER BY id DESC LIMIT 1");
    $row = $result->fetch_assoc();
    $last_update_time = strtotime($row["update_date"]);
    $current_time = time();
    if ($current_time - $last_update_time < 6 * 60 * 60) { // Если не прошло 6 часов, то выходим из функции
        return;
    }

    // Выполняем запрос к API
    $ch = curl_init();
    $headers = array(
        "base: $base_currency",
        "apikey: $api_key",
    );
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);
    // curl_setopt($ch, CURLOPT_POSTFIELDS,'base=RUB');

    $response = curl_exec($ch);
    if (curl_errno($ch)) { // Если возникла ошибка при выполнении запроса, выводим сообщение об ошибке и выходим из функции
        echo 'Error:' . curl_error($ch);
        return;
    }
    curl_close($ch);

    // Парсим полученный JSON
    $rates = json_decode($response, true)["rates"];
    $update_date = date("Y-m-d H:i:s"); // Добавляем текущую дату

    // Сохраняем курсы валют в БД
    $json_data = json_encode($rates); // Получаем JSON-представление всех курсов валют
    $stmt = $mysqli->prepare("INSERT INTO exchange_rates (update_date, json_data) VALUES ( ?, ?)");
    // Добавляем параметры в запрос
    $stmt->bind_param("ss", $update_date, $json_data);
    // Выполняем запрос
    $stmt->execute();
    // Закрываем prepared statement
    $stmt->close();

    // Закрываем соединение с базой данных
   // $mysqli->close();
}

// Выполняем скачивание курса валют и сохранение в БД
downloadExchangeRates($mysqli);

// Выполняем запрос на выборку последней строки
$result = $mysqli->query("SELECT update_date,json_data FROM exchange_rates ORDER BY id DESC LIMIT 1");

// Получаем данные из последней строки
$row = $result->fetch_assoc();
$json_data_ext = $row["json_data"];
$update_date = $row["update_date"];

// Возвращаем результат в формат JSON
echo $json_data_ext;
// echo $update_date;

?>