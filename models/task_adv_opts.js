import { builtinModules } from 'module';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    User     = require('./user'),
    Task     = require('./tasks');

var advanceOptionSchema = new Schema({
    start_time:{
        type:Date,
        required: false
    },
    end_time:{
        type:Date,
        required:false
    },
    task_id:{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
});

// Defining the signals for the task advance options
advanceOptionSchema.pre('save',function(next){
    this.updatedAt(Date.now());
    next();
});

var Advance_Options = mongoose.model('Task_Advance_Options',advanceOptionSchema);
modules.exports = Advance_Options;