"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/apiService";

type Milestone = {
  title: string;
  description: string;
  target: number;
  completed?: boolean;
  targetDate?: string | null;
};

type ServerMilestone = {
  title?: string;
  description?: string;
  target?: number;
  completed?: boolean;
  targetDate?: string | Date | null;
};

type ProjectData = {
  _id?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  category?: string;
  location?: string;
  businessModel?: string;
  marketSize?: string;
  competition?: string;
  contractAddress?: string;
  funding?: {
    target?: number;
    minimumInvestment?: number;
    expectedROI?: string;
    repaymentDays?: number;
  };
  status?: string;
  featured?: boolean;
  sponsored?: boolean;
  images?: string[];
  milestones?: ServerMilestone[];
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState<ProjectData | null>(null);

  // metadata
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [location, setLocation] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [marketSize, setMarketSize] = useState("");
  const [competition, setCompetition] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  // funding
  const [fundingTarget, setFundingTarget] = useState<number | ''>('');
  const [minimumInvestment, setMinimumInvestment] = useState<number | ''>('');
  const [expectedROI, setExpectedROI] = useState<string>("");
  const [repaymentDays, setRepaymentDays] = useState<number | ''>('');

  // flags
  const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'completed' | 'funded'>('draft');
  const [featured, setFeatured] = useState(false);
  const [sponsored, setSponsored] = useState(false);

  // images
  const [existingImages, setExistingImages] = useState<string[]>([]); // currently stored on project
  const [removedImages, setRemovedImages] = useState<Record<string, boolean>>({});
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    (async () => {
      const id = params.id as string;
      if (!id) return;
      try {
        const res = await apiService.getProjectById(id, token ?? undefined);
        if (res.success && res.data?.project) {
          const p = res.data.project;
          setProject(p);
          setTitle(p.title || '');
          setShortDescription(p.shortDescription || '');
          setFullDescription(p.fullDescription || '');
          setCategory(p.category || 'other');
          setLocation(p.location || '');
          setBusinessModel(p.businessModel || '');
          setMarketSize(p.marketSize || '');
          setCompetition(p.competition || '');
          setContractAddress(p.contractAddress || '');
          setFundingTarget(typeof p.funding?.target === 'number' ? p.funding.target : '');
          setMinimumInvestment(typeof p.funding?.minimumInvestment === 'number' ? p.funding.minimumInvestment : '');
          setExpectedROI(p.funding?.expectedROI || '');
          setRepaymentDays(typeof p.funding?.repaymentDays === 'number' ? p.funding.repaymentDays : '');
          setStatus(p.status || 'draft');
          setFeatured(!!p.featured);
          setSponsored(!!p.sponsored);
          setExistingImages(Array.isArray(p.images) ? (p.images as string[]) : []);
          setMilestones(Array.isArray(p.milestones) ? (p.milestones as ServerMilestone[]).map((m) => ({
            title: m.title || '',
            description: m.description || '',
            target: typeof m.target === 'number' ? m.target : 0,
            completed: !!m.completed,
            targetDate: m.targetDate ? new Date(m.targetDate as string).toISOString().slice(0,10) : null
          })) : []);
        }
      } catch (err) {
        console.error('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id, token]);

  useEffect(() => {
    // create previews for newly selected files
    const urls = newImageFiles.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newImageFiles]);

  const toggleRemoveExistingImage = (url: string) => {
    setRemovedImages((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const handleSelectNewImages = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewImageFiles((prev) => prev.concat(arr));
  };

  const removeNewImageFile = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Milestone helpers
  const addMilestone = () => {
    setMilestones((s) => s.concat({ title: '', description: '', target: 0 }));
  };
  const updateMilestone = (idx: number, field: keyof Milestone, value: string | number | boolean | null) => {
    setMilestones((s) => s.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };
  const removeMilestone = (idx: number) => {
    setMilestones((s) => s.filter((_, i) => i !== idx));
  };

  const validateForPublish = () => {
    const errors: string[] = [];
    if (!title.trim()) errors.push('Title is required');
    if (!shortDescription.trim()) errors.push('Short description is required');
    if (!fullDescription.trim()) errors.push('Full description is required');
    if (!location.trim()) errors.push('Location is required');
    if (!fundingTarget || Number(fundingTarget) <= 0) errors.push('Funding target must be set');
    if (!minimumInvestment || Number(minimumInvestment) <= 0) errors.push('Minimum investment must be set');
    return errors;
  };

  const handleSave = async (opts?: { publish?: boolean }) => {
    if (!project) return;
    setSaving(true);
    try {
      const publish = !!opts?.publish;

      if (publish) {
        const errs = validateForPublish();
        if (errs.length) {
          alert('Please fix: ' + errs.join(', '));
          setSaving(false);
          return;
        }
      }

      // upload new images first
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const up = await apiService.uploadProjectImages(newImageFiles, token ?? undefined);
        if (!up.success) {
          alert('Image upload failed');
          setSaving(false);
          return;
        }
        // support either { urls: [] } or { data: { urls } }
        uploadedUrls = up.urls || up.data?.urls || [];
      }

      const remainingExisting = existingImages.filter((u) => !removedImages[u]);
      const finalImages = remainingExisting.concat(uploadedUrls);

      const payload: any = {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        category,
        location: location.trim(),
        businessModel: businessModel.trim(),
        marketSize: marketSize.trim(),
        competition: competition.trim(),
        contractAddress: contractAddress.trim() || undefined,
        images: finalImages,
        milestones: milestones.map((m) => ({
          title: m.title,
          description: m.description,
          target: Number(m.target || 0),
          completed: !!m.completed,
          targetDate: m.targetDate || undefined
        })),
        funding: {
          target: Number(fundingTarget || 0),
          minimumInvestment: Number(minimumInvestment || 0),
          expectedROI: expectedROI || undefined,
          repaymentDays: repaymentDays ? Number(repaymentDays) : undefined
        },
        featured,
        sponsored,
        status: publish ? 'active' : status || 'draft'
      };

      // Remove undefined keys to avoid backend validation surprises
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      if (!project._id) {
        alert('Project id missing');
        setSaving(false);
        return;
      }
      const res = await apiService.updateProject(project._id, payload, token ?? undefined);
      if (res.success) {
        router.push('/dashboard');
      } else {
        console.error('Update failed', res);
        alert('Update failed: ' + (res.message || 'unknown'));
      }
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Error saving project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4">
          <label className="block">
            <div className="text-sm font-medium">Title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Short Description</div>
            <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Full Description</div>
            <textarea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full border px-3 py-2 rounded" rows={8} />
          </label>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <label>
            <div className="text-sm font-medium">Category</div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border px-3 py-2 rounded">
              <option value="other">Other</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="food">Food</option>
              <option value="fashion">Fashion</option>
              <option value="education">Education</option>
            </select>
          </label>

          <label>
            <div className="text-sm font-medium">Location</div>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Business Model</div>
            <input value={businessModel} onChange={(e) => setBusinessModel(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Market Size</div>
            <input value={marketSize} onChange={(e) => setMarketSize(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Competition</div>
            <input value={competition} onChange={(e) => setCompetition(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>

          <label>
            <div className="text-sm font-medium">Contract Address</div>
            <input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </label>
        </section>

        <section className="border-t pt-4">
          <h2 className="font-semibold mb-2">Funding</h2>
          <div className="grid grid-cols-2 gap-4">
            <label>
              <div className="text-sm font-medium">Funding Target (USD)</div>
              <input type="number" value={fundingTarget as any} onChange={(e) => setFundingTarget(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
            </label>
            <label>
              <div className="text-sm font-medium">Minimum Investment (USD)</div>
              <input type="number" value={minimumInvestment as any} onChange={(e) => setMinimumInvestment(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
            </label>
            <label>
              <div className="text-sm font-medium">Expected ROI (e.g. 10%)</div>
              <input value={expectedROI} onChange={(e) => setExpectedROI(e.target.value)} className="w-full border px-3 py-2 rounded" />
            </label>
            <label>
              <div className="text-sm font-medium">Repayment Time (days)</div>
              <input type="number" value={repaymentDays as any} onChange={(e) => setRepaymentDays(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border px-3 py-2 rounded" />
            </label>
          </div>
        </section>

        <section className="border-t pt-4">
          <h2 className="font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((url) => (
              <div key={url} className="border p-2 rounded relative">
                <img src={url} alt="project" className="w-full h-32 object-cover rounded" />
                <label className="absolute top-1 left-1 bg-white/80 px-2 py-1 text-xs rounded">
                  <input type="checkbox" checked={!!removedImages[url]} onChange={() => toggleRemoveExistingImage(url)} />{' '}
                  Remove
                </label>
              </div>
            ))}

            {previewUrls.map((p, i) => (
              <div key={p} className="border p-2 rounded relative">
                <img src={p} alt="preview" className="w-full h-32 object-cover rounded" />
                <button onClick={() => removeNewImageFile(i)} className="absolute top-1 right-1 bg-white/80 px-2 py-1 text-xs rounded">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <input type="file" multiple accept="image/*" onChange={(e) => handleSelectNewImages(e.target.files)} />
          </div>
        </section>

        <section className="border-t pt-4">
          <h2 className="font-semibold mb-2">Milestones</h2>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="border p-3 rounded">
                <div className="flex gap-2">
                  <input className="flex-1 border px-2 py-1" placeholder="Title" value={m.title} onChange={(e) => updateMilestone(idx, 'title', e.target.value)} />
                  <input type="number" className="w-32 border px-2 py-1" placeholder="Target USD" value={m.target as any} onChange={(e) => updateMilestone(idx, 'target', Number(e.target.value))} />
                </div>
                <textarea className="w-full border px-2 py-1 mt-2" placeholder="Description" value={m.description} onChange={(e) => updateMilestone(idx, 'description', e.target.value)} />
                <div className="flex gap-2 items-center mt-2">
                  <label className="text-sm"><input type="checkbox" checked={!!m.completed} onChange={(e) => updateMilestone(idx, 'completed', e.target.checked)} /> Completed</label>
                  <label className="text-sm">Target Date: <input type="date" value={m.targetDate || ''} onChange={(e) => updateMilestone(idx, 'targetDate', e.target.value)} className="border px-2 py-1" /></label>
                  <button onClick={() => removeMilestone(idx)} className="ml-auto text-sm text-red-600">Remove</button>
                </div>
              </div>
            ))}

            <div>
              <button onClick={addMilestone} className="px-3 py-1 border rounded">Add Milestone</button>
            </div>
          </div>
        </section>

        <section className="border-t pt-4 flex items-center gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} /> Sponsored</label>
          <label className="flex items-center gap-2">Status:
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="ml-2 border px-2 py-1 rounded">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="funded">Funded</option>
            </select>
          </label>
        </section>

        <div className="flex gap-3">
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={() => handleSave({ publish: false })} className="px-4 py-2 bg-gray-200 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save Draft'}</button>
          <button onClick={() => handleSave({ publish: true })} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Publish'}</button>
        </div>
      </div>
    </div>
  );
}
