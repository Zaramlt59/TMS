-- Create database
CREATE DATABASE IF NOT EXISTS ttms_db;
USE ttms_db;

-- Schools table
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id VARCHAR(50) UNIQUE NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_type ENUM('Co-educational', 'Girls') NOT NULL,
    school_level VARCHAR(100) NOT NULL, -- Primary School, Middle School, High School, Higher Secondary School
    management ENUM('Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra') NOT NULL,
    medium ENUM('Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali') NOT NULL,
    pincode VARCHAR(10),
    district VARCHAR(100),
    rd_block VARCHAR(100), -- Stores RD Block names (e.g., 'Aizawl East Block')
    school_phone VARCHAR(20),
    school_email VARCHAR(255),
    habitation VARCHAR(255), -- Stores habitation/village names (e.g., 'Aizawl East Block Village 1')
    habitation_class ENUM('Rural', 'Urban'),
    habitation_category ENUM('City', 'Town', 'Village'),
    block_office ENUM(
        'DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib',
        'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip',
        'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)',
        'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai',
        'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl',
        'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit',
        'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Teachers table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    joining_year YEAR NOT NULL,
    subjects_taught VARCHAR(500) NOT NULL, -- Maths, Mizo, English, Social Science, Science, Hindi, W.E (comma-separated)
    classes_taught VARCHAR(500) NOT NULL, -- Class 1 to Class 12 (comma-separated)
    school_id VARCHAR(50) NOT NULL,
    current_school_name VARCHAR(255) NOT NULL,
    school_level VARCHAR(100) NOT NULL,
    management ENUM('Adhoc Aided', 'Central', 'Council Aided', 'Deficit', 'Deficit Mission', 'Government', 'Local Body', 'Lumpsum Aided', 'Private', 'Samagra') NOT NULL,
    medium ENUM('Bengali', 'Chakma', 'English', 'Hindi', 'Mizo', 'Nepali') NOT NULL,
    habitation VARCHAR(255), -- Stores habitation/village names (e.g., 'Aizawl East Block Village 1')
    pincode VARCHAR(10),
    district VARCHAR(100),
    rd_block VARCHAR(100), -- Stores RD Block names (e.g., 'Aizawl East Block')
    school_phone VARCHAR(20),
    habitation_class ENUM('Rural', 'Urban'),
    habitation_category ENUM('City', 'Town', 'Village'),
    block_office ENUM(
        'DEO Aizawl', 'DEO Champhai', 'DEO Hnahthial', 'DEO Khawzawl', 'DEO Kolasib',
        'DEO Lawngtlai', 'DEO Lunglei', 'DEO Mamit', 'DEO Saitual', 'DEO Serchhip',
        'DEO Siaha', 'Education Office(CADC)', 'Education Office (LADC)', 'Education Office (MADC)',
        'SDEO Aizawl East', 'SDEO Aizawl South', 'SDEO Aizawl West', 'SDEO Champhai',
        'SDEO Darlawn', 'SDEO Hnahthial', 'SDEO Kawnpui', 'SDEO Kawrthah', 'SDEO Khawzawl',
        'SDEO Kolasib', 'SDEO Lunglei North', 'SDEO Lunglei South', 'SDEO Lungsen', 'SDEO Mamit',
        'SDEO North Vanlaiphai', 'SDEO Saitual', 'SDEO Serchhip', 'SDEO Thenzawl', 'SDEO West Phaileng'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

-- Districts table
CREATE TABLE districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default districts
INSERT INTO districts (name) VALUES 
('Aizawl'), ('Champhai'), ('Mamit'), ('Khawzawl'), ('Hnahthial'), 
('Lunglei'), ('Lawngtlai'), ('Serchhip'), ('Saitual'), ('Kolasib'), ('Siaha');

-- Create indexes for better performance
CREATE INDEX idx_schools_school_id ON schools(school_id);
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_teachers_district ON teachers(district);
CREATE INDEX idx_districts_name ON districts(name);
