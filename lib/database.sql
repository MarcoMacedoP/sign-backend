CREATE DATABASE IF NOT EXISTS SIGN;
USE SIGN;
CREATE TABLE IF NOT EXISTS providers(
    provider_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(35) NOT NULL,
    lastname  VARCHAR(35) NOT NULL,
    email VARCHAR(100),
    phone INT UNSIGNED,
    image_url VARCHAR(255),
    about TEXT,
    active BOOL DEFAULT TRUE NOT NULL,
    user_id INTEGER UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS services(
    service_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (50) NOT NULL,
    description TEXT,
    cost FLOAT NOT NULL,
    cost_per_hour BOOL DEFAULT FALSE,
    active BOOL NOT NULL DEFAULT TRUE,
    provider_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS products(
    product_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (50) NOT NULL,
    description TEXT,
    cost FLOAT NOT NULL,
    provider_id INTEGER NOT NULL,
    active BOOL NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS users(
    user_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR (255) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic_url VARCHAR(255),
    biography TEXT,
    job_title VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS clients(
    client_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS reminders(
    reminder_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    `description` VARCHAR(255),
    date TIMESTAMP NOT NULL, 
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS reminders_clients(
    reminder_client_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id INTEGER NOT NULL,
    reminder_id INTEGER NOT NULL
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS reminders_clients(
    reminder_client_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id INTEGER NOT NULL,
    reminder_id INTEGER NOT NULL
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;

CREATE TABLE IF NOT EXISTS reminders_providers(
    reminder_provider_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    provider_id INTEGER NOT NULL,
    reminder_id INTEGER NOT NULL
)CHARACTER SET utf8 COLLATE utf8_spanish_ci;


INSERT INTO reminders (title, description, date) VALUES ("TITULO", "DESCRIPCION", '1970-01-02');