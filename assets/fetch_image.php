<?php
include_once("constants.php");

$query = "SELECT * ";
$query .= "FROM metadata ";
$query .= "JOIN imagedata ON id = imageid ";
$query .= "WHERE id = ?;";

$mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

$stmt = $mysqli->prepare($query);
$stmt->bind_param("i", $_GET["id"]);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

header("Content-Type: " . $row["type"]);
header("Expires: Fri, 11 Oct 2023 15:34:05 GMT");
echo $row["data"];
