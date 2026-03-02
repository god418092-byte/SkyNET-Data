<?php
// save_robots.php

// Разрешаем CORS (если фронтенд на другом домене)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Получаем данные POST
$input = file_get_contents("php://input");
if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

// Путь к файлу robots.json
$file = __DIR__ . "/robots.json";

// Читаем существующие данные, если есть
$robots = [];
if (file_exists($file)) {
    $content = file_get_contents($file);
    $robots = json_decode($content, true) ?? [];
}

// Добавляем новый робот
$robots[] = $data;

// Сохраняем обратно в файл
file_put_contents($file, json_encode($robots, JSON_PRETTY_PRINT));

echo json_encode(["status" => "success", "message" => "Robot saved successfully!"]);
?>