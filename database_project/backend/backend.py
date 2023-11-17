
#import MySQLdb
import json
import math
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pymysql
pymysql.install_as_MySQLdb()

"""connection = pymysql.connect(database='cs6400_02_team037',
                             host="127.0.0.1", user="mangerhofer3", password="test", port=3306)"""
connection = pymysql.connect(database='cs6400_02_team037',
                             host="127.0.0.1", user="root", password="root", port=3306)
connection.autocommit = True
curs = connection.cursor()

app = Flask(__name__)
CORS(app)


@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers['X-Content-Type-Options'] = '*'
        return res



@app.route('/api/populate_household_dropdowns', methods=['GET'])
def populate_household_dropdowns():
    # Mani mentioned we need generation_type for dropdowns... that accurate?

    curs.execute("""SELECT DISTINCT(household_type)
                    FROM HOUSEHOLD_TYPE
                    """)
    household_type = curs.fetchall()

    curs.execute("""SELECT DISTINCT(utility_type)
                    FROM UTILITY_TYPE
                    """)
    utility_type = curs.fetchall()

    return jsonify({"household_type": household_type, "utility": utility_type})


# Enter Household Data
@app.route('/api/householdInfo', methods=['POST'])
def enter_house_info():
    household_info = json.loads(request.data.decode('UTF-8'))
    print(household_info)

    email = household_info['email']
    square_footage = household_info['square_footage']
    thermostat_setting_heating = household_info['thermostat_setting_heating']
    thermostat_setting_cooling = household_info['thermostat_setting_cooling']
    postal_code = household_info['fk_postal_code']
    household_type = household_info['household_type']
    public_utilities = household_info['public_utilities']

    # Email Data Validation:
    curs.execute(f"""SELECT email
                    FROM HOUSEHOLD
                    WHERE HOUSEHOLD.email = '{email}';
                    """)
    email_vd = curs.fetchall()

    if(len(email_vd) > 0):  # if(email != None):
        print('EMAIL EXISTS')
        return jsonify({"message": 'Information for this email has already been recorded. Please use a different email address.'}), 612

    # Postal Code Validation
    curs.execute(f"""SELECT Postal_Code
                    FROM POSTAL_CODE
                    WHERE POSTAL_CODE.Postal_Code = '{postal_code}'
                    """)
    postal_code_vd = curs.fetchall()
    if(len(postal_code_vd) == 0):  # if(postal_code != None):
        print('POSTAL CODE NO EXIST')
        return jsonify({"message": 'Please enter a valid postal code.'}), 400

    try:
        f_square_footage = float(square_footage)
        if(not float(f_square_footage).is_integer()):
            print('INVALID SQFT')
            return jsonify({"message": 'Please enter square footage as a whole number.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter square footage as a whole number.'}), 400

    curs.execute(f"""INSERT INTO HOUSEHOLD
                     VALUES ('{email}', '{square_footage}', '{household_type}', '{thermostat_setting_heating}', '{thermostat_setting_cooling}', '{postal_code}')""")

    for utility in public_utilities:
        curs.execute(
            f"INSERT INTO HOUSEHOLD_PUBLIC_UTILITIES VALUES ('{email}', '{utility}')")

    connection.commit()
    response = jsonify({"RESULT": 'success'})
    return response


################################################################################
# Add Appliance Details
@app.route('/api/add_appliance_populate_dropdowns', methods=['GET'])
def add_appliance_dropdowns():

    #data = json.loads(request.data.decode('UTF-8'))
    curs.execute(f"""SELECT manufacturer_type
                     FROM MANUFACTURER_TYPE
                     """)
    manufacturer = curs.fetchall()
    curs.execute(f"""SELECT DISTINCT(appliance_type)
                    FROM APPLIANCE_TYPE
                     """)
    appliance_type = curs.fetchall()

    response = jsonify({"manufacturerList": manufacturer,
                       "appliance_type": appliance_type})
    return response


