function rsvp(status, gameItem) {
  if (status == "in") {
    console.log(`${gameItem.name}: RSVP Accepted`);
  } else {
    console.log(`${gameItem.name}: RSVP Rejected`);
  }
}

export default rsvp;
