import "server-only";
import { EVENT } from "@/lib/event-config";

export type ConfirmationEmailData = {
  registrationNumber: string;
  fullName: string;
  email: string;
  registrationDate: Date;
};

const FACEBOOK_URL = "https://www.facebook.com/people/APRRC-2027-Cebu-Philippines/61589701801721/";

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Table-based HTML email (inline styles, MSO conditionals) for maximum email
// client compatibility. Design provided by the user; only the bracketed
// placeholders were wired to real data.
export function confirmationEmailHtml(data: ConfirmationEmailData): string {
  const logoUrl = `${EVENT.siteUrl}/images/email/rotaract-logo.png`;
  const registrationDate = data.registrationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Welcome to ${EVENT.name}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<style>
table { border-collapse: collapse; }
td, th { mso-line-height-rule: exactly; }
</style>
<![endif]-->
<style>
  body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  a { text-decoration: none; }
  @media only screen and (max-width: 600px) {
    .email-wrapper { width: 100% !important; }
    .stack-col { display: block !important; width: 100% !important; }
    .px-24 { padding-left: 20px !important; padding-right: 20px !important; }
    .hero-h1 { font-size: 26px !important; line-height: 32px !important; }
    .info-value { padding-bottom: 14px !important; }
    .cta-btn { width: 100% !important; }
    .cta-btn a { display: block !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f2ef; font-family:Arial, Helvetica, sans-serif;">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f4f2ef;">
  Your ${EVENT.name} registration is confirmed — see you in ${EVENT.city}, ${EVENT.country}, ${EVENT.dateLabel}.
</div>

<center style="width:100%; background-color:#f4f2ef;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="padding:24px 12px;">

<table role="presentation" class="email-wrapper" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px; max-width:640px; background-color:#ffffff;">

<!-- 4-color brand stripe -->
<tr>
  <td style="padding:0; line-height:0; font-size:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="25%" style="background-color:#2E8B3D; height:6px; line-height:6px; font-size:6px;">&nbsp;</td>
      <td width="25%" style="background-color:#F6B31C; height:6px; line-height:6px; font-size:6px;">&nbsp;</td>
      <td width="25%" style="background-color:#1D6FC4; height:6px; line-height:6px; font-size:6px;">&nbsp;</td>
      <td width="25%" style="background-color:#C1272D; height:6px; line-height:6px; font-size:6px;">&nbsp;</td>
    </tr></table>
  </td>
</tr>

<!-- Header -->
<tr>
  <td class="px-24" style="padding:32px 40px 24px 40px; background-color:#ffffff;" align="center">
    <img src="${logoUrl}" width="72" height="72" alt="Rotaract logo" style="display:block; margin:0 auto 14px auto; width:72px; height:72px; border-radius:12px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:bold; letter-spacing:0.5px;">
        <span style="color:#2E8B3D;">APRRC</span><span style="color:#F6B31C;"> </span><span style="color:#1D6FC4;">'27</span>
      </td>
    </tr></table>
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#6b6560; letter-spacing:1.5px; text-transform:uppercase; margin-top:4px;">
      ${esc(EVENT.city)} &bull; ${esc(EVENT.country)}
    </div>
  </td>
</tr>

<!-- Hero / success -->
<tr>
  <td class="px-24" style="padding:8px 40px 32px 40px; background-color:#ffffff;" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="52" height="52" align="center" valign="middle" bgcolor="#2E8B3D" style="border-radius:26px; width:52px; height:52px; font-family:Arial, Helvetica, sans-serif; font-size:26px; color:#ffffff; font-weight:bold;">&#10003;</td>
    </tr></table>
    <h1 class="hero-h1" style="margin:20px 0 12px 0; font-family:Arial, Helvetica, sans-serif; font-size:30px; line-height:36px; color:#1a1a1a; font-weight:bold;">
      Welcome to ${EVENT.name}!
    </h1>
    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:24px; color:#514c47; max-width:460px;">
      Your registration has been successfully confirmed. We look forward to welcoming you to ${esc(EVENT.city)}, ${esc(EVENT.country)} for ${EVENT.name}.
    </p>
  </td>
</tr>

<!-- Event info card -->
<tr>
  <td class="px-24" style="padding:0 40px 32px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F5F1; border-radius:14px;">
      <tr>
        <td style="padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td>
              <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#8a8378; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:6px;">${esc(EVENT.fullName)}</div>
              <div style="font-family:Arial, Helvetica, sans-serif; font-size:22px; color:#1a1a1a; font-weight:bold; margin-bottom:2px;">${EVENT.name}</div>
              <div style="font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#514c47;">${esc(EVENT.city)}, ${esc(EVENT.country)}</div>
            </td>
          </tr></table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
            <tr>
              <td style="padding:10px 0; border-top:1px solid #e6e2db; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;">
                <span style="color:#1D6FC4;">&#128205;</span>&nbsp; ${esc(EVENT.venue)}, ${esc(EVENT.city)}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0; border-top:1px solid #e6e2db; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;">
                <span style="color:#F6B31C;">&#128197;</span>&nbsp; ${EVENT.dateLabel}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0; border-top:1px solid #e6e2db; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#2E8B3D; font-weight:bold;">
                <span>&#127915;</span>&nbsp; Registration: Confirmed
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- Registration confirmation details -->
<tr>
  <td class="px-24" style="padding:0 40px 8px 40px;">
    <h2 style="margin:0 0 6px 0; font-family:Arial, Helvetica, sans-serif; font-size:19px; color:#1a1a1a; font-weight:bold;">Registration Confirmed</h2>
    <p style="margin:0 0 20px 0; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:21px; color:#6b6560;">
      Thank you for registering for ${EVENT.name}. Your registration has been successfully received and confirmed.
    </p>
  </td>
</tr>
<tr>
  <td class="px-24" style="padding:0 40px 32px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e6e2db; border-radius:12px;">
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td class="stack-col info-value" width="50%" valign="top" style="padding:0 12px 20px 0; font-family:Arial, Helvetica, sans-serif;">
                <div style="font-size:11px; color:#8a8378; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Registration ID</div>
                <div style="font-size:15px; color:#1a1a1a; font-weight:bold;">${esc(data.registrationNumber)}</div>
              </td>
              <td class="stack-col info-value" width="50%" valign="top" style="padding:0 0 20px 0; font-family:Arial, Helvetica, sans-serif;">
                <div style="font-size:11px; color:#8a8378; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Name</div>
                <div style="font-size:15px; color:#1a1a1a; font-weight:bold;">${esc(data.fullName)}</div>
              </td>
            </tr>
            <tr>
              <td class="stack-col info-value" width="50%" valign="top" style="padding:0 12px 20px 0; font-family:Arial, Helvetica, sans-serif;">
                <div style="font-size:11px; color:#8a8378; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Email</div>
                <div style="font-size:15px; color:#1a1a1a; font-weight:bold;">${esc(data.email)}</div>
              </td>
              <td class="stack-col info-value" width="50%" valign="top" style="padding:0 0 20px 0; font-family:Arial, Helvetica, sans-serif;">
                <div style="font-size:11px; color:#8a8378; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Registration Type</div>
                <div style="font-size:15px; color:#1a1a1a; font-weight:bold;">${EVENT.name} Delegate</div>
              </td>
            </tr>
            <tr>
              <td class="stack-col" width="50%" valign="top" style="padding:0 12px 0 0; font-family:Arial, Helvetica, sans-serif;">
                <div style="font-size:11px; color:#8a8378; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Registration Date</div>
                <div style="font-size:15px; color:#1a1a1a; font-weight:bold;">${registrationDate}</div>
              </td>
              <td class="stack-col" width="50%" valign="top">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- CTA -->
<tr>
  <td class="px-24" style="padding:0 40px 12px 40px;" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="cta-btn"><tr>
      <td align="center" bgcolor="#C1272D" style="border-radius:10px;">
        <a href="${EVENT.siteUrl}" style="display:inline-block; padding:16px 40px; font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:bold; color:#ffffff; border-radius:10px;">View My Registration</a>
      </td>
    </tr></table>
  </td>
</tr>
<tr>
  <td style="padding:14px 40px 36px 40px;" align="center">
    <a href="${EVENT.siteUrl}" style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#1D6FC4; font-weight:bold;">Visit ${EVENT.name} Website &rarr;</a>
  </td>
</tr>

<!-- What's next -->
<tr>
  <td style="padding:0; line-height:0; font-size:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #e6e2db; height:1px; line-height:1px; font-size:1px;">&nbsp;</td></tr></table></td>
</tr>
<tr>
  <td class="px-24" style="padding:32px 40px 8px 40px;">
    <h2 style="margin:0 0 16px 0; font-family:Arial, Helvetica, sans-serif; font-size:19px; color:#1a1a1a; font-weight:bold;">What's Next?</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:6px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;"><span style="color:#2E8B3D; font-weight:bold;">&#10003;</span>&nbsp; Your registration has been confirmed</td></tr>
      <tr><td style="padding:6px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;"><span style="color:#2E8B3D; font-weight:bold;">&#10003;</span>&nbsp; Keep your Registration ID for your records</td></tr>
      <tr><td style="padding:6px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;"><span style="color:#2E8B3D; font-weight:bold;">&#10003;</span>&nbsp; Watch your email for event updates and announcements</td></tr>
      <tr><td style="padding:6px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333;"><span style="color:#2E8B3D; font-weight:bold;">&#10003;</span>&nbsp; Check the ${EVENT.name} website for program and event information</td></tr>
    </table>
  </td>
</tr>

<!-- Cebu welcome -->
<tr>
  <td class="px-24" style="padding:32px 40px 36px 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1D6FC4; border-radius:14px;">
      <tr>
        <td style="padding:28px 32px;" align="center">
          <div style="font-family:Arial, Helvetica, sans-serif; font-size:20px; color:#ffffff; font-weight:bold; margin-bottom:8px;">See You in ${esc(EVENT.city)}!</div>
          <div style="font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:22px; color:#e7f0fb; max-width:440px;">
            We're excited to welcome Rotaractors from across the Asia Pacific to ${esc(EVENT.city)}, ${esc(EVENT.country)} for ${EVENT.name}.
          </div>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- Footer -->
<tr>
  <td style="padding:0; line-height:0; font-size:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #e6e2db; height:1px; line-height:1px; font-size:1px;">&nbsp;</td></tr></table></td>
</tr>
<tr>
  <td class="px-24" style="padding:28px 40px 32px 40px; background-color:#F7F5F1;" align="center">
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#1a1a1a; font-weight:bold; margin-bottom:2px;">${EVENT.name}</div>
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#8a8378; margin-bottom:14px;">${esc(EVENT.city)}, ${esc(EVENT.country)}</div>
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#514c47; line-height:20px; margin-bottom:14px;">
      Website: <a href="${EVENT.siteUrl}" style="color:#1D6FC4;">${EVENT.siteUrl.replace(/^https?:\/\//, "")}</a><br>
      Email: <a href="mailto:${EVENT.contactEmail}" style="color:#1D6FC4;">${EVENT.contactEmail}</a>
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td>
        <a href="${FACEBOOK_URL}" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#1D6FC4; font-weight:bold;">Facebook</a>
      </td>
    </tr></table>
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#a39d92; margin-top:18px;">
      &copy; 2027 ${EVENT.name}. All rights reserved.
    </div>
    <div style="font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#c2bcb0; margin-top:10px;">
      You're receiving this email because you registered for ${EVENT.name}.
    </div>
  </td>
</tr>

</table>
</td></tr>
</table>
</center>
</body>
</html>
`;
}
