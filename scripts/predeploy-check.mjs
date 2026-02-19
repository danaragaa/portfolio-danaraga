const requiredVars = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];
const recommendedVars = ["SITE_URL", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];

const missingRequired = requiredVars.filter((key) => !process.env[key]?.trim());
const missingRecommended = recommendedVars.filter((key) => !process.env[key]?.trim());

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function extractSenderEmail(fromValue) {
  const angleMatch = fromValue.match(/<([^>]+)>/);
  if (angleMatch?.[1]) {
    return angleMatch[1].trim();
  }

  return fromValue.trim();
}

const warnings = [];

if (process.env.CONTACT_TO_EMAIL && !isValidEmail(process.env.CONTACT_TO_EMAIL)) {
  warnings.push("CONTACT_TO_EMAIL format terlihat tidak valid.");
}

if (process.env.CONTACT_FROM_EMAIL) {
  const senderEmail = extractSenderEmail(process.env.CONTACT_FROM_EMAIL);
  if (!isValidEmail(senderEmail)) {
    warnings.push("CONTACT_FROM_EMAIL format terlihat tidak valid.");
  }
}

if (process.env.SITE_URL) {
  const siteUrl = process.env.SITE_URL.trim();
  if (!siteUrl.startsWith("https://")) {
    warnings.push("SITE_URL sebaiknya menggunakan https:// untuk production.");
  }
}

if (missingRequired.length > 0) {
  console.error("❌ Predeploy check gagal: env wajib belum lengkap.");
  missingRequired.forEach((key) => console.error(`   - ${key}`));
  process.exit(1);
}

console.log("✅ Env wajib tersedia.");

if (missingRecommended.length > 0) {
  console.warn("⚠️ Env recommended belum diisi (masih bisa deploy, tapi kurang ideal):");
  missingRecommended.forEach((key) => console.warn(`   - ${key}`));
}

if (warnings.length > 0) {
  console.warn("⚠️ Catatan validasi:");
  warnings.forEach((message) => console.warn(`   - ${message}`));
}

console.log("✅ Predeploy env check selesai.");
