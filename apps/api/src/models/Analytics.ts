import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  views: number;
  uniqueVisitors: number;
  investmentClicks: number;
  conversionRate: number;
  dailyViews: Map<string, number>;
  monthlyViews: Map<string, number>;
  topReferrers: string[];
  averageTimeOnPage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMarketingCampaign extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  type: 'featured' | 'email' | 'sponsored';
  title: string;
  description: string;
  cost: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectAnalyticsSchema: Schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
    min: 0
  },
  investmentClicks: {
    type: Number,
    default: 0,
    min: 0
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dailyViews: {
    type: Map,
    of: Number,
    default: new Map()
  },
  monthlyViews: {
    type: Map,
    of: Number,
    default: new Map()
  },
  topReferrers: [{
    type: String,
    trim: true
  }],
  averageTimeOnPage: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const MarketingCampaignSchema: Schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['featured', 'email', 'sponsored']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  conversions: {
    type: Number,
    default: 0,
    min: 0
  },
  roi: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

ProjectAnalyticsSchema.index({ project: 1 });
ProjectAnalyticsSchema.index({ lastUpdated: -1 });

MarketingCampaignSchema.index({ project: 1 });
MarketingCampaignSchema.index({ type: 1 });
MarketingCampaignSchema.index({ status: 1 });
MarketingCampaignSchema.index({ startDate: 1, endDate: 1 });

export const ProjectAnalytics = mongoose.model<IProjectAnalytics>('ProjectAnalytics', ProjectAnalyticsSchema);
export const MarketingCampaign = mongoose.model<IMarketingCampaign>('MarketingCampaign', MarketingCampaignSchema);