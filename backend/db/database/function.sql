CREATE OR REPLACE FUNCTION set_created_date() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_created_date
DESCRIPTION 	: This function use to generate trigger for created date
CREATED BY 		: Rohit Goyani
CREATED DATE	: 10-March-2021
MODIFIED BY		: Rohit Goyani
MODIFIED DATE	: 18-May-2023
CHANGE HISTORY	:
18-May-2023 - Rohit Goyani - add a condition: if date already set, then not modify it
------------------------------------------------------------------------------------*/
BEGIN
	IF NEW.created_date IS NULL THEN
  		NEW.created_date := CURRENT_TIMESTAMP;
	END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_date() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_updated_date
DESCRIPTION 	: This function use to generate trigger for updated date
UPDATED BY 		: Ayush Donga
UPDATED DATE	: 23-august-2022
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
BEGIN
  NEW.updated_date := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DO $$
DECLARE
    ct text;
    ut text;
/* ------------------------------------------------------------------------------------
SCRIPT: for set_created_date & set_updated_date
DESCRIPTION 	: Set both triggers to all the tables of current database
CREATED BY 		: Ayush Donga
CREATED DATE	: 23-august-2022
UPDATED BY      : Ayush Donga
UPDATED DATE    : 23-august-2022
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
BEGIN
    FOR ct IN 
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'created_date'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_created_date on %I',ct);

        EXECUTE format('CREATE TRIGGER set_created_date
                        BEFORE INSERT ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_created_date()',
                        ct);
    END LOOP;

    FOR ut IN 
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_date'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS set_updated_date on %I',ut);

        EXECUTE format('CREATE TRIGGER set_updated_date
                        BEFORE UPDATE ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_updated_date()',
                        ut);
    END LOOP;
    
END;
$$ LANGUAGE plpgsql;

/* create function add data subcourse and subcourse_fees insert and update functionality work good */
/* subCourse_manage */
DROP FUNCTION subcourse_manage;
CREATE OR REPLACE FUNCTION subcourse_manage(
	courseConfigurationData json,
	subcoursedata json,
	subcourseFeesdata json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
    courseConfigId integer;
	subcourseID integer;
	subcourseFeesId integer;
	mSubcourseFess json;
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: subcourse_manage
	DESCRIPTION 		: This function is used to add and update subcourse and subcourse_fees
	CREATED BY    		: Nirav Lakhani
	CREATED DATE 		: 21-September-2022
	MODIFIED BY			: Ayush Donga
	MODIFIED DATE		: 28-April-2023
	CHANGE HISTORY		:
	21-September-2022-Nirav: Initially Created
	15-october-2022-niram : Change insert and update time status remove
    14-December-2022-Anita : update subcourse_fees replace newSubCoursefees.subcourse_id repalce subcourseID
	07-March-2023-Nirav : created_by and updated_by add field in subcourses and subcourse_fees create and update Time
	28-April-2023-Ayush : insert and update time course_cofiguration post and put and subcourse create and update time assign course_config_id
	------------------------------------------------------------------------------------*/
	
BEGIN
IF courseConfigurationData::json->>'id' IS NULL OR courseConfigurationData::json->>'id' = '0' THEN		
			INSERT INTO course_configs(ptm_day,ptm_grace_after,ptm_grace_before,cv_day,cv_grace_after,cv_grace_before,es_day,es_grace_after,es_grace_before,created_by)
			SELECT ptm_day,ptm_grace_after,ptm_grace_before,cv_day,cv_grace_after,cv_grace_before,es_day,es_grace_after,es_grace_before,created_by
			FROM json_populate_record(NULL::course_configs, courseConfigurationData)
			RETURNING id INTO courseConfigId;
	ELSE 
		UPDATE course_configs
				SET ptm_day = newCourseConfig.ptm_day,
					ptm_grace_after = newCourseConfig.ptm_grace_after,
					ptm_grace_before = newCourseConfig.ptm_grace_before,
					cv_day = newCourseConfig.cv_day,
					cv_grace_after = newCourseConfig.cv_grace_after,
					cv_grace_before = newCourseConfig.cv_grace_before,
					es_day = newCourseConfig.es_day,
					es_grace_after = newCourseConfig.es_grace_after,
					es_grace_before = newCourseConfig.es_grace_before,
					updated_by = newCourseConfig.updated_by
			FROM json_populate_record(NULL::course_configs , courseConfigurationData) AS newCourseConfig
			WHERE course_configs.id = newCourseConfig.id
			RETURNING course_configs.id INTO courseConfigId;
	END IF;

	IF subcoursedata::json->>'id' IS NULL OR subcoursedata::json->>'id' = '0' THEN		
			INSERT INTO subcourses(course_id,name,code,is_job_guarantee,total,duration,installment,shining_sheet,course_config_id,created_by)
			SELECT course_id,name,code,is_job_guarantee,total,duration,installment,shining_sheet,courseConfigId,created_by
			FROM json_populate_record(NULL::subcourses, subcoursedata)
			RETURNING id INTO subcourseID;
	ELSE 
		UPDATE subcourses
				SET course_id = newSubcourse.course_id,
					name = newSubcourse.name,
					code = newSubcourse.code,
					is_job_guarantee = newSubcourse.is_job_guarantee,
					total = newSubcourse.total,
					duration = newSubcourse.duration,
					installment = newSubcourse.installment,
					shining_sheet = newSubcourse.shining_sheet,
					course_config_id = courseConfigId,
					updated_by = newSubcourse.updated_by
			FROM json_populate_record(NULL::subcourses , subcoursedata) AS newSubcourse
			WHERE subcourses.id = newSubcourse.id
			RETURNING subcourses.id INTO subcourseID;
	END IF;
	
	IF subcourseID IS NOT NULL THEN
		DELETE FROM subcourse_fees 
		WHERE subcourse_id = subcourseID 
		AND id NOT IN (
			SELECT id FROM subcourse_fees WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::subcourse_fees,subcourseFeesdata)
			)
		);
		FOR mSubcourseFess IN SELECT json_array_elements(subcourseFeesdata)
		LOOP
			IF mSubcourseFess::json->>'id' IS NULL OR mSubcourseFess::json->>'id' = '0' THEN
				INSERT INTO subcourse_fees(subcourse_id,fee_type_id,amount,created_by)
					SELECT subcourseID,fee_type_id,amount,created_by 
						FROM json_populate_record(NULL::subcourse_fees, mSubcourseFess)
						RETURNING subcourse_fees.id INTO subcourseFeesId;
			ELSE
				UPDATE subcourse_fees
				SET subcourse_id = subcourseID,
					fee_type_id = newSubcourseFees.fee_type_id,
					amount = newSubcourseFees.amount,
					updated_by = newSubcourseFees.updated_by
				FROM json_populate_record(NULL::subcourse_fees , mSubcourseFess) AS newSubcourseFees
				WHERE subcourse_fees.id = newSubcourseFees.id
				AND subcourse_fees.subcourse_id = subcourseID
				RETURNING subcourse_fees.id INTO subcourseFeesId;
			END IF;
		END LOOP;	
	END IF;	
	RETURN subcourseID;
END$$;
/*--------------------------------------------------------------------------------------------------------------------------*/

CREATE OR REPLACE FUNCTION user_manage(
	userData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	userID integer;
	userRoles json;
	userRolesId  integer;
	createdBy character varying := CAST(userData::json->>'created_by' AS character varying);
	updatedBy character varying := CAST(userData::json->>'updated_by' AS character varying);
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: user_manage
	DESCRIPTION 	: This function is used to add and update user and user-roles
	CREATED BY    	: Nayan Gajera
	CREATED DATE 	: 23-September-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 10-March-2023
	CHANGE HISTORY	: 23-September-2022-Nayan: Initially Created
					  27-September-2022-Nayan: change in createBy when create User roles.
					  02-December-2022-Anita: Removed status in update.
					  03-Dec-2022-Nirav	: Change in status when create users time default set PENDING
					  05-December-2022-Anita: Removed status in insert
					  10-March-2023-Nirav: created_by and updated_by add field in users and user_roles create and update Time

	------------------------------------------------------------------------------------*/
	
BEGIN
	IF userData::json->>'id' IS NULL OR userData::json->>'id' = '0'  THEN		
			INSERT INTO users(first_name,last_name,email,hash,phone,created_by)
			VALUES(
				CAST(userData::json->>'first_name' AS character varying),
				CAST(userData::json->>'last_name' AS character varying),
				CAST(userData::json->>'email' AS character varying),
				CAST(userData::json->>'hash' AS character varying),
				CAST(userData::json->>'phone' AS character varying),
				createdBy)
				RETURNING id INTO userID;
	ELSE 
		UPDATE users
				SET first_name = CAST(userData::json->>'first_name' AS character varying),
					last_name = CAST(userData::json->>'last_name' AS character varying),
					phone = CAST(userData::json->>'phone' AS character varying),
					last_Seen = CAST(userData::json->>'lastSeen' AS timestamp without time zone),
					updated_by = updatedBy
			FROM json_populate_record(NULL::users , userData) AS newUserData
			WHERE users.id = newUserData.id
			RETURNING users.id INTO userID;
	END IF;
	
	IF userID IS NOT NULL AND json_array_length(userData::json-> 'roles') > 0 THEN
		DELETE FROM user_roles 
		WHERE user_id = userID 
		AND id NOT IN (
			SELECT id FROM user_roles WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::user_roles,userData::json-> 'roles')
			)
		);
		FOR userRoles IN SELECT json_array_elements(CAST(userData::json->> 'roles' AS json))
		LOOP
			IF userRoles::json->>'id' IS NULL OR userRoles::json->>'id' = '0' THEN
				INSERT INTO user_roles(user_id,role_id,zone_id,created_by)
				VALUES(
					userID,
					CAST(userRoles::json->>'role_id' AS INT),
					CAST(userRoles::json->>'zone_id' AS INT),
					createdBy
				)
				RETURNING user_roles.id INTO userRolesId;
			ELSE UPDATE user_roles
				SET role_id = CAST(userRoles::json->>'role_id' AS INT),
					zone_id = CAST(userRoles::json->>'zone_id' AS INT)
				FROM json_populate_record(NULL::user_roles , userRoles) AS newUserRoles
				WHERE user_roles.id = newUserRoles.id
				AND user_roles.user_id = userID
				RETURNING user_roles.id INTO userRolesId;
			END IF;
		END LOOP;
	END IF;	
	RETURN userID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/
/* create function get user-profile details  */

CREATE OR REPLACE FUNCTION check_user_permission(
	endpoint_url character varying,
	endpoint_method_type character varying,
	user_provider_key character varying)
    RETURNS TABLE(user_id integer, email character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
DECLARE user_detail record;
/*------------------------------------------------------------------------------------------------
DESCRIPTION		: This function is check if user has access to requested URL
CREATED BY		: Nirav lakhani
CREATED DATE	: 19-Sep-2022
MODIFIED BY		: 
MODIFIED DATE	:
CHANGE HISTORY	: Added 
 ------------------
 ------------------------------------------------------------------------------------------------*/
BEGIN
	--
	EXECUTE format(E'SELECT id AS user_id, email FROM users
							   WHERE hash = \'%s\'', 
				   				user_provider_key) INTO user_detail;

		RETURN QUERY SELECT user_detail.user_id,user_detail.email;
END 

$BODY$;

/* Create Function package manage */
DROP FUNCTION package_manage;
CREATE OR REPLACE FUNCTION package_manage(
	courseConfigurationData json,
	packageData json,
	packageFeesData json,
	packageSubcoursesdata json,
	packageBranchesData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
    courseConfigId integer;
	packageID integer;
	mPackagesFess json;
	mPackageSubCourse json;
	mPackageBranches json;

	/* ------------------------------------------------------------------------------------
	FUNCTION: packages_manage
	DESCRIPTION 		: This function is used to add and update packages, package_fees, package_subcourses and branch_package_relation
	CREATED BY    		: Nirav Lakhani
	CREATED DATE 		: 26-September-2022
	MODIFIED BY			: Ayush Donga
	MODIFIED DATE		: 29-April-2023
	CHANGE HISTORY	:
	26-September-2022-Nirav: Initially Created
	9-December-2022-Hardik: Removed status
	07-March-2023-Nirav: created_by and updated_by add field in packages and packages_fees, packages_subcourse, packages_branches create and update Time
	29-April-2023-Ayush : insert and update time course_cofiguration post and put and packages create and update time assign course_config_id
	------------------------------------------------------------------------------------*/
	
BEGIN
IF courseConfigurationData::json->>'id' IS NULL OR courseConfigurationData::json->>'id' = '0' THEN		
			INSERT INTO course_configs(ptm_day,ptm_grace_after,ptm_grace_before,cv_day,cv_grace_after,cv_grace_before,es_day,es_grace_after,es_grace_before,created_by)
			SELECT ptm_day,ptm_grace_after,ptm_grace_before,cv_day,cv_grace_after,cv_grace_before,es_day,es_grace_after,es_grace_before,created_by
			FROM json_populate_record(NULL::course_configs, courseConfigurationData)
			RETURNING id INTO courseConfigId;
	ELSE 
		UPDATE course_configs
				SET ptm_day = newCourseConfig.ptm_day,
					ptm_grace_after = newCourseConfig.ptm_grace_after,
					ptm_grace_before = newCourseConfig.ptm_grace_before,
					cv_day = newCourseConfig.cv_day,
					cv_grace_after = newCourseConfig.cv_grace_after,
					cv_grace_before = newCourseConfig.cv_grace_before,
					es_day = newCourseConfig.es_day,
					es_grace_after = newCourseConfig.es_grace_after,
					es_grace_before = newCourseConfig.es_grace_before,
					updated_by = newCourseConfig.updated_by
			FROM json_populate_record(NULL::course_configs , courseConfigurationData) AS newCourseConfig
			WHERE course_configs.id = newCourseConfig.id
			RETURNING course_configs.id INTO courseConfigId;
	END IF;
	
	IF packageData::json->>'id' IS NULL OR packageData::json->>'id' = '0' THEN		
			INSERT INTO packages(department_id,subdepartment_id,name,code,is_job_guarantee,total,duration,installment,course_config_id,created_by)
			SELECT department_id,subdepartment_id,name,code,is_job_guarantee,total,duration,installment,courseConfigId,created_by
			FROM json_populate_record(NULL::packages, packageData)
			RETURNING id INTO packageID;
	ELSE 
		UPDATE packages
				SET department_id = newPackage.department_id,
				    subdepartment_id = newPackage.subdepartment_id,
					name = newPackage.name,
					code = newPackage.code,
					is_job_guarantee = newPackage.is_job_guarantee,
					total = newPackage.total,
					duration = newPackage.duration,
					installment = newPackage.installment,
					course_config_id = courseConfigId,
					updated_by = newPackage.updated_by
			FROM json_populate_record(NULL::packages , packageData) AS newPackage
			WHERE packages.id = newPackage.id
			RETURNING packages.id INTO packageID;
	END IF;
	
	IF packageID IS NOT NULL THEN
		DELETE FROM package_fees 
		WHERE package_id = packageID 
		AND id NOT IN (
			SELECT id FROM package_fees WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::package_fees,packageFeesData)
			)
		);
		FOR mPackagesFess IN SELECT json_array_elements(packageFeesData)
		LOOP
			IF mPackagesFess::json->>'id' IS NULL OR mPackagesFess::json->>'id' = '0' THEN
				INSERT INTO package_fees(package_id,fee_type_id,amount,created_by)
					SELECT packageID,fee_type_id,amount,created_by 
						FROM json_populate_record(NULL::package_fees, mPackagesFess);
			ELSE
				UPDATE package_fees
				SET package_id = packageID,
					fee_type_id = newPackageFees.fee_type_id,
					amount = newPackageFees.amount,
					updated_by = newPackageFees.updated_by
				FROM json_populate_record(NULL::package_fees , mPackagesFess) AS newPackageFees
				WHERE package_fees.id = newPackageFees.id
				AND package_fees.package_id = packageID;
			END IF;
		END LOOP;	
	END IF;	
	
	IF packageID IS NOT NULL THEN
		DELETE FROM package_subcourses 
		WHERE package_id = packageID 
		AND id NOT IN (
			SELECT id FROM package_subcourses WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::package_subcourses,packageSubcoursesdata)
			)
		);
		FOR mPackageSubCourse IN SELECT json_array_elements(packageSubcoursesdata)
		LOOP
			IF mPackageSubCourse::json->>'id' IS NULL OR mPackageSubCourse::json->>'id' = '0' THEN
				INSERT INTO package_subcourses(package_id,subcourse_id,created_by)
					SELECT packageID,subcourse_id,created_by 
						FROM json_populate_record(NULL::package_subcourses, mPackageSubCourse);
			ELSE
				UPDATE package_subcourses
				SET package_id = packageID,
					subcourse_id = newPackageSubCourse.subcourse_id,
					updated_by = newPackageSubCourse.updated_by
				FROM json_populate_record(NULL::package_subcourses , mPackageSubCourse) AS newPackageSubCourse
				WHERE package_subcourses.id = newPackageSubCourse.id
				AND package_subcourses.package_id = packageID;
			END IF;
		END LOOP;	
	END IF;	
	
	IF packageID IS NOT NULL THEN
		DELETE FROM package_branches 
		WHERE package_id = packageID 
		AND id NOT IN (
			SELECT id FROM package_branches WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::package_branches,packageBranchesData)
			)
		);
		FOR mPackageBranches IN SELECT json_array_elements(packageBranchesData)
		LOOP
			IF mPackageBranches::json->>'id' IS NULL OR mPackageBranches::json->>'id' = '0' THEN
				INSERT INTO package_branches(branch_id,package_id,created_by)
					SELECT branch_id,packageID,created_by 
						FROM json_populate_record(NULL::package_branches, mPackageBranches);
			ELSE
				UPDATE package_branches
				SET branch_id = newPackageBranch.branch_id,
					package_id = packageID,
					updated_by = newPackageBranch.updated_by
				FROM json_populate_record(NULL::package_branches , mPackageBranches) AS newPackageBranch
				WHERE package_branches.id = newPackageBranch.id
				AND package_branches.package_id = packageID;
			END IF;
		END LOOP;	
	END IF;
	
	RETURN packageID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/
/* create function inserta and update data in branches and zones */


