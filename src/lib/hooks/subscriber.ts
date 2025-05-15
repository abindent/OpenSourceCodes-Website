"use server";
import crypto from "crypto";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
});

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email")?.toString();
  if (!email) throw new Error("Email is required");

  // Create the MD5 hash of the lowercase email:
  const subscriberHash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");

  try {
    // Upsert the contact
    await mailchimp.lists.setListMember(process.env.MAILCHIMP_LIST_ID!, subscriberHash, {
      email_address: email,
      status_if_new: "subscribed", // for new contacts
      status: "subscribed",        // for existing ones
    });
  } catch (err: any) {
    const body = err?.response?.body;
    
    // Handle the “permanently deleted” case specially
    if (body?.title === "Forgotten Email Not Subscribed") {
      console.warn("Mailchimp says this email was permanently deleted:", email);
      throw new Error(
        "This address was permanently deleted from our list. " +
        "Please re-subscribe through our signup form to receive updates."
      );
    }
    console.error("Error subscribing to newsletter:", err);
    throw new Error("Failed to subscribe to newsletter");
  }
}
