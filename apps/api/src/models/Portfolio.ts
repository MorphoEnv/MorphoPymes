import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioItem {
  project: mongoose.Types.ObjectId;
  totalInvested: number;
  currentValue: number;
  returnPercentage: number;
  lastUpdated: Date;
}

export interface IPortfolio extends Document {
  _id: mongoose.Types.ObjectId;
  investor: mongoose.Types.ObjectId;
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  totalReturnPercentage: number;
  activeInvestments: number;
  investments: IPortfolioItem[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  totalInvested: {
    type: Number,
    required: true,
    min: 0
  },
  currentValue: {
    type: Number,
    required: true,
    min: 0
  },
  returnPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const PortfolioSchema: Schema = new Schema({
  investor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalInvested: {
    type: Number,
    default: 0,
    min: 0
  },
  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },
  totalReturns: {
    type: Number,
    default: 0
  },
  totalReturnPercentage: {
    type: Number,
    default: 0
  },
  activeInvestments: {
    type: Number,
    default: 0,
    min: 0
  },
  investments: [PortfolioItemSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PortfolioSchema.virtual('investor_details', {
  ref: 'User',
  localField: 'investor',
  foreignField: '_id',
  justOne: true
});

PortfolioSchema.index({ investor: 1 });
PortfolioSchema.index({ totalReturnPercentage: -1 });

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);