<?php
include_once("constants.php");

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$query = "SELECT name, imageid ";
$query .= "FROM metadata ";
$query .= "ORDER BY created DESC;";

$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

$result = $mysqli->query($query);
$images = [];
while($row = $result->fetch_assoc()) {
    $images[] = $row;
}

echo json_encode($images);
