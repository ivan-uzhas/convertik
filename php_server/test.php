Test
<?php
echo "1. php is working </br>";


$my_curl = curl_init(); 
$str="John";  // Change to your name
     
curl_setopt($my_curl, CURLOPT_URL, "https://www.plus2net.com/php_tutorial/curl-test.php?str=$str"); 
curl_setopt($my_curl, CURLOPT_RETURNTRANSFER, 1); 
$return_str = curl_exec($my_curl); 
curl_close($my_curl);
echo $return_str;

echo "2. Curl is working </br>";

$base_currency = 'RUB';
$api_key = "6rOLEhF1PKO8tbicWoLG9wCXSRwlE3hk";
$api_url = "https://api.apilayer.com/exchangerates_data/latest";
$ch = curl_init();
$headers = array(
    "base: $base_currency",
    "apikey: $api_key",
);
curl_setopt($ch, CURLOPT_URL, $api_url."?base=".$base_currency."&apikey=".$api_key);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER,http_build_query($headers));

$response = curl_exec($ch);
if (curl_errno($ch)) { // Если возникла ошибка при выполнении запроса, выводим сообщение об ошибке и выходим из функции
    echo 'Error:' . curl_error($ch);
    return;
}
curl_close($ch);
$rates = json_decode($response, true);
echo $response;
?>

