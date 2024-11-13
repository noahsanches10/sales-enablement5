import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:local.db",
});

export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      notes TEXT,
      priority TEXT NOT NULL,
      follow_up_date TEXT,
      stage TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

// Lead operations
export async function getLeads() {
  const result = await client.execute("SELECT * FROM leads ORDER BY created_at DESC");
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    notes: row.notes,
    priority: row.priority,
    followUpDate: row.follow_up_date,
    stage: row.stage,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function createLead(lead: any) {
  await client.execute({
    sql: `INSERT INTO leads (id, name, email, phone, address, notes, priority, follow_up_date, stage, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.address,
      lead.notes,
      lead.priority,
      lead.followUpDate,
      lead.stage,
      lead.createdAt,
      lead.updatedAt
    ]
  });
}

export async function updateLead(lead: any) {
  await client.execute({
    sql: `UPDATE leads 
          SET name = ?, email = ?, phone = ?, address = ?, notes = ?, 
              priority = ?, follow_up_date = ?, stage = ?, updated_at = ?
          WHERE id = ?`,
    args: [
      lead.name,
      lead.email,
      lead.phone,
      lead.address,
      lead.notes,
      lead.priority,
      lead.followUpDate,
      lead.stage,
      lead.updatedAt,
      lead.id
    ]
  });
}

export async function deleteLead(id: string) {
  await client.execute({
    sql: "DELETE FROM leads WHERE id = ?",
    args: [id]
  });
}

// Campaign operations
export async function getCampaigns() {
  const result = await client.execute("SELECT * FROM campaigns ORDER BY created_at DESC");
  return result.rows.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    subject: row.subject,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export async function createCampaign(campaign: any) {
  await client.execute({
    sql: `INSERT INTO campaigns (id, name, type, subject, content, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      campaign.id,
      campaign.name,
      campaign.type,
      campaign.subject,
      campaign.content,
      campaign.createdAt,
      campaign.updatedAt
    ]
  });
}

export async function updateCampaign(campaign: any) {
  await client.execute({
    sql: `UPDATE campaigns 
          SET name = ?, type = ?, subject = ?, content = ?, updated_at = ?
          WHERE id = ?`,
    args: [
      campaign.name,
      campaign.type,
      campaign.subject,
      campaign.content,
      campaign.updatedAt,
      campaign.id
    ]
  });
}

export async function deleteCampaign(id: string) {
  await client.execute({
    sql: "DELETE FROM campaigns WHERE id = ?",
    args: [id]
  });
}