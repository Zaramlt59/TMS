# 🚀 TTMS Production Scripts

## **Essential Scripts for Production Use**

This directory contains only the essential scripts needed for production deployment and maintenance.

---

## 📋 **Available Scripts**

### **Data Migration Scripts**
- **`fix-all-teacher-fields.js`** - Converts teacher array fields to comma-separated strings
- **`fix-subjects-classes.js`** - Converts subject classes from JSON arrays to strings
- **`add-missing-updated-at-fixed.js`** - Adds missing updated_at columns to all tables

### **Location Management Scripts**
- **`create-location-tables.js`** - Creates location-related database tables
- **`create-settings-tables.js`** - Creates master data tables
- **`fix-missing-rd-blocks.js`** - Fixes missing RD block references
- **`update-schools-location-names.js`** - Updates school location data
- **`update-rd-block-habitation-names.js`** - Updates RD block and habitation names

### **Data Cleanup Scripts**
- **`fix-teachers-json-format.js`** - Cleans up teacher JSON data format
- **`fix-school-level-format.js`** - Fixes school level data format
- **`final-location-cleanup.js`** - Final cleanup of location data
- **`clear-block-office-references.js`** - Cleans up block office references
- **`remove-deo-aizawl.js`** - Removes specific DEO Aizawl references
- **`clear-block-offices.js`** - Cleans up block offices data
- **`remove-inactive-block-offices.js`** - Removes inactive block offices

### **Master Data Scripts**
- **`add-is-active-to-management-types.js`** - Adds is_active field to management types
- **`add-classes-to-subjects.js`** - Adds classes field to subjects

---

## ⚠️ **Important Notes**

1. **Run in Order**: Some scripts depend on others - check dependencies before running
2. **Backup First**: Always backup your database before running migration scripts
3. **Test Environment**: Test scripts in development environment first
4. **Production Care**: Be extra careful when running scripts in production

---

## 🚀 **Usage**

```bash
# Example: Run a migration script
node scripts/fix-all-teacher-fields.js

# Example: Check script output
node scripts/fix-all-teacher-fields.js | cat
```

---

## 📞 **Support**

If you encounter issues with any script:
1. Check the script output for error messages
2. Verify database connection and permissions
3. Check if all dependencies are met
4. Contact system administrator if needed

---

*Last Updated: August 2024*  
*System: TTMS - Teacher and School Management System*
