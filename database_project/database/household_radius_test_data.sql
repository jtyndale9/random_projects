-- User 1
INSERT INTO HOUSEHOLD
VALUES ('test1@gmail.com', 1200, 'house', 72, 68, '48044');

-- electric, gas, steam and/or liquid fuel
INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test1@gmail.com', 'electric');

INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test1@gmail.com', 'gas');

INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test1@gmail.com', 'steam');

INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test1@gmail.com', 'liquid_fuel');

-- solar or wind-turbine
INSERT INTO POWER_GENERATION (fk_email, generation_type, avg_month_kwh, battery_storage_capacity)
VALUES ('test1@gmail.com', 'solar', 200, 1000);


-- User 2
INSERT INTO HOUSEHOLD
VALUES ('test2@gmail.com', 800, 'condominium', 76, 68, '48315');

-- electric, gas, steam and/or liquid fuel
INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test2@gmail.com', 'electric');

INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test2@gmail.com', 'gas');

-- User 3
INSERT INTO HOUSEHOLD
VALUES ('test3@gmail.com', 200, 'tiny house', 72, 68, '48073');

-- electric, gas, steam and/or liquid fuel
INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test3@gmail.com', 'steam');

INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES
VALUES ('test3@gmail.com', 'liquid_fuel');

-- solar or wind-turbine
INSERT INTO POWER_GENERATION (fk_email, generation_type, avg_month_kwh, battery_storage_capacity)
VALUES ('test3@gmail.com', 'wind-turbine', 250, 0);

-- add appliance
INSERT INTO APPLIANCE (fk_email, order_no, appliance_type, btu_rating, model, manufacturer)
VALUES ('test1@gmail.com', 1, 'air_conditioner', 4500, 'airmax2000', 'Samslug');

INSERT INTO APPLIANCE_AIR_CONDITIONER (rpm, eer, appliance_id)
VALUES (3600, 12.34, 1);

INSERT INTO APPLIANCE (fk_email, order_no, appliance_type, btu_rating, model, manufacturer)
VALUES ('test1@gmail.com', 2, 'water_heater', 2300, 'BIGHEAT9000', 'GEEEEEE');

INSERT INTO APPLIANCE_WATER_HEATER (tank_size, temperature, wh_energy_source, appliance_id)
VALUES (122.5, 78, 'heat_pump', 2);

INSERT INTO APPLIANCE (fk_email, order_no, appliance_type, btu_rating, model, manufacturer)
VALUES ('test1@gmail.com', 3, 'heater', 5600, 'lavaland', 'Whirlpul');

INSERT INTO APPLIANCE_HEATER (rpm, h_energy_source, appliance_id)
VALUES (1200, 'volcano', 3);

INSERT INTO APPLIANCE (fk_email, order_no, appliance_type, btu_rating, model, manufacturer)
VALUES ('test1@gmail.com', 4, 'heat_pump', 800, 'pumpItUP', 'LeG');

INSERT INTO APPLIANCE_HEAT_PUMP (rpm, seer, hspf, appliance_id)
VALUES (90000, 23.5, 90.2, 4);
