import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackRequest {
  type: string;
  description: string;
  email?: string;
  userId?: string;
  userName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const feedbackData: FeedbackRequest = await req.json();
    
    // Validate required fields
    if (!feedbackData.type || !feedbackData.description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the webhook URL from environment variables
    const webhookUrl = Deno.env.get('FEEDBACK_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('FEEDBACK_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Feedback service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Sanitize input data
    const sanitizedData = {
      type: feedbackData.type.slice(0, 100), // Limit length
      description: feedbackData.description.slice(0, 2000), // Limit length
      email: feedbackData.email?.slice(0, 254), // Email max length
      userId: feedbackData.userId,
      userName: feedbackData.userName?.slice(0, 100),
      timestamp: new Date().toISOString(),
    };

    // Create query parameters for the webhook
    const params = new URLSearchParams();
    Object.entries(sanitizedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    // Send feedback to webhook
    const webhookResponse = await fetch(`${webhookUrl}?${params.toString()}`, {
      method: 'GET',
    });

    if (!webhookResponse.ok) {
      console.error('Webhook request failed:', webhookResponse.status);
      return new Response(
        JSON.stringify({ error: 'Failed to send feedback' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Feedback sent successfully for user:', sanitizedData.userId);

    return new Response(
      JSON.stringify({ success: true, message: 'Feedback sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-feedback function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});