CREATE OR REPLACE FUNCTION branchAndZone_manage(
	branchData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
    zoneID integer;
    branchID integer;
    zonesdata json;
/* ------------------------------------------------------------------------------------
    FUNCTION: branchAndZone_manage
    DESCRIPTION     	: This function is used to add zone and branches
    CREATED BY        	: Nirav Lakhani
    CREATED DATE     	: 29-September-2022
	MODIFIED BY			: Nirav Lakhani
	MODIFIED DATE		: 08-June-2023
    CHANGE HISTORY    	:
    -----------------
    29-Sep-2022-Nirav    : Initially Created
    15-oct-2022-nirav     : Change insert and update time status remove
    17-Nov-2022-Anita    : update remove field invoice_no_sequence
    18-Nov-2022-Hardik    : Change insert value invoice_no_sequence and enrolment_no_sequence initially 0
    03-Dec-2022-Nirav    : Remove array of object in branchData
    29-Dec-2022-krishna    : insert and update in fild add is isgst
	27-Jan-2023-krishna	: iscomposition add this fild in insert and update
	09-March-2023-Nirav: created_by and updated_by add field in branches and zones create and update Time
	08-June-2023-Nirav: Update Private Zone Name And Code
------------------------------------------------------------------------------------*/    
BEGIN
    IF branchData::json->>'id' IS NULL OR branchData::json->>'id' = '0' THEN        
        FOR zonesdata IN SELECT (branchData::json->'zone')
        LOOP
            INSERT INTO zones(parent_id,name,code,type,created_by)
            VALUES(
            CAST(zonesdata::json->>'parent_id' AS INTEGER),    
            concat('B_',CAST(branchData::json->>'name' AS character varying)),
            concat('BC_',CAST(branchData::json->>'code' AS character varying)),
            'PRIVATE',
			CAST(zonesdata::json->>'created_by' AS character varying)	
            )
            RETURNING id INTO zoneID;
        END LOOP;    
    
    
        IF zoneID IS NOT NULL THEN
            INSERT INTO branches(zone_id,name,code,title,email,landline_no,mobile_one,mobile_two,website,pan_no,cin,gst_no,
                                  bank_name,account_holder_name,account_no,ifsc,account_type,logo,address,country,state,city,area,
                                 enrolment_no_sequence,invoice_no_sequence,isgst,iscomposition,created_by)
                SELECT zoneID,name,code,title,email,landline_no,mobile_one,mobile_two,website,pan_no,cin,gst_no,
                                  bank_name,account_holder_name,account_no,ifsc,account_type,logo,address,country,state,city,area,
                                 0,0,isgst,iscomposition,created_by
                FROM json_populate_record(NULL::branches, branchData)
                RETURNING id INTO branchID;
        END IF;    
    ELSE
        UPDATE branches
            SET name = newBranchesFees.name,
                code = newBranchesFees.code,
                title = newBranchesFees.title,
                email = newBranchesFees.email,
                landline_no = newBranchesFees.landline_no,
                mobile_one = newBranchesFees.mobile_one,
                mobile_two = newBranchesFees.mobile_two,
                website = newBranchesFees.website,
                pan_no = newBranchesFees.pan_no,
                cin = newBranchesFees.cin,
                gst_no = newBranchesFees.gst_no,
                bank_name = newBranchesFees.bank_name,
                account_holder_name = newBranchesFees.account_holder_name,
                account_no = newBranchesFees.account_no,
                ifsc = newBranchesFees.ifsc,
                account_type = newBranchesFees.account_type,
                logo = newBranchesFees.logo,
                address = newBranchesFees.address,
                country = newBranchesFees.country,
                state = newBranchesFees.state,
                city = newBranchesFees.city,
                area = newBranchesFees.area,
                isgst = newBranchesFees.isgst,
				iscomposition = newBranchesFees.iscomposition,
				updated_by = newBranchesFees.updated_by
            FROM
                json_populate_record(NULL::branches, branchData) AS newBranchesFees
                WHERE branches.id = newBranchesFees.id
            RETURNING branches.id INTO branchID;
            
    FOR zonesdata IN SELECT (branchData::json->'zone')
      LOOP
            IF ((SELECT parent_id FROM zones where zones.type = 'PRIVATE' AND zones.parent_id IS NOT NULL AND zones.id = CAST(zonesdata::json->>'id' AS INTEGER)) > 0) THEN
                    UPDATE zones
                    SET parent_id = CAST(zonesdata::json->>'parent_id' AS INTEGER),
						name = concat('B_',CAST(branchData::json->>'name' AS character varying)),
						code = concat('BC_',CAST(branchData::json->>'code' AS character varying)),
						updated_by = CAST(zonesdata::json->>'updated_by' AS character varying)
                    WHERE zones.id = CAST(zonesdata::json->>'id' AS INTEGER)
                    RETURNING zones.id INTO zoneID;    
            END IF;
       END LOOP;        
    END IF;        
    RETURN branchID;
END
$$;

/* department_manage */
CREATE OR REPLACE FUNCTION department_manage(
	departmentData json,
	branchesDepartmentData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	departmentID integer;
	mBranchesDepartment json;

	/* ------------------------------------------------------------------------------------
	FUNCTION: department_manage
	DESCRIPTION 	: This function is used to add and update departments,branch_departments
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 30-September-2022
	MODIFIED BY		: Krishna Vasoya
	MODIFIED DATE	: 16-March-2023 
	CHANGE HISTORY	:
	30-September-2022-Nirav: Initially Created
	15-Oct-2022-Nirav: Change insert and update time status remove
	16-March-2023-krishna: created_by and updated_by add field in departments and branch_departments create and update Time
	------------------------------------------------------------------------------------*/

BEGIN
	IF departmentData::json->>'id' IS NULL OR departmentData::json->>'id' = '0' THEN		
			INSERT INTO departments(name,code,created_by)
			SELECT name,code,created_by
			FROM json_populate_record(NULL::departments, departmentData)
			RETURNING id INTO departmentID;
	ELSE 
		UPDATE departments
				SET name = newDepartment.name,
					code = newDepartment.code,
					updated_by=newDepartment.updated_by
			FROM json_populate_record(NULL::departments , departmentData) AS newDepartment
			WHERE departments.id = newDepartment.id
			RETURNING departments.id INTO departmentID;
	END IF;
	
	IF departmentID IS NOT NULL THEN
		DELETE FROM branch_departments 
		WHERE department_id = departmentID 
		AND id NOT IN (
			SELECT id FROM branch_departments WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::branch_departments,branchesDepartmentData)
			)
		);
		FOR mBranchesDepartment IN SELECT json_array_elements(branchesDepartmentData)
		LOOP
			IF mBranchesDepartment::json->>'id' IS NULL OR mBranchesDepartment::json->>'id' = '0' THEN
				INSERT INTO branch_departments(branch_id,department_id,created_by)
					SELECT branch_id,departmentID,created_by
						FROM json_populate_record(NULL::branch_departments, mBranchesDepartment);
			ELSE
				UPDATE branch_departments
				SET branch_id = newBranchesDepartments.branch_id,
					updated_by = newBranchesDepartments.updated_by
				FROM json_populate_record(NULL::branch_departments , mBranchesDepartment) AS newBranchesDepartments
				WHERE branch_departments.id = newBranchesDepartments.id
				AND branch_departments.department_id = departmentID;
			END IF;
		END LOOP;	
	END IF;
	
	RETURN departmentID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/
/* Create Function updaet admission_installments and add remarks */
  
CREATE OR REPLACE FUNCTION admission_installments_update_manage(
	admissionInstallmentsData json,
	admissionRemarksData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionInstallmentID integer;
	mAdmissionRemarksData json;
	
/* ------------------------------------------------------------------------------------
	FUNCTION: admission_installments_update_manage
	DESCRIPTION 	: This function is used to update admission_installments and Add admission_remarks
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 04-October-2022
	MODIFIED BY		: Zenil
	MODIFIED DATE	: 11-Jan-2023
	CHANGE HISTORY	:
	04-October-2022-Nirav: Initially Created
	11-Jan-2023-Zenil  :  remove payment_type column
------------------------------------------------------------------------------------*/
	
BEGIN
	IF admissionInstallmentsData::json->>'id' IS NOT NULL
	THEN
		UPDATE admission_installmets
				SET admission_id = newadmissionInstallmentsData.admission_id,
					branch_id = newadmissionInstallmentsData.branch_id,
					installment_date = newadmissionInstallmentsData.installment_date,
					commitment_date = newadmissionInstallmentsData.commitment_date,
					installment_no = newadmissionInstallmentsData.installment_no,
					due_amount = newadmissionInstallmentsData.due_amount,
					pay_amount = newadmissionInstallmentsData.pay_amount,
					pay_date = newadmissionInstallmentsData.pay_date,
					payment_mode = newadmissionInstallmentsData.payment_mode,
					admission_status = newadmissionInstallmentsData.admission_status,
					bank_name = newadmissionInstallmentsData.bank_name,
					bank_branch_name = newadmissionInstallmentsData.bank_branch_name,
					transaction_no = newadmissionInstallmentsData.transaction_no,
					transaction_date = newadmissionInstallmentsData.transaction_date,
					cheque_no = newadmissionInstallmentsData.cheque_no,
					cheque_date = newadmissionInstallmentsData.cheque_date,
					cheque_status = newadmissionInstallmentsData.cheque_status,
					cheque_holder_name = newadmissionInstallmentsData.cheque_holder_name,
					send_sms_student = newadmissionInstallmentsData.send_sms_student,
					send_email_parents = newadmissionInstallmentsData.send_email_parents
			FROM json_populate_record(NULL::admission_installmets , admissionInstallmentsData) AS newadmissionInstallmentsData
			WHERE admission_installmets.id = newadmissionInstallmentsData.id
			RETURNING admission_installmets.id INTO admissionInstallmentID;
	END IF;
	IF admissionInstallmentID IS NOT NULL THEN
		FOR mAdmissionRemarksData IN SELECT json_array_elements(admissionRemarksData)
		LOOP
			IF mAdmissionRemarksData::json->>'id' IS NULL OR mAdmissionRemarksData::json->>'id' = '0' THEN
					INSERT INTO admission_remarks(admission_id,branch_id,labels,rating,remarks,status,type)
						SELECT admission_id,branch_id,labels,rating,remarks,status,type 
							FROM json_populate_record(NULL::admission_remarks, mAdmissionRemarksData);
			END IF;				
		END LOOP;	
	END IF;	
	RETURN admissionInstallmentID;
END
$$;

/* course_manage */
CREATE OR REPLACE FUNCTION course_manage(
	courseData json,
	branchesCourseData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	courseID integer;
	mBranchesCourse json;

	/* ------------------------------------------------------------------------------------
	FUNCTION: course_manage
	DESCRIPTION 		: This function is used to add and update course,branch_course
	CREATED BY    		: Nirav Lakhani
	CREATED DATE 		: 1-october-2022
	MODIFIED BY			: Nirav Lakhani
	MODIFIED DATE		: 09-March-2023
	CHANGE HISTORY	:
	1-october-2022-Nirav: Initially Created
	15-october-2022-Nirav: Change insert and update time status remove
	09-March-2023-Nirav: created_by and updated_by add field in course and branch_Course create and update Time
	------------------------------------------------------------------------------------*/

BEGIN
	IF courseData::json->>'id' IS NULL OR courseData::json->>'id' = '0' THEN		
			INSERT INTO course(department_id,subdepartment_id,name,code,created_by)
			SELECT department_id,subdepartment_id,name,code,created_by
			FROM json_populate_record(NULL::course, courseData)
			RETURNING id INTO courseID;
	ELSE 
		UPDATE course
				SET department_id = newCourse.department_id,
					subdepartment_id = newCourse.subdepartment_id,
					name = newCourse.name,
					code = newCourse.code,
					updated_by = newCourse.updated_by
			FROM json_populate_record(NULL::course , courseData) AS newCourse
			WHERE course.id = newCourse.id
			RETURNING course.id INTO courseID;
	END IF;
	
	IF courseID IS NOT NULL THEN
		DELETE FROM branch_course 
		WHERE course_id = courseID 
		AND id NOT IN (
			SELECT id FROM branch_course WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::branch_course,branchesCourseData)
			)
		);
		FOR mBranchesCourse IN SELECT json_array_elements(branchesCourseData)
		LOOP
			IF mBranchesCourse::json->>'id' IS NULL OR mBranchesCourse::json->>'id' = '0' THEN
				INSERT INTO branch_Course(branch_id,course_id,created_by)
					SELECT branch_id,courseID,created_by 
						FROM json_populate_record(NULL::branch_course, mBranchesCourse);
			ELSE
				UPDATE branch_course
				SET branch_id = newBranchesCourse.branch_id,
					updated_by = newBranchesCourse.updated_by
				FROM json_populate_record(NULL::branch_departments , mBranchesCourse) AS newBranchesCourse
				WHERE branch_course.id = newBranchesCourse.id
				AND branch_course.course_id = courseID;
			END IF;
		END LOOP;	
	END IF;
	
	RETURN courseID;
END
$$;

/*--------------------------------------------------------------------------------------------------------------------------*/

-- DROP FUNCTION admission;
CREATE OR REPLACE FUNCTION admission(
	admissionData json,
	documentData json,
	selectedSubcourses json
)
RETURNS json
LANGUAGE 'plpgsql'
AS $$
DECLARE
	studentID integer;
	studentgrID integer;
	grID integer;
	admissionID integer;
	documentID integer;
	otherDocumentsID integer;
	mSubCourse subcourses%rowType;
	mSubCourseFees subcourse_fees%rowType;
	mSelectedSubcourse json;
	subCourseId json;
	mPackageFees package_fees%rowType;
	mInstallments json;
	mPackageSubcourses package_subcourses%rowType;
	admissionStatus admission_status;
	subcourseStatus admission_subcourse_status;
	userID integer;
	batchID integer;
	mAdmissionPackageFees json;
	mAdmissionSubcourseFees json;
	mOtherDocument json;
	createdBy character varying := CAST(admissionData::json->>'created_by' AS character varying);

