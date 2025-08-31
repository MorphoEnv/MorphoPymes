import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: 'investment' | 'milestone' | 'project_update' | 'marketing' | 'system';
  title: string;
  message: string;
  relatedProject?: mongoose.Types.ObjectId;
  relatedInvestment?: mongoose.Types.ObjectId;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['investment', 'milestone', 'project_update', 'marketing', 'system']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  relatedProject: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  relatedInvestment: {
    type: Schema.Types.ObjectId,
    ref: 'Investment'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

NotificationSchema.virtual('recipient_details', {
  ref: 'User',
  localField: 'recipient',
  foreignField: '_id',
  justOne: true
});

NotificationSchema.virtual('project_details', {
  ref: 'Project',
  localField: 'relatedProject',
  foreignField: '_id',
  justOne: true
});

NotificationSchema.index({ recipient: 1 });
NotificationSchema.index({ read: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);