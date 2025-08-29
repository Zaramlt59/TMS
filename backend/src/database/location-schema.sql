-- Location Schema for Cascading Dropdowns
-- Districts → RD Blocks → Villages (Habitations)

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create rd_blocks table
CREATE TABLE IF NOT EXISTS rd_blocks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rd_block_per_district (district_id, name)
);

-- Create villages table (for habitations)
CREATE TABLE IF NOT EXISTS villages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rd_block_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rd_block_id) REFERENCES rd_blocks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_village_per_rd_block (rd_block_id, name)
);

-- Create indexes for better performance
CREATE INDEX idx_rd_blocks_district_id ON rd_blocks(district_id);
CREATE INDEX idx_villages_rd_block_id ON villages(rd_block_id);
