  };
  document.getElementById("set-save").onclick = () => {
    db.notify = {
      inApp: document.getElementById("set-inapp").checked,
      email: document.getElementById("set-email").checked,
      sms: document.getElementById("set-sms").checked
    };
    save();
    toast(db.notify.sms ? "SMS opted in for event invitations, reminders, and changes." : "SMS opted out. Email and in-app only.");
    render();
  };
  document.getElementById("f-regwin").onchange = (e) => {
    document.getElementById("opens-wrap").classList.toggle("hidden", e.target.value !== "opens");
  };
  document.getElementById("q-add").onclick = () => {
    syncDraftQuestions();
    ui.draftQuestions.push({ id: "q" + Date.now(), type: "short", label: "", required: false, options: "" });
    renderQuestionBuilder();
  };
  document.getElementById("q-builder").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-q]");
    if (!btn || !["up", "down", "del"].includes(btn.dataset.q)) return;
    syncDraftQuestions();
    const row = e.target.closest(".q-row");
    if (!row) return;
    const i = Number(row.dataset.qi);
    if (btn.dataset.q === "del") ui.draftQuestions.splice(i, 1);
    if (btn.dataset.q === "up" && i > 0) {
      const [q] = ui.draftQuestions.splice(i, 1);
      ui.draftQuestions.splice(i - 1, 0, q);
    }
    if (btn.dataset.q === "down" && i < ui.draftQuestions.length - 1) {
      const [q] = ui.draftQuestions.splice(i, 1);
      ui.draftQuestions.splice(i + 1, 0, q);
    }
    renderQuestionBuilder();
  });
  document.getElementById("q-builder").addEventListener("change", (e) => {
    if (e.target.dataset.q === "type") { syncDraftQuestions(); renderQuestionBuilder(); }
  });
  document.getElementById("import-x").onclick = () => document.getElementById("import-overlay").classList.add("hidden");
  document.getElementById("import-no").onclick = () => document.getElementById("import-overlay").classList.add("hidden");
  document.getElementById("import-template").onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["name,email,role\nAda Okonkwo,ada@enumverse.com,talent\n"]));
    a.download = "event-import-template.csv";
    a.click();
  };
  document.getElementById("import-pick").onclick = () => document.getElementById("import-file").click();
  document.getElementById("import-file").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean).slice(1);
      const ev = eventBy(ui.route.id);
      if (!lines.length) { ui.importRows = []; renderImportPreview(); toast("No rows to import. Download the template and try again."); return; }
      ui.importRows = lines.map((line) => {
        const [name, email] = line.split(",").map((s) => s.trim());
        if (!email || !email.includes("@")) return { name: name || "", email: email || "", ok: false, note: `${email || "(blank)"} is not a valid email and was not added.` };
        if (regsFor(ev.id).some((r) => person(r.personId)?.email === email)) return { name, email, ok: false, note: "already on the list" };
        return { name, email, ok: true, note: "" };
      });
      renderImportPreview();
    };
    reader.readAsText(f);
  };
  document.getElementById("import-yes").onclick = () => {
    const rows = (ui.importRows || []).filter((r) => r.ok);
    if (!rows.length) { toast("No rows to import. Download the template and try again."); return; }
    const ev = eventBy(ui.route.id);
    const status = document.getElementById("import-as").value;
    let skipped = (ui.importRows || []).filter((r) => !r.ok).length;
    rows.forEach((row) => {
      const p = PEOPLE.find((x) => x.email === row.email) || { id: "p-" + row.email, name: row.name || row.email, email: row.email, initials: (row.name || row.email).slice(0, 2).toUpperCase(), sms: false };
      if (!PEOPLE.find((x) => x.id === p.id)) PEOPLE.push(p);
      db.registrations.push({ id: "r" + Date.now() + row.email, eventId: ev.id, personId: p.id, status, source: "import", ticket: status === "Going" ? ticketCode() : "", paid: true, joined: false });
    });
    save();
    document.getElementById("import-overlay").classList.add("hidden");
    toast(`${rows.length} imported. ${skipped} rows skipped — already on the list or invalid.`);
    render();
  };
  document.getElementById("embed-x").onclick = () => document.getElementById("embed-overlay").classList.add("hidden");
  document.getElementById("embed-copy").onclick = () => {
    const v = document.getElementById("embed-code").value;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(v);
    toast("Embed copied. Reserve in the widget uses the same door.");
  };
  document.getElementById("feedback-x").onclick = () => document.getElementById("feedback-overlay").classList.add("hidden");
  document.getElementById("feedback-no").onclick = () => document.getElementById("feedback-overlay").classList.add("hidden");
  document.getElementById("feedback-yes").onclick = () => {
    const ev = eventBy(ui.pendingReserve?.id || ui.route.id);
    const r = ev && myReg(ev.id);
    if (r) r.feedback = document.getElementById("feedback-rating").value;
    save();
    document.getElementById("feedback-overlay").classList.add("hidden");
    toast("Feedback submitted.");
    render();
  };
  document.getElementById("paywall-x").onclick = () => document.getElementById("paywall-overlay").classList.add("hidden");
  document.getElementById("paywall-no").onclick = () => document.getElementById("paywall-overlay").classList.add("hidden");
  document.getElementById("paywall-yes").onclick = () => {
    const ev = eventBy(ui.pendingReserve?.id || ui.route.id);
    const r = ev && myReg(ev.id);
    if (r) { r.paid = true; r.status = "Going"; save(); }
    document.getElementById("paywall-overlay").classList.add("hidden");
    toast("Paid. You can Join when the room is live.");
    render();
  };

  if (!location.hash) location.hash = "#/edu";
  document.getElementById("invite-x").onclick = () => document.getElementById("invite-overlay").classList.add("hidden");
  document.getElementById("invite-no").onclick = () => document.getElementById("invite-overlay").classList.add("hidden");
  document.getElementById("invite-yes").onclick = () => {
    const emails = document.getElementById("invite-emails").value.split(/[,\s]+/).filter(Boolean);
    const ev = eventBy(ui.route.id);
    emails.forEach((email) => {
      if (!email.includes("@")) { toast(`${email} is not a valid email and was not added.`); return; }
      const p = PEOPLE.find((x) => x.email === email) || { id: "p-" + email, name: email, email, initials: email.slice(0, 2).toUpperCase() };
      if (!PEOPLE.find((x) => x.id === p.id)) PEOPLE.push(p);
      if (regsFor(ev.id).some((r) => person(r.personId).email === email)) return;
      db.registrations.push({ id: "r" + Date.now() + email, eventId: ev.id, personId: p.id, status: ev.approval ? "Invited" : "Invited", source: "invite", ticket: "", paid: true, joined: false });
    });
    save();
    document.getElementById("invite-overlay").classList.add("hidden");
    toast("Invites sent.");
    render();
  };
  document.getElementById("blast-x").onclick = () => document.getElementById("blast-overlay").classList.add("hidden");
  document.getElementById("blast-no").onclick = () => document.getElementById("blast-overlay").classList.add("hidden");
  document.getElementById("blast-yes").onclick = () => {
    const sel = document.getElementById("blast-seg").value || "";
    const n = parseInt(sel.match(/\((\d+)\)/)?.[1] || "0", 10);
    if (!n) { toast("This segment is empty."); return; }
    document.getElementById("blast-overlay").classList.add("hidden");
    toast(`Sent to ${n}. SMS skipped for anyone who opted out.`);
  };

  if (!location.hash) location.hash = "#/edu";
  render();
});
