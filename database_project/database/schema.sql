-- CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS mangerhofer3@localhost IDENTIFIED BY 'mangerhofer3';

DROP DATABASE IF EXISTS `cs6400_02_team037`;
SET default_storage_engine=InnoDB;
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS cs6400_02_team037
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
USE cs6400_02_team037;

GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'mangerhofer3'@'localhost';
GRANT ALL PRIVILEGES ON `gatechuser`.* TO 'mangerhofer3'@'localhost';
GRANT ALL PRIVILEGES ON `cs6400_02_team037`.* TO 'mangerhofer3'@'localhost';
FLUSH PRIVILEGES;


-- Tables
CREATE TABLE POSTAL_CODE (
    postal_code varchar(255) NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude Decimal(8,6) NOT NULL,
    longitude Decimal(9,6) NOT NULL,
    PRIMARY KEY (postal_code)
);

CREATE TABLE HOUSEHOLD_TYPE (
  household_type varchar(255) NOT NULL,
  PRIMARY KEY (household_type)
);

CREATE TABLE UTILITY_TYPE (
  utility_type varchar(255) NOT NULL,
  PRIMARY KEY (utility_type)
);

CREATE TABLE HOUSEHOLD (
  email varchar(255) NOT NULL,
  square_footage int NULL,
  household_type varchar(255),
  thermostat_setting_heating int,
  thermostat_setting_cooling int,
  fk_postal_code varchar(255),
  PRIMARY KEY (email),
  FOREIGN KEY (fk_postal_code) REFERENCES POSTAL_CODE (postal_code),
  FOREIGN KEY (household_type) REFERENCES HOUSEHOLD_TYPE (household_type)
);

CREATE TABLE HOUSEHOLD_PUBLIC_UTILITIES (
  fk_email varchar(255) NOT NULL,
  utility varchar(255) NOT NULL,
  PRIMARY KEY (utility, fk_email),
  FOREIGN KEY (fk_email) REFERENCES HOUSEHOLD (email)
);

CREATE TABLE GENERATION_TYPE (
  generation_type varchar(255) NOT NULL,
  PRIMARY KEY (generation_type)
);


CREATE TABLE MANUFACTURER_TYPE (
  manufacturer_type varchar(255) NOT NULL,
  PRIMARY KEY (manufacturer_type)
);

CREATE TABLE POWER_GENERATION (
  fk_email varchar(255) NOT NULL,
  order_number int unsigned NOT NULL,
  battery_storage_capacity int,
  avg_month_kwh int NOT NULL,
  generation_type varchar(255) NOT NULL,
  PRIMARY KEY (order_number, fk_email),
  FOREIGN KEY (fk_email) REFERENCES HOUSEHOLD (email),
  FOREIGN KEY (generation_type) REFERENCES GENERATION_TYPE (generation_type)
);

CREATE TABLE APPLIANCE_TYPE (
  appliance_type varchar(255) NOT NULL,
  PRIMARY KEY (appliance_type)
);

CREATE TABLE APPLIANCE (
  ID int unsigned NOT NULL AUTO_INCREMENT,
  fk_email varchar(255) NOT NULL,
  order_no int unsigned NOT NULL,
  appliance_type varchar(255),
  btu_rating int NOT NULL,
  model TEXT,
  manufacturer TEXT,
  PRIMARY KEY (ID),
  FOREIGN KEY (fk_email) REFERENCES HOUSEHOLD (email),
  FOREIGN KEY (appliance_type) REFERENCES APPLIANCE_TYPE (appliance_type)
);

CREATE TABLE APPLIANCE_WATER_HEATER (
  ID int unsigned NOT NULL AUTO_INCREMENT,
  tank_size float(4),
  temperature int,
  wh_energy_source TEXT NOT NULL,
  appliance_id int unsigned NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (appliance_id) REFERENCES APPLIANCE (ID) ON DELETE CASCADE
);

CREATE TABLE APPLIANCE_AIR_CONDITIONER (
  ID int unsigned NOT NULL AUTO_INCREMENT,
  rpm int NOT NULL,
  eer float(32) NOT NULL,
  appliance_id int unsigned NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (appliance_id) REFERENCES APPLIANCE (ID) ON DELETE CASCADE
);

CREATE TABLE APPLIANCE_HEATER (
  ID int unsigned NOT NULL AUTO_INCREMENT,
  rpm int NOT NULL,
  h_energy_source TEXT NOT NULL,
  appliance_id int unsigned NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (appliance_id) REFERENCES APPLIANCE (ID) ON DELETE CASCADE
);

CREATE TABLE APPLIANCE_HEAT_PUMP (
  ID int unsigned NOT NULL AUTO_INCREMENT,
  rpm int NOT NULL,
  seer float(32) NOT NULL,
  hspf float(32) NOT NULL,
  appliance_id int unsigned NOT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (appliance_id) REFERENCES APPLIANCE (ID) ON DELETE CASCADE
);

-- Lookup Table Inserts
INSERT INTO GENERATION_TYPE
VALUES ('solar'),
('wind-turbine');

INSERT INTO HOUSEHOLD_TYPE
VALUES ('apartment'),
('condominium'),
('house'),
('modular home'),
('tiny house'),
('townhome');

INSERT INTO APPLIANCE_TYPE
VALUES ('air_handler'),
('water_heater');

INSERT INTO UTILITY_TYPE
VALUES ('electric'),
('gas'),
('steam'),
('liquid_fuel');