/* ------------------------------------------------------------------------------------
	FUNCTION: admission
	DESCRIPTION 	: This function is used to create admission
	CREATED BY    	: Hardik Kathiriya
	CREATED DATE 	: 5-October-2022
	MODIFIED BY		: Jay Dhameliya
	MODIFIED DATE	: 12-July-2023
	CHANGE HISTORY	:
	-----------------
	15-Nov-2022-Hardik	: Added send_to_sms and send_to_email and modify treal_certy to trial_certy in documents and user_id and batch_id manage inserting time 
	16-Nov-2022-Hardik	: Added created_by in admission
	16-Nov-2022-Hardik	: Modify to id to subcourse_id in selected subcourse data
	16-Nov-2022-Hardik	: Added scl_clg_type in admission
	19-Nov-2022-Hardik	: Modify return type integer to json for id and status need
	24-Nov-2022-Hardik	: Added to status admission installment inserting data 
	05-Dec-2022-Hardik	: Added to installment_amount admission installment inserting data
	10-Dec-2022-Hardik  : Modify admission_package_fees and admission_subcourse_fees inserting data in admisssion_id and added admission_fees new table entry
	13-Dec-2022-Hardik  : Added admission_fees inserting admission data
	14-Dec-2022-Hardik  : Modify tution_fees_without discount to admission_amount and admission_fees to payable_amount
	17-Dec-2022-Hardik  : Remove tuation_fees in admission data
	01-Feb-2023-Krishna : create admission_other_document insert query add in admission_document
	02-Feb-2023-Nirav	: create admission_other_document insert query if condition add
	18-Feb-2023-Nirav   : create admission_document time remove field tenth_marksheet,twelfth_marksheet,leaving_certy,trial_certy,light_bill,other And add one new column last_passing_marksheet 
	11-Mar-2023-Jay   	: Admission installment amount as due amount store in Database 
	09-Mar-2023-Nirav	: created_by and updated_by add field in admission and admission_installments and  student_details
	                      and admission_subcourse and admission_documents and admission_other_documents and create and update Time
	                      and admission_subcourse and admission_documents and admission_other_documents 
						  and admission_fees and admission_package_fees and admission_packages create and update Time
    19-June-2023-Ayush  : Admission create Time Return GR ID Add Funality 
	12-July-2023-Jay	: Add new column in admission table
------------------------------------------------------------------------------------*/
BEGIN	
	IF(select id from student_details where (student_details.aadhar_card_no = admissionData::json->>'aadhar_card_no' OR 
									  student_details.passport_no = admissionData::json->>'passport_no'))IS NOT NULL THEN
		UPDATE student_details
		SET first_name =newStudentData.first_name,
			middle_name = newStudentData.middle_name,
			last_name = newStudentData.last_name,
			email = newStudentData.email,
			mobile_no = newStudentData.mobile_no,
			alternate_no = newStudentData.alternate_no,
			dob = newStudentData.dob,
			gender = newStudentData.gender,
			father_name = newStudentData.father_name,
			father_email = newStudentData.father_email,
			father_mobile_no = newStudentData.father_mobile_no,
			father_occupation = newStudentData.father_occupation,
			father_income = newStudentData.father_income,
			mother_name = newStudentData.mother_name,
			mother_email = newStudentData.mother_email,
			mother_mobile_no = newStudentData.mother_mobile_no,
			mother_occupation = newStudentData.mother_occupation,
			mother_income = newStudentData.mother_income,
			updated_by = createdBy
		FROM json_populate_record(NULL::student_details , admissionData) AS newStudentData
		WHERE (student_details.aadhar_card_no = newStudentData.aadhar_card_no OR student_details.passport_no = newStudentData.passport_no)
		RETURNING student_details.id,student_details.gr_id  INTO studentID ,studentgrID;
	ELSE
		INSERT INTO student_details(aadhar_card_no,passport_no,is_nri,first_name ,middle_name ,last_name ,email ,mobile_no,
								 alternate_no ,dob ,gender,father_name ,father_email ,father_mobile_no,father_occupation ,father_income ,
								mother_name ,mother_email ,	mother_mobile_no ,mother_occupation ,mother_income,created_by)
		SELECT aadhar_card_no,passport_no,is_nri,first_name ,middle_name ,last_name ,email ,mobile_no, alternate_no ,dob,
		gender,father_name,father_email ,father_mobile_no,father_occupation ,father_income ,mother_name ,mother_email ,	mother_mobile_no ,
		mother_occupation ,mother_income,createdBy FROM json_populate_record(NULL::student_details,admissionData)
		RETURNING student_details.id,student_details.gr_id  INTO studentID ,studentgrID;
	END IF;
	
	IF admissionData::json->>'id' IS NULL THEN
		IF (admissionData::json->>'batch_id') IS NULL THEN
				 admissionStatus = 'PENDING';
				 userID = CAST(admissionData::json->>'user_id' AS integer);
			ELSE
				 userID=null;
			     admissionStatus = 'ONGOING';
		END IF;
		INSERT INTO admissions(
		gr_id, source_id,student_id, branch_id,concession ,concession_percentage,department_id,subdepartment_id, package_id,starting_course_id,course_category,
		batch_id ,user_id,enrollment_number ,year,aadhar_card_no,passport_no ,is_nri ,first_name ,middle_name ,last_name,email ,mobile_no,
		alternate_no ,dob,gender,father_name ,father_email ,father_mobile_no ,father_occupation ,father_income,mother_name,mother_email,mother_mobile_no,
		mother_occupation ,mother_income,payable_amount,admission_amount,discount_amount,grade,no_of_installment,
		registration_fees,present_country,present_state ,present_city ,present_area ,present_pin_code ,present_flate_house_no,present_area_street,
		present_landmark,permanent_flate_house_no,permanent_country ,permanent_state ,permanent_city ,permanent_area ,permanent_pin_code ,permanent_area_street,permanent_landmark,
		school_collage_name,school_clg_country ,school_clg_state ,school_clg_city,school_clg_area,scl_clg_type,send_to_father_email,send_to_father_sms,send_to_sms,send_to_email,admission_type,
		start_date,end_date,comment,status,created_by)
		SELECT studentgrID, source_id,studentID, branch_id,concession ,concession_percentage,department_id,subdepartment_id,package_id,starting_course_id,course_category,
		batch_id ,userID,enrollment_number ,(SELECT date_part('year', (SELECT current_timestamp))),aadhar_card_no,passport_no ,is_nri ,first_name ,middle_name ,last_name,email ,mobile_no,
		alternate_no ,dob,gender,father_name ,father_email ,father_mobile_no ,father_occupation ,father_income,mother_name,mother_email,mother_mobile_no,
		mother_occupation ,mother_income,payable_amount,admission_amount,discount_amount,grade,no_of_installment,
		registration_fees,present_country,present_state ,present_city ,present_area ,present_pin_code ,present_flate_house_no,present_area_street,
		present_landmark,permanent_flate_house_no,permanent_country ,permanent_state ,permanent_city ,permanent_area ,permanent_pin_code ,permanent_area_street,permanent_landmark,
		school_collage_name,school_clg_country ,school_clg_state ,school_clg_city,school_clg_area,scl_clg_type,send_to_father_email ,send_to_father_sms,send_to_sms,send_to_email,admission_type,
		        start_date,end_date,comment,admissionStatus,createdBy    FROM json_populate_record(NULL::admissions, admissionData) RETURNING admissions.id,admissions.gr_id INTO admissionID,grID;
	END IF;
	
	IF admissionID IS NOT NULL THEN 
		IF documentData::json->>'id' IS NULL THEN
			INSERT INTO admission_documents(admission_id,photos,aadhar_card,form,last_passing_marksheet,created_by)
			SELECT admissionID,photos,aadhar_card,form,last_passing_marksheet,createdBy
			FROM json_populate_record(NULL::admission_documents,documentData) RETURNING admission_documents.id INTO documentID;
			
			IF json_array_length(documentData::json-> 'admission_other_documents') > 0 THEN
				FOR mOtherDocument IN SELECT json_array_elements(CAST(documentData::json->> 'admission_other_documents' AS json))
				LOOP
					IF mOtherDocument::json->>'id' IS NULL OR mOtherDocument::json->>'id' = '0'  THEN
						IF mOtherDocument::json->>'name' IS NOT NULL AND mOtherDocument::json->>'path' IS NOT NULL THEN
							INSERT INTO admission_other_documents(admission_id,name,path,created_by)
							VALUES(
								admissionID,
								CAST(mOtherDocument::json->>'name' AS character varying),
								CAST(mOtherDocument::json->>'path' AS character varying),
								createdBy
							)
							RETURNING admission_other_documents.id INTO otherDocumentsID;
						END IF;
					END IF;	  
				END LOOP;
			END IF;
		END IF;
		
		IF CAST(admissionData::json->>'course_category' AS course_type) = 'SINGLE' THEN 
			FOR mSelectedSubcourse IN SELECT json_array_elements(selectedSubcourses::json -> 'selectedSubCourses')
			LOOP
				FOR mSubCourse IN (SELECT * FROM subcourses WHERE id = CAST(mSelectedSubcourse::json->>'subcourse_id' AS integer))
				LOOP 				
					IF((CAST(mSelectedSubcourse::json->>'is_starting_course' AS boolean) = true) AND 
					   (CAST(mSelectedSubcourse::json->>'batch_id' AS integer) IS NOT NULL) AND 
					   (CAST(mSelectedSubcourse::json->>'subcourse_id' AS integer) = CAST(mSubCourse.id AS integer))) THEN
						   subcourseStatus = 'ONGOING';
						   batchID=CAST(mSelectedSubcourse::json->>'batch_id'AS integer);
						   userID = null;
					 ELSIF ((CAST(mSelectedSubcourse::json->>'batch_id' AS integer) IS NULL) AND (CAST(mSelectedSubcourse::json->>'user_id' AS integer) IS NOT NULL)
							  AND (CAST(mSelectedSubcourse::json->>'is_starting_course' AS boolean) = true) AND
							  (CAST(mSelectedSubcourse::json->>'subcourse_id' AS integer) = CAST(mSubCourse.id AS integer))) THEN
								subcourseStatus = 'UP_COMING'; 
								userID = CAST(mSelectedSubcourse::json->>'user_id' AS integer);
								batchID = null;  
					ELSE
							subcourseStatus = 'UP_COMING';
							userID = null;
							batchID = null;
					END IF;
					INSERT INTO admission_subcourse(admission_id,course_id,subcourse_id,batch_id,user_id,course_category,is_starting_course,subcourse_status,created_by)
					VALUES (admissionID,mSubCourse.course_id,mSubCourse.id,batchID,userID,CAST(admissionData::json->>'course_category' AS course_type),
							CAST(mSelectedSubcourse::json->>'is_starting_course'AS boolean),subcourseStatus,createdBy);

					IF CAST(mSubCourse.id AS integer) IS NOT NULL THEN 
						FOR mSubCourseFees IN (SELECT * FROM subcourse_fees WHERE subcourse_id=CAST(mSubCourse.id AS integer))
						LOOP
							INSERT INTO admission_subcourse_fees(admission_id,subcourse_id,fee_type_id,amount,created_by)
							VALUES (admissionID,mSubCourse.id,mSubCourseFees.fee_type_id,mSubCourseFees.amount,createdBy);
						END LOOP;
					END IF;
				END LOOP;
			END LOOP;
			
			FOR mAdmissionSubcourseFees IN (select row_to_json(t)from (select DISTINCT(fee_type_id),SUM(amount) as amount FROM admission_subcourse_fees WHERE admission_id =admissionID GROUP BY fee_type_id) t)
			LOOP
				INSERT INTO admission_fees(admission_id,fee_type_id,amount,created_by)
				VALUES (admissionID,CAST(mAdmissionSubcourseFees::json->>'fee_type_id' as integer),CAST(mAdmissionSubcourseFees::json->>'amount' as integer),createdBy);
			END LOOP;
		
		ELSIF CAST(admissionData::json->>'course_category' AS course_type) = 'PACKAGE' THEN
			IF CAST(admissionData::json->>'package_id' AS integer)IS NOT NULL THEN 
				INSERT INTO admission_packages(admission_id,package_id,is_job_guarantee,total,duration,created_by)
				SELECT admissionID,CAST(admissionData::json->>'package_id' AS integer),is_job_guarantee,total,duration,createdBy
				FROM packages where packages.id=CAST(admissionData::json->>'package_id' AS integer);
			END IF;		
			FOR mPackageSubcourses IN (SELECT * FROM package_subcourses WHERE package_subcourses.package_id =CAST(admissionData::json->>'package_id' AS integer))
			LOOP
				IF CAST(admissionData::json->>'package_id' AS integer)IS NOT NULL THEN
					IF (CAST(admissionData::json->>'batch_id' AS integer) IS NOT NULL AND (CAST(admissionData::json->>'starting_course_id' AS integer)= 
																			CAST(mPackageSubcourses.subcourse_id AS integer))) THEN
					 	subcourseStatus = 'ONGOING';
						batchID=CAST(admissionData::json->>'batch_id'AS integer);
						userID=null;						
					ELSIF ((CAST(admissionData::json->>'batch_id' AS integer) IS NULL) AND (CAST(admissionData::json->>'user_id' AS integer) IS NOT NULL)
						  AND (CAST(admissionData::json->>'starting_course_id' AS integer)= CAST(mPackageSubcourses.subcourse_id AS integer))) THEN
						subcourseStatus = 'UP_COMING'; 
						userID = CAST(admissionData::json->>'user_id' AS integer);
						batchID = null;
					ELSE
						subcourseStatus = 'UP_COMING'; 
						userID = null;
						batchID = null;
					END IF;
					INSERT INTO admission_subcourse(admission_id,package_id,subcourse_id,course_category,subcourse_status,batch_id,user_id,created_by)
					VALUES (admissionID,mPackageSubcourses.package_id,mPackageSubcourses.subcourse_id,
							CAST(admissionData::json->>'course_category' AS course_type),subcourseStatus,batchID,userID,createdBy);
				END IF;
			END LOOP;
			FOR mPackageFees IN (SELECT * FROM package_fees WHERE package_fees.package_id=CAST(admissionData::json->>'package_id' AS integer))
			LOOP
				IF CAST(admissionData::json->>'package_id' AS integer)=mPackageFees.package_id THEN
					INSERT INTO admission_package_fees(admission_id,package_id,fee_type_id,amount,created_by)
					VALUES (admissionID,CAST(admissionData::json->>'package_id' AS integer),mPackageFees.fee_type_id,mPackageFees.amount,createdBy);
				END IF;
			END LOOP;
			
			FOR mAdmissionPackageFees IN ((select row_to_json(t)from (select DISTINCT(fee_type_id),SUM(amount) as amount FROM admission_package_fees WHERE admission_id =admissionID GROUP BY fee_type_id) t))
			LOOP
				INSERT INTO admission_fees(admission_id,fee_type_id,amount,created_by)
				VALUES (admissionID,CAST(mAdmissionPackageFees::json->>'fee_type_id' as integer),CAST(mAdmissionPackageFees::json->>'amount' as integer),createdBy);
			END LOOP;
		END IF;
		
		FOR mInstallments IN SELECT json_array_elements(selectedSubcourses::json -> 'installments')
		LOOP
			INSERT INTO admission_installments(admission_id,branch_id,installment_date,installment_no,due_amount,installment_amount,status,created_by)
			VALUES (admissionID,CAST(admissionData::json->>'branch_id' AS integer),CAST(mInstallments::json->>'installment_date' AS date),
					CAST(mInstallments::json->>'installment_no' AS integer),CAST(mInstallments::json->>'installment_amount' AS numeric),
					CAST(mInstallments::json->>'installment_amount' AS numeric),'UNPAID',createdBy);
		END LOOP;
		---- Add blank row in admission_crm table	
		INSERT INTO admission_crm (admission_id) values (admissionID);
	END IF; 
	RETURN (select row_to_json(t)from ( select id, status, gr_id from admissions where id=admissionID) t);
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/

CREATE OR REPLACE FUNCTION admission_histories() RETURNS TRIGGER AS $admission_history$
    BEGIN
		IF (TG_OP = 'INSERT') THEN
            IF NEW.id IS NOT NULL THEN
				INSERT INTO admission_status_histories (admission_id,status,comment,created_by)
					VALUES(NEW.id,NEW.status,NEW.comment,NEW.created_by);
        	END IF;
			RETURN NEW;
        ELSIF (TG_OP = 'UPDATE') THEN
			IF (New.status != Old.status) THEN  
				IF ('CANCELLED' NOT IN (SELECT status FROM admission_status_histories WHERE admission_id = New.id)
				   AND 'COMPLETED' NOT IN (SELECT status FROM admission_status_histories WHERE admission_id = New.id)
				   AND 'TERMINATED' NOT IN (SELECT status FROM admission_status_histories WHERE admission_id = New.id)) THEN
						IF (New.status = 'PENDING') THEN
								IF (New.id = (SELECT id FROM admissions where batch_id IS NULL and id = New.id)) THEN
								    IF (New.id = (SELECT admission_id FROM admission_subcourse where batch_id is null and admission_id = New.id LIMIT 1)) THEN
								      IF (New.id = (SELECT admission_id FROM admission_subcourse where batch_id is NOT null and admission_id = New.id LIMIT 1)) THEN
										  RETURN NULL;
									  ELSE
										   INSERT INTO admission_status_histories (admission_id,status,comment,start_date,created_by)
											          VALUES(NEW.id,NEW.status,NEW.comment,NEW.start_date,NEW.created_by);
									  END IF; 	  
									END IF;  
								END IF;	
						 END IF;
						 IF(New.status = 'ONGOING' OR New.status = 'TERMINATED' OR New.status = 'CANCELLED' OR
							  New.status ='COMPLETED' OR New.status = 'TRANSFER') THEN
								INSERT INTO admission_status_histories (admission_id,status,comment,start_date,created_by)
						             VALUES(NEW.id,NEW.status,NEW.comment,NEW.start_date,NEW.created_by);
						 END IF;	
						 IF (NEW.status = 'HOLD') THEN
									   INSERT INTO admission_status_histories (admission_id,status,comment,start_date,end_date,created_by)
										    VALUES(NEW.id,NEW.status,NEW.comment,NEW.start_date,NEW.end_date,NEW.created_by);
						 END IF;						
					END IF;	
				END IF; 
            RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$admission_history$ LANGUAGE plpgsql;

----------------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS admission_history on admissions;
	CREATE TRIGGER admission_history
	AFTER INSERT OR UPDATE ON admissions
		FOR EACH ROW EXECUTE FUNCTION admission_histories();


/* Create function assign branch */

