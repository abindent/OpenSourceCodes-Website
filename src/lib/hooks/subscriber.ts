'use server';
import crypto from 'crypto';
import mailchimp from '@mailchimp/mailchimp_marketing';


export async function subscribeNewsletter(formData: FormData) {
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY!,
    server: process.env.MAILCHIMP_SERVER_PREFIX!,
  });

  const email = formData.get('email')?.toString();
  if (!email) throw new Error('Email is required');

  // Create the MD5 hash of the lowercase email:
  const subscriberHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex');

  try {
    // Upsert the contact
    await mailchimp.lists.setListMember(process.env.MAILCHIMP_LIST_ID!, subscriberHash, {
      email_address: email,
      status_if_new: 'subscribed',
      status: 'subscribed',
    });
    return {
      success: true,
      error: null,
      data: {
        message: 'Successfully subscribed to the newsletter!',
        email,
      },
    }

  } catch (err: any) {
    const bodyText = err?.response?.text;
    let parsedBody = null;

    try {
      parsedBody = typeof bodyText === 'string' ? JSON.parse(bodyText) : bodyText;
    } catch (e) {
      // If it's not valid JSON, we'll just let parsedBody be null
    }

    if (parsedBody?.title === 'Forgotten Email Not Subscribed') {
      return {
        success: false,
        error: 'This address was permanently deleted from our list. Please re-subscribe through our signup form to receive updates.',
        data: null
      };
    }

    let detailedReason = parsedBody?.detail || err.message;
    if (parsedBody?.errors?.length) {
      const fieldErrors = parsedBody.errors.map((e: any) => `${e.field}: ${e.message}`).join('\n');
      detailedReason += '\n' + fieldErrors;
    }

    return {
      success: false,
      error: `Failed to subscribe.\nReason: ${detailedReason}`,
      data: null,
    };
  }
}