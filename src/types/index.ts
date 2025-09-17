export interface School {
  id?: number;
  school_id: string;
  school_name: string;
  school_type: 'Co-educational' | 'Girls';
  school_level: string;
  management: 'Adhoc Aided' | 'Central' | 'Council Aided' | 'Deficit' | 'Deficit Mission' | 'Government' | 'Local Body' | 'Lumpsum Aided' | 'Private' | 'Samagra';
  medium: 'Bengali' | 'Chakma' | 'English' | 'Hindi' | 'Mizo' | 'Nepali';
  pincode?: string;
  district?: string;
  rd_block?: string;
  school_phone?: string;
  school_email?: string;
  habitation?: string;
  habitation_class?: 'Rural' | 'Urban';
  habitation_category?: 'City' | 'Town' | 'Village';
  block_office: 'DEO Aizawl' | 'DEO Champhai' | 'DEO Hnahthial' | 'DEO Khawzawl' | 'DEO Kolasib' | 'DEO Lawngtlai' | 'DEO Lunglei' | 'DEO Mamit' | 'DEO Saitual' | 'DEO Serchhip' | 'DEO Siaha' | 'Education Office(CADC)' | 'Education Office (LADC)' | 'Education Office (MADC)' | 'SDEO Aizawl East' | 'SDEO Aizawl South' | 'SDEO Aizawl West' | 'SDEO Champhai' | 'SDEO Darlawn' | 'SDEO Hnahthial' | 'SDEO Kawnpui' | 'SDEO Kawrthah' | 'SDEO Khawzawl' | 'SDEO Kolasib' | 'SDEO Lunglei North' | 'SDEO Lunglei South' | 'SDEO Lungsen' | 'SDEO Mamit' | 'SDEO North Vanlaiphai' | 'SDEO Saitual' | 'SDEO Serchhip' | 'SDEO Thenzawl' | 'SDEO West Phaileng';
  created_at?: Date;
  updated_at?: Date;
}

export interface Teacher {
  id?: number;
  teacher_name: string;
  date_of_birth: string;
  joining_date: string;
  phone_number: string;
  email?: string;
  social_group: 'ST' | 'SC' | 'OBC' | 'General';
  religion: 'Hindu' | 'Islam' | 'Christian' | 'Sikh' | 'Buddhist' | 'Jain';
  gender: 'Male' | 'Female' | 'Others';
  aadhaar_number: string;
  subjects_taught: string[];
  classes_taught: string[];
  school_id: string;
  current_school_name: string;
  school_name_full?: string;
  school_level: string;
  management: 'Adhoc Aided' | 'Central' | 'Council Aided' | 'Deficit' | 'Deficit Mission' | 'Government' | 'Local Body' | 'Lumpsum Aided' | 'Private' | 'Samagra';
  medium: 'Bengali' | 'Chakma' | 'English' | 'Hindi' | 'Mizo' | 'Nepali';
  habitation?: string;
  pincode?: string;
  district?: string;
  rd_block?: string;
  school_phone?: string;
  habitation_class?: 'Rural' | 'Urban';
  habitation_category?: 'City' | 'Town' | 'Village';
  block_office: 'DEO Aizawl' | 'DEO Champhai' | 'DEO Hnahthial' | 'DEO Khawzawl' | 'DEO Kolasib' | 'DEO Lawngtlai' | 'DEO Lunglei' | 'DEO Mamit' | 'DEO Saitual' | 'DEO Serchhip' | 'DEO Siaha' | 'Education Office(CADC)' | 'Education Office (LADC)' | 'Education Office (MADC)' | 'SDEO Aizawl East' | 'SDEO Aizawl South' | 'SDEO Aizawl West' | 'SDEO Champhai' | 'SDEO Darlawn' | 'SDEO Hnahthial' | 'SDEO Kawnpui' | 'SDEO Kawrthah' | 'SDEO Khawzawl' | 'SDEO Kolasib' | 'SDEO Lunglei North' | 'SDEO Lunglei South' | 'SDEO Lungsen' | 'SDEO Mamit' | 'SDEO North Vanlaiphai' | 'SDEO Saitual' | 'SDEO Serchhip' | 'SDEO Thenzawl' | 'SDEO West Phaileng';
  deputation: Deputation[];
  attachment: Attachment[];
  posting_history: PostingHistory[];
  created_at?: Date;
  updated_at?: Date;
}

export interface District {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Medium {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ManagementType {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface BlockOffice {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Religion {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Subject {
  id?: number;
  name: string;
  code?: string;
  classes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SchoolType {
  id?: number;
  name: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface RdBlock {
  id?: number;
  name: string;
  district_id: number;
  district_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Habitation {
  id?: number;
  name: string;
  rd_block_id: number;
  rd_block_name?: string;
  district_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PostingHistory {
  id?: number;
  school_name: string;
  school_type: 'Co-educational' | 'Girls';
  medium: string;
  management: string;
  block_office: string;
  district: string;
  rd_block?: string;
  pincode?: string;
  habitation?: string;
  habitation_class?: 'Rural' | 'Urban';
  habitation_category?: 'City' | 'Town' | 'Village';
  from_date: string;
  to_date?: string;
  status?: 'Active' | 'Completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface Deputation {
  id?: number;
  department_name: string;
  designation: string;
  joining_date: string;
  end_date?: string;
  status: 'Active' | 'Completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface Attachment {
  id?: number;
  department_name: string;
  designation: string;
  district: string;
  rd_block?: string;
  habitation?: string;
  joining_date: string;
  end_date?: string;
  status: 'Active' | 'Completed';
  created_at?: Date;
  updated_at?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