CREATE OR REPLACE FUNCTION assignBatch(
	admissionSubCourseData json,
	admissionremarksData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionSubcourseID integer;
	admissionRemarksID integer;
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: assign_batch_manage
	DESCRIPTION 	: This function is used to update admission_subcourse and add admission_remarks
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 17-October-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 09-March-2023
	CHANGE HISTORY	:
	17-October-2022-Nirav: Initially Created
	22-November-2022-Krishna: Change admission-remakrs insert time data
	28-November-2022-Nirav: Change admission-remakrs insert data time data add only remark and assign only batch and subcourse_status default ONGOING set
	17-January-2023-Anita: Rating field removed in admissionremarksData
	17-February-2023-Krishna:Upadte admission status condistion add
	09-March-2023-Nirav: created_by and updated_by add field in admission_subcourse and admissions and admission_remarks create and update Time
	------------------------------------------------------------------------------------*/
	
BEGIN
	IF admissionSubCourseData::json->>'id' IS NOT NULL THEN		
			UPDATE admission_subcourse
				SET batch_id = admissionSubCourse.batch_id,
					subcourse_status = 'ONGOING',
					updated_by = admissionSubCourse.updated_by
			FROM json_populate_record(NULL::admission_subcourse, admissionSubCourseData) AS admissionSubCourse	
			WHERE admission_subcourse.id = admissionSubCourse.id AND admission_subcourse.subcourse_status 
			NOT IN ('COMPLETED','CANCELLED') 
			RETURNING admission_subcourse.id INTO admissionSubcourseID;
			
		IF admissionSubcourseID IS NOT NULL THEN		
			UPDATE admissions
				SET 
				status = 'ONGOING',
				updated_by = admissionSubCourseData::json->>'updated_by'
			WHERE id = (SELECT admission_id FROM admission_subcourse WHERE id = admissionSubcourseID LIMIT 1); 
		END IF;	
		
		IF admissionremarksData::json->>'remarks' IS NOT NULL THEN
			INSERT INTO admission_remarks(admission_id,branch_id,labels,remarks,status,type,created_by)
			SELECT (SELECT admission_id FROM admission_subcourse WHERE id  = CAST(admissionSubCourseData::json->>'id' AS INTEGER)),
				   (SELECT branch_id FROM admissions WHERE id = (SELECT admission_id FROM admission_subcourse WHERE id  = CAST(admissionSubCourseData::json->>'id' AS INTEGER))),
				   'Batch_Assign',
				   remarks,
				   (SELECT status FROM admissions WHERE id = (SELECT admission_id FROM admission_subcourse WHERE id  = CAST(admissionSubCourseData::json->>'id' AS INTEGER))),
				   'PUBLIC',
				   created_by
			FROM json_populate_record(NULL::admission_remarks, admissionremarksData)
			RETURNING admission_remarks.id INTO admissionRemarksID;
		END IF;
		END IF;
	
	RETURN admissionSubcourseID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/
/* installment_pay_manage */

CREATE OR REPLACE FUNCTION installment_pay_manage(
	admissionInstallmentsData json,
	admissionRemarksData json,
	invoiceData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionInstallmentID integer;
	branchID integer;
	mAdmissionRemarksData json;
	minvoiceData json;
	mAdmissionFees admission_fees%rowType;
	remainingPayAmount integer;
	invoiceID integer;
	createdAndUpdatedBy character varying := CAST(admissionInstallmentsData::json->>'updated_by' AS character varying);
/* ------------------------------------------------------------------------------------
	FUNCTION: admission_installments_update_manage
	DESCRIPTION 	: This function is used to update admission_installments and Add admission_remarks
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 04-October-2022
	MODIFIED BY		: Jay Dhameliya
	MODIFIED DATE	: 29-Apr-2023
	CHANGE HISTORY	:
	-----------------
	04-Oct-2022-Nirav	: Initially Created
	24-Nov-2022-Hardik	:update installment modify data added send_email_student and send_sms_parents
	05-Dec-2022-Hardik	:added installment_amount
	12-Dec-2022-Hardik : Added admission_fees modification and new entry invoice_fees and installment pay fees type wise calculation add
	14-Dec-2022-Hardik : TRUNC add and some calculation modify
    10-Jan-2023-Zenil  : Add sgst, cgst and total_text field and remove gst_amount and gst_percentage fields from invoices
	11-Jan-2023-Zenil  : Chnage total_text field name with total_tax & remove payment_type column
	16-Jan-2023-Ayush  : Add column filed rating and label for admission remarks 
	27-Jan-2023-Anita  : Added two field in invoice iscomposition and percentage
	30-Jan-2023-Zenil  : Add column filed remarks in admission_installments for remarks
	09-March-2023-Nirav: created_by and updated_by add field in admission_installments and admission_remarks and admission_fees
	                     and invoice_fees and branches and invoices create and update Time
	01-Apr-2023-Jay    : Chagne receipt number format add hardcode year 23-24.
    23-Apr-2023-Jay    : remove update invoice_no_sequence into branches and set only prefix of the invoice.
	27-Jun-2023-Jay    : update invoice_no_sequence formate.
------------------------------------------------------------------------------------*/
	
BEGIN
	IF admissionInstallmentsData::json->>'id' IS NOT NULL
	THEN		
		UPDATE admission_installments
				SET branch_id = newadmissionInstallmentsData.branch_id,
					installment_date = newadmissionInstallmentsData.installment_date,
					commitment_date = newadmissionInstallmentsData.commitment_date,
					installment_no = newadmissionInstallmentsData.installment_no,
					installment_amount = newadmissionInstallmentsData.installment_amount,
					due_amount = newadmissionInstallmentsData.due_amount,
					pay_amount = newadmissionInstallmentsData.pay_amount,
					pay_date = newadmissionInstallmentsData.pay_date,
					payment_mode = newadmissionInstallmentsData.payment_mode,
					admission_status = newadmissionInstallmentsData.admission_status,
					bank_name = newadmissionInstallmentsData.bank_name,
					bank_branch_name = newadmissionInstallmentsData.bank_branch_name,
					transaction_no = newadmissionInstallmentsData.transaction_no,
					transaction_date = newadmissionInstallmentsData.transaction_date,
					cheque_no = newadmissionInstallmentsData.cheque_no,
					cheque_date = newadmissionInstallmentsData.cheque_date,
					cheque_status = newadmissionInstallmentsData.cheque_status,
					cheque_holder_name = newadmissionInstallmentsData.cheque_holder_name,
					send_sms_student = newadmissionInstallmentsData.send_sms_student,
					send_email_parents = newadmissionInstallmentsData.send_email_parents,
					send_email_student= newadmissionInstallmentsData.send_email_student,
					send_sms_parents= newadmissionInstallmentsData.send_sms_parents,
					remarks= newadmissionInstallmentsData.remarks,
					updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admission_installments , admissionInstallmentsData) AS newadmissionInstallmentsData
			WHERE admission_installments.id = newadmissionInstallmentsData.id
			RETURNING admission_installments.id INTO admissionInstallmentID;
		branchID := CAST(admissionInstallmentsData::json->>'branch_id'  AS INTEGER);
		/*IF admissionInstallmentsData::json->>'branch_id' IS NOT NULL AND admissionInstallmentID IS NOT NULL THEN
			UPDATE branches
				SET invoice_no_sequence = ((SELECT invoice_no_sequence FROM branches WHERE id = CAST(admissionInstallmentsData::json->>'branch_id' AS INTEGER)) + 1),
					updated_by = createdAndUpdatedBy
			WHERE id = (SELECT id FROM branches WHERE id = CAST(admissionInstallmentsData::json->>'branch_id' AS INTEGER))
			RETURNING branches.id INTO branchID;
		END IF;	*/
	END IF;
	
	IF admissionInstallmentID IS NOT NULL AND branchID IS NOT NULL THEN
		FOR minvoiceData IN SELECT json_array_elements(invoiceData)
		LOOP
			IF minvoiceData::json->>'id' IS NULL OR minvoiceData::json->>'id' = '0' THEN
				INSERT INTO invoices(admission_id,branch_id,installment_id,invoice_no,invoice_date,pay_amount,sgst,cgst,total_tax,isgst,iscomposition,percentage,created_by)
					SELECT CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER),
						   branchID,
						   admissionInstallmentID,
						   (SELECT concat(code,invoice_format) FROM branches WHERE id = branchID),
						   invoice_date,
						   pay_amount,
						   sgst,
						   cgst,
                           total_tax,
                           isgst,
						   iscomposition,
						   percentage,
						   createdAndUpdatedBy
						FROM json_populate_record(NULL::invoices, minvoiceData)
						RETURNING invoices.id into invoiceID;
			END IF;				
		END LOOP;	
	END IF;	
	
	IF admissionInstallmentID IS NOT NULL AND branchID IS NOT NULL THEN
		FOR mAdmissionRemarksData IN SELECT json_array_elements(admissionRemarksData)
		LOOP
			IF mAdmissionRemarksData::json->>'id' IS NULL OR mAdmissionRemarksData::json->>'id' = '0' THEN
			    IF (admissionInstallmentsData::json->>'admission_id' IS NOT NULL AND admissionInstallmentsData::json->>'branch_id' IS NOT NULL 
				AND mAdmissionRemarksData::json->>'remarks' IS NOT NULL) THEN
					INSERT INTO admission_remarks(admission_id,branch_id,labels,rating,remarks,status,type,created_by)
						SELECT CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER),
							   CAST(admissionInstallmentsData::json->>'branch_id' AS INTEGER),
							   labels,
							   rating,
							   remarks,
							   (SELECT status FROM admissions where id = CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER)),
							   'PUBLIC',
							   createdAndUpdatedBy
							FROM json_populate_record(NULL::admission_remarks, mAdmissionRemarksData);
				END IF;				
			END IF;				
		END LOOP;
	END IF;
	
	IF (CAST(admissionInstallmentsData::json->>'pay_amount' AS INTEGER) IS NOT NULL AND CAST(admissionInstallmentsData::json->>'pay_amount' AS INTEGER)>0 AND 
	   	invoiceID IS NOT NULL) THEN
		remainingPayAmount := CAST(admissionInstallmentsData::json->>'pay_amount' AS INTEGER);
		FOR mAdmissionFees IN (select * from admission_fees where admission_id = CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER) order by fee_type_id ASC)
		LOOP
			IF (remainingPayAmount > 0) THEN 
				IF (TRUNC(mAdmissionFees.amount - mAdmissionFees.paid_amount) >0 AND(mAdmissionFees.amount - mAdmissionFees.paid_amount) <= remainingPayAmount) THEN
					INSERT INTO invoice_fees (admission_id,invoice_id,fee_type_id,amount,created_by)
					VALUES (CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER),invoiceID,mAdmissionFees.fee_type_id,(mAdmissionFees.amount - mAdmissionFees.paid_amount),createdAndUpdatedBy);
					IF (mAdmissionFees.id IS NOT NULL) THEN
						UPDATE admission_fees
						SET paid_amount = (mAdmissionFees.paid_amount + (mAdmissionFees.amount - mAdmissionFees.paid_amount)),
							updated_by = createdAndUpdatedBy
						where admission_fees.fee_type_id = mAdmissionFees.fee_type_id AND admission_fees.admission_id = mAdmissionFees.admission_id;
					END IF;
					remainingPayAmount := (remainingPayAmount-(mAdmissionFees.amount - mAdmissionFees.paid_amount));
				ELSIF (TRUNC(mAdmissionFees.amount - mAdmissionFees.paid_amount) >0 AND(mAdmissionFees.amount - mAdmissionFees.paid_amount) >= remainingPayAmount) THEN
					INSERT INTO invoice_fees (admission_id,invoice_id,fee_type_id,amount,created_by)
					VALUES (CAST(admissionInstallmentsData::json->>'admission_id' AS INTEGER),invoiceID,mAdmissionFees.fee_type_id,remainingPayAmount,createdAndUpdatedBy);
					IF (mAdmissionFees.id IS NOT NULL) THEN
						UPDATE admission_fees
						SET paid_amount = (mAdmissionFees.paid_amount + remainingPayAmount),
							updated_by = createdAndUpdatedBy
						where admission_fees.fee_type_id = mAdmissionFees.fee_type_id AND admission_fees.admission_id = mAdmissionFees.admission_id;
					END IF;
					remainingPayAmount := (remainingPayAmount -(mAdmissionFees.amount - mAdmissionFees.paid_amount));
				END IF;
			END IF;
		END LOOP;
	END IF;
	
	RETURN admissionInstallmentID;
END
$$;

/*--------------------------------------------------------------------------------------------------------------------------*/
/* create function manage shining_sheet_topic_manage */

CREATE OR REPLACE FUNCTION shining_sheet_topic_manage(
	shiningSheetTopicData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	shiningSheetTopicID integer;
	mShiningSheetTopicData json;
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: shining_sheet_topic_manage
	DESCRIPTION 	: This function is used to create shining_sheet_topic
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 19-October-2022
	MODIFIED BY		: 
	MODIFIED DATE	: 
	CHANGE HISTORY	:
	19-October-2022-Nirav: Initially Created
	------------------------------------------------------------------------------------*/
	
BEGIN
	FOR mShiningSheetTopicData IN SELECT json_array_elements(CAST(shiningSheetTopicData::json->> 'shining_sheet_topic' AS json))
	LOOP
		IF mShiningSheetTopicData::json->>'id' IS NULL OR mShiningSheetTopicData::json->>'id' = '0' THEN
			INSERT INTO shining_sheet_topic(subcourse_id,name,num_of_project,marks,duration)
				SELECT subcourse_id,name,num_of_project,marks,duration 
					FROM json_populate_record(NULL::shining_sheet_topic, mShiningSheetTopicData)
					RETURNING shining_sheet_topic.id INTO shiningSheetTopicID;
		ELSE
			UPDATE shining_sheet_topic
				SET subcourse_id = CAST(mShiningSheetTopicData::json->>'subcourse_id' AS INT),
					name = CAST(mShiningSheetTopicData::json->>'name' AS CHARACTER VARYING),
					num_of_project = CAST(mShiningSheetTopicData::json->>'num_of_project' AS INT),
					marks = CAST(mShiningSheetTopicData::json->>'marks' AS INT),
					duration = CAST(mShiningSheetTopicData::json->>'duration' AS NUMERIC)
				FROM json_populate_record(NULL::shining_sheet_topic , mShiningSheetTopicData) AS json
				WHERE shining_sheet_topic.id = CAST(mShiningSheetTopicData::json->>'id' AS INT)
				RETURNING shining_sheet_topic.id INTO shiningSheetTopicID;
		END IF;
	END LOOP;
	RETURN shiningSheetTopicID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/

CREATE OR REPLACE FUNCTION subcourse_topic_and_sub_topics_manage(
	subCourseTopicData json,
	SubTopicsData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	subCourseTopicID integer;
	mSubTopics json;
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: subcourse_topic_and_sub_topics_manage
	DESCRIPTION 		: This function is used to add and update subcourse_topics and sub_topics
	CREATED BY    		: Nirav Lakhani
	CREATED DATE 		: 27-October-2022
	MODIFIED BY			: Nirav Lakhani
	MODIFIED DATE		: 07-March-2023
	CHANGE HISTORY	:
	27-October-2022-Nirav: Initially Created
	3-November-2022-Anita: subTopic added two fields(std_res_link,faculty_res_link)
	1-March--2023-Nirav: subTopic update time add subcourseTopicId
	07-March-2023-Nirav: created_by and updated_by add field in subcourse_topic and sub_topics create and update Time
	------------------------------------------------------------------------------------*/
	
BEGIN
	IF subCourseTopicData::json->>'id' IS NULL OR subCourseTopicData::json->>'id' = '0' THEN		
			INSERT INTO subcourse_topics(subcourse_id,name,sequence,type,duration,marks,created_by)
			SELECT subcourse_id,name,sequence,type,duration,marks,created_by
			FROM json_populate_record(NULL::subcourse_topics, subCourseTopicData)
			RETURNING id INTO subCourseTopicID;
	ELSE 
		UPDATE subcourse_topics
				SET subcourse_id = newSubCourseTopic.subcourse_id,
					name = newSubCourseTopic.name,
					sequence = newSubCourseTopic.sequence,
					type = newSubCourseTopic.type,
					duration = newSubCourseTopic.duration,
					marks = newSubCourseTopic.marks,
					updated_by = newSubCourseTopic.updated_by
			FROM json_populate_record(NULL::subcourse_topics , subCourseTopicData) AS newSubCourseTopic
			WHERE subcourse_topics.id = newSubCourseTopic.id
			RETURNING subcourse_topics.id INTO subCourseTopicID;
	END IF;
	IF subCourseTopicID IS NOT NULL THEN
		DELETE FROM sub_topics 
		WHERE topic_id = subCourseTopicID 
		AND id NOT IN (
			SELECT id FROM sub_topics WHERE id IN (
				select id::INTEGER from json_populate_recordset(null::sub_topics,SubTopicsData)
			)
		);
		FOR mSubTopics IN SELECT json_array_elements(SubTopicsData)
		LOOP
			IF mSubTopics::json->>'id' IS NULL OR mSubTopics::json->>'id' = '0' THEN
				INSERT INTO sub_topics(topic_id,description,sequence,std_res_link,faculty_res_link,created_by)
					SELECT subCourseTopicID,description,sequence,std_res_link,faculty_res_link,created_by 
						FROM json_populate_record(NULL::sub_topics, mSubTopics);
			ELSE
				UPDATE sub_topics
				SET topic_id = subCourseTopicID,
					description = newSubTopic.description,
					sequence = newSubTopic.sequence,
					std_res_link = newSubTopic.std_res_link,
					faculty_res_link = newSubTopic.faculty_res_link,
					updated_by = newSubTopic.updated_by
				FROM json_populate_record(NULL::sub_topics , mSubTopics) AS newSubTopic
				WHERE sub_topics.id = newSubTopic.id
				AND sub_topics.topic_id = subCourseTopicID;
			END IF;
		END LOOP;	
	END IF;	
	RETURN subCourseTopicID;
END
$$;
/*--------------------------------------------------------------------------------------------------------------------------*/
/* create new function manage admission tranfer */

CREATE OR REPLACE FUNCTION admission_transfer_manage(
    admissionData json,
    admissionTransferData json,
    admissionRemarkData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionTransferID integer;
	admissionID integer;
	admissionRemarksID integer;
	createdAndUpdatedBy character varying := CAST(admissionTransferData::json->>'created_by' AS character varying);
	
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: admission_transfer_manage
	DESCRIPTION 	: This function is used to add admission_transfer 
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 28-October-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 10-March-2023
	CHANGE HISTORY	:
	28-October-2022-Nirav: Initially Created
	22-February-2023-Krishna : Admission_remark add
	24-February-2023-krishna :Admission_Remark reting defult 0 add
	10-March-2023-Nirav: created_by and updated_by add field in admission_transfer and admissions and admission_remarks create and update Time
	------------------------------------------------------------------------------------*/
	
BEGIN
		
		UPDATE admissions
				SET status = newAdmission.status,
					updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionData) AS newAdmission
			WHERE admissions.id = newAdmission.id
			RETURNING admissions.id INTO admissionID;
			
	 IF admissionID IS NOT NULL THEN	
		IF admissionTransferData::json->>'id' IS NULL OR admissionTransferData::json->>'id' = '0' THEN
			INSERT INTO admission_transfer(admission_id,branch_in_id,branch_out_id,subcourse_id,batch_id,comment,status,created_by)
			SELECT admissionID,branch_in_id,branch_out_id,subcourse_id,batch_id,comment,status,createdAndUpdatedBy
			FROM json_populate_record(NULL::admission_transfer, admissionTransferData)
			RETURNING id INTO admissionTransferID;
		END IF;
		END IF;
	
	IF admissionRemarkData::json->>'remarks' IS NOT NULL THEN
			INSERT INTO admission_remarks(admission_id,branch_id,labels,rating,remarks,status,type,created_by)
			SELECT admissionID,
				   (SELECT branch_id FROM admissions where id = admissionID),
				   'Admission_Transfer',
				   '0',
				   remarks,
				   (SELECT status FROM admissions where id = admissionID),
				   'PUBLIC',
				   createdAndUpdatedBy
			FROM json_populate_record(NULL::admission_remarks, admissionRemarkData)
			RETURNING admission_remarks.id INTO admissionRemarksID;
		END IF;
	
	RETURN admissionTransferID;
END 
$$;

/*--------------------------------------------------------------------------------------------------------------------------*/
/* create function Admission transform status update  */

CREATE OR REPLACE FUNCTION admission_transfer_status_update_manage(
	admissionData json,
	admissionTransferStatusUpdateData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$

DECLARE
	admissionTransferID integer;
	admissionID integer;
	createdAndUpdatedBy character varying := CAST(admissionTransferStatusUpdateData::json->>'updated_by' AS character varying);

	/* ------------------------------------------------------------------------------------
	FUNCTION: admission_transfer_status_update_manage
	DESCRIPTION 	: This function is used to update admission_transfer and admission and admission_subcourse
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 2-November-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 10-March-2023
	CHANGE HISTORY	:
	2-Oct-2022-Nirav  : Initially Created
    10-Dec-2022-Nirav : change admission transfer status REJECT and ABOT time update data in admission table
	10-March-2023-Nirav: created_by and updated_by add field in admission_transfer and admissions and admission_subcourse create and update Time
	------------------------------------------------------------------------------------*/
	
BEGIN
	IF admissionTransferStatusUpdateData::json->>'status' = 'ABOT' THEN	
		UPDATE admission_transfer
				SET comment = newAdmissionTransferStatusUpdateData.comment,
					status = newAdmissionTransferStatusUpdateData.status,
					updated_by = createdAndUpdatedBy
				FROM json_populate_record(NULL::admission_transfer , admissionTransferStatusUpdateData) AS newAdmissionTransferStatusUpdateData
				WHERE admission_transfer.id = newAdmissionTransferStatusUpdateData.id
				RETURNING admission_transfer.id INTO admissionTransferID;
	ELSIF admissionTransferStatusUpdateData::json->>'status' = 'REJECT' THEN
		UPDATE admission_transfer
				SET admission_id = newAdmissionTransferStatusUpdateData.admission_id,
					branch_in_id = newAdmissionTransferStatusUpdateData.branch_in_id,
					branch_out_id = newAdmissionTransferStatusUpdateData.branch_out_id,
					rejected_comment = newAdmissionTransferStatusUpdateData.rejected_comment,
					rejected_date = newAdmissionTransferStatusUpdateData.rejected_date,
					status = newAdmissionTransferStatusUpdateData.status,
					updated_by = createdAndUpdatedBy
				FROM json_populate_record(NULL::admission_transfer , admissionTransferStatusUpdateData) AS newAdmissionTransferStatusUpdateData
				WHERE admission_transfer.id = newAdmissionTransferStatusUpdateData.id
				RETURNING admission_transfer.id INTO admissionTransferID;
				
		IF admissionTransferID IS NOT NULL THEN	
			UPDATE admissions
				SET status = newAdmission.status,
					updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionData) AS newAdmission
			WHERE admissions.id = newAdmission.id
			RETURNING admissions.id INTO admissionID;
		END IF;	
	ELSIF admissionTransferStatusUpdateData::json->>'status' = 'ACCEPT' THEN	
		UPDATE admission_transfer
			SET comment = newAdmissionTransferStatusUpdateData.comment,
				status = newAdmissionTransferStatusUpdateData.status,
				updated_by = createdAndUpdatedBy	
				FROM json_populate_record(NULL::admission_transfer , admissionTransferStatusUpdateData) AS newAdmissionTransferStatusUpdateData
				WHERE admission_transfer.id = newAdmissionTransferStatusUpdateData.id
				RETURNING admission_transfer.id INTO admissionTransferID;
		
		IF admissionTransferID IS NOT NULL THEN	
			UPDATE admissions
				SET branch_id = (SELECT branch_in_id FROM admission_transfer WHERE admission_id = newAdmission.id ORDER BY id DESC LIMIT 1),
					status = newAdmission.status,
					updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionData) AS newAdmission
			WHERE admissions.id = newAdmission.id
			RETURNING admissions.id INTO admissionID;
			
			IF admissionID IS NOT NULL THEN
					UPDATE admission_subcourse
							SET batch_id = newAdmissionTransferStatusUpdateData.batch_id,
								subcourse_status = 'ONGOING',
								updated_by = createdAndUpdatedBy
							FROM json_populate_record(NULL::admission_transfer , admissionTransferStatusUpdateData) AS newAdmissionTransferStatusUpdateData	
					WHERE admission_subcourse.admission_id = admissionID AND admission_subcourse.subcourse_id = newAdmissionTransferStatusUpdateData.subcourse_id;
			END IF;	
		END IF;			
	END IF;
	
	RETURN admissionTransferID;
END
$$;



/***************************************** Admission subcourse modification **********************/  

CREATE OR REPLACE FUNCTION admission_course_modification_manage(
	admissionSubcourseData json,
	admissionInstallmentsData json,
	admissionsData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionID integer;
	mAdmissionSubcourseData json;
	mAdmissionInstallmentsData json;
	admissioninstallmentID INTEGER;
	admissionInstallmentRemoveIDS INTEGER[];
	admissionInstallmentRemoveID INTEGER;
	admissionInstallmetDueAmount numeric := CAST(admissionsData::json->>'payable_amount' AS NUMERIC);
	admissionInstallmentData admission_installments%rowType;
	removingingInstallmentDueAmount NUMERIC;
	createdAndUpdatedBy character varying := CAST(admissionsData::json->>'updated_by' as character varying);
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: admission_course_modification_manage
	DESCRIPTION 	: This function is used to add admission_subcourse and admission_installments and update admissions
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 04-November-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 10-March-2023
	CHANGE HISTORY	:
	-----------------
	04-Nov-2022-Nirav	: Initially Created
	28-Nov-2022-Hardik	: admission subcourse status add
	30-Nov-2022-Hardik 	: admission_installments status add
	05-Dec-2022-Nirav	: Correct installment calucation for admission_installments while add or remove it
	07-Feb-2023-Zenil   : Change Admission Field Name tuation_fees to payable_amount
	09-Feb-2023-Zenil	: Add installment_amount in admission_installments and update installment amount
	14-Feb-2023-Nirav	: Add Condition insert admision sub course data, add functionaliy delete subcourse and add condition admission insert
	09-March-2023-Nirav: created_by and updated_by add field in admission_subcourse and admissions and admission_installments create and update Time
	------------------------------------------------------------------------------------*/
BEGIN
	IF ((SELECT payable_amount FROM admissions WHERE id = CAST(admissionsData::json->>'id' AS INTEGER)) <= (CAST(admissionsData::json->>'payable_amount' AS NUMERIC))) THEN
		UPDATE admissions
			SET payable_amount = newadmissionsData.payable_amount,
				no_of_installment = newadmissionsData.no_of_installment,
				updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionsData) AS newadmissionsData
			WHERE admissions.id = newadmissionsData.id
			RETURNING admissions.id INTO admissionID;
		IF admissionID IS NOT NULL THEN
			FOR mAdmissionSubcourseData IN SELECT json_array_elements(admissionSubcourseData)
			LOOP
				IF mAdmissionSubcourseData::json->>'course_category' IS NOT NULL THEN
						INSERT INTO admission_subcourse(admission_id,course_id,subcourse_id,package_id,batch_id,user_id,course_category,subcourse_status,
														assigned_date,completed_date,is_starting_course,created_by,created_date,updated_by,updated_date,total,comment)
							SELECT admissionID,course_id,subcourse_id,package_id,batch_id,user_id,course_category,'UP_COMING',
								   assigned_date,completed_date,is_starting_course,createdAndUpdatedBy,created_date,updated_by,updated_date,total,comment 
								FROM json_populate_record(NULL::admission_subcourse, mAdmissionSubcourseData);
				ELSE 
					DELETE FROM admission_subcourse 
					WHERE admission_id = CAST(admissionsData::json->>'id' AS INTEGER) AND subcourse_id = CAST(mAdmissionSubcourseData::json->>'subcourse_id' AS INTEGER);
				END IF;
			END LOOP;
				FOR mAdmissionInstallmentsData IN SELECT json_array_elements(admissionInstallmentsData)
				LOOP
					IF mAdmissionInstallmentsData::json->>'branch_id' IS NOT NULL THEN
						INSERT INTO admission_installments(admission_id,branch_id,installment_date,commitment_date,installment_no,due_amount,status,installment_amount,created_by)
							SELECT admissionID,branch_id,installment_date,commitment_date,installment_no,due_amount,'UNPAID',installment_amount,createdAndUpdatedBy
								FROM json_populate_record(NULL::admission_installments, mAdmissionInstallmentsData);			
					END IF;				
				END LOOP;
		END IF;

	  ELSIF ((SELECT payable_amount FROM admissions WHERE id = CAST(admissionsData::json->>'id' AS INTEGER)) > admissionInstallmetDueAmount) THEN
	  		removingingInstallmentDueAmount := ((SELECT payable_amount FROM admissions WHERE id = CAST(admissionsData::json->>'id' AS INTEGER)) - admissionInstallmetDueAmount);
			FOR admissionInstallmentData IN SELECT * from admission_installments where admission_id = CAST(admissionsData::json->>'id' AS INTEGER) ORDER BY installment_date DESC
			LOOP	
			
				FOR mAdmissionSubcourseData IN SELECT json_array_elements(admissionSubcourseData)
				LOOP
					DELETE FROM admission_subcourse 
					WHERE admission_id = CAST(admissionsData::json->>'id' AS INTEGER) AND subcourse_id = CAST(mAdmissionSubcourseData::json->>'subcourse_id' AS INTEGER);			
				END LOOP;
				IF (admissionInstallmentData.due_amount >= removingingInstallmentDueAmount) THEN
					UPDATE admission_installments
					   SET due_amount = admissionInstallmentData.due_amount - removingingInstallmentDueAmount,
					   	   installment_amount = admissionInstallmentData.installment_amount - removingingInstallmentDueAmount,
						   updated_by = createdAndUpdatedBy
					   WHERE admission_installments.admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))
					   AND id = admissionInstallmentData.id
					   RETURNING admission_installments.id INTO admissioninstallmentID;
					   
					removingingInstallmentDueAmount := admissionInstallmentData.due_amount - removingingInstallmentDueAmount;
					IF(removingingInstallmentDueAmount = 0) THEN 
						DELETE FROM admission_installments WHERE id = admissionInstallmentData.id;
					END IF;
					EXIT WHEN admissioninstallmentID > 0;
				ELSE	      
					removingingInstallmentDueAmount := removingingInstallmentDueAmount - admissionInstallmentData.due_amount;
					admissionInstallmentRemoveIDS := array_append(admissionInstallmentRemoveIDS, admissionInstallmentData.id); 
					IF (removingingInstallmentDueAmount >= 0) THEN	
						IF admissionInstallmentRemoveIDS IS NOT NULL THEN
							FOREACH admissionInstallmentRemoveID IN ARRAY admissionInstallmentRemoveIDS
							 LOOP
								 UPDATE admission_installments
									   SET due_amount = admissionInstallmentData.due_amount - removingingInstallmentDueAmount,
									   	   updated_by = createdAndUpdatedBy	
									   WHERE admission_installments.admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))
									   AND id IN(SELECT id FROM admission_installments WHERE id NOT IN(admissionInstallmentRemoveID) ORDER BY id DESC LIMIT 1)
									   RETURNING admission_installments.id INTO admissioninstallmentID;

									   DELETE FROM admission_installments WHERE id = admissionInstallmentRemoveID;	   
							 END LOOP;
						END IF;	
					END IF;
				END IF;	
			END LOOP;
			IF admissioninstallmentID IS NOT NULL THEN
			 UPDATE admissions
				SET admission_amount = CAST(admissionsData::json->>'admission_amount' AS NUMERIC),
				    payable_amount = CAST(admissionsData::json->>'payable_amount' AS NUMERIC),
					no_of_installment = (SELECT count(id) from admission_installments where admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))),
					updated_by = createdAndUpdatedBy
				FROM json_populate_record(NULL::admissions , admissionsData) AS newadmissionsData
				WHERE admissions.id = newadmissionsData.id
				RETURNING admissions.id INTO admissionID;
			END IF;
	END IF;
	RETURN admissionID;	
