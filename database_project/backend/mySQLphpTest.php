<?php

define("DB_HOST", "localhost");
define("DB_USERNAME", "mangerhofer3");
define("DB_PASSWORD", "test");
define("DB_DATABASE_NAME", "cs6400_02_team037");

// Create connection
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
