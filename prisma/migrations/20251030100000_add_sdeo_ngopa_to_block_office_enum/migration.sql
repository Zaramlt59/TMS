-- Add 'SDEO Ngopa' to schools.block_office ENUM
-- This aligns the database with prisma/schema.prisma where SDEO_Ngopa is already defined

ALTER TABLE `schools`
  MODIFY COLUMN `block_office` ENUM(
    'DEO Aizawl',
    'DEO Champhai',
    'DEO Hnahthial',
    'DEO Khawzawl',
    'DEO Kolasib',
    'DEO Lawngtlai',
    'DEO Lunglei',
    'DEO Mamit',
    'DEO Saitual',
    'DEO Serchhip',
    'DEO Siaha',
    'Education Office(CADC)',
    'Education Office (LADC)',
    'Education Office (MADC)',
    'SDEO Aizawl East',
    'SDEO Aizawl South',
    'SDEO Aizawl West',
    'SDEO Champhai',
    'SDEO Darlawn',
    'SDEO Hnahthial',
    'SDEO Kawnpui',
    'SDEO Kawrthah',
    'SDEO Khawzawl',
    'SDEO Kolasib',
    'SDEO Lunglei North',
    'SDEO Lunglei South',
    'SDEO Lungsen',
    'SDEO Mamit',
    'SDEO North Vanlaiphai',
    'SDEO Ngopa',
    'SDEO Saitual',
    'SDEO Serchhip',
    'SDEO Thenzawl',
    'SDEO West Phaileng'
  ) NOT NULL;


