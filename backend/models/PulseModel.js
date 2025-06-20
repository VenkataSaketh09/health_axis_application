import mongoose from 'mongoose';

const pulseReadingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    pulse: {
        type: Number,
        required: true,
        min: 30,
        max: 220
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String
    },
    activity: {
        type: String,
        enum: ['resting', 'light_exercise', 'moderate_exercise', 'intense_exercise', 'after_meal', 'stressed', 'relaxed', 'morning', 'evening', 'other']
    },
    notes: {
        type: String,
        maxlength: 500
    },
    category: {
        type: String,
        enum: ['Bradycardia', 'Normal', 'Elevated', 'Tachycardia']
    },
    timestamp: {
        type: Number,
        default: Date.now
    }
});

// Pre-save middleware to automatically categorize pulse reading
pulseReadingSchema.pre('save', function(next) {
    const { pulse } = this;
    
    if (pulse < 60) {
        this.category = 'Bradycardia';
    } else if (pulse <= 100) {
        this.category = 'Normal';
    } else if (pulse <= 120) {
        this.category = 'Elevated';
    } else {
        this.category = 'Tachycardia';
    }
    
    next();
});

const pulseReadingModel = mongoose.models.pulsereading || mongoose.model('pulsereading', pulseReadingSchema);

export default pulseReadingModel;
