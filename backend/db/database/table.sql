DO $$
BEGIN
    -- create enum for zone type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'zone_type') THEN
        CREATE TYPE zone_type AS ENUM ('PUBLIC', 'PRIVATE');
    END IF;
    -- create enum for zone type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ENABLE', 'DISABLE', 'PENDING');
    END IF;

    -- create enum for remarks type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'remarks_type') THEN
        CREATE TYPE remarks_type AS ENUM ('PRIVATE', 'PUBLIC');
    END IF;

    -- create enum for admission_subcourse_status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admission_subcourse_status') THEN
        CREATE TYPE admission_subcourse_status AS ENUM ('ONGOING', 'PENDING','COMPLETED','CANCELLED', 'UP_COMING', 'ON_HOLD', 'ON_VACATION');
    END IF;

    -- create enum for gender type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
        CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE','OTHER');
    END IF;

    -- create enum for course type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_type') THEN
        CREATE TYPE course_type AS ENUM ('SINGLE', 'PACKAGE');
    END IF;
    -- create enum for admission_status type
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admission_status') THEN
        CREATE TYPE admission_status AS ENUM ('ONGOING', 'PENDING', 'HOLD' ,'TERMINATED','CANCELLED','COMPLETED','TRANSFER');
    END IF;

	-- create enum for cheque_type type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cheque_type') THEN
        CREATE TYPE cheque_type AS ENUM ('TO_BE_DEPOSIT', 'TO_BE_COLLECTED', 'TO_BE_BOUNCE', 'TO_BE_CLEARED', 'TO_BE_CANCELED');
    END IF;

	 -- create enum for batches status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'batches_status') THEN
        CREATE TYPE batches_status AS ENUM ('ONGOING', 'UP_COMING', 'ON_HOLD' ,'ON_VACATION','COMPLETED','CANCELLED');
    END IF;

	-- create enum for subcourse topic status type
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subcourse_topic_type') THEN
        CREATE TYPE subcourse_topic_type AS ENUM ('LECTURE', 'PROJECT', 'VIVA', 'EXAM');
    END IF;

	/* Create New Enum for admission_transfer status */
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transfer_type') THEN
        CREATE TYPE transfer_type AS ENUM ('INITIALIZE', 'ABOT', 'ACCEPT', 'REJECT');
    END IF;

	/* create new enum for batch_faculty_attendances type column */
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_type') THEN
   		CREATE TYPE session_type AS ENUM ('REGULAR', 'REVISION','REPEAT');
	END IF;

	-- create enum for pay type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pay_type') THEN
        CREATE TYPE pay_type AS ENUM ('INDIVIDUAL', 'ORGANIZATION');
    END IF;

	 -- create enum for pay_for_type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pay_for_type') THEN
        CREATE TYPE pay_for_type AS ENUM ('OTHER', 'STUDENT');
    END IF;

	-- create enum for payment_mode
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_mode_type') THEN
        CREATE TYPE payment_mode_type AS ENUM ('Case','DD','Credit Card','Debit card','Online PayMent',
										 'NEFT/IMPS','Paytm','Bank Deposit (cash)','Capital Float (EMI)',
										 'Google Pay','Phone Pay','Bajaj Finserv (EMI)','Bhim UPI (India)',
										 'Instamojo','Paypal','Rayzorpay');
    END IF;

	-- create enum for school_clg_type type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'school_clg_type') THEN
        CREATE TYPE school_clg_type AS ENUM ('SCHOOL', 'COLLEGE');
    END IF;

	-- create enum for installment_status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'installment_status') THEN
        CREATE TYPE installment_status AS ENUM ('PAID', 'UNPAID', 'ADVANCE_PAID', 'CANCELLED');
    END IF;

	-- create enum for token type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'token_type') THEN
        CREATE TYPE token_type AS ENUM ('ANDROID', 'IOS','WEB');
    END IF;

	-- create enum for feedback type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feedback_type') THEN
        CREATE TYPE feedback_type AS ENUM ('A', 'B','C','D');
    END IF;

	--  role_availability enum --------------------------------
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_availability') THEN
        CREATE TYPE role_availability AS ENUM ('FULL_TIME', 'PART_TIME', 'VISITOR');
	END IF;

	-- create enum for uniform type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'uniform_type') THEN
        CREATE TYPE uniform_type AS ENUM ('REGULAR', 'IRREGULAR');
    END IF;


	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relation_type') THEN
		CREATE TYPE relation_type AS ENUM ('FATHER','MOTHER','SISTER','UNCLE','AUNTY','OTHER');
	END IF;

	-- create enum for discipline type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discipline_type') THEN
        CREATE TYPE discipline_type AS ENUM ('BAD', 'MEDIUM', 'GOOD');
    END IF;

	-- create enum for status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
        CREATE TYPE status_type AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED');
    END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subject_type') THEN
        CREATE TYPE subject_type AS ENUM ('STUDENT', 'OTHER' );
    END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'feed_back_type') THEN
        CREATE TYPE feed_back_type AS ENUM ('STUDENT', 'PARENTS' );
    END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admission_recursing_type') THEN
		CREATE TYPE admission_recursing_type AS ENUM ('PTM', 'CV', 'ES');
	END IF;

	-- create enum for admission recurings status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admission_recuring_status') THEN
        CREATE TYPE admission_recuring_status AS ENUM ('PENDING', 'INPROGRESS','COMPLETED');
    END IF;

	-- create enum type for cv
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cv_planing_status_type') THEN
        CREATE TYPE cv_planing_status_type AS ENUM ('PENDING','COMPLETED');
    END IF;

	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
        CREATE TYPE role_type AS ENUM ('SUPER_ADMIN', 'ADMIN','FACULTY_HEAD','FACULTY','MANAGER');
    END IF;

	-- Create new enum auth for auth_type
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_type') THEN
        CREATE TYPE auth_type AS ENUM ('OTP', 'MPIN');
	END IF;

	-- Create new enum tally for tally_type
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tally_type') THEN
  		CREATE TYPE tally_type AS ENUM ('0','1','2');
	END IF;
END$$;

--------------------------------------------------------------------------------------------------
-- Uuser -notes multi designation like parent of parent

CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY,
																																			first_name CHARACTER VARYING(100) NOT NULL,
																																			last_name CHARACTER VARYING(100) NOT NULL,
																																			email CHARACTER VARYING(100) NOT NULL UNIQUE,
																																			hash CHARACTER VARYING(255) NOT NULL,
																																			phone CHARACTER VARYING(15) NOT NULL,
																																			status user_status NOT NULL DEFAULT 'PENDING',
																																			last_seen TIMESTAMP WITHOUT TIME ZONE,
																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																			modified_date TIMESTAMP WITHOUT TIME ZONE,
																																			created_by CHARACTER VARYING(100) NULL,
																																			updated_by CHARACTER VARYING(100) NULL);

--------------------------------------------------------------------------------------------------
-- zones -notes parent of branch Like onr type of zone of zone