@app.route('/api/appliance', methods=['POST'])
def add_appliance():

    # Get data
    data = json.loads(request.data.decode('UTF-8'))
    print(data)

    email = data['fk_email']
    order_no = 1
    appliance_type = data['appliance_type']
    btu_rating = data['btu_rating']
    model = data['model']
    manufacturer_name = data['manufacturer']

    try:
        f_btu_rating = float(btu_rating)
        if(not float(f_btu_rating).is_integer()):
            print('INVALID BTU RATING')
            return jsonify({"message": 'Please enter BTU rating as a whole number.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter BTU rating as a whole number.'}), 400

    curs.execute(f"""SELECT MAX(order_no)
                     FROM APPLIANCE
                     WHERE fk_email = '{email}';
                     """)
    max_order_no = curs.fetchone()

    if (max_order_no[0] != None):
        order_no = max_order_no[0] + 1

    # Insert appliance
    curs.execute(f"""INSERT INTO APPLIANCE (fk_email, order_no, appliance_type, btu_rating, model, manufacturer)
                        VALUES ('{email}', '{order_no}', '{appliance_type}', '{btu_rating}', '{model}', '{manufacturer_name}');
                     """)
    connection.commit()

    appliance_id = curs.lastrowid

    return jsonify({"appliance_id": appliance_id})


@app.route('/api/waterHeater', methods=['POST'])
def add_appliance_water_heater():

    # Get data
    data = json.loads(request.data.decode('UTF-8'))
    print(data)
    appliance_id = data['appliance_id']
    tank_size = data['tank_size']
    temperature = data['temperature']
    wh_energy_source = data['wh_energy_source']

    curs.execute(f"""INSERT INTO APPLIANCE_WATER_HEATER (tank_size, temperature, wh_energy_source, appliance_id)
                      VALUES ('{tank_size}', '{temperature}', '{wh_energy_source}', '{appliance_id}');
                     """)
    connection.commit()
    return jsonify({"RESULT": 'success'})


@app.route('/api/airConditioner', methods=['POST'])
def add_appliance_air_conditioner():

    # Get data
    data = json.loads(request.data.decode('UTF-8'))

    appliance_id = data['appliance_id']
    rpm = data['rpm']
    eer = data['eer']

    try:
        f_rpm = float(rpm)
        if(not float(f_rpm).is_integer()):
            print('INVALID RPM')
            return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400

    try:
        f_eer = float(rpm)
        print(f_eer, math.floor(f_eer * 10) / 10)
        if not f_eer == (math.floor(f_eer * 10) / 10):
            print('INVALID EER')
            return jsonify({"message": 'Please enter Energy Efficiency Ratio (EER) as a decimal to the tenth decial point.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter Energy Efficiency Ratio (EER) as a decimal to the tenth decial point.'}), 400

    curs.execute(f"""INSERT INTO APPLIANCE_AIR_CONDITIONER (rpm, eer, appliance_id)
                        VALUES ('{rpm}', '{eer}', '{appliance_id}');
                     """)
    connection.commit()
    return jsonify({"RESULT": 'success'})


@app.route('/api/heater', methods=['POST'])
def add_appliance_heater():

    # Get data
    data = json.loads(request.data.decode('UTF-8'))

    appliance_id = data['appliance_id']
    rpm = data['rpm']
    h_energy_source = data['h_energy_source']

    try:
        f_rpm = float(rpm)
        if(not float(f_rpm).is_integer()):
            print('INVALID RPM')
            return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400

    curs.execute(f"""INSERT INTO APPLIANCE_HEATER (rpm, h_energy_source, appliance_id)
                        VALUES ( '{rpm}', '{h_energy_source}', '{appliance_id}' );
                     """)
    connection.commit()
    return jsonify({"RESULT": 'success'})


@app.route('/api/heatPump', methods=['POST'])
def add_appliance_heat_pump():

    # Get data
    data = json.loads(request.data.decode('UTF-8'))

    appliance_id = data['appliance_id']
    rpm = data['rpm']
    seer = data['seer']
    hspf = data['hspf']

    try:
        f_rpm = float(rpm)
        if(not float(f_rpm).is_integer()):
            print('INVALID RPM')
            return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400
    except ValueError:
        return jsonify({"message": 'Please enter fan rotations per minute (RPM) as a whole number.'}), 400

    curs.execute(f"""INSERT INTO  APPLIANCE_HEAT_PUMP (rpm, seer, hspf, appliance_id)
                        VALUES ( '{rpm}', '{seer}', '{hspf}', '{appliance_id}' );

                     """)
    connection.commit()
    return jsonify({"RESULT": 'success'})
