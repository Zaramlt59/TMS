<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}
        </h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {{ isEditing ? 'Update teacher information' : 'Create a new teacher record' }}
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link to="/teachers" class="btn-secondary">
          Back to Teachers
        </router-link>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Information</h3>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Teacher Name *</label>
              <input
                id="teacher-name"
                name="teacher-name"
                v-model="form.teacher_name"
                type="text"
                required
                class="form-input"
                placeholder="Enter teacher name"
                @input="validateTeacherName"
                @keypress="allowOnlyLetters"
              />
            </div>
            <div>
              <label class="form-label">Teacher ID *</label>
              <input
                id="teacher-id"
                name="teacher-id"
                v-model="form.teacher_ID"
                @input="validateTeacherID"
                type="text"
                required
                class="form-input"
                placeholder="Enter teacher ID"
                maxlength="50"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Date of Birth *</label>
              <input
                id="date-of-birth"
                name="date-of-birth"
                v-model="form.date_of_birth"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div>
              <label class="form-label">Joining Date *</label>
              <input
                id="joining-date"
                name="joining-date"
                v-model="form.joining_date"
                type="date"
                required
                class="form-input"
                placeholder="dd - mm - yyyy"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Phone Number *</label>
              <input
                id="phone-number"
                name="phone-number"
                v-model="form.phone_number"
                type="tel"
                required
                class="form-input"
                placeholder="Enter phone number"
                maxlength="10"
                pattern="[0-9]{10}"
                title="Please enter exactly 10 digits"
                @input="validatePhoneNumber"
                @keypress="allowOnlyNumbers"
              />
            </div>
            <div>
              <label class="form-label">Email</label>
              <input
                id="email"
                name="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Social Group *</label>
              <select v-model="form.social_group" required class="form-select">
                <option value="">Select social group</option>
                <option v-for="group in SOCIAL_GROUPS" :key="group" :value="group">
                  {{ group }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Religion *</label>
              <select v-model="form.religion" required class="form-select">
                <option value="">Select religion</option>
                        <option v-for="religion in religions" :key="religion" :value="religion">
          {{ religion }}
        </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Gender *</label>
              <select v-model="form.gender" required class="form-select">
                <option value="">Select gender</option>
                <option v-for="gender in GENDERS" :key="gender" :value="gender">
                  {{ gender }}
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Aadhaar Number</label>
              <input
                id="aadhaar-number"
                name="aadhaar-number"
                v-model="form.aadhaar_number"
                type="text"
                class="form-input"
                placeholder="Enter Aadhaar number (optional)"
                maxlength="12"
                pattern="[0-9]{12}"
                title="Please enter exactly 12 digits"
                @input="validateAadhaarNumber"
                @keypress="allowOnlyNumbers"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">School *</label>
              <select v-model="selectedSchoolId" required class="form-select" @change="onSchoolChange()">
                <option value="">Select school</option>
                <option v-for="school in schools" :key="school.school_id" :value="school.school_id">
                  {{ school.school_name }} ({{ school.school_id }})
                </option>
              </select>
            </div>
            <div>
              <label class="form-label">Service Category</label>
              <select v-model="form.service_category" class="form-select">
                <option value="">Select service category</option>
                <option v-for="cat in serviceCategories" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          

          <div>
            <label class="form-label">Classes Taught *</label>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              <label v-for="classItem in CLASSES" :key="classItem" class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  :value="classItem"
                  v-model="form.classes_taught"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ classItem }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="form-label">Subjects Taught *</label>
            <div v-if="availableSubjects.length > 0" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
              <label v-for="subject in availableSubjects" :key="subject.name" class="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  :value="subject.name"
                  v-model="form.subjects_taught"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ subject.name }}</span>
              </label>
            </div>
            <div v-else-if="form.classes_taught.length === 0" class="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              Please select classes first to see available subjects
            </div>
            <div v-else class="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              No subjects available for the selected classes
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Posting History</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Add previous school postings for this teacher</p>
        </div>
        <div class="card-body space-y-4">
          <!-- Existing Posting History Items -->
          <div v-for="(posting, index) in form.posting_histories" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100">Previous Posting #{{ index + 1 }}</h4>
              <button 
                type="button" 
                @click="removePosting(index)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">School Name *</label>
                <select v-model="posting.school_name" required class="form-select" @change="onPostingSchoolChange(posting)">
                  <option value="">Select school</option>
                  <option v-for="school in schools" :key="school.school_id" :value="school.school_name">
                    {{ school.school_name }} ({{ school.school_id }})
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">School Type *</label>
                <select v-model="posting.school_type" required class="form-select">
                  <option value="">Select school type</option>
                  <option v-for="schoolType in schoolTypes" :key="schoolType.id" :value="schoolType.name">
                    {{ schoolType.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Medium *</label>
                <select v-model="posting.medium" required class="form-select">
                  <option value="">Select medium</option>
                  <option v-for="medium in mediums" :key="medium.id" :value="medium.name">
                    {{ medium.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">Management *</label>
                <select v-model="posting.management" required class="form-select">
                  <option value="">Select management</option>
                  <option v-for="management in managementTypes" :key="management.id" :value="management.name">
                    {{ management.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Block Office *</label>
                <select v-model="posting.block_office" required class="form-select">
                  <option value="">Select block office</option>
                  <option v-for="office in blockOffices" :key="office.id" :value="office.name">
                    {{ office.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">District *</label>
                <select v-model="posting.district" required class="form-select" @change="onPostingDistrictChange(posting, index)">
                  <option value="">Select district</option>
                  <option v-for="district in districts" :key="district.id" :value="district.name">
                    {{ district.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">RD Block</label>
                <select v-model="posting.rd_block" class="form-select" :disabled="!posting.district" @change="onPostingRdBlockChange(posting, index)">
                  <option value="">Select RD Block</option>
                  <option v-for="rdBlock in postingRdBlocks[index]" :key="rdBlock.id" :value="rdBlock.name">
                    {{ rdBlock.name }}
                  </option>
                </select>
                <div v-if="!posting.district" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Please select a district first</div>
              </div>
              <div>
                <label class="form-label">Habitation</label>
                <select v-model="posting.habitation" class="form-select" :disabled="!posting.rd_block">
                  <option value="">Select Habitation</option>
                  <option v-for="village in postingVillages[index]" :key="village.id" :value="village.name">
                    {{ village.name }}
                  </option>
                </select>
                <div v-if="!posting.rd_block" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Please select an RD block first</div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">From Date *</label>
                <input
                  v-model="posting.from_date"
                  type="date"
                  required
                  class="form-input"
                  placeholder="dd - mm - yyyy"
                />
              </div>
              <div>
                <label class="form-label">To Date</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="posting.to_date"
                    type="date"
                    class="form-input flex-1"
                    placeholder="dd - mm - yyyy"
                    @change="onPostingEndDateChange(posting)"
                  />
                  <span v-if="!posting.to_date" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Current
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if still ongoing</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Pincode</label>
                <input
                  v-model="posting.pincode"
                  type="text"
                  class="form-input"
                  placeholder="Enter pincode"
                  maxlength="6"
                  pattern="[0-9]{6}"
                  @input="validatePostingPincode"
                  @keypress="allowOnlyNumbers"
                />
              </div>
              <div>
                <label class="form-label">Status</label>
                <div class="flex items-center space-x-2">
                  <select v-model="posting.status" class="form-select flex-1">
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <span v-if="posting.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                        :class="posting.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                    {{ posting.status }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-updates based on end date</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Habitation Class</label>
                <select v-model="posting.habitation_class" class="form-select">
                  <option value="">Select habitation class</option>
                  <option value="Rural">Rural</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
              <div>
                <label class="form-label">Habitation Category</label>
                <select v-model="posting.habitation_category" class="form-select">
                  <option value="">Select habitation category</option>
                  <option value="City">City</option>
                  <option value="Town">Town</option>
                  <option value="Village">Village</option>
                </select>
              </div>
            </div>


          </div>

          <!-- Add New Posting Button -->
          <div class="text-center">
            <button 
              type="button" 
              @click="addNewPosting"
              class="btn-secondary"
            >
              + Add Previous Posting
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Deputation</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Add deputation assignments for this teacher</p>
        </div>
        <div class="card-body space-y-4">
          <!-- Existing Deputation Items -->
          <div v-for="(deputation, index) in form.deputations" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100">Deputation #{{ index + 1 }}</h4>
              <button 
                type="button" 
                @click="removeDeputation(index)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Name of Department *</label>
                <input
                  v-model="deputation.department_name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter department name"
                  @input="validateDepartmentName"
                  @keypress="allowOnlyLetters"
                />
              </div>
              <div>
                <label class="form-label">As (Designation) *</label>
                <input
                  v-model="deputation.designation"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter designation"
                  @input="validateDesignation"
                  @keypress="allowOnlyLetters"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Joining Date *</label>
                <input
                  v-model="deputation.joining_date"
                  type="date"
                  required
                  class="form-input"
                  placeholder="dd - mm - yyyy"
                />
              </div>
              <div>
                <label class="form-label">End Date</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="deputation.end_date"
                    type="date"
                    class="form-input flex-1"
                    placeholder="dd - mm - yyyy"
                    @change="onDeputationEndDateChange(deputation)"
                  />
                  <span v-if="!deputation.end_date" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Current
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if still ongoing</p>
              </div>
              <div>
                <label class="form-label">Status *</label>
                <div class="flex items-center space-x-2">
                  <select v-model="deputation.status" required class="form-select flex-1">
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <span v-if="deputation.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                        :class="deputation.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                    {{ deputation.status }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Status will auto-update based on end date</p>
              </div>
            </div>
          </div>

          <!-- Add New Deputation Button -->
          <div class="text-center">
            <button 
              type="button" 
              @click="addNewDeputation"
              class="btn-secondary"
            >
              + Add Deputation
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Attachment</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Add attachment assignments for this teacher</p>
        </div>
        <div class="card-body space-y-4">
          <!-- Existing Attachment Items -->
          <div v-for="(attachment, index) in form.attachments" :key="index" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium text-gray-900 dark:text-gray-100">Attachment #{{ index + 1 }}</h4>
              <button 
                type="button" 
                @click="removeAttachment(index)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </div>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Name of Department *</label>
                <input
                  v-model="attachment.department_name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter department name"
                  @input="validateAttachmentDepartmentName"
                  @keypress="allowOnlyLetters"
                />
              </div>
              <div>
                <label class="form-label">As (Designation) *</label>
                <input
                  v-model="attachment.designation"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Enter designation"
                  @input="validateAttachmentDesignation"
                  @keypress="allowOnlyLetters"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">District *</label>
                <select v-model="attachment.district" required class="form-select" @change="onAttachmentDistrictChange(attachment)">
                  <option value="">Select district</option>
                  <option v-for="district in districts" :key="district.id" :value="district.name">
                    {{ district.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="form-label">RD Block *</label>
                <select v-model="attachment.rd_block" required class="form-select" :disabled="!attachment.district" @change="onAttachmentRdBlockChange(attachment)">
                  <option value="">Select RD Block</option>
                  <option v-for="rdBlock in attachmentRdBlocks[index] || []" :key="rdBlock.id" :value="rdBlock.name">
                    {{ rdBlock.name }}
                  </option>
                </select>
                <div v-if="!attachment.district" class="text-xs text-gray-500 mt-1">Please select a district first</div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">Habitation</label>
                <select v-model="attachment.habitation" class="form-select" :disabled="!attachment.rd_block">
                  <option value="">Select Habitation</option>
                  <option v-for="village in attachmentVillages[index] || []" :key="village.id" :value="village.name">
                    {{ village.name }}
                  </option>
                </select>
                <div v-if="!attachment.rd_block" class="text-xs text-gray-500 mt-1">Please select an RD block first</div>
              </div>
              <div>
                <label class="form-label">Joining Date *</label>
                <input
                  v-model="attachment.joining_date"
                  type="date"
                  required
                  class="form-input"
                  placeholder="dd - mm - yyyy"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="form-label">End Date</label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="attachment.end_date"
                    type="date"
                    class="form-input flex-1"
                    placeholder="dd - mm - yyyy"
                    @change="onAttachmentEndDateChange(attachment)"
                  />
                  <span v-if="!attachment.end_date" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    Current
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if still ongoing</p>
              </div>
              <div>
                <label class="form-label">Status *</label>
                <div class="flex items-center space-x-2">
                  <select v-model="attachment.status" required class="form-select flex-1">
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <span v-if="attachment.status" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                        :class="attachment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                    {{ attachment.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add New Attachment Button -->
          <div class="text-center">
            <button 
              type="button" 
              @click="addNewAttachment"
              class="btn-secondary"
            >
              + Add Attachment
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">School Information (Auto-filled)</h3>
          <p class="text-sm text-gray-600 mt-1">All fields below will be automatically populated when you select a school above</p>
        </div>
        <div class="card-body space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Current School Name</label>
              <input
                v-model="form.current_school_name"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
            <div>
              <label class="form-label">School Level</label>
              <input
                :value="form.school_level"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Management</label>
              <input
                v-model="form.management"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
              
            </div>
            <div>
              <label class="form-label">Medium</label>
              <input
                v-model="form.medium"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Block Office</label>
              <input
                v-model="form.block_office"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
            <div>
              <label class="form-label">District</label>
              <input
                v-model="form.district"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Pincode</label>
              <input
                v-model="form.pincode"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
            <div>
              <label class="form-label">RD Block</label>
              <input
                v-model="form.rd_block"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">School Phone</label>
              <input
                v-model="form.school_phone"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
            <div>
              <label class="form-label">Habitation</label>
              <input
                v-model="form.habitation"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="form-label">Habitation Class</label>
              <input
                v-model="form.habitation_class"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
            <div>
              <label class="form-label">Habitation Category</label>
              <input
                v-model="form.habitation_category"
                type="text"
                readonly
                class="form-input bg-gray-50"
                placeholder="Will be auto-filled from selected school"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
        <router-link to="/teachers" class="btn-secondary w-full sm:w-auto text-center">
          Cancel
        </router-link>
        <button
          type="submit"
          :disabled="loading || !selectedSchoolId"
          class="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="inline-flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditing ? 'Update Teacher' : 'Create Teacher' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { teachersApi, schoolsApi, subjectsApi, locationsApi } from '../services/api'
import { useMasterDataStore } from '../stores/masterData'
import { useLocationsStore } from '../stores/locations'
import type { Teacher, School, District, Medium, ManagementType, BlockOffice, Subject, SchoolType } from '../types'
import { CLASSES, SOCIAL_GROUPS, GENDERS } from '../constants'
import { religionsApi } from '../services/api'

const route = useRoute()
const router = useRouter()
const masterDataStore = useMasterDataStore()
const locationsStore = useLocationsStore()

const loading = ref(false)
const isEditing = computed(() => !!route.params.id)
const schools = ref<School[]>([])
const selectedSchoolId = ref('')
const availableSubjects = ref<Subject[]>([])
const serviceCategories = ref<{ id: number, name: string }[]>([])
const religions = ref<string[]>([])

// Create a local interface that extends Teacher for form handling
interface TeacherFormData extends Omit<Teacher, 'subjects_taught' | 'classes_taught'> {
  subjects_taught: string[] // Use array for form checkboxes
  classes_taught: string[] // Use array for form checkboxes
}

const form = ref<TeacherFormData>({
  teacher_name: '',
  teacher_ID: '',
  date_of_birth: '',
  joining_date: '', // Empty initially to show placeholder
  phone_number: '',
  email: '', // Empty initially
  social_group: '', // Empty initially, no pre-selection
  religion: '', // Empty initially, no pre-selection
  gender: '', // Empty initially, no pre-selection
  aadhaar_number: '',
  
  subjects_taught: [],
  classes_taught: [],
  school_id: '',
  current_school_name: '',
  school_level: '',
  management: '', // Empty initially to show placeholder
  medium: '', // Empty initially to show placeholder
  service_category: '',
  habitation: '',
  pincode: '',
  district: '', // Empty initially to show placeholder
  rd_block: '',
  school_phone: '',
  habitation_class: undefined, // Empty initially to show placeholder
  habitation_category: undefined, // Empty initially to show placeholder
  block_office: '', // Empty initially to show placeholder
  posting_histories: [], // Empty array initially
  deputations: [], // Empty array initially
  attachments: [] // Empty array initially
})

// Validate teacher name to ensure it only contains letters and spaces
const validateTeacherName = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  form.value.teacher_name = letterOnlyValue
}

// Prevent non-letter characters from being typed
const allowOnlyLetters = (event: KeyboardEvent) => {
  const key = event.key
  const allowedKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', 'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  
  if (!allowedKeys.includes(key)) {
    event.preventDefault()
  }
}

// Validate area/village to ensure it only contains letters and spaces
const validateAreaVillage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  
}

// Validate department name to ensure it only contains letters and spaces
const validateDepartmentName = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  form.value.deputations[0].department_name = letterOnlyValue
}

// Validate designation to ensure it only contains letters and spaces
const validateDesignation = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  form.value.deputations[0].designation = letterOnlyValue
}

// Validate attachment department name to ensure it only contains letters and spaces
const validateAttachmentDepartmentName = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  form.value.attachments[0].department_name = letterOnlyValue
}

// Validate attachment designation to ensure it only contains letters and spaces
const validateAttachmentDesignation = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-letter characters except spaces
  const letterOnlyValue = value.replace(/[^a-zA-Z\s]/g, '')
  
  // Update the form value with only letters and spaces
  form.value.attachments[0].designation = letterOnlyValue
}

// Validate phone number to ensure it only contains numbers and is exactly 10 digits
const validatePhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Limit to exactly 10 digits
  const limitedValue = numericValue.slice(0, 10)
  
  // Update the form value with only numbers (max 10 digits)
  form.value.phone_number = limitedValue
  
  // Update the input field value to show the limited result
  target.value = limitedValue
}

// Validate Aadhaar number to ensure it only contains numbers
const validateAadhaarNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Update the form value with only numbers
  form.value.aadhaar_number = numericValue
}

const validateTeacherID = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any characters that are not alphanumeric, hyphens, or underscores
  const validValue = value.replace(/[^a-zA-Z0-9_-]/g, '')
  
  // Limit to 50 characters
  const limitedValue = validValue.slice(0, 50)
  
  // Update the form value
  form.value.teacher_ID = limitedValue
}

// Prevent non-numeric characters from being typed
const allowOnlyNumbers = (event: KeyboardEvent) => {
  const key = event.key
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  
  if (!allowedKeys.includes(key)) {
    event.preventDefault()
  }
}

// Validate posting pincode to ensure it only contains numbers
const validatePostingPincode = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Remove any non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // Update the form value with only numbers
  // Find the posting index and update the correct pincode
  const postingIndex = Array.from(target.closest('.border')?.parentElement?.children || []).findIndex(child => 
    child.contains(target)
  )
      if (postingIndex >= 0 && form.value.posting_histories[postingIndex]) {
      form.value.posting_histories[postingIndex].pincode = numericValue
    }
}

const districts = ref<District[]>([])
const mediums = ref<Medium[]>([])
const managementTypes = ref<ManagementType[]>([])
const blockOffices = ref<BlockOffice[]>([])
const schoolTypes = ref<SchoolType[]>([])
const attachmentRdBlocks = ref<{id: number, name: string}[][]>([])
const attachmentVillages = ref<{id: number, name: string}[][]>([])
const postingRdBlocks = ref<{id: number, name: string}[][]>([])
const postingVillages = ref<{id: number, name: string}[][]>([])

const loadSchools = async () => {
  try {
    const response = await schoolsApi.getAll(1, 1000) // Load all schools
    if (response.data.success) {
      // Schools are now pre-transformed by the backend
      schools.value = response.data.data || []
    }
  } catch (error) {
    console.error('Failed to load schools:', error)
  }
}

const loadDistricts = async () => {
  try {
    districts.value = await locationsStore.getDistricts()
  } catch (error) {
    console.error('Failed to load districts:', error)
  }
}

const loadMediums = async () => {
  try {
    mediums.value = await masterDataStore.getMediums()
  } catch (error) {
    console.error('Failed to load mediums:', error)
  }
}

const loadManagementTypes = async () => {
  try {
    managementTypes.value = await masterDataStore.getManagementTypes()
  } catch (error) {
    console.error('Failed to load management types:', error)
  }
}

const loadBlockOffices = async () => {
  try {
    blockOffices.value = await masterDataStore.getBlockOffices()
  } catch (error) {
    console.error('Failed to load block offices:', error)
  }
}

const loadReligions = async () => {
  try {
    religions.value = await masterDataStore.getReligions()
  } catch (error) {
    console.error('Failed to load religions:', error)
  }
}

const loadServiceCategories = async () => {
  try {
    serviceCategories.value = await masterDataStore.getServiceCategories()
  } catch (error) {
    console.error('Failed to load service categories:', error)
  }
}

const loadSchoolTypes = async () => {
  try {
    schoolTypes.value = await masterDataStore.getSchoolTypes()
  } catch (error) {
    console.error('Failed to load school types:', error)
  }
}

const onSchoolChange = async () => {
  const selectedSchool = schools.value.find(s => s.school_id === selectedSchoolId.value)
  if (selectedSchool) {
    
    // Auto-fill ALL school-related fields
    form.value.school_id = selectedSchool.school_id
    form.value.current_school_name = selectedSchool.school_name
    form.value.school_level = selectedSchool.school_level
    
    // Set management type, but ensure it's an active one
    if (selectedSchool.management && managementTypes.value.some(m => m.name === selectedSchool.management)) {
      form.value.management = selectedSchool.management
    } else if (managementTypes.value.length > 0) {
      form.value.management = managementTypes.value[0].name
    } else {
      form.value.management = ''
    }
    form.value.medium = selectedSchool.medium || 'English'
    form.value.district = selectedSchool.district || 'Aizawl'
    form.value.block_office = selectedSchool.block_office || ''
    form.value.habitation = selectedSchool.habitation || ''
    form.value.pincode = selectedSchool.pincode || ''
    form.value.rd_block = selectedSchool.rd_block || ''
    form.value.school_phone = selectedSchool.school_phone || ''
    form.value.habitation_class = selectedSchool.habitation_class || 'Rural'
    form.value.habitation_category = selectedSchool.habitation_category || 'Village'

    // Fetch actual names for RD Block and Habitation if they exist
    if (selectedSchool.rd_block) {
      try {
        // First get the district ID from the district name
        const districtResponse = await locationsApi.getDistricts()
        if (districtResponse.data.success && districtResponse.data.data) {
          const district = districtResponse.data.data.find((d: any) => d.name === selectedSchool.district)
          if (district) {
            // Now get RD Blocks for this district
            const rdBlockResponse = await locationsApi.getRdBlocks(district.id)
            if (rdBlockResponse.data.success && rdBlockResponse.data.data) {
              const rdBlock = rdBlockResponse.data.data.find((rb: any) => rb.id.toString() === selectedSchool.rd_block)
              if (rdBlock) {
                form.value.rd_block = rdBlock.name
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch RD Block name:', error)
      }
    }

    if (selectedSchool.habitation && selectedSchool.rd_block) {
      try {
        // Get villages for the RD Block
        const habitationResponse = await locationsApi.getVillages(parseInt(selectedSchool.rd_block))
        if (habitationResponse.data.success && habitationResponse.data.data) {
          const habitation = habitationResponse.data.data.find((h: any) => h.id.toString() === selectedSchool.habitation)
          if (habitation) {
            form.value.habitation = habitation.name
          }
        }
      } catch (error) {
        console.error('Failed to fetch Habitation name:', error)
      }
    }
  }
}

const loadTeacher = async (teacherId: number) => {
  try {
    // Ensure dropdowns are loaded first
    await Promise.all([
      loadManagementTypes(),
      loadBlockOffices(),
      loadMediums(),
      loadReligions(),
      loadSchoolTypes()
    ])
    
    const response = await teachersApi.getById(teacherId)
    if (response.data.success && response.data.data) {
      const teacherData = { ...response.data.data }
      
      // Fix date format for date input field
      if (teacherData.date_of_birth) {
        try {
          // Convert ISO date string to yyyy-MM-dd format for HTML date input
          const date = new Date(teacherData.date_of_birth)
          if (!isNaN(date.getTime())) {
            teacherData.date_of_birth = date.toISOString().split('T')[0]
          } else {
            console.warn('Invalid date format received:', teacherData.date_of_birth)
            teacherData.date_of_birth = ''
          }
        } catch (error) {
          console.error('Error formatting date:', error)
          teacherData.date_of_birth = ''
        }
      }

      // Fix date format for joining_date input field
      if (teacherData.joining_date) {
        try {
          // Convert ISO date string to yyyy-MM-dd format for HTML date input
          const date = new Date(teacherData.joining_date)
          if (!isNaN(date.getTime())) {
            teacherData.joining_date = date.toISOString().split('T')[0]
          } else {
            console.warn('Invalid joining date format received:', teacherData.joining_date)
            teacherData.joining_date = ''
          }
        } catch (error) {
          console.error('Error formatting joining date:', error)
          teacherData.joining_date = ''
        }
      }
      
      // Format dates for posting history
          if (teacherData.posting_histories && teacherData.posting_histories.length > 0) {
      console.log('Processing posting histories:', teacherData.posting_histories)
      teacherData.posting_histories.forEach((posting, index) => {
        console.log(`Posting ${index + 1} - management:`, posting.management)
        console.log(`Posting ${index + 1} - block_office:`, posting.block_office)
          if (posting.from_date) {
            try {
              const date = new Date(posting.from_date)
              if (!isNaN(date.getTime())) {
                posting.from_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting posting from_date:', error)
              posting.from_date = ''
            }
          }
          if (posting.to_date) {
            try {
              const date = new Date(posting.to_date)
              if (!isNaN(date.getTime())) {
                posting.to_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting posting to_date:', error)
              posting.to_date = ''
            }
          }
          
          // Fix school type format (replace underscores with hyphens)
          if (posting.school_type) {
            posting.school_type = posting.school_type.replace(/_/g, '-')
          }
          
          // Fix management format (replace underscores with spaces)
          if (posting.management) {
            posting.management = posting.management.replace(/_/g, ' ')
          }
          
          // Fix block office format (replace underscores with spaces)
          if (posting.block_office) {
            posting.block_office = posting.block_office.replace(/_/g, ' ')
          }
        })
      }
      
      // Format dates for deputation
      if (teacherData.deputations && teacherData.deputations.length > 0) {
        teacherData.deputations.forEach(deputation => {
          if (deputation.joining_date) {
            try {
              const date = new Date(deputation.joining_date)
              if (!isNaN(date.getTime())) {
                deputation.joining_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting deputation joining_date:', error)
              deputation.joining_date = ''
            }
          }
          if (deputation.end_date) {
            try {
              const date = new Date(deputation.end_date)
              if (!isNaN(date.getTime())) {
                deputation.end_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting deputation end_date:', error)
              deputation.end_date = ''
            }
          }
        })
      }
      
      // Format dates for attachment
      if (teacherData.attachments && teacherData.attachments.length > 0) {
        teacherData.attachments.forEach(attachment => {
          if (attachment.joining_date) {
            try {
              const date = new Date(attachment.joining_date)
              if (!isNaN(date.getTime())) {
                attachment.joining_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting attachment joining_date:', error)
              attachment.joining_date = ''
            }
          }
          if (attachment.end_date) {
            try {
              const date = new Date(attachment.end_date)
              if (!isNaN(date.getTime())) {
                attachment.end_date = date.toISOString().split('T')[0]
              }
            } catch (error) {
              console.error('Error formatting attachment end_date:', error)
              attachment.end_date = ''
            }
          }
        })
      }
      
      // Use nextTick to ensure DOM is ready before setting form values
      await nextTick()
      
      // Parse JSON strings to arrays for subjects_taught and classes_taught
      const parsedTeacherData = {
        ...teacherData,
        subjects_taught: (() => {
          try {
            if (typeof teacherData.subjects_taught === 'string' && teacherData.subjects_taught) {
              // Try to parse as JSON first
              if (teacherData.subjects_taught.startsWith('[') && teacherData.subjects_taught.endsWith(']')) {
                return JSON.parse(teacherData.subjects_taught)
              }
              // If not JSON, split by comma and trim
              return teacherData.subjects_taught.split(',').map(s => s.trim()).filter(s => s.length > 0)
            }
            return []
          } catch (error) {
            console.error('Error parsing subjects_taught:', error)
            // Fallback: split by comma
            return teacherData.subjects_taught.split(',').map(s => s.trim()).filter(s => s.length > 0)
          }
        })(),
        classes_taught: (() => {
          try {
            if (typeof teacherData.classes_taught === 'string' && teacherData.classes_taught) {
              // Try to parse as JSON first
              if (teacherData.classes_taught.startsWith('[') && teacherData.classes_taught.endsWith(']')) {
                return JSON.parse(teacherData.classes_taught)
              }
              // If not JSON, split by comma and trim
              return teacherData.classes_taught.split(',').map(s => s.trim()).filter(s => s.length > 0)
            }
            return []
          } catch (error) {
            console.error('Error parsing classes_taught:', error)
            // Fallback: split by comma
            return teacherData.classes_taught.split(',').map(s => s.trim()).filter(s => s.length > 0)
          }
        })()
      }
      
      // Ensure the arrays are preserved when setting form data
      const formDataWithArrays = {
        ...parsedTeacherData,
        posting_histories: parsedTeacherData.posting_histories || [],
        deputations: parsedTeacherData.deputations || [],
        attachments: parsedTeacherData.attachments || []
      }
      
      console.log('Loading teacher - deputations from API:', parsedTeacherData.deputations)
      console.log('Loading teacher - posting histories from API:', parsedTeacherData.posting_histories)
      console.log('Loading teacher - attachments from API:', parsedTeacherData.attachments)
      console.log('Loading teacher - full teacher data:', teacherData)
      console.log('Loading teacher - management value:', teacherData.management)
      console.log('Loading teacher - block_office value:', teacherData.block_office)
      console.log('Available management types:', managementTypes.value)
      console.log('Available block offices:', blockOffices.value)
      form.value = formDataWithArrays
      console.log('Form loaded - deputations:', form.value.deputations)
      console.log('Form loaded - posting histories:', form.value.posting_histories)
      console.log('Form loaded - attachments:', form.value.attachments)
      console.log('Form loaded - management:', form.value.management)
      console.log('Form loaded - block_office:', form.value.block_office)
      console.log('Form loaded - posting histories after processing:', form.value.posting_histories)
      console.log('Form loaded - full form data:', form.value)
      selectedSchoolId.value = teacherData.school_id
      console.log('Selected school ID set to:', selectedSchoolId.value)

      
      // Initialize posting_histories if not present
      if (!form.value.posting_histories) {
        form.value.posting_histories = []
      }
      
      // Ensure all posting history records have a status field and load RD blocks/villages
      if (form.value.posting_histories && form.value.posting_histories.length > 0) {
        form.value.posting_histories.forEach(async (posting, index) => {
          if (!posting.status) {
            // If no status, set based on to_date
            posting.status = posting.to_date ? 'Completed' : 'Active'
          }
          
          // Load RD blocks and villages for existing posting history items
          if (posting.district) {
            // Initialize arrays for this posting index
            if (!postingRdBlocks.value[index]) {
              postingRdBlocks.value[index] = []
            }
            if (!postingVillages.value[index]) {
              postingVillages.value[index] = []
            }
            
            // Load RD blocks for this district
            try {
              const districtId = await getDistrictId(posting.district)
              const response = await locationsApi.getRdBlocks(districtId)
              if (response.data.success) {
                postingRdBlocks.value[index] = response.data.data || []
                
                // If RD block is set, also load villages
                if (posting.rd_block) {
                  const rdBlock = postingRdBlocks.value[index]?.find(rb => rb.name === posting.rd_block)
                  if (rdBlock) {
                    const villageResponse = await locationsApi.getVillages(rdBlock.id)
                    if (villageResponse.data.success) {
                      postingVillages.value[index] = villageResponse.data.data || []
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Failed to load RD blocks for posting history:', error)
            }
          }
        })
      }
      
      // Initialize deputations if not present
      if (!form.value.deputations) {
        form.value.deputations = []
      }
      
      // Ensure all deputation records have a status field
      if (form.value.deputations && form.value.deputations.length > 0) {
        form.value.deputations.forEach(deputation => {
          if (!deputation.status) {
            // If no status, set based on end_date
            deputation.status = deputation.end_date ? 'Completed' : 'Active'
          }
        })
      }

      // Initialize attachments if not present
      if (!form.value.attachments) {
        form.value.attachments = []
      }
      
      // Ensure all attachment records have a status field and load RD blocks/villages
      if (form.value.attachments && form.value.attachments.length > 0) {
        form.value.attachments.forEach(async (attachment, index) => {
          if (!attachment.status) {
            // If no status, set based on end_date
            attachment.status = attachment.end_date ? 'Completed' : 'Active'
          }
          
          // Load RD blocks and villages for existing attachment items
          if (attachment.district) {
            // Initialize arrays for this attachment index
            if (!attachmentRdBlocks.value[index]) {
              attachmentRdBlocks.value[index] = []
            }
            if (!attachmentVillages.value[index]) {
              attachmentVillages.value[index] = []
            }
            
            // Load RD blocks for this district
            try {
              const districtId = await getDistrictId(attachment.district)
              const response = await locationsApi.getRdBlocks(districtId)
              if (response.data.success) {
                attachmentRdBlocks.value[index] = response.data.data || []
                
                // If RD block is set, also load villages
                if (attachment.rd_block) {
                  const rdBlock = attachmentRdBlocks.value[index]?.find(rb => rb.name === attachment.rd_block)
                  if (rdBlock) {
                    const villageResponse = await locationsApi.getVillages(rdBlock.id)
                    if (villageResponse.data.success) {
                      attachmentVillages.value[index] = villageResponse.data.data || []
                    }
                  }
                }
              }
            } catch (error) {
              console.error('Failed to load RD blocks for attachment:', error)
            }
          }
        })
      }
      
      // Ensure all fields have valid values with proper defaults
      if (!teacherData.district || !districts.value.some(d => d.name === teacherData.district)) {
        form.value.district = 'Aizawl'
      }
      
      // Handle block_office - it might be an object or a string
      let blockOfficeValue: any = teacherData.block_office
      if (typeof blockOfficeValue === 'object' && blockOfficeValue !== null && blockOfficeValue.name) {
        blockOfficeValue = blockOfficeValue.name
      }
      // Always preserve the original value, don't override with defaults
      if (blockOfficeValue) {
        form.value.block_office = blockOfficeValue
      }
      
      if (!teacherData.medium || !mediums.value.some(m => m.name === teacherData.medium)) {
        form.value.medium = 'English'
      }
      // Always preserve the original management value, don't override with defaults
      if (teacherData.management) {
        form.value.management = teacherData.management
      }
      
      if (!teacherData.habitation_class || !['Rural', 'Urban'].includes(teacherData.habitation_class)) {
        form.value.habitation_class = 'Rural'
      }
      if (!teacherData.habitation_category || !['City', 'Town', 'Village'].includes(teacherData.habitation_category)) {
        form.value.habitation_category = 'Village'
      }
    }
  } catch (error) {
    console.error('Failed to load teacher:', error)
  }
  
  // Debug: Log final form state after loading
  await nextTick()
  console.log('=== TEACHER LOADING COMPLETED ===')
  console.log('Final form state:', form.value)
  console.log('Final selectedSchoolId:', selectedSchoolId.value)
  console.log('Final posting histories count:', form.value.posting_histories?.length || 0)
  console.log('Final deputations count:', form.value.deputations?.length || 0)
  console.log('Final attachments count:', form.value.attachments?.length || 0)
}

const handleSubmit = async () => {
  if (form.value.subjects_taught.length === 0) {
    alert('Please select at least one subject')
    return
  }

  if (form.value.classes_taught.length === 0) {
    alert('Please select at least one class')
    return
  }

  if (!selectedSchoolId.value) {
    alert('Please select a school')
    return
  }

  if (!form.value.social_group) {
    alert('Please select a social group')
    return
  }

  if (!form.value.religion) {
    alert('Please select a religion')
    return
  }

  if (!form.value.gender) {
    alert('Please select a gender')
    return
  }

  if (!form.value.phone_number) {
    alert('Phone number is required')
    return
  }

  // Aadhaar number is optional, no validation needed

  if (!form.value.teacher_ID || form.value.teacher_ID.trim() === '') {
    alert('Teacher ID is required')
    return
  }

  // Validate teacher_ID format (alphanumeric, max 50 characters)
  if (!/^[a-zA-Z0-9_-]{1,50}$/.test(form.value.teacher_ID.trim())) {
    alert('Teacher ID must contain only letters, numbers, hyphens, and underscores (max 50 characters)')
    return
  }



  // Validate phone number format (10 digits)
  if (!/^[0-9]{10}$/.test(form.value.phone_number)) {
    alert('Phone number must be exactly 10 digits')
    return
  }

  // Validate Aadhaar number format (12 digits) only if provided
  if (form.value.aadhaar_number && !/^[0-9]{12}$/.test(form.value.aadhaar_number)) {
    alert('Aadhaar number must be exactly 12 digits')
    return
  }

  // Ensure all required fields have values
  const requiredFields = {
    'Teacher Name': form.value.teacher_name,
    'Date of Birth': form.value.date_of_birth,
    'Joining Date': form.value.joining_date,
    'Phone Number': form.value.phone_number,
    'Social Group': form.value.social_group,
    'Religion': form.value.religion,
    'Gender': form.value.gender,
    // Aadhaar Number is optional, not included in required fields

    'Subjects Taught': form.value.subjects_taught,
    'Classes Taught': form.value.classes_taught,
    'School': selectedSchoolId.value
  }

  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => !value || (Array.isArray(value) && value.length === 0))
    .map(([key]) => key)

  if (missingFields.length > 0) {
    alert(`Please fill in the following required fields:\n${missingFields.join('\n')}`)
    return
  }

  // Clean up form data before sending (remove undefined/null values)
  const cleanFormData = { ...form.value }
  console.log('Before filtering - deputations:', cleanFormData.deputations)
  
  // Convert arrays back to JSON strings for API compatibility
  const subjectsString = JSON.stringify(cleanFormData.subjects_taught)
  const classesString = JSON.stringify(cleanFormData.classes_taught)
  
  // Remove undefined/null values from nested arrays
  if (cleanFormData.posting_histories) {
    cleanFormData.posting_histories = cleanFormData.posting_histories.filter(posting => 
      posting.school_name && posting.from_date
    ).map(posting => ({
      ...posting,
      status: posting.status || (posting.to_date ? 'Completed' : 'Active')
    }))
  }
  
  if (cleanFormData.deputations) {
    console.log('Filtering deputations:', cleanFormData.deputations)
    // Only filter out completely empty deputations (keep all non-empty ones)
    cleanFormData.deputations = cleanFormData.deputations.filter(deputation => {
      // Keep deputation if it has any meaningful data
      const hasData = deputation.department_name || deputation.designation || deputation.joining_date || deputation.end_date
      console.log('Deputation has data:', hasData, deputation)
      return hasData
    }).map(deputation => ({
      ...deputation,
      status: deputation.status || (deputation.end_date ? 'Completed' : 'Active')
    }))
    console.log('After filtering - deputations:', cleanFormData.deputations)
  }
  
  if (cleanFormData.attachments) {
    cleanFormData.attachments = cleanFormData.attachments.filter(attachment => 
      attachment.department_name && attachment.designation && attachment.district && 
      attachment.joining_date
    ).map(attachment => ({
      ...attachment,
      status: attachment.status || (attachment.end_date ? 'Completed' : 'Active')
    }))
  }
  
  // Create API payload that matches Teacher interface AFTER cleaning the arrays
  const apiPayload: Teacher = {
    ...cleanFormData,
    subjects_taught: subjectsString,
    classes_taught: classesString
  }

  loading.value = true
  try {
    // Debug: Log what we're sending to the API
    console.log('API Payload - deputations being sent:', apiPayload.deputations)
    console.log('API Payload - full payload:', apiPayload)
    
    let response
    if (isEditing.value) {
      response = await teachersApi.update(parseInt(route.params.id as string), apiPayload)
    } else {
      response = await teachersApi.create(apiPayload)
    }

    if (response.data.success) {
      router.push('/teachers')
    } else {
      alert(response.data.message || 'Operation failed')
    }
  } catch (error: any) {
    console.error('Form submission failed:', error)
    if (error.response && error.response.data) {
      // Backend returned an error response
      const backendError = error.response.data
      
      if (backendError.message) {
        alert(`Update failed: ${backendError.message}`)
      } else if (backendError.error) {
        alert(`Update failed: ${backendError.error}`)
      } else {
        alert('Update failed: Unknown error occurred')
      }
    } else if (error.message) {
      // Network or other error
      alert(`Update failed: ${error.message}`)
    } else {
      alert('Update failed: Unknown error occurred')
    }
  } finally {
    loading.value = false
  }
}

const addNewPosting = () => {
  console.log('Before adding posting - deputations:', form.value.deputations)
  const newIndex = form.value.posting_histories.length
  form.value.posting_histories.push({
    school_name: '',
    school_type: schoolTypes.value.length > 0 ? schoolTypes.value[0].name : '',
    medium: '',
    management: '',
    block_office: '',
    district: '',
    rd_block: '',
    pincode: '',
    habitation: '',
    habitation_class: undefined,
    habitation_category: undefined,
    from_date: '',
    to_date: '',
    status: 'Active' as 'Active' | 'Completed'
  })
  
  // Initialize arrays for the new posting
  postingRdBlocks.value[newIndex] = []
  postingVillages.value[newIndex] = []
  console.log('After adding posting - deputations:', form.value.deputations)
}

const removePosting = (index: number) => {
  form.value.posting_histories.splice(index, 1)
  
  // Remove arrays for the deleted posting
  postingRdBlocks.value.splice(index, 1)
  postingVillages.value.splice(index, 1)
}

const onPostingSchoolChange = async (posting: any) => {
  // Ensure districts are loaded so the dropdown has options
  if (!districts.value || districts.value.length === 0) {
    await loadDistricts()
  }
  const selectedSchool = schools.value.find(s => s.school_name === posting.school_name)
  
  if (selectedSchool) {
    console.log('Selected school:', selectedSchool)
    
    // Auto-fill school details
    posting.school_type = selectedSchool.school_type ? selectedSchool.school_type.replace(/_/g, '-') : ''
    posting.medium = selectedSchool.medium
    // Ensure the management type is active
    if (selectedSchool.management && managementTypes.value.some(m => m.name === selectedSchool.management)) {
      posting.management = selectedSchool.management
    } else if (managementTypes.value.length > 0) {
      posting.management = managementTypes.value[0].name
    } else {
      posting.management = ''
    }
    posting.block_office = selectedSchool.block_office
    posting.district = selectedSchool.district || ''
    posting.rd_block = selectedSchool.rd_block || ''
    posting.habitation = selectedSchool.habitation || ''
    posting.pincode = selectedSchool.pincode || ''
    posting.habitation_class = selectedSchool.habitation_class || undefined
    posting.habitation_category = selectedSchool.habitation_category || undefined
    

    
          // If district is set, load RD blocks and villages
      if (posting.district) {
        console.log('Loading location data for district:', posting.district)
        // Find the posting index to load RD blocks
        const postingIndex = form.value.posting_histories.findIndex(p => p === posting)
        console.log('Posting index:', postingIndex)
        if (postingIndex !== -1) {
          await onPostingDistrictChange(posting, postingIndex)
        }
      }
  }
}

const onPostingEndDateChange = (posting: any) => {
  if (posting.to_date) {
    posting.status = 'Completed'
  } else {
    posting.status = 'Active'
  }
}

const addNewDeputation = () => {
  console.log('Before adding deputation - existing deputations:', form.value.deputations)
  form.value.deputations.push({
    department_name: '',
    designation: '',
    joining_date: '',
    end_date: '',
    status: 'Active' as 'Active' | 'Completed'
  })
  console.log('After adding deputation - all deputations:', form.value.deputations)
}

const removeDeputation = (index: number) => {
  form.value.deputations.splice(index, 1)
}

const onDeputationEndDateChange = (deputation: any) => {
  if (deputation.end_date) {
    deputation.status = 'Completed'
  } else {
    deputation.status = 'Active'
  }
}

const addNewAttachment = () => {
  console.log('Before adding attachment - deputations:', form.value.deputations)
  const newIndex = form.value.attachments.length
  form.value.attachments.push({
    department_name: '',
    designation: '',
    district: '',
    rd_block: '',
    habitation: '',
    joining_date: '',
    end_date: '',
    status: 'Active' as 'Active' | 'Completed'
  })
  
  // Initialize arrays for the new attachment
  attachmentRdBlocks.value[newIndex] = []
  attachmentVillages.value[newIndex] = []
  console.log('After adding attachment - deputations:', form.value.deputations)
}

const removeAttachment = (index: number) => {
  form.value.attachments.splice(index, 1)
  
  // Remove arrays for the deleted attachment
  attachmentRdBlocks.value.splice(index, 1)
  attachmentVillages.value.splice(index, 1)
}

const onAttachmentEndDateChange = (attachment: any) => {
  if (attachment.end_date) {
    attachment.status = 'Completed'
  } else {
    attachment.status = 'Active'
  }
}

const onAttachmentDistrictChange = async (attachment: any) => {
  // Find the attachment index
  const attachmentIndex = form.value.attachments.findIndex(a => a === attachment)
  if (attachmentIndex === -1) return
  
  // Reset RD block and village selections
  attachment.rd_block = ''
  attachment.habitation = ''
  
  // Initialize arrays if they don't exist
  if (!attachmentRdBlocks.value[attachmentIndex]) {
    attachmentRdBlocks.value[attachmentIndex] = []
  }
  if (!attachmentVillages.value[attachmentIndex]) {
    attachmentVillages.value[attachmentIndex] = []
  }
  
  // Clear existing data
  attachmentRdBlocks.value[attachmentIndex] = []
  attachmentVillages.value[attachmentIndex] = []
  
  // Load RD blocks for selected district
  if (attachment.district) {
    try {
      const districtId = await getDistrictId(attachment.district)
      const response = await locationsApi.getRdBlocks(districtId)
      if (response.data.success) {
        attachmentRdBlocks.value[attachmentIndex] = response.data.data || []
      }
    } catch (error) {
      console.error('Failed to load RD blocks:', error)
    }
  }
}

const getDistrictId = async (districtName: string): Promise<number> => {
  try {
    // First try to find in the loaded districts
    const district = districts.value.find(d => d.name === districtName)
    if (district && district.id) {
      return district.id
    }
    
    // If not found, fetch from locations API
    const response = await locationsApi.getDistricts()
    if (response.data.success && response.data.data) {
      const locationDistrict = response.data.data.find((d: any) => d.name === districtName)
      if (locationDistrict) {
        return locationDistrict.id
      }
    }
    
    // Default fallback
    return 1
  } catch (error) {
    console.error('Failed to get district ID:', error)
    return 1
  }
}

// Watch for changes in classes_taught to filter subjects
watch(() => form.value.classes_taught, async (newClasses) => {
  if (newClasses && newClasses.length > 0) {
    try {
      const response = await subjectsApi.getAll()
      if (response.data.success) {
        const allSubjects = response.data.data || []
        // Filter subjects that have any of the selected classes
        // Now classes is a string like "Class 1, Class 2, Class 3"
        availableSubjects.value = allSubjects.filter(subject => {
          if (!subject.classes) return false
          // Split the comma-separated string and check if any class matches
          const subjectClasses = subject.classes.split(',').map(cls => cls.trim())
          return subjectClasses.some(cls => newClasses.includes(cls))
        })
        // Clear subjects that are no longer available
        form.value.subjects_taught = form.value.subjects_taught.filter(subject => 
          availableSubjects.value.some(available => available.name === subject)
        )
      }
    } catch (error) {
      console.error('Failed to load subjects for selected classes:', error)
    }
  } else {
    // If no classes selected, show all subjects
    availableSubjects.value = []
    form.value.subjects_taught = []
  }
}, { immediate: true })



const onAttachmentRdBlockChange = async (attachment: any) => {
  // Find the attachment index
  const attachmentIndex = form.value.attachments.findIndex(a => a === attachment)
  if (attachmentIndex === -1) return
  
  // Reset village selection
  attachment.habitation = ''
  
  // Initialize villages array if it doesn't exist
  if (!attachmentVillages.value[attachmentIndex]) {
    attachmentVillages.value[attachmentIndex] = []
  }
  
  // Clear existing villages
  attachmentVillages.value[attachmentIndex] = []
  
  // Load villages for selected RD block
  if (attachment.rd_block) {
    try {
      const rdBlock = attachmentRdBlocks.value[attachmentIndex]?.find(rb => rb.name === attachment.rd_block)
      if (rdBlock) {
        const response = await locationsApi.getVillages(rdBlock.id)
        if (response.data.success) {
          attachmentVillages.value[attachmentIndex] = response.data.data || []
        }
      }
    } catch (error) {
      console.error('Failed to load villages:', error)
    }
  }
}

const onPostingDistrictChange = async (posting: any, index: number) => {
  console.log('onPostingDistrictChange called for index:', index, 'district:', posting.district)
  // Store the current values to preserve them
  const currentRdBlock = posting.rd_block
  const currentHabitation = posting.habitation
  console.log('Current RD block:', currentRdBlock, 'Current habitation:', currentHabitation)
  
  // Initialize arrays if they don't exist
  if (!postingRdBlocks.value[index]) {
    postingRdBlocks.value[index] = []
  }
  if (!postingVillages.value[index]) {
    postingVillages.value[index] = []
  }
  
  // Clear existing data
  postingRdBlocks.value[index] = []
  postingVillages.value[index] = []
  
      // Load RD blocks for selected district
    if (posting.district) {
      try {
        const districtId = await getDistrictId(posting.district)
        
        const response = await locationsApi.getRdBlocks(districtId)
        if (response.data.success) {
          postingRdBlocks.value[index] = response.data.data || []
          console.log('Loaded RD blocks:', postingRdBlocks.value[index])
          
          // Restore the rd_block value if it exists in the loaded options
          if (currentRdBlock && postingRdBlocks.value[index].some(rb => rb.name === currentRdBlock)) {
            posting.rd_block = currentRdBlock
            console.log('Restored RD block:', currentRdBlock)
            // Also load villages for the restored RD block
            await onPostingRdBlockChange(posting, index)
          }
        }
      } catch (error) {
        console.error('Failed to load RD blocks:', error)
      }
    }
}

const onPostingRdBlockChange = async (posting: any, index: number) => {
  console.log('onPostingRdBlockChange called for index:', index, 'rd_block:', posting.rd_block)
  // Store the current habitation value to preserve it
  const currentHabitation = posting.habitation
  console.log('Current habitation:', currentHabitation)
  
  // Initialize villages array if it doesn't exist
  if (!postingVillages.value[index]) {
    postingVillages.value[index] = []
  }
  
  // Clear existing villages
  postingVillages.value[index] = []
  
      // Load villages for selected RD block
    if (posting.rd_block) {
      try {
        const rdBlock = postingRdBlocks.value[index]?.find(rb => rb.name === posting.rd_block)
        
        if (rdBlock) {
          const response = await locationsApi.getVillages(rdBlock.id)
          if (response.data.success) {
            postingVillages.value[index] = response.data.data || []
            console.log('Loaded villages:', postingVillages.value[index])
            
            // Restore the habitation value if it exists in the loaded options
            if (currentHabitation && postingVillages.value[index].some(v => v.name === currentHabitation)) {
              posting.habitation = currentHabitation
              console.log('Restored habitation:', currentHabitation)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load villages:', error)
      }
    }
}

onMounted(async () => {
  await Promise.all([
    loadSchools(), 
    loadMediums(), 
    loadManagementTypes(), 
    loadBlockOffices(),
    loadReligions(),
    loadServiceCategories(),
    loadDistricts(),
    loadSchoolTypes()
  ])
  if (isEditing.value) {
    await loadTeacher(parseInt(route.params.id as string))
  }
})

// Watch for route changes to refresh data when user navigates back from Settings
watch(() => route.path, async (newPath, oldPath) => {
  // If user navigated back to this form from Settings, refresh the data
  if (newPath === route.path && oldPath && oldPath.includes('/settings')) {
    await Promise.all([
      loadSchools(), 
      loadMediums(), 
      loadManagementTypes(), 
      loadBlockOffices(),
      loadReligions(),
      loadSchoolTypes(),
      loadDistricts()
    ])
    
    // Re-validate form data after refresh
    if (isEditing.value) {
      await loadTeacher(parseInt(route.params.id as string))
    }
  }
})

// Add focus event listener to refresh data when user returns to the form
onMounted(() => {
  window.addEventListener('focus', async () => {
    // Check if we're on this form and refresh data
    if (document.activeElement && document.activeElement.closest('form')) {
      await Promise.all([
        loadSchools(), 
        loadMediums(), 
        loadManagementTypes(), 
        loadBlockOffices(),
        loadReligions(),
        loadSchoolTypes(),
        loadDistricts()
      ])
      
      // Re-validate form data after refresh
      if (isEditing.value) {
        await loadTeacher(parseInt(route.params.id as string))
      }
    }
  })
})
</script>

<style scoped>
/* Custom placeholder styling for all input fields */
.form-input::placeholder,
.form-select::placeholder {
  color: #6B7280; /* Medium gray color - clearer but still subtle */
  opacity: 0.8; /* More visible than before */
  font-style: normal; /* Normal style - no italic */
  font-weight: 400; /* Normal font weight */
}

/* Focus state placeholder styling */
.form-input:focus::placeholder,
.form-select:focus::placeholder {
  color: #9CA3AF; /* Light gray when focused */
  opacity: 0.6; /* Slightly faded when focused */
}

/* Hover state placeholder styling */
.form-input:hover::placeholder,
.form-select:hover::placeholder {
  color: #6B7280; /* Consistent with default state */
  opacity: 0.9; /* More visible on hover */
}

/* Specific styling for readonly fields */
.form-input[readonly]::placeholder {
  color: #9CA3AF; /* Light gray for readonly fields */
  opacity: 0.5; /* Faded for readonly fields */
  font-style: normal; /* Normal style for readonly fields */
}
</style>
