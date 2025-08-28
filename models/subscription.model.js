import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
  name: {type: String,
     required: [    true, 'Subscritpion  is required'],
     trim: true,
     minLength: 2,
     MaxLength: 100
    },
    price: {type: Number,
         required: [ true, 'Price is required'],
         min: [0, 'Price must be greater than 0']
        },
     currency: {type: String,
         required: [ true, 'Currency is required'],
         trim: true,
         enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD','BAM'],
         default: 'USD',
        }, 
       frequency: {type: String,
         required: [ true, 'Frequency is required'],
         trim: true,
         enum: ['monthly', 'yearly', 'weekly', 'daily', 'one-time'],
         default: 'monthly',
        },
        category: {type: String,
         required: [ true, 'Category is required'],
         trim: true,
         enum: ['entertainment', 'education', 'productivity', 'health', 'fitness', 'news', 'music', 'other'],
         default: 'other',
        },
        paymentMethod: {type: String,
         required: [ true, 'Payment method is required'],
         trim: true,
         enum: ['credit card', 'debit card', 'paypal', 'bank transfer', 'crypto', 'other'],
         default: 'credit card',
        },
        status: {type: String,
         required: [ true, 'Status is required'],
         trim: true,
         enum: ['active', 'inactive', 'canceled', 'paused','expired'],
         default: 'active',
        },
        startDate: {type: Date,
         required: [ true, 'Start date is required'],
         validate : {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'Start date cannot be in the future'
         },
         default: Date.now,
        },
        renewalDate: {type: Date,
         required: [ true, 'Renewal date is required'],
         validate : {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
         },
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [ true, 'User is required'],
            index: true,
        }

  },{timestamps: true})


  // Autocalculate renewalDate if missing
  subscriptionSchema.pre('save', function(next) {
    if (!this.renewalDate){
        const renewalPeriods = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365,
            'one-time': 0
        };


        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if(this.renewalDate < new Date()){
        this.status= 'expired';
    }
    next();
  });


  const Subscription = mongoose.model('Subscription', subscriptionSchema);

  export default Subscription;