CREATE TABLE IF NOT EXISTS zones ( id SERIAL PRIMARY KEY,
																																			parent_id INTEGER NULL,
																																		FOREIGN KEY (parent_id) REFERENCES zones(id),
																																			code CHARACTER VARYING(50) NOT NULL UNIQUE,
																																			name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																			type zone_type NOT NULL,
																																			status BOOLEAN DEFAULT TRUE,
																																			created_by CHARACTER VARYING(100) NULL,
																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																			updated_by CHARACTER VARYING(100) NULL,
																																			updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------
-- Department -notes one type of subdepartment parent

CREATE TABLE IF NOT EXISTS departments ( id SERIAL PRIMARY KEY,
																																									name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																									code CHARACTER VARYING(50) NOT NULL UNIQUE,
																																									status BOOLEAN DEFAULT TRUE,
																																									photos BOOLEAN DEFAULT FALSE,
																																									tenth_marksheet BOOLEAN DEFAULT FALSE,
																																									twelfth_marksheet BOOLEAN DEFAULT FALSE,
																																									leaving_certy BOOLEAN DEFAULT FALSE,
																																									adhar_card BOOLEAN DEFAULT FALSE,
																																									other BOOLEAN DEFAULT FALSE,
																																									created_by CHARACTER VARYING(100) NULL,
																																									created_date TIMESTAMP WITHOUT TIME ZONE,
																																									updated_by CHARACTER VARYING(100) NULL,
																																									updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------
-- subdepartments -notes one type of department child

CREATE TABLE IF NOT EXISTS subdepartments
				( id SERIAL PRIMARY KEY,
						department_id INTEGER NOT NULL,
						name CHARACTER VARYING(100) NOT NULL UNIQUE,
						code CHARACTER VARYING(50) NOT NULL UNIQUE,
						status BOOLEAN DEFAULT TRUE,
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE);

--------------------------------------------------------------------------------------------------
-- course -notes one type of course like c

CREATE TABLE IF NOT EXISTS course ( id SERIAL PRIMARY KEY,
																																				department_id INTEGER NOT NULL,
																																				subdepartment_id INTEGER NOT NULL,
																																				name CHARACTER VARYING(100) NOT NULL,
																																				code CHARACTER VARYING(50) NOT NULL,
																																				status BOOLEAN DEFAULT TRUE,
																																				created_by CHARACTER VARYING(100) NULL,
																																				created_date TIMESTAMP WITHOUT TIME ZONE,
																																				updated_by CHARACTER VARYING(100) NULL,
																																				updated_date TIMESTAMP WITHOUT TIME ZONE,
																																			FOREIGN KEY (department_id) REFERENCES departments(id),
																																			FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id));

--------------------------------------------------------------------------------------------------
-- lookups

CREATE TABLE IF NOT EXISTS lookups ( id SERIAL PRIMARY KEY,
																																					name CHARACTER VARYING(100) NOT NULL,
																																					type CHARACTER VARYING(100),
																																					code CHARACTER VARYING(100),
																																					color CHARACTER VARYING(100),
																																					default_search BOOLEAN DEFAULT TRUE NOT NULL,
																																					active BOOLEAN DEFAULT TRUE NOT NULL,
																																					orderby INTEGER);

--------------------------------------------------------------------------------------------------
-- roles

CREATE TABLE IF NOT EXISTS roles ( id SERIAL PRIMARY KEY,
																																			name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																			description text, type role_type,
																																			status BOOLEAN DEFAULT TRUE,
																																			created_by CHARACTER VARYING(100) NULL,
																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																			updated_by CHARACTER VARYING(100) NULL,
																																			updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------
-- user_roles

CREATE TABLE IF NOT EXISTS user_roles
				( id SERIAL PRIMARY KEY,
						user_id INTEGER NOT NULL,
						role_id INTEGER NOT NULL,
						zone_id INTEGER NOT NULL,
						reporting_user_id INTEGER, availability role_availability DEFAULT 'FULL_TIME',
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
					FOREIGN KEY (role_id) REFERENCES roles(id),
					FOREIGN KEY (zone_id) REFERENCES zones(id),
					FOREIGN KEY (reporting_user_id) REFERENCES users(id));

--------------------------------------------------------------------------------------------------
--subcourses -notes one type child of course

CREATE TABLE IF NOT EXISTS subcourses ( id SERIAL PRIMARY KEY,
																																								course_id INTEGER NOT NULL,
																																								course_config_id INTEGER, name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																								code CHARACTER VARYING(50) NOT NULL UNIQUE,
																																								is_job_guarantee BOOLEAN DEFAULT FALSE,
																																								total INTEGER NOT NULL,
																																								duration numeric(5,2),
																																								installment INTEGER, shining_sheet CHARACTER VARYING(255),
																																								status BOOLEAN DEFAULT TRUE,
																																								banner character varying(255),
																																								created_by CHARACTER VARYING(100) NULL,
																																								created_date TIMESTAMP WITHOUT TIME ZONE,
																																								updated_by CHARACTER VARYING(100) NULL,
																																								updated_date TIMESTAMP WITHOUT TIME ZONE,
																																							FOREIGN KEY (course_id) REFERENCES course(id),
																																							FOREIGN KEY (course_config_id) REFERENCES course_configs(id));

--------------------------------------------------------------------------------------------------
-- subcourse_fees

CREATE TABLE IF NOT EXISTS subcourse_fees
				( id SERIAL PRIMARY KEY,
						subcourse_id INTEGER NOT NULL,
						fee_type_id INTEGER NOT NULL,
						amount INTEGER, created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
					FOREIGN KEY (subcourse_id) REFERENCES subcourses(id) ON DELETE CASCADE,
					FOREIGN KEY (fee_type_id) REFERENCES lookups(id));

--------------------------------------------------------------------------------------------------
/* Create Table Shining Sheet */
CREATE TABLE IF NOT EXISTS shining_sheet ( id SERIAL PRIMARY KEY,
																																											subcourse_id INTEGER NOT NULL,
																																											name CHARACTER VARYING(100),
																																											num_of_project NUMERIC(3,2),
																																											marks NUMERIC(3,2),
																																											duration NUMERIC(3,2),
																																											status BOOLEAN DEFAULT TRUE,
																																											created_by CHARACTER VARYING(100) NULL,
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											updated_by CHARACTER VARYING(100) NULL,
																																											updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS branches ( id SERIAL PRIMARY KEY,
																																						zone_id INTEGER NOT NULL,
																																						name CHARACTER VARYING(100),
																																						code CHARACTER VARYING(100) UNIQUE,
																																						title CHARACTER VARYING(150),
																																						email CHARACTER VARYING(100),
																																						landline_no CHARACTER VARYING(15),
																																						mobile_one CHARACTER VARYING(15),
																																						mobile_two CHARACTER VARYING(15),
																																						website CHARACTER VARYING(50),
																																						pan_no CHARACTER VARYING(25),
																																						cin CHARACTER VARYING(25),
																																						gst_no CHARACTER VARYING(25),
																																						bank_name CHARACTER VARYING(50),
																																						account_holder_name CHARACTER VARYING(50),
																																						account_no CHARACTER VARYING(50),
																																						ifsc CHARACTER VARYING(15),
																																						account_type CHARACTER VARYING(25),
																																						logo text, address CHARACTER VARYING(255),
																																						country CHARACTER VARYING(100),
																																						state CHARACTER VARYING(100),
																																						city CHARACTER VARYING(100),
																																						area CHARACTER VARYING(100),
																																						isgst BOOLEAN DEFAULT false,
																																						status BOOLEAN DEFAULT TRUE,
																																						enrolment_no_sequence INTEGER DEFAULT 0,
																																						invoice_no_sequence INTEGER DEFAULT 0,
																																						iscomposition BOOLEAN DEFAULT false,
																																						examportal_url VARCHAR(255),
																																						examportal_email VARCHAR(100),
																																						examportal_password VARCHAR(10),
																																						examportal_unique_id VARCHAR(30) UNIQUE,
																																						examportal_status BOOLEAN DEFAULT false,
																																						examportal_branch_id CHARACTER VARYING(255),
																																						invoice_format character varying(100),
																																						created_by CHARACTER VARYING(100) NULL,
																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																						updated_by CHARACTER VARYING(100) NULL,
																																						updated_date TIMESTAMP WITHOUT TIME ZONE,
																																					FOREIGN KEY (zone_id) REFERENCES zones(id) );

--------------------------------------------------------------------------------------------------
/* create Table */
CREATE TABLE IF NOT EXISTS packages ( id SERIAL PRIMARY KEY,
																																						department_id INTEGER NOT NULL,
																																						subdepartment_id INTEGER NOT NULL,
																																						course_config_id INTEGER, name CHARACTER VARYING(100) UNIQUE,
																																						code CHARACTER VARYING(100) UNIQUE,
																																						is_job_guarantee BOOLEAN DEFAULT FALSE,
																																						total INTEGER, duration NUMERIC(5,2),
																																						installment integer, banner character varying(255),
																																						status BOOLEAN DEFAULT TRUE,
																																						created_by CHARACTER VARYING(100) NULL,
																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																						updated_by CHARACTER VARYING(100) NULL,
																																						updated_date TIMESTAMP WITHOUT TIME ZONE,
																																					FOREIGN KEY (department_id) REFERENCES departments(id),
																																					FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
																																					FOREIGN KEY (course_config_id) REFERENCES course_configs(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS package_fees
				( id SERIAL PRIMARY KEY,
						package_id INTEGER NOT NULL,
						fee_type_id INTEGER NOT NULL,
						amount INTEGER, created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
					FOREIGN KEY (fee_type_id) REFERENCES lookups(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS package_subcourses
				( id SERIAL PRIMARY KEY,
						package_id INTEGER NOT NULL,
						subcourse_id INTEGER NOT NULL,
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
					FOREIGN KEY (subcourse_id) REFERENCES subcourses(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS package_branches
				( id SERIAL PRIMARY KEY,
						branch_id INTEGER NOT NULL,
						package_id INTEGER NOT NULL,
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (branch_id) REFERENCES branches(id),
					FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE);

---------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS template_shining_sheet( id serial PRIMARY KEY,
																																																			subcourse_id integer NOT NULL,
																																																			name CHARACTER VARYING(255) NOT NULL,
																																																			description TEXT, status BOOLEAN DEFAULT true,
																																																			created_by CHARACTER VARYING(100),
																																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																																			updated_by CHARACTER VARYING(100),
																																																			updated_date TIMESTAMP WITHOUT TIME ZONE,
																																																		FOREIGN KEY (subcourse_id) REFERENCES subcourses(id));

---------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS template_shining_sheet_topics
				( id serial PRIMARY KEY,
						template_singing_sheet_id integer NOT NULL,
						parent_id integer, name CHARACTER VARYING(100),
						description TEXT, sequence numeric(5,2),
						type subcourse_topic_type,
						duration numeric(5,2),
						marks numeric(5,2),
						planned_start_date date, status BOOLEAN DEFAULT true,
						created_by CHARACTER VARYING(100),
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100),
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (template_singing_sheet_id) REFERENCES template_shining_sheet(id) ON DELETE CASCADE,
					FOREIGN KEY (parent_id) REFERENCES template_shining_sheet_topics(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS batches ( id SERIAL PRIMARY KEY,
																																					branch_id INTEGER NOT NULL,
																																					course_id INTEGER NOT NULL,
																																					subcourse_id INTEGER NOT NULL,
																																					user_id INTEGER NOT NULL,
																																					code CHARACTER VARYING(100) NOT NULL UNIQUE,
																																					name CHARACTER VARYING(100) NOT NULL,
																																					duration NUMERIC(5,2),
																																					start_date date, end_date date, batches_status batches_status NOT NULL,
																																					status BOOLEAN DEFAULT TRUE,
																																					created_by CHARACTER VARYING(100) NULL,
																																					created_date TIMESTAMP WITHOUT TIME ZONE,
																																					updated_by CHARACTER VARYING(100) NULL,
																																					updated_date TIMESTAMP WITHOUT TIME ZONE,
																																					day_one BOOLEAN DEFAULT false,
																																					day_two BOOLEAN DEFAULT false,
																																					day_three BOOLEAN DEFAULT false,
																																					day_four BOOLEAN DEFAULT false,
																																					day_five BOOLEAN DEFAULT false,
																																					day_six BOOLEAN DEFAULT false,
																																					day_seven BOOLEAN DEFAULT false,
																																					template_id INTEGER, batch_time NUMERIC(5,2),
																																					number_of_days INTEGER,
																																				FOREIGN KEY (branch_id) REFERENCES branches(id),
																																				FOREIGN KEY (course_id) REFERENCES course(id),
																																				FOREIGN KEY (subcourse_id) REFERENCES subcourses(id),
																																				FOREIGN KEY (user_id) REFERENCES users(id),
																																				FOREIGN KEY (template_id) REFERENCES template_shining_sheet(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS branch_departments
				( id SERIAL PRIMARY KEY,
						branch_id INTEGER NOT NULL,
						department_id INTEGER NOT NULL,
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (branch_id) REFERENCES branches(id),
					FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_details( id SERIAL PRIMARY KEY,
																																												gr_id SERIAL, aadhar_card_no character varying(12) UNIQUE,
																																												passport_no character varying(12) UNIQUE,
																																												is_nri boolean DEFAULT false,
																																												first_name character varying(100),
																																												middle_name character varying(100),
																																												last_name character varying(100),
																																												email character varying(100),
																																												mobile_no character varying(15),
																																												alternate_no character varying(15),
																																												dob date, gender gender_type NOT NULL,
																																												father_name character varying(100),
																																												father_email character varying(100),
																																												father_mobile_no character varying(100),
																																												father_occupation character varying(100),
																																												father_income NUMERIC(10, 2),
																																												mother_name character varying(100),
																																												mother_email character varying(100),
																																												mother_mobile_no character varying(100),
																																												mother_occupation character varying(100),
																																												mother_income NUMERIC(10, 2),
																																												created_by character varying(100),
																																												created_date TIMESTAMP WITHOUT TIME ZONE,
																																												updated_by character varying(100),
																																												updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admissions ( id SERIAL PRIMARY KEY,
																																								gr_id INTEGER NOT NULL,
																																								source_id INTEGER, student_id INTEGER,
																																							FOREIGN KEY (student_id) REFERENCES student_details(id),
																																								branch_id INTEGER,
																																							FOREIGN KEY (branch_id) REFERENCES branches(id),
																																								concession boolean DEFAULT false,
																																								concession_percentage NUMERIC(5, 2) DEFAULT 0,
																																								department_id INTEGER,
																																							FOREIGN KEY (department_id) REFERENCES departments(id),
																																								subdepartment_id INTEGER,
																																							FOREIGN KEY (subdepartment_id) REFERENCES subdepartments(id),
																																								package_id INTEGER,
																																							FOREIGN KEY (package_id) REFERENCES packages(id),
																																								starting_course_id INTEGER, course_category course_type NOT NULL,
																																								batch_id INTEGER,
																																							FOREIGN KEY (batch_id) REFERENCES batches(id),
																																								user_id INTEGER,
																																							FOREIGN KEY (user_id) REFERENCES users(id),
																																								enrollment_number character varying(100),
																																								admission_number SERIAL, year INTEGER NOT NULL,
																																								aadhar_card_no character varying(12),
																																								passport_no character varying(12),
																																								is_nri boolean DEFAULT false,
																																								first_name character varying(100),
																																								middle_name character varying(100),
																																								last_name character varying(100),
																																								email character varying(100),
																																								mobile_no character varying(15),
																																								alternate_no character varying(15),
																																								dob date, gender gender_type NOT NULL,
																																								father_name character varying(100),
																																								father_email character varying(100),
																																								father_mobile_no character varying(100),
																																								father_occupation character varying(100),
																																								father_income NUMERIC(10, 2) DEFAULT 0,
																																								mother_name character varying(100),
																																								mother_email character varying(100),
																																								mother_mobile_no character varying(100),
																																								mother_occupation character varying(100),
																																								mother_income NUMERIC(10, 2) DEFAULT 0,
																																								admission_amount NUMERIC(10, 2) DEFAULT 0,
																																								discount_amount NUMERIC(10, 2) DEFAULT 0,
																																								settlement_amount NUMERIC(10, 2) DEFAULT 0,
																																								grade character varying(100),
																																								no_of_installment INTEGER, registration_fees NUMERIC(10, 2) DEFAULT 0,
																																								payable_amount NUMERIC(10, 2) DEFAULT 0,
																																								present_country character varying(100),
																																								present_state character varying(100),
																																								present_city character varying(100),
																																								present_area character varying(100),
																																								present_pin_code character varying(15),
																																								present_flate_house_no character varying(100),
																																								present_area_street character varying(100),
																																								present_landmark character varying(100),
																																								permanent_country character varying(100),
																																								permanent_state character varying(100),
																																								permanent_city character varying(100),
																																								permanent_area character varying(100),
																																								permanent_pin_code character varying(15),
																																								permanent_flate_house_no character varying(100),
																																								permanent_area_street character varying(100),
																																								permanent_landmark character varying(100),
																																								school_collage_name character varying(100),
																																								school_clg_country character varying(100),
																																								school_clg_state character varying(100),
																																								school_clg_city character varying(100),
																																								school_clg_area character varying(100),
																																								send_to_father_email boolean DEFAULT false,
																																								send_to_father_sms boolean DEFAULT false,
																																								admission_type character varying(100),
																																								send_to_sms boolean DEFAULT false,
																																								send_to_email boolean DEFAULT false,
																																								scl_clg_type school_clg_type,
																																								status admission_status NOT NULL,
																																								start_date date, end_date date, comment text, ptm_day INTEGER DEFAULT 0,
																																								ptm_grace_after INTEGER DEFAULT 0,
																																								ptm_grace_before INTEGER DEFAULT 0,
																																								cv_day INTEGER DEFAULT 0,
																																								cv_grace_after INTEGER DEFAULT 0,
																																								v_grace_before INTEGER DEFAULT 0,
																																								es_day INTEGER DEFAULT 0,
																																								es_grace_after INTEGER DEFAULT 0,
																																								es_grace_before INTEGER DEFAULT 0,
																																								created_by character varying(100),
																																								created_date TIMESTAMP WITHOUT TIME ZONE,
																																								updated_by character varying(100),
																																								updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_subcourse( id SERIAL PRIMARY KEY,
																																																admission_id integer NOT NULL,
																																															FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																course_id integer,
																																															FOREIGN KEY (course_id) REFERENCES course(id),
																																																subcourse_id integer,
																																															FOREIGN KEY (subcourse_id) REFERENCES subcourses(id),
																																																package_id integer,
																																															FOREIGN KEY (package_id) REFERENCES packages(id),
																																																batch_id integer,
																																															FOREIGN KEY (batch_id) REFERENCES batches(id),
																																																user_id integer,
																																															FOREIGN KEY (user_id) REFERENCES users(id),
																																																course_category course_type NOT NULL,
																																																subcourse_status admission_subcourse_status,
																																																assigned_date date , completed_date date , is_starting_course boolean DEFAULT false,
																																																total INTEGER, comment TEXT, created_by character varying(100),
																																																created_date TIMESTAMP WITHOUT TIME ZONE,
																																																updated_by character varying(100),
																																																updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_packages( id SERIAL PRIMARY KEY,
																																															admission_id integer NOT NULL,
																																														FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																															package_id integer,
																																														FOREIGN KEY (package_id) REFERENCES packages(id),
																																															is_job_guarantee boolean DEFAULT false,
																																															total integer, duration NUMERIC(5, 2),
																																															completed_date date, created_by character varying(100),
																																															created_date TIMESTAMP WITHOUT TIME ZONE,
																																															updated_by character varying(100),
																																															updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_subcourse_fees( id SERIAL PRIMARY KEY,
																																																					subcourse_id integer,
																																																				FOREIGN KEY (subcourse_id) REFERENCES subcourses(id),
																																																					fee_type_id integer,
																																																				FOREIGN KEY (fee_type_id) REFERENCES lookups(id),
																																																					admission_id integer NOT NULL,
																																																				FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																					amount integer, completed_date date, created_by character varying(100),
																																																					created_date TIMESTAMP WITHOUT TIME ZONE,
																																																					updated_by character varying(100),
																																																					updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_package_fees( id SERIAL PRIMARY KEY,
																																																			package_id integer,
																																																		FOREIGN KEY (package_id) REFERENCES packages(id),
																																																			fee_type_id integer,
																																																		FOREIGN KEY (fee_type_id) REFERENCES lookups(id),
																																																			admission_id integer NOT NULL,
																																																		FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																			amount integer, completed_date date, created_by character varying(100),
																																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																																			updated_by character varying(100),
																																																			updated_date TIMESTAMP WITHOUT TIME ZONE);


CREATE TABLE IF NOT EXISTS admission_fees ( id SERIAL PRIMARY KEY,
																																												admission_id integer NOT NULL,
																																											FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																												fee_type_id integer,
																																											FOREIGN KEY (fee_type_id) REFERENCES lookups(id),
																																												amount NUMERIC(10, 2),
																																												paid_amount NUMERIC(10, 2) DEFAULT 0,
																																												created_by character varying(100),
																																												created_date TIMESTAMP WITHOUT TIME ZONE,
																																												updated_by character varying(100),
																																												updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_installments( id SERIAL PRIMARY KEY,
																																																			admission_id integer NOT NULL,
																																																		FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																			branch_id integer,
																																																		FOREIGN KEY (branch_id) REFERENCES branches(id),
																																																			installment_date date, commitment_date date, installment_no numeric, installment_amount NUMERIC(10, 2),
																																																			due_amount NUMERIC(10, 2),
																																																			pay_amount NUMERIC(10, 2),
																																																			pay_date date, payment_mode payment_mode_type,
																																																			admission_status admission_status,
																																																			bank_name character varying(100),
																																																			bank_branch_name character varying(100),
																																																			transaction_no character varying(100),
																																																			transaction_date date, cheque_no character varying(100),
																																																			cheque_date date, cheque_status cheque_type,
																																																			cheque_holder_name character varying(100),
																																																			send_email_student boolean DEFAULT false,
																																																			send_sms_student boolean DEFAULT false,
																																																			send_email_parents boolean DEFAULT false,
																																																			send_sms_parents boolean DEFAULT false,
																																																			remarks text, status installment_status DEFAULT 'UNPAID',
																																																			created_by character varying(100),
																																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																																			updated_by character varying(100),
																																																			updated_date TIMESTAMP WITHOUT TIME ZONE);

----------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_status_histories( id SERIAL PRIMARY KEY,
																																																							admission_id integer NOT NULL,
																																																						FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																							status admission_status NOT NULL,
																																																							comment TEXT, start_date date, end_date date, created_by character varying(100),
																																																							created_date TIMESTAMP WITHOUT TIME ZONE);

---------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_remarks( id SERIAL PRIMARY KEY,
																																														admission_id integer NOT NULL,
																																													FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																														branch_id integer,
																																													FOREIGN KEY (branch_id) REFERENCES branches(id),
																																														labels character varying(100),
																																														rating character varying(100),
																																														remarks text, status admission_status,
																																														type remarks_type NOT NULL,
																																														created_by character varying(100),
																																														created_date TIMESTAMP WITHOUT TIME ZONE,
																																														updated_by character varying(100),
																																														updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admission_documents( id SERIAL PRIMARY KEY,
																																																admission_id integer NOT NULL,
																																																photos character varying(100),
																																																aadhar_card character varying(100),
																																																form character varying(100),
																																																last_passing_marksheet character varying(100),
																																																created_by character varying(100),
																																																created_date TIMESTAMP WITHOUT TIME ZONE,
																																																updated_by character varying(100),
																																																updated_date TIMESTAMP WITHOUT TIME ZONE,
																																															FOREIGN KEY (admission_id) REFERENCES admissions(id));


CREATE TABLE IF NOT EXISTS admission_other_documents( id SERIAL PRIMARY KEY,
																																																						admission_id integer NOT NULL,
																																																					FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																																						name CHARACTER VARYING(100) NOT NULL,
																																																						path CHARACTER VARYING(100) NOT NULL,
																																																						created_by character varying(100),
																																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																																						updated_by character varying(100),
																																																						updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS source( id SERIAL PRIMARY KEY,
																																			name character varying(100),
																																			created_by character varying(100),
																																			created_date TIMESTAMP WITHOUT TIME ZONE,
																																			updated_by character varying(100),
																																			updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payment_mode( id SERIAL PRIMARY KEY,
																																									name character varying(100),
																																									sequence integer, created_by character varying(100),
																																									created_date TIMESTAMP WITHOUT TIME ZONE,
																																									updated_by character varying(100),
																																									updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS label_remarks ( id SERIAL PRIMARY KEY,
																																											name CHARACTER VARYING(100) NOT NULL,
																																											status BOOLEAN DEFAULT TRUE,
																																											created_by CHARACTER VARYING(100) NULL,
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											updated_by CHARACTER VARYING(100) NULL,
																																											updated_date TIMESTAMP WITHOUT TIME ZONE);

------------------------------Master Of Expense(Categories)-------------------------------------

CREATE TABLE IF NOT EXISTS categories( id serial PRIMARY KEY,
																																							name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																							status BOOLEAN DEFAULT true,
																																							created_by CHARACTER VARYING(100),
																																							created_date TIMESTAMP WITHOUT TIME ZONE,
																																							updated_by CHARACTER VARYING(100),
																																							updated_date TIMESTAMP WITHOUT TIME ZONE);

-----------------------------Master Of Expense(SubCategories)-----------------------------------

CREATE TABLE IF NOT EXISTS sub_categories( id SERIAL PRIMARY KEY,
																																											category_id INT NOT NULL,
																																											name CHARACTER VARYING(100),
																																											status BOOLEAN DEFAULT true,
																																											created_by CHARACTER VARYING(100),
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											updated_by CHARACTER VARYING(100),
																																											updated_date TIMESTAMP WITHOUT TIME ZONE,
																																										FOREIGN KEY (category_id) REFERENCES categories(id)); -------------------------------------Expense Master-----------------------------------------------

CREATE TABLE IF NOT EXISTS expense_master( id SERIAL PRIMARY KEY,
																																											department_id INTEGER NOT NULL,
																																											name CHARACTER VARYING(100) NOT NULL UNIQUE,
																																											status BOOLEAN DEFAULT true,
																																											created_by character varying(100),
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											updated_by character varying(100),
																																											updated_date TIMESTAMP WITHOUT TIME ZONE,
																																										FOREIGN KEY (department_id) REFERENCES departments(id));

/* create new table invoice */ --------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS invoices ( id SERIAL PRIMARY KEY,
																																						admission_id INTEGER NOT NULL,
																																						branch_id INTEGER NOT NULL,
																																						installment_id INTEGER NOT NULL,
																																						invoice_no character varying(100),
																																						invoice_date date, pay_amount INTEGER, isgst BOOLEAN DEFAULT false,
																																						sgst NUMERIC(10, 2),
																																						cgst NUMERIC(10, 2),
																																						total_tax NUMERIC(10, 2),
																																						iscomposition BOOLEAN DEFAULT false,
																																						percentage INTEGER, r_w BOOLEAN DEFAULT true,
																																						status BOOLEAN DEFAULT TRUE,
																																						created_by CHARACTER VARYING(100) NULL,
																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																						updated_by CHARACTER VARYING(100) NULL,
																																						updated_date TIMESTAMP WITHOUT TIME ZONE,
																																					FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																					FOREIGN KEY (branch_id) REFERENCES branches(id),
																																					FOREIGN KEY (installment_id) REFERENCES admission_installments(id));


CREATE TABLE IF NOT EXISTS invoice_fees ( id SERIAL PRIMARY KEY,
																																										admission_id integer NOT NULL,
																																									FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																										invoice_id integer NOT NULL,
																																									FOREIGN KEY (invoice_id) REFERENCES invoices(id),
																																										fee_type_id integer,
																																									FOREIGN KEY (fee_type_id) REFERENCES lookups(id),
																																										amount NUMERIC(10, 2),
																																										created_by character varying(100),
																																										created_date TIMESTAMP WITHOUT TIME ZONE,
																																										updated_by character varying(100),
																																										updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------------------------------------------------------------------------------------------
/* subcourse_topics table scripts */
CREATE TABLE IF NOT EXISTS subcourse_topics ( id SERIAL PRIMARY KEY,
																																														subcourse_id INTEGER NOT NULL,
																																														name CHARACTER VARYING(255),
																																														sequence NUMERIC(5,2),
																																														status BOOLEAN DEFAULT TRUE,
																																														type subcourse_topic_type,
																																														duration NUMERIC(5,2),
																																														marks NUMERIC(5,2),
																																														created_date TIMESTAMP WITHOUT TIME ZONE,
																																														created_by CHARACTER VARYING(100) NULL,
																																														updated_date TIMESTAMP WITHOUT TIME ZONE,
																																														updated_by CHARACTER VARYING(100) NULL,
																																													FOREIGN KEY (subcourse_id) REFERENCES subcourses(id));

--------------------------------------------------------------------------------------------------
/* sub_topics table scripts */
CREATE TABLE IF NOT EXISTS sub_topics
				( id SERIAL PRIMARY KEY,
						topic_id INTEGER NOT NULL,
						description TEXT, sequence NUMERIC(5,2),
						std_res_link CHARACTER VARYING(512),
						faculty_res_link CHARACTER VARYING(512),
						status BOOLEAN DEFAULT TRUE,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						created_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
					FOREIGN KEY (topic_id) REFERENCES subcourse_topics(id) ON DELETE CASCADE);

--------------------------------------------------------------------------------------------------
/* create table Admission_Transfer */
CREATE TABLE IF NOT EXISTS admission_transfer ( id SERIAL PRIMARY KEY,
																																																admission_id INTEGER NOT NULL,
																																																branch_in_id INTEGER NOT NULL,
																																																branch_out_id INTEGER NOT NULL,
																																																subcourse_id INTEGER NOT NULL,
																																																batch_id INTEGER NOT NULL,
																																																comment TEXT, rejected_comment TEXT, rejected_date date, status transfer_type,
																																																created_by CHARACTER VARYING(100) NULL,
																																																created_date TIMESTAMP WITHOUT TIME ZONE,
																																																updated_by CHARACTER VARYING(100) NULL,
																																																updated_date TIMESTAMP WITHOUT TIME ZONE,
																																															FOREIGN KEY (admission_id) REFERENCES admissions(id),
																																															FOREIGN KEY (branch_in_id) REFERENCES branches(id),
																																															FOREIGN KEY (branch_out_id) REFERENCES branches(id),
																																															FOREIGN KEY (subcourse_id) REFERENCES subcourses(id),
																																															FOREIGN KEY (batch_id) REFERENCES batches(id));

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS branch_course
				( id SERIAL PRIMARY KEY,
						branch_id INTEGER NOT NULL,
						course_id INTEGER NOT NULL,
						created_by CHARACTER VARYING(100) NULL,
						created_date TIMESTAMP WITHOUT TIME ZONE,
						updated_by CHARACTER VARYING(100) NULL,
						updated_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (branch_id) REFERENCES branches(id),
					FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE );

--------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS expense( id SERIAL PRIMARY KEY,
																																				admission_id INTEGER, branch_id INTEGER NOT NULL,
																																				paying_amount NUMERIC(10,2),
																																				full_name CHARACTER VARYING(100),
																																				payable_for pay_for_type,
																																				pay_date DATE, comment text, payment_mode payment_mode_type,
																																				bank_name CHARACTER VARYING(100),
																																				bank_branch_name CHARACTER VARYING(100),
																																				transaction_no CHARACTER VARYING(100),
																																				transaction_date DATE, cheque_no CHARACTER VARYING(100),
																																				cheque_status cheque_type,
																																				cheque_date DATE, cheque_holder_name CHARACTER VARYING(100),
																																				paid_by text, category_id INTEGER, subcategory_id INTEGER, department_id INTEGER, status BOOLEAN DEFAULT true,
																																				created_by character varying(100),
																																				created_date TIMESTAMP WITHOUT TIME ZONE,
																																				updated_by CHARACTER VARYING(100),
																																				updated_date TIMESTAMP WITHOUT TIME ZONE,
																																			FOREIGN KEY (branch_id) REFERENCES branches(id),
																																			FOREIGN KEY(admission_id) REFERENCES admissions(id),
																																			FOREIGN KEY (category_id) REFERENCES categories(id),
																																			FOREIGN KEY (subcategory_id) REFERENCES sub_categories(id),
																																			FOREIGN KEY (department_id) REFERENCES departments(id));

/* On Action Batch Start And Generated Shining Sheet */
CREATE TABLE IF NOT EXISTS batch_singing_sheet( id SERIAL PRIMARY KEY,
																																																batch_id INTEGER NOT NULL,
																																																parent_id INTEGER NULL,
																																																name character varying(255),
																																																description TEXT, sequence numeric(5,2),
																																																type subcourse_topic_type,
																																																duration numeric(5,2),
																																																marks numeric(5,2),
																																																created_by character varying(100),
																																																created_date TIMESTAMP WITHOUT TIME ZONE,
																																																updated_by character varying(100),
																																																updated_date TIMESTAMP WITHOUT TIME ZONE,
																																															FOREIGN KEY (batch_id) REFERENCES batches(id),
																																															FOREIGN KEY (parent_id) REFERENCES subcourse_topics(id));


CREATE TABLE IF NOT EXISTS batch_faculty_attendances( id SERIAL PRIMARY KEY,
																																																						batch_singing_sheet_id INTEGER NOT NULL,
																																																						user_id INTEGER NOT NULL,
																																																						actual_date date, start_time numeric(5,2),
																																																						end_time numeric(5,2),
																																																						type session_type DEFAULT 'REGULAR',
																																																						created_by character varying(100),
																																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																																						updated_by character varying(100),
																																																						updated_date TIMESTAMP WITHOUT TIME ZONE,
																																																					FOREIGN KEY (batch_singing_sheet_id) REFERENCES batch_singing_sheet(id),
																																																					FOREIGN KEY (user_id) REFERENCES users(id));


CREATE TABLE IF NOT EXISTS batch_student_attendances( id SERIAL PRIMARY KEY,
																																																						batch_singing_sheet_id INTEGER NOT NULL,
																																																						batch_faculty_attendance_id INTEGER NOT NULL,
																																																						admission_id INTEGER NOT NULL,
																																																						is_present boolean DEFAULT TRUE,
																																																						feedback feedback_type,
																																																						remarks TEXT, is_auto BOOLEAN DEFAULT false,
																																																						created_by character varying(100),
																																																						created_date TIMESTAMP WITHOUT TIME ZONE,
																																																						updated_by character varying(100),
																																																						updated_date TIMESTAMP WITHOUT TIME ZONE,
																																																					FOREIGN KEY (batch_singing_sheet_id) REFERENCES batch_singing_sheet(id),
																																																					FOREIGN KEY (batch_faculty_attendance_id) REFERENCES batch_faculty_attendances(id),
																																																					FOREIGN KEY (admission_id) REFERENCES admissions(id));

-- pages

CREATE TABLE IF NOT EXISTS pages( id SERIAL PRIMARY KEY,
																																		page_code VARCHAR(100) NOT NULL UNIQUE,
																																		name VARCHAR(100) NOT NULL,
																																		url character varying(255),
																																		parent_page_id INTEGER, sequence INTEGER, active BOOLEAN NOT NULL DEFAULT true,
																																		created_date TIMESTAMP WITHOUT TIME ZONE,
																																		updated_date TIMESTAMP WITHOUT TIME ZONE,
																																	FOREIGN KEY (parent_page_id) REFERENCES pages(id));

-- actions

CREATE TABLE IF NOT EXISTS actions( id SERIAL PRIMARY KEY,
																																				action_code VARCHAR(100) NOT NULL UNIQUE,
																																				name VARCHAR(100) NOT NULL,
																																				created_date TIMESTAMP WITHOUT TIME ZONE,
																																				updated_date TIMESTAMP WITHOUT TIME ZONE);

-- page_actions

CREATE TABLE IF NOT EXISTS page_actions
				( id SERIAL PRIMARY KEY,
						page_id INTEGER REFERENCES "pages" NOT NULL,
						action_id INTEGER REFERENCES "actions" NOT NULL,
						tag VARCHAR(100) NOT NULL UNIQUE,
					FOREIGN KEY (page_id) REFERENCES pages(id) ON UPDATE NO ACTION ON DELETE CASCADE,
					FOREIGN KEY (action_id) REFERENCES actions(id),
						UNIQUE (page_id,
															action_id));

-- role_permissions

CREATE TABLE IF NOT EXISTS role_permissions
				( id SERIAL PRIMARY KEY,
						role_id integer, page_action_id integer, created_by integer, created_date TIMESTAMP WITHOUT TIME ZONE,
					FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE NO ACTION ON DELETE CASCADE,
					FOREIGN KEY (page_action_id) REFERENCES page_actions(id) ON UPDATE NO ACTION ON DELETE CASCADE,
					FOREIGN KEY (created_by) REFERENCES users(id));


CREATE TABLE IF NOT EXISTS country ( id SERIAL PRIMARY KEY,
																																					name character varying(100),
																																					status boolean DEFAULT true,
																																					created_by character varying(100),
																																					created_date timestamp without time zone,
																																					updated_by character varying(100),
																																					updated_date timestamp without time zone);


CREATE TABLE IF NOT EXISTS state ( id SERIAL PRIMARY KEY,
																																			country_id integer NOT NULL,
																																			name character varying(100),
																																			status boolean DEFAULT true,
																																			created_by character varying(100),
																																			created_date timestamp without time zone,
																																			updated_by character varying(100),
																																			updated_date timestamp without time zone,
																																		FOREIGN KEY (country_id) REFERENCES country(id));


CREATE TABLE IF NOT EXISTS city ( id SERIAL PRIMARY KEY,
																																		country_id integer NOT NULL,
																																		state_id integer NOT NULL,
																																		name character varying(100),
																																		status boolean DEFAULT true,
																																		created_by character varying(100),
																																		created_date timestamp without time zone,
																																		updated_by character varying(100),
																																		updated_date timestamp without time zone,
																																	FOREIGN KEY (country_id) REFERENCES country(id),
																																	FOREIGN KEY (state_id) REFERENCES state(id));


CREATE TABLE IF NOT EXISTS area ( id SERIAL PRIMARY KEY,
																																		country_id integer NOT NULL,
																																		state_id integer NOT NULL,
																																		city_id integer NOT NULL,
																																		name character varying(100),
																																		pincode character varying(6),
																																		status boolean DEFAULT true,
																																		created_by character varying(100),
																																		created_date timestamp without time zone,
																																		updated_by character varying(100),
																																		updated_date timestamp without time zone,
																																	FOREIGN KEY (country_id) REFERENCES country(id),
																																	FOREIGN KEY (state_id) REFERENCES state(id),
																																	FOREIGN KEY (city_id) REFERENCES city(id) );

-- Create table for configurations

CREATE TABLE IF NOT EXISTS configurations ( id SERIAL PRIMARY KEY,
																																												name character varying(255),
																																												value character varying(255),
																																												description character varying(255),
																																												code character varying(100) UNIQUE,
																																												modified_date timestamp without time zone,
																																												modified_by integer);

-- create table cheque_comments

CREATE TABLE IF NOT EXISTS cheque_comments ( id SERIAL PRIMARY KEY,
																																													admission_installments_id integer NOT NULL,
																																												FOREIGN KEY (admission_installments_id) REFERENCES admission_installments(id),
																																													cheque_status cheque_type,
																																													comment text, created_by character varying(100),
																																													created_date TIMESTAMP WITHOUT TIME ZONE,
																																													updated_by character varying(100),
																																													updated_date TIMESTAMP WITHOUT TIME ZONE);


CREATE TABLE IF NOT EXISTS students_otps ( id SERIAL PRIMARY KEY,
																																											mobile_no character varying(10) NOT NULL,
																																											code character varying(6) NOT NULL,
																																											expire_date timestamp without time zone,
																																											created_date timestamp without time zone);


CREATE TABLE IF NOT EXISTS students_device_token ( id SERIAL PRIMARY KEY,
																																																			mobile_no character varying(10) NOT NULL,
																																																			device_token character varying(255) NOT NULL,
																																																			type token_type NOT NULL,
																																																			auth auth_type,
																																																			created_date timestamp without time zone);

--   create table app_banner

CREATE TABLE IF NOT EXISTS app_banner( id SERIAL PRIMARY KEY,
																																							front_banner character varying(255),
																																							created_by character varying(100),
																																							created_date TIMESTAMP WITHOUT TIME ZONE,
																																							updated_by character varying(100),
																																							updated_date TIMESTAMP WITHOUT TIME ZONE);

--------------- create a new table user_role_departments--------------------------

CREATE TABLE IF NOT EXISTS user_role_departments
				( id SERIAL PRIMARY KEY,
						user_role_id INTEGER NOT NULL,
						department_id INTEGER NOT NULL,
					FOREIGN KEY (user_role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
					FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE);

--------------- create a new table user_role_courses--------------------------

CREATE TABLE IF NOT EXISTS user_role_courses
				( id SERIAL PRIMARY KEY,
						user_role_id INTEGER NOT NULL,
						course_id INTEGER NOT NULL,
					FOREIGN KEY (user_role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
					FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE);


CREATE TABLE IF NOT EXISTS course_configs ( id SERIAL PRIMARY KEY,
																																												ptm_day INTEGER default 0,
																																												ptm_grace_after INTEGER default 0,
																																												ptm_grace_before INTEGER default 0,
																																												cv_day INTEGER default 0,
																																												cv_grace_after INTEGER default 0,
																																												cv_grace_before INTEGER default 0,
																																												es_day INTEGER default 0,
																																												es_grace_after INTEGER default 0,
																																												es_grace_before INTEGER default 0,
																																												created_by CHARACTER VARYING(100) NULL,
																																												created_date TIMESTAMP WITHOUT TIME ZONE,
																																												updated_by CHARACTER VARYING(100) NULL,
																																												updated_date TIMESTAMP WITHOUT TIME ZONE);

-- ptm_student_report_cards create table

CREATE TABLE IF NOT EXISTS ptm_student_report_cards( id serial primary key,
																																																					admission_id INTEGER NOT NULL,
																																																					uniform uniform_type DEFAULT null,
																																																					discipline discipline_type DEFAULT NULL,
																																																					behaviour_with_faculty int DEFAULT 0,
																																																					behaviour_with_management int DEFAULT 0,
																																																					behaviour_with_student int default 0,
																																																					remark text, total_days int, attendance_days INT, running_course TEXT, completed_course TEXT, work_submission TEXT, visiting_person CHARACTER VARYING(100),
																																																					relation_with_student relation_type DEFAULT NULL,
																																																					visitor_mobile_no CHARACTER VARYING(15) DEFAULT NULL,
																																																					visiting_datetime TIMESTAMP,
																																																					visitor_remark text, status status_type DEFAULT NULL,
																																																					created_by CHARACTER VARYING(100) NULL,
																																																					created_date TIMESTAMP WITHOUT TIME ZONE,
																																																					updated_by CHARACTER VARYING(100) NULL,
																																																					updated_date TIMESTAMP WITHOUT TIME ZONE,
																																																				FOREIGN KEY (admission_id) REFERENCES admissions(id));

-- app_feedback table

CREATE TABLE IF NOT EXISTS app_feedback( id SERIAL PRIMARY KEY,
																																									subject subject_type,
																																									type varchar(100),
																																									remarks varchar(100),
																																									feedback_type feed_back_type,
																																									created_by character varying(100),
																																									created_date TIMESTAMP WITHOUT TIME ZONE,
																																									updated_by character varying(100),
																																									updated_date TIMESTAMP WITHOUT TIME ZONE);

-- cv_planing table

CREATE TABLE IF NOT EXISTS cv_planings ( id SERIAL PRIMARY KEY,
																																									branch_id integer NOT NULL,
																																									company_name CHARACTER VARYING(250) NOT NULL,
																																									company_address TEXT NOT NULL,
																																									visit_datetime TIMESTAMP,
																																									details TEXT, execute_by_user_id INTEGER NOT NULL,
																																									status cv_planing_status_type NOT NULL DEFAULT 'PENDING',
																																									created_date TIMESTAMP WITHOUT TIME ZONE,
																																									modified_date TIMESTAMP WITHOUT TIME ZONE,
																																									created_by CHARACTER VARYING(100) NULL,
																																									updated_by CHARACTER VARYING(100) NULL,
																																								FOREIGN KEY (execute_by_user_id) REFERENCES users(id),
																																								FOREIGN KEY (branch_id) REFERENCES branches(id));

-- create cv_volunteers table

CREATE TABLE IF NOT EXISTS cv_volunteers ( id SERIAL PRIMARY KEY,
																																											cv_planning_id integer NOT NULL,
																																											user_id integer NOT NULL,
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											modified_date TIMESTAMP WITHOUT TIME ZONE,
																																											created_by CHARACTER VARYING(100) NULL,
																																											updated_by CHARACTER VARYING(100) NULL,
																																										FOREIGN KEY (cv_planning_id) REFERENCES cv_planings(id),
																																										FOREIGN KEY (user_id) REFERENCES users(id));


CREATE TABLE IF NOT EXISTS admission_recurings ( id SERIAL PRIMARY KEY,
																																																	admission_id integer NOT NULL,
																																																	type admission_recursing_type NOT NULL,
																																																	type_id integer, start_date date, plan_date date, end_date date, actutal_date date, is_present boolean, status admission_recuring_status DEFAULT 'PENDING',
																																																	created_by character varying(100) COLLATE pg_catalog."default",
																																																	created_date timestamp without time zone,
																																																	updated_by character varying(100) COLLATE pg_catalog."default",
																																																	updated_date timestamp without time zone,
																																																FOREIGN KEY (admission_id) REFERENCES admissions(id));


CREATE TABLE IF NOT EXISTS rw_statistics ( id SERIAL PRIMARY KEY,
																																											branch_id INTEGER NOT NULL UNIQUE,
																																											r_total INTEGER DEFAULT 0,
																																											w_total INTEGER DEFAULT 0,
																																											is_active boolean DEFAULT FALSE,
																																											r_sequence INTEGER DEFAULT 0,
																																											updated_by CHARACTER VARYING(100) NULL,
																																											updated_date TIMESTAMP WITHOUT TIME ZONE);

-- create table for crm missing details

CREATE TABLE IF NOT EXISTS admission_crm ( id SERIAL PRIMARY KEY,
																																											admission_id INTEGER NOT NULL,
																																											lead_id INTEGER, lead_details TEXT, history TEXT, created_by CHARACTER VARYING(100) NULL,
																																											created_date TIMESTAMP WITHOUT TIME ZONE,
																																											updated_by CHARACTER VARYING(100) NULL,
																																											updated_date TIMESTAMP WITHOUT TIME ZONE,
																																										FOREIGN KEY (admission_id) REFERENCES admissions(id));

-- create student Mpin table

CREATE TABLE IF NOT EXISTS student_mpin ( id SERIAL PRIMARY KEY,
																																										mobile_no CHARACTER VARYING(15) NOT NULL UNIQUE,
																																										mpin CHARACTER VARYING(255) NOT NULL,
																																										created_date TIMESTAMP WITHOUT TIME ZONE,
																																										created_by CHARACTER VARYING(100) NULL,
																																										updated_date TIMESTAMP WITHOUT TIME ZONE,
																																										updated_by CHARACTER VARYING(100) NULL);

-- existing branches table add filed ERP integration with example portal
DO $$
BEGIN
	IF NOT EXISTS ( SELECT 1 FROM information_schema.columns WHERE table_name = 'batch_student_marks' AND column_name = 'examportal_test_token') THEN
		ALTER TABLE batch_student_marks
		ADD COLUMN examportal_test_token TEXT;
    END IF;

    IF NOT EXISTS ( SELECT 1 FROM information_schema.columns WHERE table_name = 'batch_student_marks' AND column_name = 'examportal_test_id') THEN
            ALTER TABLE batch_student_marks
            ADD COLUMN examportal_test_id CHARACTER VARYING(255);
    END IF;

	IF NOT EXISTS ( SELECT 1 FROM information_schema.columns WHERE table_name = 'admissions' AND column_name = 'tally_status' ) THEN
 		ALTER TABLE admissions ADD COLUMN tally_status tally_type DEFAULT '0';
    END IF;
	IF NOT EXISTS ( SELECT 1 FROM information_schema.columns WHERE table_name = 'admissions' AND column_name = 'tally_date') THEN
 		ALTER TABLE admissions ADD COLUMN tally_date timestamp without time zone ;
    END IF;

	IF NOT EXISTS(SELECT *
        FROM information_schema.columns
        WHERE table_name='admission_recurings' and column_name='faculty_id')
    THEN
		ALTER TABLE admission_recurings
        ADD COLUMN faculty_id INTEGER REFERENCES users NOT NULL;
	END IF;
END
$$;

--- Run Once
---------------------------------------alter enum type rename-------------------------------------------------------------------
-- ALTER TYPE subcourse_topic_type RENAME VALUE 'EXAM' TO 'EXAM_PRACTICAL';
 ---------------------------------------alter enum type ---------------------------------------------------------------------

ALTER TYPE subcourse_topic_type ADD VALUE 'EXAM_THEORY';


ALTER TYPE subcourse_topic_type ADD VALUE 'EXAM_PRACTICAL';

--- Run Once
-- alter  table clumn auth
-- ALTER TABLE students_device_token ADD COLUMN auth auth_type;
 -- notes : compulsory run trigger for created and updated date function
-- existing admissions record insert
-- INSERT INTO admission_crm (admission_id) SELECT id FROM admissions;