################################################################################


# View Delete Appliance
@app.route('/api/appliances/<string:email>', methods=['GET'])
def view_appliance(email):
    connection.ping()
    curs.execute(f"""SELECT id, order_no, appliance_type, manufacturer, model
                     FROM APPLIANCE as A
                     WHERE A.fk_email = '{email}'
                     ORDER BY order_no ASC;
                     """)
    query = curs.fetchall()
    response = jsonify({"appliances": query})
    return response


@app.route('/api/appliance/<app_id>', methods=['DELETE'])
def delete_appliance(app_id):
    # TODO: update FK constraint on application ID to cascade on delete or update
    print(app_id)
    curs.execute(f"""DELETE
                     FROM APPLIANCE
                     WHERE ID = '{app_id}';
                     """)
    query = curs.fetchall()
    response = jsonify({"RESULT": query})
    return response
################################################################################


# Add Power Generation Details
@app.route('/api/generation_type', methods=['GET'])
def generation_type():

    curs.execute(f"""SELECT DISTINCT(generation_type)
                     FROM GENERATION_TYPE
                    """)
    query = curs.fetchall()
    response = jsonify({"RESULT": query})
    return response


@app.route('/api/power_generation', methods=['POST'])
def add_generation_details():

    data = json.loads(request.data.decode('UTF-8'))
    email = data['fk_email']
    generation_type = data['generation_type']
    avg_month_kwh = data['avg_month_kwh']
    battery_storage_capacity = data['battery_storage_capacity']
    order_number = 1

    curs.execute(f"""SELECT MAX(order_number)
                     FROM POWER_GENERATION
                     WHERE fk_email = '{email}';
                     """)
    max_order_number = curs.fetchone()

    if (max_order_number[0] != None):
        order_number = max_order_number[0] + 1

    curs.execute(f"""INSERT INTO POWER_GENERATION
                    (fk_email, order_number, generation_type, avg_month_kwh, battery_storage_capacity)
                    VALUES ('{email}', '{order_number}', '{generation_type}', '{avg_month_kwh}', '{battery_storage_capacity}');
                    """)

    connection.commit()

    #query = curs.fetchall()
    response = jsonify({"RESULT": 'success'})
    return response
################################################################################


# View/delete Power Generation List
@app.route('/api/power_generation/<email>', methods=['GET'])
def view_power_gen(email):
    curs.execute(f"""SELECT order_number, generation_type, avg_month_kwh, battery_storage_capacity
                     FROM POWER_GENERATION
                     WHERE fk_email = '{email}';
                    """)
    query = curs.fetchall()
    response = jsonify({"powerGenerations": query})
    return response


@app.route('/api/off_the_grid/<email>', methods=['GET'])
def finish_power_gen(email):
    curs.execute(f"""SELECT utility
                     FROM HOUSEHOLD_PUBLIC_UTILITIES
                     WHERE fk_email = '{email}';
                    """)

    query = curs.fetchone()

    response = jsonify({"isOffTheGrid": query == None})
    return response


@app.route('/api/power_generation/<email>/<order_num>', methods=['DELETE'])
def delete_power_gen(email, order_num):
    curs.execute(f"""DELETE
                     FROM POWER_GENERATION
                     WHERE order_number = '{order_num}' AND fk_email = '{email}';
                    """)

    connection.commit()
    #query = curs.fetchall()

    response = jsonify({"RESULT": 'success'})
    return response

################################################################################


# Top 25 popular manufacturers Report
@app.route('/api/top_25_pop_manufacturers', methods=['GET'])
def top_25_manufacturers():
    curs.execute("""SELECT Manufacturer, COUNT(ID) AS cnt
                    FROM APPLIANCE
                    GROUP BY Manufacturer
                    ORDER BY cnt DESC
                    LIMIT 25;""")
    query = curs.fetchall()
    response = jsonify(query)
    return response


