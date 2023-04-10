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
    $base_currency = "RUB";
    $api_key = "6rOLEhF1PKO8tbicWoLG9wCXSRwlE3hk";
    $api_url = "https://api.apilayer.com/exchangerates_data/latest";

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
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "apikey: $api_key"
    ));

    $response = curl_exec($ch);
    curl_close($ch);

    // echo ($response);

    // Парсим полученный JSON
    $rates = json_decode($response, true)["rates"];
    $rates["update_date"] = date("Y-m-d H:i:s"); // Добавляем текущую дату

    // Сохраняем курсы валют в БД
    $json_data = json_encode($rates); // Получаем JSON-представление всех курсов валют
    $stmt = $mysqli->prepare("INSERT INTO exchange_rates (currency_code, exchange_rate, update_date, json_data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE exchange_rate = ?, update_date = ?, json_data = ?");
    foreach ($rates as $currency_code => $exchange_rate) {
        $stmt->bind_param("sdsdsds", $currency_code, $exchange_rate, $rates["update_date"], $json_data, $exchange_rate, $rates["update_date"], $json_data);
        $stmt->execute();
    }
}

// Выполняем скачивание курса валют и сохранение в БД
downloadExchangeRates($mysqli);

$result = $mysqli->query("SELECT json_data FROM `exchange_rates` ORDER BY id DESC LIMIT 1");
$row = $result->fetch_assoc();
$json_data = $row["json_data"];

// Возвращаем результат в формат JSON
echo $json_data
?>

