    /* insert lookup table value declare variable */
    DO $$
    DECLARE
        LOOKUP_FESS_TYPE character varying              			            := 'FESS_TYPE';

    /* #region Configurations Variables */
        CONFIGURATIONS_MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT character varying   := 'MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT';
        CONFIGURATIONS_ADVANCE_PAYMENT_CONCESSION character varying             := 'ADVANCE_PAYMENT_CONCESSION';
        CONFIGURATIONS_ADMISSION_REPORT_END_OF_DAY character varying            := 'ADMISSION_REPORT_END_OF_DAY';
        CONFIGURATIONS_APP_FEEDBACK_TYPE character varying                      := 'APP_FEEDBACK_TYPE';
        CONFIGURATIONS_RW_S_RATIO character varying                             := 'RW_S_RATIO';
        CONFIGURATIONS_RW_A_RATIO character varying                             := 'RW_A_RATIO';
        CONFIGURATIONS_ADMISSION_TO_DAY_REPORT_FOR_SALES character varying      := 'ADMISSION_TO_DAY_REPORT_FOR_SALES';

    -- ACTIONS
        PAGE_ACTION_VIEW character varying                                      := 'VIEW';
        PAGE_ACTION_ADD character varying                                       := 'ADD';
        PAGE_ACTION_UPDATE character varying                                    := 'UPDATE';
        PAGE_ACTION_DELETE character varying                                    := 'DELETE';
        PAGE_ACTION_PERMISSION character varying                                := 'ASSIGN_PERMISSION';
    -- PAGES
        PAGE_CODE_DASHBOARD character varying                                   := 'DASHBOARD'; 
        PAGE_CODE_USER_CONFIGURATION character varying                          := 'USER_CONFIGURATION';
        PAGE_CODE_USERS_USERS character varying                                 := 'USERS_USERS';
        PAGE_CODE_USERS_ROLES character varying                                 := 'USERS_ROLES';
        PAGE_CODE_MASTER character varying                                      := 'MASTER';
        PAGE_CODE_MASTER_ZONES character varying                                := 'MASTER_ZONES';
        PAGE_CODE_MASTER_BRANCHES character varying                             := 'MASTER_BRANCHES';
        PAGE_CODE_MASTER_DEPARTMENTS character varying                          := 'MASTER_DEPARTMENTS';
        PAGE_CODE_MASTER_SUBDEPARTMENTS character varying                       := 'MASTER_SUBDEPARTMENTS';
        PAGE_CODE_MASTER_COURSES character varying                              := 'MASTER_COURSES';
        PAGE_CODE_MASTER_SUBCOURSES character varying                           := 'MASTER_SUBCOURSES';
        PAGE_CODE_MASTER_PACKAGES character varying                             := 'MASTER_PACKAGES';
        PAGE_CODE_MASTER_BATCHES character varying                              := 'MASTER_BATCHES';
        PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET CHARACTER VARYING               := 'MASTER_TEMPLATE_SHINING_SHEET';
        PAGE_CODE_MASTER_SUBCOURSE_TOPIC CHARACTER VARYING                      := 'MASTER_SUBCOURSE_TOPIC';
        PAGE_CODE_MASTER_CITY CHARACTER VARYING                                 := 'MASTER_CITY';
        PAGE_CODE_MASTER_AREA CHARACTER VARYING                                 := 'MASTER_AREA';
        PAGE_CODE_BATCH_STUDENT_VIEW character varying                          := 'BATCH_STUDENT_VIEW';
        PAGE_CODE_ADMISSION character varying                                   := 'ADMISSION';
        PAGE_CODE_ADMISSION_ADD_ADMISSION character varying                     := 'ADMISSION_ADD_ADMISSION';
        PAGE_CODE_ADMISSION_VIEW_ADMISSION character varying                    := 'ADMISSION_VIEW_ADMISSION';
        PAGE_CODE_ADMISSION_TRANSFER_ADMISSION character varying                := 'ADMISSION_TRANSFER_ADMISSION';
        PAGE_CODE_ADMISSION_OVERDUE_INCOME character varying                    := 'ADMISSION_OVERDUE_INCOME';
        PAGE_CODE_ADMISSION_OUTSTANDING_INCOME character varying                := 'ADMISSION_OUTSTANDING_INCOME';
        PAGE_CODE_ADMISSION_INCOME character varying                            := 'INCOME';
        PAGE_CODE_ADMISSION_BASIC_INFO character varying                        := 'ADMISSION_BASIC_INFO';
        PAGE_CODE_ADMISSION_COURSE_INFO character varying                       := 'ADMISSION_COURSE_INFO';
        PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN character varying               := 'ADMISSION_COURSE_BATCH_ASSIGN';
        PAGE_CODE_ADMISSION_COURSE_AS_COMPLETED character varying               := 'ADMISSION_COURSE_AS_COMPLETED';
        PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS character varying      := 'ADMISSION_PAYMENT_INSTALLMENTS_DETAILS';
        PAGE_CODE_ADMISSION_STATUS_CANCELLED_UPDATE character varying           := 'ADMISSION_STATUS_CANCELLED_UPDATE';
        PAGE_CODE_ADMISSION_STATUS_MARK_TERMINATED_UPDATE character varying     := 'ADMISSION_STATUS_MARK_TERMINATED_UPDATE';
        PAGE_CODE_ADMISSION_STATUS_HOLD_UPDATE character varying                := 'ADMISSION_STATUS_HOLD_UPDATE';
        PAGE_CODE_ADMISSION_COURSE_MODIFICATION character varying               := 'ADMISSION_COURSE_MODIFICATION';
        PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO  CHARACTER VARYING           := 'ADMISSION_EDUCATION_DETAILS_INFO';
        PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO CHARACTER VARYING         := 'ADMISSION_POSTAL_COMMUNICATION_INFO';
        PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO CHARACTER VARYING               := 'ADMISSION_PARENT_DETAILS_INFO';
        PAGE_CODE_ADMISSION_STATUS_HOLD_OVER_VIEW CHARACTER VARYING             := 'ADMISSION_STATUS_HOLD_OVER_VIEW';
        PAGE_CODE_ADMISSION_REMARKS CHARACTER VARYING                           := 'ADMISSION_REMARKS';
        PAGE_CODE_ADMISSION_CHEQUE_LIST character varying                       := 'ADMISSION_CHEQUE_LIST';
        PAGE_CODE_ADMISSION_CHEQUE_COMMENT_ADD character varying                := 'ADMISSION_CHEQUE_COMMENT_ADD';
        PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS  CHARACTER VARYING                := 'ADMISSION_DOCUMENTS_DETAILS';
        PAGE_CODE_ADMISSION_MISSING_ADMISSION character varying                 := 'ADMISSION_MISSING_ADMISSION';
        PAGE_CODE_ADMISSION_COURSE_ADMISSION_LETTER  CHARACTER VARYING          := 'ADMISSION_COURSE_ADMISSION_LETTER';
        PAGE_CODE_ADMISSION_FEES_LETTER  CHARACTER VARYING                      := 'ADMISSION_FEES_LETTER';
        PAGE_CODE_ADMISSION_INSTALLMENTS_REPORT CHARACTER VARYING               := 'ADMISSION_INSTALLMENTS_REPORT';
        PAGE_CODE_ADMISSION_INSTALLMENT_MODIFY character varying                := 'ADMISSION_INSTALLMENT_MODIFY';
        PAGE_CODE_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW  CHARACTER VARYING       := 'ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW';
        PAGE_CODE_ADMISSION_CONCESSION_VIEW  CHARACTER VARYING                  := 'ADMISSION_CONCESSION_VIEW';
        PAGE_CODE_ADMISSION_OUTSTANDING_INCOME_CSV_FILE character varying       := 'ADMISSION_OUTSTANDING_INCOME_CSV_FILE_VIEW';
	    PAGE_CODE_ADMISSION_ADMISSION_REPORT_CSV_FILE character varying         := 'ADMISSION_REPORT_CSV_FILE_VIEW';
        PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION character varying               := 'CRM_MISSING_DETAILS_ADMISSION';
        PAGE_CODE_EXPENSE character varying                                     := 'EXPENSE';
        PAGE_CODE_EXPENSE_CATEGORIES character varying                          := 'EXPENSE_CATEGORIES';
        PAGE_CODE_EXPENSE_SUBCATEGORIES character varying                       := 'EXPENSE_SUBCATEGORIES';
        PAGE_CODE_EXPENSE_EXPENSE_MASTER character varying                      := 'EXPENSE_MASTER';
        PAGE_CODE_EXPENSE_EXPENSE character varying                             := 'EXPENSE_EXPENSE';
        PAGE_CODE_ACADEMIC character varying                                    := 'ACADEMIC';
        PAGE_CODE_ACADEMIC_USER_BATCH character varying                         := 'ACADEMIC_USER_BATCH';
        PAGE_CODE_ACADEMIC_USER_BATCH_STUDENT_VIEW CHARACTER VARYING            := 'ACADEMIC_USER_BATCH_STUDENT_VIEW';
	    PAGE_CODE_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW CHARACTER VARYING         := 'ACADEMIC_USER_BATCH_ATTENDANCE_VIEW';
        PAGE_CODE_ACADEMIC_USER_BATCH_STD_SIGNING_SHEET_VIEW character varying  := 'ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW';
        PAGE_CODE_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW character varying       := 'ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW';  
        PAGE_CODE_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION character varying          := 'ACADEMIC_UN_ASSIGN_BATCH_ADMISSION';
        PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW character varying               := 'ACADEMIC_MY_TEAM_BATCHES_VIEW';
	    PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW character varying                 := 'ACADEMIC_STUDENT_MARKS_VIEW';
        PAGE_CODE_ADMISSION_INCOME_CSV_FILE character varying                   := 'INCOME_CSV_FILE_VIEW';
		PAGE_CODE_EXPENSE_CSV_FILE character varying                   			:= 'EXPENSE_CSV_FILE_VIEW';
		PAGE_CODE_ACADEMIC_USER_BATCH_START_VIEW CHARACTER VARYING            	:= 'ACADEMIC_USER_BATCH_START_VIEW';
        
    -- TAG VARIABLES

        TAG_USER_VIEW character varying                                         := 'USER_VIEW';
        TAG_USER_CREATE character varying                                       := 'USER_CREATE';
        TAG_USER_UPDATE character varying                                       := 'USER_UPDATE';
        TAG_USER_DELETE character varying                                       := 'USER_DELETE';
        
        TAG_ROLE_VIEW character varying                                         := 'ROLE_VIEW';
        TAG_ROLE_CREATE character varying                                       := 'ROLE_CREATE';
        TAG_ROLE_UPDATE character varying                                       := 'ROLE_UPDATE';
        TAG_ROLE_DELETE character varying                                       := 'ROLE_DELETE';
        TAG_ROLE_PERMISSION character varying                                   := 'ROLE_PERMISSION';	
            
        TAG_ZONE_VIEW character varying                                         := 'ZONE_VIEW';
        TAG_ZONE_CREATE character varying                                       := 'ZONE_CREATE';
        TAG_ZONE_UPDATE character varying                                       := 'ZONE_UPDATE';
        TAG_ZONE_DELETE character varying                                       := 'ZONE_DELETE';
        
        TAG_BRANCH_VIEW character varying                                       := 'BRANCH_VIEW';
        TAG_BRANCH_CREATE character varying                                     := 'BRANCH_CREATE';
        TAG_BRANCH_UPDATE character varying                                     := 'BRANCH_UPDATE';
        TAG_BRANCH_DELETE character varying                                     := 'BRANCH_DELETE';

        TAG_DEPARTMENT_VIEW character varying                                   := 'DEPARTMENT_VIEW';
        TAG_DEPARTMENT_CREATE character varying                                 := 'DEPARTMENT_CREATE';
        TAG_DEPARTMENT_UPDATE character varying                                 := 'DEPARTMENT_UPDATE';
        TAG_DEPARTMENT_DELETE character varying                                 := 'DEPARTMENT_DELETE';
        
        TAG_SUBDEPARTMENT_VIEW character varying                                := 'SUBDEPARTMENT_VIEW';
        TAG_SUBDEPARTMENT_CREATE character varying                              := 'SUBDEPARTMENT_CREATE';
        TAG_SUBDEPARTMENT_UPDATE character varying                              := 'SUBDEPARTMENT_UPDATE';
        TAG_SUBDEPARTMENT_DELETE character varying                              := 'SUBDEPARTMENT_DELETE';
        
        TAG_SUBCOURSE_VIEW character varying                                    := 'SUBCOURSE_VIEW';
        TAG_SUBCOURSE_CREATE character varying                                  := 'SUBCOURSE_CREATE';
        TAG_SUBCOURSE_UPDATE character varying                                  := 'SUBCOURSE_UPDATE';
        TAG_SUBCOURSE_DELETE character varying                                  := 'SUBCOURSE_DELETE';
        
        TAG_PACKAGE_VIEW character varying                                      := 'PACKAGE_VIEW';
        TAG_PACKAGE_CREATE character varying                                    := 'PACKAGE_CREATE';
        TAG_PACKAGE_UPDATE character varying                                    := 'PACKAGE_UPDATE';
        TAG_PACKAGE_DELETE character varying                                    := 'PACKAGE_DELETE';
        
        TAG_BATCH_VIEW character varying                                        := 'BATCH_VIEW';
        TAG_BATCH_CREATE character varying                                      := 'BATCH_CREATE';
        TAG_BATCH_UPDATE character varying                                      := 'BATCH_UPDATE';
        TAG_BATCH_DELETE character varying                                      := 'BATCH_DELETE';
        TAG_PAGE_CODE_BATCH_STUDENT_VIEW CHARACTER VARYING                      := 'BATCH_STUDENT_VIEW';
        
        TAG_ADMISSION_VIEW character varying                                    := 'ADMISSION_VIEW';
        TAG_ADMISSION_CREATE character varying                                  := 'ADMISSION_CREATE';
        TAG_ADMISSION_UPDATE character varying                                  := 'ADMISSION_UPDATE';
        TAG_ADMISSION_DELETE character varying                                  := 'ADMISSION_DELETE';
        
        TAG_TRANSFER_ADMISSION character varying                                := 'TRANSFER_ADMISSION';
        TAG_ADMISSION_OVERDUE_INCOME character varying                          := 'ADMISSION_OVERDUE_INCOME';
        TAG_ADMISSION_OUTSTANDING_INCOME character varying                      := 'ADMISSION_OUTSTANDING_INCOME';
        TAG_ADMISSION_INCOME character varying                                  := 'ADMISSION_INCOME';
        TAG_ADMISSION_BASIC_INFO_VIEW character varying                         := 'ADMISSION_BASIC_INFO_VIEW';
        TAG_ADMISSION_BASIC_INFO_UPDATE character varying                       := 'ADMISSION_BASIC_INFO_UPDATE';
        TAG_ADMISSION_COURSE_INFO_VIEW character varying                        := 'ADMISSION_COURSE_INFO_VIEW';
        TAG_ADMISSION_COURSE_INFO_UPDATE character varying                      := 'ADMISSION_COURSE_INFO_UPDATE';
        TAG_ADMISSION_COURSE_BATCH_ASSIGN_VIEW character varying                := 'ADMISSION_COURSE_BATCH_ASSIGN_VIEW';
        TAG_ADMISSION_COURSE_BATCH_ASSIGN_UPDATE character varying              := 'ADMISSION_COURSE_BATCH_ASSIGN_UPDATE';
        TAG_ADMISSION_COURSE_AS_COMPLETED_VIEW character varying                := 'ADMISSION_COURSE_AS_COMPLETED_VIEW';
        TAG_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_VIEW character varying       := 'ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_VIEW';
        TAG_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_UPDATE character varying     := 'ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_UPDATE';
        TAG_ADMISSION_MARK_TERMINATED_STATUS_UPDATE_VIEW character varying      := 'ADMISSION_MARK_TERMINATED_STATUS_UPDATE_VIEW';
        TAG_ADMISSION_HOLD_STATUS_UPDATE_VIEW character varying                 := 'ADMISSION_HOLD_STATUS_UPDATE_VIEW';
        TAG_ADMISSION_CANCELLED_STATUS_UPDATE_VIEW character varying            := 'ADMISSION_CANCELLED_STATUS_UPDATE_VIEW';
        TAG_ADMISSION_COURSE_MODIFICATION_VIEW character varying                := 'ADMISSION_COURSE_MODIFICATION_VIEW';
        TAG_ADMISSION_HOLD_OVER_STATUS_UPDATE_VIEW character varying            := 'ADMISSION_HOLD_OVER_STATUS_UPDATE_VIEW';
        TAG_ADMISSION_PARENT_DETAILS_INFO_VIEW CHARACTER VARYING                := 'ADMISSION_PARENT_DETAILS_INFO_VIEW';
        TAG_ADMISSION_PARENT_DETAILS_INFO_UPDATE CHARACTER VARYING              := 'ADMISSION_PARENT_DETAILS_INFO_UPDATE';
        TAG_ADMISSION_EDUCATION_DETAILS_VIEW CHARACTER VARYING                  := 'ADMISSION_EDUCATION_DETAILS_VIEW';
        TAG_ADMISSION_EDUCATION_DETAILS_UPDATE CHARACTER VARYING                := 'ADMISSION_EDUCATION_DETAILS_UPDATE';
        TAG_ADMISSION_POSTAL_COMMUNICATION_UPDATE CHARACTER VARYING             := 'ADMISSION_POSTAL_COMMUNICATION_UPDATE';
        TAG_ADMISSION_POSTAL_COMMUNICATION_VIEW CHARACTER VARYING               := 'ADMISSION_POSTAL_COMMUNICATION_VIEW';
        TAG_ADMISSION_STATUS_HOLD_OVER_VIEW CHARACTER VARYING                   := 'ADMISSION_STATUS_HOLD_OVER_VIEW';
        TAG_ADMISSION_REMARKS_ADD CHARACTER VARYING                             := 'ADMISSION_REMARKS_ADD';
        TAG_ADMISSION_REMARKS_VIEW CHARACTER VARYING                            := 'ADMISSION_REMARKS_VIEW';
        TAG_ADMISSION_DOCUMENTS_DETAILS_VIEW CHARACTER VARYING                  := 'ADMISSION_DOCUMENTS_DETAILS_VIEW';
	    TAG_ADMISSION_DOCUMENTS_DETAILS_UPDATE CHARACTER VARYING                := 'ADMISSION_DOCUMENTS_DETAILS_UPDATE';
        TAG_ADMISSION_CHEQUE_LIST_VIEW character varying                        := 'ADMISSION_CHEQUE_LIST_VIEW';
        TAG_ADMISSION_CHEQUE_COMMENT_VIEW character varying                     := 'ADMISSION_CHEQUE_COMMENT_VIEW';
        TAG_ADMISSION_ADMISSION_MISSING_ADMISSION_VIEW character varying        := 'ADMISSION_MISSING_ADMISSION_VIEW';
        TAG_ADMISSION_COURSE_ADMISSION_LETTER_VIEW    CHARACTER VARYING   	 	:= 'ADMISSION_COURSE_ADMISSION_LETTER_VIEW';
        TAG_ADMISSION_FEES_LETTER_VIEW  CHARACTER VARYING                       := 'ADMISSION_FEES_LETTER_VIEW';
        TAG_ADMISSION_INSTALLMENTS_REPORT_VIEW CHARACTER VARYING                := 'ADMISSION_INSTALLMENTS_REPORT_VIEW';
        TAG_ADMISSION_INSTALLMENT_MODIFY_UPDATE character varying               := 'ADMISSION_INSTALLMENT_MODIFY_UPDATE';
        TAG_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW    CHARACTER VARYING   	 	:= 'ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW';
        TAG_ADMISSION_CONCESSION_VIEW    CHARACTER VARYING   	 				:= 'ADMISSION_CONCESSION_VIEW';
        TAG_ADMISSION_OUTSTANDING_INCOME_CSV_FILE character varying             := 'ADMISSION_OUTSTANDING_INCOME_CSV_FILE_VIEW';
	    TAG_ADMISSION_ADMISSION_REPORT_CSV_FILE character varying               := 'ADMISSION_REPORT_CSV_FILE_VIEW';
        TAG_CRM_MISSING_DETAILS_VIEW character varying                          := 'CRM_MISSING_DETAILS_VIEW';
        TAG_CRM_MISSING_DETAILS_UPDATE character varying                        := 'CRM_MISSING_DETAILS_UPDATE';
        
        TAG_CATEGORIES_VIEW character varying                                   := 'CATEGORIES_VIEW';
        TAG_CATEGORIES_CREATE character varying                                 := 'CATEGORIES_CREATE';
        TAG_CATEGORIES_UPDATE character varying                                 := 'CATEGORIES_UPDATE';
        TAG_CATEGORIES_DELETE character varying                                 := 'CATEGORIES_DELETE';
        
        TAG_SUBCATEGORIES_VIEW character varying                                := 'SUBCATEGORIES_VIEW';
        TAG_SUBCATEGORIES_CREATE character varying                              := 'SUBCATEGORIES_CREATE';
        TAG_SUBCATEGORIES_UPDATE character varying                              := 'SUBCATEGORIES_UPDATE';
        TAG_SUBCATEGORIES_DELETE character varying                              := 'SUBCATEGORIES_DELETE';
        
        TAG_COURSE_VIEW character varying                                       := 'COURSE_VIEW';
        TAG_COURSE_CREATE character varying                                     := 'COURSE_CREATE';
        TAG_COURSE_UPDATE character varying                                     := 'COURSE_UPDATE';
        TAG_COURSE_DELETE character varying                                     := 'COURSE_DELETE';	
        
        TAG_EXPENSE_MASTER_VIEW character varying                               := 'EXPENSE_MASTER_VIEW';
        TAG_EXPENSE_MASTER_CREATE character varying                             := 'EXPENSE_MASTER_CREATE';
        TAG_EXPENSE_MASTER_UPDATE character varying                             := 'EXPENSE_MASTER_UPDATE';
        TAG_EXPENSE_MASTER_DELETE character varying                             := 'EXPENSE_MASTER_DELETE';

        TAG_EXPENSE_EXPENSE_VIEW character varying                              := 'EXPENSE_VIEW';
        TAG_EXPENSE_EXPENSE_CREATE character varying                            := 'EXPENSE_CREATE';
        TAG_EXPENSE_EXPENSE_UPDATE character varying                            := 'EXPENSE_UPDATE';
        TAG_EXPENSE_EXPENSE_DELETE character varying                            := 'EXPENSE_DELETE';
        
        TAG_ACADEMIC_USER_BATCH_VIEW character varying                          := 'USER_BATCH';
        TAG_ACADEMIC_USER_BATCH_STUDENT_VIEW CHARACTER VARYING                  := 'USER_BATCH_STUDENT_VIEW';  
	    TAG_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW CHARACTER VARYING               := 'USER_BATCH_ATTENDANCE_VIEW';
        TAG_ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW CHARACTER VARYING    := 'USER_BATCH_STUDENT_SIGNING_SHEET_VIEW';
        TAG_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW CHARACTER VARYING    := 'ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW';
        TAG_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION_VIEW character varying           := 'UN_ASSIGN_BATCH_ADMISSION';
        TAG_ACADEMIC_MY_TEAM_BATCHES_VIEW character varying                     := 'MY_TEAM_BATCHES_VIEW';
        TAG_ACADEMIC_STUDENT_MARKS_VIEW character varying                       := 'STUDENT_MARKS_VIEW';
        TAG_ACADEMIC_STUDENT_MARKS_UPDATE character varying                     := 'STUDENT_MARKS_UPDATE';	

        TAG_TRANSFER_ADMISSION_CREATE character varying                         := 'TRANSFER_ADMISSION_CREATE';
        TAG_TRANSFER_ADMISSION_VIEW character varying                           := 'TRANSFER_ADMISSION_VIEW';
        TAG_TRANSFER_ADMISSION_UPDATE character varying                         := 'TRANSFER_ADMISSION_UPDATE';

        TAG_MASTER_SUBCOURSE_TOPIC_VIEW CHARACTER VARYING                       := 'SUBCOURSE_TOPIC_VIEW';
        TAG_MASTER_SUBCOURSE_TOPIC_UPDATE CHARACTER VARYING                     := 'SUBCOURSE_TOPIC_UPDATE';
        TAG_MASTER_SUBCOURSE_TOPIC_ADD CHARACTER VARYING                        := 'SUBCOURSE_TOPIC_ADD';
        TAG_MASTER_SUBCOURSE_TOPIC_DELETE CHARACTER VARYING                     := 'SUBCOURSE_TOPIC_DELETE';
        TAG_MASTER_TEMPLATE_SHINING_SHEET_VIEW CHARACTER VARYING                := 'TEMPLATE_SHINING_SHEET_VIEW';
        TAG_MASTER_TEMPLATE_SHINING_SHEET_UPDATE CHARACTER VARYING              := 'TEMPLATE_SHINING_SHEET_UPDATE';
        TAG_MASTER_TEMPLATE_SHINING_SHEET_ADD CHARACTER VARYING                 := 'TEMPLATE_SHINING_SHEET_ADD';
        TAG_CITY_VIEW character varying                                         := 'CITY_VIEW';
        TAG_CITY_CREATE character varying                                       := 'CITY_CREATE';
        TAG_CITY_UPDATE character varying                                       := 'CITY_UPDATE';
        TAG_CITY_DELETE character varying                                       := 'CITY_DELETE';
        TAG_AREA_VIEW character varying                                         := 'AREA_VIEW';
        TAG_AREA_CREATE character varying                                       := 'AREA_CREATE';
        TAG_AREA_UPDATE character varying                                       := 'AREA_UPDATE';
        TAG_AREA_DELETE character varying                                       := 'AREA_DELETE';
        TAG_ADMISSION_INCOME_CSV_FILE character varying                         := 'INCOME_CSV_FILE_VIEW';
		TAG_EXPENSE_CSV_FILE_VIEW character varying                            	:= 'EXPENSE_CSV_FILE_VIEW';
		TAG_MASTER_TEMPLATE_SHINING_SHEET_DELETE character varying              := 'TEMPLATE_SHINING_SHEET_DELETE';
		TAG_ACADEMIC_USER_BATCH_START_VIEW CHARACTER VARYING                  	:= 'USER_BATCH_START_VIEW';

    BEGIN

        IF NOT EXISTS (SELECT id FROM lookups WHERE type = LOOKUP_FESS_TYPE AND code = 'REGISTRATION' ) THEN
            INSERT INTO lookups (name, type, code, color, default_search, active, orderby) 
            VALUES ('Registration', LOOKUP_FESS_TYPE, 'REGISTRATION', null, false, true, 1);
        END IF;

        IF NOT EXISTS (SELECT id FROM lookups WHERE type = LOOKUP_FESS_TYPE AND code = 'MATERIAL' ) THEN
            INSERT INTO lookups (name, type, code, color, default_search, active, orderby) 
            VALUES ('Material', LOOKUP_FESS_TYPE, 'MATERIAL', null, false, true, 2);
        END IF;

        IF NOT EXISTS (SELECT id FROM lookups WHERE type = LOOKUP_FESS_TYPE AND code = 'TUITION' ) THEN
            INSERT INTO lookups (name, type, code, color, default_search, active, orderby) 
            VALUES ('Tuition', LOOKUP_FESS_TYPE, 'TUITION', null, false, true, 3);
        END IF;


    ----------- configuration script start -----------
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('Minimum limit of advance payment concession',20000, 'Minimum limit of advance payment concession for pay installment', CONFIGURATIONS_MIN_ADVANCE_PAYMENT_CONCESSION_LIMIT);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_ADVANCE_PAYMENT_CONCESSION) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('Advance payment concession','[{"amount":20000,"percentage":5},{"amount":50000,"percentage":10}]', 'Advance payment concession for pay installment', CONFIGURATIONS_ADVANCE_PAYMENT_CONCESSION);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_ADMISSION_REPORT_END_OF_DAY) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('Admission Report','[{"email": "jaydb1010@gmail.com"}]', 'Admission end of the day report', CONFIGURATIONS_ADMISSION_REPORT_END_OF_DAY);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_APP_FEEDBACK_TYPE) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('App feedback type','[{"label":"acadmic","value":"acadmic"},{"label":"account","value":"account"}]', '', CONFIGURATIONS_APP_FEEDBACK_TYPE);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_RW_S_RATIO) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('RW S','35:75', 'RW S', CONFIGURATIONS_RW_S_RATIO);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_RW_A_RATIO) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('RW A','40:60', 'RW A', CONFIGURATIONS_RW_A_RATIO);
        END IF;
        IF NOT EXISTS (SELECT id FROM configurations WHERE code = CONFIGURATIONS_ADMISSION_TO_DAY_REPORT_FOR_SALES) THEN
            INSERT INTO configurations (name, value, description, code) 
            VALUES ('Admission Today Report','[{"email": "jaydb1010@gmail.com"},{"email": "sur.sales@rnwmultimedia.com"},{"email": "ahm.sales@rnwmultimedia.com"}]', 'Admission to day report for sales', CONFIGURATIONS_ADMISSION_TO_DAY_REPORT_FOR_SALES);
        END IF;
    ----------- configuration script end -----------

    ----------- action start -----------
        IF NOT EXISTS (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW) THEN
            INSERT INTO actions (action_code, name) 
            VALUES (PAGE_ACTION_VIEW,'View');
        END IF;

        IF NOT EXISTS (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD) THEN
            INSERT INTO actions (action_code, name) 
            VALUES (PAGE_ACTION_ADD,'Create');
        END IF;

        IF NOT EXISTS (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE) THEN
            INSERT INTO actions (action_code, name) 
            VALUES (PAGE_ACTION_UPDATE,'Update');
        END IF;

        IF NOT EXISTS (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE) THEN
            INSERT INTO actions (action_code, name) 
            VALUES (PAGE_ACTION_DELETE,'Delete');
        END IF;
        IF NOT EXISTS (SELECT id FROM actions WHERE action_code = PAGE_ACTION_PERMISSION) THEN
            INSERT INTO actions (action_code, name) 
            VALUES (PAGE_ACTION_PERMISSION,'Assign Permission');
        END IF;
    ----------- action end -----------

    -----------  start -----------
        -- 	DASHBOARD
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_DASHBOARD) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_DASHBOARD,'Dashboard',null, true, null);
            END IF;
        
        -- 	USER_CONFIGURATION
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_USER_CONFIGURATION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_USER_CONFIGURATION,'User Configuration',null, true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_USERS) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_USERS_USERS,'Users',(SELECT id FROM pages WHERE page_code = PAGE_CODE_USER_CONFIGURATION AND parent_page_id IS NULL), true, '/users');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_USERS_ROLES,'Roles',(SELECT id FROM pages WHERE page_code = PAGE_CODE_USER_CONFIGURATION AND parent_page_id IS NULL), true, '/roles');
            END IF;
        
        -- 	MASTER
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER,'Master',null, true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_ZONES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_ZONES,'Zones',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/zones');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BRANCHES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_BRANCHES,'Branches',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/branches');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_DEPARTMENTS) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_DEPARTMENTS,'Departments',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/departments');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_SUBDEPARTMENTS,'Subdepartments',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/subdepartments');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_COURSES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_COURSES,'Courses',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/courses');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_SUBCOURSES,'Subcourses',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/subcourses');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_PACKAGES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_PACKAGES,'Packages',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/packages');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BATCHES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_BATCHES,'Batches',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/batches');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET,'Template Shining Sheet',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_SUBCOURSE_TOPIC,'Subcourse Topic',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_CITY) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_CITY,'City',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/city');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_AREA) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_MASTER_AREA,'Area',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, '/area');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_BATCH_STUDENT_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_BATCH_STUDENT_VIEW,'Batch Student View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER AND parent_page_id IS NULL), true, null,58);
            END IF;
        -- 	ADMISSIONS
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION,'Admission',null, true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_ADD_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_ADD_ADMISSION,'Add Admission',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/add-admission');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_VIEW_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_VIEW_ADMISSION,'View Admission',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/view-admission');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_TRANSFER_ADMISSION,'Transfer Admission',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/transfer-admission');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OVERDUE_INCOME) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_OVERDUE_INCOME,'Overdue Income',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/overdue-income');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_OUTSTANDING_INCOME,'Outstanding Income',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/outstanding-income');
            END IF;

            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_BASIC_INFO ) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_BASIC_INFO,'Admission Batch Information',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INCOME) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_INCOME,'Income',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/invoice-income');
            END IF;
        
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_INFO) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_COURSE_INFO,'Admission Course Information',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN,'Admission Course Batch Assign',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_AS_COMPLETED) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_COURSE_AS_COMPLETED,'Admission Course As Completed',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS,'Admission Payment Installments Details',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_CANCELLED_UPDATE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_STATUS_CANCELLED_UPDATE,'Admission Cancelled',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_MARK_TERMINATED_UPDATE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_STATUS_MARK_TERMINATED_UPDATE,'Admission Mark Terminated',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_UPDATE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_STATUS_HOLD_UPDATE,'Admission Hold',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_MODIFICATION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_COURSE_MODIFICATION,'Admission Course Modification',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO,'Admission Education Details Information',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
        
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO,'Admission Postal Communication Information',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO,'Admission Parent Details Information',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;  
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_OVER_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_STATUS_HOLD_OVER_VIEW,'Admission Hold Over', (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_REMARKS ) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES (PAGE_CODE_ADMISSION_REMARKS,'Admission Remarks',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL),true,null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS,'Admission Documents Details',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CHEQUE_LIST) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_CHEQUE_LIST,'Cheque List',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/cheque');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CHEQUE_COMMENT_ADD) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_CHEQUE_COMMENT_ADD,'Add Cheque Comment',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/cheque');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_MISSING_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_MISSING_ADMISSION,'Missing Admission',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/view-missing-admission');
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_ADMISSION_LETTER) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_COURSE_ADMISSION_LETTER,'Course Admission Letter',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;

            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_FEES_LETTER) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_FEES_LETTER,'Fees Letter',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;

            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INSTALLMENTS_REPORT) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_INSTALLMENTS_REPORT,'Installment Report',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INSTALLMENT_MODIFY) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ADMISSION_INSTALLMENT_MODIFY,'Admission Installment Modify',
                    (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW,'Student Portal Log In View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '',64);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CONCESSION_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ADMISSION_CONCESSION_VIEW,'Admission Concession View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '',66);
            END IF;
            -- CRM_MISSING_DETAILS_ADMISSION
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION,'CRM Missing Details View',
                    (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, '/missing-crm-details',63);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_CRM_MISSING_DETAILS_UPDATE);
            END IF;
        -- 	EXPENSE
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_EXPENSE,'Expense',null, true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CATEGORIES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_EXPENSE_CATEGORIES,'Categories',(SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE AND parent_page_id IS NULL), true, '/category');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_EXPENSE_SUBCATEGORIES,'Sub Categories',(SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE AND parent_page_id IS NULL), true, '/subcategory');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_EXPENSE_EXPENSE_MASTER,'Expense Master',(SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE AND parent_page_id IS NULL), true, '/expense-master');
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_EXPENSE_EXPENSE,'Expense',(SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE AND parent_page_id IS NULL), true, '/expense');
            END IF;
        
        -- 	ACADEMIC
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ACADEMIC,'Academic',null, true, null);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url) 
                VALUES(PAGE_CODE_ACADEMIC_USER_BATCH,'User Batch',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, '/batch');
            END IF;	
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STUDENT_VIEW) THEN
                INSERT INTO pages (page_code,name,parent_page_id,active,url) 
                VALUES (PAGE_CODE_ACADEMIC_USER_BATCH_STUDENT_VIEW, 'User Batch Student View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL),true,null);
            END IF;
	        IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW) THEN
		        INSERT INTO pages (page_code,name,parent_page_id,active,url) 
                VALUES (PAGE_CODE_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW,'User Batch Attendence View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL),true,null);
	        END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STD_SIGNING_SHEET_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_USER_BATCH_STD_SIGNING_SHEET_VIEW,'Student Signing Sheet View',
                    (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, null,56);
            END IF;
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW,'Faculty Signing Sheet View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, null,57);
            END IF;
        -- PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW,'My Team Batches View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, '/my-team-batches',63);
            END IF;
            
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW,'Student Marks View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, null,65);
            END IF;
        -- INCOME CSV FILE -- 
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INCOME_CSV_FILE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ADMISSION_INCOME_CSV_FILE,'Income CSV File View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null,59);
            END IF;
            
            -- EXPENSE CSV FILE --
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CSV_FILE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_EXPENSE_CSV_FILE,'Expense CSV File View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE AND parent_page_id IS NULL), true, null,60);
            END IF;
            
            -- ACADEMIC USER BATCH START VIEW --
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_START_VIEW) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_USER_BATCH_START_VIEW,'User Batch Start View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, null,61);
            END IF;
        -- ACADEMIC_UN_ASSIGN_BATCH_ADMISSION
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION,'Un Assign Batch Admission View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC AND parent_page_id IS NULL), true, '/un-assign-batch-admission',62);
            END IF;

        -- ADMISSION_REPORT_CSV_FILE pages
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_ADMISSION_REPORT_CSV_FILE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ADMISSION_ADMISSION_REPORT_CSV_FILE,'Admission Report CSV File View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null,67);
            END IF;
        -- OUTSTANDING_INCOME_CSV_FILE pages
            IF NOT EXISTS (SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME_CSV_FILE) THEN
                INSERT INTO pages (page_code, name, parent_page_id, active, url,sequence) 
                VALUES(PAGE_CODE_ADMISSION_OUTSTANDING_INCOME_CSV_FILE,'Outstanding Income CSV File View',(SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION AND parent_page_id IS NULL), true, null,68);
            END IF;
    -----------  end -----------

    -----------  action start ---------
        -- 	USERS
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_USERS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_USERS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_USER_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_USERS AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_USERS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_USER_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_USERS AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_USERS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_USER_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_USERS AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_USERS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_USER_DELETE);
            END IF;
                    
        -- 	ROLES		   	   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_ROLES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ROLE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_ROLES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_ROLE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_ROLES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ROLE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_USERS_ROLES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_ROLE_DELETE);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_USERS_ROLES AND a.action_code = PAGE_ACTION_PERMISSION) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_USERS_ROLES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_PERMISSION),TAG_ROLE_PERMISSION);
            END IF;
                    
        -- 	MASTER ZONE	      
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_ZONES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_ZONES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ZONE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_ZONES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_ZONES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_ZONE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_ZONES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_ZONES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ZONE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_ZONES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_ZONES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_ZONE_DELETE);
            END IF;

        -- 	MASTER BRANCHES			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BRANCHES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BRANCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_BRANCH_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BRANCHES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BRANCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_BRANCH_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BRANCHES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BRANCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_BRANCH_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BRANCHES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BRANCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_BRANCH_DELETE);
            END IF;
            
        -- 	MASTER DEPARTMENTS			   	   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_DEPARTMENTS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_DEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_DEPARTMENT_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_DEPARTMENTS AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_DEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_DEPARTMENT_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_DEPARTMENTS AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_DEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_DEPARTMENT_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_DEPARTMENTS AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_DEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_DEPARTMENT_DELETE);
            END IF;	
            
        -- 	MASTER SUBDEPARTMENTS			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_SUBDEPARTMENT_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_SUBDEPARTMENT_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_SUBDEPARTMENT_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBDEPARTMENTS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_SUBDEPARTMENT_DELETE);
            END IF;
            
        -- 	MASTER COURSE			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_COURSES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_COURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_COURSE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_COURSES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_COURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_COURSE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_COURSES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_COURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_COURSE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_COURSES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_COURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_COURSE_DELETE);
            END IF;
            
        -- 	MASTER SUBCOURSE			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_SUBCOURSE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_SUBCOURSE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_SUBCOURSE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_SUBCOURSE_DELETE);
            END IF;
            
        -- 	MASTER PACKAGES			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_PACKAGES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_PACKAGES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_PACKAGE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_PACKAGES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_PACKAGES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_PACKAGE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_PACKAGES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_PACKAGES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_PACKAGE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_PACKAGES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_PACKAGES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_PACKAGE_DELETE);
            END IF;
            
        -- 	MASTER BATCHES			   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BATCHES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BATCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_BATCH_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BATCHES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BATCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_BATCH_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BATCHES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BATCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_BATCH_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_BATCHES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_BATCHES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_BATCH_DELETE);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_BATCH_STUDENT_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_BATCH_STUDENT_VIEW),
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_PAGE_CODE_BATCH_STUDENT_VIEW);
            END IF;	
        --  MASTER_SUBCOURSE_TOPIC_INSERT
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC),
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_MASTER_SUBCOURSE_TOPIC_ADD);
            END IF;
        -- 	MASTER_SUBCOURSE_TOPIC_VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_MASTER_SUBCOURSE_TOPIC_VIEW);
            END IF;
        -- 	MASTER_SUBCOURSE_TOPIC_UPDATE
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_MASTER_SUBCOURSE_TOPIC_UPDATE);
            END IF;
        -- 	MASTER_SUBCOURSE_TOPIC_DELETE
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_SUBCOURSE_TOPIC), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_MASTER_SUBCOURSE_TOPIC_DELETE);
            END IF;
        -- 	MASTER CITY	      
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_CITY AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_CITY), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_CITY_VIEW);
            END IF; 

            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_CITY AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_CITY), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_CITY_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_CITY AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_CITY), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_CITY_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_CITY AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_CITY), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_CITY_DELETE);
            END IF;

        -- 	MASTER AREA	      
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_AREA AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_AREA), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_AREA_VIEW);
            END IF; 

            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_AREA AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_AREA), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_AREA_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_AREA AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_AREA), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_AREA_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_MASTER_AREA AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_AREA), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_AREA_DELETE);
            END IF;
        -- 	ADMISSION ADD_ADMISSION	AND VIEW_ADMISSION		   		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_VIEW_ADMISSION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_VIEW_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_ADD_ADMISSION AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_ADD_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_ADMISSION_CREATE);
            END IF;            
        -- 	ADMISSION ADMISSION_OVERDUE_INCOME		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_OVERDUE_INCOME AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OVERDUE_INCOME), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_OVERDUE_INCOME);
            END IF;
            
        -- 	ADMISSION ADMISSION_OUTSTANDING_INCOME			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_OUTSTANDING_INCOME);
            END IF;	

        -- 	ADMISSION ADMISSION_INCOME			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_INCOME AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INCOME), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_INCOME);
            END IF;
        --  ADMISSION ADMISSION_BASIC
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_ADMISSION_BASIC_INFO AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_BASIC_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_BASIC_INFO_VIEW);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_BASIC_INFO AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_BASIC_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_BASIC_INFO_UPDATE);
            END IF;	
        --  ADMISSION ADMISSION_COURSE_INFO
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_INFO AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_COURSE_INFO_VIEW);
            END IF;

            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_INFO AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_COURSE_INFO_UPDATE);
            END IF;
        --  ADMISSION ADMISSION_COURSE_BATCH_ASSIGN
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_COURSE_BATCH_ASSIGN_VIEW);
            END IF;

            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_BATCH_ASSIGN), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_COURSE_BATCH_ASSIGN_UPDATE);
            END IF;
        --  ADMISSION ADMISSION_COURSE_AS_COMPLETED   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_AS_COMPLETED AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_AS_COMPLETED), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_COURSE_AS_COMPLETED_VIEW);
            END IF;
        --  ADMISSION ADMISSION_PAYMENT_INSTALLMENTS_DETAILS   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_VIEW);
            END IF;

            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_PAYMENT_INSTALLMENTS_DETAILS_UPDATE);
            END IF;
        --  ADMISSION ADMISSION_STATUS_CANCELLED_UPDATE    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_STATUS_CANCELLED_UPDATE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_CANCELLED_UPDATE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_CANCELLED_STATUS_UPDATE_VIEW);
            END IF;
        --  ADMISSION ADMISSION_STATUS_MARK_TERMINATED_UPDATE    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_STATUS_MARK_TERMINATED_UPDATE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_MARK_TERMINATED_UPDATE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_MARK_TERMINATED_STATUS_UPDATE_VIEW);
            END IF;
        --  ADMISSION ADMISSION_STATUS_HOLD_UPDATE    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_UPDATE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_UPDATE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_HOLD_STATUS_UPDATE_VIEW);
            END IF;
        --  ADMISSION ADMISSION_COURSE_MODIFICATION    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_MODIFICATION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_MODIFICATION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_COURSE_MODIFICATION_VIEW);
            END IF;
        -- 	ADMISSION ADMISSION_TRANSFER
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_TRANSFER_ADMISSION_VIEW);
            END IF;
            
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_TRANSFER_ADMISSION_CREATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_TRANSFER_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_TRANSFER_ADMISSION_UPDATE);
            END IF; 
        --  ADMISSION education details
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),
                    TAG_ADMISSION_EDUCATION_DETAILS_VIEW);
            END IF;
            
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_EDUCATION_DETAILS_INFO), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),
                    TAG_ADMISSION_EDUCATION_DETAILS_UPDATE);
            END IF;
        
        --  ADMISSION parent details
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),
                    TAG_ADMISSION_PARENT_DETAILS_INFO_VIEW);
            END IF;
            
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_PARENT_DETAILS_INFO), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),
                    TAG_ADMISSION_PARENT_DETAILS_INFO_UPDATE);
            END IF;
        
        --  ADMISSION postal communication details
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id  = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_POSTAL_COMMUNICATION_UPDATE);
            END IF;
            
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id  = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_POSTAL_COMMUNICATION_INFO), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_POSTAL_COMMUNICATION_VIEW);
            END IF; 
        --  ADMISSION hold over  actions
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON pa.action_id = a.id 
                        WHERE p.page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_OVER_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN  
                INSERT INTO page_actions(page_id,action_id,tag) 
                VALUES ((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STATUS_HOLD_OVER_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW), TAG_ADMISSION_STATUS_HOLD_OVER_VIEW);
            END IF;
        --  ADMISSION TEMPLATE SHINING SHEET
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET),
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_MASTER_TEMPLATE_SHINING_SHEET_ADD);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_MASTER_TEMPLATE_SHINING_SHEET_VIEW);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_MASTER_TEMPLATE_SHINING_SHEET_UPDATE);
            END IF;
        -- 	ADMISSION ADMISSION_INCOME		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_INCOME AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INCOME), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_INCOME);
            END IF;
        --  ADMISSION ADMISSION_REMARKS
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON p.id = pa.page_id INNER JOIN actions a ON a.id = pa.action_id 
                        WHERE p.page_code = PAGE_CODE_ADMISSION_REMARKS AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id,action_id,tag) 
                VALUES ((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_REMARKS),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_ADMISSION_REMARKS_ADD);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON p.id = pa.page_id INNER JOIN actions a ON a.id = pa.action_id 
                        WHERE p.page_code = PAGE_CODE_ADMISSION_REMARKS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id,action_id,tag) 
                VALUES ((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_REMARKS),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_REMARKS_VIEW);
            END IF;
        --  ADMISSION document details 
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_DOCUMENTS_DETAILS_VIEW);
            END IF;
            
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id WHERE p.page_code = PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_DOCUMENTS_DETAILS),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_DOCUMENTS_DETAILS_UPDATE);
            END IF;
        -- 	ADMISSION ADMISSION_CHEQUE_LIST			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_CHEQUE_LIST AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CHEQUE_LIST),
                        (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_CHEQUE_LIST_VIEW);
            END IF;	        


            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_CHEQUE_COMMENT_ADD AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CHEQUE_COMMENT_ADD), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_ADMISSION_CHEQUE_COMMENT_VIEW);
            END IF;	
        -- 	ADMISSION ADMISSION_CHEQUE_LIST			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_MISSING_ADMISSION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_MISSING_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_ADMISSION_MISSING_ADMISSION_VIEW);
            END IF;
        --  ADMISSION COURSE LETTER 
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_COURSE_ADMISSION_LETTER AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_COURSE_ADMISSION_LETTER),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_COURSE_ADMISSION_LETTER_VIEW);
            END IF;

        --  ADMISSION FEES LETTER 
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_FEES_LETTER AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_FEES_LETTER),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_FEES_LETTER_VIEW);
            END IF;

        --  ADMISSION INSTALLMENT REPORT 
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON pa.page_id = p.id INNER JOIN actions a ON a.id = pa.action_id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_INSTALLMENTS_REPORT AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INSTALLMENTS_REPORT),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_INSTALLMENTS_REPORT_VIEW);
            END IF;
        
        --  ADMISSION_INSTALLMENT_MODIFY  
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_ADMISSION_INSTALLMENT_MODIFY AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INSTALLMENT_MODIFY), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ADMISSION_INSTALLMENT_MODIFY_UPDATE);
            END IF;

        -- ADMISSIONS STUDENT PORTAL LOG IN VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_STUDENT_PORTAL_LOG_IN_VIEW);
            END IF;

        -- ADMISSIONS STUDENT PORTAL LOG IN VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_CONCESSION_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_CONCESSION_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_CONCESSION_VIEW);
            END IF;

        -- CRM_MISSING_DETAILS_VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_CRM_MISSING_DETAILS_ADMISSION), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_CRM_MISSING_DETAILS_VIEW);
            END IF;
            
        -- 	EXPENSE EXPENSE_CATEGORIES			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_CATEGORIES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_CATEGORIES_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_CATEGORIES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_CATEGORIES_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_CATEGORIES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_CATEGORIES_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_CATEGORIES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_CATEGORIES_DELETE);
            END IF;

        -- 	EXPENSE EXPENSE_SUBCATEGORIES		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_SUBCATEGORIES_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_SUBCATEGORIES_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_SUBCATEGORIES_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_SUBCATEGORIES), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_SUBCATEGORIES_DELETE);
            END IF;
            
        -- 	EXPENSE EXPENSE_MASTER		   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_EXPENSE_MASTER_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_EXPENSE_MASTER_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_EXPENSE_MASTER_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE_MASTER), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_EXPENSE_MASTER_DELETE);
            END IF;

        -- 	EXPENSE EXPENS			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_EXPENSE_EXPENSE_VIEW);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE AND a.action_code = PAGE_ACTION_ADD) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_ADD),TAG_EXPENSE_EXPENSE_CREATE);
            END IF;	
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_EXPENSE_EXPENSE_UPDATE);
            END IF;
                    
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_EXPENSE AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_EXPENSE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_EXPENSE_EXPENSE_DELETE);
            END IF;	

        -- 	ACADEMIC USER_BATCH			   
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_VIEW);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON p.id = pa.page_id INNER JOIN actions a ON a.id = pa.action_id 
				   WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STUDENT_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
				INSERT INTO page_actions (page_id,action_id,tag) 
                VALUES ((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STUDENT_VIEW),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_STUDENT_VIEW);
	        END IF;
	        IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p ON p.id = pa.page_id INNER JOIN actions a ON a.id = pa.action_id 
				   WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
				INSERT INTO page_actions (page_id,action_id,tag) 
                VALUES ((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_ATTENDANCE_VIEW);
	        END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
				  WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STD_SIGNING_SHEET_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_STD_SIGNING_SHEET_VIEW),(SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW);
            END IF;
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
				  WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW),
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW);
            END IF;
        -- INCOME CSV FILE VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ADMISSION_INCOME_CSV_FILE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_INCOME_CSV_FILE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_INCOME_CSV_FILE);
            END IF;
            
            -- EXPENSE CSV FILE VIEW 
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_EXPENSE_CSV_FILE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_EXPENSE_CSV_FILE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_EXPENSE_CSV_FILE_VIEW);
            END IF;
            
            -- TEMPLATE SIGNING SHEET DELETE
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET AND a.action_code = PAGE_ACTION_DELETE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_MASTER_TEMPLATE_SHINING_SHEET), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_DELETE),TAG_MASTER_TEMPLATE_SHINING_SHEET_DELETE);
            END IF;
            
            -- USER BATCH START VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_USER_BATCH_START_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_USER_BATCH_START_VIEW), 
                    (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_USER_BATCH_START_VIEW);
            END IF;   
            -- UN_ASSIGN_BATCH_ADMISSION
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_UN_ASSIGN_BATCH_ADMISSION_VIEW);
            END IF; 
            -- MY_TEAM_BATCHES_VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_MY_TEAM_BATCHES_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_MY_TEAM_BATCHES_VIEW);
            END IF;
            
            -- STUDENT_MARKS_VIEW
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ACADEMIC_STUDENT_MARKS_VIEW);
            END IF;

            -- STUDENT_MARKS_UPDATE (Update)
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                        WHERE p.page_code = PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW AND a.action_code = PAGE_ACTION_UPDATE) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ACADEMIC_STUDENT_MARKS_VIEW), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_UPDATE),TAG_ACADEMIC_STUDENT_MARKS_UPDATE);
            END IF;

            -- ADMISSION_REPORT_CSV_FILE page_action		
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_ADMISSION_ADMISSION_REPORT_CSV_FILE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_ADMISSION_REPORT_CSV_FILE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_ADMISSION_REPORT_CSV_FILE);
            END IF;
            
            -- OUTSTANDING_INCOME_CSV_FILE page_action		
            IF NOT EXISTS (SELECT pa.id FROM page_actions pa INNER JOIN pages p on pa.page_id = p.id INNER JOIN actions a on pa.action_id = a.id
                    WHERE p.page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME_CSV_FILE AND a.action_code = PAGE_ACTION_VIEW) THEN
                INSERT INTO page_actions (page_id, action_id, tag) 
                VALUES((SELECT id FROM pages WHERE page_code = PAGE_CODE_ADMISSION_OUTSTANDING_INCOME_CSV_FILE), (SELECT id FROM actions WHERE action_code = PAGE_ACTION_VIEW),TAG_ADMISSION_OUTSTANDING_INCOME_CSV_FILE);
            END IF;
            
    -----------  action end -----------
    END $$;


	/* permission pages add sequence */

	UPDATE pages p SET sequence=1 WHERE p.page_code = 'DASHBOARD';
	
	UPDATE pages p SET sequence=2 WHERE p.page_code = 'USER_CONFIGURATION';
	
	UPDATE pages p SET sequence=3 WHERE p.page_code = 'USERS_USERS';
	
	UPDATE pages p SET sequence=4 WHERE p.page_code = 'USERS_ROLES';
		
	UPDATE pages p SET sequence=5 WHERE p.page_code = 'MASTER';
		
	UPDATE pages p SET sequence=6 WHERE p.page_code = 'MASTER_ZONES';
		
	UPDATE pages p SET sequence=7 WHERE p.page_code = 'MASTER_BRANCHES';	
		
	UPDATE pages p SET sequence=8 WHERE p.page_code = 'MASTER_DEPARTMENTS';

	UPDATE pages p SET sequence=9 WHERE p.page_code = 'MASTER_SUBDEPARTMENTS';

	UPDATE pages p SET sequence=10 WHERE p.page_code = 'MASTER_COURSES';
	
	UPDATE pages p SET sequence=11 WHERE p.page_code = 'MASTER_SUBCOURSES';
	
	UPDATE pages p SET sequence=12 WHERE p.page_code = 'MASTER_SUBCOURSE_TOPIC';
	
	UPDATE pages p SET sequence=13 WHERE p.page_code = 'MASTER_TEMPLATE_SHINING_SHEET';
	
	UPDATE pages p SET sequence=14 WHERE p.page_code = 'MASTER_PACKAGES';
	
	UPDATE pages p SET sequence=15 WHERE p.page_code = 'MASTER_BATCHES';
	
	UPDATE pages p SET sequence=16 WHERE p.page_code = 'MASTER_CITY';
	
	UPDATE pages p SET sequence=17 WHERE p.page_code = 'MASTER_AREA';
	
	UPDATE pages p SET sequence=18 WHERE p.page_code = 'ADMISSION';
	
	UPDATE pages p SET sequence=19 WHERE p.page_code = 'ADMISSION_ADD_ADMISSION';
	
	UPDATE pages p SET sequence=20 WHERE p.page_code = 'ADMISSION_VIEW_ADMISSION';
	
	UPDATE pages p SET sequence=21 WHERE p.page_code = 'ADMISSION_BASIC_INFO';
	
	UPDATE pages p SET sequence=22 WHERE p.page_code = 'ADMISSION_COURSE_INFO';
	
	UPDATE pages p SET sequence=23 WHERE p.page_code = 'ADMISSION_COURSE_BATCH_ASSIGN';
	
	UPDATE pages p SET sequence=24 WHERE p.page_code = 'ADMISSION_COURSE_AS_COMPLETED';
	
	UPDATE pages p SET sequence=25 WHERE p.page_code = 'ADMISSION_COURSE_MODIFICATION';
	
	UPDATE pages p SET sequence=26 WHERE p.page_code = 'ADMISSION_COURSE_ADMISSION_LETTER';
	
	UPDATE pages p SET sequence=27 WHERE p.page_code = 'ADMISSION_TRANSFER_ADMISSION';
	
	UPDATE pages p SET sequence=28 WHERE p.page_code = 'ADMISSION_PAYMENT_INSTALLMENTS_DETAILS';
	
	UPDATE pages p SET sequence=29 WHERE p.page_code = 'ADMISSION_INSTALLMENT_MODIFY';
	
	UPDATE pages p SET sequence=30 WHERE p.page_code = 'ADMISSION_INSTALLMENTS_REPORT';
	
	UPDATE pages p SET sequence=31 WHERE p.page_code = 'ADMISSION_FEES_LETTER';
	
	UPDATE pages p SET sequence=32 WHERE p.page_code = 'ADMISSION_STATUS_CANCELLED_UPDATE';
	
	UPDATE pages p SET sequence=33 WHERE p.page_code = 'ADMISSION_STATUS_MARK_TERMINATED_UPDATE';
	
	UPDATE pages p SET sequence=34 WHERE p.page_code = 'ADMISSION_STATUS_HOLD_UPDATE';
	
	UPDATE pages p SET sequence=35 WHERE p.page_code = 'ADMISSION_STATUS_HOLD_OVER_VIEW';
	
	UPDATE pages p SET sequence=36 WHERE p.page_code = 'ADMISSION_DOCUMENTS_DETAILS';
	
	UPDATE pages p SET sequence=37 WHERE p.page_code = 'ADMISSION_MISSING_ADMISSION';
	
	UPDATE pages p SET sequence=38 WHERE p.page_code = 'ADMISSION_POSTAL_COMMUNICATION_INFO';
	
	UPDATE pages p SET sequence=39 WHERE p.page_code = 'ADMISSION_PARENT_DETAILS_INFO';
	
	UPDATE pages p SET sequence=40 WHERE p.page_code = 'ADMISSION_EDUCATION_DETAILS_INFO';
	
	UPDATE pages p SET sequence=41 WHERE p.page_code = 'ADMISSION_OVERDUE_INCOME';
	
	UPDATE pages p SET sequence=42 WHERE p.page_code = 'ADMISSION_OUTSTANDING_INCOME';
	
	UPDATE pages p SET sequence=43 WHERE p.page_code = 'INCOME';
	
	UPDATE pages p SET sequence=44 WHERE p.page_code = 'ADMISSION_CHEQUE_LIST';
	
	UPDATE pages p SET sequence=45 WHERE p.page_code = 'ADMISSION_CHEQUE_COMMENT_ADD';
	
	UPDATE pages p SET sequence=46 WHERE p.page_code = 'ADMISSION_REMARKS';
	
	UPDATE pages p SET sequence=47 WHERE p.page_code = 'EXPENSE';
	
	UPDATE pages p SET sequence=48 WHERE p.page_code = 'EXPENSE_CATEGORIES';
	
	UPDATE pages p SET sequence=49 WHERE p.page_code = 'EXPENSE_SUBCATEGORIES';
	
	UPDATE pages p SET sequence=50 WHERE p.page_code = 'EXPENSE_MASTER';
	
	UPDATE pages p SET sequence=51 WHERE p.page_code = 'EXPENSE_EXPENSE';
	
	UPDATE pages p SET sequence=52 WHERE p.page_code = 'ACADEMIC';
	
	UPDATE pages p SET sequence=53 WHERE p.page_code = 'ACADEMIC_USER_BATCH';
	
	UPDATE pages p SET sequence=54 WHERE p.page_code = 'ACADEMIC_USER_BATCH_STUDENT_VIEW';
	
	UPDATE pages p SET sequence=55 WHERE p.page_code = 'ACADEMIC_USER_BATCH_ATTENDANCE_VIEW';


    /* payment mode sequence update query */

