import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

interface ResetPasswordProps {
  email: string;
  redirectTo?: string;
}

const generateResetEmail = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Access Credentials</title>
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
    
    .warning-box { background-color: #1a1a1a; border-left: 2px solid #D4AF37; padding: 20px; font-size: 13px; color: #888; line-height: 1.6; margin-top: 40px; }
    
    .footer { text-align: center; margin-top: 60px; color: #333; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
    .founder-note { background-color: #0A0A0A; border: 1px solid #1a1a1a; padding: 32px; margin-top: 40px; position: relative; }
    .founder-quote { font-family: 'Georgia', serif; font-style: italic; color: #aaaaaa; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .signature-area { margin-top: 24px; }
    .signature-img { height: 80px; opacity: 0.8; display: block; margin-bottom: 12px; }
    .founder-name { color: #D4AF37; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
    .founder-role { color: #444; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
    
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      
      <div class="header-box">
        <a href="https://docked.pro" class="logo">DOCKED<span class="dot">.</span>PRO</a>
      </div>
      
      <div class="card">
        <span class="title">Security Protocol // Access Recovery</span>
        
        <h1 class="heading">Access Keys <br/> <span class="heading-highlight">Regeneration</span></h1>
        
        <p class="text">
          Commander,
        </p>

        <p class="text">
          A request to reset the identity access credentials for your sovereign node has been intercepted. 
          To maintain the integrity of your digital estate, authorization is required.
        </p>
        
        <p class="text">
          Click the button below to initiate the key regeneration sequence. This secure link is valid for 1 hour.
        </p>

        <div class="btn-container">
          <a href="${resetLink}" class="btn">Regenerate Access Key</a>
        </div>
        
        <div class="warning-box">
          <strong>Security Notice:</strong> If you did not request this reset protocol, please disregard this transmission. 
          Your node remains secure.
        </div>

        <!-- Founder's Note -->
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #1a1a1a;">
           <div style="font-family: 'Georgia', serif; font-style: italic; color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Security is not a feature, it's the foundation of sovereignty.
           </div>
           
           <div class="signature-area">
           <img src="https://res.cloudinary.com/eaglestudiosindia/image/upload/v1768109633/gold-signature_emtmn6.png" alt="Founder Signature" style="height: 60px; opacity: 0.6; display: block; margin-bottom: 12px;" />
           <div class="founder-name">Rohit Gadekar</div>
             <div class="founder-role">Architect & Founder</div>
             </div>
        </div>
        
      </div>

      <div class="footer">
        Docked • All Sovereignty Reserved
        <br/><br/>
        House of Eagles
      </div>
    </div>
  </div>
</body>
</html>
`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Generate the recovery link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectTo || 'https://docked.pro/auth/update-password'
      }
    });

    if (linkError) {
      throw linkError;
    }

    const { data, error: emailError } = await resend.emails.send({
      from: 'Docked Pro <team@docked.pro>',
      to: email,
      subject: 'Security Protocol: Access Recovery | Docked.Pro',
      html: generateResetEmail(linkData.properties.action_link),
    });

    if (emailError) {
       throw emailError;
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