@app.route('/api/top_25_pop_manufacturers_drilldown/<manufacturer_name>', methods=['GET'])
def top_25_manufacturers_drilldown(manufacturer_name):
    #data = json.loads(request.data.decode('UTF-8'))
    #manufacturer_name = data['manufacturer_name']
    print("DRILL DOWN")
    print(manufacturer_name)
    # this should return the appliance and the count for the manufacturer
    curs.execute(f"""SELECT D.appliance_type, COALESCE(C.qty, 0) AS qty
                     FROM APPLIANCE_TYPE AS D
                     LEFT JOIN (
                        SELECT DISTINCT A.appliance_type AS app_type, B.qty AS qty
                        FROM APPLIANCE AS A
                        INNER JOIN (
                            SELECT appliance_type, COUNT(appliance_type) AS qty
                            FROM APPLIANCE
                            GROUP BY appliance_type, manufacturer
                            HAVING manufacturer = '{manufacturer_name}'
                        ) AS B ON A.appliance_type = B.appliance_type
                        WHERE A.manufacturer = '{manufacturer_name}'
                     ) AS C ON D.appliance_type = C.app_type;""")
    query = curs.fetchall()
    response = jsonify(query)
    return response
################################################################################


# Manufacturer/Model Search Report
@app.route('/api/user_search/<searchQuery>', methods=['GET'])
def user_search(searchQuery):
    curs.execute(f"""SELECT DISTINCT manufacturer, model
                     FROM APPLIANCE
                     WHERE manufacturer LIKE '%'{searchQuery}'%' OR model LIKE '%'{searchQuery}'%'
                     ORDER BY manufacturer, model;
                     """)

    query = curs.fetchall()
    response = jsonify(query)
    return response
################################################################################
# Manufacturer/Model Search Report


@app.route('/api/user_search/all', methods=['GET'])
def user_search_all():
    curs.execute("""SELECT DISTINCT manufacturer, model
                     FROM APPLIANCE
                     ORDER BY manufacturer, model;""")
    query = curs.fetchall()
    response = jsonify(query)
    return response

################################################################################

# TODO
# Heating/Cooling Method Details Report


@app.route('/api/heating_cooling_report', methods=['GET'])
def heating_cooling_report():
    curs.execute(f"""SELECT HT.household_type,
    COALESCE(ac_table.cnt, 0) AS ac_cnt,
    COALESCE(ac_table.avg_btu, 0) AS avg_ac_btu,
    COALESCE(ac_table.avg_rpm, 0) AS avg_ac_rpm,
    COALESCE(ac_table.avg_eer, 0) AS avg_ac_eer,
    COALESCE(htr_table.cnt, 0) AS htr_cnt,
    COALESCE(htr_table.avg_btu, 0) AS avg_htr_btu,
    COALESCE(htr_table.avg_rpm, 0) AS avg_htr_rpm,
    COALESCE(htr_table.common_enrgy_src, '') AS htr_common_enrgy_src,
    COALESCE(hp_table.cnt, 0) AS hp_cnt,
    COALESCE(hp_table.avg_btu, 0) AS avg_hp_btu,
    COALESCE(hp_table.avg_rpm, 0) AS avg_hp_rpm,
    COALESCE(hp_table.avg_seer, 0) AS avg_hp_seer,
    COALESCE(hp_table.avg_hspf, 0) AS avg_hp_hspf
FROM HOUSEHOLD_TYPE AS HT
LEFT JOIN (  -- get all AC parameters
    SELECT household_type,
        COUNT(*) AS cnt,
        ROUND(AVG(btu_rating), 0) AS avg_btu,
        ROUND(AVG(rpm), 1) AS avg_rpm,
        ROUND(AVG(eer), 1) AS avg_eer
    FROM HOUSEHOLD AS h1
    INNER JOIN APPLIANCE AS a1 ON h1.email = a1.fk_email
    INNER JOIN APPLIANCE_AIR_CONDITIONER ON a1.ID = APPLIANCE_AIR_CONDITIONER.appliance_id
    WHERE appliance_type = 'air_conditioner'
    GROUP BY household_type
) AS ac_table ON ac_table.household_type = HT.household_type
LEFT JOIN ( -- get all heater parameters
    SELECT household_type,
        COUNT(*) AS cnt,
        ROUND(AVG(btu_rating), 0) AS avg_btu,
        ROUND(AVG(rpm), 1) AS avg_rpm,
        (SELECT h_energy_source
         FROM APPLIANCE_HEATER
		 GROUP BY h_energy_source
         ORDER BY COUNT(*) DESC
         LIMIT 1) AS common_enrgy_src
    FROM HOUSEHOLD AS h2
    INNER JOIN APPLIANCE AS a2 ON h2.email = a2.fk_email
    INNER JOIN APPLIANCE_HEATER ON a2.ID = APPLIANCE_HEATER.appliance_id
    WHERE appliance_type = 'heater'
    GROUP BY household_type ) AS htr_table ON htr_table.household_type = HT.household_type
LEFT JOIN ( -- get all heat pumps parameters
    SELECT household_type,
        COUNT(*) AS cnt,
        ROUND(AVG(btu_rating), 0) AS avg_btu,
        ROUND(AVG(rpm), 1) AS avg_rpm,
        ROUND(AVG(seer), 1) AS avg_seer,
        ROUND(AVG(hspf), 1) AS avg_hspf
    FROM HOUSEHOLD AS h3
    INNER JOIN APPLIANCE AS a3 ON h3.email = a3.fk_email
    INNER JOIN APPLIANCE_HEAT_PUMP ON a3.ID = APPLIANCE_HEAT_PUMP.appliance_id
    WHERE appliance_type = 'heat_pump'
    GROUP BY household_type ) AS hp_table ON hp_table.household_type = HT.household_type; """)

    query = curs.fetchall()
    response = jsonify(query)
    return response
