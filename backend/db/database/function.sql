CREATE OR REPLACE FUNCTION set_created_date() RETURNS trigger AS $$
/* ------------------------------------------------------------------------------------
FUNCTION: set_created_date
DESCRIPTION 	: This function use to generate trigger for created date
CREATED BY 		: Dhruv Sonani
CREATED DATE	: 21-April-2026
MODIFIED BY		: Dhruv Sonani
MODIFIED DATE	: 21-April-2026
CHANGE HISTORY	:
21-April-2026 - Dhruv Sonani - add a condition: if date already set, then not modify it
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
UPDATED BY 		: Dhruv Sonani
UPDATED DATE	: 21-April-2026
CHANGE HISTORY	:
21-April-2026 - Dhruv Sonani - add a condition: if date already set, then not modify it
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
CREATED BY 		: Dhruv Sonani
CREATED DATE	: 21-April-2026
UPDATED BY      : Dhruv Sonani
UPDATED DATE    : 21-April-2026
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