UPDATE payment_mode p SET sequence=1 WHERE p.name = 'CASH';
	UPDATE payment_mode p SET sequence=2 WHERE p.name = 'ONLINE_PAYMENT';
	UPDATE payment_mode p SET sequence=3 WHERE p.name = 'CHEQUE';
	UPDATE payment_mode p SET sequence=4 WHERE p.name = 'DD';
	UPDATE payment_mode p SET sequence=5 WHERE p.name = 'NEFT/IMPS';
	UPDATE payment_mode p SET sequence=6 WHERE p.name = 'PAYPAL';
	UPDATE payment_mode p SET sequence=7 WHERE p.name = 'INSTAMOJO';
	UPDATE payment_mode p SET sequence=8 WHERE p.name = 'BHIM_UPI_(INDIA)';
	UPDATE payment_mode p SET sequence=9 WHERE p.name = 'BAJAJ_FINSERV_(EMI)';
	UPDATE payment_mode p SET sequence=10 WHERE p.name = 'PHONE_PAY';
	UPDATE payment_mode p SET sequence=11 WHERE p.name = 'GOOGLE_PAY';
	UPDATE payment_mode p SET sequence=12 WHERE p.name = 'CAPITAL_FLOAT_(EMI)';
	UPDATE payment_mode p SET sequence=13 WHERE p.name = 'BANK_DEPOSIT_(CASH)';
	UPDATE payment_mode p SET sequence=14 WHERE p.name = 'PAYTM';
	UPDATE payment_mode p SET sequence=15 WHERE p.name = 'DEBIT_CARD';
	UPDATE payment_mode p SET sequence=16 WHERE p.name = 'CREDIT_CARD';
	UPDATE payment_mode p SET sequence=17 WHERE p.name = 'RAZORPAY';


