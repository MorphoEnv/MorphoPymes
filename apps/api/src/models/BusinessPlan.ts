import mongoose, { Document, Schema } from 'mongoose';

export interface IFinancialProjection {
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  cashFlow: number;
}

export interface IBusinessPlan extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  executiveSummary: string;
  marketAnalysis: string;
  financialProjections: IFinancialProjection[];
  marketingStrategy: string;
  riskAssessment: string;
  teamInfo: string;
  competitiveAnalysis: string;
  revenueModel: string;
  operationalPlan: string;
  documents: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialProjectionSchema: Schema = new Schema({
  year: {
    type: Number,
    required: true,
    min: 2024,
    max: 2030
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  },
  expenses: {
    type: Number,
    required: true,
    min: 0
  },
  netIncome: {
    type: Number,
    required: true
  },
  cashFlow: {
    type: Number,
    required: true
  }
}, { _id: false });

const BusinessPlanSchema: Schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  executiveSummary: {
    type: String,
    required: true,
    trim: true
  },
  marketAnalysis: {
    type: String,
    required: true,
    trim: true
  },
  financialProjections: [FinancialProjectionSchema],
  marketingStrategy: {
    type: String,
    required: true,
    trim: true
  },
  riskAssessment: {
    type: String,
    required: true,
    trim: true
  },
  teamInfo: {
    type: String,
    trim: true
  },
  competitiveAnalysis: {
    type: String,
    trim: true
  },
  revenueModel: {
    type: String,
    required: true,
    trim: true
  },
  operationalPlan: {
    type: String,
    trim: true
  },
  documents: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    required: true,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  reviewNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BusinessPlanSchema.virtual('project_details', {
  ref: 'Project',
  localField: 'project',
  foreignField: '_id',
  justOne: true
});

BusinessPlanSchema.virtual('reviewer_details', {
  ref: 'User',
  localField: 'reviewedBy',
  foreignField: '_id',
  justOne: true
});

BusinessPlanSchema.index({ project: 1 });
BusinessPlanSchema.index({ status: 1 });
BusinessPlanSchema.index({ reviewedAt: -1 });

export const BusinessPlan = mongoose.model<IBusinessPlan>('BusinessPlan', BusinessPlanSchema);