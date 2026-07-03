import express from "express";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const RECIPIENT_EMAIL = "pranav@residenceabudhabi.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

function buildEmailHtml(subject: string, data: Record<string, any>): string {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "type")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:bold;background:#f5f5f5;border:1px solid #ddd;text-transform:capitalize">${k.replace(/_/g, " ")}</td><td style="padding:6px 12px;border:1px solid #ddd">${v ?? "—"}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#1C2B4A;padding:24px;text-align:center">
      <h2 style="color:#C9A96E;margin:0;font-size:20px">Residence Abudhabi</h2>
      <p style="color:#fff;margin:8px 0 0;font-size:13px">${subject}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}</table>
    <p style="color:#999;font-size:11px;text-align:center">This email was automatically generated from residenceabudhabi.com</p>
  </div>`;
}

app.post("/api/submit-lead", async (req, res) => {
  const data = req.body;
  const typeMap: Record<string, string> = {
    general_consultation: "New Consultation Request",
    property_inquiry: "Property Enquiry",
    callback_request: "VIP Callback Request",
    interest_popup: "Interest Form Submission",
    contact_form: "Contact Form Submission",
  };
  const subject = typeMap[data.type] || "New Lead Submission";

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"Residence Abudhabi Website" <${process.env.SMTP_USER}>`,
        to: RECIPIENT_EMAIL,
        subject: `[RAD] ${subject}`,
        html: buildEmailHtml(subject, data),
      });
    } else {
      console.log(`[LEAD - ${subject}]`, JSON.stringify(data, null, 2));
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.json({ success: false, error: "Email failed" });
  }
});

const PORT = 5000;

const vite = await createViteServer({
  server: { middlewareMode: true, hmr: true },
  appType: "spa",
});

app.use(vite.middlewares);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Residence Abudhabi server running on port ${PORT}`);
});
