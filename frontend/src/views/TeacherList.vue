<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Teachers</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage all teacher records in the system
        </p>
      </div>
             <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
         <button
           @click="exportToExcel"
           :disabled="loading || teachers.length === 0"
           class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
         >
           Export to Excel
         </button>
         <router-link
           to="/teachers/new"
           class="btn-primary"
         >
           Add Teacher
         </router-link>
       </div>
    </div>

    <!-- Search and Filters -->
    <div class="mt-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search teachers by name, school, or district..."
            class="form-input pl-10"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Teachers Table - Desktop View -->
    <div class="mt-8 card hidden md:block">
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        </div>

        <div v-else-if="teachers.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
          <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No teachers</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new teacher.</p>
          <div class="mt-6">
            <router-link to="/teachers/new" class="btn-primary">
              Add Teacher
            </router-link>
          </div>
        </div>

        <div v-else class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-48">
                  Teacher Details
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-48">
                  School Information
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-48">
                  Subjects & Classes
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-48">
                  Posting History
                </th>
                <th class="w-48 px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Deputation History
                </th>
                <th class="w-48 px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Attachment History
                </th>
                <th class="w-40 px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Medical History
                </th>
                <th class="w-40 px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">
                  Location
                </th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider w-36">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="teacher in teachers" :key="teacher.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">
                <td class="px-4 py-4 w-48">
                  <div>
                    <!-- Teacher Name -->
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50">
                      {{ teacher.teacher_name }}
                    </div>
                    <div v-if="teacher.teacher_ID" class="text-sm text-gray-500 dark:text-gray-400 font-mono">ID: {{ teacher.teacher_ID }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">DOB: {{ formatDate(teacher.date_of_birth) }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Joined: {{ formatDate(teacher.joining_date) }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div>
                    <div class="text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50">{{ teacher.current_school_name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">ID: {{ teacher.school_id }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.management }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div>
                    <div class="text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50">{{ parseSubjectsTaught(teacher.subjects_taught).join(', ') }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ parseClassesTaught(teacher.classes_taught).join(', ') }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.posting_histories && teacher.posting_histories.length > 0">
                    <div class="text-sm text-gray-900 dark:text-gray-100 font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 group-hover:text-gray-700 dark:group-hover:text-gray-50" 
                         @click="togglePostingHistory(teacher.id!)"
                         :title="`Click to view ${teacher.posting_histories.length} posting${teacher.posting_histories.length > 1 ? 's' : ''}`">
                      {{ teacher.posting_histories.length }} Previous Posting{{ teacher.posting_histories.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ teacher.posting_histories[0].school_name }}
                      <span v-if="teacher.posting_histories.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.posting_histories.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(teacher.posting_histories[0].from_date) }} - {{ teacher.posting_histories[0].to_date ? formatDate(teacher.posting_histories[0].to_date) : 'Current' }}
                      <span v-if="!teacher.posting_histories[0].to_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        Ongoing
                      </span>
                      <span v-if="teacher.posting_histories[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.posting_histories[0].status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                        {{ teacher.posting_histories[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Posting History Details -->
                    <div v-if="expandedPostingHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Posting History:</div>
                      <div v-for="(posting, index) in teacher.posting_histories" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ posting.school_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ posting.medium }} • {{ posting.management }} • {{ posting.district }}
                        </div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(posting.from_date) }} - {{ posting.to_date ? formatDate(posting.to_date) : 'Current' }}
                          <span v-if="!posting.to_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            Ongoing
                          </span>
                          <span v-if="posting.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="posting.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                            {{ posting.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 dark:text-gray-500 italic">
                    No previous postings
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.deputations && teacher.deputations.length > 0">
                    <div class="text-sm text-gray-900 dark:text-gray-100 font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 group-hover:text-gray-700 dark:group-hover:text-gray-50" 
                         @click="toggleDeputationHistory(teacher.id!)"
                         :title="`Click to view ${teacher.deputations.length} deputations${teacher.deputations.length > 1 ? 's' : ''}`">
                      {{ teacher.deputations.length }} Deputation{{ teacher.deputations.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ teacher.deputations[0].department_name }}
                      <span v-if="teacher.deputations.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.deputations.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(teacher.deputations[0].joining_date) }} - {{ teacher.deputations[0].end_date ? formatDate(teacher.deputations[0].end_date) : 'Current' }}
                      <span v-if="!teacher.deputations[0].end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        Ongoing
                      </span>
                      <span v-if="teacher.deputations[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.deputations[0].status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                        {{ teacher.deputations[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Deputation History Details -->
                    <div v-if="expandedDeputationHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Deputation History:</div>
                      <div v-for="(deputations, index) in teacher.deputations" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ deputations.department_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ deputations.designation }}
                        </div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(deputations.joining_date) }} - {{ deputations.end_date ? formatDate(deputations.end_date) : 'Current' }}
                          <span v-if="!deputations.end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            Ongoing
                          </span>
                          <span v-if="deputations.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="deputations.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                            {{ deputations.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 dark:text-gray-500 italic">
                    No deputations
                  </div>
                </td>
                <td class="px-4 py-4 w-48">
                  <div v-if="teacher.attachments && teacher.attachments.length > 0">
                    <div class="text-sm text-gray-900 dark:text-gray-100 font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 group-hover:text-gray-700 dark:group-hover:text-gray-50" 
                         @click="toggleAttachmentHistory(teacher.id!)"
                         :title="`Click to view ${teacher.attachments.length} attachments${teacher.attachments.length > 1 ? 's' : ''}`">
                      {{ teacher.attachments.length }} Attachment{{ teacher.attachments.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ teacher.attachments[0].department_name }}
                      <span v-if="teacher.attachments.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.attachments.length - 1 }} more
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-500">
                      {{ formatDate(teacher.attachments[0].joining_date) }} - {{ teacher.attachments[0].end_date ? formatDate(teacher.attachments[0].end_date) : 'Current' }}
                      <span v-if="!teacher.attachments[0].end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        Ongoing
                      </span>
                      <span v-if="teacher.attachments[0].status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="teacher.attachments[0].status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                        {{ teacher.attachments[0].status }}
                      </span>
                    </div>
                    
                    <!-- Expanded Attachment History Details -->
                    <div v-if="expandedAttachmentHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Attachment History:</div>
                      <div v-for="(attachments, index) in teacher.attachments" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ attachments.department_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ attachments.designation }}
                        </div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(attachments.joining_date) }} - {{ attachments.end_date ? formatDate(attachments.end_date) : 'Current' }}
                          <span v-if="!attachments.end_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            Ongoing
                          </span>
                          <span v-if="attachments.status" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium" 
                                :class="attachments.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'">
                            {{ attachments.status }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400 dark:text-gray-500 italic">
                    No attachments
                  </div>
                </td>
                <td class="px-4 py-4 w-40">
                  <router-link
                    :to="`/teachers/${teacher.id}/medical-records`"
                    class="text-sm text-primary-600 dark:text-blue-400 hover:text-primary-900 dark:hover:text-blue-300 group-hover:text-primary-700 dark:group-hover:text-blue-300"
                  >
                    Click to see Medical Records
                  </router-link>
                </td>
                <td class="px-4 py-4 w-40">
                  <div>
                    <div class="text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50">{{ teacher.district || 'N/A' }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.habitation || 'N/A' }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ teacher.habitation_class || 'N/A' }}</div>
                  </div>
                </td>
                <td class="px-4 py-4 w-40 text-sm font-medium">
                  <div class="flex space-x-2">
                    <!-- View button - always visible -->
                    <button
                      @click="viewTeacher(teacher)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-green-200 dark:border-green-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    <router-link
                      :to="`/teachers/${teacher.id}/edit`"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-blue-200 dark:border-blue-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit
                    </router-link>
                    <button
                      @click="deleteTeacher(teacher.teacher_ID || teacher.id!)"
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md rounded-md transition-all duration-200 border border-red-200 dark:border-red-700"
                    >
                      <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Teachers Cards - Mobile View -->
    <div class="mt-8 md:hidden">
      <div v-if="loading" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow-lg rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 cursor-not-allowed">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>

      <div v-else-if="teachers.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No teachers</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new teacher.</p>
        <div class="mt-6">
          <router-link to="/teachers/new" class="btn-primary">
            Add Teacher
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="teacher in teachers" 
          :key="teacher.id" 
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-200 group"
        >
          <div class="p-4">
            <!-- Teacher Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-gray-700 dark:group-hover:text-gray-50">{{ teacher.teacher_name }}</h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span v-if="teacher.teacher_ID" class="text-sm text-gray-600 dark:text-gray-300 font-mono">ID: {{ teacher.teacher_ID }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">DOB: {{ formatDate(teacher.date_of_birth) }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-300">Joined: {{ formatDate(teacher.joining_date) }}</span>
                </div>
              </div>
              <div class="flex-shrink-0 ml-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                  {{ teacher.teacher_type }}
                </span>
              </div>
            </div>

            <!-- Teacher Details -->
            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">School Information</dt>
                  <dd class="space-y-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ teacher.current_school_name }}</div>
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        ID: {{ teacher.school_id }}
                      </span>
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                        {{ teacher.management }}
                      </span>
                    </div>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Subjects & Classes</dt>
                  <dd class="space-y-2">
                    <div class="text-sm text-gray-900 dark:text-gray-100">{{ parseSubjectsTaught(teacher.subjects_taught).join(', ') }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ parseClassesTaught(teacher.classes_taught).join(', ') }}</div>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Location</dt>
                  <dd class="space-y-2">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ teacher.district || 'N/A' }}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">{{ teacher.habitation || 'N/A' }}</div>
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium" 
                          :class="teacher.habitation_class === 'Urban' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'">
                      {{ teacher.habitation_class || 'N/A' }}
                    </span>
                  </dd>
                </div>

                <!-- Posting History Summary -->
                <div v-if="teacher.posting_histories && teacher.posting_histories.length > 0">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Posting History</dt>
                  <dd class="space-y-2">
                    <div class="font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 text-sm text-gray-900 dark:text-gray-100" 
                         @click="togglePostingHistory(teacher.id!)"
                         :title="`Click to view ${teacher.posting_histories.length} posting${teacher.posting_histories.length > 1 ? 's' : ''}`">
                      {{ teacher.posting_histories.length }} Previous Posting{{ teacher.posting_histories.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      {{ teacher.posting_histories[0].school_name }}
                      <span v-if="teacher.posting_histories.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.posting_histories.length - 1 }} more
                      </span>
                    </div>
                    
                    <!-- Expanded Posting History Details -->
                    <div v-if="expandedPostingHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Posting History:</div>
                      <div v-for="(posting, index) in teacher.posting_histories" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ posting.school_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">
                          {{ posting.medium }} • {{ posting.management }} • {{ posting.district }}
                        </div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(posting.from_date) }} - {{ posting.to_date ? formatDate(posting.to_date) : 'Current' }}
                          <span v-if="!posting.to_date" class="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            Ongoing
                          </span>
                        </div>
                      </div>
                    </div>
                  </dd>
                </div>

                <!-- Deputation History Summary -->
                <div v-if="teacher.deputations && teacher.deputations.length > 0">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Deputation History</dt>
                  <dd class="space-y-2">
                    <div class="font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 text-sm text-gray-900 dark:text-gray-100" 
                         @click="toggleDeputationHistory(teacher.id!)"
                         :title="`Click to view ${teacher.deputations.length} deputations${teacher.deputations.length > 1 ? 's' : ''}`">
                      {{ teacher.deputations.length }} Deputation{{ teacher.deputations.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      {{ teacher.deputations[0].department_name }}
                      <span v-if="teacher.deputations.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.deputations.length - 1 }} more
                      </span>
                    </div>
                    
                    <!-- Expanded Deputation History Details -->
                    <div v-if="expandedDeputationHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Deputation History:</div>
                      <div v-for="(deputations, index) in teacher.deputations" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ deputations.department_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ deputations.designation }}</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(deputations.joining_date) }} - {{ deputations.end_date ? formatDate(deputations.end_date) : 'Current' }}
                        </div>
                      </div>
                    </div>
                  </dd>
                </div>

                <!-- Attachment History Summary -->
                <div v-if="teacher.attachments && teacher.attachments.length > 0">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Attachment History</dt>
                  <dd class="space-y-2">
                    <div class="font-medium cursor-pointer hover:text-primary-600 dark:hover:text-blue-400 text-sm text-gray-900 dark:text-gray-100" 
                         @click="toggleAttachmentHistory(teacher.id!)"
                         :title="`Click to view ${teacher.attachments.length} attachments${teacher.attachments.length > 1 ? 's' : ''}`">
                      {{ teacher.attachments.length }} Attachment{{ teacher.attachments.length > 1 ? 's' : '' }}
                      <svg class="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">
                      {{ teacher.attachments[0].department_name }}
                      <span v-if="teacher.attachments.length > 1" class="text-xs text-gray-400 dark:text-gray-500">
                        +{{ teacher.attachments.length - 1 }} more
                      </span>
                    </div>
                    
                    <!-- Expanded Attachment History Details -->
                    <div v-if="expandedAttachmentHistory === teacher.id" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div class="text-xs font-medium text-gray-700 dark:text-gray-200 mb-2">Full Attachment History:</div>
                      <div v-for="(attachments, index) in teacher.attachments" :key="index" class="mb-2 pb-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                        <div class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ index + 1 }}. {{ attachments.department_name }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ attachments.designation }}</div>
                        <div class="text-xs text-gray-400 dark:text-gray-500">
                          {{ formatDate(attachments.joining_date) }} - {{ attachments.end_date ? formatDate(attachments.end_date) : 'Current' }}
                        </div>
                      </div>
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex flex-col space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <!-- View button - always visible -->
                  <button
                    @click="viewTeacher(teacher)"
                    class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 border border-green-200 dark:border-green-700"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View
                  </button>
                  <router-link
                    :to="`/teachers/${teacher.id}/edit`"
                    class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 border border-blue-200 dark:border-blue-700"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </router-link>
                  <button
                    @click="deleteTeacher(teacher.teacher_ID || teacher.id!)"
                    class="inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 hover:shadow-sm dark:hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 border border-red-200 dark:border-red-700"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
                <router-link
                  :to="`/teachers/${teacher.id}/medical-records`"
                  class="w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-blue-500 transition-all duration-200 border border-gray-300 dark:border-gray-600"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  View Medical Records
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="mt-8 flex items-center justify-between">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                page === pagination.page
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Teacher Details Modal -->
    <div v-if="showTeacherModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" @click="closeTeacherModal"></div>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Teacher Details
                </h3>
                <div v-if="selectedTeacher" class="mt-4 space-y-6">
                  <!-- Basic Teacher Information -->
                  <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Personal Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Full Name</label>
                        <p class="mt-1 text-sm font-semibold text-blue-900 dark:text-blue-100">{{ selectedTeacher.teacher_name }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Teacher ID</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100 font-mono">{{ selectedTeacher.teacher_ID || 'Not assigned' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Date of Birth</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">{{ formatDate(selectedTeacher.date_of_birth) }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Joining Date</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">{{ formatDate(selectedTeacher.joining_date) }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Gender</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                            {{ selectedTeacher.gender }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Social Group</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">{{ selectedTeacher.social_group || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Religion</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">{{ selectedTeacher.religion || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Aadhaar Number</label>
                        <p class="mt-1 text-sm font-mono text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{{ selectedTeacher.aadhaar_number || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-blue-700 dark:text-blue-300">Service Category</label>
                        <p class="mt-1 text-sm text-blue-900 dark:text-blue-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                            {{ formatDisplayText(selectedTeacher.service_category ?? '') || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Contact Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Phone Number</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">
                          <span v-if="selectedTeacher.phone_number" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                            {{ selectedTeacher.phone_number }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-green-700 dark:text-green-300">Email Address</label>
                        <p class="mt-1 text-sm text-green-900 dark:text-green-100">
                          <span v-if="selectedTeacher.email" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                            {{ selectedTeacher.email }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- School Information -->
                  <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      School Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">School Name</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">{{ selectedTeacher.current_school_name || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">School ID</label>
                        <p class="mt-1 text-sm font-mono text-purple-900 dark:text-purple-100 bg-purple-100 dark:bg-purple-800 px-2 py-1 rounded">{{ selectedTeacher.school_id || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">School Level</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">{{ selectedTeacher.school_level || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">Management Type</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                            {{ formatDisplayText(selectedTeacher.management) || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-purple-700 dark:text-purple-300">School Phone</label>
                        <p class="mt-1 text-sm text-purple-900 dark:text-purple-100">
                          <span v-if="selectedTeacher.school_phone" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                            {{ selectedTeacher.school_phone }}
                          </span>
                          <span v-else class="text-gray-500">Not specified</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Teaching Information -->
                  <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      Teaching Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Subjects Taught</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">{{ formatSubjects(selectedTeacher.subjects_taught) || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Classes Taught</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">{{ formatClasses(selectedTeacher.classes_taught) || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Medium of Institution</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200">
                            {{ selectedTeacher.medium || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-orange-700 dark:text-orange-300">Experience</label>
                        <p class="mt-1 text-sm text-orange-900 dark:text-orange-100">{{ getExperienceYears(selectedTeacher) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Location Information -->
                  <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Location Information
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">District</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{{ selectedTeacher.district || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Block Office</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{{ selectedTeacher.block_office || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Habitation</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{{ selectedTeacher.habitation || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Pin Code</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{{ selectedTeacher.pincode || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">RD Block</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">{{ selectedTeacher.rd_block || 'Not specified' }}</p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Area Type</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                            {{ selectedTeacher.habitation_class || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label class="text-sm font-medium text-indigo-700 dark:text-indigo-300">Habitation Category</label>
                        <p class="mt-1 text-sm text-indigo-900 dark:text-indigo-100">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200">
                            {{ formatDisplayText(selectedTeacher.habitation_category ?? '') || 'Not specified' }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Posting History -->
                  <div v-if="selectedTeacher.posting_histories && selectedTeacher.posting_histories.length > 0" class="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      Posting History
                    </h4>
                    <div class="space-y-3">
                      <div v-for="(posting, index) in selectedTeacher.posting_histories" :key="index" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label class="text-sm font-medium text-cyan-700 dark:text-cyan-300">School</label>
                            <p class="text-sm text-cyan-900 dark:text-cyan-100">{{ posting.school_name }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-cyan-700 dark:text-cyan-300">Period</label>
                            <p class="text-sm text-cyan-900 dark:text-cyan-100">{{ formatDate(posting.from_date) }} - {{ posting.to_date ? formatDate(posting.to_date) : 'Current' }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-cyan-700 dark:text-cyan-300">Status</label>
                            <p class="text-sm text-cyan-900 dark:text-cyan-100">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                                {{ posting.status || 'Active' }}
                              </span>
                            </p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-cyan-700 dark:text-cyan-300">Location</label>
                            <p class="text-sm text-cyan-900 dark:text-cyan-100">{{ posting.district }}, {{ posting.block_office }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Deputations -->
                  <div v-if="selectedTeacher.deputations && selectedTeacher.deputations.length > 0" class="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-pink-900 dark:text-pink-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Deputation History
                    </h4>
                    <div class="space-y-3">
                      <div v-for="(deputations, index) in selectedTeacher.deputations" :key="index" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label class="text-sm font-medium text-pink-700 dark:text-pink-300">Department</label>
                            <p class="text-sm text-pink-900 dark:text-pink-100">{{ deputations.department_name }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-pink-700 dark:text-pink-300">Designation</label>
                            <p class="text-sm text-pink-900 dark:text-pink-100">{{ deputations.designation }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-pink-700 dark:text-pink-300">Period</label>
                            <p class="text-sm text-pink-900 dark:text-pink-100">{{ formatDate(deputations.joining_date) }} - {{ deputations.end_date ? formatDate(deputations.end_date) : 'Current' }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-pink-700 dark:text-pink-300">Status</label>
                            <p class="text-sm text-pink-900 dark:text-pink-100">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                                {{ deputations.status || 'Active' }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Attachments -->
                  <div v-if="selectedTeacher.attachments && selectedTeacher.attachments.length > 0" class="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                      Attachment History
                    </h4>
                    <div class="space-y-3">
                      <div v-for="(attachments, index) in selectedTeacher.attachments" :key="index" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-teal-200 dark:border-teal-700">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label class="text-sm font-medium text-teal-700 dark:text-teal-300">Department</label>
                            <p class="text-sm text-teal-900 dark:text-teal-100">{{ attachments.department_name }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-teal-700 dark:text-teal-300">Designation</label>
                            <p class="text-sm text-teal-900 dark:text-teal-100">{{ attachments.designation }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-teal-700 dark:text-teal-300">Period</label>
                            <p class="text-sm text-teal-900 dark:text-teal-100">{{ formatDate(attachments.joining_date) }} - {{ attachments.end_date ? formatDate(attachments.end_date) : 'Current' }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-teal-700 dark:text-teal-300">Status</label>
                            <p class="text-sm text-teal-900 dark:text-teal-100">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                                {{ attachments.status || 'Active' }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Medical Records -->
                  <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Medical Records
                      <span v-if="loadingMedicalRecords" class="ml-2">
                        <svg class="animate-spin h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    </h4>
                    
                    <div v-if="loadingMedicalRecords" class="text-center py-4">
                      <p class="text-sm text-red-700 dark:text-red-300">Loading medical records...</p>
                    </div>
                    
                    <div v-else-if="teacherMedicalRecords.length === 0" class="text-center py-4">
                      <p class="text-sm text-red-700 dark:text-red-300">No medical records found for this teacher.</p>
                    </div>
                    
                    <div v-else class="space-y-3">
                      <div v-for="(record, index) in teacherMedicalRecords" :key="index" class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-700">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Ailment Name</label>
                            <p class="text-sm text-red-900 dark:text-red-100 font-semibold">{{ record.ailment_name || 'Not specified' }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Severity</label>
                            <p class="text-sm text-red-900 dark:text-red-100">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="{
                                      'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200': record.severity === 'Severe',
                                      'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200': record.severity === 'Moderate',
                                      'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200': record.severity === 'Mild',
                                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200': !record.severity
                                    }">
                                {{ record.severity ?? 'Not specified' }}
                              </span>
                            </p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Diagnosis Date</label>
                            <p class="text-sm text-red-900 dark:text-red-100">{{ formatDate(record.diagnosis_date ?? '') }}</p>
                          </div>
                          <div>
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Treatment Status</label>
                            <p class="text-sm text-red-900 dark:text-red-100">
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="{
                                      'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200': record.treatment_status === 'Completed',
                                      'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200': record.treatment_status === 'Ongoing',
                                      'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200': record.treatment_status === 'Pending',
                                      'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200': !record.treatment_status
                                    }">
                                {{ record.treatment_status || 'Not specified' }}
                              </span>
                            </p>
                          </div>
                          <div v-if="record.remarks" class="md:col-span-2">
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Remarks</label>
                            <p class="text-sm text-red-900 dark:text-red-100">{{ record.remarks }}</p>
                          </div>
                          <div v-if="record.documents" class="md:col-span-2">
                            <label class="text-sm font-medium text-red-700 dark:text-red-300">Documents</label>
                            <p class="text-sm text-red-900 dark:text-red-100">
                              <a :href="fileUrl(record.documents)" target="_blank" rel="noopener" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline">
                                View Document
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeTeacherModal" class="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { teachersApi, medicalRecordsApi, cascadeApi, type MedicalRecord } from '../services/api'
import type { Teacher, TeacherListResponse } from '../types'
import * as XLSX from 'xlsx'

const teachers = ref<Teacher[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()
const showTeacherModal = ref(false)
const selectedTeacher = ref<Teacher | null>(null)
const teacherMedicalRecords = ref<MedicalRecord[]>([])
const loadingMedicalRecords = ref(false)

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, pagination.value.page - 2)
  const end = Math.min(pagination.value.totalPages, pagination.value.page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const expandedPostingHistory = ref<number | null>(null)
const expandedDeputationHistory = ref<number | null>(null)
const expandedAttachmentHistory = ref<number | null>(null)

const togglePostingHistory = (teacherId: number) => {
  expandedPostingHistory.value = expandedPostingHistory.value === teacherId ? null : teacherId
}

const toggleDeputationHistory = (teacherId: number) => {
  expandedDeputationHistory.value = expandedDeputationHistory.value === teacherId ? null : teacherId
}

const toggleAttachmentHistory = (teacherId: number) => {
  expandedAttachmentHistory.value = expandedAttachmentHistory.value === teacherId ? null : teacherId
}

const loadTeachers = async (page = 1) => {
  loading.value = true
  try {
    const response = await teachersApi.getAll(page, pagination.value.limit)
    console.log('=== TEACHER LIST DEBUG ===')
    console.log('API Response:', response)
    console.log('Response data:', response.data)
    console.log('Teachers array:', response.data.data)
    
    if (response.data.success) {
      teachers.value = response.data.data || []
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }
    }
  } catch (error) {
    console.error('Failed to load teachers:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      try {
        const response = await teachersApi.search(searchQuery.value.trim())
        if (response.data.success) {
          teachers.value = response.data.data || []
          pagination.value = {
            page: 1,
            limit: 10,
            total: teachers.value.length,
            totalPages: 1
          }
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
    } else {
      loadTeachers(1)
    }
  }, 300)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadTeachers(page)
  }
}

const viewTeacher = async (teacher: Teacher) => {
  selectedTeacher.value = teacher
  showTeacherModal.value = true
  
  // Fetch medical records for this teacher using teacher_ID or id
  if (teacher.teacher_ID || teacher.id) {
    loadingMedicalRecords.value = true
    try {
      // Use teacher_ID (string) if available, otherwise use id (number)
      const teacherIdentifier = teacher.teacher_ID || teacher.id
      if (!teacherIdentifier) return
      
      // Pass the identifier as-is (string or number) - the API handles both
      const resp = await medicalRecordsApi.getByTeacher(teacherIdentifier)
      teacherMedicalRecords.value = (resp.data && (resp.data as any).data) ? (resp.data as any).data : []
    } catch (error) {
      console.error('Error fetching medical records:', error)
      teacherMedicalRecords.value = []
    } finally {
      loadingMedicalRecords.value = false
    }
  }
}

const closeTeacherModal = () => {
  showTeacherModal.value = false
  selectedTeacher.value = null
  teacherMedicalRecords.value = []
}

// Helper function to format underscores to spaces
const formatDisplayText = (text: string): string => {
  if (!text) return ''
  return text.replace(/_/g, ' ')
}

// Helper function to calculate experience years
const getExperienceYears = (teacher: Teacher): string => {
  if (!teacher.joining_date) return 'Not specified'
  
  const joiningDate = new Date(teacher.joining_date)
  const currentDate = new Date()
  const diffTime = Math.abs(currentDate.getTime() - joiningDate.getTime())
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25))
  
  if (diffYears === 0) {
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44))
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
  }
  
  return `${diffYears} year${diffYears !== 1 ? 's' : ''}`
}

// Helper function to format subjects (JSON string to readable format)
const formatSubjects = (subjectsString: string): string => {
  if (!subjectsString) return ''
  try {
    const subjects = JSON.parse(subjectsString)
    return Array.isArray(subjects) ? subjects.join(', ') : subjectsString
  } catch {
    return subjectsString
  }
}

// Helper function to format classes (JSON string to readable format)
const formatClasses = (classesString: string): string => {
  if (!classesString) return ''
  try {
    const classes = JSON.parse(classesString)
    return Array.isArray(classes) ? classes.join(', ') : classesString
  } catch {
    return classesString
  }
}

// Helper function to format file URLs for document viewing
const fileUrl = (url?: string | null) => {
  if (!url) return '#'
  // If already absolute (starts with http/https), return as is
  if (/^https?:\/\//i.test(url)) return url
  
  // Extract filename from the URL
  let filename = url
  if (url.startsWith('/uploads/medical-records/')) {
    filename = url.replace('/uploads/medical-records/', '')
  } else if (url.startsWith('/uploads/')) {
    filename = url.replace('/uploads/', '')
  }
  
  // Use the API endpoint for authenticated file access
  return `/api/uploads/medical-records/${filename}`
}

const deleteTeacher = async (teacherId: number | string) => {
  try {
    console.log('🔍 Frontend deleteTeacher - teacherId:', teacherId, 'type:', typeof teacherId)
    
    // For teacher_ID strings like "TC1002", we need to find the numeric database ID
    let numericId: number
    
    if (typeof teacherId === 'string' && isNaN(Number(teacherId))) {
      // This is a teacher_ID string, we need to find the teacher first to get the numeric ID
      console.log('🔍 Frontend deleteTeacher - looking up teacher by teacher_ID:', teacherId)
      try {
        const teacherResponse = await teachersApi.search(teacherId)
        if (teacherResponse.data.success && teacherResponse.data.data && teacherResponse.data.data.length > 0) {
          const teacher = teacherResponse.data.data.find(t => t.teacher_ID === teacherId)
          if (teacher && teacher.id) {
            numericId = Number(teacher.id)
            console.log('🔍 Frontend deleteTeacher - found numeric ID:', numericId)
          } else {
            alert('Teacher not found. Cannot delete teacher.')
            return
          }
        } else {
          alert('Teacher not found. Cannot delete teacher.')
          return
        }
      } catch (error) {
        console.error('Error finding teacher:', error)
        alert('Failed to find teacher. Cannot delete teacher.')
        return
      }
    } else {
      // This is already a numeric ID
      numericId = Number(teacherId)
    }
    
    if (isNaN(numericId) || numericId <= 0) {
      alert('Invalid teacher ID. Cannot delete teacher.')
      return
    }
    
    // First, check cascade information
    const cascadeResponse = await cascadeApi.getTeacherCascadeInfo(numericId)
    const cascadeInfo = cascadeResponse.data.data?.cascadeInfo
    
    if (!cascadeInfo) {
      alert('Failed to get cascade information. Please try again.')
      return
    }
    
    const totalAffected = cascadeInfo.medicalRecords + cascadeInfo.attachments + 
                         cascadeInfo.deputations + cascadeInfo.postingHistories

    let confirmMessage = 'Are you sure you want to delete this teacher?'
    if (totalAffected > 0) {
      confirmMessage += `\n\nThis will also delete:\n`
      if (cascadeInfo.medicalRecords > 0) confirmMessage += `• ${cascadeInfo.medicalRecords} medical record(s)\n`
      if (cascadeInfo.attachments > 0) confirmMessage += `• ${cascadeInfo.attachments} attachments(s)\n`
      if (cascadeInfo.deputations > 0) confirmMessage += `• ${cascadeInfo.deputations} deputations(s)\n`
      if (cascadeInfo.postingHistories > 0) confirmMessage += `• ${cascadeInfo.postingHistories} posting histor(ies)\n`
      confirmMessage += `\nThis action cannot be undone.`
    } else {
      confirmMessage += ' This action cannot be undone.'
    }

    if (!confirm(confirmMessage)) {
      return
    }
    
    // Use cascade API for safe deletion
      const response = await cascadeApi.safeDeleteTeacher(numericId, true)
    if (response.data.success) {
      await loadTeachers(pagination.value.page)
      alert('Teacher deleted successfully!')
    } else {
      alert(`Failed to delete teacher: ${response.data.message}`)
    }
  } catch (error: any) {
    console.error('Failed to delete teacher:', error)
    if (error.response?.data?.message) {
      alert(`Failed to delete teacher: ${error.response.data.message}`)
    } else {
      alert('Failed to delete teacher. Please try again.')
    }
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Helper functions to parse subjects and classes from database
// These can be either JSON arrays or comma-separated strings
const parseSubjectsTaught = (subjectsString: string): string[] => {
  try {
    if (!subjectsString) return []
    
    // Try to parse as JSON first
    if (subjectsString.startsWith('[') && subjectsString.endsWith(']')) {
      return JSON.parse(subjectsString)
    }
    
    // If not JSON, split by comma and trim
    return subjectsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  } catch (error) {
    console.error('Error parsing subjects_taught:', error)
    // Fallback: split by comma
    return subjectsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  }
}

const parseClassesTaught = (classesString: string): string[] => {
  try {
    if (!classesString) return []
    
    // Try to parse as JSON first
    if (classesString.startsWith('[') && classesString.endsWith(']')) {
      return JSON.parse(classesString)
    }
    
    // If not JSON, split by comma and trim
    return classesString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  } catch (error) {
    console.error('Error parsing classes_taught:', error)
    // Fallback: split by comma
    return classesString.split(',').map(s => s.trim()).filter(s => s.length > 0)
  }
}

type MedicalSummary = {
  medicalRecordsCount: number
  latestMedicalAilment: string
  latestMedicalSeverity: string
  latestMedicalRemarks: string
  latestMedicalDocumentUrl: string
}

const getMedicalSummary = async (teacherId?: number | string): Promise<MedicalSummary> => {
  if (!teacherId) {
    return { medicalRecordsCount: 0, latestMedicalAilment: '', latestMedicalSeverity: '', latestMedicalRemarks: '', latestMedicalDocumentUrl: '' }
  }
  try {
    const resp = await medicalRecordsApi.getByTeacher(teacherId)
    const records: MedicalRecord[] = (resp.data && (resp.data as any).data) ? (resp.data as any).data : []
    const latest = records && records.length > 0 ? records[0] : undefined
    return {
      medicalRecordsCount: records.length || 0,
      latestMedicalAilment: latest?.ailment_name || '',
      latestMedicalSeverity: latest?.severity || '',
      latestMedicalRemarks: latest?.remarks || '',
      latestMedicalDocumentUrl: latest?.documents || ''
    }
  } catch {
    return { medicalRecordsCount: 0, latestMedicalAilment: '', latestMedicalSeverity: '', latestMedicalRemarks: '', latestMedicalDocumentUrl: '' }
  }
}

const exportToExcel = async () => {
  try {
    // Fetch medical summaries for current teacher list
    const summariesArray = await Promise.all(teachers.value.map(t => getMedicalSummary(t.id)))
    const summaryByTeacherId: Record<number, MedicalSummary> = {}
    teachers.value.forEach((t, i) => {
      if (typeof t.id === 'number') summaryByTeacherId[t.id] = summariesArray[i]
    })

    // Prepare data for export
    const exportData = teachers.value.map(teacher => ({
      // ===== BASIC TEACHER INFORMATION =====
      'Teacher Name': teacher.teacher_name || '',
      'Date of Birth': formatDate(teacher.date_of_birth) || '',
      'Joining Date': formatDate(teacher.joining_date) || '',
      'Gender': teacher.gender || '',
      'Social Group': teacher.social_group || '',
      'Religion': teacher.religion || '',
      'Aadhaar Number': teacher.aadhaar_number || '',
      
      // ===== CONTACT INFORMATION =====
      'Phone Number': teacher.phone_number || '',
      'Email': teacher.email || '',
      
      // ===== ACADEMIC QUALIFICATIONS =====
      'Subjects Taught': parseSubjectsTaught(teacher.subjects_taught).join(', '),
      'Classes Taught': parseClassesTaught(teacher.classes_taught).join(', '),
      
      // ===== CURRENT SCHOOL ASSIGNMENT =====
      'School ID': teacher.school_id || '',
      'Current School Name': teacher.current_school_name || '',
      'School Level': teacher.school_level || '',
      'Management Type': teacher.management || '',
      'Service Category': teacher.service_category || '',
      'Medium of Institution': teacher.medium || '',
      
      // ===== LOCATION INFORMATION =====
      'District': teacher.district || '',
      'RD Block': teacher.rd_block || '',
      'Habitation': teacher.habitation || '',
      'Pincode': teacher.pincode || '',
      'Habitation Class': teacher.habitation_class || '',
      'Habitation Category': teacher.habitation_category || '',
      'Block Office': teacher.block_office || '',
      'School Phone': teacher.school_phone || '',
      
      // ===== HISTORY SUMMARY =====
      'Total Posting Records': teacher.posting_histories ? teacher.posting_histories.length : 0,
      'Total Deputation Records': teacher.deputations ? teacher.deputations.length : 0,
      'Total Attachment Records': teacher.attachments ? teacher.attachments.length : 0,

      // ===== MEDICAL RECORDS SUMMARY =====
      'Medical Records Count': summaryByTeacherId[teacher.id as number]?.medicalRecordsCount ?? 0,
      'Latest Medical Ailment': summaryByTeacherId[teacher.id as number]?.latestMedicalAilment ?? '',
      'Latest Medical Severity': summaryByTeacherId[teacher.id as number]?.latestMedicalSeverity ?? '',
      'Latest Medical Remarks': summaryByTeacherId[teacher.id as number]?.latestMedicalRemarks ?? '',
      
      // ===== LATEST POSTING DETAILS =====
      'Latest Posting School': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].school_name : '',
      'Latest Posting Type': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].school_type : '',
      'Latest Posting Medium': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].medium : '',
      'Latest Posting Management': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].management : '',
      'Latest Posting District': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].district : '',
      'Latest Posting Block Office': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].block_office : '',
      'Latest Posting Start Date': teacher.posting_histories && teacher.posting_histories.length > 0 ? formatDate(teacher.posting_histories[0].from_date) : '',
      'Latest Posting End Date': teacher.posting_histories && teacher.posting_histories.length > 0 && teacher.posting_histories[0].to_date ? formatDate(teacher.posting_histories[0].to_date) : '',
      'Latest Posting Status': teacher.posting_histories && teacher.posting_histories.length > 0 ? teacher.posting_histories[0].status : '',
      
      // ===== LATEST DEPUTATION DETAILS =====
      'Latest Deputation Department': teacher.deputations && teacher.deputations.length > 0 ? teacher.deputations[0].department_name : '',
      'Latest Deputation Designation': teacher.deputations && teacher.deputations.length > 0 ? teacher.deputations[0].designation : '',
      'Latest Deputation Start Date': teacher.deputations && teacher.deputations.length > 0 ? formatDate(teacher.deputations[0].joining_date) : '',
      'Latest Deputation End Date': teacher.deputations && teacher.deputations.length > 0 && teacher.deputations[0].end_date ? formatDate(teacher.deputations[0].end_date) : '',
      'Latest Deputation Status': teacher.deputations && teacher.deputations.length > 0 ? teacher.deputations[0].status : '',
      
      // ===== LATEST ATTACHMENT DETAILS =====
      'Latest Attachment Department': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].department_name : '',
      'Latest Attachment Designation': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].designation : '',
              'Latest Attachment District': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].district : '',
        'Latest Attachment RD Block': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].rd_block : '',
        'Latest Attachment Habitation': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].habitation : '',
        'Latest Attachment Start Date': teacher.attachments && teacher.attachments.length > 0 ? formatDate(teacher.attachments[0].joining_date) : '',
      'Latest Attachment End Date': teacher.attachments && teacher.attachments.length > 0 && teacher.attachments[0].end_date ? formatDate(teacher.attachments[0].end_date) : '',
      'Latest Attachment Status': teacher.attachments && teacher.attachments.length > 0 ? teacher.attachments[0].status : '',
      
      // ===== SYSTEM INFORMATION =====
      'Record Created Date': teacher.created_at ? formatDate(teacher.created_at) : '',
      'Record Last Updated': teacher.updated_at ? formatDate(teacher.updated_at) : ''
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Auto-size columns
    const columnWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers Report')

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `teachers_report_${currentDate}.xlsx`

    // Save the file
    XLSX.writeFile(workbook, filename)

    // Show success message
    alert(`Excel file "${filename}" has been downloaded successfully!`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    alert('Failed to export Excel file. Please try again.')
  }
}

onMounted(() => {
  loadTeachers()
})
</script>
