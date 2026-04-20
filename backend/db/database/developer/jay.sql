
delete from admission_subcourse where admission_id in (71,72);
delete from admission_subcourse_fees where admission_id in (71,72);
delete from admission_fees where admission_id in (71,72);
delete from admission_installments where admission_id in (71,72);
delete from admission_status_histories where admission_id in (71,72);
delete from admission_documents where admission_id in (71,72);
delete from admissions where id in (71,72);

DO
$$
BEGIN
  IF EXISTS(SELECT *  FROM information_schema.sequences WHERE sequence_name='student_details_gr_id_seq')
    THEN
		ALTER TABLE student_details ALTER COLUMN gr_id DROP DEFAULT; 
        DROP SEQUENCE student_details_gr_id_seq;
	END IF;
END
$$;



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
				SET --admission_amount = CAST(admissionsData::json->>'admission_amount' AS NUMERIC),
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