################################################################################


# Water Heater Statistics by State Report


@app.route('/api/water_heater_stats', methods=['GET'])
def water_heater_stats():

    #data = json.loads(request.data.decode('UTF-8'))
    #search = data['search']

    curs.execute(f""" SELECT
                    p.state,
                    ROUND(AVG(w.tank_size), 0) AS AverageTankSize,
                    ROUND(AVG(a.btu_rating), 0) AS AverageBTUs,
                    ROUND(AVG(w.temperature), 1) AS AverageTemperatureSetting,
                    COUNT(w.temperature) AS TemperatureSettingCount,
                    COUNT(w.id) - COUNT(w.temperature) AS NoTemperatureSettingCount
                    FROM
                    postal_code p
                    JOIN HOUSEHOLD AS h ON h.fk_postal_code = p.postal_code
                    JOIN APPLIANCE AS a ON a.fk_email = h.email
                    JOIN APPLIANCE_WATER_HEATER AS w ON w.appliance_id = a.ID
                    GROUP BY
                    p.state
                    ORDER BY
                    p.state ASC;

                     """)

    query = curs.fetchall()
    print(query)
    response = jsonify(query)
    return response


@app.route('/api/state_drilldown/<search>', methods=['GET'])
def state_drilldown(search):

    # data = json.loads(request.data.decode('UTF-8'))

    curs.execute(f"""SELECT
                 state,
                    wh_energy_source,
                    ROUND(MIN(tank_size), 0) AS min_wh_tank_size,
                    ROUND(AVG(tank_size), 0) AS avg_wh_tank_size,
                    ROUND(MAX(tank_size), 0) AS max_wh_tank_size,
                    MIN(temperature) as min_tempeature,
                    ROUND(AVG(temperature), 1) AS avg_wh_temp_setting,
                    MAX(temperature) as max_temp_setting
                    FROM household
                    JOIN appliance ON household.email = appliance.fk_email
                    JOIN appliance_water_heater ON appliance.id = appliance_water_heater.appliance_id
                    JOIN postal_code ON household.fk_postal_code = postal_code.postal_code
                    where state = '{search}'
                    GROUP BY state
                    ORDER BY wh_energy_source asc;
                     """)

    query = curs.fetchall()
    response = jsonify(query)
    return response


################################################################################