END
$$;


/* create new function add faculty and student attendance */


CREATE OR REPLACE FUNCTION batch_faculty_and_batch_student_attendance_manage(
	batchFacultyAndStudentData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	batchFacultyID integer; 
	batchStudentID integer;
	mbatchFacultyData json;
	mbatchStudentData json;
	createdAndUpdatedBy character varying;
	admissionRemarksID integer;
	isRemarks boolean:= true;
	
	/* ------------------------------------------------------------------------------------
	FUNCTION        : batch_faculty_and_batch_student_attendance_manage
	DESCRIPTION 	: This function is used to add and update batch_faculty_attendances and batch_student_attendances
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 14-November-2022
	MODIFIED BY		: Dixit Italiya
	MODIFIED DATE	: 12-may-2023
	CHANGE HISTORY	:
	14-Nov-2022-Nirav: Initially Created
	13-Dec-2022-Nirav: add insert and update time type in batch_faculty_attendatnce table
	5-january-2023-Ayush: add filed is_present insert time in batch student attendances
	23-February-2023 Krishna : batch_faculty_attendance update time value change batch_student_attendance
							   update time remove subcourse_id
	10-March-2023-Nirav: created_by and updated_by add field in batch_faculty_attendances and batch_student_attendances and  create and update Time
	15-April-2023-Nirav: batch_faculty_attendance and batch_student_attendance create and update multiple data
	15-April-2023-Nirav: Add condition for created_by and update by
	05-May-2023-Nirav: Add remarks in admission_remarks table
	12-may-2023-Dixit: condion add for remarks only once looping
	------------------------------------------------------------------------------------*/
	
BEGIN
	FOR mbatchFacultyData IN SELECT json_array_elements(batchFacultyAndStudentData)
	LOOP
		IF CAST(mbatchFacultyData::json->>'created_by' AS character varying) IS NOT NULL THEN
			createdAndUpdatedBy := CAST(mbatchFacultyData::json->>'created_by' AS character varying);
		ELSE
			createdAndUpdatedBy := CAST(mbatchFacultyData::json->>'updated_by' AS character varying);			
		END IF;
		IF mbatchFacultyData::json->>'id' IS NULL OR mbatchFacultyData::json->>'id' = '0' THEN
			INSERT INTO batch_faculty_attendances(batch_singing_sheet_id,user_id,actual_date,start_time,end_time,type,created_by)
			SELECT batch_singing_sheet_id,user_id,actual_date,start_time,end_time,type,createdAndUpdatedBy
			FROM json_populate_record(NULL::batch_faculty_attendances, mbatchFacultyData)
			RETURNING id INTO batchFacultyID;

		ELSE 
			UPDATE batch_faculty_attendances
					SET batch_singing_sheet_id = CAST(mbatchFacultyData::json->>'batch_singing_sheet_id' AS INTEGER),
						user_id = CAST(mbatchFacultyData::json->>'user_id' AS INTEGER),
						actual_date = CAST(mbatchFacultyData::json->>'actual_date' AS date),
						start_time = CAST(mbatchFacultyData::json->>'start_time' AS NUMERIC),
						end_time = CAST(mbatchFacultyData::json->>'end_time' AS NUMERIC),
						type = CAST(mbatchFacultyData::json->>'type' AS session_type),
						updated_by = createdAndUpdatedBy
				FROM json_populate_record(NULL::batch_student_attendances , mbatchFacultyData) AS newBatchFaculty
				WHERE batch_faculty_attendances.id = newBatchFaculty.id
				RETURNING batch_faculty_attendances.id INTO batchFacultyID;
		END IF;
		
		IF batchFacultyID IS NOT NULL THEN
			FOR mbatchStudentData IN SELECT json_array_elements(CAST(mbatchFacultyData::json->> 'batch_student_attendances' AS json))
			LOOP
				IF mbatchStudentData::json->>'id' IS NULL OR mbatchStudentData::json->>'id' = '0' THEN
						INSERT INTO batch_student_attendances(batch_singing_sheet_id,batch_faculty_attendance_id,admission_id,is_present,feedback,remarks,created_by)
						SELECT batch_singing_sheet_id,batchFacultyID,admission_id,is_present,feedback,remarks,createdAndUpdatedBy 
							FROM json_populate_record(NULL::batch_student_attendances, mbatchStudentData)
							RETURNING batch_student_attendances.id INTO batchStudentID;
				ELSE
					UPDATE batch_student_attendances
					SET
						batch_singing_sheet_id = newBatchStudents.batch_singing_sheet_id,
						batch_faculty_attendance_id = newBatchStudents.batch_faculty_attendance_id,
						admission_id = newBatchStudents.admission_id,
						is_present = newBatchStudents.is_present,
						feedback = newBatchStudents.feedback,
						remarks = newBatchStudents.remarks,
						updated_by = createdAndUpdatedBy
					FROM json_populate_record(NULL::batch_student_attendances , mbatchStudentData) AS newBatchStudents
					WHERE batch_student_attendances.id = newBatchStudents.id
					RETURNING batch_student_attendances.id INTO batchStudentID;
				END IF;
				
				IF mbatchStudentData::json->>'remarks' IS  NOT NULL AND mbatchStudentData::json->>'remarks' != '' AND isRemarks IS true THEN
					INSERT INTO admission_remarks(admission_id,branch_id,labels,rating,remarks,status,type,created_by)
					VALUES     (CAST(mbatchStudentData::json->>'admission_id' as integer),
								(SELECT branch_id FROM admissions where id = (CAST(mbatchStudentData::json->>'admission_id' as integer)) ORDER BY id DESC LIMIT 1),
								'STUDENT_ATTENDANCE',
								'1',
								CAST(mbatchStudentData::json->>'remarks' as CHARACTER VARYING),
								(SELECT status FROM admissions WHERE id = (CAST(mbatchStudentData::json->>'admission_id' as integer)) ORDER BY id DESC LIMIT 1),
								'PUBLIC',
								createdAndUpdatedBy)
					RETURNING admission_remarks.id INTO admissionRemarksID;
				END IF;					
			END LOOP;
		END IF;
        isRemarks:=false;
	END LOOP;
	RETURN batchFacultyID;
END
$$;

/* create new function add expence with payment_mode */
DROP FUNCTION IF EXISTS payment_mode;

CREATE OR REPLACE FUNCTION expense_manage(
	expenseData json
)
RETURNS INTEGER
LANGUAGE 'plpgsql'
AS $$

DECLARE
 expenseID integer;
/*------------------------------------------------------------------------------------
	FUNCTION: expense_manage
 	DESCRIPTION 	: This function is used for expense_manage
 	CREATED BY    	: krishna vasoya
 	CREATED DATE 	: 9-Novembar-2022
 	MODIFIED BY		: Krishna Vasoya
 	MODIFIED DATE	: 30-March-2023
 	CHANGE HISTORY	:
 	09-Nov-2022-krishna	: Initially Created
	24-Nov-2022-krishna	: Added paid_by and status 
	13-Dec-2022-Anita	: category_id and subcategory_id and paycayegories field removed 
	27-Dec-2022-krishna	:  expense_master_id add in function 
	30-Dec-2022-krishna	:  payable_for STUDENT add LIMIT 1 and branch_id add in payable_for conditional
	02-Feb-2023-Nirav	: Payment_mode type all data create properly
	27-Feb-2023-krishna : all condistion in add value is category_id and subcategory_id
	10-March-2023-Nirav	: created_by add field in expense create Time
	29-March-2023-Ayush	: expense_master_id remove and department_id add in insert and update time
	30-March-2023-Krishna : info field remove in expense
----------------------------------------------------------------------------------------*/

BEGIN
    IF  (((SELECT name FROM payment_mode WHERE name= CAST(expenseData::json->>'payment_mode' as character varying))='CHEQUE')OR
		 ((SELECT name FROM payment_mode WHERE name= CAST(expenseData::json->>'payment_mode' as character varying))='DD')) THEN
		   INSERT INTO expense(admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,bank_name,bank_branch_name,cheque_no,cheque_date,cheque_status,cheque_holder_name,
							  paid_by,status,category_id,subcategory_id,created_by,department_id)
		    SELECT admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,bank_name,bank_branch_name,cheque_no,cheque_date,cheque_status,cheque_holder_name,
							  paid_by,status,category_id,subcategory_id,created_by,department_id
		    FROM json_populate_record(NULL::expense, expenseData) RETURNING expense.id INTO expenseID;  
	ELSIF
		((SELECT name FROM payment_mode WHERE name= CAST(expenseData::json->>'payment_mode' as character varying))='CASH') THEN
	     INSERT INTO expense(admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,paid_by,status,category_id,subcategory_id,created_by,department_id)
		    SELECT admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,paid_by,status,category_id,subcategory_id,created_by,department_id
		    FROM json_populate_record(NULL::expense, expenseData) RETURNING expense.id INTO expenseID;
	ELSIF
		((SELECT name FROM payment_mode WHERE name= CAST(expenseData::json->>'payment_mode' as character varying))='NEFT/IMPS') THEN
	      INSERT INTO expense(admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,bank_name,bank_branch_name,cheque_no,cheque_date,cheque_holder_name,
							  paid_by,status,category_id,subcategory_id,created_by,department_id)
		    SELECT admission_id,branch_id,paying_amount,full_name,payable_for,
							  pay_date,comment,payment_mode,bank_name,bank_branch_name,cheque_no,cheque_date,cheque_holder_name,
							  paid_by,status,category_id,subcategory_id,created_by,department_id
		    FROM json_populate_record(NULL::expense, expenseData) RETURNING expense.id INTO expenseID;  
    ELSIF	
		((SELECT payable_for FROM expense WHERE payable_for= CAST(expenseData::json->>'payable_for' as pay_for_type)LIMIT 1)='STUDENT') THEN
	      INSERT INTO expense(admission_id,branch_id,paying_amount,full_name,payable_for,
							pay_date,comment,payment_mode,bank_name,bank_branch_name,transaction_no,transaction_date,
							cheque_no,cheque_date,cheque_holder_name,paid_by,status,cheque_status,category_id,subcategory_id,created_by,department_id)
		    SELECT admission_id,branch_id,paying_amount,full_name,payable_for,
							pay_date,comment,payment_mode,bank_name,bank_branch_name,transaction_no,transaction_date,
							cheque_no,cheque_date,cheque_holder_name,paid_by,status,cheque_status,category_id,subcategory_id,created_by,department_id
		    FROM json_populate_record(NULL::expense, expenseData) RETURNING expense.id INTO expenseID;
	ELSE
		INSERT INTO expense(admission_id,branch_id,paying_amount,full_name,payable_for,
							pay_date,comment,payment_mode,bank_name,bank_branch_name,transaction_no,transaction_date,
							cheque_no,cheque_date,cheque_holder_name,paid_by,status,cheque_status,category_id,subcategory_id,created_by,department_id)
		    SELECT admission_id,branch_id,paying_amount,full_name,payable_for,
							pay_date,comment,payment_mode,bank_name,bank_branch_name,transaction_no,transaction_date,
							cheque_no,cheque_date,cheque_holder_name,paid_by,status,cheque_status,category_id,subcategory_id,created_by,department_id
		    FROM json_populate_record(NULL::expense, expenseData) RETURNING expense.id INTO expenseID;
	END IF;
	return expenseID;
END
$$;

---------------------------------------------------------------------------------------------------
/* change template shining sheet topic tables after create and update methods */
CREATE OR REPLACE FUNCTION template_shining_sheet_manage(
	templateShiningSheetData json,
	templateShiningSheetTopicData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	templateID integer;
	templateShiningSheetTopicID integer;
	mtemplateShiningSheetTopic json;
	mSubTopics json;
	createdBy character varying := CAST(templateShiningSheetData::json->>'created_by' AS character varying);
	updatedBy character varying := CAST(templateShiningSheetData::json->>'updated_by' AS character varying);
/* -------------------------------------------------------------------------------------------------------------------
	FUNCTION: template_shining_sheet_manage
	DESCRIPTION 		: This function is used to add and update template_shining_sheet and template_shining_sheet_topics
	CREATED BY    		: Ayush Donga
	CREATED DATE 		: 23-Nov-2022
	MODIFIED BY			: Nirav Lakhani
	MODIFIED DATE		: 10-March-2023
	CHANGE HISTORY		:
	----------------- 
	23-Nov-2022-Ayush	: Initially Created
	28-Nov-2022-Nirav	: Chagne whole function code
	22-Dec-2022-Nirav	: change create and update method add multipl template topic and sub-topics
	28-Dec-2022-Nirav	: change update time remove delete functionality add create time status
    30-Jan-2023-Anita   : template create status bydefault true set
	10-March-2023-Nirav: created_by and updated_by add field in template_shining_sheet and template_shining_sheet_topics and  create and update Time					   
--------------------------------------------------------------------------------------------------------------------*/
BEGIN
	IF templateShiningSheetData::json->>'id' IS NULL OR templateShiningSheetData::json->>'id' = '0' THEN		
			INSERT INTO template_shining_sheet(subcourse_id,name,description,status,created_by)
			SELECT subcourse_id,name,description,true,createdBy
			FROM json_populate_record(NULL::template_shining_sheet, templateShiningSheetData)
			RETURNING id INTO templateID;
	ELSE 
		UPDATE template_shining_sheet
				SET subcourse_id = newTemplateShiningSheetData.subcourse_id,
					name = newTemplateShiningSheetData.name,
					description = newTemplateShiningSheetData.description,
					status = newTemplateShiningSheetData.status,
					updated_by = updatedBy
			FROM json_populate_record(NULL::template_shining_sheet , templateShiningSheetData) AS newTemplateShiningSheetData
			WHERE template_shining_sheet.id = newTemplateShiningSheetData.id
			RETURNING template_shining_sheet.id INTO templateID;
	END IF;
	IF templateID IS NOT NULL THEN
		FOR mtemplateShiningSheetTopic IN SELECT json_array_elements(templateShiningSheetTopicData)
		LOOP
			IF mtemplateShiningSheetTopic::json->>'id' IS NULL OR mtemplateShiningSheetTopic::json->>'id' = '0' THEN
				INSERT INTO template_shining_sheet_topics(template_singing_sheet_id,name,description,sequence,type,duration,marks,status,created_by)
						VALUES(
							templateID,
							CAST(mtemplateShiningSheetTopic::json->>'name' AS character varying),
							CAST(mtemplateShiningSheetTopic::json->>'description' AS text),
							CAST(mtemplateShiningSheetTopic::json->>'sequence' AS numeric),
							CAST(mtemplateShiningSheetTopic::json->>'type' AS subcourse_topic_type),
							CAST(mtemplateShiningSheetTopic::json->>'duration' AS numeric),
							CAST(mtemplateShiningSheetTopic::json->>'marks' AS numeric),
							CAST(mtemplateShiningSheetTopic::json->>'status' AS boolean),
							createdBy
						)	
						RETURNING template_shining_sheet_topics.id INTO templateShiningSheetTopicID;
			ELSE
				UPDATE template_shining_sheet_topics
				SET name = CAST(mtemplateShiningSheetTopic::json->>'name' AS character varying),
					description = CAST(mtemplateShiningSheetTopic::json->>'description' AS text),
					sequence = CAST(mtemplateShiningSheetTopic::json->>'sequence' AS numeric),
					type = CAST(mtemplateShiningSheetTopic::json->>'type' AS subcourse_topic_type),
					duration = CAST(mtemplateShiningSheetTopic::json->>'duration' AS numeric),
					marks = CAST(mtemplateShiningSheetTopic::json->>'marks' AS numeric),
					status = CAST(mtemplateShiningSheetTopic::json->>'status' AS boolean),
					updated_by = updatedBy
				FROM json_populate_record(NULL::template_shining_sheet_topics , mtemplateShiningSheetTopic) AS newTemplateshiningsheetTopic
				WHERE template_shining_sheet_topics.id = newTemplateshiningsheetTopic.id
				AND template_shining_sheet_topics.template_singing_sheet_id = templateID
				RETURNING template_shining_sheet_topics.id INTO templateShiningSheetTopicID;
			END IF;
			
			IF templateShiningSheetTopicID IS NOT NULL THEN
				FOR mSubTopics IN SELECT json_array_elements(CAST(mtemplateShiningSheetTopic-> 'sub_topics' AS json))
				LOOP
					IF mSubTopics::json->>'id' IS NULL OR mSubTopics::json->>'id' = '0' THEN
						INSERT INTO template_shining_sheet_topics(template_singing_sheet_id,parent_id,description,sequence,duration,status,created_by)
								VALUES(
									templateID,
									(SELECT id FROM template_shining_sheet_topics WHERE template_singing_sheet_id = templateID 
									 AND parent_id is null ORDER BY id DESC LIMIT 1),
									CAST(mSubTopics::json->>'description' AS text),
									CAST(mSubTopics::json->>'sequence' AS numeric),
									CAST(mSubTopics::json->>'duration' AS numeric),
									CAST(mSubTopics::json->>'status' AS boolean),
									createdBy
								)	
								RETURNING template_shining_sheet_topics.id INTO templateShiningSheetTopicID;

					ELSE
						UPDATE template_shining_sheet_topics
						SET description = CAST(mSubTopics::json->>'description' AS text),
							sequence = CAST(mSubTopics::json->>'sequence' AS numeric),
							duration = CAST(mSubTopics::json->>'duration' AS numeric),
							status = CAST(mSubTopics::json->>'status' AS boolean),
							updated_by = updatedBy
						FROM json_populate_record(NULL::template_shining_sheet_topics , mSubTopics) AS newSubTopics
						WHERE template_shining_sheet_topics.id = newSubTopics.id
						AND template_shining_sheet_topics.template_singing_sheet_id = templateID
						AND template_shining_sheet_topics.parent_id = templateShiningSheetTopicID;
					END IF;
				END LOOP;	
			END IF;
		END LOOP;
	
	END IF;
	
	RETURN templateID;
END
$$;


---------------------------------------------------------------------------------------------------------------------
/* create function get user-profile details  */

CREATE OR REPLACE FUNCTION get_user_with_permission(
	user_provider_key character varying)
    RETURNS TABLE(user_id integer, email character varying , permissions character varying[]) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
    ROWS 1000
AS $BODY$
DECLARE user_detail record;
/*------------------------------------------------------------------------------------------------
    DESCRIPTION		: This function is check if user has access to requested URL
    CREATED BY		: Nayan Gajera
    CREATED DATE	: 21-Nov-2022
    MODIFIED BY		: 
    MODIFIED DATE	:
    CHANGE HISTORY	: Add realtion of role-permission
------------------------------------------------------------------------------------------------*/
BEGIN
	--
	EXECUTE format(E'SELECT u.id AS user_id, u.email, array_agg(pa.tag) as permissions
                     FROM users u
                     left join user_roles ur ON ur.user_id = u.id
                     left join role_permissions rp ON rp.role_id = ur.role_id
                     left join page_actions pa ON pa.id = rp.page_action_id
                     WHERE u.hash = \'%s\' GROUP BY u.id', 
                  user_provider_key) INTO user_detail;

		RETURN QUERY SELECT user_detail.user_id,user_detail.email,user_detail.permissions;
END
$BODY$;



/* create function get_permitted_menus  */

CREATE OR REPLACE FUNCTION get_permitted_menus(
	userId integer
)
RETURNS TABLE(user_id integer,menus json) 
LANGUAGE 'plpgsql'
AS $$  
/*------------------------------------------------------------------------------------------------
    DESCRIPTION		    : This function is get permitted menus
    CREATED BY		    : Nayan Gajera
    CREATED DATE	    : 25-Nov-2022
    MODIFIED BY		    : 
    MODIFIED DATE	    :
    CHANGE HISTORY      : Added
	---------------------
    25-Nov-2022-Nayan   : Use datatable role-permission instead of userpermission
 ------------------------------------------------------------------------------------------------*/
BEGIN
	RETURN QUERY
		SELECT u.id as userId,
		 (select array_to_json(array_agg(row)) from (
			  select p1.id,p1.name,p1.page_code,p1.url,p1.parent_page_id,
				 (select array_to_json(array_agg(row)) from (
				  select p2.id,p2.name,p2.page_code,p2.url,p2.parent_page_id,
						  (select json_agg(row_to_json(po)) as "pageOptions" FROM  
							   (select DISTINCT pa.tag, true as "access" FROM page_actions AS pa
						inner join user_roles ur ON ur.user_id = u.id
						inner join role_permissions rp on rp.page_action_id = pa.id and rp.role_id = ur.role_id
						where pa.page_id = p2.id
							) as po)
				  from pages p2 where p2.parent_page_id = p1.id 
			   )row) as sub_menus
			  from pages p1 where p1.parent_page_id isNULL) row) as menus 
		 FROM users u
		 inner join user_roles ur ON ur.user_id = u.id
		 inner join role_permissions rp ON rp.role_id = ur.role_id
		 inner join page_actions pa ON pa.id = rp.page_action_id
		 WHERE u.id = userId GROUP BY u.id;
END
$$;

/* create function assign role permissions  */

CREATE OR REPLACE FUNCTION assign_role_permissions(
	user_role_id integer,
    page_action_ids integer[],
    created_by integer
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
   page_action_idx integer;
   count_row integer := 0;
/*------------------------------------------------------------------------------------------------
 DESCRIPTION   : This function will save role_permission
 CREATED BY    : Nayan Gajera
 CREATED DATE  : 29-Nov-2022
 MODIFIED BY   : 
 MODIFIED DATE : 
 CHANGE HISTORY:
 ---------------
 29-Nov-2022-Nayan: Initially Created
------------------------------------------------------------------------------------------------*/
BEGIN
    -- inser data into role_permissions which are not exists
    FOREACH page_action_idx IN ARRAY page_action_ids
    LOOP
        IF NOT EXISTS (SELECT rp.id FROM role_permissions rp INNER JOIN page_actions pa ON rp.page_action_id = pa.id WHERE rp.role_id = user_role_id AND rp.page_action_id = page_action_idx) THEN
            INSERT INTO role_permissions ("role_id", "page_action_id","created_by")
            VALUES(user_role_id, page_action_idx, created_by);
            count_row := count_row + 1; 
        END IF;
    END LOOP;
    -- delete data from role_permissions which are not in page_action_ids
    DELETE FROM role_permissions WHERE role_id = user_role_id AND NOT (page_action_id = ANY(page_action_ids));
    RETURN count_row;
END
$$;

/*-----------------This function used for get student_details grid wise------------------- */

CREATE OR REPLACE FUNCTION grIds_details(
     grId INTEGER
)
RETURNS TABLE (admissionID INTEGER,gr_id INTEGER,grId_details json)
LANGUAGE 'plpgsql'
AS $$
DECLARE 
	/* ------------------------------------------------------------------------------------
	FUNCTION: grId_details
	DESCRIPTION 	: This function is used to get student_details grId
	CREATED BY    	: Anita Sanchala
	CREATED DATE 	: 19-December-2022
	MODIFIED BY		: Anita Sanchala
	MODIFIED DATE	: 27-December-2022
	CHANGE HISTORY	:
	19-December-2022-Anita: Initially Created
	27-December-2022-Anita: Added admission_id
	------------------------------------------------------------------------------------*/
BEGIN
	IF ((SELECT sd.gr_id FROM student_details sd WHERE sd.gr_id = grId) = grId) THEN
		IF ((SELECT a.gr_id FROM admissions a WHERE a.gr_id = grId AND a.course_category = 'PACKAGE') = grId) THEN
			RETURN QUERY
				SELECT a.id AS admissionID,sd.gr_id AS grId,
					(select array_to_json(array_agg(row)) from (
					SELECT sd.first_name,sd.middle_name,sd.last_name,a.course_category,p.name as package_name
					FROM student_details sd
					INNER JOIN admissions a ON a.gr_id = sd.gr_id
					INNER JOIN admission_packages ap ON ap.admission_id = a.id
					INNER JOIN packages p ON p.id = ap.package_id
					WHERE sd.gr_id = grId AND a.course_category = 'PACKAGE'
					ORDER BY a.id DESC LIMIT 1 
				)row) AS grId_details 
				FROM student_details sd INNER JOIN admissions a ON a.gr_id = sd.gr_id
				WHERE sd.gr_id = grId LIMIT 1;
		ELSIF ((SELECT a.gr_id FROM admissions a WHERE a.gr_id = grId AND a.course_category = 'SINGLE') = grId ) THEN
			RETURN QUERY
			SELECT a.id AS admissionID,sd.gr_id AS grId,
				(select array_to_json(array_agg(row)) from (
			   SELECT sd.first_name,sd.last_name,sd.middle_name,a.course_category,sub.name AS subcourse_name
			   FROM student_details sd
			   INNER JOIN admissions a ON a.gr_id = sd.gr_id 
			   INNER JOIN admission_subcourse asub ON asub.admission_id = a.id 
			   INNER JOIN subcourses sub ON sub.id = asub.subcourse_id
			   WHERE sd.gr_id = grId AND a.course_category = 'SINGLE' 
			   ORDER BY a.id ASC LIMIT 1
			)row) AS grId_details
			FROM student_details sd INNER JOIN admissions a ON a.gr_id = sd.gr_id 
			 WHERE sd.gr_id = grId LIMIT 1;
		END IF;
	END IF;
END
$$;  

CREATE OR REPLACE FUNCTION admission_course_completed(
	admissionSubCourseData json,
	admissionremarksData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
    admissionSubcourseID integer;
    admissionID integer;
	admissionRemarksID integer;
    createdAndUpdatedBy character varying := CAST(admissionSubCourseData::json->>'updated_by' AS character varying);
	
    /* ------------------------------------------------------------------------------------
    FUNCTION: admission_course_completed
    DESCRIPTION     : This function is used to update admission_installments and Add admission_remarks
    CREATED BY      : krishna vasoya
    CREATED DATE    : Krishna Vasoya
    MODIFIED BY     : Nirav Lakhani
    MODIFIED DATE   : 09-March-2022
    CHANGE HISTORY  :
    30-Novembar-2022 krishna: Initially Created,
    7-Dec-2022 krishna: admission_course_complated in change update
	24-February-2023 Krishna : admission_remark reting defult 0 add
	09-March-2022-Nirav: created_by and updated_by add field in admission_subcourse and admission_remarks create and update Time
	25-May-2023-Nirav: Update admission status after update admission subcourse status competed
	27-June-2023-Nirav: Add Condition in Admission Update Time
    ------------------------------------------------------------------------------------*/
    
BEGIN
    IF admissionSubCourseData::json->>'id' IS NOT NULL THEN        
     IF((select batch_id from admission_subcourse 
         where id = CAST(admissionSubCourseData::json->>'id' AS INTEGER) 
         AND batch_id IN(select batch_id from admission_subcourse where 
                         id = CAST(admissionSubCourseData::json->>'id' AS INTEGER))) > 0)THEN             
            UPDATE admission_subcourse
                SET subcourse_status = admissionSubCourse.subcourse_status,
					updated_by = createdAndUpdatedBy
            FROM json_populate_record(NULL::admission_subcourse, admissionSubCourseData) AS admissionSubCourse    
            WHERE admission_subcourse.id = admissionSubCourse.id AND admission_subcourse.subcourse_status 
            NOT IN ('COMPLETED','CANCELLED')
            RETURNING admission_subcourse.id INTO admissionSubcourseID;
			
		IF admissionSubcourseID IS NOT NULL THEN
		  IF ((SELECT id FROM admission_subcourse WHERE admission_id = (SELECT admission_id FROM admission_subcourse WHERE id = admissionSubcourseID) AND
			  subcourse_status NOT IN ('COMPLETED') LIMIT 1) > 0) THEN
			 IF (select COUNT(batch_id) from admission_subcourse where admission_id = (SELECT admission_id FROM admission_subcourse WHERE id = admissionSubcourseID) AND subcourse_status IN ('ONGOING')) = 0 THEN 
				UPDATE admissions
					SET status = 'PENDING',
						updated_by = createdAndUpdatedBy
					WHERE id = (SELECT admission_id FROM admission_subcourse WHERE id = admissionSubcourseID LIMIT 1)
					RETURNING admissions.id INTO admissionID;
			 END IF;		
		  END IF;		
		END IF;
        
        IF admissionremarksData::json->>'remarks' IS NOT NULL THEN
            INSERT INTO admission_remarks(admission_id,branch_id,labels,rating,remarks,status,type,created_by)
            SELECT CAST(admissionSubCourseData::json->>'admission_id' as integer),
                        CAST(admissionSubCourseData::json->>'batch_id' as integer),
                        'course_completed',
                        '0',
                        remarks,
                        (SELECT status FROM admission_subcourse WHERE admission_id = CAST(admissionSubCourseData::json->>'admission_id' as integer)
                        AND batch_id = CAST(admissionSubCourseData::json->>'batch_id' as integer) LIMIT 1),
                        'PUBLIC',
						createdAndUpdatedBy
            FROM json_populate_record(NULL::admission_remarks, admissionremarksData)
            RETURNING admission_remarks.id INTO admissionRemarksID;
        END IF;
        END IF;
    END IF;
    
    RETURN admissionSubcourseID;
END
$$;

CREATE OR REPLACE FUNCTION admission_card_details_manage(
		a_id INTEGER
	)
	RETURNS TABLE (admissionID integer,admission_card_details json)
	LANGUAGE 'plpgsql'
	AS $$
	DECLARE
		user_detail record;
		/* ------------------------------------------------------------------------------------
		FUNCTION: admission_card_details_manage
		DESCRIPTION 	: This function is used to get admisstion card detail
		CREATED BY    	: krishna vasoya
		CREATED DATE 	: 20-Dec-2022
		MODIFIED BY		: Krishna vasoya
		MODIFIED DATE	: 27-Dec-2022
		CHANGE HISTORY	:
		20-Dec-2022-krishna: Initially Created
		23-Dec-2022-krishna : add branch_name
		27-Dec-2022-krishna : course_category PACKAGE so PACKAGE throw give admission_packages recorde and package table throw give a package_name
		------------------------------------------------------------------------------------*/

	BEGIN
	 IF ((SELECT course_category FROM admissions WHERE id = a_id and course_category = 'SINGLE')= 'SINGLE') THEN
		RETURN QUERY
			SELECT a.id as admissionID,
			 (select array_to_json(array_agg(row)) from (
				  select a.branch_id AS branch_id,a.first_name,a.last_name,a.gr_id,
				 a.created_date as admission_created_date,br.name as branch_name,
				 subcourses.name as subcourse_name,subcourses.id as subcourse_id,subcourses.duration,
				 a.father_mobile_no, br.logo,ad.photos,subcourses.created_date as subcourse_created_date,
				  asu.subcourse_id,asu.created_date,a.id, asu.* from admissions a
			    INNER join branches br ON a.branch_id = br.id 
			    INNER join admission_documents ad ON a.id = ad.admission_id 
			    INNER join admission_subcourse asu ON a.id = asu.admission_id
		        INNER join subcourses ON subcourses.id = asu.subcourse_id where a.id=a_id
			 )
			  row) as admission_card_details
			FROM admissions a
			 WHERE a.id = a_id GROUP BY a.id;
			ELSIF ((SELECT course_category FROM admissions WHERE id = a_id and course_category = 'PACKAGE')= 'PACKAGE') THEN
		RETURN QUERY
			SELECT a.id as admissionID,
			 (select array_to_json(array_agg(row)) from (
				   select a.branch_id AS branch_id,a.id,a.first_name,a.last_name,a.gr_id,
				 a.created_date as admission_created_date,br.name as branch_name,
				 packages.name as packages_name,packages.id as packages_id,packages.duration,
				 a.father_mobile_no,br.logo,ad.photos,packages.created_date as packages_created_date,
				 ap.package_id,ap.created_date,a.id,ap.* from admissions a
			INNER join branches br ON a.branch_id = br.id
			INNER join admission_documents ad ON a.id = ad.admission_id
				 INNER join admission_packages ap ON a.id = ap.admission_id
			INNER join packages ON packages.id=ap.package_id   where a.id=a_id
				
			 )
			  row) as admission_card_details
			FROM admissions a
			 WHERE a.id = a_id GROUP BY a.id;
			 END IF;		 
	END
	$$;

	/* changes function admission_course_completed */
	

-- without fees modification chnag packge function
CREATE OR REPLACE FUNCTION admission_course_modification_manage_without_fees(
	admissionSubcourseData json,
	admissionInstallmentsData json,
	admissionsData json,
	packageModifiedType character varying
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionID integer;
	mAdmissionSubcourseData json;
	packageID integer;
	createdAndUpdatedBy character varying := CAST(admissionsData::json->>'updated_by' as character varying);
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: admission_course_modification_manage_without_fees
	DESCRIPTION 	: This function is used to modify package without update admissions fees in course modification
	CREATED BY    	: Zenil Savani
	CREATED DATE 	: 02-March-2023
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 09-March-2023
	CHANGE HISTORY	:
	-----------------
	02-Mar-2023-Zenil	: Initially Created
	03-Mar-2023-Zenil   : update completed course when modify package
	09-March-2023-Nirav: created_by and updated_by add field in admission_subcourse and admissions create and update Time

	------------------------------------------------------------------------------------*/
BEGIN
		UPDATE admissions
			SET payable_amount = newadmissionsData.payable_amount,
				no_of_installment = newadmissionsData.no_of_installment,
				package_id = CAST(admissionsData::json->>'package_id' as integer),
				updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionsData) AS newadmissionsData
			WHERE admissions.id = newadmissionsData.id
			RETURNING admissions.id INTO admissionID;
		IF admissionID IS NOT NULL THEN
			IF (packageModifiedType = '"WITHOUT_FEE_MODIFICATION"') THEN
				DELETE FROM admission_subcourse 
				WHERE admission_id = admissionID AND subcourse_id IN(select subcourse_id from admission_subcourse where subcourse_status NOT IN('COMPLETED') AND admission_id = admissionID);
				UPDATE admission_subcourse
				   SET package_id = CAST(admissionsData::json->>'package_id' as integer),
				   	   updated_by = createdAndUpdatedBy	
				WHERE admission_subcourse.admission_id = admissionID AND subcourse_id IN(select subcourse_id from admission_subcourse where subcourse_status IN('COMPLETED'));
			END IF;
			FOR mAdmissionSubcourseData IN SELECT json_array_elements(admissionSubcourseData)
			LOOP	
				IF mAdmissionSubcourseData::json->>'course_category' IS NOT NULL THEN
					IF (CAST(mAdmissionSubcourseData::json->>'course_category' AS course_type) = 'PACKAGE') THEN
						IF (packageModifiedType = '"WITHOUT_FEE_MODIFICATION"') THEN
							IF (SELECT subcourse_id FROM admission_subcourse WHERE admission_id = admissionID 
								AND subcourse_id = CAST(mAdmissionSubcourseData::json->>'subcourse_id' AS INTEGER)) IS NULL THEN
								INSERT INTO admission_subcourse(admission_id,course_id,subcourse_id,package_id,batch_id,user_id,course_category,subcourse_status,
															assigned_date,completed_date,is_starting_course,created_by,created_date,updated_by,updated_date,total,comment)
								SELECT admissionID,course_id,subcourse_id,package_id,batch_id,user_id,course_category,'UP_COMING',
									   assigned_date,completed_date,is_starting_course,createdAndUpdatedBy,created_date,updated_by,updated_date,total,comment 
									FROM json_populate_record(NULL::admission_subcourse, mAdmissionSubcourseData);
							END IF;	
						END IF;
					END IF;
				END IF;
			END LOOP;
		END IF;
	RETURN admissionID;	
END
$$;


-- admission package modification with fees change
CREATE OR REPLACE FUNCTION admission_course_modification_manage_with_fees(
	admissionSubcourseData json,
	admissionInstallmentsData json,
	admissionsData json,
	packageModifiedType character varying
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	admissionID integer;
	mAdmissionSubcourseData json;
	mAdmissionInstallmentsData json;
	admissioninstallmentID INTEGER;
	admissionInstallmentRemoveIDS INTEGER[];
	admissionInstallmentRemoveID INTEGER;
	admissionInstallmetDueAmount numeric := CAST(admissionsData::json->>'payable_amount' AS NUMERIC);
	admissionInstallmentData admission_installments%rowType;
	removingingInstallmentDueAmount NUMERIC;
	packageID integer;
	createdAndUpdatedBy character varying := CAST(admissionsData::json->>'updated_by' as character varying);

	
	/* ------------------------------------------------------------------------------------
	FUNCTION: admission_course_modification_manage_with_fees
	DESCRIPTION 	: This function is used to modify package with update admissions fees in course modification
	CREATED BY    	: Zenil Savani
	CREATED DATE 	: 02-March-2023
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 09-March-2023
	CHANGE HISTORY	:
	-----------------
	02-Mar-2023-Zenil	: Initially Created
	03-Mar-2023-Zenil   : update completed course when modify package
	09-March-2023-Nirav: created_by and updated_by add field in admission_subcourse and admissions and admission_installments create and update Time
	------------------------------------------------------------------------------------*/
BEGIN
		UPDATE admissions
			SET payable_amount = newadmissionsData.payable_amount,
				no_of_installment = newadmissionsData.no_of_installment,
				package_id = CAST(admissionsData::json->>'package_id' as integer),
				updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::admissions , admissionsData) AS newadmissionsData
			WHERE admissions.id = newadmissionsData.id
			RETURNING admissions.id INTO admissionID;
		IF admissionID IS NOT NULL THEN
			IF (packageModifiedType = '"WITH_FEE_CHANGE"') THEN
				DELETE FROM admission_subcourse 
				WHERE admission_id = admissionID AND subcourse_id IN(select subcourse_id from admission_subcourse where subcourse_status NOT IN('COMPLETED') AND admission_id = admissionID);
			   UPDATE admission_subcourse
				   SET package_id = CAST(admissionsData::json->>'package_id' as integer),
				   	   updated_by = createdAndUpdatedBy	
				WHERE admission_subcourse.admission_id = admissionID AND subcourse_id IN(select subcourse_id from admission_subcourse where subcourse_status IN('COMPLETED'));
				
			END IF;
			IF (packageModifiedType = '"WITH_FEE_CHANGE"') THEN
				DELETE FROM admission_installments 
				WHERE admission_id = admissionID AND id IN(select id from admission_installments where status NOT IN('PAID') AND admission_id = admissionID); 
			END IF;
			FOR mAdmissionSubcourseData IN SELECT json_array_elements(admissionSubcourseData)
			LOOP	
				IF mAdmissionSubcourseData::json->>'course_category' IS NOT NULL THEN
					IF (CAST(mAdmissionSubcourseData::json->>'course_category' AS course_type) = 'PACKAGE') THEN
						IF (packageModifiedType = '"WITH_FEE_CHANGE"') THEN	
							IF (SELECT subcourse_id FROM admission_subcourse WHERE admission_id = admissionID 
								AND subcourse_id = CAST(mAdmissionSubcourseData::json->>'subcourse_id' AS INTEGER)) IS NULL THEN
									INSERT INTO admission_subcourse(admission_id,course_id,subcourse_id,package_id,batch_id,user_id,course_category,subcourse_status,
											assigned_date,completed_date,is_starting_course,created_by,created_date,updated_by,updated_date,total,comment)
									SELECT admissionID,course_id,subcourse_id,package_id,batch_id,user_id,course_category,'UP_COMING',
										   assigned_date,completed_date,is_starting_course,createdAndUpdatedBy,created_date,updated_by,updated_date,total,comment 
									FROM json_populate_record(NULL::admission_subcourse, mAdmissionSubcourseData);	
							END IF;	
						END IF;
					END IF;
				END IF;
			END LOOP;
				FOR mAdmissionInstallmentsData IN SELECT json_array_elements(admissionInstallmentsData)
				LOOP
					IF mAdmissionInstallmentsData::json->>'branch_id' IS NOT NULL THEN
						INSERT INTO admission_installments(admission_id,branch_id,installment_date,commitment_date,installment_no,due_amount,status,installment_amount,created_by)
							SELECT admissionID,branch_id,installment_date,commitment_date,installment_no,due_amount,'UNPAID',installment_amount,createdAndUpdatedBy
								FROM json_populate_record(NULL::admission_installments, mAdmissionInstallmentsData);			
					END IF;				
				END LOOP;
		

	  ELSIF ((SELECT payable_amount FROM admissions WHERE id = CAST(admissionsData::json->>'id' AS INTEGER)) > admissionInstallmetDueAmount) THEN
	  		removingingInstallmentDueAmount := ((SELECT payable_amount FROM admissions WHERE id = CAST(admissionsData::json->>'id' AS INTEGER)) - admissionInstallmetDueAmount);
			FOR admissionInstallmentData IN SELECT * from admission_installments where admission_id = CAST(admissionsData::json->>'id' AS INTEGER) ORDER BY installment_date DESC
			LOOP	
			
				FOR mAdmissionSubcourseData IN SELECT json_array_elements(admissionSubcourseData)
				LOOP
					DELETE FROM admission_subcourse 
					WHERE admission_id = CAST(admissionsData::json->>'id' AS INTEGER) AND subcourse_id = CAST(mAdmissionSubcourseData::json->>'subcourse_id' AS INTEGER);			
				END LOOP;
				IF (admissionInstallmentData.due_amount >= removingingInstallmentDueAmount) THEN
					UPDATE admission_installments
					   SET due_amount = admissionInstallmentData.due_amount - removingingInstallmentDueAmount,
					   	   installment_amount = admissionInstallmentData.installment_amount - removingingInstallmentDueAmount,
						   updated_by = createdAndUpdatedBy
					   WHERE admission_installments.admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))
					   AND id = admissionInstallmentData.id
					   RETURNING admission_installments.id INTO admissioninstallmentID;
					   
					removingingInstallmentDueAmount := admissionInstallmentData.due_amount - removingingInstallmentDueAmount;
					IF(removingingInstallmentDueAmount = 0) THEN 
						DELETE FROM admission_installments WHERE id = admissionInstallmentData.id;
					END IF;
					EXIT WHEN admissioninstallmentID > 0;
				ELSE	      
					removingingInstallmentDueAmount := removingingInstallmentDueAmount - admissionInstallmentData.due_amount;
					admissionInstallmentRemoveIDS := array_append(admissionInstallmentRemoveIDS, admissionInstallmentData.id); 
					IF (removingingInstallmentDueAmount >= 0) THEN	
						IF admissionInstallmentRemoveIDS IS NOT NULL THEN
							FOREACH admissionInstallmentRemoveID IN ARRAY admissionInstallmentRemoveIDS
							 LOOP
								 UPDATE admission_installments
									   SET due_amount = admissionInstallmentData.due_amount - removingingInstallmentDueAmount,
									   	   updated_by = createdAndUpdatedBy	
									   WHERE admission_installments.admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))
									   AND id IN(SELECT id FROM admission_installments WHERE id NOT IN(admissionInstallmentRemoveID) ORDER BY id DESC LIMIT 1)
									   RETURNING admission_installments.id INTO admissioninstallmentID;

									   DELETE FROM admission_installments WHERE id = admissionInstallmentRemoveID;	   
							 END LOOP;
						END IF;	
					END IF;
				END IF;	
			END LOOP;
			IF admissioninstallmentID IS NOT NULL THEN
			 UPDATE admissions
				SET admission_amount = CAST(admissionsData::json->>'admission_amount' AS NUMERIC),
				    payable_amount = CAST(admissionsData::json->>'payable_amount' AS NUMERIC),
					no_of_installment = (SELECT count(id) from admission_installments where admission_id = (CAST(admissionsData::json->>'id' AS INTEGER))),
					package_id = CAST(admissionsData::json->>'package_id' as integer),
					updated_by = createdAndUpdatedBy
				FROM json_populate_record(NULL::admissions , admissionsData) AS newadmissionsData
				WHERE admissions.id = newadmissionsData.id
				RETURNING admissions.id INTO admissionID;
			END IF;
	END IF;
	RETURN admissionID;	
