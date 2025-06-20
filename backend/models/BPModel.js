import mongoose from 'mongoose';

const bpReadingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    systolic: {
        type: Number,
        required: true,
        min: 70,
        max: 250
    },
    diastolic: {
        type: Number,
        required: true,
        min: 40,
        max: 150
    },
    pulse: {
        type: Number,
        min: 40,
        max: 200
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String
    },
    notes: {
        type: String,
        maxlength: 500
    },
    category: {
        type: String,
        enum: ['Normal', 'Elevated', 'Stage 1 High', 'Stage 2 High', 'Crisis'],
    },
    timestamp: {
        type: Number,
        default: Date.now
    }
});

// Pre-save middleware to automatically categorize BP reading
bpReadingSchema.pre('save', function(next) {
    const { systolic, diastolic } = this;
    
    if (systolic >= 180 || diastolic >= 120) {
        this.category = 'Crisis';
    } else if (systolic >= 140 || diastolic >= 90) {
        this.category = 'Stage 2 High';
    } else if (systolic >= 130 || diastolic >= 80) {
        this.category = 'Stage 1 High';
    } else if (systolic >= 120 && diastolic < 80) {
        this.category = 'Elevated';
    } else {
        this.category = 'Normal';
    }
    
    next();
});

const bpReadingModel = mongoose.models.bpreading || mongoose.model('bpreading', bpReadingSchema);

export default bpReadingModel;