# View off-the-grid Household dashboard
@app.route('/api/off_the_grid_dashboard', methods=['GET'])
def off_grid_display():
    # Top Off Grid State
    curs.execute(f"""SELECT p.state, COUNT(h.email) as count_of_off_grid_households
                    FROM HOUSEHOLD AS h
                    JOIN POSTAL_CODE AS p ON h.fk_postal_code = p.postal_code
                    WHERE (SELECT COUNT(utility)
                    FROM HOUSEHOLD_PUBLIC_UTILITIES as pu2
                    JOIN HOUSEHOLD as h2 on pu2.fk_email = h2.email
                    WHERE h2.email = h.email) = 0
                    GROUP BY p.state
                    ORDER BY count_of_off_grid_households DESC
                    LIMIT 1;""")
    state_count = curs.fetchall()

    # Average Battery Storage Capacity
    curs.execute(f"""SELECT ROUND(AVG(pg.battery_storage_capacity)) as avg_gridbatt
                     FROM HOUSEHOLD AS h
                     JOIN POWER_GENERATION AS pg ON h.email = pg.fk_email
                     WHERE (SELECT COUNT(utility)
                    	FROM HOUSEHOLD_PUBLIC_UTILITIES as pu2
                    	JOIN HOUSEHOLD as h2 on pu2.fk_email = h2.email
                    	WHERE h2.email = h.email) = 0;""")
    avg_batt = curs.fetchall()
    #Power Generation %
    curs.execute(f"""SELECT gt.generation_type,
                     ROUND(((
	             -- Number of of grid households with Solar and wind turbines
	                 SELECT COUNT(DISTINCT pg2.fk_email)
                         FROM POWER_GENERATION as pg2
	                 LEFT JOIN HOUSEHOLD_PUBLIC_UTILITIES hpu ON hpu.fk_email = pg2.fk_email
	                 WHERE hpu.fk_email IS NULL AND pg.generation_type = pg2.generation_type
                     ) - (
                     -- Number of of grid households with Mixed (both solar and wind turbines)
	                 SELECT COUNT(*)
	                 FROM(
		             SELECT pg2.fk_email
		             FROM POWER_GENERATION as pg2
		             LEFT JOIN HOUSEHOLD_PUBLIC_UTILITIES hpu ON hpu.fk_email = pg2.fk_email
		             WHERE hpu.fk_email IS NULL
		             GROUP BY pg2.fk_email
		             HAVING count(DISTINCT pg2.generation_type) > 1) as mx
	             )) / (
	             -- total number of off grid generated values
	                 SELECT COUNT(DISTINCT pg2.fk_email)
	                 FROM POWER_GENERATION as pg2
	                 LEFT JOIN HOUSEHOLD_PUBLIC_UTILITIES hpu ON hpu.fk_email = pg2.fk_email
	                 WHERE hpu.fk_email IS NULL
                     ) * 100, 1) as 'percentage'
                     FROM HOUSEHOLD as h
                     JOIN POWER_GENERATION as pg on h.email = pg.fk_email
                     RIGHT JOIN GENERATION_TYPE as gt on pg.generation_type = gt.generation_type
                     GROUP BY gt.generation_type;""")
    power_perc = curs.fetchall()

    #Household Type %
    curs.execute(f"""SELECT ht.household_type,
                     ROUND((
                         SELECT COUNT(h2.household_type)
	                 FROM HOUSEHOLD as h2
	                 LEFT JOIN HOUSEHOLD_PUBLIC_UTILITIES hpu ON hpu.fk_email = h2.email
	                 WHERE hpu.fk_email IS NULL  AND ht.household_type = h2.household_type
                     ) / (
	                 SELECT COUNT(h2.household_type)
	                 FROM HOUSEHOLD as h2
	                 LEFT JOIN HOUSEHOLD_PUBLIC_UTILITIES hpu ON hpu.fk_email = h2.email
	                 WHERE hpu.fk_email IS NULL
                     ) * 100, 1) as 'percentage'
                     FROM HOUSEHOLD AS h
                     RIGHT JOIN HOUSEHOLD_TYPE AS ht ON ht.household_type = h.household_type
                     GROUP BY household_type;""")
    household_perc = curs.fetchall()

    #average water tank size
    curs.execute(f"""SELECT
                     ROUND(AVG((SELECT ROUND(AVG(tank_size), 1)
                         FROM HOUSEHOLD AS h1
                         JOIN APPLIANCE AS a ON a.fk_email = h1.email
                         JOIN APPLIANCE_WATER_HEATER AS w ON w.appliance_id = a.id
                         WHERE (SELECT COUNT(utility)
                	 FROM HOUSEHOLD_PUBLIC_UTILITIES as pu
        		 JOIN HOUSEHOLD as h2 on pu.fk_email = h2.email
        		 WHERE h2.email = h.email) = 0 and h1.email = h.email
                     )), 1) as 'Ave Tank Size Off The Grid',
                     ROUND(AVG((SELECT tank_size
                         FROM HOUSEHOLD AS h2
                         JOIN APPLIANCE AS a2 ON a2.fk_email = h2.email
                         JOIN APPLIANCE_WATER_HEATER AS w2 ON w2.appliance_id = a2.id
                         WHERE (SELECT COUNT(utility)
        		 FROM HOUSEHOLD_PUBLIC_UTILITIES as pu
           		 JOIN HOUSEHOLD as h2 on pu.fk_email = h2.email
        		 WHERE h2.email = h.email) > 0 and h2.email = h.email
                     )), 1) as 'Ave Tank Size On The Grid'
                     FROM HOUSEHOLD h""")
    watertank_avg = curs.fetchall()

    #BTU data
    curs.execute(f"""SELECT at.appliance_type,
                         IFNULL(ROUND(MIN(btu_rating), 0), 0) as min_btu_rating,
                         IFNULL(ROUND(AVG(btu_rating), 0), 0) as avg_btu_rating,
                         IFNULL(ROUND(MAX(btu_rating), 0), 0) as max_btu_rating
                     FROM APPLIANCE AS a
                     RIGHT JOIN APPLIANCE_TYPE AS at ON at.appliance_type = a.appliance_type
                     WHERE (SELECT COUNT(utility)
                         FROM HOUSEHOLD_PUBLIC_UTILITIES as pu
                         JOIN HOUSEHOLD as h2 on pu.fk_email = h2.email
                 	 WHERE h2.email = a.fk_email) = 0
                     GROUP BY at.appliance_type;""")
    btu_data = curs.fetchall()


    response = jsonify(state_count, avg_batt, power_perc, household_perc, watertank_avg, btu_data)

    print(response)
    return response

