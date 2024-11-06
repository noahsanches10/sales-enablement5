import { NextResponse } from "next/server";
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from "@/lib/db";

export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const campaign = await request.json();
    await createCampaign(campaign);
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const campaign = await request.json();
    await updateCampaign(campaign);
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteCampaign(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}