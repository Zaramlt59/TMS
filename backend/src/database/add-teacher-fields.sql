-- Migration script to add missing fields to teachers table
-- Run this after the main schema.sql

USE ttms_db;

-- Add missing fields to teachers table
ALTER TABLE teachers 
ADD COLUMN phone_number VARCHAR(15) AFTER joining_year,
ADD COLUMN email VARCHAR(255) AFTER phone_number,
ADD COLUMN social_group ENUM('General', 'OBC', 'SC', 'ST', 'Other') AFTER email,
ADD COLUMN religion ENUM('Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other') AFTER social_group,
ADD COLUMN gender ENUM('Male', 'Female', 'Other') AFTER religion,
ADD COLUMN aadhaar_number VARCHAR(12) UNIQUE AFTER gender,
ADD COLUMN area_village VARCHAR(255) AFTER aadhaar_number,
ADD COLUMN joining_date DATE AFTER area_village;

-- Update existing records with default values
UPDATE teachers SET 
    phone_number = '0000000000',
    email = '',
    social_group = 'General',
    religion = 'Other',
    gender = 'Other',
    aadhaar_number = CONCAT('000000000000', id),
    area_village = 'N/A',
    joining_date = CONCAT(joining_year, '-01-01');

-- Make required fields NOT NULL after setting default values
ALTER TABLE teachers 
MODIFY phone_number VARCHAR(15) NOT NULL,
MODIFY social_group ENUM('General', 'OBC', 'SC', 'ST', 'Other') NOT NULL,
MODIFY religion ENUM('Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other') NOT NULL,
MODIFY gender ENUM('Male', 'Female', 'Other') NOT NULL,
MODIFY aadhaar_number VARCHAR(12) NOT NULL,
MODIFY area_village VARCHAR(255) NOT NULL,
MODIFY joining_date DATE NOT NULL;

-- Add indexes for better performance
CREATE INDEX idx_teachers_phone_number ON teachers(phone_number);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_aadhaar_number ON teachers(aadhaar_number);
CREATE INDEX idx_teachers_social_group ON teachers(social_group);
CREATE INDEX idx_teachers_religion ON teachers(religion);
CREATE INDEX idx_teachers_gender ON teachers(gender);
