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
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    exit();
}

// Получаем курсы валют из БД
$result = $mysqli->query("SELECT * FROM `exchange_rates`");

// Собираем результат в массив
$exchange_rates = array();

while ($row = $result->fetch_assoc()) {
    $exchange_rates[$row["currency_code"]] = floatval($row["exchange_rate"]);
}

// Возвращаем результат в формат JSON
echo json_encode($exchange_rates);

// Закрываем соединение с базой данных
mysqli_close($mysqli);

?>
