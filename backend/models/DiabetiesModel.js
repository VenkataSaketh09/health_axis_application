import mongoose from "mongoose";

const glucoseReadingSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Glucose measurement
  glucose: {
    type: Number,
    required: true,
    min: [20, 'Glucose level must be at least 20 mg/dL'],
    max: [600, 'Glucose level must not exceed 600 mg/dL']
  },
  
  // Type of reading
  readingType: {
    type: String,
    required: true,
    enum: {
      values: ['fasting', 'before_meal', 'after_meal', 'bedtime', 'random'],
      message: 'Reading type must be one of: fasting, before_meal, after_meal, bedtime, random'
    },
    index: true
  },
  
  // Automatically calculated category based on glucose level and reading type
  category: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'prediabetic', 'diabetic', 'unknown'],
    index: true
  },
  
  // Date of the reading
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Time of the reading (optional)
  time: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'],
    default: null
  },
  
  // Optional notes
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true,
    default: null
  },
  
  // Timestamp for ordering and tracking
  timestamp: {
    type: Number,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  collection: 'glucose_readings'
});

// Compound indexes for better query performance
glucoseReadingSchema.index({ userId: 1, date: -1 });
glucoseReadingSchema.index({ userId: 1, timestamp: -1 });
glucoseReadingSchema.index({ userId: 1, category: 1 });
glucoseReadingSchema.index({ userId: 1, readingType: 1 });
glucoseReadingSchema.index({ userId: 1, date: -1, readingType: 1 });

// Pre-save middleware to automatically calculate category
glucoseReadingSchema.pre('save', function(next) {
  if (this.isModified('glucose') || this.isModified('readingType')) {
    this.category = this.calculateGlucoseCategory(this.glucose, this.readingType);
  }
  next();
});

// Method to calculate glucose category
glucoseReadingSchema.methods.calculateGlucoseCategory = function(glucose, readingType) {
  switch (readingType) {
    case 'fasting':
    case 'before_meal':
      if (glucose < 70) return 'low';
      if (glucose <= 99) return 'normal';
      if (glucose <= 125) return 'prediabetic';
      return 'diabetic';
    
    case 'after_meal':
    case 'random':
      if (glucose < 70) return 'low';
      if (glucose <= 139) return 'normal';
      if (glucose <= 199) return 'prediabetic';
      return 'diabetic';
    
    case 'bedtime':
      if (glucose < 70) return 'low';
      if (glucose <= 120) return 'normal';
      if (glucose <= 160) return 'prediabetic';
      return 'diabetic';
    
    default:
      return 'unknown';
  }
};

// Static method to get category ranges for a specific reading type
glucoseReadingSchema.statics.getCategoryRanges = function(readingType) {
  const ranges = {
    fasting: {
      low: { min: 0, max: 69 },
      normal: { min: 70, max: 99 },
      prediabetic: { min: 100, max: 125 },
      diabetic: { min: 126, max: 600 }
    },
    before_meal: {
      low: { min: 0, max: 69 },
      normal: { min: 70, max: 99 },
      prediabetic: { min: 100, max: 125 },
      diabetic: { min: 126, max: 600 }
    },
    after_meal: {
      low: { min: 0, max: 69 },
      normal: { min: 70, max: 139 },
      prediabetic: { min: 140, max: 199 },
      diabetic: { min: 200, max: 600 }
    },
    random: {
      low: { min: 0, max: 69 },
      normal: { min: 70, max: 139 },
      prediabetic: { min: 140, max: 199 },
      diabetic: { min: 200, max: 600 }
    },
    bedtime: {
      low: { min: 0, max: 69 },
      normal: { min: 70, max: 120 },
      prediabetic: { min: 121, max: 160 },
      diabetic: { min: 161, max: 600 }
    }
  };
  
  return ranges[readingType] || null;
};

// Static method to get analytics for a user
glucoseReadingSchema.statics.getAnalytics = async function(userId, days = 30) {
  const endDate = new Date();
  const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalReadings: { $sum: 1 },
        avgGlucose: { $avg: '$glucose' },
        minGlucose: { $min: '$glucose' },
        maxGlucose: { $max: '$glucose' },
        categoryDistribution: {
          $push: '$category'
        },
        readingTypeDistribution: {
          $push: '$readingType'
        }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || null;
};

// Virtual for formatted date
glucoseReadingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for formatted time
glucoseReadingSchema.virtual('formattedTime').get(function() {
  if (!this.time) return null;
  
  const [hours, minutes] = this.time.split(':');
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
});

// Virtual for readable reading type
glucoseReadingSchema.virtual('readingTypeLabel').get(function() {
  const labels = {
    fasting: 'Fasting',
    before_meal: 'Before Meal',
    after_meal: 'After Meal',
    bedtime: 'Bedtime',
    random: 'Random'
  };
  return labels[this.readingType] || this.readingType;
});

// Ensure virtuals are included in JSON output
glucoseReadingSchema.set('toJSON', { virtuals: true });
glucoseReadingSchema.set('toObject', { virtuals: true });

// Create and export the model
const DiabetiesReadingModel = mongoose.models.GlucoseReading || mongoose.model('GlucoseReading', glucoseReadingSchema);

export default DiabetiesReadingModel;