END
$$;


/* changes function batch_start_and_generate_shining_sheet_manage */

CREATE OR REPLACE FUNCTION batch_start_and_generate_shining_sheet_manage(
	batchData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	
	batchID INTEGER;
	subcourseTopics subcourse_topics%rowType;
	subTopics sub_topics%rowType;
	batchSiningSheetSubCourseTopicID integer;
	batchSingingSheetSubTopicID integer;
	createdAndUpdatedBy character varying := CAST(batchData::json->>'created_by' AS character varying);
	
	/* ------------------------------------------------------------------------------------
	FUNCTION: batch_start_and_generate_shining_sheet_manage
	DESCRIPTION 	: This function is used to update batches and create batch_singing_sheet
	CREATED BY    	: Nirav Lakhani
	CREATED DATE 	: 11-November-2022
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 10-March-2023
	CHANGE HISTORY	:
	11-November-2022-Nirav: Initially Created
	10-March-2023-Nirav: created_by and updated_by add field in batches and batch_singing_sheet and  create and update Time
	10-April-2023-Nirav: Create Batch Shining Sheet time add planned_start_date dynamic plus one new day
	------------------------------------------------------------------------------------*/
	
BEGIN

	IF batchData::json->>'id' IS NOT NULL THEN
		UPDATE batches
				SET batches_status = newBatchData.batches_status,
					updated_by = createdAndUpdatedBy
			FROM json_populate_record(NULL::batches , batchData) AS newBatchData
			WHERE batches.id = newBatchData.id
			RETURNING batches.id INTO batchID;
		IF batchID IS NOT NULL THEN 
			IF (SELECT batch_id from batch_singing_sheet WHERE batch_id = batchID LIMIT 1) IS NULL THEN
				FOR subcourseTopics IN SELECT * FROM subcourse_topics where subcourse_id = (SELECT subcourse_id FROM batches where id = batchID) 
				LOOP
					INSERT INTO batch_singing_sheet(batch_id,parent_id,name,description,sequence,type,duration,marks,created_by)
							SELECT batchID,
								   null,
								   subcourseTopics.name,
								   null,
								   subcourseTopics.sequence,
								   subcourseTopics.type,
								   subcourseTopics.duration,
								   subcourseTopics.marks,
								   createdAndUpdatedBy
					RETURNING batch_singing_sheet.id INTO batchSiningSheetSubCourseTopicID;
							
					IF batchSiningSheetSubCourseTopicID IS NOT NULL THEN 
						FOR subTopics IN SELECT * FROM sub_topics where topic_id in(SELECT id FROM subcourse_topics 
							where id IN(subcourseTopics.id) AND subcourse_id = (SELECT subcourse_id FROM batches where id = batchID)) ORDER BY ID ASC
						LOOP									
								INSERT INTO batch_singing_sheet(batch_id,parent_id,name,description,sequence,type,duration,marks,planned_start_date,created_by)
									SELECT batchID,
										   batchSiningSheetSubCourseTopicID,
										   null,
										   subTopics.description,
										   subTopics.sequence,
										   null,
										   null,
										   null,
										   (SELECT (SELECT CASE WHEN (select duration from batch_singing_sheet where id = batchSiningSheetSubCourseTopicID AND batch_id = batchID AND type in('PROJECT','VIVA','EXAM_PRACTICAL','EXAM_THEORY') AND duration > 0 order by id desc limit 1) IS NOT NULL THEN 
												   ((SELECT (SELECT CASE WHEN (select planned_start_date from batch_singing_sheet where batch_id = batchID and planned_start_date IS NOT NULL order by id desc limit 1) IS NOT NULL THEN 
					(select planned_start_date from batch_singing_sheet where batch_id = batchID and planned_start_date IS NOT NULL order by id desc limit 1) ELSE
					(select start_date from batches where id = batchID) END) + interval '1 day')) 
													ELSE
													(SELECT (SELECT CASE WHEN (select type from batch_singing_sheet where id = batchSiningSheetSubCourseTopicID AND type in('PROJECT','VIVA','EXAM_PRACTICAL','EXAM_THEORY') order by id desc limit 1) IS NOT NULL THEN (SELECT planned_start_date FROM batch_singing_sheet WHERE batch_id = batchID and planned_start_date IS NOT NULL  order by id desc limit 1) 
												   ELSE
													(select (select case when (select planned_start_date from batch_singing_sheet where batch_id = batchID and planned_start_date IS NOT NULL order by id desc limit 1) is null then (select start_date from batches where id = batchID) else 
													
													((SELECT (SELECT CASE WHEN (select planned_start_date from batch_singing_sheet where batch_id = batchID and planned_start_date IS NOT NULL order by id desc limit 1) IS NOT NULL THEN 
					(select planned_start_date from batch_singing_sheet where batch_id = batchID and planned_start_date IS NOT NULL order by id desc limit 1) ELSE
					(select start_date from batches where id = batchID) END) + interval '1 day')) end
												   
												   )) END)
												   ) END)
												   )
											   ,
										   createdAndUpdatedBy
								RETURNING batch_singing_sheet.id INTO batchSingingSheetSubTopicID;		   
						END LOOP;
					END IF;
				END LOOP;
			END IF;
		END IF;
	END IF;
	
	RETURN batchID;
END
$$;

-- DROP FUNCTION user_role_configData_manage;
CREATE OR REPLACE FUNCTION user_role_configData_manage(
	userConfigData json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
	userRoleId integer;
	mUserConfig json;
	mUserRolesDepartment json;
	mUserRolesCourse json;
	userRoleDepartmentsID integer;
	userRoleCoursesID integer;
	userRoleCourse  json;
	userRoleDepartment json;
	/* ------------------------------------------------------------------------------------
	FUNCTION: user_role_ConfigData_manage
	DESCRIPTION 	: This function is used to update user_role and add or delete user_role_department or user_role_course
	CREATED BY    	: Krishna Vasoya
	CREATED DATE 	: 29-April-2023
	MODIFIED BY		: Nirav Lakhani
	MODIFIED DATE	: 11-may-2023
	CHANGE HISTORY	: 
	09-may-2023-Krishna : condition add is user role is not null than after user_role_department and user_role_course insert or update 
						and than after return user id  
	11-May-2023-Nirav Lakhani : Changes Delete User role department and delete user role course logic	
                                and update 	User role department and user role course time add condition userRoleId			
	------------------------------------------------------------------------------------*/
BEGIN
	FOR mUserConfig IN SELECT json_array_elements(CAST(userConfigData::json->> 'user_config' AS json))
	LOOP
		IF mUserConfig::json->>'user_id' IS NOT NULL THEN	
				UPDATE user_roles 
				SET 
				id = CAST(muserConfig::json->>'id' AS INT),
						availability = CAST(mUserConfig::json->>'availability' AS role_availability),
						reporting_user_id= CAST(mUserConfig::json->>'reporting_user_id' AS INT)
				FROM json_populate_record(NULL::user_roles , mUserConfig) AS newUserRole
				WHERE user_roles.id = newUserRole.id AND user_roles.user_id = CAST(mUserConfig::json->>'user_id' AS INT)
				RETURNING user_roles.id INTO userRoleId;
		END IF;
	
		   
		   IF userRoleId IS NOT NULL THEN
		   DELETE FROM user_role_departments
				WHERE user_role_id = userRoleId
				AND id NOT IN(
					SELECT id from user_role_departments where id IN(
					select id::INTEGER from json_populate_recordset(null::user_role_departments,CAST(mUserConfig::json->> 'user_role_departments' AS json))
					)
			 ); 
		   FOR mUserRolesDepartment IN SELECT json_array_elements(CAST(mUserConfig::json->> 'user_role_departments' AS json))
		   LOOP
			IF mUserRolesDepartment::json->>'id' IS NULL OR mUserRolesDepartment::json->>'id' = '0'  THEN
					INSERT INTO user_role_departments(user_role_id,department_id)
						VALUES(
						userRoleId,
						CAST(mUserRolesDepartment::json->>'department_id' AS INT)
						)
						RETURNING user_role_departments.id INTO userRoleDepartmentsID;
					ELSE
					UPDATE user_role_departments
						SET user_role_id = userRoleId,
							department_id = CAST(mUserRolesDepartment::json->>'department_id' AS INT)
						FROM json_populate_record(NULL::user_role_departments , mUserRolesDepartment) AS newUserRoleDepartments
						where user_role_departments.id = newUserRoleDepartments.id AND user_role_departments.user_role_id = userRoleId
						RETURNING user_role_departments.id INTO userRoleDepartmentsID;
					END IF;
			END LOOP;
			
			DELETE FROM user_role_courses
					WHERE user_role_id = userRoleId 				
					AND id NOT IN(
					SELECT id from user_role_courses where id IN(
					select id::INTEGER from json_populate_recordset(null:: user_role_courses,CAST(mUserConfig::json->> 'user_role_courses' AS json))
				));
			FOR mUserRolesCourse IN SELECT json_array_elements(CAST(mUserConfig::json->> 'user_role_courses' AS json))
			LOOP
			
					IF mUserRolesCourse::json->>'id' IS NULL OR mUserRolesCourse::json->>'id' = '0'  THEN
						INSERT INTO user_role_courses(user_role_id,course_id)
							VALUES(
							userRoleId,
							CAST(mUserRolesCourse::json->>'course_id' AS INT)
							)
					RETURNING user_role_courses.id INTO userRoleCoursesID;
					ELSE
					UPDATE user_role_courses 
						SET user_role_id = userRoleId,
						    course_id = CAST(mUserRolesCourse::json->>'course_id' AS INT)	
						FROM json_populate_record(NULL::user_role_courses , mUserRolesCourse) AS newUserRolesCourse
						where user_role_courses.id = newUserRolesCourse.id AND user_role_courses.user_role_id = userRoleId
						RETURNING user_role_courses.id INTO userRoleCoursesID;
					END IF;
			END LOOP;
		   END IF;
	   END LOOP;
		IF userRoleId IS NOT NULL THEN
		  RETURN mUserConfig::json->>'user_id';
		ELSE
			RETURN null;
		END IF;
END
$$;

CREATE OR REPLACE FUNCTION cv_planing_manage(
	cvPlaningData json,
	volunteersdata json,
	AdmissionRecuringsdata json
)
RETURNS integer
LANGUAGE 'plpgsql'
AS $$
DECLARE
    admissionRecuringId integer;
	cvPlaningID integer;
	volunteerId integer;
	mVolunteersData INTEGER;
	excecuteUser integer;
	mAdmissionRecringsData integer;
	createdBy character varying := CAST(cvPlaningData::json->>'created_by' AS character varying);
	updatedBy character varying := CAST(cvPlaningData::json->>'updated_by' AS character varying);
		/* ------------------------------------------------------------------------------------
	FUNCTION: user_role_ConfigData_manage
	DESCRIPTION 	: This function is used to update user_role and add or delete user_role_department or user_role_course
	CREATED BY    	: Krishna Vasoya
	CREATED DATE 	: 29-April-2023
	MODIFIED BY		: Chandani Khanesha
	MODIFIED DATE	: 07-july-2023
	CHANGE HISTORY	: 
	09-may-2023-Krishna : condition add is user role is not null than after user_role_department and user_role_course insert or update 
						and than after return user id  
	11-May-2023-Nirav Lakhani : Changes Delete User role department and delete user role course logic	
                                and update 	User role department and user role course time add condition userRoleId	
    07-July-2023 - Chandani Khanesha : Changes the condition of the where caluse for update the cv planning
	------------------------------------------------------------------------------------*/

BEGIN
	IF cvPlaningData::json->>'id' IS NULL OR cvPlaningData::json->>'id' = '0' THEN		
				INSERT INTO cv_planings(branch_id,company_name,company_address,visit_datetime,details,execute_by_user_id,created_by)
				SELECT branch_id,company_name,company_address,visit_datetime,details,execute_by_user_id,created_by
				FROM json_populate_record(NULL::cv_planings, cvPlaningData)
				RETURNING cv_planings.id INTO cvPlaningID;
		ELSE 
			UPDATE cv_planings
					SET company_name = newCvPlaning.company_name,
						company_address = newCvPlaning.company_address,
						visit_datetime = newCvPlaning.visit_datetime,
						details = newCvPlaning.details,
						execute_by_user_id = newCvPlaning.execute_by_user_id,
						status = newCvPlaning.status,
						updated_by = newCvPlaning.updated_by
				FROM json_populate_record(NULL::cv_planings , cvPlaningData) AS newCvPlaning
				WHERE cv_planings.id =CAST(cvPlaningData::json->>'id' AS INT) 
				RETURNING cv_planings.id INTO cvPlaningID;
		END IF;
		
	  IF cvPlaningID IS NOT NULL THEN
		IF json_array_length(volunteersdata) > 0 THEN
			FOR mVolunteersData IN SELECT json_array_elements(volunteersdata)
			LOOP
				INSERT INTO cv_volunteers(cv_planning_id,user_id)
				VALUES(cvPlaningID,mVolunteersData)
				RETURNING id INTO volunteerId;
			END LOOP;
	  	END IF;
	  END IF;
	  
	  IF json_array_length(AdmissionRecuringsdata) > 0  THEN	
		  FOR mAdmissionRecringsData IN SELECT json_array_elements(AdmissionRecuringsdata)
			LOOP
					UPDATE admission_recurings
					SET type_id = cvPlaningID
					WHERE admission_recurings.id = mAdmissionRecringsData
					RETURNING admission_recurings.id INTO admissionRecuringId;
			END LOOP;
		END IF;
	RETURN cvPlaningID;
END$$;

-- --------------- get_batch_signing_sheet_topic_data -------------------
CREATE OR REPLACE FUNCTION get_batch_signing_sheet_topic_data(
	batchSingingSheetId INTEGER
)
RETURNS TABLE (batch_singing_sheet_id integer,batch_singing_sheet_data json)
LANGUAGE 'plpgsql'
AS $$
DECLARE
	/* ------------------------------------------------------------------------------------
	FUNCTION: get_batch_signing_sheet_topic_data
	DESCRIPTION 	: This function is used to batch_singing_sheet_id wise batch_singing_sheet record get 
	CREATED BY    	: krishna vasoya
	CREATED DATE 	: 15-May-2023
	MODIFIED BY		: 
	MODIFIED DATE	:
	CHANGE HISTORY	:
	15-May-2023-krishna: Initially Created
	------------------------------------------------------------------------------------*/

BEGIN
	IF (SELECT id FROM batch_singing_sheet WHERE id = batchSingingSheetId AND type IN('EXAM_PRACTICAL','EXAM_THEORY','VIVA','PROJECT') LIMIT 1) IS NOT NULL  THEN
		RETURN QUERY
		SELECT bss.id as batch_singing_sheet_id,
			(
				select array_to_json(array_agg(row)) from (
		select 
		(SELECT (SELECT CASE WHEN (SELECT duration from batch_singing_sheet 
									where id = batchSingingSheetId 
									AND type IN('EXAM_PRACTICAL','EXAM_THEORY','VIVA','PROJECT') order by id desc) IS NOT NULL THEN 
					(SELECT planned_start_date from batch_singing_sheet 
					where parent_id = batchSingingSheetId 
					and planned_start_date is not null order by id desc limit 1) 
				END)) as planned_date,
			bss.* from batch_singing_sheet where id = batchSingingSheetId AND type IN('EXAM_PRACTICAL','EXAM_THEORY','VIVA','PROJECT')
			)
			row) as batch_singing_sheet_data
		FROM batch_singing_sheet bss
			WHERE bss.id = batchSingingSheetId GROUP BY bss.id;
end if;	  
END 
$$;

/* CREATE TRIGGER FOR admission_recurings status UPDATE */

CREATE OR REPLACE FUNCTION admission_recuring_status_update() RETURNS TRIGGER AS $admission_recuring_status_update$
	/* ------------------------------------------------------------------------------------
		TRIGGER                      : admission_recuring_status_update
		DESCRIPTION 	             : This trigger is used to update admission_recurings status
		CREATED BY    	             : Nirav Lakhani
		CREATED DATE 	             : 11-May-2023
		MODIFIED BY		             : 
		MODIFIED DATE	             : 
		CHANGE HISTORY	             :
		17-October-2022-Nirav Lakhani: Initially Created
    27-June-2023-Nayan Gajera: Remove Inprogress status
	------------------------------------------------------------------------------------*/
BEGIN
		IF (TG_OP = 'UPDATE') THEN
			IF (NEW.type_id IS NOT NULL and NEW.is_present IS NOT NULL) then
				NEW.status = 'COMPLETED';
			ELSE
				NEW.status = 'PENDING';
			END IF;
		END IF;
        RETURN NEW;
END;
$admission_recuring_status_update$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS admission_recuring_status_update on admission_recurings;
	CREATE TRIGGER admission_recuring_status_update
	BEFORE UPDATE ON admission_recurings
		FOR EACH ROW EXECUTE FUNCTION admission_recuring_status_update();


/* Add Condition in get_user_with_permission (role_id wise data) */

CREATE OR REPLACE FUNCTION get_user_role_wise_permission(
	role_id integer)
    RETURNS TABLE(user_id integer, email character varying ,user_role_id integer,zone_id integer, permissions character varying[]) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
    ROWS 1000
AS $BODY$
DECLARE user_detail record;
/*------------------------------------------------------------------------------------------------
    DESCRIPTION				 : This function is return user role wise permissions
    CREATED BY				 : Nirav Lakhani
    CREATED DATE			 : 17-May-2022
    MODIFIED BY				 : 
    MODIFIED DATE			 :
    CHANGE HISTORY			 : 
	17-May-2023-Nirav Lakhani: Initially Created
------------------------------------------------------------------------------------------------*/
BEGIN
	--
	EXECUTE format(E'SELECT u.id AS user_id, u.email,ur.id,ur.user_id,ur.role_id as user_role_id,ur.zone_id, array_agg(pa.tag) as permissions
                     FROM users u
                     left join user_roles ur ON ur.user_id = u.id
                     left join role_permissions rp ON rp.role_id = ur.role_id
                     left join page_actions pa ON pa.id = rp.page_action_id
                     WHERE ur.id = \'%s\' GROUP BY u.id,ur.id', 
                  role_id) INTO user_detail;

		RETURN QUERY SELECT user_detail.user_id,user_detail.email,user_detail.user_role_id,user_detail.zone_id,user_detail.permissions;
END
$BODY$;


/*-------- Jay ------*/
--DROP FUNCTION get_status_of_rw;
CREATE OR REPLACE FUNCTION get_status_of_rw(
	installmentId integer,
	branchId integer,
	admissionId integer,
	amount integer
)
RETURNS boolean
LANGUAGE 'plpgsql'
AS $$
DECLARE
	paymentMode text;
	res boolean;
	rStatistics integer;
	wStatistics integer;
	rAratio integer;
	wAratio integer;
	rSratio integer;
	wSratio integer;
	rAmount integer;
	wAmount integer;
	isActive boolean;
BEGIN
	res := true;
	
	select payment_mode into paymentMode from admission_installments where id = installmentId;
	
 	IF(paymentMode = 'CASH') THEN
 		select r_total, w_total, is_active into rStatistics, wStatistics, isActive from rw_statistics where branch_id = branchId;
 		IF(isActive = true) THEN
 			select split_part(value,':',1), split_part(value,':',2) into rAratio, wAratio from configurations where code= 'RW_A_RATIO';		
 			IF (((rAratio::decimal/wAratio::decimal)*wStatistics::decimal) > rStatistics+amount) THEN
			
 				select split_part(value,':',1), split_part(value,':',2) into rSratio, wSratio from configurations where code= 'RW_S_RATIO';	
					
 				SELECT sum(case when r_w = true then pay_amount else 0 end), sum(case when r_w = false then pay_amount else 0 end) into wAmount, rAmount 
 				FROM invoices where admission_id = admissionId;
 				IF (((rSratio::decimal/wSratio::decimal)*wAmount::decimal) > rAmount+amount) THEN
 					res := false;
 				END IF;		
 			END IF;
 		END IF;		
 	END IF;	
	RETURN res;
END
$$;

-- select get_status_of_rw();
CREATE OR REPLACE FUNCTION add_rw_statistics() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: add_rw_statistics
DESCRIPTION 	: This function use to generate trigger
CREATED BY 		: Jay Dhameliya
CREATED DATE	: 29-April-2023
MODIFIED BY		: 
MODIFIED DATE	: 
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
BEGIN
   INSERT INTO rw_statistics(branch_id) VALUES(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_rw_statistics on branches;
CREATE TRIGGER add_rw_statistics
  AFTER INSERT
  ON branches
  FOR EACH ROW
  EXECUTE PROCEDURE add_rw_statistics();

----------------------

CREATE OR REPLACE FUNCTION update_rw_statistics() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: add_rw_statistics
DESCRIPTION 	: This function use to generate trigger after insert invoice records
CREATED BY 		: Jay Dhameliya
CREATED DATE	: 29-April-2023
MODIFIED BY		: 
MODIFIED DATE	: 
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
BEGIN
   IF(NEW.r_w = true) THEN
		UPDATE rw_statistics
			SET w_total = (w_total + NEW.pay_amount)
		WHERE branch_id = NEW.branch_id;
	else
		UPDATE rw_statistics
			SET r_total = (r_total + NEW.pay_amount)
		WHERE branch_id = NEW.branch_id;
	END IF;	
   
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rw_statistics on invoices;
CREATE TRIGGER update_rw_statistics
  AFTER INSERT
  ON invoices
  FOR EACH ROW
  EXECUTE PROCEDURE update_rw_statistics();

----------------------

CREATE OR REPLACE FUNCTION set_invoice_no() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_invoice_no
DESCRIPTION 	: This function use to generate trigger
CREATED BY 		: Jay Dhameliya
CREATED DATE	: 29-April-2023
MODIFIED BY		: 
MODIFIED DATE	: 
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
DECLARE
	invoice_no_seq integer;
	r_sequence_no integer;
	rw_result boolean;
BEGIN
	rw_result := get_status_of_rw(NEW.installment_id, NEW.branch_id, NEW.admission_id, NEW.pay_amount);
	if(rw_result) then
		SELECT (invoice_no_sequence +1) into invoice_no_seq  FROM branches WHERE id = NEW.branch_id;
		UPDATE branches
				SET invoice_no_sequence = invoice_no_seq
			WHERE id = NEW.branch_id;
		UPDATE rw_statistics
				SET r_sequence = 0
			WHERE branch_id = NEW.branch_id;
		NEW.invoice_no = concat(NEW.invoice_no, invoice_no_seq);
		
	else
		SELECT (invoice_no_sequence) into invoice_no_seq  FROM branches WHERE id = NEW.branch_id;
		SELECT (r_sequence + 1) into r_sequence_no from rw_statistics WHERE branch_id = NEW.branch_id;
		UPDATE rw_statistics
				SET r_sequence = r_sequence_no
			WHERE branch_id = NEW.branch_id;
		NEW.invoice_no = concat(NEW.invoice_no, invoice_no_seq,'-',r_sequence_no);
	END IF;
	NEW.r_w = rw_result;
	
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invoice_no on invoices;
CREATE TRIGGER set_invoice_no
  BEFORE INSERT
  ON invoices
  FOR EACH ROW
  EXECUTE PROCEDURE set_invoice_no();



------------- Existing branch data add ----------------
DO $$ 
DECLARE
		branchData INTEGER;
		courseConfigId INTEGER;
BEGIN
		for branchData IN select id from branches where id not in (select branch_id from rw_statistics)
		LOOP
			INSERT INTO rw_statistics(branch_id) VALUES(CAST(branchData AS INTEGER));
		END LOOP;
END $$;
/*-------- End Jay ------*/

CREATE OR REPLACE FUNCTION set_gr_id() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_gr_id
DESCRIPTION 	: This function use to generate trigger
CREATED BY 		: Jay Dhameliya
CREATED DATE	: 04-July-2023
MODIFIED BY		: 
MODIFIED DATE	: 
CHANGE HISTORY	:
------------------------------------------------------------------------------------*/
DECLARE
	gr_id_seq integer;
BEGIN
    SELECT (gr_id + 1) into gr_id_seq  FROM student_details ORDER BY gr_id DESC limit 1;
    NEW.gr_id = gr_id_seq;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_gr_id on student_details;
CREATE TRIGGER set_gr_id
  BEFORE INSERT
  ON student_details
  FOR EACH ROW
  EXECUTE PROCEDURE set_gr_id();
