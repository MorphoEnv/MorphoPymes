import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestment extends Document {
  _id: mongoose.Types.ObjectId;
  investor: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  amount: number;
  transactionHash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  expectedROI: string;
  investmentDate: Date;
  returnsPaid: number;
  lastReturnDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema: Schema = new Schema({
  investor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 5
  },
  transactionHash: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'failed', 'refunded'],
    default: 'pending'
  },
  expectedROI: {
    type: String,
    required: true,
    trim: true
  },
  investmentDate: {
    type: Date,
    default: Date.now
  },
  returnsPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  lastReturnDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

InvestmentSchema.virtual('investor_details', {
  ref: 'User',
  localField: 'investor',
  foreignField: '_id',
  justOne: true
});

InvestmentSchema.virtual('project_details', {
  ref: 'Project',
  localField: 'project',
  foreignField: '_id',
  justOne: true
});

InvestmentSchema.index({ investor: 1 });
InvestmentSchema.index({ project: 1 });
InvestmentSchema.index({ status: 1 });
InvestmentSchema.index({ investmentDate: -1 });
InvestmentSchema.index({ investor: 1, project: 1 }, { unique: true });

export const Investment = mongoose.model<IInvestment>('Investment', InvestmentSchema);