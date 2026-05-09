import { collection, doc, setDoc, getDocs, updateDoc, query, where, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Sponsor, SponsorshipDeal, AffiliateLink, RevenueRecord } from "../../types";

export async function createSponsor(workspaceId: string, channelId: string, data: Partial<Sponsor>): Promise<Sponsor> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/sponsors`);
    const newRef = doc(coll);
    const sponsor: Sponsor = {
        id: newRef.id,
        workspaceId,
        channelId,
        name: data.name || "Unknown",
        industry: data.industry || "",
        brandFitScore: data.brandFitScore || 50,
        contactEmail: data.contactEmail || "",
        notes: data.notes || "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await setDoc(newRef, sponsor);
    return sponsor;
}

export async function getSponsors(workspaceId: string, channelId: string): Promise<Sponsor[]> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/sponsors`);
    const q = query(coll);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as Sponsor);
}

export async function createSponsorshipDeal(workspaceId: string, channelId: string, data: Partial<SponsorshipDeal>): Promise<SponsorshipDeal> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/sponsorship_deals`);
    const newRef = doc(coll);
    const deal: SponsorshipDeal = {
        id: newRef.id,
        workspaceId,
        channelId,
        sponsorId: data.sponsorId!,
        projectId: data.projectId,
        status: data.status || "PROSPECT",
        amount: data.amount || 0,
        deliverables: data.deliverables || "",
        dueDate: data.dueDate || null,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await setDoc(newRef, deal);
    return deal;
}

export async function getSponsorshipDeals(workspaceId: string, channelId: string): Promise<SponsorshipDeal[]> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/sponsorship_deals`);
    const q = query(coll);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as SponsorshipDeal);
}

export async function updateSponsorshipDeal(workspaceId: string, channelId: string, dealId: string, updates: Partial<SponsorshipDeal>): Promise<void> {
    const ref = doc(db, `workspaces/${workspaceId}/channels/${channelId}/sponsorship_deals`, dealId);
    await updateDoc(ref, {
        ...updates,
        updatedAt: Date.now()
    });
}

export async function createAffiliateLink(workspaceId: string, channelId: string, data: Partial<AffiliateLink>): Promise<AffiliateLink> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/affiliate_links`);
    const newRef = doc(coll);
    const link: AffiliateLink = {
        id: newRef.id,
        workspaceId,
        channelId,
        productName: data.productName || "Unknown Product",
        url: data.url || "",
        category: data.category || "General",
        commissionRate: data.commissionRate || "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    await setDoc(newRef, link);
    return link;
}

export async function getAffiliateLinks(workspaceId: string, channelId: string): Promise<AffiliateLink[]> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/affiliate_links`);
    const q = query(coll);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as AffiliateLink);
}

export async function createRevenueRecord(workspaceId: string, channelId: string, projectId: string, data: Partial<RevenueRecord>): Promise<RevenueRecord> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/revenue_records`);
    const newRef = doc(coll);
    const record: RevenueRecord = {
        id: newRef.id,
        workspaceId,
        channelId,
        projectId,
        revenueType: data.revenueType || "ADSENSE",
        amount: data.amount || 0,
        recordedAt: data.recordedAt || Date.now(),
        createdAt: Date.now(),
    };
    await setDoc(newRef, record);
    return record;
}

export async function getRevenueRecordsForProject(workspaceId: string, channelId: string, projectId: string): Promise<RevenueRecord[]> {
    const coll = collection(db, `workspaces/${workspaceId}/channels/${channelId}/projects/${projectId}/revenue_records`);
    const q = query(coll);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as RevenueRecord);
}
