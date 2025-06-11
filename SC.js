const fs = require('fs');
const path = require('path');

// Admin configuration (Add your number)
const ADMINS = ["254705101667@s.whatsapp.net"]; // Replace with your number in WhatsApp format

module.exports = {
    config: {
        name: "sc",
        version: "2.0",
        author: "suspender-muller",
        role: 1, // 1=Admin only
        description: "Admin Super Command",
        usage: "{prefix}sc [action] [args]"
    },

    onCommand: async function({ api, event, args }) {
        const sender = event.senderID;
        const isAdmin = ADMINS.includes(sender);

        if (!isAdmin) {
            return api.sendMessage("❌ Access Denied - Admin Only Command", event.threadID);
        }

        const [action, ...params] = args;

        try {
            switch (action) {
                case "ban":
                    // Ban logic example
                    const uid = params[0];
                    const banList = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bans.json')));
                    banList.push(uid);
                    fs.writeFileSync(path.join(__dirname, '../data/bans.json'), JSON.stringify(banList));
                    return api.sendMessage(`✅ User ${uid} banned by ADMIN`, event.threadID);

                case "broadcast":
                    // Broadcast to all groups
                    const message = params.join(" ");
                    const threads = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/threads.json')));
                    threads.forEach(thread => {
                        api.sendMessage(`📢 ADMIN Broadcast:\n\n${message}`, thread.id);
                    });
                    return api.sendMessage(`✅ Broadcast sent to ${threads.length} groups`, event.threadID);

                case "stats":
                    // Bot statistics
                    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'))).length;
                    const groups = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/threads.json'))).length;
                    return api.sendMessage(
                        `📊 BOT STATS:\n\n` +
                        `👥 Users: ${users}\n` +
                        `💬 Groups: ${groups}\n` +
                        `⚡ Version: ${this.config.version}`,
                        event.threadID
                    );

                default:
                    return api.sendMessage(
                        `🛠️ ADMIN PANEL (${sender.split('@')[0]})\n\n` +
                        "Available Commands:\n" +
                        "• sc ban [uid] - Ban user\n" +
                        "• sc broadcast [msg] - Send to all groups\n" +
                        "• sc stats - Show bot statistics",
                        event.threadID
                    );
            }
        } catch (error) {
            console.error("SC Error:", error);
            return api.sendMessage("❌ Command Error - Check logs", event.threadID);
        }
    }
};
