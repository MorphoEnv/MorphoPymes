import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  walletAddress: string;
  profileImage?: string;
  description?: string;
  userType: 'entrepreneur' | 'investor';
  verified: boolean;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  verificationExpires?: Date;
  ensName?: string;
  linkedin?: string;
  experience?: string;
  bio?: string;
  emailNotifications: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  profileImage: {
    type: String,
    default: '/default-avatar.svg'
  },
  description: {
    type: String,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['entrepreneur', 'investor']
  },
  verified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    trim: true,
    sparse: true
  },
  verificationExpires: {
    type: Date,
  },
  ensName: {
    type: String,
    trim: true,
    lowercase: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.index({ walletAddress: 1 });
UserSchema.index({ ensName: 1 });
UserSchema.index({ userType: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);