import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface WelcomeEmailProps {
  email: string;
  name?: string;
}

const generateWelcomeEmail = (name?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Docked.Pro</title>
  <style>
    body { background-color: #050505; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { background-color: #050505; width: 100%; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 0 20px; }
    
    /* Header with background */
    .header-box { background-color: #0A0A0A; padding: 30px; text-align: center; border-bottom: 1px solid #1a1a1a; border-radius: 4px 4px 0 0; }
    .logo { font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #ffffff; text-decoration: none; }
    .dot { color: #D4AF37; }
    
    .card { background-color: #000000; border: 1px solid #1a1a1a; border-top: none; padding: 40px; border-radius: 0 0 4px 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    
    .title { color: #D4AF37; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; display: block; font-weight: 700; opacity: 0.9; }
    .heading { font-size: 32px; font-weight: 300; margin: 0 0 24px 0; letter-spacing: -0.5px; line-height: 1.2; color: #cccccc; }
    .heading-highlight { color: #ffffff; }
    .text { color: #888888; font-size: 15px; line-height: 1.7; margin-bottom: 24px; font-weight: 300; }
    
    .btn-container { text-align: start; margin-top: 32px; margin-bottom: 40px; }
    .btn { display: inline-block; background-color: #D4AF37; color: #000000; padding: 16px 32px; text-decoration: none; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; transition: background 0.3s ease; }
    .btn:hover { background-color: #F8D875; }
    
    .divider { height: 1px; background-color: #151515; margin: 40px 0; }
    
    /* Feature Grid */
    .feature-grid { display: table; width: 100%; margin-bottom: 30px; }
    .feature-row { display: table-row; }
    .feature-cell { display: table-cell; padding-bottom: 24px; vertical-align: top; width: 50%; padding-right: 16px; }
    .feature-title { color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
    .feature-desc { color: #666; font-size: 13px; line-height: 1.5; }
    
    /* Founder Section */
    .founder-note { background-color: #0A0A0A; border: 1px solid #1a1a1a; padding: 32px; margin-top: 40px; position: relative; }
    .founder-quote { font-family: 'Georgia', serif; font-style: italic; color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .signature-area { margin-top: 24px; }
    .signature-img { height: 80px; opacity: 0.8; display: block; margin-bottom: 12px; }
    .founder-name { color: #D4AF37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
    .founder-role { color: #444; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    
    .footer { text-align: center; margin-top: 60px; color: #333; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
    .highlight { color: #ffffff; font-weight: 400; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <!-- Distinct Header Block -->
      <div class="header-box">
        <a href="https://docked.pro" class="logo">DOCKED<span class="dot">.</span>PRO</a>
      </div>
      
      <div class="card">
        <span class="title">Command Deck // Initialization</span>
        
        <h1 class="heading">Sovereign Node <br/> <span class="heading-highlight">Provisioned</span></h1>
        
        <p class="text">
          ${name ? `Greetings ${name},` : 'Greetings,'}
        </p>

        <p class="text">
          Your digital estate has been successfully instantiated on our high-performance global network. 
          You now possess a <span class="highlight">sovereign node</span> managed with surgical precision.
        </p>

        <div class="divider"></div>
        
        <span class="title" style="margin-bottom: 32px;">System Capabilities</span>

        <div class="feature-grid">
          <div class="feature-row">
            <div class="feature-cell">
              <span class="feature-title" style="color: #D4AF37;">Command Deck</span>
              <div class="feature-desc">Real-time telemetry and engagement velocity tracking for your digital presence.</div>
            </div>
            <div class="feature-cell">
              <span class="feature-title" style="color: #1DB954;">Sonic Identity</span>
              <div class="feature-desc">Deep Spotify integration to broadcast your auditory signature and top tracks.</div>
            </div>
          </div>
          <div class="feature-row">
            <div class="feature-cell">
              <span class="feature-title" style="color: #ffffff;">Sovereign Vault</span>
              <div class="feature-desc">Military-grade encryption for your client data and professional assets.</div>
            </div>
            <div class="feature-cell">
              <span class="feature-title" style="color: #ffffff;">Marketplace</span>
              <div class="feature-desc">Premium product showroom with inventory control and high-fidelity presentation.</div>
            </div>
          </div>
        </div>

        <div class="btn-container">
          <a href="https://docked.pro/dashboard" class="btn">Enter Command Deck</a>
        </div>

        <!-- Founder's Note -->
        <div class="founder-note">
           <div class="founder-quote">
            Your identity is an archival asset, not just a profile. We built Docked to give you absolute sovereignty over how you present your life's work to the world. Welcome to the Citadel.
           </div>
           
           <div class="signature-area">
             <!-- Placeholder for signature. Replace src with your actual hosted signature png -->
             <img src="https://res.cloudinary.com/eaglestudiosindia/image/upload/v1768109633/gold-signature_emtmn6.png" alt="Founder Signature" class="signature-img" />
             <div class="founder-name">Rohit Gadekar</div>
             <div class="founder-role">Architect & Founder</div>
           </div>
        </div>
        
      </div>

      <div class="footer">
        Docked  • All Sovereignty Reserved
        <br/><br/>
        House of Eagles
      </div>
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    const data = await resend.emails.send({
      from: 'Docked Pro <team@docked.pro>',
      to: email,
      subject: 'Identity Node Initialized | Docked.Pro',
      html: generateWelcomeEmail(name),
    });

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
