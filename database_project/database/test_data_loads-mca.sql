-- Load Postal Codes
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/postal_codes.csv'
INTO TABLE POSTAL_CODE 
CHARACTER SET utf8
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Load Manufacturer Types
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/manufacturer_types.csv'
INTO TABLE MANUFACTURER_TYPE 
IGNORE 1 ROWS;

-- Load Households
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/HOUSEHOLD_202307121600.csv'
INTO TABLE HOUSEHOLD  
CHARACTER SET utf8
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
IGNORE 1 ROWS;

-- Load Household Public Utilties
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/HOUSEHOLD_PUBLIC_UTILITIES_202307121600.csv'
INTO TABLE HOUSEHOLD_PUBLIC_UTILITIES  
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Appliances
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/APPLIANCE_202307121458.csv'
INTO TABLE APPLIANCE
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Air Conditioners
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/APPLIANCE_AIR_CONDITIONER_202307121532.csv'
INTO TABLE APPLIANCE_AIR_CONDITIONER
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Heaters
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/APPLIANCE_HEATER_202307121545.csv'
INTO TABLE APPLIANCE_HEATER
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Heat Pumps
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/APPLIANCE_HEAT_PUMP_202307121556.csv'
INTO TABLE APPLIANCE_HEAT_PUMP
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Water Heaters
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/APPLIANCE_WATER_HEATER_202307122105.csv'
INTO TABLE APPLIANCE_WATER_HEATER
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

-- Load Power Generators
LOAD DATA INFILE '/home/mani/School/CS6400/Group_Project/cs6400-2023-02-Team37/Phase_3/Database/Test_Datasets/POWER_GENERATION_202307112151.csv'
INTO TABLE POWER_GENERATION
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;
