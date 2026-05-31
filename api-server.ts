import express from "express";
import nodemailer from "nodemailer";

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
    .filter(([k]) => !["type", "consent"].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 14px;font-weight:bold;background:#f8f6f2;border:1px solid #ddd;text-transform:capitalize;white-space:nowrap">${k.replace(/_/g, " ")}</td><td style="padding:8px 14px;border:1px solid #ddd">${v ?? "—"}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#1C2B4A;padding:24px;text-align:center">
      <h2 style="color:#C9A96E;margin:0;font-size:22px;letter-spacing:2px">AB RESIDENCIES</h2>
      <p style="color:#fff;margin:8px 0 0;font-size:13px;opacity:0.8">${subject}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${rows}</table>
    <div style="background:#f8f6f2;padding:16px;text-align:center;border-top:2px solid #C9A96E">
      <p style="color:#999;font-size:11px;margin:0">This lead was automatically captured from residenceabudhabi.com</p>
    </div>
  </div>`;
}

app.post("/api/submit-lead", async (req, res) => {
  const data = req.body || {};
  const typeMap: Record<string, string> = {
    general_consultation: "New Consultation Request",
    property_inquiry: "Property Inquiry",
    callback_request: "VIP Callback Request",
    interest_popup: "Interest Form (Popup)",
    contact_form: "Contact Form Submission",
  };
  const subject = typeMap[data.type] || "New Lead Submission";

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"AB Residencies Website" <${process.env.SMTP_USER}>`,
        to: RECIPIENT_EMAIL,
        subject: `[Lead] ${subject}`,
        html: buildEmailHtml(subject, data),
      });
    } else {
      console.log(`\n📧 [LEAD - ${subject}]`, JSON.stringify(data, null, 2));
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    res.json({ success: false, error: "Email failed" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = 3001;
app.listen(PORT, "localhost", () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
