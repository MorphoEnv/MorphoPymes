import { Project, IProject } from '../models/Project';
import { User } from '../models/User';

export interface CreateProjectData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  entrepreneurWallet: string;
  funding: any;
  category: string;
  location: string;
  businessModel?: string;
  marketSize?: string;
  competition?: string;
  images?: string[];
}

export class ProjectService {
  static async getProjectsByEntrepreneur(walletAddress: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) return { projects: [], total: 0, pages: 0 };
    const [projects, total] = await Promise.all([
      Project.find({ entrepreneur: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments({ entrepreneur: user._id })
    ]);
    return { projects, total, pages: Math.ceil(total / limit) };
  }

  static async getById(id: string) {
    // populate entrepreneur reference so frontend can render profile info
    let project = await Project.findById(id).populate({ path: 'entrepreneur', select: 'firstName lastName profileImage verified bio experience walletAddress' });
    if (!project) return null;

    // If populate didn't attach a full entrepreneur object (edge cases), load it explicitly
    const projObj: any = project.toObject ? project.toObject() : project;
    if (!projObj.entrepreneur || typeof projObj.entrepreneur === 'string') {
      try {
        const user = await User.findById(project.entrepreneur).select('firstName lastName profileImage verified bio experience walletAddress');
        if (user) {
          projObj.entrepreneur = user.toObject ? user.toObject() : user;
        }
      } catch (err) {
        // ignore lookup errors, return project as-is
      }
    }

    return projObj;
  }

  static async updateProject(id: string, updateData: any, requesterId?: string) {
    const project = await Project.findById(id);
    if (!project) return null;

    // If requesterId provided, ensure they own the project
    if (requesterId) {
      // project.entrepreneur is an ObjectId
      const ownerId = project.entrepreneur?.toString();
      if (ownerId !== String(requesterId)) {
        throw new Error('Not authorized to update this project');
      }
    }

    // Apply allowed updates
    const allowed = ['title','shortDescription','fullDescription','category','location','funding','milestones','images','businessModel','marketSize','competition','status','featured','sponsored','contractAddress'];
    for (const key of Object.keys(updateData)) {
      if (allowed.includes(key)) {
        // @ts-ignore
        project[key] = updateData[key];
      }
    }

    await project.save();
    return project;
  }

  static async createProject(data: CreateProjectData) {
    const user = await User.findOne({ walletAddress: data.entrepreneurWallet.toLowerCase() });
    if (!user) throw new Error('Entrepreneur user not found');

    // Normalize funding
    const fundingInput = data.funding || {};
    const target = Number(fundingInput.target) || 100;
    const minimumInvestment = Number(fundingInput.minimumInvestment) || 5;
    const repaymentDays = fundingInput.repaymentDays ? Number(fundingInput.repaymentDays) : undefined;

    const isDraft = !!(data as any).draft;

    const project = new Project({
      title: data.title || (isDraft ? 'Untitled Project' : ''),
      shortDescription: data.shortDescription || (isDraft ? 'Draft short description' : ''),
      fullDescription: data.fullDescription || (isDraft ? 'Draft full description' : ''),
      entrepreneur: user._id,
      funding: {
        target,
        raised: 0,
        percentage: 0,
        investors: 0,
        minimumInvestment,
        expectedROI: fundingInput.expectedROI || 'N/A',
        repaymentDays
      },
      milestones: Array.isArray((data as any).milestones) ? (data as any).milestones : [],
  category: data.category || 'other',
  location: data.location || (isDraft ? 'Unspecified' : 'Unknown'),
      businessModel: data.businessModel || '',
      marketSize: data.marketSize || '',
      competition: data.competition || '',
      images: data.images || [],
      status: (data as any).draft ? 'draft' : 'active',
      featured: false,
      sponsored: false,
    });

    await project.save();
    return project;
  }
}

export default ProjectService;