-- script for subcourses add course_config_id and create in course_configs table
DO $$ 
DECLARE
		subcoursesData INTEGER;
		courseConfigId INTEGER;
BEGIN
		for subcoursesData IN select id from subcourses where course_config_id is NULL 
		LOOP
			INSERT INTO course_configs(
			ptm_day, ptm_grace_after, ptm_grace_before, cv_day, cv_grace_after, cv_grace_before, es_day, es_grace_after, 
			es_grace_before)
			VALUES ( 0, 0, 0, 0, 0, 0, 0, 0, 0)
			returning id INTO courseConfigId;
			
			UPDATE subcourses SET course_config_id = courseConfigId where id =  CAST(subcoursesData AS INTEGER);
		END LOOP;
END $$;
-- script for packages add course_config_id and create in course_configs table
DO $$ 
DECLARE
		packagesData INTEGER;
		courseConfigId INTEGER;
BEGIN
		for packagesData IN select id from packages where course_config_id is NULL 
		LOOP
			INSERT INTO course_configs(
			ptm_day, ptm_grace_after, ptm_grace_before, cv_day, cv_grace_after, cv_grace_before, es_day, es_grace_after, 
			es_grace_before)
			VALUES ( 0, 0, 0, 0, 0, 0, 0, 0, 0)
			returning id INTO courseConfigId;
			
			UPDATE packages SET course_config_id = courseConfigId where id =  CAST(packagesData AS INTEGER);
		END LOOP;
END $$;