################################################################################

# View Household averages by radius
def default_json(t):
    return f'{t}'

import sys

@app.route('/api/household_averages_by_radius/<postal_code>/<radius>', methods=['GET'])
def household_averages_by_radius(postal_code, radius):

    # Postal Code Validation
    curs.execute(f"""SELECT postal_code, latitude, longitude
                    FROM POSTAL_CODE
                    WHERE POSTAL_CODE.postal_code = '{postal_code}'
                    """)
    postal_code_vd = curs.fetchone()

    if(postal_code_vd == None):  # if(postal_code != None):
        print('POSTAL CODE NO EXIST')
        return 'Invalid Postal Code', 613

    latitude = postal_code_vd[1]
    longitude = postal_code_vd[2]

    # TODO: 'PUBLIC UTILITIS', 'Off-The-Grid'
    curs.execute(f"""SELECT count(H.email) as 'Household Count',
        count(case H.household_type when 'house' then 1 else null end) as 'House Count',
        count(case H.household_type when 'apartment' then 1 else null end) as 'Apartment Count',
        count(case H.household_type when 'townhome' then 1 else null end) as 'Townhome Count',
        count(case H.household_type when 'condominium' then 1 else null end) as 'Condominium Count',
        count(case H.household_type when 'modular home' then 1 else null end) as 'Modular Home Count',
        count(case H.household_type when 'tiny house' then 1 else null end) as 'Tiny Home Count',
        ROUND(avg(H.square_footage), 0) as 'Ave SqFt',
        ROUND(avg(H.thermostat_setting_heating), 1) as 'Ave Heating Temp',
        ROUND(avg(H.thermostat_setting_cooling), 1) as 'Ave Cooling Temp',
        (select GROUP_CONCAT(DISTINCT HP.utility) FROM HOUSEHOLD_PUBLIC_UTILITIES as HP
            JOIN HOUSEHOLD as H2 ON H2.email = HP.fk_email
            JOIN POSTAL_CODE as P2 on P2.postal_code = H2.fk_postal_code
            WHERE acos(sin(radians({latitude})) * sin(radians(P2.latitude)) + cos(radians({latitude})) * cos(radians(P2.latitude)) * cos(radians(P2.longitude) - radians({longitude}))) * 3958.75 <= {radius}),
        count(case when (SELECT count(HP.utility)
        	FROM HOUSEHOLD_PUBLIC_UTILITIES as HP
        	JOIN HOUSEHOLD as H2 ON H2.email = HP.fk_email
        	JOIN POSTAL_CODE as P2 ON P2.postal_code = H2.fk_postal_code
        	WHERE P2.postal_code = P.postal_code
        ) = 0 then 1 else null end) as 'Off-The-Grid',
        (select count(*) from (select PG.generation_type
            FROM POWER_GENERATION as PG
            WHERE H.email = PG.fk_email AND PG.generation_type = 'solar'
        ) random_table_name_2 ) as 'Solar Count',
        (select count(*) from (select PG2.generation_type
            FROM POWER_GENERATION as PG2
            WHERE H.email = PG2.fk_email AND PG2.generation_type = 'wind-turbine'
        ) random_table_name_3 ) as 'Wind Turbine Count',
        (select ROUND(avg( PG2.avg_month_kwh),0) 
            FROM POWER_GENERATION as PG2
            WHERE H.email = PG2.fk_email
            GROUP BY H.email) as 'Ave Monthly Power Generation',
        (select count(*) from (select PG2.avg_month_kwh
            FROM POWER_GENERATION as PG2
            WHERE H.email = PG2.fk_email AND PG2.avg_month_kwh > 0
        ) random_table_name ) as 'Households with Battery Storage'

        FROM POSTAL_CODE as P
        JOIN HOUSEHOLD as H ON P.postal_code = H.fk_postal_code
        WHERE acos(sin(radians({latitude})) * sin(radians(P.latitude)) + cos(radians({latitude})) * cos(radians(P.latitude)) * cos(radians(P.longitude) - radians({longitude}))) * 3958.75 <= {radius}
        GROUP BY H.email
     """)
    household_averages_by_radius = curs.fetchall()





    print(household_averages_by_radius, file=sys.stderr)
    #response = jsonify(household_averages_by_radius, default=default_json)
    """print(household_averages_by_radius[0][7], file=sys.stderr)
    print(household_averages_by_radius[0][8], file=sys.stderr)
    print(household_averages_by_radius[0][9], file=sys.stderr)
    print(household_averages_by_radius[0][14], file=sys.stderr)
    household_averages_by_radius[0][7] = str(household_averages_by_radius[0][7])
    household_averages_by_radius[0][8] = str(household_averages_by_radius[0][8])
    household_averages_by_radius[0][9] = str(household_averages_by_radius[0][9])
    household_averages_by_radius[0][14] = str(household_averages_by_radius[0][14])
    print(household_averages_by_radius, file=sys.stderr)
    household_averages_by_radius[0] = ()"""


    d = household_averages_by_radius
    data = (d[0][0], d[0][1], d[0][2], d[0][3], d[0][4], d[0][5], d[0][6], str(d[0][7]), str(d[0][8]), str(d[0][9]), d[0][10], d[0][11], d[0][12], d[0][13], str(d[0][14]), d[0][15] )
    return jsonify({"averages":data})
    #print(response)
    #response = jsonify({"averages": household_averages_by_radius})
    #response = jsonify({"averages": "hello"})
    #return response
    #return jsonify({"averages": "hello"})


# Front end would call something like:
# localhost:8888/api/login
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)


"""(select GROUP_CONCAT(DISTINCT HP.utility) FROM HOUSEHOLD_PUBLIC_UTILITIES as HP
            JOIN HOUSEHOLD as H2 ON H2.email = HP.fk_email
            JOIN POSTAL_CODE as P2 on P2.postal_code = H2.fk_postal_code
            WHERE acos(sin(radians({latitude})) * sin(radians(P2.latitude)) + cos(radians({latitude})) * cos(radians(P2.latitude)) * cos(radians(P2.longitude) - radians({longitude}))) * 3958.75 <= {radius}),
        """