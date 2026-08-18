/**
 * GIVING DETAILS
 * Edit the handles/addresses below — the Give page reads everything from here.
 */
export const GIVING_OPTIONS = [
  { title: "Tithes", body: "Honour God with the first tenth of your increase." },
  { title: "Offerings", body: "Freewill gifts that keep the work of the house going." },
  { title: "Sponsorships", body: "Support specific church projects or events." },
  { title: "Online Donations", body: "Easily give through our secure online platform." },
] as const;

export const GIVING_METHODS = [
  { name: "PayPal", detail: "flcusa.info@gmail.com", note: "Send as friends & family where possible." },
  { name: "Zelle", detail: "flcusa.info@gmail.com", note: "Use your bank app to send to this email." },
  { name: "Cash App", detail: "$FLCUSA", note: "Search the cashtag in the Cash App." },
  { name: "Cheque", detail: 'Write cheques to "Fountain of Life Church USA Inc."', note: "Drop in the offering box or mail to the church address." },
] as const;

export const GIVING_NOTE =
  "We accept card payments through our secure card processor. Simply choose any of the giving options above to donate with a credit or debit card. For more information, please email us at info@flcusa.org. God bless you!";
