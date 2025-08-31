import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone {
  title: string;
  description: string;
  target: number;
  completed: boolean;
  completedDate?: Date;
  targetDate?: Date;
}

export interface IFunding {
  target: number;
  raised: number;
  percentage: number;
  investors: number;
  minimumInvestment: number;
  expectedROI?: string;
  repaymentDays?: number;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  entrepreneur: mongoose.Types.ObjectId;
  funding: IFunding;
  milestones: IMilestone[];
  category: string;
  location: string;
  businessModel: string;
  marketSize: string;
  competition: string;
  images: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'funded';
  featured: boolean;
  sponsored: boolean;
  contractAddress?: string;
  views: number;
  lastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: Number,
    required: true,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  targetDate: {
    type: Date
  }
}, { _id: false });

const FundingSchema: Schema = new Schema({
  target: {
    type: Number,
    required: true,
    min: 100,
    max: 1000
  },
  raised: {
    type: Number,
    default: 0,
    min: 0
  },
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  investors: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumInvestment: {
    type: Number,
    required: true,
    min: 5,
    max: 100
  },
  expectedROI: {
  type: String,
  required: false,
  trim: true,
  default: 'N/A'
  }
}, { _id: false });

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  fullDescription: {
    type: String,
    required: true,
    trim: true
  },
  entrepreneur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  funding: {
    type: FundingSchema,
    required: true
  },
  milestones: [MilestoneSchema],
  category: {
  type: String,
  required: false,
  enum: ['technology', 'healthcare', 'food', 'fashion', 'education', 'other'],
  default: 'other'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  businessModel: {
    type: String,
    trim: true
  },
  marketSize: {
    type: String,
    trim: true
  },
  competition: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: true,
    enum: ['draft', 'active', 'paused', 'completed', 'funded'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  sponsored: {
    type: Boolean,
    default: false
  },
  contractAddress: {
    type: String,
    trim: true,
    lowercase: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ProjectSchema.virtual('entrepreneur_details', {
  ref: 'User',
  localField: 'entrepreneur',
  foreignField: '_id',
  justOne: true
});

ProjectSchema.index({ entrepreneur: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: 1 });
ProjectSchema.index({ sponsored: 1 });
ProjectSchema.index({ 'funding.target': 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);