"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Posts ---
export async function getPosts() {
  return await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
}
export async function getPost(id: string) {
  return await prisma.post.findUnique({ where: { id } });
}
export async function createPost(data: any) {
  const post = await prisma.post.create({ data });
  revalidatePath("/");
  return post;
}
export async function updatePost(id: string, data: any) {
  const post = await prisma.post.update({ where: { id }, data });
  revalidatePath("/");
  return post;
}
export async function deletePost(id: string) {
  const post = await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  return post;
}

// --- Settings ---
export async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {} as Record<string, string>);
}
export async function updateSetting(key: string, value: string, description?: string) {
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description },
  });
  revalidatePath("/");
  return setting;
}

// --- Priests ---
export async function getPriests() {
  return await prisma.priest.findMany({ orderBy: { order: "asc" } });
}
export async function createPriest(data: any) {
  const item = await prisma.priest.create({ data });
  revalidatePath("/");
  return item;
}
export async function updatePriest(id: string, data: any) {
  const item = await prisma.priest.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deletePriest(id: string) {
  const item = await prisma.priest.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Services ---
export async function getServices() {
  return await prisma.service.findMany({ orderBy: { order: "asc" } });
}
export async function createService(data: any) {
  const item = await prisma.service.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateService(id: string, data: any) {
  const item = await prisma.service.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteService(id: string) {
  const item = await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Activities ---
export async function getActivities() {
  return await prisma.activity.findMany({ orderBy: { order: "asc" } });
}
export async function createActivity(data: any) {
  const item = await prisma.activity.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateActivity(id: string, data: any) {
  const item = await prisma.activity.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteActivity(id: string) {
  const item = await prisma.activity.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Videos ---
export async function getVideos() {
  return await prisma.video.findMany({ orderBy: { order: "asc" } });
}
export async function createVideo(data: any) {
  const item = await prisma.video.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateVideo(id: string, data: any) {
  const item = await prisma.video.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteVideo(id: string) {
  const item = await prisma.video.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Zones ---
export async function getZones() {
  return await prisma.zone.findMany({ orderBy: { order: 'asc' } });
}
export async function createZone(data: any) {
  const item = await prisma.zone.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateZone(id: string, data: any) {
  const item = await prisma.zone.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteZone(id: string) {
  const item = await prisma.zone.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Organizations (Đoàn Thể) ---
export async function getOrganizations() {
  return await prisma.organization.findMany({ orderBy: { order: 'asc' } });
}
export async function createOrganization(data: any) {
  const item = await prisma.organization.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateOrganization(id: string, data: any) {
  const item = await prisma.organization.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteOrganization(id: string) {
  const item = await prisma.organization.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Gallery Items ---
export async function getGalleryItems() {
  return await prisma.galleryItem.findMany({ orderBy: { order: 'asc' } });
}
export async function createGalleryItem(data: any) {
  const item = await prisma.galleryItem.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateGalleryItem(id: string, data: any) {
  const item = await prisma.galleryItem.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteGalleryItem(id: string) {
  const item = await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/");
  return item;
}

// --- Council Members ---
export async function getCouncilMembers() {
  return await prisma.councilMember.findMany({ orderBy: { order: 'asc' } });
}
export async function createCouncilMember(data: any) {
  const item = await prisma.councilMember.create({ data });
  revalidatePath("/");
  return item;
}
export async function updateCouncilMember(id: string, data: any) {
  const item = await prisma.councilMember.update({ where: { id }, data });
  revalidatePath("/");
  return item;
}
export async function deleteCouncilMember(id: string) {
  const item = await prisma.councilMember.delete({ where: { id } });
  revalidatePath("/");
  return item;
}
