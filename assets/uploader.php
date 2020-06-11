<?php

include_once("constants.php");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

ob_start();

if(!isset($_FILES["file"])) {
    echo "<p><b>Error: File not uploaded!</b></p><p>Possibly, you are trying ";
    echo "to upload a file that's bigger than the maximum upload size. Check your ";
    echo "PHP and MySQL installation.</p>";
} else {
    $file = $_FILES["file"];
    $name = $file["name"];
    $type = $file["type"];
    $tmp_name = $file["tmp_name"];
    $size = $file["size"];

    $blob = file_get_contents($tmp_name);

    $query = "INSERT INTO imagedata ";
    $query .= "VALUES (NULL, ?);";

    $mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

    $stmt = $mysqli->prepare($query);
    if ($stmt) {
        $stmt->bind_param("b", $blob);
        $stmt->send_long_data(0, $blob);
        $stmt->execute();

        $result = [];
        $result["id"] = $mysqli->insert_id;

        $query = "INSERT INTO metadata ";
        $query .= "VALUES (?, DEFAULT, ?, ?, ?);";

        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("ssii", $name, $type, $size, $result["id"]);
        $stmt->execute();
    }
}

$error_out = ob_get_contents();
ob_end_clean();

if (!empty($error_out)) {
    $result["error"] = $error_out;
}

echo json_encode($result);

?>