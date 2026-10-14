eventBus.once("book-rented", ({ title, reader }) => { rented = { title, reader, status: "recorded" }; });
eventBus.emit("book-rented", { title: "Norwegian Wood", reader: "Badlapur Reader" });
log("EVENT_EMITTER", rented);